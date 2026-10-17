import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Public / Guest order tracking lookup by Order Reference (TB-xxxxx or UUID) and Postcode
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, postcode } = body;

    if (!orderNumber || typeof orderNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid order reference number' },
        { status: 400 }
      );
    }

    const cleanRef = orderNumber.trim();
    const cleanPostcode = postcode ? postcode.trim().replace(/\s+/g, '') : null;

    // Search order by orderNumber or id
    const whereConditions: any[] = [
      { orderNumber: { equals: cleanRef, mode: 'insensitive' } },
      { id: { equals: cleanRef } },
    ];

    const matchingOrders = await prisma.order.findMany({
      where: { OR: whereConditions },
      select: {
        id: true,
        orderNumber: true,
        deliveryPostcode: true,
        status: true,
      },
    });

    if (!matchingOrders || matchingOrders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No order found matching this reference number' },
        { status: 404 }
      );
    }

    // If postcode was provided, verify it matches
    if (cleanPostcode) {
      const matched = matchingOrders.find((o) => {
        if (!o.deliveryPostcode) return false;
        const oPost = o.deliveryPostcode.replace(/\s+/g, '').toUpperCase();
        return oPost.includes(cleanPostcode.toUpperCase()) || cleanPostcode.toUpperCase().includes(oPost);
      });

      if (matched) {
        return NextResponse.json({
          success: true,
          orderId: matched.id,
          orderNumber: matched.orderNumber,
          status: matched.status,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Order reference matches, but the delivery postcode does not match our records.',
        },
        { status: 400 }
      );
    }

    // If no postcode provided and only 1 order matched
    const primary = matchingOrders[0];
    return NextResponse.json({
      success: true,
      orderId: primary.id,
      orderNumber: primary.orderNumber,
      status: primary.status,
    });
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error locating order' },
      { status: 500 }
    );
  }
}
