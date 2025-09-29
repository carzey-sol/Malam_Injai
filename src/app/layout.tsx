import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import LayoutShell from '@/components/LayoutShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Injai Channel - Guigui Rap Culture Hub',
  description: 'Injai Channel - The premier destination for Guigui rap culture. Discover the latest videos, artists, and events in the Guigui rap scene.',
  keywords: 'Injai Channel, Guigui rap, hip-hop, music, artists, videos, events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </AuthProvider>
      </body>
    </html>
  )
} 