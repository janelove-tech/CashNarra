-- Pure state constraint also protects direct privileged maintenance writes.
create function public.valid_source_references(p_state jsonb) returns boolean
language sql immutable set search_path=public,pg_temp as $$
 select
   (select count(*)=count(distinct x->>'id') from jsonb_array_elements(p_state->'sources') x)
   and not exists (
     select 1 from jsonb_array_elements(p_state->'sources') s
     where coalesce(length(s->>'id'),0)=0
   )
   and not exists (
     select 1 from jsonb_array_elements(p_state->'records') r
     where not exists (
       select 1 from jsonb_array_elements(p_state->'sources') s
       where s->>'id'=r->>'sourceId'
     )
   );
$$;
alter table public.workspaces add constraint valid_source_references
check (public.valid_source_references(state));
