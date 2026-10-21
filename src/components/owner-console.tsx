import Link from "next/link";
import {
  formatPlanCedis,
  ownerConsoleModel,
} from "@/domain/customer-plans";
import s from "./billing.module.css";

export function OwnerConsole({
  readiness,
}: {
  readiness?: {
    groqKey: boolean;
    freePlanFile: boolean;
    voiceSwitch: boolean;
    storyPause: boolean;
  };
}) {
  const model = ownerConsoleModel();
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
        <h1>Owner console</h1>
        <p className={s.intro}>
          Prepared records for plans and support. Payments are {model.payments}.
          This console does not read customer stories, change the ledger, or
          change the provider pause.
        </p>
        <div className={s.stack}>
          <section className={s.panel}>
            <h2>Overview</h2>
            <p className={s.status}>Paid access: none recorded.</p>
            <p className={s.status}>Protected-price groups: none yet.</p>
            <p className={s.status}>Collections and failed renewals: none.</p>
            <p className={s.status}>Open support tickets: none stored.</p>
            <p className={s.note}>
              Provider service status stays where it already is. Opening this
              page does not clear a pause or enable voice.
            </p>
          </section>
          <section className={s.panel}>
            <h2>Customers and subscriptions</h2>
            <p>
              Customer search is not connected. This preview does not load
              financial stories.
            </p>
            <p className={s.note}>
              A complimentary grant needs a written reason and a hosted record.
              It is labelled complimentary access and is not a payment.
            </p>
          </section>
          <section className={s.panel}>
            <h2>Plans and offers</h2>
            <p>
              Campaigns are draft. Enrolment dates are not configured. Editing a
              price here is not saved, so the prepared specification stays as
              written.
            </p>
            <div className={s.grid}>
              {model.plans.map((plan) => (
                <article className={s.card} key={plan.id}>
                  <p className={s.kicker}>
                    {plan.visibility} · {plan.purchasable ? "purchasable" : "not for sale"} ·{" "}
                    {plan.campaignStatus}
                  </p>
                  <h3>{plan.name}</h3>
                  {plan.offerUsd ? (
                    <>
                      <p className={s.offer}>
                        ${plan.offerUsd} <span>launch benchmark</span>
                      </p>
                      <p className={s.cedis}>
                        {formatPlanCedis(plan.offerGhs ?? "0.00")}
                      </p>
                      <p className={s.standard}>
                        Standard price{" "}
                        <span className={s.standardAmount}>
                          ${plan.regularUsd}
                        </span>{" "}
                        · {formatPlanCedis(plan.regularGhs)}
                      </p>
                    </>
                  ) : (
                    <p className={s.offer}>
                      ${plan.regularUsd} <span>benchmark</span>
                    </p>
                  )}
                  <p className={s.note}>{plan.note}</p>
                  <p className={s.note}>
                    Enrolment start: {plan.enrolmentStart ?? "Not configured"}.
                    Enrolment end: {plan.enrolmentEnd ?? "Not configured"}.
                    Quotas {plan.quotasApproved ? "are in the design" : "are not approved"}.
                  </p>
                </article>
              ))}
            </div>
            <p className={s.meta}>
              {model.rate.statement} Spec {model.specVersion}. Changing
              visibility does not make a plan purchasable.
            </p>
          </section>
          <section className={s.panel}>
            <h2>Usage and service</h2>
            <p>
              Customer allowances, attempts, provider capacity, company cost,
              and subscription payments stay separate records. A restored
              customer allowance does not erase a provider hold.
            </p>
            <p className={s.note}>
              The current daily processing guard is 10 calls. The drafted Plus
              quantity of 500 stories a month is not reachable under that guard.
              That note stays in this console. The public page still shows the
              finished 500-story offer.
            </p>
            {readiness && (
              <ul>
                <li>
                  Groq key: {readiness.groqKey ? "present" : "missing"}.
                </li>
                <li>
                  Free-plan confirmation file:{" "}
                  {readiness.freePlanFile ? "present" : "missing"}.
                </li>
                <li>
                  Voice switch: {readiness.voiceSwitch ? "on" : "off"}.
                </li>
                <li>Checkout: off.</li>
                <li>
                  Story reading pause file:{" "}
                  {readiness.storyPause ? "present" : "absent"}.
                </li>
              </ul>
            )}
          </section>
          <section className={s.panel}>
            <h2>Support</h2>
            <p>
              Ticket states are {model.supportStates.join(", ")}. No tickets are
              stored. A private note is not a customer reply.
            </p>
          </section>
          <section className={s.panel}>
            <h2>History</h2>
            <p>
              No price, campaign, visibility, access grant, or support change
              has been saved from this console. The prices above are the
              prepared specification, not evidence of a past sale.
            </p>
          </section>
        </div>
        <Link className={s.back} href="/">
          Back to CashNarra
        </Link>
      </div>
    </main>
  );
}
