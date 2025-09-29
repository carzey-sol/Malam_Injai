import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: params.id }
    });
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: artist.id,
      name: artist.name,
      bio: artist.bio,
      category: artist.category,
      image: artist.image,
      stats: {
        yearsActive: artist.yearsActive,
        tracksReleased: artist.tracksReleased,
        streams: artist.streams,
      },
      featured: artist.featured,
    });
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist' },
      { status: 500 }
    );
  }
}
