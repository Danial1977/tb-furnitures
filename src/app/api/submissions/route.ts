import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SubmissionType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, name, phone, enquiryType, message, metadata } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (type === 'NEWSLETTER') {
      // Check for existing newsletter subscription
      const existing = await prisma.contactSubmission.findFirst({
        where: {
          email: cleanEmail,
          type: SubmissionType.NEWSLETTER,
        },
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed to our newsletter! We've noted your interest.",
          submission: existing,
        });
      }

      const submission = await prisma.contactSubmission.create({
        data: {
          type: SubmissionType.NEWSLETTER,
          email: cleanEmail,
          name: name ? name.trim() : null,
          phone: phone ? phone.trim() : null,
          enquiryType: enquiryType || 'NEWSLETTER_SUBSCRIPTION',
          message: message || 'Newsletter subscriber welcome discount voucher (£50 off first order)',
          status: 'NEW',
          metadata: metadata || null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing! Your £50 welcome voucher has been registered.',
        submission,
      });
    }

    // Default to CONTACT_INQUIRY
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Please include a message for your enquiry.' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        type: SubmissionType.CONTACT_INQUIRY,
        name: name ? name.trim() : 'Website Visitor',
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        enquiryType: enquiryType || 'GENERAL',
        message: message.trim(),
        status: 'NEW',
        metadata: metadata || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! A dedicated interior specialist will contact you shortly.',
      submission,
    });
  } catch (error: any) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'CUSTOMER_SUPPORT'].includes(role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get('type');
    const statusFilter = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (typeFilter && ['NEWSLETTER', 'CONTACT_INQUIRY'].includes(typeFilter)) {
      where.type = typeFilter as SubmissionType;
    }

    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
      ];
    }

    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalCount = await prisma.contactSubmission.count();
    const inquiriesCount = await prisma.contactSubmission.count({
      where: { type: SubmissionType.CONTACT_INQUIRY },
    });
    const newsletterCount = await prisma.contactSubmission.count({
      where: { type: SubmissionType.NEWSLETTER },
    });
    const unreadCount = await prisma.contactSubmission.count({
      where: { status: 'NEW' },
    });

    return NextResponse.json({
      success: true,
      submissions,
      stats: {
        total: totalCount,
        inquiries: inquiriesCount,
        newsletters: newsletterCount,
        unread: unreadCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
