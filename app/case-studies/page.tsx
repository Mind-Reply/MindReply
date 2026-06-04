import StaticPage from "@/components/StaticPage";

export default function CaseStudiesPage() {
  return (
    <StaticPage
      eyebrow="Case Studies"
      title="Communication Intelligence Outcomes"
      description="Examples of how MindReply improves client trust, internal clarity, and leadership communication."
      primaryHref="/tools"
      primaryLabel="Use the tools"
      sections={[
        { title: "Legal Firm", body: "Client-facing correspondence was restructured for clarity, empathy, and risk-aware language, improving satisfaction and referral quality." },
        { title: "Founder Team", body: "Leadership updates were converted into concise decision memos with owners, dates, and explicit tradeoffs." },
        { title: "Clinical Practice", body: "Care communications were standardized around safe boundaries, consent language, and next-step clarity." },
      ]}
    />
  );
}
