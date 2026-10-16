-- Existing data and ownership checks are preserved. All application relations
-- in these functions are schema-qualified; pg_catalog remains implicit.
begin;
revoke create on schema public from public, anon, authenticated;
alter function public.commit_workspace(jsonb,integer,text,text,jsonb) set search_path = '';
alter function public.move_workspace_record(jsonb,jsonb,text,text,text) set search_path = '';
alter function public.reserve_ai_call(integer) set search_path = '';
alter function public.minimize_my_sources() set search_path = '';
alter function public.minimize_expired_sources() set search_path = '';
revoke all on function public.commit_workspace(jsonb,integer,text,text,jsonb), public.move_workspace_record(jsonb,jsonb,text,text,text), public.reserve_ai_call(integer), public.minimize_my_sources() from public, anon;
grant execute on function public.commit_workspace(jsonb,integer,text,text,jsonb), public.move_workspace_record(jsonb,jsonb,text,text,text), public.reserve_ai_call(integer), public.minimize_my_sources() to authenticated;
revoke all on function public.minimize_expired_sources() from public, anon, authenticated;
revoke all on function public.guard_planning_history() from public, anon, authenticated;
commit;
