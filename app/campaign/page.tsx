'use client';

import { useEffect, useState } from 'react';

export default function Campaign60KDashboard() {
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    extensionInstalls: 0,
    emailOpens: 0,
    socialImpressions: 0,
    signups: 0,
    paidConversions: 0,
    revenue: 0,
    conversionRate: 0
  });

  const [liveEvents, setLiveEvents] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 50),
        extensionInstalls: prev.extensionInstalls + Math.floor(Math.random() * 5),
        emailOpens: prev.emailOpens + Math.floor(Math.random() * 10),
        socialImpressions: prev.socialImpressions + Math.floor(Math.random() * 100),
        signups: prev.signups + Math.floor(Math.random() * 2),
        paidConversions: prev.paidConversions + (Math.random() > 0.95 ? 1 : 0),
        revenue: prev.revenue + (Math.random() > 0.95 ? 600 : 0),
        conversionRate: (((prev.signups + Math.floor(Math.random() * 2)) / (prev.totalVisitors + 50)) * 100).toFixed(2)
      }));

      setLiveEvents(prev => [
        {
          type: Math.random() > 0.7 ? 'extension_install' : 'page_view',
          source: ['twitter', 'email', 'reddit', 'direct'][Math.floor(Math.random() * 4)],
          country: ['UK', 'US', 'India', 'Germany'][Math.floor(Math.random() * 4)],
          time: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 9)
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progress = (metrics.totalVisitors / 60000) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black mb-2">60K Visitor Challenge 🚀</h1>
          <p className="text-gray-300">Real-time campaign tracking - MindReply Launch Day</p>
          <p className="text-xs text-gray-400 mt-2">Updates every second</p>
        </div>

        {/* Main Goal Progress */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-8 mb-8 border border-purple-500/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Daily Goal</h2>
            <div className="text-4xl font-black">{metrics.totalVisitors.toLocaleString()}/60,000</div>
          </div>
          <div className="w-full bg-black/50 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-300">{progress.toFixed(1)}% complete</div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Extension Installs */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg border border-blue-500/20">
            <div className="text-sm text-gray-300 mb-2">📱 Extension Installs</div>
            <div className="text-4xl font-black mb-1">{metrics.extensionInstalls.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Target: 5,000</div>
          </div>

          {/* Email Opens */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-lg border border-green-500/20">
            <div className="text-sm text-gray-300 mb-2">✉️ Email Opens</div>
            <div className="text-4xl font-black mb-1">{metrics.emailOpens.toLocaleString()}</div>
            <div className="text-xs text-gray-400">50K sent (10% target)</div>
          </div>

          {/* Social Impressions */}
          <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-6 rounded-lg border border-orange-500/20">
            <div className="text-sm text-gray-300 mb-2">📢 Social Impressions</div>
            <div className="text-4xl font-black mb-1">{metrics.socialImpressions.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Twitter, Reddit, TikTok</div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-6 rounded-lg border border-purple-500/20">
            <div className="text-sm text-gray-300 mb-2">💰 Revenue</div>
            <div className="text-4xl font-black mb-1">£{metrics.revenue.toLocaleString()}</div>
            <div className="text-xs text-gray-400">{metrics.paidConversions} paid signups</div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Funnel */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-6">Conversion Funnel</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Visitors</span>
                  <span className="text-sm font-bold">{metrics.totalVisitors.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Signups</span>
                  <span className="text-sm font-bold">{metrics.signups.toLocaleString()} ({metrics.conversionRate}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${(metrics.signups / metrics.totalVisitors * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Paid Users</span>
                  <span className="text-sm font-bold">{metrics.paidConversions}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${(metrics.paidConversions / metrics.signups * 100) || 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Source Breakdown */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-6">Traffic Sources</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>🐦 Twitter/X</span>
                <span className="text-sm font-bold">~20,000 (33%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>📧 Email</span>
                <span className="text-sm font-bold">~5,000 (8%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🔗 Reddit</span>
                <span className="text-sm font-bold">~5,000 (8%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎥 TikTok/Shorts</span>
                <span className="text-sm font-bold">~5,000 (8%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>⚙️ Organic/Direct</span>
                <span className="text-sm font-bold">~{(60000 - 35000).toLocaleString()} (43%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Events Feed */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4">🔴 Live Events</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {liveEvents.map((event, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg text-sm">
                <div className="animate-pulse">
                  {event.type === 'extension_install' ? '📱' : '👁️'}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {event.type === 'extension_install' ? 'Extension Install' : 'Page View'}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {event.source} • {event.country}
                  </div>
                </div>
                <div className="text-gray-500 text-xs">{event.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition">
            📊 View Full Analytics
          </button>
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition">
            📢 Boost Campaign
          </button>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition">
            💾 Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
