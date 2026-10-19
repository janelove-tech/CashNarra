"use client";
import type { ReactNode, RefObject } from "react";
import type { EventInput, Workspace } from "@/domain/types";
import type { Extraction } from "@/server/ai";
import { duplicates } from "@/domain/ledger";
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
      {questions
        .filter(
          (q) =>
            q.field !== "amount" ||
            !calculations.some((c) => c.recordId === q.recordId),
        )
        .map((q) => (
          <div key={q.recordId + q.field} className={s.panel}>
            <h2>{q.question}</h2>
            <p>
              {events.find((e) => e.id === q.recordId)?.description ??
                "This proposed record"}
            </p>
            <Button
              onClick={() => manual(events.find((e) => e.id === q.recordId))}
            >
              Fill this in
            </Button>
          </div>
        ))}
      <span className={s.badge}>
        {events.length} proposed {events.length === 1 ? "record" : "records"} ·
        not saved yet
      </span>
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
