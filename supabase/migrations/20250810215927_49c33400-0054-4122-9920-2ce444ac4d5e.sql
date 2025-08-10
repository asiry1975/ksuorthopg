-- Fix policies: re-create without IF NOT EXISTS and ensure no duplicates
DROP POLICY IF EXISTS "Faculty and PD can select all schedules" ON public.schedules;
DROP POLICY IF EXISTS "Faculty and PD can update all schedules" ON public.schedules;

CREATE POLICY "Faculty and PD can select all schedules"
ON public.schedules
FOR SELECT
USING (
  public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'program_director')
);

CREATE POLICY "Faculty and PD can update all schedules"
ON public.schedules
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'program_director')
);

DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());