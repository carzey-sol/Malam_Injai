'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface TeamMember { name: string; role: string; image?: string; bio?: string }

export default function TeamClient() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const data = await res.json();
      setTeam(data?.team || []);
    };
    load();
  }, []);

  if (!team.length) return null;

  return (
    <>
      <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--primary-color)' }}>Our Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        {team.map((m, i) => (
          <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '10px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
            {m.image ? (
              <Image
                src={m.image}
                alt={m.name}
                width={120}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '50%', marginBottom: '1rem' }}
              />
            ) : (
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--light-gray)', margin: '0 auto 1rem' }}></div>
            )}
            <h3>{m.name}</h3>
            <p style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>{m.role}</p>
            {m.bio && <p style={{ color: 'var(--dark-gray)' }}>{m.bio}</p>}
          </div>
        ))}
      </div>
    </>
  );
}


