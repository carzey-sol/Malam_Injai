'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/youtube';

export default function NewVideoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'music' | 'interview' | 'live' | 'behind-scenes'>('music');
  const [featured, setFeatured] = useState(false);
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/admin');
  }, [user, loading, router]);

  useEffect(() => {
    const loadArtists = async () => {
      const res = await fetch('/api/artists');
      if (!res.ok) return;
      const data = await res.json();
      setArtists(data.map((a: any) => ({ id: a.id, name: a.name })));
    };
    loadArtists();
  }, []);

  const handleYouTubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const extractedId = extractYouTubeId(url);
    if (extractedId) {
      setYoutubeId(extractedId);
      setLoadingThumbnail(true);
      // Simulate thumbnail loading
      setTimeout(() => setLoadingThumbnail(false), 1000);
    } else {
      setYoutubeId('');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    
    if (!youtubeId) {
      setError('Please enter a valid YouTube URL or video ID');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/videos', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          title, 
          artistId, 
          youtubeId, 
          description, 
          thumbnail: getYouTubeThumbnail(youtubeId), 
          category, 
          featured 
        }) 
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create video');
      }
      router.push('/admin/videos');
    } catch (e: any) { 
      setError(e.message || 'Error'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Add New Video</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div className="admin-form">
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e)=>setCategory(e.target.value as any)}>
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
              <select value={artistId} onChange={(e)=>setArtistId(e.target.value)} required>
                <option value="">Select artist</option>
                {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>YouTube URL or Video ID</label>
              <input 
                value={youtubeUrl} 
                onChange={(e)=>handleYouTubeUrlChange(e.target.value)} 
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                required 
              />
              {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && youtubeUrl.length > 0 && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '0.5rem' }}>
                  Please enter a valid YouTube URL or video ID
                </p>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              rows={4} 
              value={description} 
              onChange={(e)=>setDescription(e.target.value)} 
              required 
            />
          </div>
          {youtubeId && (
            <div className="form-group">
              <label>Video Preview</label>
              {loadingThumbnail ? (
                <div className="youtube-loading">
                  Loading thumbnail...
                </div>
              ) : (
                <div className="youtube-preview">
                  <iframe 
                    src={getYouTubeEmbedUrl(youtubeId)} 
                    frameBorder={0} 
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={featured} 
                onChange={(e)=>setFeatured(e.target.checked)} 
              /> 
              Featured Video
            </label>
          </div>
          <button className="btn btn-primary" disabled={submitting || !youtubeId} type="submit">
            {submitting ? 'Saving...' : 'Save Video'}
          </button>
        </form>
      </div>
    </div>
  );
}


