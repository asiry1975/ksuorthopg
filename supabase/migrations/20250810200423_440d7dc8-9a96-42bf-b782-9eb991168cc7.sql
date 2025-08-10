-- Secure RLS policies for pending_roles (program director manages entries)
-- SELECT
create policy if not exists "PD can view pending roles"
  on public.pending_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'program_director'));

-- INSERT
create policy if not exists "PD can insert pending roles"
  on public.pending_roles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'program_director'));

-- UPDATE
create policy if not exists "PD can update pending roles"
  on public.pending_roles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'program_director'))
  with check (public.has_role(auth.uid(), 'program_director'));

-- DELETE
create policy if not exists "PD can delete pending roles"
  on public.pending_roles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'program_director'));
