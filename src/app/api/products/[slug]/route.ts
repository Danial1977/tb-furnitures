import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        categories: { include: { category: true } },
        variants: true,
        images: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const formatted = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      primaryImage: product.primaryImage,
      description: product.description,
      brandName: product.brand?.name || 'TB Atelier',
      categoryName: product.categories[0]?.category?.name || 'Furniture',
      categorySlug: product.categories[0]?.category?.slug || 'furniture',
      isLargeItem: product.isLargeItem,
      deliveryTier: product.deliveryTier,
      variants: product.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
        stockOnHand: v.stockOnHand,
      })),
      images: [
        { id: '1', url: product.primaryImage },
        ...product.images.map((img) => ({ id: img.id, url: img.url })),
      ],
      reviews: product.reviews.map((r) => ({
        id: r.id,
        userName: `${r.user?.firstName || 'Verified'} ${r.user?.lastName?.slice(0, 1) || 'B'}.`,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({ success: true, product: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
