import Link from "next/link";
import { FileText, Network, TrendingUp, Users, Wand2 } from "lucide-react";
import DashboardSignOut from "@/components/DashboardSignOut";

export default function UserDashboard() {
  const stats = [
    { label: "Available Credits", value: "42", icon: <Wand2 size={20} /> },
    { label: "Tools Used This Month", value: "18", icon: <FileText size={20} /> },
    { label: "Clarity Score", value: "96/100", icon: <TrendingUp size={20} /> },
    { label: "Network Connections", value: "124", icon: <Users size={20} /> },
  ];

  const actions = [
    { href: "/tools/text-refiner", title: "Text Refiner", body: "Refine casual messages instantly." },
    { href: "/tools/email-polisher", title: "Email Polisher", body: "Transform drafts to executive-grade." },
    { href: "/dashboard/analytics", title: "Behavioral Analytics", body: "View communication impact scores." },
    { href: "/orchestrator", title: "MR-Core Orchestrator", body: "Coordinate autonomous execution agents." },
    { href: "/tasks", title: "Task Runner", body: "Execute bounded production-readiness tasks." },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 px-4" style={{ background: "hsl(40 20% 96%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Welcome back, Director</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(220 25% 45%)" }}>Strategist Tier - Subconscious Intelligence Active</p>
          </div>
          <DashboardSignOut />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <article key={stat.label} className="bg-white border rounded-xl p-5 shadow-sm" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(220 25% 45%)" }}>{stat.label}</span>
                <span style={{ color: "hsl(43 80% 60%)" }}>{stat.icon}</span>
              </div>
              <p className="font-serif text-3xl font-bold" style={{ color: "hsl(220 55% 20%)" }}>{stat.value}</p>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Quick Actions</h2>
          <Network size={18} style={{ color: "hsl(43 80% 45%)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="bg-white border rounded-xl p-6 hover:shadow-md transition-all group" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <h3 className="font-semibold mb-1 group-hover:text-[hsl(43_80%_60%)] transition-colors" style={{ color: "hsl(220 45% 13%)" }}>{action.title}</h3>
              <p className="text-xs" style={{ color: "hsl(220 25% 45%)" }}>{action.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
