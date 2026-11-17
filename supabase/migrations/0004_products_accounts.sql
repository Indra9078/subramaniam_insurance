-- Stage 9: insurance plans, visitor accounts, property submissions, plan requests.
-- Run once in the Supabase SQL Editor after 0001, 0002 and 0003. Safe to re-run.
--
-- Also needed in the Supabase dashboard (Authentication):
--   * Sign In / Providers: turn "Allow new users to sign up" ON (visitors create their own accounts).
--   * URL Configuration: set Site URL to the website address and add
--     <website address>/auth/callback to the Redirect URLs list.
-- Visitors can never become admins: admin rights come only from the `admins` table.

-- ---------------------------------------------------------------------------
-- Profiles: one row per signed-in visitor (name and phone for requests and listings)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 80),
  phone text not null default '' check (phone = '' or phone ~ '^[6-9][0-9]{9}$'),
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Creates the profile when someone signs up (name and phone come from the sign-up form).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone text := regexp_replace(coalesce(new.raw_user_meta_data ->> 'phone', ''), '\D', '', 'g');
begin
  if length(v_phone) = 12 and left(v_phone, 2) = '91' then v_phone := right(v_phone, 10); end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then v_phone := ''; end if;
  insert into public.profiles (user_id, full_name, phone, email)
  values (new.id, left(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 80), v_phone, coalesce(new.email, ''))
  on conflict (user_id) do nothing;
  return new;
exception when others then
  return new; -- never block sign-up; the app creates the profile on first visit instead
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fallback for accounts that exist without a profile row (called by the app after login).
create or replace function public.ensure_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then return; end if;
  insert into public.profiles (user_id, email)
  select u.id, coalesce(u.email, '') from auth.users u where u.id = auth.uid()
  on conflict (user_id) do nothing;
end;
$$;
revoke all on function public.ensure_profile() from public, anon;
grant execute on function public.ensure_profile() to authenticated;

insert into public.profiles (user_id, email)
select id, coalesce(email, '') from auth.users
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Insurance plans (shown on /insurance, managed in the admin)
-- ---------------------------------------------------------------------------
create table if not exists public.insurance_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null check (category in ('health', 'life', 'vehicle', 'corporate')),
  insurer text not null default '' check (char_length(insurer) <= 80),
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  sort integer not null default 0,
  name_en text not null default '',
  name_ta text not null default '',
  summary_en text not null default '',
  summary_ta text not null default '',
  description_en text not null default '',
  description_ta text not null default '',
  features_en text[] not null default '{}',
  features_ta text[] not null default '{}',
  image_path text,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists insurance_products_updated_at on public.insurance_products;
create trigger insurance_products_updated_at before update on public.insurance_products
  for each row execute function public.set_updated_at();

alter table public.insurance_products enable row level security;
revoke all on public.insurance_products from anon, authenticated;
grant select on public.insurance_products to anon, authenticated;
grant insert, update, delete on public.insurance_products to authenticated;

drop policy if exists "public read products" on public.insurance_products;
create policy "public read products" on public.insurance_products
  for select to anon, authenticated using (status = 'published' or public.is_admin());
drop policy if exists "admin write products" on public.insurance_products;
create policy "admin write products" on public.insurance_products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Plan images: anyone can view, only admins can upload or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin read product images" on storage.objects;
create policy "admin read product images" on storage.objects
  for select to authenticated using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Plan requests from signed-in visitors (they can follow the status)
-- ---------------------------------------------------------------------------
create table if not exists public.insurance_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  product_id uuid references public.insurance_products (id) on delete set null,
  product_name text not null,
  category text,
  insurer text,
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  preferred_time text check (preferred_time is null or char_length(preferred_time) <= 40),
  message text check (message is null or char_length(message) <= 1000),
  consent boolean not null check (consent),
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'completed', 'closed')),
  advisor_note text check (advisor_note is null or char_length(advisor_note) <= 500)
);
create index if not exists insurance_requests_user_idx on public.insurance_requests (user_id, created_at desc);
create index if not exists insurance_requests_status_idx on public.insurance_requests (status, created_at desc);
drop trigger if exists insurance_requests_updated_at on public.insurance_requests;
create trigger insurance_requests_updated_at before update on public.insurance_requests
  for each row execute function public.set_updated_at();

alter table public.insurance_requests enable row level security;
revoke all on public.insurance_requests from anon, authenticated;
grant select, update, delete on public.insurance_requests to authenticated;

drop policy if exists "own requests read" on public.insurance_requests;
create policy "own requests read" on public.insurance_requests
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin update requests" on public.insurance_requests;
create policy "admin update requests" on public.insurance_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete requests" on public.insurance_requests;
create policy "admin delete requests" on public.insurance_requests
  for delete to authenticated using (public.is_admin());

-- The only way to create a request. Checks the plan, the phone number and abuse limits.
create or replace function public.submit_insurance_request(
  p_product uuid, p_phone text, p_time text default null, p_message text default null, p_consent boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_prod public.insurance_products;
  v_id uuid;
begin
  if auth.uid() is null then raise exception 'not_signed_in' using errcode = 'P0001'; end if;
  perform public.ensure_profile();
  if length(v_phone) = 12 and left(v_phone, 2) = '91' then v_phone := right(v_phone, 10); end if;
  if length(v_phone) = 11 and left(v_phone, 1) = '0' then v_phone := right(v_phone, 10); end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then raise exception 'invalid_phone' using errcode = 'P0001'; end if;
  if coalesce(p_consent, false) is not true then raise exception 'consent_required' using errcode = 'P0001'; end if;

  select * into v_prod from public.insurance_products where id = p_product and status = 'published';
  if not found then raise exception 'unknown_product' using errcode = 'P0001'; end if;

  if exists (
    select 1 from public.insurance_requests
    where user_id = auth.uid() and product_id = p_product and status in ('new', 'contacted', 'in_progress')
  ) then raise exception 'duplicate_request' using errcode = 'P0001'; end if;

  if (select count(*) from public.insurance_requests where user_id = auth.uid() and created_at > now() - interval '24 hours') >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.insurance_requests (user_id, product_id, product_name, category, insurer, phone, preferred_time, message, consent)
  values (
    auth.uid(), v_prod.id, v_prod.name_en, v_prod.category, nullif(v_prod.insurer, ''), v_phone,
    nullif(left(btrim(coalesce(p_time, '')), 40), ''), nullif(left(btrim(coalesce(p_message, '')), 1000), ''), true
  )
  returning id into v_id;

  -- Remember the phone number on the profile for next time.
  update public.profiles set phone = v_phone where user_id = auth.uid() and phone = '';
  return v_id;
end;
$$;
revoke all on function public.submit_insurance_request(uuid, text, text, text, boolean) from public, anon;
grant execute on function public.submit_insurance_request(uuid, text, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- Property submissions from visitors (hidden until an admin approves)
-- ---------------------------------------------------------------------------
alter table public.listings add column if not exists owner_id uuid references public.profiles (user_id) on delete set null;
alter table public.listings add column if not exists review_note text check (review_note is null or char_length(review_note) <= 500);
alter table public.listings add column if not exists reviewed_at timestamptz;
create index if not exists listings_owner_idx on public.listings (owner_id, created_at desc);

do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.listings'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%status%'
  loop
    execute format('alter table public.listings drop constraint %I', c.conname);
  end loop;
  alter table public.listings add constraint listings_status_check
    check (status in ('draft', 'published', 'sold', 'pending', 'rejected'));
end $$;

-- Whatever a visitor sends, their listing is always: theirs, pending review, never featured.
create or replace function public.enforce_owner_listing()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then return new; end if;
  if auth.uid() is null then raise exception 'not_allowed' using errcode = 'P0001'; end if;

  if tg_op = 'INSERT' then
    perform public.ensure_profile();
    new.owner_id := auth.uid();
    if (select count(*) from public.listings where owner_id = auth.uid() and created_at > now() - interval '24 hours') >= 5 then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
    if (select count(*) from public.listings where owner_id = auth.uid() and status = 'pending') >= 10 then
      raise exception 'too_many_pending' using errcode = 'P0001';
    end if;
  else
    if old.owner_id is distinct from auth.uid() then raise exception 'not_allowed' using errcode = 'P0001'; end if;
    new.owner_id := old.owner_id;
    new.slug := old.slug;
    new.created_at := old.created_at;
  end if;

  new.status := 'pending';
  new.featured := false;
  new.sort := 0;
  new.is_sample := false;
  new.review_note := null;
  new.reviewed_at := null;
  return new;
end;
$$;
drop trigger if exists listings_owner_rules on public.listings;
create trigger listings_owner_rules before insert or update on public.listings
  for each row execute function public.enforce_owner_listing();

drop policy if exists "public read listings" on public.listings;
create policy "public read listings" on public.listings
  for select to anon, authenticated
  using (status in ('published', 'sold') or public.is_admin() or owner_id = auth.uid());
drop policy if exists "owner insert listings" on public.listings;
create policy "owner insert listings" on public.listings
  for insert to authenticated with check (owner_id = auth.uid() and status = 'pending');
drop policy if exists "owner update listings" on public.listings;
create policy "owner update listings" on public.listings
  for update to authenticated
  using (owner_id = auth.uid() and status in ('pending', 'rejected'))
  with check (owner_id = auth.uid());
drop policy if exists "owner delete listings" on public.listings;
create policy "owner delete listings" on public.listings
  for delete to authenticated using (owner_id = auth.uid() and status in ('pending', 'rejected'));

-- Photos of a visitor's own pending or rejected listing.
drop policy if exists "public read photos" on public.listing_photos;
create policy "public read photos" on public.listing_photos
  for select to anon, authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.status in ('published', 'sold') or l.owner_id = auth.uid())
    )
  );
drop policy if exists "owner insert photos" on public.listing_photos;
create policy "owner insert photos" on public.listing_photos
  for insert to authenticated
  with check (
    path like listing_id::text || '/%' and exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid() and l.status in ('pending', 'rejected')
    )
  );
drop policy if exists "owner update photos" on public.listing_photos;
create policy "owner update photos" on public.listing_photos
  for update to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid() and l.status in ('pending', 'rejected')))
  with check (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid() and l.status in ('pending', 'rejected')));
drop policy if exists "owner delete photos" on public.listing_photos;
create policy "owner delete photos" on public.listing_photos
  for delete to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid() and l.status in ('pending', 'rejected')));

create or replace function public.limit_listing_photos()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and (select count(*) from public.listing_photos where listing_id = new.listing_id) >= 10 then
    raise exception 'too_many_photos' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists listing_photos_limit on public.listing_photos;
create trigger listing_photos_limit before insert on public.listing_photos
  for each row execute function public.limit_listing_photos();

-- Storage: a visitor may upload to the folder of their own pending or rejected listing only.
drop policy if exists "owner upload listing photos" on storage.objects;
create policy "owner upload listing photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'listing-photos' and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[1] and l.owner_id = auth.uid() and l.status in ('pending', 'rejected')
    )
  );
drop policy if exists "owner delete listing photos" on storage.objects;
create policy "owner delete listing photos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'listing-photos' and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[1] and l.owner_id = auth.uid() and l.status in ('pending', 'rejected')
    )
  );
