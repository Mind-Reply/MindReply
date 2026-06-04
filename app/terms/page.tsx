import StaticPage from "@/components/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage
      eyebrow="Terms"
      title="Terms of Engagement"
      description="MindReply provides communication intelligence tools and professional booking workflows. Specialist advice remains subject to each professional engagement."
      sections={[
        { title: "Platform Scope", body: "The platform supports drafting, refinement, discovery, booking, and workflow organization." },
        { title: "Professional Advice", body: "Legal, clinical, financial, and other specialist guidance must be handled by qualified professionals within the relevant engagement." },
        { title: "Availability", body: "Fallback data keeps the site visible when the database is unavailable; live bookings require configured production data services." },
      ]}
    />
  );
}
