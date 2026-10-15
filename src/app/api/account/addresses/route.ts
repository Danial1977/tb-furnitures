import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET SAVED ADDRESSES
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const addresses = await prisma.customerAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CREATE NEW ADDRESS
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { fullName, addressLine1, addressLine2, city, county, postcode, phone, isDefault } = body;

    if (!fullName || !addressLine1 || !city || !postcode) {
      return NextResponse.json({ error: 'Full name, address line 1, city, and postcode are required' }, { status: 400 });
    }

    // If setting as default, unset other default addresses for this user
    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.customerAddress.create({
      data: {
        userId,
        fullName: fullName.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2 ? addressLine2.trim() : null,
        city: city.trim(),
        county: county ? county.trim() : null,
        postcode: postcode.trim().toUpperCase(),
        phone: phone ? phone.trim() : null,
        country: 'United Kingdom',
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE ADDRESS
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { id, fullName, addressLine1, addressLine2, city, county, postcode, phone, isDefault } = body;

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.customerAddress.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.customerAddress.update({
      where: { id },
      data: {
        fullName: fullName ? fullName.trim() : undefined,
        addressLine1: addressLine1 ? addressLine1.trim() : undefined,
        addressLine2: addressLine2 !== undefined ? (addressLine2 ? addressLine2.trim() : null) : undefined,
        city: city ? city.trim() : undefined,
        county: county !== undefined ? (county ? county.trim() : null) : undefined,
        postcode: postcode ? postcode.trim().toUpperCase() : undefined,
        phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
        isDefault: isDefault !== undefined ? Boolean(isDefault) : undefined,
      },
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE ADDRESS
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const existing = await prisma.customerAddress.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    await prisma.customerAddress.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Address deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
