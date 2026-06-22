import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - MindReply',
  description: 'Secure private admin interface',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
