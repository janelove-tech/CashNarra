-- Apply only to a new, isolated development Supabase project first.
create table public.workspaces(id uuid primary key, owner_id uuid not null references auth.users(id), version integer not null, state jsonb not null);
create table public.save_receipts(workspace_id uuid not null references public.workspaces(id),request_key text not null,payload_hash text not null,receipt jsonb not null,primary key(workspace_id,request_key));
create table public.journal_lines(workspace_id uuid not null references public.workspaces(id),record_id text not null,position integer not null,account_key text not null,amount numeric(20,2) not null,primary key(workspace_id,record_id,position));
create table public.ai_usage(owner_id uuid not null references auth.users(id),day date not null,calls integer not null,primary key(owner_id,day));
alter table public.workspaces enable row level security;
alter table public.save_receipts enable row level security;
alter table public.journal_lines enable row level security;
alter table public.ai_usage enable row level security;
create policy own_workspace on public.workspaces for select to authenticated using(owner_id=auth.uid());
create policy own_receipt on public.save_receipts for select to authenticated using(exists(select 1 from public.workspaces w where w.id=workspace_id and w.owner_id=auth.uid()));
create policy own_lines on public.journal_lines for select to authenticated using(exists(select 1 from public.workspaces w where w.id=workspace_id and w.owner_id=auth.uid()));
revoke all on public.workspaces,public.save_receipts,public.journal_lines,public.ai_usage from anon,authenticated;
grant select on public.workspaces,public.save_receipts,public.journal_lines to authenticated;

create function public.commit_workspace(p_state jsonb,p_expected integer,p_key text,p_hash text,p_record_ids jsonb default '[]') returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare wid uuid:=(p_state->>'id')::uuid; oldrow public.workspaces; saved public.save_receipts; uid uuid:=auth.uid(); r jsonb; oldr jsonb; a jsonb; othera jsonb; g jsonb; e jsonb; value numeric(20,2); debit text; credit text; kind text; rid text; aid text; remaining numeric; assigned numeric; balance numeric; result jsonb;
begin
 if uid is null or p_state->>'ownerId' is distinct from uid::text or p_state->>'currency' is distinct from 'GHS' then raise exception 'Workspace unavailable'; end if;
 if not (p_state ?& array['id','ownerId','name','type','currency','version','accounts','records','sources','history','goals','checkins','retentionDays','requests']) or exists(select 1 from unnest(array['accounts','records','sources','history','goals','checkins','requests']) k where jsonb_typeof(p_state->k) is distinct from 'array') then raise exception 'Invalid workspace structure';end if;
 if length(p_key)>150 or length(p_hash)<>64 or jsonb_array_length(p_state->'records')>100000 then raise exception 'Invalid request'; end if;
 -- Serialise all revisions, receipts, obligations and allocations in this workspace.
 perform pg_advisory_xact_lock(hashtextextended(wid::text,0));
 select * into oldrow from public.workspaces where id=wid for update;
 if found and oldrow.owner_id<>uid then raise exception 'Workspace unavailable'; end if;
 select * into saved from public.save_receipts where workspace_id=wid and request_key=p_key;
 if found then
   if saved.payload_hash<>p_hash then raise exception 'Request identifier reused with different contents'; end if;
   return saved.receipt;
 end if;
 if (oldrow.id is null and p_expected<>-1) or (oldrow.id is not null and oldrow.version<>p_expected) then raise exception 'Stale revision: refresh and review'; end if;
 if (p_state->>'version')::integer<>p_expected+1 then raise exception 'Invalid revision'; end if;
 if p_state->>'type' not in ('Personal','Business') or length(p_state->>'name') not between 1 and 100 then raise exception 'Invalid workspace';end if;
 if oldrow.id is null then
   if jsonb_array_length(p_state->'records')<>0 or jsonb_array_length(p_state->'accounts')<>0 or jsonb_array_length(p_state->'goals')<>0 then raise exception 'New workspaces start empty';end if;
 else
   -- Existing financial facts are immutable. Removal is traceable; replacements get new IDs.
   for oldr in select * from jsonb_array_elements(oldrow.state->'records') loop
     select x into r from jsonb_array_elements(p_state->'records') x where x->>'id'=oldr->>'id';
     if r is null or (r-'removed')<>(oldr-'removed') or ((oldr->>'removed')::boolean and not (r->>'removed')::boolean) then raise exception 'Financial history is immutable';end if;
     if not (oldr->>'removed')::boolean and (r->>'removed')::boolean and not exists(select 1 from jsonb_array_elements(p_state->'history') h where h->'before'=oldr and length(h->>'reason')>0) then raise exception 'Correction history required';end if;
   end loop;
   for oldr in select * from jsonb_array_elements(oldrow.state->'history') loop
     if not (p_state->'history' @> jsonb_build_array(oldr)) then raise exception 'History must be retained';end if;
   end loop;
   for oldr in select * from jsonb_array_elements(oldrow.state->'accounts') loop
     select x into a from jsonb_array_elements(p_state->'accounts') x where x->>'id'=oldr->>'id';
     if a is null or (a-'opening')<>(oldr-'opening') then raise exception 'Existing accounts cannot be rewritten';end if;
     if a<>oldr and not exists(select 1 from jsonb_array_elements(coalesce(p_state->'openingHistory','[]')) h where h->'before'=oldr and h->'after'=a and length(trim(h->>'reason'))>0) then raise exception 'Opening correction history required';end if;
   end loop;
   if not (coalesce(p_state->'openingHistory','[]') @> coalesce(oldrow.state->'openingHistory','[]')) then raise exception 'Opening history must be retained';end if;
   for oldr in select * from jsonb_array_elements(oldrow.state->'sources') loop
     select x into r from jsonb_array_elements(p_state->'sources') x where x->>'id'=oldr->>'id';
     if r is null or (r-'text'-'expiresAt')<>(oldr-'text'-'expiresAt') or (r->>'text' is not null and r->'text'<>oldr->'text') then raise exception 'Source history cannot be rewritten or restored';end if;
   end loop;
   for g in select * from jsonb_array_elements(oldrow.state->'goals') loop
     select x into r from jsonb_array_elements(p_state->'goals') x where x->>'id'=g->>'id';
     if r is null or r->>'accountId'<>g->>'accountId' then raise exception 'Allocated goal history must be retained';end if;
     for e in select * from jsonb_array_elements(g->'allocations') loop
       if not (r->'allocations' @> jsonb_build_array(e)) then raise exception 'Allocation history is immutable; append a release';end if;
     end loop;
   end loop;
 end if;
 p_state:=jsonb_set(p_state,'{sources}',coalesce((select jsonb_agg(case when (x->>'expiresAt')::timestamptz<=now() then jsonb_set(x,'{text}','null') else x end) from jsonb_array_elements(p_state->'sources') x),'[]'));
 if (select count(*) from jsonb_array_elements(p_state->'records'))<>(select count(distinct x->>'id') from jsonb_array_elements(p_state->'records') x) then raise exception 'Duplicate record identifiers';end if;
 if (select count(*) from jsonb_array_elements(p_state->'accounts'))<>(select count(distinct x->>'id') from jsonb_array_elements(p_state->'accounts') x) then raise exception 'Duplicate account identifiers';end if;
 if (p_state->>'retentionDays')::integer not in (0,7,30) then raise exception 'Unsupported retention period';end if;
 if exists(select 1 from jsonb_array_elements(p_state->'records') x where jsonb_typeof(x->'removed') is distinct from 'boolean' or coalesce(length(x->>'date'),0)<>10 or coalesce(length(x->>'description'),0) not between 1 and 300) then raise exception 'Invalid record structure';end if;
 insert into public.workspaces values(wid,uid,(p_state->>'version')::integer,p_state) on conflict(id) do update set version=excluded.version,state=excluded.state;
 delete from public.journal_lines where workspace_id=wid;
 for a in select * from jsonb_array_elements(p_state->'accounts') loop
   if a->>'currency' is distinct from 'GHS' or coalesce(a->>'type','') not in ('Cash','Bank','MoMo') or coalesce(length(a->>'openingDate'),0)<>10 then raise exception 'Invalid account';end if;
   perform (a->>'openingDate')::date;
   if a->>'opening' is not null and (a->>'opening' !~ '^-?(0|[1-9][0-9]{0,17})(\.[0-9]{1,2})?$' or jsonb_typeof(a->'opening')<>'string') then raise exception 'Invalid exact opening amount';end if;
   if a->>'opening' is not null then insert into public.journal_lines values(wid,'opening:'||(a->>'id'),1,'cash:'||(a->>'id'),(a->>'opening')::numeric),(wid,'opening:'||(a->>'id'),2,'equity',-(a->>'opening')::numeric);end if;
 end loop;
 for r in select x from jsonb_array_elements(p_state->'records') x where not (x->>'removed')::boolean loop
   rid:=r->>'id';kind:=r->>'kind';aid:=r->>'accountId';
   if kind in ('credit_sale','credit_purchase','opening_receivable','opening_payable','opening_loan') and aid is not null then raise exception 'Unpaid/opening balances do not move account money';end if;
   if kind<>'transfer' and r->>'toAccountId' is not null then raise exception 'Only transfers have destination accounts';end if;
   if kind not in ('receivable_payment','payable_payment','loan_principal') and r->>'obligationId' is not null then raise exception 'Only settlements link earlier obligations';end if;
   if jsonb_typeof(r->'amount') is distinct from 'string' or r->>'amount' !~ '^(0|[1-9][0-9]{0,17})(\.[0-9]{1,2})?$' then raise exception 'Exact decimal string required';end if;
   value:=(r->>'amount')::numeric;if value<=0 then raise exception 'Positive amount required';end if;
   perform (r->>'date')::date;
   select x into a from jsonb_array_elements(p_state->'accounts') x where x->>'id'=aid;
   if kind in ('sale','income','expense','stock','asset','transfer','receivable_payment','payable_payment','loan_received','loan_principal','interest','owner_in','owner_out') and (a is null or (r->>'date')::date<(a->>'openingDate')::date) then raise exception 'Invalid workspace account/date';end if;
   if kind in ('credit_sale','credit_purchase','loan_received','opening_receivable','opening_payable','opening_loan') and coalesce(length(trim(r->>'party')),0)=0 then raise exception 'Counterparty required';end if;
   case kind
    when 'sale' then debit:='cash:'||aid;credit:='sales';
    when 'income' then debit:='cash:'||aid;credit:='income';
    when 'expense' then debit:='expense';credit:='cash:'||aid;
    when 'interest' then debit:='interest';credit:='cash:'||aid;
    when 'stock' then debit:='stock';credit:='cash:'||aid;
    when 'asset' then debit:='asset';credit:='cash:'||aid;
    when 'owner_in' then debit:='cash:'||aid;credit:='equity';
    when 'owner_out' then debit:='equity';credit:='cash:'||aid;
    when 'transfer' then
     select x into othera from jsonb_array_elements(p_state->'accounts') x where x->>'id'=r->>'toAccountId';
     if othera is null or othera->>'id'=aid or (r->>'date')::date<(othera->>'openingDate')::date then raise exception 'Invalid transfer';end if;
     debit:='cash:'||(othera->>'id');credit:='cash:'||aid;
    when 'credit_sale' then debit:='receivable:'||rid;credit:='sales';
    when 'opening_receivable' then debit:='receivable:'||rid;credit:='equity';
    when 'credit_purchase' then debit:='stock';credit:='payable:'||rid;
    when 'opening_loan' then debit:='equity';credit:='payable:'||rid;
    when 'opening_payable' then debit:='equity';credit:='payable:'||rid;
    when 'loan_received' then debit:='cash:'||aid;credit:='payable:'||rid;
    when 'receivable_payment' then debit:='cash:'||aid;credit:='receivable:'||(r->>'obligationId');
    when 'payable_payment' then debit:='payable:'||(r->>'obligationId');credit:='cash:'||aid;
    when 'loan_principal' then debit:='payable:'||(r->>'obligationId');credit:='cash:'||aid;
    else raise exception 'Unknown posting template';
   end case;
   if kind in ('receivable_payment','payable_payment','loan_principal') then
     select x into e from jsonb_array_elements(p_state->'records') x where x->>'id'=r->>'obligationId' and not (x->>'removed')::boolean;
     if e is null or (e->>'date')::date>(r->>'date')::date or (kind='receivable_payment' and e->>'kind' not in ('credit_sale','opening_receivable')) or (kind='payable_payment' and e->>'kind' not in ('credit_purchase','opening_payable')) or (kind='loan_principal' and e->>'kind' not in ('loan_received','opening_loan')) then raise exception 'Invalid linked obligation';end if;
   end if;
   insert into public.journal_lines values(wid,rid,1,debit,value),(wid,rid,2,credit,-value);
 end loop;
 if exists(select 1 from public.journal_lines where workspace_id=wid group by record_id having sum(amount)<>0) then raise exception 'Unbalanced journal';end if;
 if exists(select 1 from public.journal_lines where workspace_id=wid and account_key like 'receivable:%' group by account_key having sum(amount)<0) or exists(select 1 from public.journal_lines where workspace_id=wid and account_key like 'payable:%' group by account_key having sum(amount)>0) then raise exception 'Settlement exceeds remaining balance';end if;
 for g in select * from jsonb_array_elements(p_state->'goals') loop
   if jsonb_typeof(g->'target') is distinct from 'string' or g->>'target' !~ '^(0|[1-9][0-9]{0,17})(\.[0-9]{1,2})?$' or (g->>'target')::numeric<=0 then raise exception 'Invalid goal target';end if;
   for e in select * from jsonb_array_elements(g->'allocations') loop
     if jsonb_typeof(e->'amount') is distinct from 'string' or e->>'amount' !~ '^-?(0|[1-9][0-9]{0,17})(\.[0-9]{1,2})?$' then raise exception 'Invalid allocation';end if;
   end loop;
   select coalesce(sum((x->>'amount')::numeric),0) into assigned from jsonb_array_elements(g->'allocations') x;
   if assigned<0 then raise exception 'Negative goal assignment';end if;
   if not exists(select 1 from jsonb_array_elements(p_state->'accounts') x where x->>'id'=g->>'accountId') then raise exception 'Goal account unavailable';end if;
 end loop;
 for a in select * from jsonb_array_elements(p_state->'accounts') loop
   select coalesce(sum((x->>'amount')::numeric),0) into assigned from jsonb_array_elements(p_state->'goals') goals_item cross join lateral jsonb_array_elements(goals_item->'allocations') x where goals_item->>'accountId'=a->>'id';
   select case when a->>'opening' is null then null else coalesce(sum(amount),0) end into balance from public.journal_lines where workspace_id=wid and account_key='cash:'||(a->>'id');
   if assigned>0 and (balance is null or assigned>balance) then raise exception 'Assignments exceed known recorded funds';end if;
 end loop;
 result:=jsonb_build_object('requestId',p_key,'revision',p_state->'version','version',p_state->'version','recordIds',p_record_ids,'savedAt',now());
 insert into public.save_receipts values(wid,p_key,p_hash,result);return result;
end $$;
revoke all on function public.commit_workspace(jsonb,integer,text,text,jsonb) from public,anon;
grant execute on function public.commit_workspace(jsonb,integer,text,text,jsonb) to authenticated;

create function public.reserve_ai_call(p_limit integer) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare n integer;begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 insert into public.ai_usage values(auth.uid(),current_date,1) on conflict(owner_id,day) do update set calls=ai_usage.calls+1 returning calls into n;
 if n>least(greatest(p_limit,0),10) then raise exception 'Daily AI allowance reached';end if;return true;
end $$;
revoke all on function public.reserve_ai_call(integer) from public,anon;
grant execute on function public.reserve_ai_call(integer) to authenticated;



