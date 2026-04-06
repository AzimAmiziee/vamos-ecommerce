-- ─────────────────────────────────────────────
-- 014 · subscribers + contact_inquiries tables
-- ─────────────────────────────────────────────

-- Newsletter subscribers
create table if not exists public.subscribers (
  id            uuid        primary key default gen_random_uuid(),
  email         text        not null unique,
  subscribed_at timestamptz not null default now()
);

-- Contact / partnership inquiries (shared table)
create table if not exists public.contact_inquiries (
  id         uuid        primary key default gen_random_uuid(),
  type       text        not null check (type in ('contact', 'partnership')),
  name       text        not null,
  email      text        not null,
  company    text,
  subject    text,
  message    text        not null,
  status     text        not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

-- RLS
alter table public.subscribers       enable row level security;
alter table public.contact_inquiries enable row level security;

-- Anyone (anon + authenticated) can insert
create policy "Anyone can subscribe"
  on public.subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can submit inquiry"
  on public.contact_inquiries for insert
  to anon, authenticated
  with check (true);

-- Admins can read
create policy "Admins can view subscribers"
  on public.subscribers for select
  using (is_admin());

create policy "Admins can view inquiries"
  on public.contact_inquiries for select
  using (is_admin());

-- Admins can update status
create policy "Admins can update inquiry status"
  on public.contact_inquiries for update
  using (is_admin());

-- Admins can delete
create policy "Admins can delete subscribers"
  on public.subscribers for delete
  using (is_admin());

create policy "Admins can delete inquiries"
  on public.contact_inquiries for delete
  using (is_admin());
