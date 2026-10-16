create function public.minimize_my_sources() returns void language sql security definer set search_path=public,pg_temp as $$
 update public.workspaces w set state=jsonb_set(state,'{sources}',coalesce((select jsonb_agg(case when (x->>'expiresAt')::timestamptz<=now() then jsonb_set(x,'{text}','null') else x end) from jsonb_array_elements(w.state->'sources') x),'[]'))
 where owner_id=auth.uid() and exists(select 1 from jsonb_array_elements(w.state->'sources') x where x->>'text' is not null and (x->>'expiresAt')::timestamptz<=now());
$$;
revoke all on function public.minimize_my_sources() from public,anon;
grant execute on function public.minimize_my_sources() to authenticated;
-- Run from a trusted maintenance connection daily; never grant to app users.
create function public.minimize_expired_sources() returns void language sql security definer set search_path=public,pg_temp as $$
 update public.workspaces w set state=jsonb_set(state,'{sources}',coalesce((select jsonb_agg(case when (x->>'expiresAt')::timestamptz<=now() then jsonb_set(x,'{text}','null') else x end) from jsonb_array_elements(w.state->'sources') x),'[]'))
 where exists(select 1 from jsonb_array_elements(w.state->'sources') x where x->>'text' is not null and (x->>'expiresAt')::timestamptz<=now());
$$;
revoke all on function public.minimize_expired_sources() from public,anon,authenticated;
