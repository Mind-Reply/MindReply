// admin-dashboard.tsx - DIRECTOR ONLY - ENTERPRISE GRADE
'use client';

import { useState, useEffect } from 'react';

interface BrainMetrics {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'error';
  agents: number;
  flows: number;
  tasksCompleted: number;
  performanceScore: number;
  uptime: string;
}

interface SystemStats {
  totalBrains: number;
  activeFlows: number;
  totalAgents: number;
  servicesLive: number;
  revenueThisMonth: number;
  systemHealth: number;
}

export default function AdminDashboard() {
  const [brains, setBrains] = useState<BrainMetrics[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState('checking...');
  const [autoDeployEnabled, setAutoDeployEnabled] = useState(true);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 5000); // Real-time updates every 5s
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      // Check Ollama local status
      const ollamaCheck = await fetch('http://localhost:11434/api/health').catch(() => null);
      setOllamaStatus(ollamaCheck?.ok ? '🟢 LIVE' : '🔴 OFFLINE');

      // Load brain metrics
      const response = await fetch('/api/director/metrics');
      if (response.ok) {
        const data = await response.json();
        setBrains(data.brains || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Dashboard load failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      {/* DIRECTOR HEADER */}
      <div className="mb-8 border-b border-green-500 pb-4">
        <h1 className="text-4xl font-bold text-green-400">MINDREPLY DIRECTOR CONSOLE</h1>
        <p className="text-gray-400">Enterprise Grade | Local + Cloud | No 3rd Party Access</p>
        <p className="text-sm text-gray-500">Director: Angel Krastev | Access Level: FULL ADMIN</p>
      </div>

      {/* SYSTEM STATUS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-green-500 p-4">
          <p className="text-gray-400 text-sm">TOTAL BRAINS</p>
          <p className="text-3xl font-bold text-green-400">{stats?.totalBrains || 0}</p>
        </div>
        <div className="bg-gray-900 border border-green-500 p-4">
          <p className="text-gray-400 text-sm">ACTIVE FLOWS</p>
          <p className="text-3xl font-bold text-green-400">{stats?.activeFlows || 0}</p>
        </div>
        <div className="bg-gray-900 border border-green-500 p-4">
          <p className="text-gray-400 text-sm">AGENTS DEPLOYED</p>
          <p className="text-3xl font-bold text-green-400">{stats?.totalAgents || 0}</p>
        </div>
        <div className="bg-gray-900 border border-green-500 p-4">
          <p className="text-gray-400 text-sm">SERVICES LIVE</p>
          <p className="text-3xl font-bold text-green-400">{stats?.servicesLive || 0}</p>
        </div>
      </div>

      {/* OLLAMA STATUS */}
      <div className="bg-gray-900 border border-yellow-500 p-4 mb-8">
        <p className="text-yellow-400 font-bold mb-2">OLLAMA LOCAL LLM</p>
        <p className="text-lg">{ollamaStatus}</p>
        <p className="text-xs text-gray-500 mt-2">Endpoint: http://localhost:11434</p>
      </div>

      {/* AUTO-DEPLOY CONTROL */}
      <div className="bg-gray-900 border border-blue-500 p-4 mb-8">
        <p className="text-blue-400 font-bold mb-4">AUTO-DEPLOYMENT CONTROL</p>
        <button
          onClick={() => setAutoDeployEnabled(!autoDeployEnabled)}
          className={`px-6 py-2 font-bold border-2 ${
            autoDeployEnabled
              ? 'bg-green-600 border-green-500 text-white'
              : 'bg-red-600 border-red-500 text-white'
          }`}
        >
          {autoDeployEnabled ? '🟢 AUTO-DEPLOY: ENABLED' : '🔴 AUTO-DEPLOY: DISABLED'}
        </button>
        <p className="text-xs text-gray-500 mt-2">POLICY: Only stops with explicit director approval</p>
      </div>

      {/* BRAIN METRICS TABLE */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-400 mb-4">ACTIVE BRAINS</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-green-500">
                <th className="text-left p-2">BRAIN ID</th>
                <th className="text-left p-2">STATUS</th>
                <th className="text-right p-2">AGENTS</th>
                <th className="text-right p-2">FLOWS</th>
                <th className="text-right p-2">TASKS</th>
                <th className="text-right p-2">SCORE</th>
                <th className="text-right p-2">UPTIME</th>
              </tr>
            </thead>
            <tbody>
              {brains.map((brain) => (
                <tr key={brain.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-2 font-mono text-sm">{brain.id}</td>
                  <td className="p-2">
                    {brain.status === 'running' && <span className="text-green-400">🟢 RUNNING</span>}
                    {brain.status === 'paused' && <span className="text-yellow-400">🟡 PAUSED</span>}
                    {brain.status === 'error' && <span className="text-red-400">🔴 ERROR</span>}
                  </td>
                  <td className="p-2 text-right">{brain.agents}</td>
                  <td className="p-2 text-right">{brain.flows}</td>
                  <td className="p-2 text-right font-bold">{brain.tasksCompleted}</td>
                  <td className="p-2 text-right text-green-400">{brain.performanceScore}%</td>
                  <td className="p-2 text-right text-xs">{brain.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVENUE SUMMARY */}
      <div className="bg-gray-900 border border-green-500 p-4">
        <p className="text-green-400 font-bold">REVENUE THIS MONTH</p>
        <p className="text-4xl font-bold">£{stats?.revenueThisMonth?.toLocaleString() || 0}</p>
        <p className="text-xs text-gray-500 mt-2">240 Services | £85K-425K Range | {stats?.systemHealth || 0}% Health</p>
      </div>

      {/* POLICIES */}
      <div className="mt-8 bg-gray-900 border border-purple-500 p-4 text-xs">
        <p className="text-purple-400 font-bold mb-2">DIRECTOR POLICIES</p>
        <p className="text-gray-400">• Systems run 24/7 - no stops without director approval</p>
        <p className="text-gray-400">• Brains only expand - never shrink unless directed</p>
        <p className="text-gray-400">• Latest tools always implemented first</p>
        <p className="text-gray-400">• No 3rd party access - local Ollama only</p>
        <p className="text-gray-400">• Real-time updates every 5 seconds</p>
        <p className="text-gray-400">• All flows tracked & measurable</p>
      </div>
    </div>
  );
}
