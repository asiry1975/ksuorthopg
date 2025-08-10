-- Create schedules table for robust realtime syncing
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
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

-- Enable Row Level Security
alter table public.schedules enable row level security;

-- Policies
create policy if not exists "Schedules readable by authenticated users"
  on public.schedules for select
  using (auth.uid() is not null);

create policy if not exists "Residents can insert schedules"
  on public.schedules for insert
  with check (public.has_role(auth.uid(), 'resident'));

create policy if not exists "Residents can update arrived"
  on public.schedules for update
  using (public.has_role(auth.uid(), 'resident'));

create policy if not exists "Faculty can update seen"
  on public.schedules for update
  using (public.has_role(auth.uid(), 'faculty'));

-- Timestamps trigger
create trigger if not exists update_schedules_updated_at
before update on public.schedules
for each row
execute function public.set_updated_at();