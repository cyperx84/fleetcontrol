# FleetControl — Multi-Fleet Orchestration

Connect OpenClaw instances → dashboard with fleet status + cost tracking + health checks + alerts.

## Stack
- Next.js App Router + TypeScript
- PostgreSQL
- WebSocket (real-time status)
- Vercel/Railway

## MVP
- [ ] Connect OpenClaw instance via API key
- [ ] Dashboard shows fleet status (online/offline)
- [ ] Agent list + recent activity
- [ ] Token usage + cost estimation
- [ ] Health checks (auto every 60s)
- [ ] Alerts on failure

## Getting Started
```bash
npm install
cp .env.example .env.local
npm run dev
```
