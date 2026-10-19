"use client";
import { useState } from "react";
import type { StoryCalculation } from "@/domain/story-calculation";
import { Amount, Button } from "./ui";

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
  const [choice, setChoice] = useState(c.options.length === 1 ? "0" : "");
  const [checked, setChecked] = useState(false);
  const option = choice === "" ? null : c.options[Number(choice)];
  return (
    <section aria-label="Check this calculation">
      <h2>Let’s check the amount</h2>
      <p>
        {c.from} to {c.to}, including both days. This amount is owed on{" "}
        {c.recordedOn}.
        {c.payOn
          ? ` ${c.payOn} is the day you plan to pay, so it still counts before that day.`
          : ""}
      </p>
      <label>
        What should the percentage apply to?
        <select
          value={choice}
          disabled={disabled}
          onChange={(e) => {
            setChoice(e.target.value);
            setChecked(false);
          }}
        >
          <option value="">Choose which money you mean</option>
          {c.options.map((o, i) => (
            <option key={o.basis} value={i}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      {option && (
        <>
          <p>
            <Amount value={option.total} hidden={hidden} /> × {c.percent}% ={" "}
            <Amount value={option.amount} hidden={hidden} />
          </p>
          <details>
            <summary>See the {option.records.length} included records</summary>
            {option.records.map((r) => (
              <p key={r.id}>
                {r.date} · {hidden ? "Record hidden" : r.description} ·{" "}
                <Amount value={r.amount} hidden={hidden} />
              </p>
            ))}
            {!option.records.length && (
              <p>No matching saved records in this period.</p>
            )}
          </details>
          <p>
            Only saved records are included, once each. Check that any money
            mentioned in your story is already listed. Loans, transfers and your
            money you put in yourself is left out.
          </p>
          <p>This uses the percentage you gave, not a tax assessment.</p>
          <label>
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={(e) => setChecked(e.target.checked)}
            />{" "}
            These are the dates and records I meant.
          </label>
          <Button
            disabled={disabled || !checked || option.amount === "0.00"}
            onClick={() =>
              onConfirm(
                option.amount,
                `${c.percent}% of ${option.label.toLowerCase()} from ${c.from} to ${c.to}: ${option.total} × ${c.percent}% = ${option.amount}. Saved records only. Owed on ${c.recordedOn}.${c.payOn ? ` Planned payment ${c.payOn}.` : ""}`,
              )
            }
          >
            Use this amount
          </Button>
        </>
      )}
    </section>
  );
}
