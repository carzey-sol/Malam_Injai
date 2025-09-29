'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const link = (href: string, label: string, icon: string) => (
    <li>
      <Link href={href} className={`nav-link ${pathname === href ? 'active' : ''}`}>
        <i className={icon} style={{ marginRight: 8 }}></i>
        {label}
      </Link>
    </li>
  );

  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      background: 'var(--gradient-primary)',
      color: 'white',
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ margin: 0 }}>Admin</h3>
      </div>
      <nav style={{ padding: '1rem' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {link('/admin/dashboard', 'Dashboard', 'fas fa-home')}
          {link('/admin/artists', 'Artists', 'fas fa-microphone')}
          {link('/admin/videos', 'Videos', 'fas fa-video')}
          {link('/admin/events', 'Events', 'fas fa-calendar')}
          {link('/admin/news', 'News', 'fas fa-newspaper')}
          {link('/admin/users', 'Users', 'fas fa-users')}
          {link('/admin/settings', 'Settings', 'fas fa-cog')}
          <li>
            <button onClick={logout} className="nav-link" style={{ background: 'transparent', border: 0, color: 'inherit', textAlign: 'left', padding: 0, cursor: 'pointer' }}>
              <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}


