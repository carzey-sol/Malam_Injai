'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Artist {
  _id: string;
  name: string;
  bio: string;
  image: string;
  category: string;
}

export default function FeaturedArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch('/api/artists?featured=true&limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch artists');
      }
      const data = await response.json();
      setArtists(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="featured-artists">
        <div className="container">
          <h2 className="section-title">Featured Artists</h2>
          <div className="artists-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="artist-card" style={{ opacity: 0.6 }}>
                <div className="artist-image" style={{ backgroundColor: '#f0f0f0' }}></div>
                <div className="artist-info">
                  <h3>Loading...</h3>
                  <p>Loading artist information...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-artists">
        <div className="container">
          <h2 className="section-title">Featured Artists</h2>
          <p style={{ textAlign: 'center', color: 'red' }}>Error loading artists: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-artists">
      <div className="container">
        <h2 className="section-title">Featured Artists</h2>
        <div className="artists-grid">
          {artists.map((artist) => (
            <div key={artist._id} className="artist-card">
              <div className="artist-image">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  width={300}
                  height={250}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="artist-info">
                <h3>{artist.name}</h3>
                <p>{artist.bio}</p>
                <Link href={`/artists/${artist._id}`} className="btn btn-small">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 