import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET: List users with search, role filtering, order count and recent order pills
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const where: any = {};
    if (role && role !== 'ALL') where.role = role as Role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        marketingConsent: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add new customer or staff member from backend
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, role, password, marketingConsent } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and a valid email are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A customer or user with email ${normalizedEmail} already exists.` },
        { status: 409 }
      );
    }

    const rawPassword = password && password.trim().length >= 6 ? password.trim() : 'Customer123!';
    const passwordHash = await bcrypt.hash(rawPassword, 12);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone ? phone.trim() : null,
        role: (role as Role) || Role.CUSTOMER,
        passwordHash,
        isActive: true,
        marketingConsent: !!marketingConsent,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        marketingConsent: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error('Admin users POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user.' }, { status: 500 });
  }
}

// PUT: Edit existing user (Name, Email, Phone, Role, Status, Password reset)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, firstName, lastName, email, phone, role, isActive, password, marketingConsent } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required for editing.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (role !== undefined) updateData.role = role as Role;
    if (isActive !== undefined) updateData.isActive = !!isActive;
    if (marketingConsent !== undefined) updateData.marketingConsent = !!marketingConsent;

    if (email && email.trim().toLowerCase() !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (emailInUse) {
        return NextResponse.json(
          { error: `The email ${email} is already in use by another account.` },
          { status: 409 }
        );
      }
      updateData.email = email.trim().toLowerCase();
    }

    if (password && password.trim().length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password.trim(), 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        marketingConsent: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Admin users PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user.' }, { status: 500 });
  }
}

// DELETE: Safely remove a customer and associated orphaned data
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = (session.user as any)?.id;
    const { searchParams } = new URL(req.url);
    const idFromQuery = searchParams.get('id');

    let id = idFromQuery;
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'User ID is required for deletion.' }, { status: 400 });
    }

    if (id === currentUserId) {
      return NextResponse.json(
        { error: 'You cannot delete your own active administrator account.' },
        { status: 400 }
      );
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found or already deleted.' }, { status: 404 });
    }

    // Transactionally clean up user and any cascading dependencies
    await prisma.$transaction(async (tx) => {
      // 1. Remove cart & items
      await tx.cartItem.deleteMany({ where: { cart: { userId: id } } });
      await tx.cart.deleteMany({ where: { userId: id } });

      // 2. Remove wishlist & items
      await tx.wishlistItem.deleteMany({ where: { wishlist: { userId: id } } });
      await tx.wishlist.deleteMany({ where: { userId: id } });

      // 3. Remove reviews & addresses
      await tx.productReview.deleteMany({ where: { userId: id } });
      await tx.customerAddress.deleteMany({ where: { userId: id } });

      // 4. Clean up any orders if deleting a test customer
      const userOrders = await tx.order.findMany({
        where: { userId: id },
        select: { id: true },
      });
      const orderIds = userOrders.map((o) => o.id);

      if (orderIds.length > 0) {
        await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
        await tx.orderStatusHistory.deleteMany({ where: { orderId: { in: orderIds } } });
        await tx.paymentTransaction.deleteMany({ where: { orderId: { in: orderIds } } });
        await tx.order.deleteMany({ where: { id: { in: orderIds } } });
      }

      // 5. Delete user
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({
      success: true,
      message: `User ${userToDelete.firstName} ${userToDelete.lastName} (${userToDelete.email}) was deleted successfully.`,
    });
  } catch (error: any) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete user.' }, { status: 500 });
  }
}
