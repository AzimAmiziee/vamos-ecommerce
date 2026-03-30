-- Run this in Supabase SQL Editor after 001_schema.sql
-- Atomic points increment/decrement to avoid race conditions

create or replace function public.increment_points(p_user_id uuid, p_amount integer)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set points = greatest(0, points + p_amount),
      updated_at = now()
  where id = p_user_id;
end;
$$;
