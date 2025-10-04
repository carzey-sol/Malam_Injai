import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  try {
    // Dynamic pages - News Articles
    const newsArticles = await prisma.newsArticle.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    });

    const newsPages = newsArticles.map((article) => ({
      url: `${baseUrl}/news/${article.id}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Dynamic pages - Artists
    const artists = await prisma.artist.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    });

    const artistPages = artists.map((artist) => ({
      url: `${baseUrl}/artists/${artist.id}`,
      lastModified: artist.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...newsPages, ...artistPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
