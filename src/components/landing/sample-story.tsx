"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { formatMoney } from "@/domain/money";
import {
  CLEAR_QUOTE,
  TRICKIER_QUOTE,
  clearEvents,
  sampleTotals,
  trickierEvents,
  type SampleEvent,
} from "./sample-fixture";
import s from "./sample-story.module.css";

export function SampleStory() {
  const [mode, setMode] = useState<"clear" | "trickier">("clear");
  const [account, setAccount] = useState<"Cash" | "MoMo" | null>(null);
  const [notice, setNotice] = useState("");
  const titleId = useId();
  const events =
    mode === "clear" ? clearEvents : trickierEvents(account);
  const ready = mode === "clear" || account !== null;
  const totals = ready ? sampleTotals(events) : null;
  const quote = mode === "clear" ? CLEAR_QUOTE : TRICKIER_QUOTE;

  function showClear() {
    setMode("clear");
    setAccount(null);
    setNotice("Three possible records shown. Nothing is saved.");
  }

  return (
    <article className={s.sample} id="sample" aria-labelledby={titleId}>
      <p className={s.kicker} id={titleId}>
        Fictional example
      </p>
      <blockquote className={s.quote}>“{quote}”</blockquote>
      <div className={s.sampleActions}>
        <button
          type="button"
          id="read-sample"
          className={s.quiet}
          onClick={showClear}
        >
          See how CashNarra reads this
        </button>
        <button
          type="button"
          className={s.quiet}
          onClick={() => {
            setMode("trickier");
            setAccount(null);
            setNotice("");
          }}
        >
          Try a trickier story
        </button>
      </div>
      {mode === "trickier" && !account && (
        <fieldset className={s.question}>
          <legend>Was the GH₵80 delivery paid from Cash or MoMo?</legend>
          <div className={s.choices}>
            {(["Cash", "MoMo"] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                className={s.choice}
                onClick={() => {
                  setAccount(choice);
                  setNotice(
                    "Three possible records shown. That's what you'd review before saving.",
                  );
                }}
              >
                {choice}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <ol className={s.events}>
        {events.map((event, index) => (
          <li key={event.id}>
            <SampleRow event={event} index={index + 1} />
          </li>
        ))}
      </ol>
      {totals ? (
        <p className={s.meaning}>
          Sales {formatMoney(totals.sales)}. Money received{" "}
          {formatMoney(totals.received)}, because the{" "}
          {formatMoney(totals.debtSettlement)} from Abena pays an old debt and
          is not a new sale. Net movement {formatMoney(totals.net)}.
        </p>
      ) : (
        <p className={s.meaning}>
          Choose the delivery account before this example shows a money total.
        </p>
      )}
      <p className={s.review}>
        {ready
          ? "That's what you'd review before saving."
          : "Nothing is saved."}
      </p>
      <p className={s.notice} role="status" aria-live="polite">
        {notice}
      </p>
      <div className={s.sampleActions}>
        <Link className={s.primary} href="/auth?mode=signup">
          Record my own story
        </Link>
        <button type="button" className={s.quiet} onClick={showClear}>
          Reset example
        </button>
      </div>
    </article>
  );
}

function SampleRow({ event, index }: { event: SampleEvent; index: number }) {
  return (
    <div className={s.row}>
      <span className={s.node} aria-hidden="true">
        {index}
      </span>
      <span>
        <strong>{event.title}</strong>
        <small>
          {event.meaning}
          {event.account ? ` · ${event.account}` : " · account not chosen"}
        </small>
      </span>
      <span className={s.amount}>
        {event.account ? formatMoney(event.amount) : "—"}
      </span>
    </div>
  );
}
