"use client";
import { useEffect, useId, useRef, useState } from "react";
import { formatMoney } from "@/domain/money";
import { landingGoalEstimate, LANDING_GOAL } from "./goal-illustration";
import s from "./sample-story.module.css";

const paces = ["300.00", "500.00"] as const;

export function LandingGoal() {
  const labelId = useId();
  const [open, setOpen] = useState(false);
  const [pace, setPace] = useState<(typeof paces)[number]>("300.00");
  const pendingFocus = useRef(false);
  const estimate = landingGoalEstimate(pace);

  useEffect(() => {
    if (!pendingFocus.current) return;
    document.getElementById("explore-goal")?.focus({
      preventScroll: true,
      focusVisible: true,
    } as FocusOptions);
    pendingFocus.current = false;
  }, [open, pace]);

  function reset() {
    pendingFocus.current = true;
    setOpen(false);
    setPace("300.00");
  }

  return (
    <article className={s.sample} aria-labelledby={labelId}>
      <p className={s.kicker} id={labelId}>
        Fictional goal
      </p>
      <h3>{LANDING_GOAL.name}</h3>
      <dl className={s.totals}>
        <div>
          <dt>Target</dt>
          <dd>{formatMoney(LANDING_GOAL.target)}</dd>
        </div>
        <div>
          <dt>Set aside</dt>
          <dd>{formatMoney(LANDING_GOAL.setAside)}</dd>
        </div>
        <div>
          <dt>Remaining</dt>
          <dd>{formatMoney(estimate.remaining)}</dd>
        </div>
      </dl>
      <p className={s.meaning}>
        {formatMoney(pace)} a month · About {estimate.months} months
      </p>
      <p className={s.review}>
        The same amount is added each month, with no growth or withdrawals.
      </p>
      {!open ? (
        <div className={s.sampleActions}>
          <button
            type="button"
            id="explore-goal"
            className={s.primary}
            onClick={() => setOpen(true)}
          >
            Explore what-if
          </button>
        </div>
      ) : (
        <fieldset className={s.question}>
          <legend>Monthly amount</legend>
          <div className={s.choices}>
            {paces.map((choice) => (
              <label key={choice} className={s.choice}>
                <input
                  type="radio"
                  name="landing-pace"
                  value={choice}
                  checked={pace === choice}
                  onChange={() => setPace(choice)}
                />
                {choice === "300.00" ? "GH₵300 a month" : "GH₵500 a month"}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className={s.sampleActions}>
        <button
          type="button"
          className={s.quiet}
          aria-label="Reset the goal example"
          onClick={reset}
        >
          Reset example
        </button>
      </div>
    </article>
  );
}
