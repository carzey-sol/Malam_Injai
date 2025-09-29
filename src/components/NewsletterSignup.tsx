'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  className?: string;
  source?: string;
}

export default function NewsletterSignup({ className = '', source = 'website' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe to newsletter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`newsletter-signup ${className}`}>
      <div className="newsletter-content">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter to get the latest news, releases, and updates from the Guigui rap scene.</p>
        
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <div className="newsletter-input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>

        {status === 'success' && (
          <div className="newsletter-success">
            <i className="fas fa-check-circle"></i>
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="newsletter-error">
            <i className="fas fa-exclamation-circle"></i>
            {message}
          </div>
        )}

        <div className="newsletter-benefits">
          <div className="benefit">
            <i className="fas fa-newspaper"></i>
            <span>Latest news & updates</span>
          </div>
          <div className="benefit">
            <i className="fas fa-music"></i>
            <span>New releases & premieres</span>
          </div>
          <div className="benefit">
            <i className="fas fa-calendar"></i>
            <span>Event announcements</span>
          </div>
          <div className="benefit">
            <i className="fas fa-star"></i>
            <span>Exclusive content</span>
          </div>
        </div>
      </div>
    </div>
  );
}
