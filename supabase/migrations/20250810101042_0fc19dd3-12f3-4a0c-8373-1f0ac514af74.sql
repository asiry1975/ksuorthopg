-- Ensure UUID generation
create extension if not exists pgcrypto;

-- 1) Roles enum and table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('resident','faculty','program_director');
  END IF;
END $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Allow users to view only their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Security definer helper to check roles without RLS recursion
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = _user_id and ur.role = _role
  );
$$;

-- 2) Schedules table
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  resident_name text not null,
  faculty_name text not null,
  day text not null,
  clinic_time text not null,
  appointment_time text not null,
  patient_name text not null,
  clinic_number text not null,
  notes text,
  arrived boolean not null default false,
  seen boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.schedules enable row level security;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_schedules_updated_at on public.schedules;
create trigger trg_schedules_updated_at
before update on public.schedules
for each row execute function public.set_updated_at();

-- Indexes for common filters
create index if not exists idx_schedules_faculty_day on public.schedules (faculty_name, day);
create index if not exists idx_schedules_patient on public.schedules (patient_name);

-- RLS policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schedules' AND policyname='Owners can select own schedules'
  ) THEN
    CREATE POLICY "Owners can select own schedules"
    ON public.schedules
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schedules' AND policyname='Owners can insert schedules'
  ) THEN
    CREATE POLICY "Owners can insert schedules"
    ON public.schedules
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schedules' AND policyname='Owners can update own schedules'
  ) THEN
    CREATE POLICY "Owners can update own schedules"
    ON public.schedules
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schedules' AND policyname='Owners can delete own schedules'
  ) THEN
    CREATE POLICY "Owners can delete own schedules"
    ON public.schedules
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schedules' AND policyname='Faculty and PD can select all schedules'
  ) THEN
    CREATE POLICY "Faculty and PD can select all schedules"
    ON public.schedules
    FOR SELECT
    TO authenticated
    USING (
      public.has_role(auth.uid(), 'faculty')
      OR public.has_role(auth.uid(), 'program_director')
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schedules' AND policyname='Faculty and PD can update all schedules'
  ) THEN
    CREATE POLICY "Faculty and PD can update all schedules"
    ON public.schedules
    FOR UPDATE
    TO authenticated
    USING (
      public.has_role(auth.uid(), 'faculty')
      OR public.has_role(auth.uid(), 'program_director')
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='schedules' AND policyname='PD can delete all schedules'
  ) THEN
    CREATE POLICY "PD can delete all schedules"
    ON public.schedules
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'program_director'));
  END IF;
END $$;