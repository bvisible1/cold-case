-- ─────────────────────────────────────────────────────────────
-- Cold Case · Supabase schema (frontend-direct, append-only capture)
-- Run this in the Supabase SQL Editor (it uses the service role, so it
-- can create tables and policies). Safe to re-run.
-- ─────────────────────────────────────────────────────────────

-- Tenants (the customer org running the training). Reference data.
create table if not exists companies (
  id          text primary key,
  name        text,
  created_at  timestamptz default now()
);
insert into companies (id, name) values ('dynatrace', 'Dynatrace')
  on conflict (id) do nothing;

-- One row per completed AI conversation (cold call or discovery).
-- transcript holds the full real-time chat; score holds the ICE result.
create table if not exists calls (
  id            uuid primary key default gen_random_uuid(),
  play_id       text,                 -- ties all events from one playthrough together
  company_id    text references companies(id),
  team_id       text,
  mode          text,                 -- 'cold' | 'discovery'
  persona_id    text,
  persona_name  text,
  persona_title text,
  score         jsonb,                -- { implication, champion, economicBuyer, quality, meetingEarned, summary }
  transcript    jsonb,                -- [ { role, content }, ... ]  ← the AI chat data
  created_at    timestamptz default now()
);
create index if not exists calls_company_idx on calls (company_id);
create index if not exists calls_play_idx    on calls (play_id);

-- One row per finished playthrough — the full Findings summary.
create table if not exists runs (
  id               uuid primary key default gen_random_uuid(),
  play_id          text,
  company_id       text references companies(id),
  team_id          text,
  scenario_account text,
  deal_tier        text,             -- cold | bronze | silver | gold | platinum
  arr_value        int,
  total_points     int,
  ice              jsonb,            -- { implication, champion, economicBuyer, quality }
  phases           jsonb,            -- all per-phase evals + scores
  summary          jsonb,            -- nailed / left-on-table / deal reason snapshot
  created_at       timestamptz default now()
);
create index if not exists runs_company_idx on runs (company_id);
create index if not exists runs_play_idx     on runs (play_id);

-- ── Row Level Security ──────────────────────────────────────────
-- The browser uses the public anon key, so we allow INSERT only.
-- No SELECT policy = the anon key cannot read any rows. Read & parse
-- the data through the Supabase dashboard or a server-side service key.
alter table calls enable row level security;
alter table runs  enable row level security;

drop policy if exists "anon insert calls" on calls;
drop policy if exists "anon insert runs"  on runs;

create policy "anon insert calls" on calls
  for insert to anon with check (true);
create policy "anon insert runs" on runs
  for insert to anon with check (true);
