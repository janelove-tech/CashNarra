-- Both corrections commit or roll back together; sorted locks prevent opposite-move deadlocks.
create or replace function public.move_workspace_record(p_from jsonb,p_to jsonb,p_key text,p_hash text,p_record_id text) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare a uuid:=(p_from->>'id')::uuid; b uuid:=(p_to->>'id')::uuid; result jsonb;
begin
 if auth.uid() is null or a=b or p_from->>'ownerId'<>auth.uid()::text or p_to->>'ownerId'<>auth.uid()::text then raise exception 'Workspace unavailable';end if;
 perform pg_advisory_xact_lock(hashtextextended(least(a::text,b::text),0));
 perform pg_advisory_xact_lock(hashtextextended(greatest(a::text,b::text),0));
 result:=public.commit_workspace(p_from,(p_from->>'version')::integer-1,p_key,p_hash,jsonb_build_array(p_record_id));
 perform public.commit_workspace(p_to,(p_to->>'version')::integer-1,p_key||':destination',p_hash,jsonb_build_array(p_record_id));
 return result;
end;$$;
revoke all on function public.move_workspace_record(jsonb,jsonb,text,text,text) from public,anon;
grant execute on function public.move_workspace_record(jsonb,jsonb,text,text,text) to authenticated;
