import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Featured Artists - Guigui Rap Artists',
  description: 'Meet the talented artists of the Guigui rap scene. Discover their stories, music, and achievements. From pioneers to emerging talents.',
  keywords: ['Guigui rap artists', 'rap musicians', 'music artists', 'hip-hop artists', 'African rappers', 'music talent'],
  type: 'website',
});
