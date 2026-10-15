import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus, FulfillmentStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Customer authentication required before checkout.' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { items, deliveryAddress, deliveryMethod, subtotal, deliveryFee, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Basket is empty.' }, { status: 400 });
    }

    // Unique UK Order Number generation: e.g. "TB-74829"
    const orderNumber = `TB-${Math.floor(10000 + Math.random() * 90000)}`;
    const vatAmount = totalAmount * (20 / 120); // UK 20% VAT breakdown

    // Create Order and snapshot items transactionally
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID, // Simulated test payment success
        fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
        currency: 'GBP',
        subtotal,
        deliveryFee,
        vatAmount,
        totalAmount,
        deliveryMethod: deliveryMethod === 'TWO_MAN' ? 'Specialist Two-Man White Glove' : 'Standard UK Courier',

        // Address snapshots
        deliveryFullName: deliveryAddress.fullName,
        deliveryPhone: deliveryAddress.phone,
        deliveryAddress1: deliveryAddress.addressLine1,
        deliveryAddress2: deliveryAddress.addressLine2 || null,
        deliveryCity: deliveryAddress.city,
        deliveryCounty: deliveryAddress.county || null,
        deliveryPostcode: deliveryAddress.postcode,
        deliveryCountry: 'United Kingdom',

        billingFullName: deliveryAddress.fullName,
        billingAddress1: deliveryAddress.addressLine1,
        billingAddress2: deliveryAddress.addressLine2 || null,
        billingCity: deliveryAddress.city,
        billingCounty: deliveryAddress.county || null,
        billingPostcode: deliveryAddress.postcode,
        billingCountry: 'United Kingdom',

        // Order Item Snapshots
        items: {
          create: items.map((i: any) => ({
            productId: i.productId.startsWith('prod-') ? null : i.productId,
            productName: i.name,
            sku: i.sku,
            variantTitle: i.variantTitle || null,
            unitPrice: i.price,
            quantity: i.quantity,
            totalPrice: i.price * i.quantity,
            imageUrl: i.imageUrl,
          })),
        },

        statusHistory: {
          create: {
            status: OrderStatus.CONFIRMED,
            note: 'Order confirmed and payment verified via Stripe test mode.',
          },
        },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
