import { Users, Briefcase, Activity, Shield } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ background: "hsl(220 55% 20%)" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "hsl(43 70% 88%)" }}>Admin Command</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(248,245,240,0.6)" }}>Platform oversight and system management.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: "1,240", icon: <Users size={20} /> },
            { label: "Active Professionals", value: "86", icon: <Briefcase size={20} /> },
            { label: "API Requests (24h)", value: "45.2K", icon: <Activity size={20} /> },
            { label: "Security Status", value: "Secure", icon: <Shield size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border rounded-xl p-5" style={{ borderColor: "rgba(248,245,240,0.1)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(248,245,240,0.6)" }}>{stat.label}</span>
                <span style={{ color: "hsl(43 80% 60%)" }}>{stat.icon}</span>
              </div>
              <p className="font-serif text-3xl font-bold" style={{ color: "hsl(43 70% 88%)" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Users Table */}
        <div className="bg-white/5 border rounded-xl overflow-hidden" style={{ borderColor: "rgba(248,245,240,0.1)" }}>
          <div className="p-5 border-b" style={{ borderColor: "rgba(248,245,240,0.1)" }}>
            <h3 className="font-semibold" style={{ color: "hsl(43 70% 88%)" }}>Recent Member Registrations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "rgba(248,245,240,0.6)" }}>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Tier</th>
                  <th className="text-left p-4 font-medium">Credits</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody style={{ color: "rgba(248,245,240,0.8)" }}>
                {[
                  { name: "sarah.j@firm.com", tier: "Strategist", credits: 142, status: "Active" },
                  { name: "mark.t@consulting.com", tier: "Curator", credits: 12, status: "Active" },
                  { name: "elena.r@legal.com", tier: "Sovereign", credits: "Unlimited", status: "Active" },
                ].map((user, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "rgba(248,245,240,0.05)" }}>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.tier}</td>
                    <td className="p-4">{user.credits}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">{user.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}