"use client";
import type { ReactNode, RefObject } from "react";
import type { EventInput, Workspace } from "@/domain/types";
import type { Extraction } from "@/server/ai";
import { duplicates } from "@/domain/ledger";
import { readingDate } from "@/domain/periods";
import {
  accountCreatePrompt,
  accountTypeForName,
  balanceCreatePrompt,
  reviewObligations,
} from "@/domain/review-create";
import { Button, Amount } from "./ui";
import { Said } from "./said";
import s from "./app.module.css";
import CalculationReview from "./calculation-review";
type Props = {
  heading: RefObject<HTMLHeadingElement | null>;
  questions: Extraction["questions"];
  calculations?: Extraction["calculations"];
  confirmCalculation?: (id: string, amount: string, note: string) => void;
  events: EventInput[];
  replaceIds: string[];
  reason: string;
  pending: boolean;
  busy: boolean;
  hidden: boolean;
  text: string;
  w: Workspace;
  allowDuplicates: boolean;
  recordRows: ReactNode;
  manual: (event?: EventInput) => void;
  onAnswer: (
    recordId: string,
    field: Extraction["questions"][number]["field"],
    patch: Partial<EventInput>,
    note?: string,
  ) => void;
  onCreateAccount: (
    recordId: string,
    field: "accountId" | "toAccountId",
    account: {
      name: string;
      type: string;
      opening: string | null;
      openingDate: string;
      recordDate: string;
    },
  ) => void;
  onCreateBalance: (
    recordId: string,
    balance: { name: string; amount: string; date: string },
  ) => void;
  needsFreshReview?: boolean;
  acceptFreshReview?: () => void;
  setReason: (value: string) => void;
  changeDraft: () => void;
  setAllowDuplicates: (value: boolean) => void;
  recover: () => void;
  saveBatch: () => void;
  onBack: () => void;
  onDiscard: () => void;
};
export default function BatchReview({
  heading,
  questions,
  calculations = [],
  confirmCalculation,
  events,
  replaceIds,
  reason,
  pending,
  busy,
  hidden,
  text,
  w,
  allowDuplicates,
  recordRows,
  manual,
  onAnswer,
  onCreateAccount,
  onCreateBalance,
  needsFreshReview = false,
  acceptFreshReview,
  setReason,
  changeDraft,
  setAllowDuplicates,
  recover,
  saveBatch,
  onBack,
  onDiscard,
}: Props) {
  const checking = calculations.some(
    (c) =>
      events.some((e) => e.id === c.recordId) &&
      questions.some((q) => q.recordId === c.recordId && q.field === "amount"),
  );
  return (
    <section className={s.flow}>
      <h1 ref={heading} tabIndex={-1}>
        {checking
          ? "Check this amount."
          : questions.length
            ? "One thing to fill in."
            : events.length === 1
              ? "Check this record"
              : events.length
                ? `Check these ${events.length} records`
                : "Nothing to save yet."}
      </h1>
      <p>
        {checking
          ? "Nothing is saved until you use the amount."
          : questions.length
            ? "This changes the record."
            : "Check every record. Use Change beside a row, or select the row."}
      </p>
      <div className={s.reviewTools}>
        <Button quiet onClick={() => onBack()}>
          Back to words
        </Button>
        <Button quiet onClick={() => onDiscard()}>
          Discard draft
        </Button>
      </div>
      {calculations.some((c) => c.version !== w.version) && (
        <p role="alert">
          Your records have changed since this calculation. Go back to your
          story and process it again to use the latest figures.
        </p>
      )}
      {calculations
        .filter(
          (c) =>
            events.some((e) => e.id === c.recordId) &&
            questions.some(
              (q) => q.recordId === c.recordId && q.field === "amount",
            ),
        )
        .map((c) => (
          <CalculationReview
            key={c.recordId}
            calculation={c}
            hidden={hidden}
            disabled={pending || busy || c.version !== w.version}
            onConfirm={(amount, note) =>
              confirmCalculation?.(c.recordId, amount, note)
            }
          />
        ))}
      {needsFreshReview && (
        <div className={s.notice}>
          <p>
            This backup was saved before unanswered questions were kept. Check
            every proposed record before saving.
          </p>
          <Button onClick={() => acceptFreshReview?.()} disabled={pending}>
            I have checked every record
          </Button>
        </div>
      )}
      {questions
        .filter(
          (q) =>
            q.field !== "amount" ||
            !calculations.some((c) => c.recordId === q.recordId),
        )
        .map((q) => {
          const record = events.find((e) => e.id === q.recordId);
          const inclusion = /included in that total/i.test(q.question);
          return (
            <div key={q.recordId + q.field} className={s.ask}>
              <h2>{q.question}</h2>
              <p>
                {record?.description ?? "This proposed record"}
                {record?.amount ? (
                  <>
                    {" · "}
                    <Amount value={record.amount} hidden={hidden} />
                  </>
                ) : null}
              </p>
              {(q.field === "accountId" || q.field === "toAccountId") && (
                <>
                  <div className={s.actions}>
                    {w.accounts.map((account) => (
                      <Button
                        key={account.id}
                        disabled={pending || busy}
                        onClick={() =>
                          onAnswer(q.recordId, q.field, {
                            [q.field]: account.id,
                          })
                        }
                      >
                        {account.name}
                      </Button>
                    ))}
                  </div>
                  <AccountCreate
                    formId={`${q.recordId}-${q.field}`}
                    suggestion={q.suggestion}
                    recordDate={record?.date ?? ""}
                    accounts={w.accounts}
                    disabled={pending || busy}
                    onCreate={(account) =>
                      onCreateAccount(
                        q.recordId,
                        q.field === "toAccountId" ? "toAccountId" : "accountId",
                        account,
                      )
                    }
                  />
                </>
              )}
              {q.field === "obligationId" && record && (
                <>
                  <div className={s.actions}>
                    {reviewObligations(w, events).map((item) => (
                      <Button
                        key={item.id}
                        disabled={pending || busy}
                        onClick={() =>
                          onAnswer(q.recordId, q.field, {
                            obligationId: item.id,
                            party: item.party,
                          })
                        }
                      >
                        {item.party}
                      </Button>
                    ))}
                  </div>
                  <BalanceCreate
                    suggestion={q.suggestion}
                    record={record}
                    balances={reviewObligations(w, events)}
                    disabled={pending || busy}
                    onCreate={(balance) => onCreateBalance(q.recordId, balance)}
                  />
                </>
              )}
              {q.field === "kind" && (
                <div className={s.actions}>
                  {inclusion ? (
                    <>
                      <Button
                        disabled={pending || busy}
                        onClick={() =>
                          onAnswer(
                            q.recordId,
                            q.field,
                            {},
                            "You confirmed the unpaid amount is included in the stated total.",
                          )
                        }
                      >
                        Yes, it is included
                      </Button>
                      <Button
                        disabled={pending || busy}
                        onClick={() =>
                          onAnswer(
                            q.recordId,
                            q.field,
                            {},
                            "You said the unpaid amount is in addition to the stated total. Check the amounts before saving.",
                          )
                        }
                      >
                        No, it is extra
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        disabled={pending || busy}
                        onClick={() =>
                          onAnswer(q.recordId, q.field, {
                            kind:
                              record?.kind === "credit_expense"
                                ? "expense"
                                : record?.kind === "credit_sale"
                                  ? "sale"
                                  : (record?.kind ?? "expense"),
                          })
                        }
                      >
                        Paid
                      </Button>
                      <Button
                        disabled={pending || busy}
                        onClick={() =>
                          onAnswer(q.recordId, q.field, {
                            kind:
                              record?.kind === "sale"
                                ? "credit_sale"
                                : "credit_expense",
                            accountId: null,
                          })
                        }
                      >
                        Still owed
                      </Button>
                    </>
                  )}
                </div>
              )}
              {(q.field === "party" ||
                q.field === "amount" ||
                q.field === "date") && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const value = String(
                      new FormData(event.currentTarget).get("value") ?? "",
                    );
                    onAnswer(
                      q.recordId,
                      q.field,
                      q.field === "amount"
                        ? { amount: value }
                        : q.field === "date"
                          ? { date: value }
                          : { party: value },
                    );
                  }}
                >
                  <label htmlFor={`${q.recordId}-${q.field}`}>
                    {q.field === "amount"
                      ? "Amount · GHS"
                      : q.field === "date"
                        ? "Date"
                        : "Name"}
                  </label>
                  <input
                    id={`${q.recordId}-${q.field}`}
                    name="value"
                    type={q.field === "date" ? "date" : "text"}
                    inputMode={q.field === "amount" ? "decimal" : undefined}
                    required
                    disabled={pending || busy}
                  />
                  <Button type="submit" disabled={pending || busy}>
                    Use this answer
                  </Button>
                </form>
              )}
              <Button
                onClick={() => manual(record)}
                disabled={pending}
              >
                Edit the full record
              </Button>
            </div>
          );
        })}
      <span className={s.badge}>
        {events.length} proposed {events.length === 1 ? "record" : "records"}
        {questions.length
          ? ` · ${questions.length} still to answer`
          : ""}{" "}
        · not saved yet
      </span>
      {events.length > 1 && (
        <p>
          Every proposed record is on this page. Saving sends them together.
        </p>
      )}
      {replaceIds.length > 0 && (
        <div className={s.notice}>
          This updates {replaceIds.length} saved record(s). You can still see
          the earlier versions in history.
          <label htmlFor="reason">Reason</label>
          <input
            id="reason"
            value={reason}
            disabled={!!pending}
            onChange={(e) => {
              setReason(e.target.value);
              changeDraft();
            }}
          />
        </div>
      )}
      {text.trim() && (
        <Said
          hidden={hidden}
          meta={
            <>
              <span>From your story</span>
              <button type="button" onClick={() => onBack()}>
                Change the words
              </button>
            </>
          }
        >
          {text}
        </Said>
      )}
      <div className={s.proposals}>{recordRows}</div>
      {events.length === 0 && (
        <p className={s.empty}>
          {replaceIds.length
            ? "This record will stop counting towards your totals. Its history stays available."
            : "No proposed records yet."}
        </p>
      )}
      {duplicates(w, events).length > 0 && (
        <div className={s.notice}>
          <h3>This may already be recorded.</h3>
          <p>
            Saved records with the same amount and date. Check them before
            saving again.
          </p>
          <ul className={s.dupList}>
            {duplicates(w, events).map((d, i) => (
              <li key={i}>
                <span>
                  {d.existing.description} · {readingDate(d.existing.date)}
                </span>
                <Amount value={d.existing.amount} hidden={hidden} />
              </li>
            ))}
          </ul>
          {(() => {
            const stories = [
              ...new Set(
                duplicates(w, events).map(
                  (d) =>
                    w.sources.find((s) => s.id === d.existing.sourceId)?.text ??
                    "Original words removed according to your privacy setting",
                ),
              ),
            ];
            return (
              <details>
                <summary>
                  {stories.length === 1
                    ? "Original story of the saved records"
                    : "Original stories of the saved records"}
                </summary>
                {stories.map((story) => (
                  <blockquote key={story}>{hidden ? "Hidden" : story}</blockquote>
                ))}
              </details>
            );
          })()}
          <label className={s.checkLabel}>
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
            />
            These are separate transactions. Save them as new records.
          </label>
        </div>
      )}
      {!checking && (
        <p className={s.notice}>
          {events.length === 1
            ? "This record is saved when you confirm."
            : "These records are saved together when you confirm."}
        </p>
      )}
      <div className={`${s.actions} ${s.reviewActions}`}>
        {pending ? (
          <Button primary onClick={recover} disabled={busy}>
            Check original save request
          </Button>
        ) : (
          <Button
            primary
            onClick={saveBatch}
            disabled={
              busy ||
              questions.length > 0 ||
              needsFreshReview ||
              (!events.length && !replaceIds.length)
            }
          >
            {events.length === 1
              ? "Save this record"
              : events.length
                ? `Save ${events.length} records`
                : "Save removal"}
          </Button>
        )}
        <Button quiet onClick={() => manual()} disabled={!!pending}>
          Add record
        </Button>
      </div>
    </section>
  );
}

function sameName(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function AccountCreate({
  formId,
  suggestion,
  recordDate,
  accounts,
  disabled,
  onCreate,
}: {
  formId: string;
  suggestion: string | null;
  recordDate: string;
  accounts: Workspace["accounts"];
  disabled: boolean;
  onCreate: (account: {
    name: string;
    type: string;
    opening: string | null;
    openingDate: string;
    recordDate: string;
  }) => void;
}) {
  const suggested = suggestion?.trim() || null;
  const exists =
    !!suggested && accounts.some((account) => sameName(account.name, suggested));
  const field = `create-account-${formId}`;
  // A story that names an account this workspace does not have opens the
  // form straight away. Otherwise the choices above are enough, and the
  // form waits behind one quiet control.
  return (
    <details open={!!suggested && !exists}>
      <summary>
        {suggested && !exists
          ? `Create ${suggested}`
          : "Use an account that is not listed"}
      </summary>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onCreate({
          name: String(form.get("name") ?? ""),
          type: String(form.get("type") ?? ""),
          opening: form.get("unknown") ? null : String(form.get("amount") ?? ""),
          openingDate: String(form.get("date") ?? ""),
          recordDate,
        });
      }}
    >
      <p>{accountCreatePrompt(suggested, exists)}</p>
      <label htmlFor={`${field}-name`}>Account nickname</label>
      <input
        id={`${field}-name`}
        name="name"
        required
        maxLength={80}
        defaultValue={exists ? "" : (suggested ?? "")}
        disabled={disabled}
      />
      <label htmlFor={`${field}-type`}>Type</label>
      <select
        id={`${field}-type`}
        name="type"
        defaultValue={accountTypeForName(suggested ?? "")}
        disabled={disabled}
      >
        <option>Cash</option>
        <option>Bank</option>
        <option>MoMo</option>
      </select>
      <label htmlFor={`${field}-opening`}>Starting amount · GHS</label>
      <input
        id={`${field}-opening`}
        name="amount"
        inputMode="decimal"
        placeholder="Only if you know the starting balance"
        disabled={disabled}
      />
      <label className={s.checkLabel}>
        <input type="checkbox" name="unknown" defaultChecked disabled={disabled} />
        I don’t know the starting balance yet
      </label>
      <label htmlFor={`${field}-date`}>Starting date</label>
      <input
        id={`${field}-date`}
        name="date"
        type="date"
        required
        defaultValue={recordDate}
        disabled={disabled}
      />
      <p>
        The account is saved now. This record stays a draft until you save the
        story.
      </p>
      <div className={s.actions}>
        <Button type="submit" disabled={disabled}>
          Create account and use it
        </Button>
      </div>
    </form>
    </details>
  );
}

function BalanceCreate({
  suggestion,
  record,
  balances,
  disabled,
  onCreate,
}: {
  suggestion: string | null;
  record: EventInput;
  balances: { party: string }[];
  disabled: boolean;
  onCreate: (balance: { name: string; amount: string; date: string }) => void;
}) {
  const suggested = suggestion?.trim() || null;
  const exists =
    !!suggested && balances.some((item) => sameName(item.party, suggested));
  const field = `create-balance-${record.id}`;
  const amountLabel =
    record.kind === "loan_principal"
      ? "Loan principal before this repayment · GHS"
      : "Amount owed before this payment · GHS";
  return (
    <details open={!!suggested && !exists}>
      <summary>
        {suggested && !exists
          ? `Add the balance ${suggested} already had`
          : "Add a balance that is not listed"}
      </summary>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onCreate({
          name: String(form.get("name") ?? ""),
          amount: String(form.get("amount") ?? ""),
          date: String(form.get("date") ?? ""),
        });
      }}
    >
      <p>{balanceCreatePrompt(record.kind, suggested, exists)}</p>
      <label htmlFor={`${field}-name`}>Name</label>
      <input
        id={`${field}-name`}
        name="name"
        required
        maxLength={80}
        defaultValue={exists ? "" : (suggested ?? "")}
        disabled={disabled}
      />
      <label htmlFor={`${field}-amount`}>{amountLabel}</label>
      <input
        id={`${field}-amount`}
        name="amount"
        inputMode="decimal"
        required
        disabled={disabled}
      />
      <label htmlFor={`${field}-date`}>Balance date</label>
      <input
        id={`${field}-date`}
        name="date"
        type="date"
        required
        defaultValue={record.date}
        disabled={disabled}
      />
      <p>Both stay drafts until you save the story.</p>
      <div className={s.actions}>
        <Button type="submit" disabled={disabled}>
          Create balance and use it
        </Button>
      </div>
    </form>
    </details>
  );
}
