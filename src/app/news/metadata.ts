import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'News & Updates - Guigui Rap Scene',
  description: 'Stay updated with the latest news, releases, events, and interviews from the Guigui rap scene. Get exclusive insights and behind-the-scenes content.',
  keywords: ['Guigui rap news', 'music news', 'rap releases', 'music events', 'artist interviews', 'music industry'],
  type: 'website',
});
