'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { MetricsCard } from '@/components/MetricsCard';
import { ApprovalQueue } from '@/components/ApprovalQueue';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [metricsRes, queueRes] = await Promise.all([
          apiClient.get('/analytics'),
          apiClient.get('/queue'),
        ]);

        setMetrics(metricsRes);
        setQueue(queueRes);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricsCard label="Messages Handled" value={metrics?.messagesProcessed || 0} trend="+12%" />
        <MetricsCard label="Replies Approved" value={metrics?.repliesApproved || 0} trend="+8%" />
        <MetricsCard label="Follow-ups Sent" value={metrics?.followUpsSent || 0} trend="+15%" />
        <MetricsCard label="Hours Saved" value={`${(metrics?.estimatedHoursSaved || 0).toFixed(1)}h`} trend="+22%" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
        <ApprovalQueue items={queue} />
      </div>
    </div>
  );
}