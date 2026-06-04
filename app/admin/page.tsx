import { Activity, Briefcase, Network, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const stats = [
    { label: "Members", value: "1,240", icon: <Users size={18} /> },
    { label: "Professionals", value: "6", icon: <Briefcase size={18} /> },
    { label: "Open Bookings", value: "18", icon: <Activity size={18} /> },
    { label: "Orchestrator", value: "Ready", icon: <Network size={18} /> },
    { label: "Security", value: "Healthy", icon: <Shield size={18} /> },
  ];

  const members = [
    ["Director Strategist", "director@mind-reply.com", "Strategist"],
    ["Clinical Lead", "clinical@mind-reply.com", "Curator"],
    ["Founder Operator", "founder@mind-reply.com", "Sovereign"],
  ];

  return (
    <main className="pt-24 min-h-screen px-4 pb-16" style={{ background: "hsl(40 33% 97%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(43 80% 45%)" }}>Admin Command</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>MindReply Operations</h1>
            <p className="text-sm mt-2" style={{ color: "hsl(220 25% 45%)" }}>Production overview for content, members, bookings, orchestration, and platform health.</p>
          </div>
          <Link href="/api/health" className="inline-flex px-4 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 55% 20%)" }}>View Health JSON</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => (
            <article key={stat.label} className="bg-white border rounded-xl p-5" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(220 25% 45%)" }}>{stat.label}</span>
                <span style={{ color: "hsl(43 80% 45%)" }}>{stat.icon}</span>
              </div>
              <p className="font-serif text-3xl font-bold" style={{ color: "hsl(220 55% 20%)" }}>{stat.value}</p>
            </article>
          ))}
        </div>

        <div className="bg-white border rounded-xl overflow-hidden" style={{ borderColor: "hsl(40 25% 88%)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <h2 className="font-serif text-xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Recent Member Registrations</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "hsl(40 25% 88%)" }}>
            {members.map(([name, email, tier]) => (
              <div key={email} className="grid grid-cols-1 sm:grid-cols-4 gap-2 px-5 py-4 text-sm">
                <span className="font-medium" style={{ color: "hsl(220 45% 13%)" }}>{name}</span>
                <span style={{ color: "hsl(220 25% 45%)" }}>{email}</span>
                <span style={{ color: "hsl(220 25% 45%)" }}>{tier}</span>
                <span className="sm:text-right" style={{ color: "hsl(43 80% 45%)" }}>Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {[
            { title: "Run Orchestrator", href: "/orchestrator", body: "Coordinate architecture, integration, research, marketing, and deployment agents." },
            { title: "Execute Tasks", href: "/tasks", body: "Run bounded route, health, reasoning, and deployment readiness tasks." },
            { title: "Orchestration API", href: "/api/orchestrate", body: "Inspect the multi-agent orchestration service readiness contract." },
            { title: "Background API", href: "/api/background", body: "Inspect the bounded reasoning-loop execution service readiness contract." },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="bg-white border rounded-xl p-5 hover:shadow-md transition-all" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "hsl(220 45% 13%)" }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>{item.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
