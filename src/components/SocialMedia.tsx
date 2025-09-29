'use client'
import { useEffect, useState } from 'react';

interface SocialLink {
  platform: string;
  label: string;
  url: string;
  iconClass?: string;
}

export default function SocialMedia() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) return;
        const data = await res.json();
        setLinks(Array.isArray(data?.socialLinks) ? data.socialLinks : []);
      } catch {}
    };
    fetchSettings();
  }, []);

  const platformClass = (platform: string) => platform.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="social-media">
      <div className="container">
        <h2 className="section-title">Follow the Movement</h2>
        <div className="social-grid">
          {links.length > 0 ? (
            links.map((link, idx) => (
              <a key={idx} href={link.url} className={`social-card ${platformClass(link.platform)}`} target="_blank" rel="noopener noreferrer">
                <i className={link.iconClass || `fab fa-${platformClass(link.platform)}`}></i>
                <h3>{link.label || link.platform}</h3>
                <p>Connect with us on {link.label || link.platform}</p>
              </a>
            ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%', color: 'var(--dark-gray)' }}>No social links yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}