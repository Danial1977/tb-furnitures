import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to format product data consistently for the storefront
function formatWishlistItem(item: any) {
  const p = item.product;
  return {
    id: item.id,
    wishlistId: item.wishlistId,
    productId: item.productId,
    createdAt: item.createdAt,
    product: {
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      primaryImage: p.primaryImage,
      images: p.images ? p.images.map((img: any) => img.url) : [],
      brandName: p.brand?.name || null,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
      isLargeItem: p.isLargeItem,
      status: p.status,
    },
  };
}

// 1. GET: Fetch user's persistent wishlist from PostgreSQL database
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        items: [],
        count: 0,
      });
    }

    // Ensure wishlist exists for user
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            product: {
              include: {
                brand: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    }

    const items = wishlist.items.map(formatWishlistItem);

    return NextResponse.json({
      success: true,
      authenticated: true,
      items,
      count: items.length,
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// 2. POST: Add or Toggle Product in User's Database Wishlist (supports single productId or batch productIds)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: 'Please sign in to save items to your account wishlist',
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId, productIds, action = 'toggle' } = body;

    // Get or create user's wishlist record
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
      });
    }

    // A. Batch Sync (e.g. migrating local guest items to user database upon login)
    if (Array.isArray(productIds) && productIds.length > 0) {
      for (const pId of productIds) {
        try {
          const productExists = await prisma.product.findUnique({ where: { id: pId } });
          if (productExists) {
            await prisma.wishlistItem.upsert({
              where: {
                wishlistId_productId: {
                  wishlistId: wishlist.id,
                  productId: pId,
                },
              },
              create: {
                wishlistId: wishlist.id,
                productId: pId,
              },
              update: {},
            });
          }
        } catch (e) {
          // ignore duplicate or non-existent
        }
      }

      const updated = await prisma.wishlist.findUnique({
        where: { id: wishlist.id },
        include: {
          items: {
            orderBy: { createdAt: 'desc' },
            include: { product: { include: { brand: true, images: true } } },
          },
        },
      });

      const formatted = (updated?.items || []).map(formatWishlistItem);
      return NextResponse.json({
        success: true,
        authenticated: true,
        items: formatted,
        count: formatted.length,
      });
    }

    // B. Single Product Toggle or Add
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    let isSaved = false;

    if (action === 'remove' || (action === 'toggle' && existing)) {
      if (existing) {
        await prisma.wishlistItem.delete({
          where: { id: existing.id },
        });
      }
      isSaved = false;
    } else {
      if (!existing) {
        await prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId,
          },
        });
      }
      isSaved = true;
    }

    // Fetch updated count
    const totalCount = await prisma.wishlistItem.count({
      where: { wishlistId: wishlist.id },
    });

    return NextResponse.json({
      success: true,
      authenticated: true,
      isSaved,
      count: totalCount,
      message: isSaved ? 'Saved to your wishlist' : 'Removed from your wishlist',
    });
  } catch (error: any) {
    console.error('Error modifying wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}

// 3. DELETE: Remove single item or clear entire wishlist
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const clearAll = searchParams.get('all') === 'true';

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return NextResponse.json({ success: true, count: 0 });
    }

    if (clearAll) {
      await prisma.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id },
      });
      return NextResponse.json({ success: true, count: 0, message: 'Wishlist cleared' });
    }

    if (productId) {
      await prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId,
        },
      });
    }

    const remainingCount = await prisma.wishlistItem.count({
      where: { wishlistId: wishlist.id },
    });

    return NextResponse.json({
      success: true,
      count: remainingCount,
      message: 'Item removed from wishlist',
    });
  } catch (error: any) {
    console.error('Error deleting from wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete wishlist item' },
      { status: 500 }
    );
  }
}
