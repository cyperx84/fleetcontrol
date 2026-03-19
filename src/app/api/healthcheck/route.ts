import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Health check a single fleet
export async function POST(request: NextRequest) {
  const { fleetId, gatewayUrl, apiKey } = await request.json();
  if (!fleetId || !gatewayUrl) return NextResponse.json({ error: 'fleetId and gatewayUrl required' }, { status: 400 });

  const start = Date.now();
  let status: 'online' | 'offline' | 'degraded' = 'online';
  let agentCount = 0;
  let tokenCount = 0;

  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const res = await fetch(`${gatewayUrl}/health`, { headers, signal: AbortSignal.timeout(10000) });
    const latency = Date.now() - start;

    if (!res.ok) {
      status = 'offline';
    } else if (latency > 5000) {
      status = 'degraded';
    }

    // Try to get session data
    try {
      const sessionsRes = await fetch(`${gatewayUrl}/v1/sessions`, { headers, signal: AbortSignal.timeout(5000) });
      if (sessionsRes.ok) {
        const sessions = await sessionsRes.json();
        agentCount = Array.isArray(sessions) ? sessions.length : (sessions.sessions?.length || 0);
        tokenCount = sessions.reduce?.((sum: number, s: { tokenUsage?: number }) => sum + (s.tokenUsage || 0), 0) || 0;
      }
    } catch {
      // Session fetch failed but health check passed
    }

    // Save metric
    await supabase.from('fleet_metrics').insert({
      fleet_id: fleetId,
      active_agents: agentCount,
      token_count: tokenCount,
      cost_estimate: tokenCount * 0.000002, // rough estimate
    });

    // Update fleet status
    await supabase.from('fleets').update({ status, last_check: new Date().toISOString() }).eq('id', fleetId);

    // Alert if offline
    if (status === 'offline') {
      await supabase.from('fleet_alerts').insert({ fleet_id: fleetId, type: 'offline' });
    }

    return NextResponse.json({ status, latency, agents: agentCount, tokens: tokenCount });
  } catch {
    await supabase.from('fleets').update({ status: 'offline', last_check: new Date().toISOString() }).eq('id', fleetId);
    await supabase.from('fleet_alerts').insert({ fleet_id: fleetId, type: 'offline' });
    return NextResponse.json({ status: 'offline', error: 'Connection failed' }, { status: 502 });
  }
}
