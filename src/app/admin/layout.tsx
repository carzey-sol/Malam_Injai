import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ToastProvider from '@/components/ToastProvider'
import { AuthGate } from './protected.client'

export const metadata: Metadata = {
  title: 'Admin - Injai Channel',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <ToastProvider>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <AdminSidebar />
          <div style={{ flex: 1, background: 'var(--light-gray)' }}>
            <div style={{ padding: '1.5rem' }}>
              {children}
            </div>
          </div>
        </div>
      </ToastProvider>
    </AuthGate>
  )
}


