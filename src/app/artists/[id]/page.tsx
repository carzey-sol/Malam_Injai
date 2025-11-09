import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import StructuredData from '@/components/StructuredData';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

interface Artist {
  id: string;
  name: string;
  bio: string;
  category: string;
  image: string;
  thumbnail: string;
  yearsActive: number;
  tracksReleased: number;
  streams: number;
  youtube?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  featured: boolean;
}

interface ArtistDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ArtistDetailPageProps): Promise<Metadata> {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: params.id }
    });

    if (!artist) {
      return generateSEOMetadata({
        title: 'Artist Not Found',
        description: 'The requested artist could not be found.',
        noindex: true,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com';
    const artistUrl = `${siteUrl}/artists/${artist.id}`;

    return generateSEOMetadata({
      title: `${artist.name} - Guigui Rap Artist`,
      description: artist.bio.replace(/<[^>]*>/g, '').substring(0, 160), // Strip HTML and limit length
      keywords: ['Guigui rap', 'rap artist', artist.name, 'music', 'hip-hop', 'African rap'],
      image: artist.image,
      url: artistUrl,
      type: 'profile',
      author: artist.name,
      canonical: artistUrl,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateSEOMetadata({
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.',
      noindex: true,
    });
  }
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  let artist: Artist | null = null;

  try {
    artist = await prisma.artist.findUnique({
      where: { id: params.id }
    });

    if (!artist) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching artist:', error);
    notFound();
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'pioneers': 'Top 10 Now',
      'collaborators': 'Highlights',
      'emerging': 'New Releases'
    };
    return labels[category] || category;
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <StructuredData 
        type="Person" 
        data={{
          name: artist.name,
          description: artist.bio,
          image: artist.image,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com'}/artists/${artist.id}`,
          jobTitle: 'Rap Artist',
          worksFor: {
            '@type': 'Organization',
            name: 'Injai Channel',
          },
          sameAs: [
            artist.youtube,
            artist.instagram,
            artist.twitter,
            artist.tiktok,
          ].filter(Boolean),
          knowsAbout: ['Rap Music', 'Hip-Hop', 'Music Production', 'Guigui Rap'],
        }} 
      />
      
      {/* Artist Header */}
      <section className="artist-header">
        <div className="container">
          <div className="artist-info">
            <div className="artist-image artist-image-detail">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="artist-details">
              <div className="artist-meta">
                <span className="artist-category">{getCategoryLabel(artist.category)}</span>
                {artist.featured && <span className="featured-badge">Featured</span>}
              </div>
              <h1 className="artist-name">{artist.name}</h1>
              <div 
                className="artist-bio"
                dangerouslySetInnerHTML={{ __html: artist.bio }}
              />
              
              {/* Artist Stats */}
              <div className="artist-stats">
                <div className="stat-item">
                  <span className="stat-number">{artist.yearsActive}+</span>
                  <span className="stat-label">Years Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{artist.tracksReleased}+</span>
                  <span className="stat-label">Tracks Released</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{artist.streams.toLocaleString()}+</span>
                  <span className="stat-label">Streams</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="artist-social">
                {artist.youtube && (
                  <Link href={artist.youtube} target="_blank" className="social-link youtube">
                    <i className="fab fa-youtube"></i>
                    <span>YouTube</span>
                  </Link>
                )}
                {artist.instagram && (
                  <Link href={artist.instagram} target="_blank" className="social-link instagram">
                    <i className="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </Link>
                )}
                {artist.twitter && (
                  <Link href={artist.twitter} target="_blank" className="social-link twitter">
                    <i className="fab fa-twitter"></i>
                    <span>Twitter</span>
                  </Link>
                )}
                {artist.tiktok && (
                  <Link href={artist.tiktok} target="_blank" className="social-link tiktok">
                    <i className="fab fa-tiktok"></i>
                    <span>TikTok</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="related-content">
        <div className="container">
          <h2 className="section-title">More Artists</h2>
          <div className="related-links">
            <Link href="/artists" className="btn btn-primary">
              All Artists
            </Link>
            <Link href="/videos" className="btn btn-secondary">
              Videos
            </Link>
            <Link href="/events" className="btn btn-outline">
              Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}