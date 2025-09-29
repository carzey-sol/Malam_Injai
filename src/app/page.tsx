import Link from 'next/link';
import LatestVideos from '@/components/LatestVideos';
import FeaturedArtists from '@/components/FeaturedArtists';
import UpcomingEvents from '@/components/UpcomingEvents';
import SocialMedia from '@/components/SocialMedia';

export default function HomePage() {
  return (
    <>
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