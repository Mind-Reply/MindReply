import Link from "next/link";
import { Wand2, FileText, Users, TrendingUp, LogOut } from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ background: "hsl(40 20% 96%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Welcome back, Director</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(220 25% 45%)" }}>Strategist Tier • Subconscious Intelligence Active</p>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border hover:bg-red-50 transition-colors" style={{ borderColor: "hsl(40 25% 88%)", color: "#ef4444" }}>
            <LogOut size={16} /> Sign Out
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Available Credits", value: "42", icon: <Wand2 size={20} /> },
            { label: "Tools Used This Month", value: "18", icon: <FileText size={20} /> },
            { label: "Clarity Score", value: "96/100", icon: <TrendingUp size={20} /> },
            { label: "Network Connections", value: "124", icon: <Users size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white border rounded-xl p-5 shadow-sm" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(220 25% 45%)" }}>{stat.label}</span>
                <span style={{ color: "hsl(43 80% 60%)" }}>{stat.icon}</span>
              </div>
              <p className="font-serif text-3xl font-bold" style={{ color: "hsl(220 55% 20%)" }}>{stat.value}</p>
            </div>
            ))}
        </div>

        {/* Quick Actions */}
        <h2 className="font-serif text-xl font-bold mb-4" style={{ color: "hsl(220 45% 13%)" }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/tools/text-refiner" className="bg-white border rounded-xl p-6 hover:shadow-md transition-all group" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <h3 className="font-semibold mb-1 group-hover:text-[hsl(43_80%_60%)] transition-colors" style={{ color: "hsl(220 45% 13%)" }}>Text Refiner</h3>
            <p className="text-xs" style={{ color: "hsl(220 25% 45%)" }}>Refine casual messages instantly.</p>
          </Link>
          <Link href="/tools/email-polisher" className="bg-white border rounded-xl p-6 hover:shadow-md transition-all group" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <h3 className="font-semibold mb-1 group-hover:text-[hsl(43_80%_60%)] transition-colors" style={{ color: "hsl(220 45% 13%)" }}>Email Polisher</h3>
            <p className="text-xs" style={{ color: "hsl(220 25% 45%)" }}>Transform drafts to executive-grade.</p>
          </Link>
          <Link href="/dashboard/analytics" className="bg-white border rounded-xl p-6 hover:shadow-md transition-all group" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <h3 className="font-semibold mb-1 group-hover:text-[hsl(43_80%_60%)] transition-colors" style={{ color: "hsl(220 45% 13%)" }}>Behavioral Analytics</h3>
            <p className="text-xs" style={{ color: "hsl(220 25% 45%)" }}>View your communication impact scores.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
