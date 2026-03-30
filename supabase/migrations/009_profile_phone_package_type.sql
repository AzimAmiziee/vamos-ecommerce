-- Add package_type to game_packages for grouping in UI
alter table public.game_packages
  add column if not exists package_type text not null default 'currency'
    check (package_type in ('currency', 'subscription', 'bundle'));

-- phone already exists on profiles, ensure handle_new_user stores it if provided
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
