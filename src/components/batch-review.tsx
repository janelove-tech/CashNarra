"use client";
import type { ReactNode, RefObject } from "react";
import type { EventInput, Workspace } from "@/domain/types";
import type { Extraction } from "@/server/ai";
import { duplicates, obligations } from "@/domain/ledger";
import { D } from "@/domain/money";
import { Button, Amount } from "./ui";
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
            : "Your story, organised."}
      </h1>
      <p>
        {checking
          ? "Nothing is saved until you use the amount."
          : questions.length
            ? "This changes the record."
            : "Check every record. Select a row to change it."}
      </p>
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
            <div key={q.recordId + q.field} className={s.panel}>
              <h2>{q.question}</h2>
              <p>{record?.description ?? "This proposed record"}</p>
              {(q.field === "accountId" || q.field === "toAccountId") && (
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
              )}
              {q.field === "obligationId" && (
                <div className={s.actions}>
                  {obligations(w)
                    .filter((item) => D(item.remaining).gt(0))
                    .map((item) => (
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
      {recordRows}
      {events.length === 0 && (
        <p className={s.empty}>
          {replaceIds.length
            ? "This record will stop counting towards your totals. Its history stays available."
            : "No proposed records yet."}
        </p>
      )}
      <details>
        <summary>Read the original story</summary>
        <blockquote>
          {hidden ? "Your story is hidden while amounts are hidden." : text}
        </blockquote>
      </details>
      {duplicates(w, events).length > 0 && (
        <div className={s.notice}>
          <h3>This may already be recorded.</h3>
          {duplicates(w, events).map((d, i) => (
            <p key={i}>
              {d.existing.description} · {d.existing.date} ·{" "}
              <Amount value={d.existing.amount} hidden={hidden} />
              <br />
              Original story:{" "}
              {hidden
                ? "Hidden"
                : (w.sources.find((s) => s.id === d.existing.sourceId)?.text ??
                  "Deleted following your story privacy setting")}
            </p>
          ))}
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
      <div className={s.actions}>
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
        <Button onClick={() => manual()} disabled={!!pending}>
          Add record
        </Button>
        <Button onClick={() => onBack()}>Back to words</Button>
        <Button onClick={() => onDiscard()}>Discard draft</Button>
      </div>
    </section>
  );
}
