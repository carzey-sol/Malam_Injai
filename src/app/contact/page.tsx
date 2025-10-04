'use client';

import { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';
import ContactInfo from '@/components/ContactInfo';

interface SocialLink {
  platform: string;
  label: string;
  url: string;
  iconClass?: string;
}

interface GetInTouch {
  headline?: string;
  description?: string;
  email?: string;
  phone?: string;
  addressLines?: string[];
}

export default function ContactPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [getInTouch, setGetInTouch] = useState<GetInTouch>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSocialLinks(data.socialLinks || []);
          setGetInTouch(data.getInTouch || {});
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);


  if (loading) {
    return (
      <PageHero 
        title="Contact Us" 
        subtitle="Loading..."
      />
    );
  }

  return (
    <>
      {/* Hero Section */}
      <PageHero 
        title="Contact Us" 
        subtitle={getInTouch.headline || 'Get in Touch with Injai Channel'}
      />

      {/* Contact Content */}
      <section className="contact-page">
        <div className="container">
          <div className="contact-content">
            <ContactInfo 
              getInTouch={getInTouch}
              socialLinks={socialLinks}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How can I submit my music?</h3>
              <p>You can submit your music by sending us an email with your tracks, bio, and social media links. We review all submissions and will get back to you within 2-3 business days.</p>
            </div>
            <div className="faq-item">
              <h3>Do you accept international artists?</h3>
              <p>Yes! We welcome artists from all around the world. Guigui rap culture is global, and we're committed to promoting talent from diverse backgrounds.</p>
            </div>
            <div className="faq-item">
              <h3>How can I book an artist for an event?</h3>
              <p>For booking inquiries, please contact us with details about your event, including date, location, budget, and the type of performance you're looking for.</p>
            </div>
            <div className="faq-item">
              <h3>When will the store be available?</h3>
              <p>Our official merchandise store is coming soon! Subscribe to our newsletter to be notified when it launches and get early access to exclusive items.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 