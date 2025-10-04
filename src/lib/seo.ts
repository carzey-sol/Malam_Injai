import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'music.song' | 'music.album';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    canonical,
    noindex = false,
    nofollow = false
  } = config;

  const siteName = 'Injai Channel';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-default.jpg`;
  const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;

  const robots = [];
  if (noindex) robots.push('noindex');
  if (nofollow) robots.push('nofollow');
  if (!noindex && !nofollow) robots.push('index', 'follow');

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    robots: robots.join(', '),
    alternates: {
      canonical: canonical || fullUrl,
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@injai_channel',
      site: '@injai_channel',
    },
    other: {
      'article:author': author || '',
      'article:section': section || '',
      'article:tag': tags.join(','),
    },
  };

  return metadata;
}

export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Article' | 'Person' | 'Event' | 'MusicGroup' | 'VideoObject', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  // Add common properties
  if (type === 'Organization' || type === 'WebSite') {
    structuredData.url = baseUrl;
    structuredData.logo = `${baseUrl}/logo.png`;
  }

  if (type === 'Article') {
    structuredData.publisher = {
      '@type': 'Organization',
      name: 'Injai Channel',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    };
  }

  return structuredData;
}

export const defaultSEOConfig: SEOConfig = {
  title: 'Injai Channel - Guigui Rap Culture Hub',
  description: 'The premier destination for Guigui rap culture. Discover the latest videos, artists, and events in the Guigui rap scene.',
  keywords: ['Injai Channel', 'Guigui rap', 'hip-hop', 'music', 'artists', 'videos', 'events', 'Guinea rap', 'African rap'],
  image: '/og-default.jpg',
  type: 'website',
};
