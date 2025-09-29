'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  status: string;
  image: string;
  featured: boolean;
  ticketPrice?: number;
  ticketUrl?: string;
  capacity?: number;
  lineup: any[];
}

export default function AdminEventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'concert' as 'festival' | 'concert' | 'release' | 'competition' | 'workshop',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
    image: '',
    featured: false,
    ticketPrice: undefined as number | undefined,
    ticketUrl: '',
    capacity: undefined as number | undefined
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
      try {
      setLoadingEvents(true);
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        setEvents(await res.json());
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setLoadingEvents(false); 
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const res = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }
      
      setMessage('Event deleted successfully');
      loadEvents();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local input
      location: event.location,
      type: event.type as 'festival' | 'concert' | 'release' | 'competition' | 'workshop',
      status: event.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
      image: event.image,
      featured: event.featured,
      ticketPrice: event.ticketPrice,
      ticketUrl: event.ticketUrl || '',
      capacity: event.capacity
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          ...formData
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update event');
      }
      
      setMessage('Event updated successfully');
      setEditingEvent(null);
      loadEvents();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      type: 'concert',
      status: 'upcoming',
      image: '',
      featured: false,
      ticketPrice: undefined,
      ticketUrl: '',
      capacity: undefined
    });
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Events</h1>
        <Link href="/admin/events/new" className="btn btn-primary">Add Event</Link>
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

      {/* Edit Event Form */}
      {editingEvent && (
        <div className="admin-form">
          <h2>Edit Event</h2>
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
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
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
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <ImageUpload
                onImageUpload={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
                folder="events"
                label="Event Image"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ticket Price (optional)</label>
                <input
                  type="number"
                  value={typeof formData.ticketPrice === 'number' ? formData.ticketPrice : ''}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  min={0}
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Capacity (optional)</label>
                <input
                  type="number"
                  value={typeof formData.capacity === 'number' ? formData.capacity : ''}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
                  min={1}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Ticket URL (optional)</label>
              <input
                value={formData.ticketUrl}
                onChange={(e) => setFormData({ ...formData, ticketUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured Event
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Update Event</button>
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="admin-form">
        <h2>All Events</h2>
        {loadingEvents ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="no-results">No events found</div>
        ) : (
          <div className="admin-grid">
            {events.map((event) => (
              <div key={event.id} className="admin-card">
                <div className="admin-card-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(event)}
                    title="Edit Event"
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(event.id)}
                    title="Delete Event"
                  >
                    Delete
                  </button>
                </div>
            <div className="event-date">
                  <span className="day">{new Date(event.date).getDate()}</span>
                  <span className="month">{new Date(event.date).toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</span>
            </div>
            <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
                    <p>Location: {event.location}</p>
                    <p>Type: {event.type}</p>
                    <p>Status: {event.status}</p>
                    {event.ticketPrice && <p>Price: ${event.ticketPrice}</p>}
                    {event.capacity && <p>Capacity: {event.capacity}</p>}
                    {event.featured && <span className="status">Featured</span>}
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


