'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import FilterButtons from '@/components/FilterButtons';
import PageHero from '@/components/PageHero';

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

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryStats, setCategoryStats] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    filterArtists();
  }, [artists, searchTerm, filter]);

  const fetchArtists = async () => {
    try {
      const response = await fetch('/api/artists');
      if (!response.ok) {
        throw new Error('Failed to fetch artists');
      }
      const data = await response.json();
      setArtists(data);
      
      // Calculate category statistics
      const stats: { [key: string]: number } = {};
      data.forEach((artist: Artist) => {
        stats[artist.category] = (stats[artist.category] || 0) + 1;
      });
      setCategoryStats(stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterArtists = () => {
    let filtered = artists;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filter !== 'all') {
      filtered = filtered.filter(artist => artist.category === filter);
    }

    setFilteredArtists(filtered);
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Loading artists...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <h1 style={{ textAlign: 'center', color: 'red' }}>Error: {error}</h1>
        </div>
      </div>
    );
  }

  const categoryOptions = [
    { value: 'all', label: `All Artists (${artists.length})` },
    { value: 'pioneers', label: `Top 10 Now (${categoryStats.pioneers || 0})` },
    { value: 'collaborators', label: `Highlights (${categoryStats.collaborators || 0})` },
    { value: 'emerging', label: `New Releases (${categoryStats.emerging || 0})` }
  ];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <PageHero 
        title="Featured Artists" 
        subtitle="Meet the Voices of Guigui Rap"
      />

      {/* Search and Filter Section */}
      <section style={{ padding: '2rem 0', background: 'var(--light-gray)' }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <SearchBar
              placeholder="Search artists..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <FilterButtons
              options={categoryOptions}
              activeFilter={filter}
              onFilterChange={setFilter}
            />
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="artists-grid">
            {filteredArtists.map((artist) => (
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
                  <div 
                    className="artist-bio"
                    dangerouslySetInnerHTML={{ __html: artist.bio }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginTop: '1rem',
                    fontSize: '0.9rem',
                    color: 'var(--dark-gray)'
                  }}>
                    <span>{artist.stats.yearsActive}+ years</span>
                    <span>{artist.stats.tracksReleased}+ tracks</span>
                    <span>{artist.stats.streams.toLocaleString()}+ streams</span>
                  </div>
                  <Link href={`/artists/${artist._id}`} className="btn btn-small" style={{ marginTop: '1rem' }}>
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredArtists.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <h3>No artists found in this category</h3>
              <p>Try selecting a different filter or check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 