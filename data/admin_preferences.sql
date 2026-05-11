create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text,
  display_name text,
  avatar_url text,
  role text not null default 'admin',
  preferences jsonb not null default '{}'::jsonb
);

create table if not exists public.admin_settings (
  id text primary key default 'global',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  brand_name text not null default 'Luisa Quaglia',
  brand_subtitle text not null default 'Tour Guide Admin',
  logo_text text not null default 'LQ',
  logo_url text,
  accent_color text not null default '#C9573C',
  theme text not null default 'light',
  density text not null default 'comfortable',
  show_calendar boolean not null default true,
  show_success_chart boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  constraint admin_settings_singleton check (id = 'global'),
  constraint admin_settings_theme_check check (theme in ('light', 'dark')),
  constraint admin_settings_density_check check (density in ('comfortable', 'compact'))
);

create index if not exists admin_profiles_email_idx
  on public.admin_profiles (lower(email));

insert into public.admin_settings (id)
values ('global')
on conflict (id) do nothing;

alter table public.admin_profiles enable row level security;
alter table public.admin_settings enable row level security;
