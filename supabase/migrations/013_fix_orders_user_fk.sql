-- Fix orders.user_id FK to reference profiles instead of auth.users
-- This allows PostgREST to join orders → profiles directly

alter table public.orders drop constraint orders_user_id_fkey;
alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete set null;
