-- Enable realtime for schedules and fix RLS to recognize JWT metadata roles
-- 1) Ensure realtime works cross-browser
ALTER TABLE public.schedules REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedules;

-- 2) Update RLS so faculty/program director can read/update using either user_roles or JWT user_metadata.role
DROP POLICY IF EXISTS "Faculty and PD can select all schedules" ON public.schedules;
DROP POLICY IF EXISTS "Faculty and PD can update all schedules" ON public.schedules;

CREATE POLICY "Faculty/PD can select all schedules (role or metadata)"
ON public.schedules
FOR SELECT
USING (
  public.has_role(auth.uid(), 'faculty')
  OR public.has_role(auth.uid(), 'program_director')
  OR (coalesce(auth.jwt() -> 'user_metadata' ->> 'role','') IN ('faculty','program_director'))
);

CREATE POLICY "Faculty/PD can update seen (role or metadata)"
ON public.schedules
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'faculty')
  OR public.has_role(auth.uid(), 'program_director')
  OR (coalesce(auth.jwt() -> 'user_metadata' ->> 'role','') IN ('faculty','program_director'))
);
