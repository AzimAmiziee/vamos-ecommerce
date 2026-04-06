-- Add role column to profiles
alter table public.profiles
  add column if not exists role text not null default 'customer'
  check (role in ('customer', 'admin', 'vendor'));

-- Index for role-based queries
create index if not exists profiles_role_idx on public.profiles (role);

-- Helper function that bypasses RLS to check admin role (avoids infinite recursion)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- RLS: Admins can read all profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- RLS: Admins can update any profile (e.g. change roles)
create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin());

-- RLS: Admins can read all orders
create policy "Admins can read all orders"
  on public.orders for select
  to authenticated
  using (public.is_admin());

-- RLS: Admins can update any order (e.g. change status)
create policy "Admins can update any order"
  on public.orders for update
  to authenticated
  using (public.is_admin());

-- RLS: Admins can read all order items
create policy "Admins can read all order items"
  on public.order_items for select
  to authenticated
  using (public.is_admin());

-- RLS: Admins can read all redemptions
create policy "Admins can read all redemptions"
  on public.redemptions for select
  to authenticated
  using (public.is_admin());

-- RLS: Admins can update any redemption
create policy "Admins can update any redemption"
  on public.redemptions for update
  to authenticated
  using (public.is_admin());

-- To make yourself admin, run this in SQL editor (replace with your user ID):
-- update public.profiles set role = 'admin' where id = 'your-user-uuid-here';
