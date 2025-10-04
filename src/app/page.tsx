import Link from 'next/link';
import LatestVideos from '@/components/LatestVideos';
import FeaturedArtists from '@/components/FeaturedArtists';
import UpcomingEvents from '@/components/UpcomingEvents';
import SocialMedia from '@/components/SocialMedia';
import StructuredData from '@/components/StructuredData';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Injai Channel - Guigui Rap Culture Hub',
  description: 'Discover the raw energy, authentic stories, and powerful voices of Guigui rap. From underground hits to mainstream success, we bring you the best of the scene.',
  keywords: ['Guigui rap', 'Guinea rap', 'African hip-hop', 'rap music', 'music videos', 'artists', 'events', 'culture'],
  type: 'website',
});

export default function HomePage() {
  const organizationData = {
    name: 'Injai Channel',
    description: 'The premier destination for Guigui rap culture',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com'}/logo.png`,
    sameAs: [
      'https://www.youtube.com/@injai_channel',
      'https://www.instagram.com/injai_channel',
      'https://twitter.com/injai_channel',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@injai-channel.com',
    },
  };

  const websiteData = {
    name: 'Injai Channel',
    description: 'The premier destination for Guigui rap culture',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <StructuredData type="Organization" data={organizationData} />
      <StructuredData type="WebSite" data={websiteData} />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">INJAI CHANNEL</h1>
          <p className="hero-subtitle">The Premier Hub for Guigui Rap Culture</p>
          <p className="hero-description">
            Discover the raw energy, authentic stories, and powerful voices of Guigui rap. 
            From underground hits to mainstream success, we bring you the best of the scene.
          </p>
          <div className="hero-buttons">
            <Link href="/videos" className="btn btn-primary">Watch Videos</Link>
            <Link href="/artists" className="btn btn-secondary">Meet Artists</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-graphic"></div>
        </div>
      </section>

      {/* Latest Videos Section */}
      <LatestVideos />

      {/* Featured Artists Section */}
      <FeaturedArtists />

      {/* Upcoming Events Section */}
      <UpcomingEvents />

      {/* Social Media Section */}
      <SocialMedia />
    </>
  );
} 