-- ============================================================
-- Predict & Win — matches + predictions tables
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── MATCHES ──────────────────────────────────────────────────
create table if not exists public.matches (
  id           uuid default gen_random_uuid() primary key,
  season       text not null,
  week         integer,
  match_date   timestamptz not null,
  home_team    text not null,           -- e.g. 'Team Vamos'
  away_team    text not null,           -- e.g. 'SRG Esports'
  home_logo    text,
  away_logo    text,
  format       text not null default 'Bo3' check (format in ('Bo1','Bo3','Bo5')),
  status       text not null default 'upcoming'
                 check (status in ('upcoming','live','completed','cancelled')),
  home_score   integer,                 -- null until completed
  away_score   integer,
  is_vamos_home boolean default true,   -- which side is Vamos
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

-- ── PREDICTIONS ──────────────────────────────────────────────
create table if not exists public.predictions (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  match_id       uuid references public.matches(id) on delete cascade not null,
  pred_home      integer not null,      -- user's predicted home score
  pred_away      integer not null,      -- user's predicted away score
  is_correct     boolean,               -- null until match completed
  points_awarded integer default 0,
  created_at     timestamptz default now(),
  unique (user_id, match_id)            -- one prediction per match per user
);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.matches     enable row level security;
alter table public.predictions enable row level security;

create policy "Matches are publicly readable"
  on public.matches for select using (true);

create policy "Users can view own predictions"
  on public.predictions for select using (auth.uid() = user_id);

create policy "Authenticated users can insert predictions"
  on public.predictions for insert with check (auth.uid() = user_id);

create policy "Users can update own predictions"
  on public.predictions for update using (auth.uid() = user_id);

-- ── SEED — matches ───────────────────────────────────────────
insert into public.matches
  (season, week, match_date, home_team, away_team, home_logo, away_logo, format, status, is_vamos_home, sort_order)
values
  ('S16', 5, '2026-04-12 19:00:00+08', 'Team Vamos', 'SRG Esports',
   '/storage/teams/vamos.png', '/storage/teams/srg.png', 'Bo3', 'upcoming', true, 1),

  ('S16', 5, '2026-04-13 19:00:00+08', 'RRQ Tora', 'Team Vamos',
   '/storage/teams/rrq.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 2),

  ('S16', 4, '2026-03-29 19:00:00+08', 'Team Vamos', 'Todak',
   '/storage/teams/vamos.png', '/storage/teams/todak.png', 'Bo3', 'completed', true, 3),

  ('S16', 4, '2026-03-28 19:00:00+08', 'Team Rey', 'Team Vamos',
   '/storage/teams/teamrey.png', '/storage/teams/vamos.png', 'Bo3', 'completed', false, 4);

-- Set results for completed matches
update public.matches set home_score = 2, away_score = 1
  where home_team = 'Team Vamos' and away_team = 'Todak' and status = 'completed';

update public.matches set home_score = 0, away_score = 2
  where home_team = 'Team Rey' and away_team = 'Team Vamos' and status = 'completed';
