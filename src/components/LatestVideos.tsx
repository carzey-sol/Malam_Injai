'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  description: string;
  uploadDate: string;
  artist: {
    name: string;
  };
}

export default function LatestVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos?featured=true&limit=4');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="latest-videos">
        <div className="container">
          <h2 className="section-title">Latest Videos</h2>
          <div className="videos-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="video-card" style={{ opacity: 0.6 }}>
                <div className="video-thumbnail" style={{ backgroundColor: '#f0f0f0' }}></div>
                <div className="video-info">
                  <h3>Loading...</h3>
                  <p>Loading video information...</p>
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
      <section className="latest-videos">
        <div className="container">
          <h2 className="section-title">Latest Videos</h2>
          <p style={{ textAlign: 'center', color: 'red' }}>Error loading videos: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="latest-videos">
      <div className="container">
        <h2 className="section-title">Latest Videos</h2>
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-thumbnail">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <span className="video-date">
                  {new Date(video.uploadDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="videos-cta">
          <Link href="/videos" className="btn btn-outline">View All Videos</Link>
        </div>
      </div>
    </section>
  );
} 