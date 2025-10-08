import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import LayoutShell from '@/components/LayoutShell'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { defaultSEOConfig } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  ...defaultSEOConfig,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: defaultSEOConfig.title,
    description: defaultSEOConfig.description,
    url: '/',
    siteName: 'Injai Channel',
    images: [
      {
        url: '/image.png',
        width: 1200,
        height: 630,
        alt: 'Injai Channel - Guigui Rap Culture Hub',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSEOConfig.title,
    description: defaultSEOConfig.description,
    images: ['/image.png'],
    creator: '@injai_channel',
    site: '@injai_channel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <AuthProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </AuthProvider>
      </body>
    </html>
  )
} 