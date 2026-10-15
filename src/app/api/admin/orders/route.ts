import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { deliveryFullName: { contains: search, mode: 'insensitive' } },
        { deliveryPostcode: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { firstName: true, lastName: true, email: true } },
        statusHistory: { orderBy: { createdAt: 'desc' }, take: 5 },
        payments: true,
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status, trackingNumber, trackingUrl, adminNotes } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status as OrderStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber ? trackingNumber.trim() : null;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl ? trackingUrl.trim() : null;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    if (status) {
      updateData.statusHistory = {
        create: {
          status: status as OrderStatus,
          note: adminNotes || `Status updated to ${status} by admin ${session.user?.email}`,
        },
      };
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: true,
        user: { select: { firstName: true, lastName: true, email: true } },
        statusHistory: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let orderId = searchParams.get('id');

    if (!orderId) {
      try {
        const body = await req.json();
        orderId = body.orderId;
      } catch {}
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Cascade deletes order_items, order_status_history, payment_transactions
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true, message: 'Order and associated records deleted permanently' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
