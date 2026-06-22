import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MindReply Admin Dashboard',
  description: 'Private secure admin chat interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
