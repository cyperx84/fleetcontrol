import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Fleet {
  id: string;
  user_id: string;
  name: string;
  gateway_url: string;
  api_key: string;
  status: 'online' | 'offline' | 'degraded';
  last_check: string;
  created_at: string;
}

export interface FleetMetric {
  id: string;
  fleet_id: string;
  active_agents: number;
  token_count: number;
  cost_estimate: number;
  timestamp: string;
}

export interface FleetAlert {
  id: string;
  fleet_id: string;
  type: string;
  triggered_at: string;
  resolved_at: string | null;
}
