"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CURRENT_PLUS_OFFER_USD,
  formatPlanCedis,
  type PublicPricing,
} from "@/domain/customer-plans";
import s from "./billing.module.css";

export function PlusReview({ model }: { model: PublicPricing }) {
  const plus = model.plans.find((plan) => plan.id === "plus");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId: "plus" }),
      });
      const body = (await response.json()) as {
        code?: string;
        message?: string;
      };
      setMessage(
        body.code === "checkout_disabled"
          ? "Plus is not started. Payment is not connected, so your Free plan stays as it is."
          : body.message || "Plus is not started.",
      );
    } catch {
      setMessage(
        "Plus is not started. Payment is not connected, so your Free plan stays as it is.",
      );
    } finally {
      setBusy(false);
    }
  }

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
        <h1>Review Plus</h1>
        <p className={s.intro}>
          Compare the price before you continue. This step does not charge a
          card or MoMo.
        </p>
        <article className={s.panel}>
          <h2>Plus</h2>
          <p className={s.offer}>
            ${plus?.offerUsd ?? CURRENT_PLUS_OFFER_USD} <span>/ month</span>
          </p>
          <p className={s.cedis}>
            {plus?.cediAmount
              ? `(≈ ${formatPlanCedis(plus.cediAmount)})`
              : model.rateLabel}
          </p>
          {plus?.standardUsd ? (
            <p className={s.standard}>
              Standard price{" "}
              <span className={s.standardAmount}>${plus.standardUsd}</span>
            </p>
          ) : null}
          <p className={s.meta}>
            Free stays at $0 / month (GH₵0.00). One subscription covers every
            workspace on this account.
          </p>
          <ul className={s.perks}>
            {(plus?.perks ?? []).map((perk) => (
              <li key={perk.headline}>
                <span className={s.perk}>{perk.headline}</span>
                <span className={s.support}>{perk.support}</span>
              </li>
            ))}
          </ul>
          <button
            className={s.primary}
            type="button"
            disabled={busy}
            onClick={() => void confirm()}
          >
            {busy ? "Checking…" : "Continue"}
          </button>
          {message ? (
            <p className={s.status} role="status">
              {message}
            </p>
          ) : null}
        </article>
        {plus?.cediAmount ? <p className={s.meta}>{model.rateLabel}</p> : null}
        <Link className={s.back} href="/pricing">
          Back to plans
        </Link>
      </div>
    </main>
  );
}
