import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LevelUpReads',
  description: 'A gamified reading platform for readers and curators.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
