import Link from "next/link";
import { formatPlanCedis, type PublicPricing } from "@/domain/customer-plans";
import s from "./billing.module.css";

export function PricingPreview({ model }: { model: PublicPricing }) {
  return (
    <main className={s.page}>
      <div className={s.frame}>
        <Link href="/">
          <img
            className={s.logo}
            src="/brand/cashnarra-logo.svg"
            alt="CashNarra"
          />
        </Link>
        <h1>{model.title}</h1>
        <p className={s.intro}>{model.introduction}</p>
        <p className={s.kicker}>{model.sharedAllowance}</p>
        <div className={s.grid}>
          {model.plans.map((plan) => (
            <article
              className={`${s.card} ${plan.id === "plus" ? s.plusCard : ""}`}
              key={plan.id}
            >
              <h2>{plan.name}</h2>
              <p className={s.planPurpose}>
                {plan.id === "free"
                  ? "Build your everyday money habit."
                  : "More help for busier days."}
              </p>
              <p className={s.offer}>
                ${plan.id === "free" ? "0" : plan.offerUsd} <span>/ month</span>
              </p>
              <p className={s.cedis}>
                {plan.id === "free"
                  ? "(GH₵0.00)"
                  : plan.cediAmount
                    ? `(≈ ${formatPlanCedis(plan.cediAmount)})`
                    : "\u00a0"}
              </p>
              {plan.standardUsd ? (
                <p className={s.standard}>
                  Standard price{" "}
                  <span className={s.standardAmount}>${plan.standardUsd}</span>
                </p>
              ) : (
                <p className={s.standard} aria-hidden="true">
                  &nbsp;
                </p>
              )}
              <ul className={s.perks}>
                {plan.perks.map((perk) => (
                  <li key={perk.headline}>
                    <span className={s.perk}>{perk.headline}</span>
                    <span className={s.support}>{perk.support}</span>
                  </li>
                ))}
              </ul>
              {plan.actionLabel === "Start free" ? (
                <Link className={s.primary} href="/auth?mode=signup">
                  Start free
                </Link>
              ) : (
                <Link className={s.primary} href="/pricing/plus">
                  Choose Plus
                </Link>
              )}
            </article>
          ))}
        </div>
        {model.plans.some((plan) => plan.cediAmount) ? (
          <p className={s.meta}>{model.rateLabel}</p>
        ) : null}
        <p className={s.meta}>{model.protectionStatement}</p>
        <ul className={s.notes}>
          {model.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <Link className={s.back} href="/">
          Back to CashNarra
        </Link>
      </div>
    </main>
  );
}
