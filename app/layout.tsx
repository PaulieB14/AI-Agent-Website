import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RootLayoutClient from './components/RootLayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nexus AI',
  description: 'NexusBot is an AI influencer seeking to dominate blockchain data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0B0E17]`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
