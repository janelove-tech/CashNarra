create function public.guard_planning_history() returns trigger
language plpgsql set search_path=public,pg_temp as $$
declare field text; item jsonb; replacement jsonb;
begin
 foreach field in array array['checkinHistory','debtDates','goalChanges'] loop
  if jsonb_typeof(coalesce(new.state->field,'[]'::jsonb))<>'array' then raise exception 'Invalid planning history';end if;
  if tg_op='UPDATE' and not (coalesce(new.state->field,'[]'::jsonb) @> coalesce(old.state->field,'[]'::jsonb)) then raise exception 'Planning history must be retained';end if;
 end loop;
 for item in select * from jsonb_array_elements(coalesce(new.state->'contacts','[]')) loop
  if coalesce(length(trim(item->>'id')),0)=0 or coalesce(length(trim(item->>'name')),0) not between 1 and 100 or coalesce(item->>'role','') not in ('Customer','Supplier','Other') then raise exception 'Invalid saved person';end if;
 end loop;
 if (select count(*)<>count(distinct c->>'id') from jsonb_array_elements(coalesce(new.state->'contacts','[]')) c) then raise exception 'Duplicate saved person';end if;
 for item in select * from jsonb_array_elements(coalesce(new.state->'debtDates','[]')) loop
  if item->>'date' is not null and not public.valid_calendar_date(item->>'date') then raise exception 'Invalid payment date';end if;
  if not exists(select 1 from jsonb_array_elements(new.state->'records') r where r->>'id'=item->>'recordId' and r->>'kind' in ('credit_sale','credit_purchase','opening_receivable','opening_payable','opening_loan','loan_received')) then raise exception 'Payment date balance unavailable';end if;
  if exists(select 1 from jsonb_array_elements(new.state->'records') r where r->>'id'=item->>'recordId' and item->>'date'<r->>'date') then raise exception 'Payment date precedes balance';end if;
 end loop;
 if tg_op='UPDATE' then
  for item in select * from jsonb_array_elements(old.state->'checkins') loop
   select c into replacement from jsonb_array_elements(new.state->'checkins') c where c->>'date'=item->>'date';
   if replacement is distinct from item and not (coalesce(new.state->'checkinHistory','[]') @> jsonb_build_array(item)) then raise exception 'Previous check-in must be kept';end if;
   if replacement is distinct from item and replacement is not null and not (coalesce(new.state->'checkinHistory','[]') @> jsonb_build_array(replacement)) then raise exception 'New check-in must be kept';end if;
  end loop;
  for item in select * from jsonb_array_elements(old.state->'goals') loop
   select g into replacement from jsonb_array_elements(new.state->'goals') g where g->>'id'=item->>'id';
   if replacement->>'name' is distinct from item->>'name' or replacement->>'target' is distinct from item->>'target' then
    if not exists(select 1 from jsonb_array_elements(coalesce(new.state->'goalChanges','[]')) h where h->>'goalId'=item->>'id' and h->'before'=jsonb_build_object('name',item->'name','target',item->'target') and h->'after'=jsonb_build_object('name',replacement->'name','target',replacement->'target')) then raise exception 'Goal change history required';end if;
   end if;
  end loop;
 end if;
 return new;
end;$$;
create trigger guard_planning_history before insert or update on public.workspaces for each row execute function public.guard_planning_history();
