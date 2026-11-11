-- Anonymous usage events: page views on the site, copies of code, and
-- components added through the command-line tools. No names, emails, IP
-- addresses, file paths or code are stored. See /telemetry on the site.

create table if not exists public.events (
  id         bigint generated always as identity primary key,
  at         timestamptz not null default now(),
  kind       text not null check (kind in ('view', 'copy', 'switch', 'cli_add', 'cli_list')),
  -- where it happened: the website, the npm tool or the pub.dev tool
  source     text not null check (source in ('site', 'npm', 'pub')),
  component  text check (char_length(component) <= 80),
  edition    text check (edition in ('react', 'flutter')),
  -- a page path for views, what was copied for copies
  detail     text check (char_length(detail) <= 160),
  -- site: a hash that changes every day. tools: a random id kept on the person's machine.
  visitor    text check (char_length(visitor) <= 64),
  country    text check (char_length(country) <= 2),
  referrer   text check (char_length(referrer) <= 120),
  version    text check (char_length(version) <= 24),
  os         text check (char_length(os) <= 24),
  runtime    text check (char_length(runtime) <= 32),
  manager    text check (char_length(manager) <= 12),
  ci         boolean
);

create index if not exists events_at_idx on public.events (at desc);
create index if not exists events_component_idx on public.events (component, at desc);
create index if not exists events_source_idx on public.events (source, at desc);

-- RLS on, no policies: only the server, using the secret key, can read or write.
alter table public.events enable row level security;
revoke all on public.events from anon, authenticated;
grant all on public.events to service_role;

-- Everything the admin's overview needs for a period, counted in the database.
create or replace function public.event_summary(since timestamptz)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with e as (select * from public.events where at >= since),
  tools as (select * from e where source <> 'site')
  select jsonb_build_object(
    'totals', (select coalesce(jsonb_object_agg(kind, n), '{}'::jsonb) from (select kind, count(*) as n from e group by kind) t),
    'visitors', (select count(distinct visitor) from e where source = 'site'),
    'tool_users', (select count(distinct visitor) from tools where visitor is not null),
    'returning_tool_users', (
      select count(*) from (
        select visitor from tools where visitor is not null
        group by visitor having count(distinct (at at time zone 'utc')::date) > 1
      ) r
    ),
    'daily', (
      select coalesce(jsonb_agg(to_jsonb(d) order by d.day), '[]'::jsonb) from (
        select (at at time zone 'utc')::date as day,
               count(*) filter (where kind = 'view') as views,
               count(distinct visitor) filter (where source = 'site') as visitors,
               count(*) filter (where kind = 'copy') as copies,
               count(*) filter (where kind = 'cli_add') as installs
        from e group by 1
      ) d
    ),
    'components', (
      select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb) from (
        select component,
               count(*) filter (where kind = 'view') as views,
               count(distinct visitor) filter (where kind = 'view') as visitors,
               count(*) filter (where kind = 'copy') as copies,
               count(*) filter (where kind = 'copy' and edition = 'flutter') as copies_dart,
               count(*) filter (where kind = 'cli_add') as installs,
               count(*) filter (where kind = 'cli_add' and source = 'pub') as installs_dart,
               count(distinct visitor) filter (where kind = 'cli_add') as installers
        from e where component is not null group by component
      ) c
    ),
    'pages', (
      select coalesce(jsonb_agg(to_jsonb(p)), '[]'::jsonb) from (
        select detail as path, count(*) as views, count(distinct visitor) as visitors
        from e where kind = 'view' and detail is not null
        group by detail order by count(*) desc limit 15
      ) p
    ),
    'countries', (
      select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb) from (
        select country, count(distinct visitor) as people, count(*) filter (where kind = 'cli_add') as installs
        from e where country is not null
        group by country order by count(distinct visitor) desc limit 20
      ) c
    ),
    'referrers', (
      select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select referrer, count(distinct visitor) as people
        from e where referrer is not null
        group by referrer order by count(distinct visitor) desc limit 12
      ) r
    ),
    'editions', (
      select coalesce(jsonb_object_agg(edition, n), '{}'::jsonb) from (
        select edition, count(*) as n from e where edition is not null and kind in ('copy', 'switch', 'cli_add') group by edition
      ) t
    ),
    'os', (select coalesce(jsonb_object_agg(os, n), '{}'::jsonb) from (select os, count(distinct visitor) as n from tools where os is not null group by os) t),
    'managers', (select coalesce(jsonb_object_agg(manager, n), '{}'::jsonb) from (select manager, count(distinct visitor) as n from tools where manager is not null group by manager) t),
    'versions', (select coalesce(jsonb_object_agg(k, n), '{}'::jsonb) from (select source || ' ' || version as k, count(distinct visitor) as n from tools where version is not null group by 1) t),
    'ci', (select count(*) from tools where ci is true)
  );
$$;

revoke all on function public.event_summary(timestamptz) from public, anon, authenticated;
grant execute on function public.event_summary(timestamptz) to service_role;
