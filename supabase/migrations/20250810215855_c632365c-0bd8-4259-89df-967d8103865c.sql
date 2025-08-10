-- Replace metadata-based policies with role-table checks only
DROP POLICY IF EXISTS "Faculty/PD can select all schedules (role or metadata)" ON public.schedules;
DROP POLICY IF EXISTS "Faculty/PD can update seen (role or metadata)" ON public.schedules;

-- Recreate clean policies that rely solely on user_roles via has_role()
CREATE POLICY IF NOT EXISTS "Faculty and PD can select all schedules"
ON public.schedules
FOR SELECT
USING (
  public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'program_director')
);

CREATE POLICY IF NOT EXISTS "Faculty and PD can update all schedules"
ON public.schedules
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'program_director')
);

-- Allow users to insert their own role row into user_roles (to self-sync metadata -> role table)
CREATE POLICY IF NOT EXISTS "Users can insert their own role"
ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());