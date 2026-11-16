-- Stage 6: lead capture. Run once in the Supabase SQL Editor after 0001_admin.sql.
-- Safe to re-run.

-- Extra lead details.
alter table public.leads add column if not exists product text;
alter table public.leads add column if not exists listing_slug text;
alter table public.leads add column if not exists listing_title text;
alter table public.leads add column if not exists details jsonb not null default '{}'::jsonb;
alter table public.leads add column if not exists consent_version text;
alter table public.leads add column if not exists consent_at timestamptz;
-- A one-way hash of the visitor's IP address, only used for rate limiting.
alter table public.leads add column if not exists ip_hash text;
create index if not exists leads_ip_hash_created_idx on public.leads (ip_hash, created_at);
create index if not exists leads_phone_created_idx on public.leads (phone, created_at);

-- The only way for website visitors to add a lead. Visitors still cannot read,
-- change or delete leads (no table policies for anon). Validates every field
-- and limits submissions: 5 per hour per device, 3 per hour per phone number.
create or replace function public.submit_lead(lead jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := left(btrim(coalesce(lead ->> 'name', '')), 80);
  v_phone text := regexp_replace(coalesce(lead ->> 'phone', ''), '\D', '', 'g');
  v_email text := nullif(left(btrim(coalesce(lead ->> 'email', '')), 120), '');
  v_ip text := nullif(left(coalesce(lead ->> 'ip_hash', ''), 64), '');
  v_details jsonb := coalesce(lead -> 'details', '{}'::jsonb);
  v_id uuid;
begin
  -- Accept +91 / 0 prefixes, store 10 digits.
  if length(v_phone) = 12 and left(v_phone, 2) = '91' then v_phone := right(v_phone, 10); end if;
  if length(v_phone) = 11 and left(v_phone, 1) = '0' then v_phone := right(v_phone, 10); end if;

  if length(v_name) < 2 then raise exception 'invalid_name' using errcode = 'P0001'; end if;
  if v_phone !~ '^[6-9][0-9]{9}$' then raise exception 'invalid_phone' using errcode = 'P0001'; end if;
  if coalesce((lead ->> 'consent')::boolean, false) is not true then
    raise exception 'consent_required' using errcode = 'P0001';
  end if;
  if v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email' using errcode = 'P0001';
  end if;
  if jsonb_typeof(v_details) <> 'object' or length(v_details::text) > 2000 then
    v_details := '{}'::jsonb;
  end if;

  if v_ip is not null and (
    select count(*) from public.leads
    where ip_hash = v_ip and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  if (
    select count(*) from public.leads
    where phone = v_phone and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.leads (
    name, phone, email, interest, preferred_time, message, source_page, language,
    product, listing_slug, listing_title, details, consent, consent_version, consent_at, ip_hash
  ) values (
    v_name,
    v_phone,
    v_email,
    nullif(left(btrim(coalesce(lead ->> 'interest', '')), 40), ''),
    nullif(left(btrim(coalesce(lead ->> 'preferred_time', '')), 40), ''),
    nullif(left(btrim(coalesce(lead ->> 'message', '')), 1000), ''),
    nullif(left(coalesce(lead ->> 'source_page', ''), 200), ''),
    case when lead ->> 'language' in ('en', 'ta') then lead ->> 'language' end,
    nullif(left(coalesce(lead ->> 'product', ''), 40), ''),
    nullif(left(coalesce(lead ->> 'listing_slug', ''), 80), ''),
    nullif(left(coalesce(lead ->> 'listing_title', ''), 160), ''),
    v_details,
    true,
    nullif(left(coalesce(lead ->> 'consent_version', ''), 40), ''),
    now(),
    v_ip
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_lead(jsonb) from public;
grant execute on function public.submit_lead(jsonb) to anon, authenticated;
