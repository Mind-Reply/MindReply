'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/cockpit', label: 'Dashboard' },
  { href: '/cockpit/chat', label: 'Chat' },
  { href: '/cockpit/repos', label: 'Repos' },
  { href: '/cockpit/brands', label: 'Brands' },
  { href: '/cockpit/sites', label: 'Sites' },
  { href: '/cockpit/deployments', label: 'Deployments' },
  { href: '/cockpit/live-checks', label: 'Live Checks' },
  { href: '/cockpit/blockers', label: 'Blockers' },
  { href: '/cockpit/evidence', label: 'Evidence' },
  { href: '/cockpit/agents', label: 'Agents' },
  { href: '/cockpit/workflows', label: 'Workflows' },
  { href: '/cockpit/social-ads', label: 'Social / Ads' },
  { href: '/cockpit/legal', label: 'Legal' },
  { href: '/cockpit/memory', label: 'Memory' },
  { href: '/cockpit/settings', label: 'Settings' },
];

export function CockpitNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        padding: '10px 16px',
        borderBottom: '1px solid #1f2430',
        background: '#0d0f14',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: active ? '#0a0c10' : '#8a91a3',
              background: active ? '#5eead4' : 'transparent',
              border: '1px solid ' + (active ? '#5eead4' : '#1f2430'),
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
