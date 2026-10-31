"use client";
import { useState, useRef, useId, useMemo } from "react";
import type { EventInput, Workspace } from "@/domain/types";
import { kindLabel, obligations, posting } from "@/domain/ledger";
import { money, parseEntryAmount } from "@/domain/money";
import { kinds } from "@/domain/types";
import { reviewObligations } from "@/domain/review-create";
import { settlementRemainder, type DraftChanges } from "@/domain/review-impact";
import { Button, Amount } from "./ui";
import s from "./app.module.css";
export default function RecordForm({
  initial,
  workspace,
  draft = { events: [], replaceIds: [], reason: "", allowDuplicates: false },
  hidden = false,
  formId,
  showActions = true,
  onSave,
  onCancel,
}: {
  initial: EventInput;
  workspace: Workspace;
  draft?: DraftChanges;
  hidden?: boolean;
  formId?: string;
  showActions?: boolean;
  onSave: (e: EventInput) => void;
  onCancel: () => void;
}) {
  const [e, set] = useState(initial),
    [error, setError] = useState("");
  const errorId = useId();
  const errorSummary = useRef<HTMLParagraphElement>(null);
  const [amountInvalid, setAmountInvalid] = useState(false);
  const payment = [
    "receivable_payment",
    "payable_payment",
    "loan_principal",
  ].includes(e.kind);
  const incoming = e.kind === "receivable_payment";
  const balances = useMemo(
    () =>
      reviewObligations(
        workspace,
        draft.events.filter((record) => record.id !== e.id),
      ),
    [workspace, draft, e.id],
  );
  const recordedBalances = useMemo(() => obligations(workspace), [workspace]);
  const recordedBalance = recordedBalances.find(
    (balance) => balance.id === e.obligationId,
  );
  const fullAmount = useMemo(
    () =>
      settlementRemainder(workspace, draft, {
        id: e.id,
        kind: e.kind,
        obligationId: e.obligationId,
      }),
    [workspace, draft, e.id, e.kind, e.obligationId],
  );
  const selectableBalances =
    recordedBalance &&
    !balances.some((balance) => balance.id === recordedBalance.id)
      ? [...balances, recordedBalance]
      : balances;
  const update = (key: keyof EventInput, value: string | null) => {
    const next = { ...e, [key]: value };
    setError("");
    setAmountInvalid(false);
    if (key === "obligationId")
      next.party =
        balances.find((balance) => balance.id === value)?.party ?? null;
    if (key === "kind") {
      next.toAccountId = null;
      next.obligationId = null;
      if (
        ["receivable_payment", "payable_payment", "loan_principal"].includes(
          value ?? "",
        )
      )
        next.accountId = null;
      if (
        [
          "credit_sale",
          "credit_purchase",
          "credit_expense",
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
      id={formId}
      className={s.recordEditor}
      aria-describedby={error ? errorId : undefined}
      onSubmit={(ev) => {
        ev.preventDefault();
        try {
          const v = {
            ...e,
            amount: money(parseEntryAmount(e.amount), true),
          };
          posting(v, workspace.accounts);
          onSave(v);
        } catch (x) {
          try {
            money(e.amount, true);
          } catch {
            setAmountInvalid(true);
          }
          setError((x as Error).message);
          requestAnimationFrame(() => errorSummary.current?.focus());
        }
      }}
    >
      {payment && (
        <div className={s.paymentContext}>
          <p>
            {incoming ? "Record money received" : "Record money paid"}
            {e.party && !hidden ? ` · ${e.party}` : ""}
          </p>
          {recordedBalance && (
            <p className={s.hint}>
              Recorded balance:{" "}
              <Amount value={recordedBalance.remaining} hidden={hidden} />.
            </p>
          )}
        </div>
      )}
      <div className={s.field}>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          value={e.description}
          maxLength={300}
          onChange={(x) => update("description", x.target.value)}
          required
        />
      </div>
      <div className={s.formGrid}>
        <div className={s.field}>
          <label htmlFor="amount">Amount · GHS</label>
          <input
            id="amount"
            aria-invalid={amountInvalid || undefined}
            aria-describedby={amountInvalid ? errorId : undefined}
            inputMode="decimal"
            value={e.amount}
            onChange={(x) => update("amount", x.target.value)}
            required
          />
          {payment && fullAmount && (
            <>
              <Button quiet onClick={() => update("amount", fullAmount)}>
                Use full balance
              </Button>
              {fullAmount !== recordedBalance?.remaining && (
                <p className={s.hint}>
                  Full balance after the other proposed changes:{" "}
                  <Amount value={fullAmount} hidden={hidden} />.
                </p>
              )}
            </>
          )}
        </div>
        <div className={s.field}>
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
      <div className={s.field}>
        <label htmlFor="kind">What happened?</label>
        <select
          id="kind"
          value={e.kind}
          onChange={(x) => update("kind", x.target.value)}
        >
          {(workspace.type === "Personal"
            ? [
                "income",
                "expense",
                "transfer",
                "loan_received",
                "loan_principal",
                "receivable_payment",
                "payable_payment",
                "credit_sale",
                ...kinds.filter(
                  (kind) =>
                    ![
                      "income",
                      "expense",
                      "transfer",
                      "loan_received",
                      "loan_principal",
                      "receivable_payment",
                      "payable_payment",
                      "credit_sale",
                    ].includes(kind),
                ),
              ]
            : kinds
          ).map((k) => (
            <option key={k} value={k}>
              {kindLabel(k as EventInput["kind"], workspace.type)}
            </option>
          ))}
        </select>
      </div>
      <div className={s.field}>
        <label htmlFor="account">Account</label>
        <select
          id="account"
          required={payment}
          value={e.accountId ?? ""}
          onChange={(x) => update("accountId", x.target.value || null)}
        >
          <option value="">
            {payment
              ? incoming
                ? "Choose where the money arrived"
                : "Choose which account paid"
              : "No money account / choose one"}
          </option>
          {workspace.accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      {e.kind === "transfer" && (
        <div className={s.field}>
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
        </div>
      )}
      <div className={s.field}>
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
      </div>
      {["receivable_payment", "payable_payment", "loan_principal"].includes(
        e.kind,
      ) && (
        <div className={s.field}>
          <label htmlFor="debt">Existing balance</label>
          <select
            id="debt"
            value={e.obligationId ?? ""}
            onChange={(x) => update("obligationId", x.target.value || null)}
          >
            <option value="">Choose the balance being paid</option>
            {selectableBalances
              .filter(
                (o) =>
                  o.direction ===
                  (e.kind === "receivable_payment" ? "receivable" : "payable"),
              )
              .filter((o) => {
                const debt =
                  workspace.records.find((r) => r.id === o.id) ??
                  draft.events.find((record) => record.id === o.id);
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
        </div>
      )}
      {error && (
        <p
          id={errorId}
          ref={errorSummary}
          tabIndex={-1}
          className={s.error}
          role="alert"
        >
          {error}
        </p>
      )}
      {showActions && (
        <div className={s.actions}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button primary type="submit">
            Review this record
          </Button>
        </div>
      )}
    </form>
  );
}
