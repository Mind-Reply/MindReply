import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CockpitNav } from './CockpitNav';

export const metadata: Metadata = {
  title: 'MindReply Owner Cockpit',
  description: 'Private operating layer. Think clearly. Decide fast. Move forward.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0a0c10',
};

export default function CockpitLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0c10',
        color: '#e8eaf0',
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          borderBottom: '1px solid #1f2430',
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.04em' }}>MindReply Owner Cockpit</div>
          <div style={{ fontSize: 12, color: '#8a91a3' }}>Think clearly. Decide fast. Move forward.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              color: '#f59e0b',
              border: '1px solid #f59e0b',
              borderRadius: 999,
              padding: '3px 10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
            title="TODO: wire real owner-only auth. This surface is not yet access-controlled."
          >
            Auth: placeholder
          </span>
          <Link href="/login" style={{ color: '#5eead4', fontSize: 13, textDecoration: 'none' }}>
            Owner login
          </Link>
        </div>
      </header>
      <CockpitNav />
      <main style={{ flex: 1, padding: 16, maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {children}
      </main>
      <footer style={{ padding: '16px', borderTop: '1px solid #1f2430', color: '#8a91a3', fontSize: 12, textAlign: 'center' }}>
        © 2026 MindReply. All rights reserved. Private operating layer — evidence before claims.
      </footer>
    </div>
  );
}
