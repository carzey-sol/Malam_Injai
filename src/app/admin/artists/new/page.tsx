'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '@/components/ImageUpload';

export default function NewArtistPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState<'pioneers' | 'collaborators' | 'emerging'>('pioneers');
  const [image, setImage] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [yearsActive, setYearsActive] = useState(0);
  const [tracksReleased, setTracksReleased] = useState(0);
  const [streams, setStreams] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!loading && !user) router.push('/admin'); }, [user, loading, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/artists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, bio, category, image, thumbnail, stats: { yearsActive, tracksReleased, streams }, featured }) });
      if (!res.ok) throw new Error('Failed to create artist');
      router.push('/admin/dashboard');
    } catch (e: any) { setError(e.message || 'Error'); } finally { setSubmitting(false); }
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Add New Artist</h1>
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
              <label>Name</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e)=>setCategory(e.target.value as any)}>
                <option value="pioneers">Top 10 Now</option>
                <option value="collaborators">Highlights</option>
                <option value="emerging">New Releases</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea rows={4} value={bio} onChange={(e)=>setBio(e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <ImageUpload
                onImageUpload={(url)=>{ setImage(url); setThumbnail(url); }}
                currentImage={image}
                folder="artists/main"
                label="Artist Image"
              />
            </div>
            <div className="form-group">
              <ImageUpload
                onImageUpload={(url)=>{ setThumbnail(url); setImage(url); }}
                currentImage={thumbnail}
                folder="artists/thumbnails"
                label="Thumbnail Image"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Years Active</label>
              <input type="number" value={yearsActive} onChange={(e)=>setYearsActive(parseInt(e.target.value||'0'))} min={0} required />
            </div>
            <div className="form-group">
              <label>Tracks Released</label>
              <input type="number" value={tracksReleased} onChange={(e)=>setTracksReleased(parseInt(e.target.value||'0'))} min={0} required />
            </div>
            <div className="form-group">
              <label>Streams</label>
              <input type="number" value={streams} onChange={(e)=>setStreams(parseInt(e.target.value||'0'))} min={0} required />
            </div>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} />
              Featured Artist
            </label>
          </div>
          <button className="btn btn-primary" disabled={submitting} type="submit">{submitting ? 'Saving...' : 'Save Artist'}</button>
        </form>
      </div>
    </div>
  );
}


