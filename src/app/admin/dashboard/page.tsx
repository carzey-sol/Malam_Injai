'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '10px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'var(--shadow)', background: 'white' }}>
          <div style={{ width: '100%', height: 280, backgroundImage: 'url(/image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
            <img src="https://api.dicebear.com/7.x/shapes/png?seed=admin" alt="Channel Avatar" style={{ width: 64, height: 64, borderRadius: '50%', marginTop: -32, border: '3px solid white', background: '#fff' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 22 }}>Welcome, {user.username}</h1>
              <a href="https://www.youtube.com/channel/UCeWC0W87iAjh-qjKE7WA_xA" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Visit our YouTube channel</a>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <i className="fas fa-microphone" style={{ marginRight: '0.5rem' }}></i>
              Artists
            </h2>
            <p style={{ color: 'var(--dark-gray)', marginBottom: '1.5rem' }}>Manage artist profiles, bios, and social links.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/admin/artists" className="btn btn-primary">View All</Link>
              <Link href="/admin/artists/new" className="btn btn-outline">Add New</Link>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <i className="fas fa-video" style={{ marginRight: '0.5rem' }}></i>
              Videos
            </h2>
            <p style={{ color: 'var(--dark-gray)', marginBottom: '1.5rem' }}>Upload and manage video content.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/admin/videos" className="btn btn-primary">View All</Link>
              <Link href="/admin/videos/new" className="btn btn-outline">Add New</Link>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <i className="fas fa-calendar" style={{ marginRight: '0.5rem' }}></i>
              Events
            </h2>
            <p style={{ color: 'var(--dark-gray)', marginBottom: '1.5rem' }}>Create and manage upcoming events.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/admin/events" className="btn btn-primary">View All</Link>
              <Link href="/admin/events/new" className="btn btn-outline">Add New</Link>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
              <i className="fas fa-cog" style={{ marginRight: '0.5rem' }}></i>
              Site Settings
            </h2>
            <p style={{ color: 'var(--dark-gray)', marginBottom: '1.5rem' }}>Manage social links, team and contact content.</p>
            <Link href="/admin/settings" className="btn btn-primary">Open Settings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


