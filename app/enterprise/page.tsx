import StaticPage from "@/components/StaticPage";

export default function EnterprisePage() {
  return (
    <StaticPage
      eyebrow="Enterprise"
      title="Enterprise Communication Intelligence"
      description="MindReply supports teams that need consistent, high-trust language across clients, employees, partners, and stakeholders."
      primaryHref="/signup"
      primaryLabel="Start enterprise request"
      sections={[
        { title: "Team Lexicons", body: "Create shared language standards for departments, roles, policies, and recurring communication patterns." },
        { title: "Governed Tools", body: "Give teams controlled access to writing tools while preserving tone, compliance, and brand guidelines." },
        { title: "Operational Reporting", body: "Monitor usage, clarity trends, and support needs through admin and analytics views." },
      ]}
    />
  );
}
