import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings';

export const dynamic = 'force-dynamic';

// GET: Public site settings (e.g. delivery thresholds and rates)
export async function GET() {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: 'delivery_rules' },
    });

    if (record && record.value && typeof record.value === 'object') {
      return NextResponse.json({
        success: true,
        settings: {
          ...DEFAULT_SITE_SETTINGS,
          ...(record.value as any),
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: DEFAULT_SITE_SETTINGS,
    });
  } catch (error: any) {
    console.error('Error fetching site settings:', error);
    // Fallback to default settings so storefront never breaks
    return NextResponse.json({
      success: true,
      settings: DEFAULT_SITE_SETTINGS,
    });
  }
}
