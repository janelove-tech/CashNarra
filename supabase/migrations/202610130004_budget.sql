create table public.ai_project_usage(day date primary key,calls integer not null);
alter table public.ai_project_usage enable row level security;
revoke all on public.ai_project_usage from public,anon,authenticated;
create or replace function public.reserve_ai_call(p_limit integer) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare n integer; total integer;begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 insert into public.ai_project_usage values(current_date,1) on conflict(day) do update set calls=ai_project_usage.calls+1 returning calls into total;
 if total>20 then raise exception 'Project daily development allowance reached';end if;
 insert into public.ai_usage values(auth.uid(),current_date,1) on conflict(owner_id,day) do update set calls=ai_usage.calls+1 returning calls into n;
 if n>least(greatest(coalesce(p_limit,0),0),10) then raise exception 'Daily AI allowance reached';end if;return true;
end;$$;
revoke all on function public.reserve_ai_call(integer) from public,anon;
grant execute on function public.reserve_ai_call(integer) to authenticated;
