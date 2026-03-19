export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">🎯 FleetControl</h1>
          <a
            href="/dashboard"
            className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1 rounded"
          >
            Dashboard →
          </a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-bold mb-4">
            Monitor every fleet from{' '}
            <span className="text-blue-400">one dashboard</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Connect your OpenClaw instances. See fleet status, track costs,
            get alerts when something breaks.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
            >
              Connect First Fleet
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">Health</div>
              <div className="text-gray-500 text-sm mt-1">Auto-check every 60 seconds</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Costs</div>
              <div className="text-gray-500 text-sm mt-1">Token usage + cost estimates</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Alerts</div>
              <div className="text-gray-500 text-sm mt-1">Instant notification on failure</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
