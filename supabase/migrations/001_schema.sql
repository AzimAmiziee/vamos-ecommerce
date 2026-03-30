-- ============================================================
-- Team Vamos E-commerce — Full Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── PROFILES ────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  username      text unique,
  full_name     text,
  phone         text,
  avatar_url    text,
  points        integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── PRODUCTS (Merchandise) ───────────────────────────────────
create table if not exists public.products (
  id             uuid default gen_random_uuid() primary key,
  name           text not null,
  price          numeric(10,2) not null,
  original_price numeric(10,2),
  image          text,
  hover_image    text,
  category       text not null,
  collection     text,
  description    text,
  sizes          text[] default '{}',
  rating         numeric(3,1) default 5.0,
  in_stock       boolean default true,
  sort_order     integer default 0,
  created_at     timestamptz default now()
);

-- ── GAMES (Diamond Top-up) ───────────────────────────────────
create table if not exists public.games (
  id              uuid default gen_random_uuid() primary key,
  slug            text unique not null,
  name            text not null,
  short_name      text not null,
  currency        text not null,
  color           text not null,
  color_secondary text not null,
  image           text,
  category        text not null check (category in ('Mobile Game', 'PC Game', 'Voucher')),
  description     text,
  active          boolean default true,
  sort_order      integer default 0,
  created_at      timestamptz default now()
);

-- ── GAME PACKAGES ────────────────────────────────────────────
create table if not exists public.game_packages (
  id          uuid default gen_random_uuid() primary key,
  game_id     uuid references public.games(id) on delete cascade not null,
  package_key text not null,
  amount      text not null,
  price       numeric(10,2) not null,
  bonus       text,
  popular     boolean default false,
  active      boolean default true,
  sort_order  integer default 0
);

-- ── ARTICLES (News) ──────────────────────────────────────────
create table if not exists public.articles (
  id           uuid default gen_random_uuid() primary key,
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  paragraphs   text[] default '{}',
  cover_image  text,
  category     text not null check (category in ('Match Report', 'Team News', 'Merchandise', 'Community')),
  author       text default 'Team Vamos Media',
  read_time    integer default 3,
  published    boolean default true,
  published_at timestamptz default now(),
  created_at   timestamptz default now()
);

-- ── STANDINGS ────────────────────────────────────────────────
create table if not exists public.standings (
  id            uuid default gen_random_uuid() primary key,
  season        text not null,
  week          integer,
  rank          integer not null,
  team          text not null,
  match_wins    integer default 0,
  match_losses  integer default 0,
  game_wins     integer default 0,
  game_losses   integer default 0,
  points        integer default 0,
  is_vamos      boolean default false,
  created_at    timestamptz default now()
);

-- ── ORDERS ───────────────────────────────────────────────────
create table if not exists public.orders (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id),
  status        text not null default 'pending'
                  check (status in ('pending', 'processing', 'completed', 'failed', 'refunded')),
  type          text not null check (type in ('merchandise', 'topup')),
  total         numeric(10,2) not null,
  points_earned integer default 0,
  game_user_id  text,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── ORDER ITEMS ──────────────────────────────────────────────
create table if not exists public.order_items (
  id         uuid default gen_random_uuid() primary key,
  order_id   uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  game_id    uuid references public.games(id),
  package_id uuid references public.game_packages(id),
  quantity   integer default 1,
  unit_price numeric(10,2) not null,
  size       text,
  metadata   jsonb
);

-- ── POINTS LEDGER ────────────────────────────────────────────
create table if not exists public.points_ledger (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  amount       integer not null,
  type         text not null check (type in ('purchase', 'redemption', 'bonus', 'adjustment')),
  description  text,
  reference_id uuid,
  created_at   timestamptz default now()
);

-- ── REWARDS CATALOGUE ────────────────────────────────────────
create table if not exists public.rewards (
  id              uuid default gen_random_uuid() primary key,
  title           text not null,
  description     text,
  points_required integer not null,
  category        text not null check (category in ('Merchandise', 'Experience')),
  icon            text,
  badge           text,
  value_label     text,
  fields_type     text not null check (fields_type in ('merch', 'experience')),
  active          boolean default true,
  stock           integer,
  sort_order      integer default 0,
  created_at      timestamptz default now()
);

-- ── REDEMPTIONS ──────────────────────────────────────────────
create table if not exists public.redemptions (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  reward_id        uuid references public.rewards(id) not null,
  code             text unique not null,
  status           text default 'pending'
                     check (status in ('pending', 'processing', 'completed', 'cancelled')),
  points_spent     integer not null,
  name             text,
  phone            text,
  email            text,
  size             text,
  shipping_address text,
  preferred_date   date,
  guests           integer,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── CONTACT SUBMISSIONS ──────────────────────────────────────
create table if not exists public.contact_submissions (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  status     text default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles            enable row level security;
alter table public.products            enable row level security;
alter table public.games               enable row level security;
alter table public.game_packages       enable row level security;
alter table public.articles            enable row level security;
alter table public.standings           enable row level security;
alter table public.orders              enable row level security;
alter table public.order_items         enable row level security;
alter table public.points_ledger       enable row level security;
alter table public.rewards             enable row level security;
alter table public.redemptions         enable row level security;
alter table public.contact_submissions enable row level security;

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Public read tables
create policy "Products are publicly readable"
  on public.products for select using (true);
create policy "Games are publicly readable"
  on public.games for select using (active = true);
create policy "Game packages are publicly readable"
  on public.game_packages for select using (active = true);
create policy "Published articles are publicly readable"
  on public.articles for select using (published = true);
create policy "Standings are publicly readable"
  on public.standings for select using (true);
create policy "Rewards are publicly readable"
  on public.rewards for select using (active = true);

-- Orders
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);
create policy "Authenticated users can create orders"
  on public.orders for insert with check (auth.uid() = user_id);

-- Order items
create policy "Users can view own order items"
  on public.order_items for select
  using (exists (
    select 1 from public.orders
    where orders.id = order_id and orders.user_id = auth.uid()
  ));
create policy "Authenticated users can create order items"
  on public.order_items for insert
  with check (exists (
    select 1 from public.orders
    where orders.id = order_id and orders.user_id = auth.uid()
  ));

-- Points ledger
create policy "Users can view own points"
  on public.points_ledger for select using (auth.uid() = user_id);
create policy "Users can insert own points"
  on public.points_ledger for insert with check (auth.uid() = user_id);

-- Redemptions
create policy "Users can view own redemptions"
  on public.redemptions for select using (auth.uid() = user_id);
create policy "Authenticated users can create redemptions"
  on public.redemptions for insert with check (auth.uid() = user_id);

-- Contact submissions: anyone can insert
create policy "Anyone can submit contact form"
  on public.contact_submissions for insert with check (true);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update profiles.updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

create trigger redemptions_updated_at
  before update on public.redemptions
  for each row execute function public.handle_updated_at();
