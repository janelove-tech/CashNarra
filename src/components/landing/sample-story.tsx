"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { formatMoney } from "@/domain/money";
import {
  CLEAR_QUOTE,
  TRICKIER_QUOTE,
  clearEvents,
  initialStoryDemo,
  nextStoryDemo,
  sampleTotals,
  storySummaryReady,
  trickierEvents,
  type SampleEvent,
  type StoryDemo,
} from "./sample-fixture";
import s from "./sample-story.module.css";

/**
 * One fictional day in the story log, worked in the browser with fixed
 * figures. No sign-in, no provider, no storage. The figures come from the
 * fixture and are never recalculated by anything that could drift.
 */
export function SampleStory() {
  const [demo, setDemo] = useState<StoryDemo>(initialStoryDemo);
  const [notice, setNotice] = useState("");
  const titleId = useId();
  const pendingFocus = useRef<string | null>(null);
  const events =
    demo.mode === "clear" ? clearEvents : trickierEvents(demo.account);
  const ready = storySummaryReady(demo);
  const totals = ready ? sampleTotals(events) : null;
  const quote = demo.mode === "clear" ? CLEAR_QUOTE : TRICKIER_QUOTE;

  useEffect(() => {
    if (!pendingFocus.current) return;
    document.getElementById(pendingFocus.current)?.focus({
      preventScroll: true,
      focusVisible: true,
    } as FocusOptions);
    pendingFocus.current = null;
  }, [demo]);

  function update(action: "reveal" | "missing" | "cash" | "momo" | "reset") {
    const next = nextStoryDemo(demo, action);
    pendingFocus.current =
      action === "reset"
        ? "read-sample"
        : action === "missing"
          ? "delivery-question"
          : "sample-result";
    setDemo(next);
    if (action === "reset") setNotice("Example reset. Nothing is saved.");
    else if (action === "missing")
      setNotice("The delivery account is still needed. Nothing is saved.");
    else if (action === "cash" || action === "momo")
      setNotice(
        `The delivery account is ${action === "cash" ? "Cash" : "MoMo"}. Nothing is saved.`,
      );
    else setNotice("Three records to check. Nothing is saved.");
  }

  return (
    <article
      className={s.sample}
      id="sample"
      tabIndex={-1}
      aria-labelledby={titleId}
    >
      <span className={s.kicker} id={titleId}>
        Fictional example · Tuesday 13 October
      </span>
      <blockquote className={s.quote}>“{quote}”</blockquote>
      <p className={s.who}>Ama said</p>
      {!demo.revealed ? (
        <div className={s.sampleActions}>
          <button
            type="button"
            id="read-sample"
            className={s.primary}
            onClick={() => update("reveal")}
          >
            See the records
          </button>
        </div>
      ) : (
        <div className={s.result}>
          <h2 id="sample-result" tabIndex={-1}>
            One story. Three records to check.
          </h2>
          {demo.mode === "trickier" && !demo.account && (
            <fieldset
              className={s.question}
              id="delivery-question"
              tabIndex={-1}
            >
              <legend>Which account paid for delivery?</legend>
              <p>This changes which balance goes down. Nothing else does.</p>
              <div className={s.choices} role="group">
                {(["Cash", "MoMo"] as const).map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    className={s.choice}
                    onClick={() => update(choice === "Cash" ? "cash" : "momo")}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <ol className={s.events}>
            {events.map((event) => (
              <li key={event.id}>
                <SampleRow event={event} />
              </li>
            ))}
          </ol>
          {totals ? (
            <>
              <dl className={s.totals}>
                <div>
                  <dt>Money in</dt>
                  <dd>{formatMoney(totals.received)}</dd>
                </div>
                <div>
                  <dt>Money out</dt>
                  <dd>{formatMoney(totals.paid)}</dd>
                </div>
                <div>
                  <dt>Net movement</dt>
                  <dd>{formatMoney(totals.net)}</dd>
                </div>
              </dl>
              <p className={s.meaning}>
                The {formatMoney(totals.debtSettlement)} from Abena pays an old
                debt. It is not a new sale. Sales stay{" "}
                {formatMoney(totals.sales)}.
              </p>
            </>
          ) : (
            <p className={s.meaning}>
              Choose the delivery account before this example shows a money
              total.
            </p>
          )}
          <p className={s.review}>Example only. Nothing is saved.</p>
          <div className={s.sampleActions}>
            <Link className={s.primary} href="/auth?mode=signup">
              Start free
            </Link>
            <button
              type="button"
              className={s.quiet}
              aria-label="Reset the story example"
              onClick={() => update("reset")}
            >
              Reset example
            </button>
            {ready && demo.mode === "clear" && (
              <button
                type="button"
                className={s.quiet}
                onClick={() => update("missing")}
              >
                Try a missing detail
              </button>
            )}
          </div>
        </div>
      )}
      <p className={s.notice} role="status" aria-live="polite">
        {notice}
      </p>
    </article>
  );
}

function SampleRow({ event }: { event: SampleEvent }) {
  const kind =
    event.id === "debt" ? "person" : event.amount.startsWith("-") ? "out" : "in";
  return (
    <div className={s.row}>
      <span className={s.node} data-kind={kind} aria-hidden="true">
        {kind === "person" ? "A" : kind === "out" ? "↗" : "↙"}
      </span>
      <span>
        <strong>{event.title}</strong>
        <small>
          {event.account ?? "Account not chosen"} · {event.meaning}
        </small>
      </span>
      <span className={s.amount}>{formatMoney(event.amount)}</span>
    </div>
  );
}
