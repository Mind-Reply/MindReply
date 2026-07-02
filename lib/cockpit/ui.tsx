import type { CSSProperties, ReactNode } from 'react';
import type { Status } from './data';

export const colors = {
  bg: '#0a0c10',
  panel: '#11141b',
  border: '#1f2430',
  text: '#e8eaf0',
  muted: '#8a91a3',
  accent: '#5eead4',
  warn: '#f59e0b',
  danger: '#f87171',
};

const statusColors: Record<Status, string> = {
  live: '#34d399',
  preview: '#5eead4',
  blocked: '#f87171',
  draft: '#8a91a3',
  approved: '#34d399',
  'needs-review': '#f59e0b',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      style={{
        color: statusColors[status],
        border: `1px solid ${statusColors[status]}`,
        borderRadius: 999,
        padding: '2px 10px',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

export function Card({ title, children, style }: { title: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <section
      style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: 20,
        ...style,
      }}
    >
      <h2 style={{ margin: '0 0 12px', fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.muted }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ItemRow({ label, detail, status }: { label: string; detail: string; status: Status }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        padding: '10px 0',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div>
        <div style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>{label}</div>
        <div style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{detail}</div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
