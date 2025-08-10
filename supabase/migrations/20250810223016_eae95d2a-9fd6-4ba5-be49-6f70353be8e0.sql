-- Grant faculty role to the provided email
insert into public.user_roles (user_id, role)
select u.id, 'faculty'::app_role
from auth.users u
where lower(u.email) = lower('masiry@gmail.com')
on conflict do nothing;