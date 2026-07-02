import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Owner Login — MindReply Owner Cockpit',
  description: 'Private operating layer. Owner access only.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0c10',
        color: '#e8eaf0',
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#11141b',
          border: '1px solid #1f2430',
          borderRadius: 16,
          padding: 28,
        }}
      >
        <h1 style={{ fontSize: 20, margin: '0 0 4px' }}>MindReply Owner Cockpit</h1>
        <p style={{ color: '#8a91a3', fontSize: 13, margin: '0 0 20px' }}>
          Think clearly. Decide fast. Move forward. Owner access only.
        </p>

        <div
          style={{
            border: '1px solid #f59e0b',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 12,
            color: '#f59e0b',
            marginBottom: 18,
            lineHeight: 1.5,
          }}
        >
          TODO: owner-only authentication is not configured yet. This is a placeholder. Do not treat cockpit routes as
          access-controlled until real auth is wired. See ACCESS_REQUEST.md.
        </div>

        <label style={{ display: 'block', fontSize: 12, color: '#8a91a3', marginBottom: 6 }}>Owner email</label>
        <input
          type="email"
          disabled
          placeholder="Auth provider not configured"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#0d0f14',
            border: '1px solid #1f2430',
            borderRadius: 10,
            padding: '10px 14px',
            color: '#8a91a3',
            fontSize: 14,
            marginBottom: 14,
          }}
        />
        <Link
          href="/cockpit"
          style={{
            display: 'block',
            textAlign: 'center',
            background: '#5eead4',
            color: '#0a0c10',
            borderRadius: 10,
            padding: '11px 0',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Enter cockpit (placeholder)
        </Link>
      </div>
      <p style={{ color: '#8a91a3', fontSize: 12, marginTop: 20 }}>© 2026 MindReply. All rights reserved.</p>
    </div>
  );
}
