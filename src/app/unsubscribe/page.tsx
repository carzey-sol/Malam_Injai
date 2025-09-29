'use client';

import { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get email from URL parameters on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnsubscribing(true);
    setStatus('idle');

    try {
      const response = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from our newsletter.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to unsubscribe from newsletter');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to unsubscribe from newsletter');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <PageHero 
        title="Unsubscribe" 
        subtitle="We're sorry to see you go"
      />

      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ 
            maxWidth: '500px', 
            margin: '0 auto', 
            background: 'white', 
            padding: '3rem', 
            borderRadius: '15px', 
            boxShadow: 'var(--shadow)',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Unsubscribe from Newsletter
            </h2>
            
            <p style={{ 
              color: 'var(--dark-gray)', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              We're sorry to see you go! If you change your mind, you can always 
              subscribe again from our website.
            </p>

            <form onSubmit={handleUnsubscribe}>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isUnsubscribing}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUnsubscribing}
                style={{ width: '100%' }}
              >
                {isUnsubscribing ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </form>

            {status === 'success' && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#d4edda',
                color: '#155724',
                borderRadius: '8px',
                border: '1px solid #c3e6cb'
              }}>
                <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                {message}
              </div>
            )}

            {status === 'error' && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#f8d7da',
                color: '#721c24',
                borderRadius: '8px',
                border: '1px solid #f5c6cb'
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
                {message}
              </div>
            )}

            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: 'var(--light-gray)', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'var(--dark-gray)'
            }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                <strong>What happens when you unsubscribe?</strong>
              </p>
              <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1.5rem' }}>
                <li>You'll stop receiving our newsletter emails</li>
                <li>Your email will be marked as unsubscribed in our system</li>
                <li>You can resubscribe anytime from our website</li>
                <li>You may still receive important account-related emails</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
