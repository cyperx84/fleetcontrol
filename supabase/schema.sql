-- FleetControl database schema
-- Run in Supabase SQL Editor

create table fleets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  gateway_url text not null,
  api_key text,
  status text default 'offline' check (status in ('online', 'offline', 'degraded')),
  last_check timestamptz,
  created_at timestamptz default now()
);

create table fleet_metrics (
  id uuid default gen_random_uuid() primary key,
  fleet_id uuid references fleets(id) on delete cascade not null,
  active_agents integer default 0,
  token_count integer default 0,
  cost_estimate real default 0,
  timestamp timestamptz default now()
);

create table fleet_alerts (
  id uuid default gen_random_uuid() primary key,
  fleet_id uuid references fleets(id) on delete cascade not null,
  type text not null,
  triggered_at timestamptz default now(),
  resolved_at timestamptz
);

alter table fleets enable row level security;
alter table fleet_metrics enable row level security;
alter table fleet_alerts enable row level security;

create policy "Users can CRUD their own fleets" on fleets for all using (auth.uid() = user_id);
create policy "Users can read their own metrics" on fleet_metrics for select using (fleet_id in (select id from fleets where user_id = auth.uid()));
create policy "Service can insert metrics" on fleet_metrics for insert with check (true);
create policy "Users can read their own alerts" on fleet_alerts for select using (fleet_id in (select id from fleets where user_id = auth.uid()));
