import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sections } from '../../../lib/cockpit/data';
import { Card, ItemRow } from '../../../lib/cockpit/ui';

export function generateStaticParams() {
  return sections.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const match = sections.find((s) => s.slug === section);
  return { title: `${match?.title ?? 'Cockpit'} — MindReply Owner Cockpit` };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const match = sections.find((s) => s.slug === section);
  if (!match) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 18, margin: '4px 0 4px' }}>{match.title}</h1>
      <p style={{ color: '#8a91a3', fontSize: 13, margin: '0 0 16px' }}>{match.tagline}</p>
      <Card title={match.title}>
        {match.items.map((item) => (
          <ItemRow key={item.label} {...item} />
        ))}
      </Card>
    </div>
  );
}
