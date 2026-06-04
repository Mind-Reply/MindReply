import StaticPage from "@/components/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Privacy"
      title="Privacy Protocol"
      description="MindReply is designed around professional confidentiality, minimal data exposure, and clear separation between public fallback content and private production data."
      sections={[
        { title: "Data Use", body: "Account, booking, and communication data should be used only to provide the requested service and improve the user workspace." },
        { title: "Secrets", body: "Production secrets belong in Vercel, Azure, and GitHub Actions secret stores. They are not committed to the repository." },
        { title: "Retention", body: "Retention and deletion windows should be configured to match the final production policy and jurisdiction." },
      ]}
    />
  );
}
