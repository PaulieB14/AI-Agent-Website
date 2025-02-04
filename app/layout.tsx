import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RainbowKitWrapper from './components/RainbowKitWrapper'
import Navbar from './components/Navbar'

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
      <body className={`${inter.className} bg-[#0B0E17] relative`}>
        <div className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-40 -z-10"></div>
        <RainbowKitWrapper>
          <Navbar />
          {children}
        </RainbowKitWrapper>
      </body>
    </html>
  )
}
