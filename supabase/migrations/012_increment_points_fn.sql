-- Function to safely increment a user's points balance
create or replace function public.increment_points(p_user_id uuid, p_amount int)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set points = points + p_amount
  where id = p_user_id;
$$;
