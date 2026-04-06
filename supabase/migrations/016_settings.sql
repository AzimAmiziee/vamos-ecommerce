-- Site settings key-value store
create table if not exists public.settings (
  key   text primary key,
  value text not null
);

-- Default active season
insert into public.settings (key, value)
values ('active_season', 'MPL MY S17')
on conflict (key) do nothing;

-- RLS
alter table public.settings enable row level security;

create policy "Settings are publicly readable"
  on public.settings for select
  using (true);

create policy "Admins can update settings"
  on public.settings for update
  using (is_admin());
