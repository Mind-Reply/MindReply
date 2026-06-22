'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Mail, Youtube, CreditCard, MessageCircle, Bell, Settings, LogOut } from 'lucide-react';

interface DashboardData {
  stripe: { revenue: number; customers: number; transactions: number };
  gmail: { unread: number; totalEmails: number };
  youtube: { subscribers: number; views: number; videos: number };
  analytics: { activeUsers: number; pageViews: number };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function loadDashboardData() {
    try {
      const [stripeRes, gmailRes, youtubeRes, analyticsRes] = await Promise.all([
        fetch('/api/integrations/stripe'),
        fetch('/api/integrations/gmail'),
        fetch('/api/integrations/youtube'),
        fetch('/api/integrations/analytics'),
      ]);

      const [stripe, gmail, youtube, analytics] = await Promise.all([
        stripeRes.json(),
        gmailRes.json(),
        youtubeRes.json(),
        analyticsRes.json(),
      ]);

      setData({ stripe, gmail, youtube, analytics });
      setNotifications((prev) => [
        ...prev,
        `Updated at ${new Date().toLocaleTimeString()}`,
      ].slice(-5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full" />
          </div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const revenueChart = [
    { name: 'Mon', revenue: data?.stripe.revenue ? Math.random() * 5000 : 0 },
    { name: 'Tue', revenue: data?.stripe.revenue ? Math.random() * 5000 : 0 },
    { name: 'Wed', revenue: data?.stripe.revenue ? Math.random() * 5000 : 0 },
    { name: 'Thu', revenue: data?.stripe.revenue ? Math.random() * 5000 : 0 },
    { name: 'Fri', revenue: data?.stripe.revenue ? Math.random() * 5000 : 0 },
  ];

  const pieData = [
    { name: 'Stripe', value: data?.stripe.customers || 0 },
    { name: 'Gmail', value: data?.gmail.totalEmails || 0 },
    { name: 'YouTube', value: data?.youtube.subscribers || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-400">Real-time insights</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-400" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Revenue"
            value={`$${(data?.stripe.revenue || 0).toLocaleString()}`}
            icon={<CreditCard className="w-6 h-6" />}
            trend="+12.5%"
            color="emerald"
          />
          <KPICard
            title="Customers"
            value={data?.stripe.customers || 0}
            icon={<TrendingUp className="w-6 h-6" />}
            trend="+8.2%"
            color="blue"
          />
          <KPICard
            title="Unread Emails"
            value={data?.gmail.unread || 0}
            icon={<Mail className="w-6 h-6" />}
            trend="−2.4%"
            color="amber"
          />
          <KPICard
            title="YouTube Subs"
            value={(data?.youtube.subscribers || 0).toLocaleString()}
            icon={<Youtube className="w-6 h-6" />}
            trend="+5.1%"
            color="red"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Data Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Integrations Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <IntegrationStatus name="Stripe" connected={!!data?.stripe} />
            <IntegrationStatus name="Gmail" connected={!!data?.gmail} />
            <IntegrationStatus name="YouTube" connected={!!data?.youtube} />
            <IntegrationStatus name="Claude AI" connected={true} />
          </div>
        </div>
      </main>
    </div>
  );
}

function KPICard({
  title,
  value,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  color: 'emerald' | 'blue' | 'amber' | 'red';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 backdrop-blur-xl`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-500 mt-2">{trend}</p>
        </div>
        <div className={`${colorClasses[color]} p-2 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}

function IntegrationStatus({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{name}</span>
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-slate-500'}`} />
      </div>
    </div>
  );
}
