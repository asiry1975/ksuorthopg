-- Recreate strict RLS policies for pending_roles (managed by Program Director)
DROP POLICY IF EXISTS "PD can view pending roles" ON public.pending_roles;
CREATE POLICY "PD can view pending roles"
  ON public.pending_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'program_director'));

DROP POLICY IF EXISTS "PD can insert pending roles" ON public.pending_roles;
CREATE POLICY "PD can insert pending roles"
  ON public.pending_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'program_director'));

DROP POLICY IF EXISTS "PD can update pending roles" ON public.pending_roles;
CREATE POLICY "PD can update pending roles"
  ON public.pending_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'program_director'))
  WITH CHECK (public.has_role(auth.uid(), 'program_director'));

DROP POLICY IF EXISTS "PD can delete pending roles" ON public.pending_roles;
CREATE POLICY "PD can delete pending roles"
  ON public.pending_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'program_director'));
