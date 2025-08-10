-- 1) Pending roles table to map emails to roles before signup
create table if not exists public.pending_roles (
  email text primary key,
  role app_role not null,
  created_at timestamptz not null default now()
);

-- Enable RLS and keep it locked down (no client policies)
alter table public.pending_roles enable row level security;

-- 2) Function to assign role automatically on new user creation
create or replace function public.apply_pending_role()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  _role app_role;
begin
  -- Find a pending role by email (case-insensitive)
  select pr.role into _role
  from public.pending_roles pr
  where lower(pr.email) = lower(new.email)
  limit 1;

  if _role is not null then
    -- Assign the role to the new user
    insert into public.user_roles (user_id, role)
    values (new.id, _role)
    on conflict do nothing;

    -- Remove the pending role entry once applied
    delete from public.pending_roles where lower(email) = lower(new.email);
  end if;

  return new;
end;
$$;

-- 3) Trigger on auth.users to apply pending role on signup
-- Note: It's safe to recreate the trigger
drop trigger if exists on_auth_user_created_apply_role on auth.users;
create trigger on_auth_user_created_apply_role
  after insert on auth.users
  for each row execute function public.apply_pending_role();

-- 4) Seed pending roles for the provided emails
insert into public.pending_roles (email, role)
values ('o.mmmm.1975@gmail.com', 'resident'::app_role)
on conflict (email) do update set role = excluded.role;

insert into public.pending_roles (email, role)
values ('masiry@gmail.com', 'faculty'::app_role)
on conflict (email) do update set role = excluded.role;
