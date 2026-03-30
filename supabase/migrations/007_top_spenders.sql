-- Returns top N spenders across all users (security definer bypasses RLS)
create or replace function get_top_spenders(p_limit int default 5)
returns table (
  rank        int,
  user_id     uuid,
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
  join public.orders o on o.user_id = p.id
  where o.status = 'completed'
  group by p.id, p.full_name, p.points
  order by total_spent desc
  limit p_limit;
$$;
