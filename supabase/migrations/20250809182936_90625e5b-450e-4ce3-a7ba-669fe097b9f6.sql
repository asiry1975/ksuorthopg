-- 1) Roles enum and user_roles table
create type if not exists public.app_role as enum ('resident','faculty','program_director');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Users can view their own roles
create policy if not exists "Users can view own roles"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid());

-- 2) Helper function to check roles
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 3) Domain enums for schedules
create type if not exists public.day_of_week as enum ('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
create type if not exists public.clinic_time as enum ('AM','PM');

-- 4) Schedules table with PII constraints
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resident_name text not null check (char_length(resident_name) between 1 and 100),
  faculty_name text not null check (char_length(faculty_name) between 1 and 100),
  day public.day_of_week not null,
  clinic_time public.clinic_time not null,
  appointment_time time without time zone not null,
  patient_name text not null check (char_length(patient_name) between 1 and 100),
  clinic_number text not null check (char_length(clinic_number) between 1 and 50),
  notes text,
  arrived boolean not null default false,
  seen boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (notes is null or char_length(notes) <= 1000)
);

-- Helpful indexes
create index if not exists idx_schedules_day on public.schedules(day);
create index if not exists idx_schedules_clinic_time on public.schedules(clinic_time);
create index if not exists idx_schedules_resident_name on public.schedules(resident_name);
create index if not exists idx_schedules_faculty_name on public.schedules(faculty_name);

-- Enable RLS
alter table public.schedules enable row level security;

-- Row-level policies
create policy if not exists "Owners can view their schedules"
  on public.schedules
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "Faculty and PD can view all schedules"
  on public.schedules
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'faculty') or public.has_role(auth.uid(), 'program_director'));

create policy if not exists "Owners can insert schedules"
  on public.schedules
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists "Owners can update own schedules"
  on public.schedules
  for update
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "Faculty and PD can update any schedules"
  on public.schedules
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'faculty') or public.has_role(auth.uid(), 'program_director'));

create policy if not exists "Program directors can delete schedules"
  on public.schedules
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'program_director'));

-- 5) Timestamp trigger for updated_at
create or replace function public.update_updated_at_column()
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
for each row execute function public.update_updated_at_column();

-- 6) Realtime configuration
alter table public.schedules replica identity full;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'schedules'
  ) THEN
    EXECUTE 'alter publication supabase_realtime add table public.schedules';
  END IF;
END$$;