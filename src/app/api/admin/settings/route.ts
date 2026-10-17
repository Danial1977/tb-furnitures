import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings';

export const dynamic = 'force-dynamic';

// GET: Admin fetch current site & delivery settings from PostgreSQL database
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const record = await prisma.siteSetting.findUnique({
      where: { key: 'delivery_rules' },
    });

    const settings = record && record.value && typeof record.value === 'object'
      ? { ...DEFAULT_SITE_SETTINGS, ...(record.value as any) }
      : DEFAULT_SITE_SETTINGS;

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST / PUT: Admin save updated settings to PostgreSQL database
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const mergedSettings = {
      freeDeliveryThreshold: Number(body.freeDeliveryThreshold ?? DEFAULT_SITE_SETTINGS.freeDeliveryThreshold),
      standardDeliveryFee: Number(body.standardDeliveryFee ?? DEFAULT_SITE_SETTINGS.standardDeliveryFee),
      twoManDeliveryFee: Number(body.twoManDeliveryFee ?? DEFAULT_SITE_SETTINGS.twoManDeliveryFee),
      twoManFreeThreshold: Number(body.twoManFreeThreshold ?? DEFAULT_SITE_SETTINGS.twoManFreeThreshold),
      currency: body.currency || 'GBP',
      vatRate: Number(body.vatRate ?? 20),
      showroomAddress: body.showroomAddress || DEFAULT_SITE_SETTINGS.showroomAddress,
      supportPhone: body.supportPhone || DEFAULT_SITE_SETTINGS.supportPhone,
    };

    const saved = await prisma.siteSetting.upsert({
      where: { key: 'delivery_rules' },
      create: {
        key: 'delivery_rules',
        value: mergedSettings,
      },
      update: {
        value: mergedSettings,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Site & UK Delivery rules successfully saved to master database.',
      settings: saved.value,
    });
  } catch (error: any) {
    console.error('Admin settings POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
