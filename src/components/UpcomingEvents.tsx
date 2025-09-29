'use client';

import { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?status=upcoming&limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  if (loading) {
    return (
      <section className="upcoming-events">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="event-card" style={{ opacity: 0.6 }}>
                <div className="event-date">
                  <span className="day">--</span>
                  <span className="month">---</span>
                </div>
                <div className="event-info">
                  <h3>Loading...</h3>
                  <p>Loading event information...</p>
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
      <section className="upcoming-events">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <p style={{ textAlign: 'center', color: 'red' }}>Error loading events: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="upcoming-events">
      <div className="container">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-grid">
          {events.map((event) => {
            const { day, month } = formatDate(event.date);
            return (
              <div key={event._id} className="event-card">
                <div className="event-date">
                  <span className="day">{day}</span>
                  <span className="month">{month}</span>
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <span className="event-location">{event.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 