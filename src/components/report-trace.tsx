import type { Workspace } from "@/domain/types";
import { report, obligations, labels } from "@/domain/ledger";
import { Amount, Button } from "./ui";
export default function ReportTrace({
  workspace,
  from,
  to,
  hidden,
  onRecord,
}: {
  workspace: Workspace;
  from: string;
  to: string;
  hidden: boolean;
  onRecord: (id: string) => void;
}) {
  const r = report(workspace, from, to);
  const past = {
    ...workspace,
    records: workspace.records.filter((e) => e.date <= to),
  };
  return (
    <>
      <p>
        {from} to {to} · GHS. Dates use Ghana time.
      </p>
      <p>
        Received <Amount value={r.received} hidden={hidden} /> minus paid out{" "}
        <Amount value={r.paid} hidden={hidden} /> = recorded net movement{" "}
        <Amount value={r.net} hidden={hidden} />.
      </p>
      <p>{r.exclusions}</p>
      <h3>Records behind money in, money out and sales</h3>
      {r.records.map((e) => (
        <div key={e.id}>
          <Button onClick={() => onRecord(e.id)}>{e.description}</Button>
          <p>
            {labels[e.kind]} · <Amount value={e.amount} hidden={hidden} /> ·{" "}
            {r.receivedIds.includes(e.id)
              ? "Included in received"
              : r.paidIds.includes(e.id)
                ? "Included in paid out"
                : "Excluded from received/paid out"}
            {["sale", "credit_sale"].includes(e.kind)
              ? " · Included in sales"
              : ""}
            {["expense", "credit_expense", "interest"].includes(e.kind)
              ? " · Included in expenses"
              : ""}
          </p>
        </div>
      ))}
      <h3>Outstanding balances at period end</h3>
      <p>
        Original balance minus linked payments through {to}; includes earlier
        openings.
      </p>
      {obligations(past).map((o) => (
        <div key={o.id}>
          <Button onClick={() => onRecord(o.id)}>
            {hidden ? "Counterparty" : o.party} · original balance
          </Button>
          <p>
            <Amount value={o.original} hidden={hidden} /> originally;{" "}
            <Amount value={o.remaining} hidden={hidden} /> still owed.
          </p>
          {past.records
            .filter((e) => !e.removed && e.obligationId === o.id)
            .map((e) => (
              <Button key={e.id} onClick={() => onRecord(e.id)}>
                Payment on {e.date}
              </Button>
            ))}
        </div>
      ))}
      <h3>Recorded accounts</h3>
      <p>
        Declared opening plus all included account movements through period end.
        Unknown openings stay unknown.
      </p>
      {r.balances.map((a) => (
        <div key={a.id}>
          <p>
            {a.name}:{" "}
            <Amount
              value={
                workspace.accounts.find((x) => x.id === a.id)?.opening ?? null
              }
              hidden={hidden}
            />{" "}
            opening on{" "}
            {workspace.accounts.find((x) => x.id === a.id)?.openingDate};{" "}
            <Amount value={a.balance} hidden={hidden} /> recorded at period end.
          </p>
          <details>
            <summary>Included movements for {a.name}</summary>
            <p>
              Includes earlier periods and transfers affecting this account;
              transfers remain excluded from workspace money in and out.
            </p>
            {past.records
              .filter(
                (e) =>
                  !e.removed &&
                  (e.accountId === a.id || e.toAccountId === a.id),
              )
              .map((e) => (
                <div key={e.id}>
                  <Button onClick={() => onRecord(e.id)}>
                    {e.date} · {e.description}
                  </Button>
                  <p>
                    {labels[e.kind]} ·{" "}
                    <Amount value={e.amount} hidden={hidden} />
                  </p>
                </div>
              ))}
            {!past.records.some(
              (e) =>
                !e.removed && (e.accountId === a.id || e.toAccountId === a.id),
            ) && <p>No recorded movements through this period end.</p>}
          </details>
        </div>
      ))}
    </>
  );
}
