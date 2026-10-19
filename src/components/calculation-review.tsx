"use client";
import { useState } from "react";
import type { StoryCalculation } from "@/domain/story-calculation";
import { formatMoney } from "@/domain/money";
import { Amount, Button } from "./ui";
import s from "./app.module.css";

function spoken(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
function shortBasis(basis: string) {
  return basis === "revenue"
    ? "Sales, including unpaid sales"
    : "Money received from customers";
}

export default function CalculationReview({
  calculation: c,
  hidden,
  disabled,
  onConfirm,
}: {
  calculation: StoryCalculation;
  hidden: boolean;
  disabled: boolean;
  onConfirm: (amount: string, note: string) => void;
}) {
  const [choice, setChoice] = useState(c.options.length === 1 ? 0 : -1);
  const option = c.options[choice];
  const period =
    c.from === c.to ? spoken(c.from) : `${spoken(c.from)} – ${spoken(c.to)}`;
  return (
    <section className={s.calcCard} aria-label="Check this calculation">
      <p>
        {period}
        {c.payOn ? ` · pay on ${spoken(c.payOn)}` : ""}
      </p>
      {c.options.length > 1 && (
        <div className={s.choiceGrid}>
          {c.options.map((o, i) => (
            <button
              key={o.basis}
              type="button"
              className={s.choice}
              aria-pressed={choice === i}
              disabled={disabled}
              onClick={() => setChoice(i)}
            >
              <span>{shortBasis(o.basis)}</span>
              <Amount value={o.total} hidden={hidden} />
            </button>
          ))}
        </div>
      )}
      {option && (
        <>
          <p>
            {c.percent}% of {shortBasis(option.basis).toLowerCase()}
          </p>
          <Amount value={option.amount} hidden={hidden} large />
          <p>
            from <Amount value={option.total} hidden={hidden} />
          </p>
          <div className={s.calcList}>
            {option.records.map((r) => (
              <p key={r.id}>
                <span>
                  {spoken(r.date)}
                  <br />
                  {hidden ? "Record hidden" : r.description}
                </span>
                <Amount value={r.amount} hidden={hidden} />
              </p>
            ))}
            {!option.records.length && (
              <p>No saved records in these dates.</p>
            )}
          </div>
          <Button
            primary
            disabled={disabled || option.amount === "0.00"}
            onClick={() =>
              onConfirm(
                option.amount,
                `${c.percent}% of ${option.label.toLowerCase()} from ${c.from} to ${c.to}: ${option.total} × ${c.percent}% = ${option.amount}. Saved records only. Owed on ${c.recordedOn}.${c.payOn ? ` Planned payment ${c.payOn}.` : ""}`,
              )
            }
          >
            Use {hidden ? "this amount" : formatMoney(option.amount)}
          </Button>
        </>
      )}
    </section>
  );
}
