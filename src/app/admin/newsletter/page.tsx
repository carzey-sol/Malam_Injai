'use client';

import { useState, useEffect } from 'react';

interface NewsletterSubscriber {
  id: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchSubscribers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating subscriber status:', error);
    }
  };

  const sendTestNewsletter = async () => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: 'test',
          subject: 'Test Newsletter',
          content: 'This is a test newsletter to verify the system is working correctly.'
        }),
      });

      if (response.ok) {
        alert('Test newsletter sent successfully!');
      } else {
        alert('Failed to send test newsletter');
      }
    } catch (error) {
      console.error('Error sending test newsletter:', error);
      alert('Error sending test newsletter');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading newsletter subscribers...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Newsletter Management</h1>
        <button 
          className="btn btn-primary"
          onClick={sendTestNewsletter}
        >
          Send Test Newsletter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Total Subscribers</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="admin-card">
          <h3>Active Subscribers</h3>
          <div className="stat-number" style={{ color: 'var(--secondary-color)' }}>{stats.active}</div>
        </div>
        <div className="admin-card">
          <h3>Unsubscribed</h3>
          <div className="stat-number" style={{ color: 'var(--dark-gray)' }}>{stats.unsubscribed}</div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="admin-form">
        <h2>Subscriber List</h2>
        <div className="subscribers-table">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--light-gray)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Source</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Subscribed</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{subscriber.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`status ${subscriber.status}`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{subscriber.source}</td>
                  <td style={{ padding: '1rem' }}>
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={subscriber.status}
                      onChange={(e) => handleStatusChange(subscriber.id, e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        background: 'white'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="unsubscribed">Unsubscribed</option>
                      <option value="bounced">Bounced</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="admin-form">
        <h2>Export Subscribers</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => exportSubscribers('active')}
          >
            Export Active Subscribers
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => exportSubscribers('all')}
          >
            Export All Subscribers
          </button>
        </div>
      </div>
    </div>
  );

  function exportSubscribers(filter: string) {
    const filteredSubscribers = filter === 'all' 
      ? subscribers 
      : subscribers.filter(s => s.status === filter);
    
    const csvContent = [
      ['Email', 'Status', 'Source', 'Subscribed Date'],
      ...filteredSubscribers.map(s => [
        s.email,
        s.status,
        s.source,
        new Date(s.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
