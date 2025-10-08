'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FilterButtons from '@/components/FilterButtons';
import PageHero from '@/components/PageHero';
import Loader from '@/components/Loader';

interface PlaylistItem { title: string; thumbnail: string; youtubeId: string }
interface FeaturedPlaylist { title?: string; description?: string; playlistUrl?: string; items?: PlaylistItem[] }

interface Video {
  id: string;
  title: string;
  artist: string | { name: string; _id: string };
  description: string;
  youtubeId: string;
  category: string;
  year: string;
  duration: string;
  views: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [artistFilter, setArtistFilter] = useState('all');
  const [featuredPlaylist, setFeaturedPlaylist] = useState<FeaturedPlaylist | null>(null);

  useEffect(() => {
    fetchVideos();
    fetchSettings();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, activeFilter, yearFilter, artistFilter]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = videos;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(video => {
        const artistName = typeof video.artist === 'string' ? video.artist : video.artist?.name || '';
        return video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               video.description.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(video => video.category === activeFilter);
    }

    // Year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter(video => video.year === yearFilter);
    }

    // Artist filter
    if (artistFilter !== 'all') {
      filtered = filtered.filter(video => {
        const artistName = typeof video.artist === 'string' ? video.artist : video.artist?.name || '';
        return artistName.toLowerCase().includes(artistFilter.toLowerCase());
      });
    }

    setFilteredVideos(filtered);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const data = await res.json();
      setFeaturedPlaylist(data?.featuredPlaylist || null);
    } catch {}
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Loader size="large" text="Loading videos..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const categoryOptions = [
    { value: 'all', label: 'All Videos' },
    { value: 'music-videos', label: 'Music Videos' },
    { value: 'interviews', label: 'Interviews' },
    { value: 'live', label: 'Live Performances' },
    { value: 'behind-scenes', label: 'Behind the Scenes' }
  ];

  return (
    <>
      {/* Hero Section */}
      <PageHero 
        title="Video Gallery" 
        subtitle="Latest Guigui Rap Content"
      />

      {/* Search and Filter Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-container">
            <SearchBar
              placeholder="Search videos..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <FilterButtons
              options={categoryOptions}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <div className="filter-dropdowns">
              <select
                className="filter-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
              <select
                className="filter-select"
                value={artistFilter}
                onChange={(e) => setArtistFilter(e.target.value)}
              >
                <option value="all">All Artists</option>
                <option value="mc-flow">MC Flow</option>
                <option value="rhyme-master">Rhyme Master</option>
                <option value="street-poet">Street Poet</option>
                <option value="beat-maker">Beat Maker</option>
                <option value="young-mc">Young MC</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="videos-page">
        <div className="container">
          <div className="videos-grid-large">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    <div className="video-meta">
                      <span className="video-date">{video.year}</span>
                      <span className="video-duration">{video.duration}</span>
                      <span className="video-views">{video.views}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No videos found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          <div className="load-more-container">
            <button className="btn btn-outline">Load More Videos</button>
          </div>
        </div>
      </section>

      {/* Featured Playlist */}
      {featuredPlaylist && (featuredPlaylist.title || (featuredPlaylist.items||[]).length>0) && (
        <section className="featured-playlist">
          <div className="container">
            <h2 className="section-title">Featured Playlist</h2>
            <div className="playlist-content">
              <div className="playlist-info">
                <h3>{featuredPlaylist.title || 'Featured Playlist'}</h3>
                {featuredPlaylist.description && <p>{featuredPlaylist.description}</p>}
                {featuredPlaylist.playlistUrl && (
                  <Link href={featuredPlaylist.playlistUrl} className="btn btn-primary" target="_blank">Watch Playlist</Link>
                )}
              </div>
              <div className="playlist-preview">
                <div className="playlist-videos">
                  {(featuredPlaylist.items||[]).slice(0,4).map((item, idx) => (
                    <div className="playlist-video" key={idx}>
                      <img src={item.thumbnail} alt={item.title} />
                      <span className="video-number">{idx+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
} 