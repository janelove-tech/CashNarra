create function public.valid_calendar_date(value text) returns boolean
language plpgsql immutable set search_path=public,pg_temp as $$
begin
 if value is null or value !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then return false;end if;
 return to_char(value::date,'YYYY-MM-DD')=value;
exception when others then return false;
end;$$;
create function public.valid_workspace_calendar(state jsonb) returns boolean
language sql immutable set search_path=public,pg_temp as $$
 select not exists(select 1 from jsonb_array_elements(state->'accounts') a where not public.valid_calendar_date(a->>'openingDate'))
 and not exists(select 1 from jsonb_array_elements(state->'checkins') c where not public.valid_calendar_date(c->>'date'))
 and not exists(select 1 from jsonb_array_elements(state->'goals') g cross join lateral jsonb_array_elements(g->'allocations') a where not public.valid_calendar_date(a->>'date'))
 and not exists(select 1 from jsonb_array_elements(state->'goals') g cross join lateral jsonb_array_elements_text(g->'reviewedMonths') m where not public.valid_calendar_date(m||'-01'));
$$;
alter table public.workspaces add constraint valid_workspace_calendar check(public.valid_workspace_calendar(state));
