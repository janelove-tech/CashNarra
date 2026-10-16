"use client";
import { useState } from "react";
import type { EventInput, Workspace } from "@/domain/types";
import { kinds } from "@/domain/types";
import { labels, obligations, posting } from "@/domain/ledger";
import { money } from "@/domain/money";
import { Button } from "./ui";
import s from "./app.module.css";
export default function RecordForm({
  initial,
  workspace,
  onSave,
  onCancel,
}: {
  initial: EventInput;
  workspace: Workspace;
  onSave: (e: EventInput) => void;
  onCancel: () => void;
}) {
  const [e, set] = useState(initial),
    [error, setError] = useState("");
  const update = (key: keyof EventInput, value: string | null) => {
    const next = { ...e, [key]: value };
    if (key === "kind") {
      next.toAccountId = null;
      next.obligationId = null;
      if (
        [
          "credit_sale",
          "credit_purchase",
          "opening_receivable",
          "opening_payable",
          "opening_loan",
        ].includes(value ?? "")
      )
        next.accountId = null;
    }
    set(next);
  };
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        try {
          const v = { ...e, amount: money(e.amount, true) };
          posting(v, workspace.accounts);
          onSave(v);
        } catch (x) {
          setError((x as Error).message);
        }
      }}
    >
      <label htmlFor="description">Description</label>
      <input
        id="description"
        value={e.description}
        maxLength={300}
        onChange={(x) => update("description", x.target.value)}
        required
      />
      <div className={s.formGrid}>
        <div>
          <label htmlFor="amount">Amount · GHS</label>
          <input
            id="amount"
            inputMode="decimal"
            value={e.amount}
            onChange={(x) => update("amount", x.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={e.date}
            onChange={(x) => update("date", x.target.value)}
            required
          />
        </div>
      </div>
      <label htmlFor="kind">What happened?</label>
      <select
        id="kind"
        value={e.kind}
        onChange={(x) => update("kind", x.target.value)}
      >
        {kinds.map((k) => (
          <option key={k} value={k}>
            {labels[k]}
          </option>
        ))}
      </select>
      <label htmlFor="account">Account</label>
      <select
        id="account"
        value={e.accountId ?? ""}
        onChange={(x) => update("accountId", x.target.value || null)}
      >
        <option value="">No money account / choose one</option>
        {workspace.accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      {e.kind === "transfer" && (
        <>
          <label htmlFor="to">Moved to</label>
          <select
            id="to"
            value={e.toAccountId ?? ""}
            onChange={(x) => update("toAccountId", x.target.value || null)}
          >
            <option value="">Choose destination</option>
            {workspace.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </>
      )}
      <label htmlFor="party">Person or business (when money is owed)</label>
      <input
        id="party"
        list="saved-people"
        value={e.party ?? ""}
        onChange={(x) => update("party", x.target.value || null)}
        maxLength={100}
      />
      <datalist id="saved-people">
        {workspace.contacts?.map((c) => (
          <option key={c.id} value={c.name}>
            {c.role}
          </option>
        ))}
      </datalist>
      {["receivable_payment", "payable_payment", "loan_principal"].includes(
        e.kind,
      ) && (
        <>
          <label htmlFor="debt">Existing balance</label>
          <select
            id="debt"
            value={e.obligationId ?? ""}
            onChange={(x) => update("obligationId", x.target.value || null)}
          >
            <option value="">Choose the balance being paid</option>
            {obligations(workspace)
              .filter(
                (o) =>
                  o.direction ===
                  (e.kind === "receivable_payment" ? "receivable" : "payable"),
              )
              .filter((o) => {
                const debt = workspace.records.find((r) => r.id === o.id);
                return (
                  e.kind === "receivable_payment" ||
                  (e.kind === "loan_principal") ===
                    ["loan_received", "opening_loan"].includes(debt?.kind ?? "")
                );
              })
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.party} · GHS {o.remaining}
                </option>
              ))}
          </select>
        </>
      )}
      <p className={s.error} role="alert">
        {error}
      </p>
      <div className={s.actions}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button primary type="submit">
          Review this record
        </Button>
      </div>
    </form>
  );
}
