'use client';

import { useEffect, useState } from 'react';

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/director/metrics')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6">Revenue</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
