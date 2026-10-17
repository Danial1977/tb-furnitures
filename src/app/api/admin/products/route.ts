import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'ALL') {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    if (status && status !== 'ALL') {
      where.status = status as ProductStatus;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        categories: { include: { category: true } },
        variants: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// BULK IMPORT VIA JSON / CSV ROWS
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided for import.' }, { status: 400 });
    }

    let importedCount = 0;

    for (const row of rows) {
      if (!row.name || !row.sku || !row.price) continue;

      const slug = row.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Upsert product
      const product = await prisma.product.upsert({
        where: { sku: row.sku.trim() },
        update: {
          name: row.name.trim(),
          price: parseFloat(row.price),
          compareAtPrice: row.compareAtPrice ? parseFloat(row.compareAtPrice) : null,
          primaryImage: row.primaryImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
        },
        create: {
          name: row.name.trim(),
          sku: row.sku.trim(),
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
          description: row.description || `${row.name} - Handcrafted British furniture.`,
          price: parseFloat(row.price),
          compareAtPrice: row.compareAtPrice ? parseFloat(row.compareAtPrice) : null,
          primaryImage: row.primaryImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
          status: ProductStatus.ACTIVE,
          variants: {
            create: {
              sku: `${row.sku.trim()}-STD`,
              title: 'Standard Finish',
              stockOnHand: parseInt(row.stock || '15'),
            },
          },
        },
      });

      // If gallery images supplied during creation
      if (Array.isArray(row.galleryImages) && row.galleryImages.length > 0) {
        await prisma.productImage.deleteMany({ where: { productId: product.id } });
        const validGallery = row.galleryImages
          .filter((u: any) => typeof u === 'string' && u.trim().length > 0)
          .map((u: string) => u.trim());
        if (validGallery.length > 0) {
          await prisma.productImage.createMany({
            data: validGallery.map((url: string, idx: number) => ({
              productId: product.id,
              url,
              sortOrder: idx,
            })),
          });
        }
      }

      importedCount++;
    }

    return NextResponse.json({ success: true, importedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE PRODUCT
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      name,
      sku,
      price,
      compareAtPrice,
      status,
      stockOnHand,
      primaryImage,
      description,
      isLargeItem,
      galleryImages,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (sku) updateData.sku = sku.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (compareAtPrice !== undefined) {
      updateData.compareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : null;
    }
    if (status) updateData.status = status;
    if (primaryImage) updateData.primaryImage = primaryImage.trim();
    if (description !== undefined) updateData.description = description;
    if (isLargeItem !== undefined) updateData.isLargeItem = Boolean(isLargeItem);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        variants: true,
        categories: { include: { category: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    // Update gallery images if provided
    if (Array.isArray(galleryImages)) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      const validUrls = galleryImages
        .filter((u: any) => typeof u === 'string' && u.trim().length > 0)
        .map((u: string) => u.trim());

      if (validUrls.length > 0) {
        await prisma.productImage.createMany({
          data: validUrls.map((url: string, idx: number) => ({
            productId: id,
            url,
            sortOrder: idx,
          })),
        });
      }
    }

    if (stockOnHand !== undefined && updated.variants.length > 0) {
      await prisma.productVariant.update({
        where: { id: updated.variants[0].id },
        data: { stockOnHand: parseInt(stockOnHand) },
      });
    }

    // Refetch product with fresh images list
    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        categories: { include: { category: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return NextResponse.json({ success: true, product: finalProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE PRODUCT
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
