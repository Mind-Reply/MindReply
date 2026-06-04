import StaticPage from "@/components/StaticPage";

export default function ClinicalPsychologistLexiconPage() {
  return (
    <StaticPage
      eyebrow="Clinical Lexicon"
      title="Clinical Psychologist Lexicon"
      description="Therapeutic communication patterns for care, boundaries, collaboration, and crisis-sensitive correspondence."
      primaryHref="/lexicons"
      primaryLabel="Browse all lexicons"
      sections={[
        { title: "Therapeutic Register", body: "Use observations, consent-based exploration, and precise emotional labeling to keep care conversations safe and grounded." },
        { title: "Boundary Language", body: "Clarify professional scope, response windows, and escalation paths without sounding distant or dismissive." },
        { title: "Crisis Framing", body: "Prioritize immediate safety, reduce ambiguity, and guide the client toward the next stabilizing action." },
      ]}
    />
  );
}
