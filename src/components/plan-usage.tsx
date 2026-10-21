import type { RefObject } from "react";
import Link from "next/link";
import type { planUsageModel } from "@/domain/customer-plans";
import s from "./app.module.css";

export function PlanUsage({
  headingRef,
  model,
  onAction,
}: {
  headingRef?: RefObject<HTMLHeadingElement | null>;
  model: ReturnType<typeof planUsageModel>;
  onAction?: (id: string) => void;
}) {
  const view = model.view;
  return (
    <>
      <div className={s.pageIntro}>
        <h1 ref={headingRef} tabIndex={-1}>
          Your plan and usage
        </h1>
        <p>{view.summary}</p>
      </div>
      <section className={`${s.panel} ${s.panelNarrow}`}>
        <h2>{view.title}</h2>
        <p className={s.muted}>{model.resetLine}</p>
        <ul className={s.usageRows}>
          {view.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {view.cancelCopy ? <p>{view.cancelCopy}</p> : null}
        <div className={s.actions}>
          {view.actions.map((action) =>
            action.href ? (
              <Link
                key={action.id}
                className={
                  action.primary ? `${s.button} ${s.primary}` : s.button
                }
                href={action.href}
              >
                {action.label}
              </Link>
            ) : (
              <button
                key={action.id}
                type="button"
                className={action.primary ? `${s.button} ${s.primary}` : s.button}
                onClick={() => onAction?.(action.id)}
              >
                {action.label}
              </button>
            ),
          )}
        </div>
      </section>
    </>
  );
}
