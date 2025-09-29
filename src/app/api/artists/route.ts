import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// GET /api/artists
export async function GET(request: NextRequest) {
  try {
    // Check if we're in build mode or database is not available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const take = limit ? parseInt(limit) : undefined;

    const artists = await prisma.artist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json(
      artists.map((a) => ({
        id: a.id,
        _id: a.id,
        name: a.name,
        bio: a.bio,
        category: a.category,
        image: a.image,
        thumbnail: a.thumbnail,
        stats: {
          yearsActive: a.yearsActive,
          tracksReleased: a.tracksReleased,
          streams: a.streams,
        },
        featured: a.featured,
      }))
    );
  } catch (error) {
    console.error('Error fetching artists:', error);
    
    // Return empty array during build instead of error
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

// POST /api/artists
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const artistData = await request.json();

    // Ensure thumbnail mirrors image if not provided
    const created = await prisma.artist.create({
      data: {
        name: artistData.name,
        bio: artistData.bio,
        category: artistData.category,
        image: artistData.image,
        thumbnail: artistData.thumbnail || artistData.image,
        yearsActive: artistData.stats?.yearsActive ?? 0,
        tracksReleased: artistData.stats?.tracksReleased ?? 0,
        streams: artistData.stats?.streams ?? 0,
        youtube: artistData.socialLinks?.youtube ?? null,
        instagram: artistData.socialLinks?.instagram ?? null,
        twitter: artistData.socialLinks?.twitter ?? null,
        tiktok: artistData.socialLinks?.tiktok ?? null,
        featured: !!artistData.featured,
      },
    });

    return NextResponse.json(
      { message: 'Artist created successfully', artist: created },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating artist:', error);
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}

// PUT /api/artists - Update artist (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, ...artistData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    const updated = await prisma.artist.update({
      where: { id },
      data: {
        name: artistData.name,
        bio: artistData.bio,
        category: artistData.category,
        image: artistData.image,
        thumbnail: artistData.thumbnail || artistData.image,
        yearsActive: artistData.stats?.yearsActive ?? 0,
        tracksReleased: artistData.stats?.tracksReleased ?? 0,
        streams: artistData.stats?.streams ?? 0,
        youtube: artistData.socialLinks?.youtube ?? null,
        instagram: artistData.socialLinks?.instagram ?? null,
        twitter: artistData.socialLinks?.twitter ?? null,
        tiktok: artistData.socialLinks?.tiktok ?? null,
        featured: !!artistData.featured,
      },
    });

    return NextResponse.json(
      { message: 'Artist updated successfully', artist: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating artist:', error);
    return NextResponse.json(
      { error: 'Failed to update artist' },
      { status: 500 }
    );
  }
}

// DELETE /api/artists - Delete artist (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    await prisma.artist.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Artist deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: 'Failed to delete artist' },
      { status: 500 }
    );
  }
}
