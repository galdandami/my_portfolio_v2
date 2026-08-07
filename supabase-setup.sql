-- =====================================================
--  Pulse CMS — Supabase setup
--  Run this script in: Supabase Dashboard > SQL Editor
--
--  SECURITY: reads are public, writes require a signed-in
--  Supabase Auth user. See "Create the admin user" below.
-- =====================================================

create table if not exists public.site_content (
  id integer primary key check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Read is public (the portfolio site needs to fetch content).
drop policy if exists "site_content_read" on public.site_content;
create policy "site_content_read" on public.site_content
  for select using (true);

-- Writes are only allowed for the site owner (admin email).
-- IMPORTANT: keep "Allow new users to sign up" DISABLED in
-- Authentication > Settings, otherwise anyone can self-register
-- and become authenticated.
drop policy if exists "site_content_insert" on public.site_content;
create policy "site_content_insert" on public.site_content
  for insert to authenticated
  with check (auth.jwt() ->> 'email' = 'galdandami@gmail.com');

drop policy if exists "site_content_update" on public.site_content;
create policy "site_content_update" on public.site_content
  for update to authenticated
  using (auth.jwt() ->> 'email' = 'galdandami@gmail.com')
  with check (auth.jwt() ->> 'email' = 'galdandami@gmail.com');

drop policy if exists "site_content_delete" on public.site_content;
create policy "site_content_delete" on public.site_content
  for delete to authenticated
  using (auth.jwt() ->> 'email' = 'galdandami@gmail.com');

-- Seed the default content row (content is filled by the admin panel on first save)
insert into public.site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- =====================================================
--  Create the admin user (DO THIS ONCE IN THE DASHBOARD):
--  Authentication > Users > Add user
--    Email:    galdandami@gmail.com
--    Password: <choose a strong password>
--  The admin panel signs in with Supabase Auth; the
--  password is stored by Supabase, not in the code.
-- =====================================================
