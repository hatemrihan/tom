-- TOM portfolio schema. Run once in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run), or with `supabase db push`.

-- ─── Contact form submissions ──────────────────────────────────────────────
create table if not exists public.contacts (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 1 and 120),
  email         text not null check (char_length(email) between 3 and 200),
  phone         text check (char_length(phone) <= 40),
  company_name  text check (char_length(company_name) <= 160),
  project_type  text check (char_length(project_type) <= 40),
  message       text check (char_length(message) <= 5000),
  status        text not null default 'unread'
                check (status in ('unread', 'read', 'responded', 'archived')),
  source        text not null default 'contact-stepper',
  user_agent    text check (char_length(user_agent) <= 300),
  submitted_at  timestamptz not null default now(),
  updated_at    timestamptz
);

create index if not exists contacts_submitted_at_idx on public.contacts (submitted_at desc);
create index if not exists contacts_status_idx on public.contacts (status);

-- RLS on, no policies: the public (publishable) key can't read or write
-- contacts at all. Only the server, using the secret key, can.
alter table public.contacts enable row level security;
revoke all on public.contacts from anon, authenticated;
grant all on public.contacts to service_role;

-- ─── Admin overrides for the components library ────────────────────────────
create table if not exists public.component_settings (
  slug         text primary key check (char_length(slug) <= 80),
  name         text check (char_length(name) <= 60),
  description  text check (char_length(description) <= 240),
  hidden       boolean,
  featured     boolean,
  sort_order   integer,
  updated_at   timestamptz not null default now()
);

-- Anyone may read the overrides (they're shown on the public /components page).
-- Only the server (secret key) may change them.
alter table public.component_settings enable row level security;
revoke all on public.component_settings from anon, authenticated;
grant select on public.component_settings to anon, authenticated;
grant all on public.component_settings to service_role;

drop policy if exists "Component settings are public" on public.component_settings;
create policy "Component settings are public"
  on public.component_settings for select
  to anon, authenticated
  using (true);
