import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MindReply Owner Cockpit',
    short_name: 'Owner Cockpit',
    description: 'Private operating layer. Think clearly. Decide fast. Move forward.',
    start_url: '/cockpit',
    display: 'standalone',
    background_color: '#0a0c10',
    theme_color: '#0a0c10',
    icons: [
      {
        src: '/cockpit-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
