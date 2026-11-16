-- Stage 7: anonymous usage counts for the guided assistant ("Subramaniam's Helper").
-- No names, phone numbers or messages are stored. Run once in the Supabase SQL Editor. Safe to re-run.

create table if not exists public.assistant_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event text not null check (event in ('open', 'topic', 'contact', 'search')),
  topic text,
  query text,
  language text check (language in ('en', 'ta'))
);
create index if not exists assistant_events_created_idx on public.assistant_events (created_at);

alter table public.assistant_events enable row level security;

drop policy if exists "admin read assistant events" on public.assistant_events;
create policy "admin read assistant events" on public.assistant_events
  for select to authenticated using (public.is_admin());
drop policy if exists "admin delete assistant events" on public.assistant_events;
create policy "admin delete assistant events" on public.assistant_events
  for delete to authenticated using (public.is_admin());
grant select, delete on public.assistant_events to authenticated;

-- The only way to record an event. Search text is kept only for searches that
-- found nothing, without digits (so phone numbers are never stored).
create or replace function public.log_assistant_event(
  p_event text, p_topic text default null, p_query text default null, p_language text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event not in ('open', 'topic', 'contact', 'search') then return; end if;
  -- Simple flood guard: ignore events beyond 3000 per hour in total.
  if (select count(*) from public.assistant_events where created_at > now() - interval '1 hour') >= 3000 then
    return;
  end if;
  insert into public.assistant_events (event, topic, query, language)
  values (
    p_event,
    nullif(left(regexp_replace(coalesce(p_topic, ''), '[^a-z0-9:_-]', '', 'g'), 60), ''),
    case when p_event = 'search' and p_topic = 'nomatch'
      then nullif(left(btrim(regexp_replace(coalesce(p_query, ''), '[0-9@+]', '', 'g')), 60), '')
    end,
    case when p_language in ('en', 'ta') then p_language end
  );
end;
$$;

revoke all on function public.log_assistant_event(text, text, text, text) from public;
grant execute on function public.log_assistant_event(text, text, text, text) to anon, authenticated;
