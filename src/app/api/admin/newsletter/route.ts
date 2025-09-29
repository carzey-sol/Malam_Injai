import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build mode or database is not available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        subscribers: [],
        stats: { total: 0, active: 0, unsubscribed: 0 }
      });
    }

    // Get all newsletter subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Calculate stats
    const stats = {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
    };

    return NextResponse.json({
      subscribers,
      stats
    });

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    
    // Return empty data instead of error during build
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        subscribers: [],
        stats: { total: 0, active: 0, unsubscribed: 0 }
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
