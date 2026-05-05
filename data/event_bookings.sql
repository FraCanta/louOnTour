create table if not exists public.event_bookings (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  event_slug text not null,
  event_date_iso text not null,
  customer_email text,
  amount_total integer not null default 0,
  currency text not null default 'eur',
  payment_status text not null default 'paid',
  raw_payload jsonb
);

create index if not exists event_bookings_event_slug_idx
  on public.event_bookings (event_slug);

create index if not exists event_bookings_event_date_iso_idx
  on public.event_bookings (event_date_iso);

