'use client';

import { useEffect, useState } from 'react';

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/director/metrics')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(err => {
        console.error('Revenue fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load revenue data');
      });
  }, []);

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6">Revenue</h1>
      {error && <p className="text-red-400 mb-4">Error: {error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
