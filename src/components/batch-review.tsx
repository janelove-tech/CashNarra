"use client";
import type { ReactNode, RefObject } from "react";
import type { EventInput, Workspace } from "@/domain/types";
import type { Extraction } from "@/server/ai";
import { duplicates } from "@/domain/ledger";
import { Button, Amount } from "./ui";
import s from "./app.module.css";
type Props = {
  heading: RefObject<HTMLHeadingElement | null>;
  questions: Extraction["questions"];
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
  return (
    <section className={s.flow}>
      <h1 ref={heading} tabIndex={-1}>
        {questions.length ? "Just one detail." : "Your story, organised."}
      </h1>
      <p>
        {questions.length
          ? "Your answer changes how the record is understood."
          : "Check every record. Select a row to change it."}
      </p>
      {questions.map((q) => (
        <div key={q.recordId + q.field} className={s.panel}>
          <h2>{q.question}</h2>
          <Button
            onClick={() => manual(events.find((e) => e.id === q.recordId))}
          >
            Add the missing detail
          </Button>
        </div>
      ))}
      <span className={s.badge}>
        {events.length} proposed records · not saved yet
      </span>
      {replaceIds.length > 0 && (
        <div className={s.notice}>
          This replaces {replaceIds.length} saved record(s). Prior versions
          remain in correction history.
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
            ? "The incorrect financial effect will be removed."
            : "No proposed records yet."}
        </p>
      )}
      <details>
        <summary>Read the original story</summary>
        <blockquote>
          {hidden ? "Source hidden while amounts are masked." : text}
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
              Existing record: {d.existing.id}
              <br />
              Source:{" "}
              {hidden
                ? "Hidden"
                : (w.sources.find((s) => s.id === d.existing.sourceId)?.text ??
                  "Removed under retention setting")}
            </p>
          ))}
          <label className={s.checkLabel}>
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
            />
            I compared the evidence. Keep these as new records.
          </label>
        </div>
      )}
      <p className={s.notice}>
        The whole batch saves together. Transfers are not spending. Old debt
        payments are not new sales.
      </p>
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
            Save reviewed{" "}
            {events.length ? `${events.length} records` : "removal"}
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
