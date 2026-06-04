import StaticPage from "@/components/StaticPage";

export default function SubconsciousPage() {
  return (
    <StaticPage
      eyebrow="Framework"
      title="Subconscious Communication Intelligence"
      description="MindReply examines the implicit signals inside professional language: confidence, warmth, urgency, precision, authority, and trust."
      primaryHref="/agent"
      primaryLabel="Start with MR Agent"
      sections={[
        { title: "Intent Mapping", body: "Every draft is assessed against the outcome it is supposed to create, not only the words it contains." },
        { title: "Tone Calibration", body: "Messages can be adjusted for directness, diplomacy, empathy, and executive concision." },
        { title: "Decision Flow", body: "Communication is structured so recipients understand context, action, owner, and timing." },
      ]}
    />
  );
}
