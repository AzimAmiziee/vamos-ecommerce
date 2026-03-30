-- ============================================================
-- Season 17 update: standings, rewards, matches
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── STANDINGS: clear old S16, insert S17 Week 1 ──────────────
delete from public.standings where season = 'MPL MY S16';
delete from public.standings where season = 'MPL MY S17';

insert into public.standings
  (season, week, rank, team, match_wins, match_losses, game_wins, game_losses, points, is_vamos)
values
  ('MPL MY S17', 1, 1,  'SRG Esports',       1, 0, 2, 0, 3,  false),
  ('MPL MY S17', 1, 2,  'Invictus Gaming',   1, 0, 2, 1, 3,  false),
  ('MPL MY S17', 1, 3,  'Team Vamos',        1, 0, 2, 1, 3,  true),
  ('MPL MY S17', 1, 4,  'Team Flash',        1, 0, 2, 1, 3,  false),
  ('MPL MY S17', 1, 5,  'RRQ Tora',          0, 1, 1, 2, 0,  false),
  ('MPL MY S17', 1, 6,  'Team Rey',          0, 1, 1, 2, 0,  false),
  ('MPL MY S17', 1, 7,  'Bigetron MY',       0, 1, 0, 2, 0,  false),
  ('MPL MY S17', 1, 8,  'AC Esports',        0, 1, 0, 2, 0,  false);

-- ── REWARDS: replace all with new reward set ─────────────────
delete from public.redemptions;
delete from public.rewards;

insert into public.rewards
  (title, description, points_required, category, icon, badge, value_label, fields_type, active, stock, sort_order)
values
  (
    'Match Ticket',
    'Redeem a free ticket to watch Team Vamos live at an MPL MY Season 17 match. Choose your preferred match date. First come, first served.',
    1000, 'Experience', '🎟️', 'Per Game', 'Free Entry',
    'experience', true, 10, 1
  ),
  (
    'Signed Jersey S16',
    'An official Team Vamos Season 16 jersey personally signed by the squad. A true collector''s item for the real fans.',
    3000, 'Merchandise', '✍️', 'Limited', 'Worth RM200+',
    'merch', true, 10, 2
  ),
  (
    'Signed Jersey S17',
    'The brand-new Season 17 jersey signed by the full Team Vamos roster. Limited monthly stock — grab it before it''s gone.',
    3000, 'Merchandise', '🏆', 'New', 'Worth RM220+',
    'merch', true, 10, 3
  ),
  (
    'Personalised Shoutout Video',
    'Get a custom shoutout video from a Team Vamos player — for birthdays, milestones or just to flex on your friends.',
    2000, 'Experience', '🎥', 'Monthly', 'Priceless',
    'experience', true, 10, 4
  ),
  (
    'Exclusive Meet & Greet',
    'Meet the Team Vamos squad in person. Take photos, get autographs and spend quality time with your favourite players.',
    5000, 'Experience', '🤝', 'VIP', 'Exclusive',
    'experience', true, 10, 5
  ),
  (
    'Gaming House Tour',
    'Step inside the Vamos Gaming House. See where the pros train, grind scrims and prepare for MPL. Only 1 slot per month.',
    4000, 'Experience', '🏠', 'Rare', 'Exclusive Access',
    'experience', true, 1, 6
  );

-- ── MATCHES: clear old, insert full S17 schedule ─────────────
delete from public.predictions;
delete from public.matches;

insert into public.matches
  (season, week, match_date, home_team, away_team, home_logo, away_logo, format, status, is_vamos_home, sort_order)
values
  -- Week 1 (played)
  ('S17', 1, '2026-03-28 19:00:00+08', 'Team Vamos', 'SRG Esports',
   '/storage/teams/vamos.png', '/storage/teams/srg.png', 'Bo3', 'completed', true, 1),

  -- Week 2 (played)
  ('S17', 2, '2026-04-03 19:00:00+08', 'Team Vamos', 'SRG Esports',
   '/storage/teams/vamos.png', '/storage/teams/srg.png', 'Bo3', 'upcoming', true, 2),
  ('S17', 2, '2026-04-03 21:00:00+08', 'SRG Esports', 'Team Vamos',
   '/storage/teams/srg.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 3),

  -- Week 3
  ('S17', 3, '2026-04-11 19:00:00+08', 'Team Vamos', 'Invictus Gaming',
   '/storage/teams/vamos.png', '/storage/teams/invictus.png', 'Bo3', 'upcoming', true, 4),
  ('S17', 3, '2026-04-12 19:00:00+08', 'Team Vamos', 'AC Esports',
   '/storage/teams/vamos.png', '/storage/teams/acesports.png', 'Bo3', 'upcoming', true, 5),

  -- Week 4
  ('S17', 4, '2026-04-17 19:00:00+08', 'Team Vamos', 'RRQ Tora',
   '/storage/teams/vamos.png', '/storage/teams/rrq.png', 'Bo3', 'upcoming', true, 6),
  ('S17', 4, '2026-04-19 19:00:00+08', 'Team Vamos', 'Team Flash',
   '/storage/teams/vamos.png', '/storage/teams/teamflash.png', 'Bo3', 'upcoming', true, 7),

  -- Week 5
  ('S17', 5, '2026-04-24 19:00:00+08', 'Team Vamos', 'Bigetron MY',
   '/storage/teams/vamos.png', '/storage/teams/bigetron.png', 'Bo3', 'upcoming', true, 8),
  ('S17', 5, '2026-04-25 19:00:00+08', 'Team Vamos', 'Team Rey',
   '/storage/teams/vamos.png', '/storage/teams/teamrey.png', 'Bo3', 'upcoming', true, 9),

  -- Week 6
  ('S17', 6, '2026-05-01 19:00:00+08', 'Invictus Gaming', 'Team Vamos',
   '/storage/teams/invictus.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 10),
  ('S17', 6, '2026-05-02 19:00:00+08', 'Bigetron MY', 'Team Vamos',
   '/storage/teams/bigetron.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 11),

  -- Week 7
  ('S17', 7, '2026-05-08 19:00:00+08', 'Team Rey', 'Team Vamos',
   '/storage/teams/teamrey.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 12),
  ('S17', 7, '2026-05-09 19:00:00+08', 'RRQ Tora', 'Team Vamos',
   '/storage/teams/rrq.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 13),

  -- Week 8
  ('S17', 8, '2026-05-16 19:00:00+08', 'SRG Esports', 'Team Vamos',
   '/storage/teams/srg.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 14),

  -- Week 9
  ('S17', 9, '2026-05-23 19:00:00+08', 'AC Esports', 'Team Vamos',
   '/storage/teams/acesports.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 15),
  ('S17', 9, '2026-05-24 19:00:00+08', 'Team Flash', 'Team Vamos',
   '/storage/teams/teamflash.png', '/storage/teams/vamos.png', 'Bo3', 'upcoming', false, 16);

-- Set result for the Week 1 completed match (Vamos won 2-1)
update public.matches set home_score = 2, away_score = 1
  where season = 'S17' and week = 1 and home_team = 'Team Vamos' and status = 'completed';
