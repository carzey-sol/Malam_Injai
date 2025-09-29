import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const type = searchParams.get('type');

    // Build query
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const take = limit ? parseInt(limit) : undefined;
    const events = await prisma.event.findMany({
      where: {
        status: status && status !== 'all' ? status : undefined,
        featured: featured === 'true' ? true : undefined,
        type: type && type !== 'all' ? type : undefined,
      },
      orderBy: { date: 'asc' },
      take,
      include: {
        lineup: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const transformed = events.map((e: any) => ({
      id: e.id,
      _id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location,
      type: e.type,
      status: e.status,
      image: e.image,
      featured: e.featured,
      ticketPrice: e.ticketPrice,
      ticketUrl: e.ticketUrl,
      capacity: e.capacity,
      lineup: e.lineup || []
    }));

    return NextResponse.json(transformed);

  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const eventData = await request.json();

    const created = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date ? new Date(eventData.date) : new Date(),
        location: eventData.location,
        type: eventData.type,
        status: eventData.status,
        image: eventData.image,
        featured: !!eventData.featured,
        ticketPrice: eventData.ticketPrice ?? null,
        ticketUrl: eventData.ticketUrl ?? null,
        capacity: eventData.capacity ?? null,
        // lineup will be handled separately if needed
      }
    });
    return NextResponse.json({ message: 'Event created successfully', event: created }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT /api/events - Update event (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, ...eventData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date ? new Date(eventData.date) : new Date(),
        location: eventData.location,
        type: eventData.type,
        status: eventData.status,
        image: eventData.image,
        featured: !!eventData.featured,
        ticketPrice: eventData.ticketPrice ?? null,
        ticketUrl: eventData.ticketUrl ?? null,
        capacity: eventData.capacity ?? null,
      }
    });

    return NextResponse.json({ message: 'Event updated successfully', event: updated }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events - Delete event (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 