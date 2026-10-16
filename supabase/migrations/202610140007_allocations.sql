create function public.valid_goal_allocations(state jsonb) returns boolean
language sql immutable set search_path=public,pg_temp as $$
 select not exists (
   select 1 from jsonb_array_elements(state->'goals') g
   where (select count(*) from jsonb_array_elements(g->'allocations')) <>
         (select count(distinct a->>'id') from jsonb_array_elements(g->'allocations') a)
   or exists(select 1 from jsonb_array_elements(g->'allocations') a where (a->>'amount')::numeric=0)
 );
$$;
alter table public.workspaces add constraint valid_goal_allocations check(public.valid_goal_allocations(state));
