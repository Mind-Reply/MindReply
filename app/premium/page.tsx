import StaticPage from "@/components/StaticPage";

export default function PremiumPage() {
  return (
    <StaticPage
      eyebrow="Premium Access"
      title="Strategist Membership"
      description="Premium access gives leaders a private communication workspace with advanced tools, full lexicon access, and priority professional support."
      primaryHref="/signup"
      primaryLabel="Request access"
      sections={[
        { title: "Unlimited Tools", body: "Use email polishing, tone calibration, planning, and note clarification across daily workflows." },
        { title: "Professional Network", body: "Book sessions with vetted specialists across psychology, law, finance, operations, and leadership." },
        { title: "Behavioral Analytics", body: "Track clarity, trust, and communication impact from a single dashboard." },
      ]}
    />
  );
}
