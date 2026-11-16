-- Stage 5: admin, listings, photos, testimonials, FAQs and leads.
-- Run once in the Supabase dashboard: SQL Editor, New query, paste, Run.
-- Safe to re-run: every statement checks whether the object already exists.

-- ---------------------------------------------------------------------------
-- Admins: only these emails can change content or read leads.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key
);
insert into public.admins (email) values ('subramaniam9757@gmail.com')
  on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  type text not null check (type in ('plot', 'house', 'apartment', 'commercial')),
  status text not null default 'draft' check (status in ('draft', 'published', 'sold')),
  featured boolean not null default false,
  sort integer not null default 0,
  title_en text not null default '',
  title_ta text not null default '',
  location_en text not null default '',
  location_ta text not null default '',
  price_en text not null default '',
  price_ta text not null default '',
  size_en text not null default '',
  size_ta text not null default '',
  description_en text not null default '',
  description_ta text not null default '',
  features_en text[] not null default '{}',
  features_ta text[] not null default '{}',
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists listings_updated_at on public.listings;
create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

create table if not exists public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  path text not null,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists listing_photos_listing_idx on public.listing_photos (listing_id, sort);

-- ---------------------------------------------------------------------------
-- Testimonials: can only be published with written permission on record.
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null default '',
  quote_en text not null default '',
  quote_ta text not null default '',
  permission_received boolean not null default false,
  permission_date date,
  published boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonial_permission check (
    not published or (permission_received and permission_date is not null)
  )
);
drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null check (
    category in ('general', 'health', 'life', 'vehicle', 'corporate', 'real_estate')
  ),
  question_en text not null default '',
  question_ta text not null default '',
  answer_en text not null default '',
  answer_ta text not null default '',
  sort integer not null default 0,
  published boolean not null default true,
  show_on_home boolean not null default false,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists faqs_updated_at on public.faqs;
create trigger faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Leads: personal data. Only admins can read. Website forms add rows in Stage 6.
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  interest text,
  preferred_time text,
  message text,
  source_page text,
  language text,
  consent boolean not null check (consent),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes text
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.leads enable row level security;

drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "public read listings" on public.listings;
create policy "public read listings" on public.listings
  for select to anon, authenticated
  using (status in ('published', 'sold') or public.is_admin());
drop policy if exists "admin write listings" on public.listings;
create policy "admin write listings" on public.listings
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read photos" on public.listing_photos;
create policy "public read photos" on public.listing_photos
  for select to anon, authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status in ('published', 'sold')
    )
  );
drop policy if exists "admin write photos" on public.listing_photos;
create policy "admin write photos" on public.listing_photos
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials
  for select to anon, authenticated
  using (published or public.is_admin());
drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read faqs" on public.faqs;
create policy "public read faqs" on public.faqs
  for select to anon, authenticated
  using (published or public.is_admin());
drop policy if exists "admin write faqs" on public.faqs;
create policy "admin write faqs" on public.faqs
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin read leads" on public.leads;
create policy "admin read leads" on public.leads
  for select to authenticated using (public.is_admin());
drop policy if exists "admin update leads" on public.leads;
create policy "admin update leads" on public.leads
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete leads" on public.leads;
create policy "admin delete leads" on public.leads
  for delete to authenticated using (public.is_admin());

-- Table privileges (row level security above still decides which rows).
grant usage on schema public to anon, authenticated;
grant select on public.listings, public.listing_photos, public.testimonials, public.faqs
  to anon, authenticated;
grant insert, update, delete on public.listings, public.listing_photos, public.testimonials, public.faqs
  to authenticated;
grant select on public.admins to authenticated;
grant select, update, delete on public.leads to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Photo storage: anyone can view, only admins can upload or delete.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-photos', 'listing-photos', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin read listing photos" on storage.objects;
create policy "admin read listing photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'listing-photos' and public.is_admin());
drop policy if exists "admin upload listing photos" on storage.objects;
create policy "admin upload listing photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-photos' and public.is_admin());
drop policy if exists "admin update listing photos" on storage.objects;
create policy "admin update listing photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'listing-photos' and public.is_admin());
drop policy if exists "admin delete listing photos" on storage.objects;
create policy "admin delete listing photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'listing-photos' and public.is_admin());
