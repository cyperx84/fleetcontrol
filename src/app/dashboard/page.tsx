'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Fleet {
  id: string;
  name: string;
  gateway_url: string;
  status: 'online' | 'offline' | 'degraded';
  last_check: string;
}

export default function Dashboard() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fleets')
      .then((r) => r.json())
      .then((data) => {
        setFleets(data);
        setLoading(false);
      });
  }, []);

  const runHealthCheck = async (fleet: Fleet) => {
    const res = await fetch('/api/healthcheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fleetId: fleet.id, gatewayUrl: fleet.gateway_url }),
    });
    const data = await res.json();
    setFleets((prev) =>
      prev.map((f) => (f.id === fleet.id ? { ...f, status: data.status || 'offline' } : f))
    );
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const statusDot = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'degraded': return 'bg-yellow-400';
      default: return 'bg-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">🎯 FleetControl</Link>
          <span className="text-gray-400 text-sm">Multi-Fleet Dashboard</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Your Fleets</h2>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : fleets.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No fleets connected</p>
            <p className="text-sm mt-2">Add your first OpenClaw instance to start monitoring</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fleets.map((fleet) => (
              <div key={fleet.id} className="bg-gray-900 rounded-lg border border-gray-800 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{fleet.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusDot(fleet.status)}`} />
                    <span className={`text-sm font-medium ${statusColor(fleet.status)}`}>
                      {fleet.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-4 truncate">{fleet.gateway_url}</p>
                <button
                  onClick={() => runHealthCheck(fleet)}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
                >
                  Health Check
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
