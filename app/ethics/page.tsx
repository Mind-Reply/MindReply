import StaticPage from "@/components/StaticPage";

export default function EthicsPage() {
  return (
    <StaticPage
      eyebrow="Ethics"
      title="Ethical Framework"
      description="MindReply communication intelligence should increase clarity, respect, consent, and accountability in professional exchanges."
      sections={[
        { title: "Respect", body: "The system should help users communicate with precision without manipulating, coercing, or obscuring intent." },
        { title: "Boundaries", body: "Clinical, legal, and financial contexts require clear scope, escalation paths, and professional responsibility." },
        { title: "Transparency", body: "Users should understand when content is generated, refined, or supported by fallback data." },
      ]}
    />
  );
}
