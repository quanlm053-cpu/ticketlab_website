import type { Metadata } from 'next'
import { Inter, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const dancingScript = Dancing_Script({ subsets: ["latin", "vietnamese"], variable: "--font-dancing" });

export const metadata: Metadata = {
  title: 'TicketLab - Nền tảng đặt vé sự kiện',
  description: 'Khám phá và đặt vé cho các sự kiện hấp dẫn nhất',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${dancingScript.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
