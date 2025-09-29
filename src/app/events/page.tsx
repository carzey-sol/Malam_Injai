'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FilterButtons from '@/components/FilterButtons';
import PageHero from '@/components/PageHero';

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
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, activeFilter, searchTerm]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === activeFilter);
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading events...</div>
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
    { value: 'all', label: 'All Events' },
    { value: 'concert', label: 'Concerts' },
    { value: 'festival', label: 'Festivals' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'meet-greet', label: 'Meet & Greet' }
  ];

  return (
    <>
      {/* Hero Section */}
      <PageHero 
        title="Events" 
        subtitle="Live Guigui Rap Experiences"
      />

      {/* Search and Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <SearchBar
              placeholder="Search events..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <FilterButtons
              options={categoryOptions}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="events-page">
        <div className="container">
          <div className="events-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    {event.featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <div className="event-date">
                        <i className="fas fa-calendar"></i>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="event-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{event.location}</span>
                      </div>
                      <div className="event-type">
                        <i className="fas fa-tag"></i>
                        <span>{event.type}</span>
                      </div>
                    </div>
                    <div className="event-status">
                      <span className={`status ${event.status}`}>{event.status}</span>
                      {event.ticketPrice && (
                        <span className="ticket-price">${event.ticketPrice}</span>
                      )}
                    </div>
                    {event.ticketUrl && (
                      <Link href={event.ticketUrl} className="btn btn-primary" target="_blank">
                        Get Tickets
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No events found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Highlights */}
      <section className="upcoming-highlights">
        <div className="container">
          <h2 className="section-title">Upcoming Highlights</h2>
          <div className="highlights-grid">
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Featured Events</h3>
              <p>Don't miss our biggest events of the year featuring top Guigui rap artists.</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <h3>Early Bird Tickets</h3>
              <p>Get exclusive early access to tickets for upcoming concerts and festivals.</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>VIP Experience</h3>
              <p>Upgrade your experience with VIP passes including meet & greet opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="events-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to get notified about new events, ticket releases, and exclusive offers.</p>
            <form className="newsletter-form-large">
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
} 