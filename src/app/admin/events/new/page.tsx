'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '@/components/ImageUpload';

export default function NewEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'festival' | 'concert' | 'release' | 'competition' | 'workshop'>('concert');
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [ticketPrice, setTicketPrice] = useState<number | undefined>(undefined);
  const [ticketUrl, setTicketUrl] = useState('');
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!loading && !user) router.push('/admin'); }, [user, loading, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, date, location, type, status, image, featured, ticketPrice, ticketUrl, capacity }) });
      if (!res.ok) throw new Error('Failed to create event');
      router.push('/admin/dashboard');
    } catch (e: any) { setError(e.message || 'Error'); } finally { setSubmitting(false); }
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Add New Event</h1>
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
              <input value={title} onChange={(e)=>setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={type} onChange={(e)=>setType(e.target.value as any)}>
                <option value="festival">Festival</option>
                <option value="concert">Concert</option>
                <option value="release">Release</option>
                <option value="competition">Competition</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date & Time</label>
              <input type="datetime-local" value={date} onChange={(e)=>setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value as any)}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={location} onChange={(e)=>setLocation(e.target.value)} required />
          </div>
          <div className="form-group">
            <ImageUpload
              onImageUpload={setImage}
              currentImage={image}
              folder="events"
              label="Event Image"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ticket Price (optional)</label>
              <input type="number" value={typeof ticketPrice==='number'?ticketPrice:''} onChange={(e)=>setTicketPrice(e.target.value?parseFloat(e.target.value):undefined)} min={0} step="0.01" />
            </div>
            <div className="form-group">
              <label>Capacity (optional)</label>
              <input type="number" value={typeof capacity==='number'?capacity:''} onChange={(e)=>setCapacity(e.target.value?parseInt(e.target.value):undefined)} min={1} />
            </div>
          </div>
          <div className="form-group">
            <label>Ticket URL (optional)</label>
            <input value={ticketUrl} onChange={(e)=>setTicketUrl(e.target.value)} />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} />
              Featured Event
            </label>
          </div>
          <button className="btn btn-primary" disabled={submitting} type="submit">{submitting ? 'Saving...' : 'Save Event'}</button>
        </form>
      </div>
    </div>
  );
}


