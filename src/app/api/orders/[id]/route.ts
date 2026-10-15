import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const userId = (session.user as any).id;
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role);

    const whereClause: any = {
      OR: [{ id }, { orderNumber: id }],
    };

    if (!isAdmin) {
      whereClause.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: { select: { slug: true, primaryImage: true } },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
