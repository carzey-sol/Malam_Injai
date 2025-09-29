'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Artist {
  _id: string;
  name: string;
  bio: string;
  category: string;
  image: string;
  stats: {
    yearsActive: number;
    tracksReleased: number;
    streams: number;
  };
}

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchArtist(params.id as string);
    }
  }, [params.id]);

  const fetchArtist = async (id: string) => {
    try {
      const response = await fetch(`/api/artists/${id}`);
      if (!response.ok) {
        throw new Error('Artist not found');
      }
      const data = await response.json();
      setArtist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artist');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'pioneers': return 'Top 10 Now';
      case 'collaborators': return 'Highlights';
      case 'emerging': return 'New Releases';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <div className="loading">Loading artist...</div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <div className="error">Error: {error || 'Artist not found'}</div>
          <Link href="/artists" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Artists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <div className="artist-header">
            <div className="artist-image-large">
              <Image
                src={artist.image}
                alt={artist.name}
                width={400}
                height={400}
                style={{ objectFit: 'cover', borderRadius: '10px' }}
              />
            </div>
            <div className="artist-details">
              <h1 className="page-title">{artist.name}</h1>
              <div className="artist-category">
                <span className="category-badge">{getCategoryLabel(artist.category)}</span>
              </div>
              <div className="artist-stats">
                <div className="stat-item">
                  <span className="stat-number">{artist.stats.yearsActive}+</span>
                  <span className="stat-label">Years Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{artist.stats.tracksReleased}+</span>
                  <span className="stat-label">Tracks Released</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{artist.stats.streams.toLocaleString()}+</span>
                  <span className="stat-label">Streams</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="artist-bio-section">
        <div className="container">
          <div className="bio-content">
            <h2>About {artist.name}</h2>
            <div className="bio-text">
              {showFullBio ? (
                <p>{artist.bio}</p>
              ) : (
                <p>{artist.bio.length > 200 ? `${artist.bio.substring(0, 200)}...` : artist.bio}</p>
              )}
              {artist.bio.length > 200 && (
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowFullBio(!showFullBio)}
                  style={{ marginTop: '1rem' }}
                >
                  {showFullBio ? 'Show Less' : 'Learn More'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="related-content">
        <div className="container">
          <h2 className="section-title">Related Content</h2>
          <div className="related-links">
            <Link href="/videos" className="btn btn-primary">
              Watch Videos
            </Link>
            <Link href="/events" className="btn btn-secondary">
              Upcoming Events
            </Link>
            <Link href="/artists" className="btn btn-outline">
              All Artists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
