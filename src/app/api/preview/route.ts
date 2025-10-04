import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { url, type, id } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let previewData = null;

    // Generate preview based on type
    if (type === 'news' && id) {
      // Get news article data for preview
      const article = await prisma.newsArticle.findUnique({
        where: { id }
      });

      if (article) {
        previewData = {
          title: article.title,
          description: article.excerpt,
          image: article.image,
          url: url,
          type: 'news'
        };
      }
    } else if (type === 'artist' && id) {
      // Get artist data for preview
      const artist = await prisma.artist.findUnique({
        where: { id }
      });

      if (artist) {
        previewData = {
          title: artist.name,
          description: artist.bio,
          image: artist.image,
          url: url,
          type: 'artist'
        };
      }
    } else if (type === 'video' && id) {
      // Get video data for preview
      const video = await prisma.video.findUnique({
        where: { id },
        include: { artist: true }
      });

      if (video) {
        previewData = {
          title: video.title,
          description: video.description,
          image: video.thumbnail,
          url: url,
          type: 'video',
          artist: video.artist.name
        };
      }
    } else if (type === 'event' && id) {
      // Get event data for preview
      const event = await prisma.event.findUnique({
        where: { id }
      });

      if (event) {
        previewData = {
          title: event.title,
          description: event.description,
          image: event.image,
          url: url,
          type: 'event',
          date: event.date
        };
      }
    } else {
      // Generic URL preview - try to fetch meta tags
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          
          // Extract meta tags
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
          const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
          const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
          const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
          const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);

          previewData = {
            title: ogTitleMatch?.[1] || titleMatch?.[1] || 'Link Preview',
            description: ogDescriptionMatch?.[1] || descriptionMatch?.[1] || '',
            image: ogImageMatch?.[1] || twitterImageMatch?.[1] || '',
            url: url,
            type: 'external'
          };
        }
      } catch (error) {
        console.error('Error fetching URL preview:', error);
      }
    }

    if (!previewData) {
      return NextResponse.json({ error: 'Could not generate preview' }, { status: 404 });
    }

    return NextResponse.json(previewData);
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
