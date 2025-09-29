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
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const artist = searchParams.get('artist');

    // Build query
    const query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    if (artist) {
      query.artist = artist;
    }

    const take = limit ? parseInt(limit) : undefined;
    const videos = await prisma.video.findMany({
      where: {
        category: category && category !== 'all' ? category : undefined,
        featured: featured === 'true' ? true : undefined,
        artistId: artist || undefined,
      },
      orderBy: { uploadDate: 'desc' },
      take,
      include: { artist: true },
    });

    // Include both legacy fields used by components and enriched fields
    const transformedVideos = videos.map((video: any) => ({
      id: video.id,
      _id: video.id,
      title: video.title,
      artist: video.artist ? { name: video.artist.name, _id: video.artist.id } : { name: 'Unknown Artist' },
      description: video.description,
      youtubeId: video.youtubeId,
      category: video.category,
      year: new Date(video.uploadDate).getFullYear().toString(),
      duration: '3:25', // Placeholder - you could add this to the model
      views: video.views ? `${video.views.toLocaleString()}+ views` : 'Unknown views',
      uploadDate: video.uploadDate,
      thumbnail: video.thumbnail,
      featured: video.featured
    }));

    return NextResponse.json(transformedVideos);

  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
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

    const videoData = await request.json();

    // Auto metadata: if not provided, try to fetch from YouTube oEmbed
    let resolvedThumbnail = videoData.thumbnail;
    let resolvedUploadDate = videoData.uploadDate;
    let resolvedViews = videoData.views;
    try {
      if (!resolvedThumbnail || !resolvedUploadDate) {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoData.youtubeId}&format=json`);
        if (oembedRes.ok) {
          const ojson: any = await oembedRes.json();
          resolvedThumbnail = resolvedThumbnail || ojson?.thumbnail_url;
        }
      }
    } catch {}

    const created = await prisma.video.create({
      data: {
        title: videoData.title,
        description: videoData.description,
        youtubeId: videoData.youtubeId,
        category: videoData.category,
        uploadDate: resolvedUploadDate ? new Date(resolvedUploadDate) : new Date(),
        thumbnail: resolvedThumbnail,
        featured: !!videoData.featured,
        views: typeof resolvedViews === 'number' ? resolvedViews : 0,
        artistId: videoData.artistId || videoData.artist?._id || videoData.artist?.id || null,
      }
    });

    return NextResponse.json(
      { message: 'Video created successfully', video: created },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

// PUT /api/videos - Update video (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, ...videoData } = await request.json();

    // Auto metadata update for thumbnail if missing
    let resolvedThumbnail = videoData.thumbnail;
    try {
      if (!resolvedThumbnail) {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoData.youtubeId}&format=json`);
        if (oembedRes.ok) {
          const ojson: any = await oembedRes.json();
          resolvedThumbnail = ojson?.thumbnail_url;
        }
      }
    } catch {}

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const updated = await prisma.video.update({
      where: { id },
      data: {
        title: videoData.title,
        description: videoData.description,
        youtubeId: videoData.youtubeId,
        category: videoData.category,
        uploadDate: videoData.uploadDate ? new Date(videoData.uploadDate) : new Date(),
        thumbnail: resolvedThumbnail,
        featured: !!videoData.featured,
        views: typeof videoData.views === 'number' ? videoData.views : 0,
        artistId: videoData.artistId || videoData.artist?._id || videoData.artist?.id || null,
      }
    });

    return NextResponse.json(
      { message: 'Video updated successfully', video: updated },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE /api/videos - Delete video (admin only)
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
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    await prisma.video.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
} 