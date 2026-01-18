import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const inter = localFont({
  src: [
    { path: '../public/fonts/inter/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/inter/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/inter/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/inter/Inter-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/inter/Inter-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../public/fonts/inter/Inter-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Grace Yuen | Portfolio',
  description: 'Year 3 Computer Science @ HKU - Developer / Builder / Problem Solver',
  keywords: ['portfolio', 'developer', 'computer science', 'HKU', 'Grace Yuen'],
  authors: [{ name: 'Grace Yuen' }],
  creator: 'Grace Yuen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://graceyuen.dev',
    title: 'Grace Yuen | Portfolio',
    description: 'Year 3 Computer Science @ HKU - Developer / Builder / Problem Solver',
    siteName: 'Grace Yuen Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grace Yuen | Portfolio',
    description: 'Year 3 Computer Science @ HKU - Developer / Builder / Problem Solver',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050511',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-navy antialiased`}>
        {children}
      </body>
    </html>
  )
}
