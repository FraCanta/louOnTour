create table if not exists public.tours (
  slug text primary key,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  hero_image text,
  gallery jsonb not null default '[]'::jsonb,
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  location jsonb not null default '{}'::jsonb,
  duration_minutes integer not null default 120 check (duration_minutes > 0),
  price_mode text not null default 'per_booking' check (price_mode in ('per_booking', 'per_person')),
  base_price_cents integer not null default 18000 check (base_price_cents >= 0),
  currency text not null default 'eur',
  extension_enabled boolean not null default false,
  extension_minutes integer not null default 30 check (extension_minutes > 0),
  extension_price_cents integer not null default 0 check (extension_price_cents >= 0),
  meeting_point jsonb not null default '{}'::jsonb,
  languages jsonb not null default '{}'::jsonb,
  included jsonb not null default '{"it":[],"en":[]}'::jsonb,
  description jsonb not null default '{"it":[],"en":[]}'::jsonb,
  availability_rules jsonb not null default '[{"startTime":"10:30","endTime":"12:30"},{"startTime":"14:30","endTime":"16:30"}]'::jsonb,
  booking_horizon_days integer not null default 180 check (booking_horizon_days > 0),
  minimum_notice_hours integer not null default 48 check (minimum_notice_hours >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calendar_entries (
  id bigint generated always as identity primary key,
  source_type text not null check (source_type in ('tour_booking', 'event', 'manual', 'google')),
  source_id text,
  tour_slug text references public.tours(slug) on update cascade on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('hold', 'confirmed', 'cancelled')),
  hold_expires_at timestamptz,
  google_event_id text unique,
  google_updated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists calendar_entries_time_idx
  on public.calendar_entries (starts_at, ends_at);
create index if not exists calendar_entries_tour_slug_idx
  on public.calendar_entries (tour_slug);

create table if not exists public.tour_bookings (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  tour_slug text not null references public.tours(slug) on update cascade,
  calendar_entry_id bigint references public.calendar_entries(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  attendee_count integer not null default 1 check (attendee_count > 0),
  extension_selected boolean not null default false,
  customer_email text,
  amount_total integer not null default 0,
  currency text not null default 'eur',
  payment_status text not null default 'unpaid',
  raw_payload jsonb
);

create index if not exists tour_bookings_tour_slug_idx
  on public.tour_bookings (tour_slug);
create index if not exists tour_bookings_starts_at_idx
  on public.tour_bookings (starts_at);

create table if not exists public.google_calendar_connections (
  id bigint generated always as identity primary key,
  owner_email text,
  calendar_id text not null default 'primary',
  selected_calendar_ids jsonb not null default '["primary"]'::jsonb,
  refresh_token text not null,
  scope text,
  sync_token text,
  channel_id text,
  channel_resource_id text,
  channel_expiration timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.google_calendar_connections
  add column if not exists selected_calendar_ids jsonb not null default '["primary"]'::jsonb;

alter table public.tours
  alter column base_price_cents set default 18000;

update public.tours
  set base_price_cents = 18000,
      price_mode = 'per_booking',
      updated_at = now()
  where base_price_cents = 18800;

alter table public.tours
  alter column extension_enabled set default false,
  alter column extension_price_cents set default 0;

update public.tours
  set extension_enabled = false,
      extension_price_cents = 0,
      updated_at = now()
  where extension_enabled is distinct from false
     or extension_price_cents <> 0;

update public.tours
  set price_mode = 'per_booking',
      updated_at = now()
  where price_mode <> 'per_booking';

alter table public.tours enable row level security;
alter table public.calendar_entries enable row level security;
alter table public.tour_bookings enable row level security;
alter table public.google_calendar_connections enable row level security;

drop policy if exists "published tours are public" on public.tours;
create policy "published tours are public" on public.tours
  for select using (status = 'published');
