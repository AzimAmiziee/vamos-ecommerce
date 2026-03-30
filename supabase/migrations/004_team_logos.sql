-- ============================================================
-- Add team logos table for easy reference + update matches
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── TEAMS REFERENCE TABLE ────────────────────────────────────
create table if not exists public.teams (
  id         uuid default gen_random_uuid() primary key,
  name       text unique not null,
  short_name text not null,
  logo       text,
  active     boolean default true,
  sort_order integer default 0
);

alter table public.teams enable row level security;
create policy "Teams are publicly readable" on public.teams for select using (true);

insert into public.teams (name, short_name, logo, sort_order) values
  ('Team Vamos',        'Vamos',    '/storage/teams/vamos.png',     1),
  ('SRG Esports',       'SRG',      '/storage/teams/srg.png',       2),
  ('RRQ Tora',          'RRQ',      '/storage/teams/rrq.png',       3),
  ('Invictus Gaming',   'IG',       '/storage/teams/invictus.png',  4),
  ('Bigetron MY',       'BTR',      '/storage/teams/bigetron.png',  5),
  ('AC Esports',        'AC',       '/storage/teams/acesports.png', 6),
  ('Team Flash',        'Flash',    '/storage/teams/teamflash.png', 7),
  ('Team Rey',          'Rey',      '/storage/teams/teamrey.png',   8),
  ('Todak',             'Todak',    '/storage/teams/todak.png',     9)
on conflict (name) do nothing;

-- ── UPDATE MATCHES (if already seeded via 003) ───────────────
-- Remove Homebois matches and update logos
delete from public.matches where home_team = 'Homebois' or away_team = 'Homebois';

-- Update logos for existing matches
update public.matches set
  home_logo = '/storage/teams/vamos.png',
  away_logo = '/storage/teams/srg.png'
where home_team = 'Team Vamos' and away_team = 'SRG Esports';

update public.matches set
  home_logo = '/storage/teams/rrq.png',
  away_logo = '/storage/teams/vamos.png'
where home_team = 'RRQ Tora' and away_team = 'Team Vamos';

update public.matches set
  home_logo = '/storage/teams/vamos.png',
  away_logo = '/storage/teams/todak.png'
where home_team = 'Team Vamos' and away_team = 'Todak';

update public.matches set
  home_logo = '/storage/teams/teamrey.png',
  away_logo = '/storage/teams/vamos.png'
where home_team = 'Team Rey' and away_team = 'Team Vamos';

-- Insert Week 5 matches if they don't exist yet
insert into public.matches
  (season, week, match_date, home_team, away_team, home_logo, away_logo, format, status, is_vamos_home, sort_order)
select
  'S16', 5, '2026-04-12 19:00:00+08', 'Team Vamos', 'SRG Esports',
  '/storage/teams/vamos.png', '/storage/teams/srg.png', 'Bo3', 'upcoming', true, 1
where not exists (
  select 1 from public.matches where home_team = 'Team Vamos' and away_team = 'SRG Esports'
);

insert into public.matches
  (season, week, match_date, home_team, away_team, home_logo, away_logo, format, status, is_vamos_home, sort_order)
select
  'S16', 5, '2026-04-13 19:00:00+08', 'RRQ Tora', 'Team Vamos',
  '/storage/teams/rrq.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 2
where not exists (
  select 1 from public.matches where home_team = 'RRQ Tora' and away_team = 'Team Vamos'
);
