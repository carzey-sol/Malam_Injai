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
    <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: 'var(--shadow)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{data.headline || 'Get in Touch'}</h2>
      {data.description && <p style={{ textAlign: 'center', color: 'var(--dark-gray)', marginBottom: '1.5rem' }}>{data.description}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {data.email && (
          <div><i className="fas fa-envelope" style={{ marginRight: 6 }}></i>{data.email}</div>
        )}
        {data.phone && (
          <div><i className="fas fa-phone" style={{ marginRight: 6 }}></i>{data.phone}</div>
        )}
      </div>
      {Array.isArray(data.addressLines) && data.addressLines.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--dark-gray)' }}>
          {data.addressLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}


