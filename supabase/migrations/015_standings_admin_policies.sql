-- Allow admins to INSERT / UPDATE / DELETE standings rows
create policy "Admins can insert standings"
  on public.standings for insert
  with check (is_admin());

create policy "Admins can update standings"
  on public.standings for update
  using (is_admin());

create policy "Admins can delete standings"
  on public.standings for delete
  using (is_admin());
