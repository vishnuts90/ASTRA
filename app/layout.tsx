import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ASTRA - Audio-to-Text Real-Time Application',
  description: 'Convert audio files to text with advanced multilingual capabilities. Live recording, manual transcription control, and intelligent language detection.',
  keywords: 'audio transcription, speech to text, multilingual, real-time, AI transcription',
  authors: [{ name: 'ASTRA Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'ASTRA - Audio-to-Text Real-Time Application',
    description: 'Convert audio files to text with advanced multilingual capabilities',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASTRA - Audio-to-Text Real-Time Application',
    description: 'Convert audio files to text with advanced multilingual capabilities',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {children}
          </div>
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#20C997',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#FF6B35',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
