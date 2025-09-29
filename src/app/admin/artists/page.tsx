'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

interface Artist {
  id: string;
  name: string;
  bio: string;
  category: string;
  image: string;
  thumbnail: string;
  stats: {
    yearsActive: number;
    tracksReleased: number;
    streams: number;
  };
  featured: boolean;
}

export default function AdminArtistsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    category: 'pioneers' as 'pioneers' | 'collaborators' | 'emerging',
    image: '',
    thumbnail: '',
    yearsActive: 0,
    tracksReleased: 0,
    streams: 0,
    featured: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
      try {
      setLoadingArtists(true);
        const res = await fetch('/api/artists');
        if (!res.ok) throw new Error('Failed to fetch artists');
        setArtists(await res.json());
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setLoadingArtists(false); 
    }
  };

  const handleDelete = async (artistId: string) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;
    
    try {
      const res = await fetch(`/api/artists?id=${artistId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete artist');
      }
      
      setMessage('Artist deleted successfully');
      loadArtists();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio,
      category: artist.category as 'pioneers' | 'collaborators' | 'emerging',
      image: artist.image,
      thumbnail: artist.thumbnail,
      yearsActive: artist.stats.yearsActive,
      tracksReleased: artist.stats.tracksReleased,
      streams: artist.stats.streams,
      featured: artist.featured
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtist) return;
    
    try {
      const res = await fetch('/api/artists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingArtist.id,
          name: formData.name,
          bio: formData.bio,
          category: formData.category,
          image: formData.image,
          thumbnail: formData.thumbnail,
          stats: {
            yearsActive: formData.yearsActive,
            tracksReleased: formData.tracksReleased,
            streams: formData.streams
          },
          featured: formData.featured
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update artist');
      }
      
      setMessage('Artist updated successfully');
      setEditingArtist(null);
      loadArtists();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const cancelEdit = () => {
    setEditingArtist(null);
    setFormData({
      name: '',
      bio: '',
      category: 'pioneers',
      image: '',
      thumbnail: '',
      yearsActive: 0,
      tracksReleased: 0,
      streams: 0,
      featured: false
    });
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Artists</h1>
        <Link href="/admin/artists/new" className="btn btn-primary">Add Artist</Link>
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

      {/* Edit Artist Form */}
      {editingArtist && (
        <div className="admin-form">
          <h2>Edit Artist</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="pioneers">Top 10 Now</option>
                  <option value="collaborators">Highlights</option>
                  <option value="emerging">New Releases</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <ImageUpload
                  onImageUpload={(url) => setFormData({ ...formData, image: url, thumbnail: url })}
                  currentImage={formData.image}
                  folder="artists/main"
                  label="Artist Image"
                />
              </div>
              <div className="form-group">
                <ImageUpload
                  onImageUpload={(url) => setFormData({ ...formData, thumbnail: url, image: url })}
                  currentImage={formData.thumbnail}
                  folder="artists/thumbnails"
                  label="Thumbnail Image"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Years Active</label>
                <input
                  type="number"
                  value={formData.yearsActive}
                  onChange={(e) => setFormData({ ...formData, yearsActive: parseInt(e.target.value || '0') })}
                  min={0}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tracks Released</label>
                <input
                  type="number"
                  value={formData.tracksReleased}
                  onChange={(e) => setFormData({ ...formData, tracksReleased: parseInt(e.target.value || '0') })}
                  min={0}
                  required
                />
              </div>
              <div className="form-group">
                <label>Streams</label>
                <input
                  type="number"
                  value={formData.streams}
                  onChange={(e) => setFormData({ ...formData, streams: parseInt(e.target.value || '0') })}
                  min={0}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured Artist
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Update Artist</button>
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Artists List */}
      <div className="admin-form">
        <h2>All Artists</h2>
        {loadingArtists ? (
          <div className="loading">Loading artists...</div>
        ) : artists.length === 0 ? (
          <div className="no-results">No artists found</div>
        ) : (
          <div className="admin-grid">
            {artists.map((artist) => (
              <div key={artist.id} className="admin-card">
                <div className="admin-card-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(artist)}
                    title="Edit Artist"
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(artist.id)}
                    title="Delete Artist"
                  >
                    Delete
                  </button>
                </div>
            <div className="artist-image">
                  <img src={artist.image} alt={artist.name} />
            </div>
            <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <p>{artist.bio}</p>
                  <div style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
                    <p>Category: {artist.category}</p>
                    <p>Years Active: {artist.stats.yearsActive}</p>
                    <p>Tracks: {artist.stats.tracksReleased}</p>
                    <p>Streams: {artist.stats.streams.toLocaleString()}</p>
                    {artist.featured && <span className="status">Featured</span>}
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


