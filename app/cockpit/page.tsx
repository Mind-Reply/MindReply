import Link from 'next/link';
import { blockers, brands, evidence, revenuePaths } from '../../lib/cockpit/data';
import { Card, ItemRow, colors } from '../../lib/cockpit/ui';

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
      <span style={{ color: colors.muted }}>{label}</span>
      <span style={{ color: tone ?? colors.text, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function CockpitDashboard() {
  return (
    <div>
      <p style={{ color: colors.muted, fontSize: 13, margin: '4px 0 16px' }}>
        One private control surface. No evidence, no credit. No live claim without a verified URL.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        <Card title="Live URLs">
          <Metric label="Verified live" value="0" />
          <Metric label="Preview" value="2" tone={colors.accent} />
          <Metric label="Blocked" value="1" tone={colors.danger} />
          <Link href="/cockpit/live-checks" style={{ color: colors.accent, fontSize: 12 }}>View live checks →</Link>
        </Card>

        <Card title="Blockers">
          <Metric label="Security" value="0" />
          <Metric label="Deploy" value="1" tone={colors.warn} />
          <Metric label="Access" value="2" tone={colors.warn} />
          <Metric label="Domain" value="1" tone={colors.danger} />
          <Link href="/cockpit/blockers" style={{ color: colors.accent, fontSize: 12 }}>View blockers →</Link>
        </Card>

        <Card title="Agent Actions">
          <Metric label="Latest branch" value="agent/owner-cockpit-pwa" />
          <Metric label="Latest PR" value="Owner Cockpit PWA" />
          <Metric label="Latest commit" value="see PR head" />
          <Metric label="Latest workflow run" value="pending CI" />
          <Link href="/cockpit/agents" style={{ color: colors.accent, fontSize: 12 }}>View agent log →</Link>
        </Card>

        <Card title="Evidence Registry">
          {evidence.map((item) => (
            <ItemRow key={item.label} {...item} />
          ))}
          <Link href="/cockpit/evidence" style={{ color: colors.accent, fontSize: 12 }}>Full registry →</Link>
        </Card>

        <Card title="Brand Engine">
          {brands.map((item) => (
            <ItemRow key={item.label} {...item} />
          ))}
        </Card>

        <Card title="Revenue Paths">
          {revenuePaths.map((item) => (
            <ItemRow key={item.label} {...item} />
          ))}
        </Card>

        <Card title="Social / Ads Readiness">
          <Metric label="Draft" value="4" />
          <Metric label="Approved" value="0" />
          <Metric label="Blocked" value="1" tone={colors.danger} />
          <Metric label="Live" value="0" />
          <Link href="/cockpit/social-ads" style={{ color: colors.accent, fontSize: 12 }}>View readiness →</Link>
        </Card>

        <Card title="Legal / IP">
          <Metric label="Copyright footer" value="present" tone="#34d399" />
          <Metric label="License status" value="needs review" tone={colors.warn} />
          <Metric label="Legal review needed" value="YES" tone={colors.warn} />
          <Metric label="Privacy / terms" value="required" tone={colors.warn} />
          <Link href="/cockpit/legal" style={{ color: colors.accent, fontSize: 12 }}>View legal / IP →</Link>
        </Card>
      </div>

      <Card title="Top blockers" style={{ marginTop: 14 }}>
        {blockers.map((item) => (
          <ItemRow key={item.label} {...item} />
        ))}
      </Card>
    </div>
  );
}
