-- Security hardening migration
-- 1) Clean legacy/insecure policies on schedules
DROP POLICY IF EXISTS "Faculty/PD can select all schedules (role or metadata)" ON public.schedules;
DROP POLICY IF EXISTS "Faculty/PD can update seen (role or metadata)" ON public.schedules;

-- Ensure faculty/PD policies exist once (optional safety: re-create if missing)
-- We don't drop/recreate here to avoid duplicates if already present from previous migration.

-- 2) Restrict user_roles management to Program Director only
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "PD can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "PD can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "PD can delete user roles" ON public.user_roles;

CREATE POLICY "PD can insert user roles"
ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'program_director'));

CREATE POLICY "PD can update user roles"
ON public.user_roles
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'program_director'))
WITH CHECK (public.has_role(auth.uid(), 'program_director'));

CREATE POLICY "PD can delete user roles"
ON public.user_roles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'program_director'));

-- 3) Add column-level enforcement for schedules updates
CREATE OR REPLACE FUNCTION public.restrict_schedule_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
begin
  -- Allow program director or owner full updates
  if public.has_role(auth.uid(), 'program_director') or NEW.user_id = auth.uid() then
    return NEW;
  end if;

  -- Allow faculty to only toggle 'seen'
  if public.has_role(auth.uid(), 'faculty') then
    if (NEW.seen is distinct from OLD.seen)
       and (coalesce(NEW.arrived, false) is not distinct from coalesce(OLD.arrived, false))
       and (NEW.patient_name is not distinct from OLD.patient_name)
       and (NEW.faculty_name is not distinct from OLD.faculty_name)
       and (NEW.day is not distinct from OLD.day)
       and (NEW.clinic_time is not distinct from OLD.clinic_time)
       and (NEW.appointment_time is not distinct from OLD.appointment_time)
       and (NEW.clinic_number is not distinct from OLD.clinic_number)
       and (NEW.notes is not distinct from OLD.notes)
       and (NEW.resident_name is not distinct from OLD.resident_name)
       and (NEW.user_id is not distinct from OLD.user_id)
    then
      return NEW;
    else
      raise exception 'Faculty can only update seen';
    end if;
  end if;

  raise exception 'Not authorized to update schedules';
end;
$$;

DROP TRIGGER IF EXISTS restrict_schedule_update ON public.schedules;
CREATE TRIGGER restrict_schedule_update
BEFORE UPDATE ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION public.restrict_schedule_update();

-- 4) Ensure updated_at maintains freshness
DROP TRIGGER IF EXISTS set_schedules_updated_at ON public.schedules;
CREATE TRIGGER set_schedules_updated_at
BEFORE UPDATE ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();