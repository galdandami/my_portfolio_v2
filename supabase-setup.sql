-- =====================================================
--  Pulse CMS — Supabase setup
--  Run this script in: Supabase Dashboard > SQL Editor
-- =====================================================

create table if not exists public.site_content (
  id integer primary key check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Read is public (the portfolio site needs to fetch content).
-- NOTE: write is also open to anon keys for simplicity of a personal site.
-- For production, protect writes: use auth or a service-role endpoint instead.
drop policy if exists "site_content_read" on public.site_content;
create policy "site_content_read" on public.site_content for select using (true);

drop policy if exists "site_content_insert" on public.site_content;
create policy "site_content_insert" on public.site_content for insert with check (true);

drop policy if exists "site_content_update" on public.site_content;
create policy "site_content_update" on public.site_content for update using (true) with check (true);

-- Seed the default content row (content is filled by the admin panel on first save)
insert into public.site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
