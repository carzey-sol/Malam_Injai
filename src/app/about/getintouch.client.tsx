'use client';

import { useEffect, useState } from 'react';

interface GetInTouch { headline?: string; description?: string; email?: string; phone?: string; addressLines?: string[] }

export default function GetInTouchClient() {
  const [data, setData] = useState<GetInTouch | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const json = await res.json();
      setData(json?.getInTouch || null);
    };
    load();
  }, []);

  if (!data) return null;

  return (
    <div className="contact-info">
      <h2 className="contact-title">{data.headline || 'Get in Touch'}</h2>
      {data.description && <p className="contact-subtitle">{data.description}</p>}
      
      <div className="contact-methods">
        {data.email && (
          <div className="contact-method">
            <div className="contact-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="contact-details">
              <h3>Email</h3>
              <p>{data.email}</p>
            </div>
          </div>
        )}
        
        {data.phone && (
          <div className="contact-method">
            <div className="contact-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div className="contact-details">
              <h3>Phone</h3>
              <p>{data.phone}</p>
            </div>
          </div>
        )}
        
        {Array.isArray(data.addressLines) && data.addressLines.length > 0 && (
          <div className="contact-method">
            <div className="contact-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="contact-details">
              <h3>Address</h3>
              {data.addressLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


