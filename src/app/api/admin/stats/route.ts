import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      recentOrders,
      lowStockVariants,
      ordersList,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      prisma.productVariant.findMany({
        where: { stockOnHand: { lte: 5 } },
        include: { product: true },
        take: 5,
      }),
      prisma.order.findMany({
        where: { paymentStatus: PaymentStatus.PAID },
        select: { totalAmount: true },
      }),
    ]);

    const totalRevenue = ordersList.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalProducts,
        totalOrders,
        totalCustomers,
        pendingDispatchCount: await prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
      },
      recentOrders,
      lowStockVariants,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
