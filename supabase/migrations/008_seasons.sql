-- ── SEASONS TABLE ────────────────────────────────────────────
create table if not exists public.seasons (
  id         uuid default gen_random_uuid() primary key,
  name       text not null unique,   -- 'MPL MY S17'
  short_name text not null,          -- 'S17'
  start_date date not null,
  end_date   date not null,
  active     boolean default false,
  prize_desc text,
  created_at timestamptz default now()
);

-- Seed S17
insert into public.seasons (name, short_name, start_date, end_date, active, prize_desc)
values (
  'MPL MY S17', 'S17',
  '2026-03-01', '2026-06-30',
  true,
  'The #1 spender of MPL MY S17 wins an exclusive invite to join Team Vamos on their end-of-season team building trip — flights, accommodation, meals and activities are fully covered by the organisation.'
);

-- ── UPDATE get_top_spenders: filter by active season ─────────
create or replace function get_top_spenders(p_limit int default 5)
returns table (
  rank         int,
  user_id      uuid,
  display_name text,
  total_spent  numeric,
  total_points int,
  order_count  int
) language sql security definer stable as $$
  select
    row_number() over (order by sum(o.total) desc)::int as rank,
    p.id                                                  as user_id,
    coalesce(nullif(trim(p.full_name), ''), 'Anonymous')  as display_name,
    sum(o.total)::numeric                                  as total_spent,
    coalesce(p.points, 0)                                  as total_points,
    count(o.id)::int                                       as order_count
  from public.profiles p
  join public.orders   o on o.user_id  = p.id
  join public.seasons  s on s.active   = true
  where o.status = 'completed'
    and o.created_at::date >= s.start_date
    and o.created_at::date <= s.end_date
  group by p.id, p.full_name, p.points
  order by total_spent desc
  limit p_limit;
$$;

-- ── GET ACTIVE SEASON ────────────────────────────────────────
create or replace function get_active_season()
returns table (
  name       text,
  short_name text,
  start_date date,
  end_date   date,
  prize_desc text
) language sql security definer stable as $$
  select name, short_name, start_date, end_date, prize_desc
  from public.seasons
  where active = true
  limit 1;
$$;
