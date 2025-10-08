'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';
import Loader from '@/components/Loader';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  featured: boolean;
  views: number;
  uploadDate: string;
  thumbnail: string;
  artist: {
    name: string;
    _id: string;
  };
}

export default function AdminVideosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeId: '',
    category: 'music' as 'music' | 'interview' | 'live' | 'behind-scenes',
    artistId: '',
    featured: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadVideos();
    loadArtists();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm]);

  const loadVideos = async () => {
    try {
      setLoadingVideos(true);
        const res = await fetch('/api/videos');
        if (!res.ok) throw new Error('Failed to fetch videos');
        setVideos(await res.json());
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setLoadingVideos(false); 
    }
  };

  const loadArtists = async () => {
    try {
      const res = await fetch('/api/artists');
      if (res.ok) {
        const data = await res.json();
        setArtists(data.map((a: any) => ({ id: a.id, name: a.name })));
      }
    } catch (e) {
      console.error('Failed to load artists:', e);
    }
  };

  const filterVideos = () => {
    if (!searchTerm) {
      setFilteredVideos(videos);
      return;
    }

    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const res = await fetch(`/api/videos?id=${videoId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete video');
      }
      
      setMessage('Video deleted successfully');
      loadVideos();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtubeId: video.youtubeId,
      category: video.category as 'music' | 'interview' | 'live' | 'behind-scenes',
      artistId: video.artist._id,
      featured: video.featured
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    
    try {
      const res = await fetch('/api/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingVideo.id,
          title: formData.title,
          description: formData.description,
          youtubeId: formData.youtubeId,
          category: formData.category,
          artistId: formData.artistId,
          featured: formData.featured,
          thumbnail: getYouTubeThumbnail(formData.youtubeId)
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update video');
      }
      
      setMessage('Video updated successfully');
      setEditingVideo(null);
      loadVideos();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      youtubeId: '',
      category: 'music',
      artistId: '',
      featured: false
    });
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Videos</h1>
        <Link href="/admin/videos/new" className="btn btn-primary">Add Video</Link>
      </div>

      {message && (
        <div className="success-message">
          {message}
          <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {/* Edit Video Form */}
      {editingVideo && (
        <div className="admin-form">
          <h2>Edit Video</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="music">Music</option>
                  <option value="interview">Interview</option>
                  <option value="live">Live</option>
                  <option value="behind-scenes">Behind Scenes</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Artist</label>
                <select
                  value={formData.artistId}
                  onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
                  required
                >
                  <option value="">Select artist</option>
                  {artists.map(artist => (
                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>YouTube Video ID</label>
                <input
                  type="text"
                  value={formData.youtubeId}
                  onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                  placeholder="e.g., dQw4w9WgXcQ"
                  required
                />
                {formData.youtubeId && (
                  <div className="youtube-preview">
                    <iframe 
                      src={getYouTubeEmbedUrl(formData.youtubeId)} 
                      frameBorder={0} 
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured Video
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Update Video</button>
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Videos List */}
      <div className="admin-form">
        <div className="admin-list-header">
          <h2>All Videos</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        {loadingVideos ? (
          <div className="admin-loading">
            <Loader size="medium" text="Loading videos..." />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="no-results">No videos found</div>
        ) : (
          <div className="admin-list">
            {filteredVideos.map((video) => (
              <div key={video.id} className="admin-list-item">
                <div className="admin-list-image">
                  <img 
                    src={video.thumbnail || getYouTubeThumbnail(video.youtubeId)} 
                    alt={video.title}
                  />
                </div>
                <div className="admin-list-content">
                  <div className="admin-list-header-content">
                    <h3>{video.title}</h3>
                    <div className="admin-list-actions">
                      <button 
                        className="btn btn-small btn-edit"
                        onClick={() => handleEdit(video)}
                        title="Edit Video"
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-delete"
                        onClick={() => handleDelete(video.id)}
                        title="Delete Video"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="admin-list-excerpt">{video.description}</p>
                  <div className="admin-list-meta">
                    <span>Artist: {video.artist.name}</span>
                    <span>Category: {video.category}</span>
                    <span>Views: {video.views.toLocaleString()}</span>
                    <span>Uploaded: {new Date(video.uploadDate).toLocaleDateString()}</span>
                    {video.featured && <span className="status featured">Featured</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


