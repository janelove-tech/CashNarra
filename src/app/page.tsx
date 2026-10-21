"use client";
import Link from "next/link";
import { LandingGoal } from "@/components/landing/landing-goal";
import { landingOffer } from "@/components/landing/landing-prices";
import { SampleStory } from "@/components/landing/sample-story";
import shell from "@/components/app.module.css";
import s from "@/components/landing/landing.module.css";

const questions = [
  [
    "Do I need to know accounting?",
    "No. Tell us what happened in your own words. You check the records before anything is saved.",
  ],
  [
    "Can I type instead of speaking?",
    "Yes. Speak or type, then check the words before you continue.",
  ],
  [
    "What if a detail is wrong?",
    "Change it before you save. You can also correct a saved record later.",
  ],
  [
    "Can I keep business and personal money separate?",
    "Yes. Use different workspaces so each set of records stays separate.",
  ],
  [
    "Does CashNarra hold or move my money?",
    "No. CashNarra organises your records. Your money stays in your own cash, bank, or mobile-money account.",
  ],
] as const;

const offer = landingOffer();

export default function Landing() {
  function focusSample() {
    document.getElementById("sample")?.scrollIntoView({ block: "nearest" });
    (document.getElementById("read-sample") ?? document.getElementById("sample-result"))?.focus({
      preventScroll: true,
      focusVisible: true,
    } as FocusOptions);
  }
  return (
    <main className={shell.landing}>
      <a className={shell.skip} href="#sample">
        Skip to the example
      </a>
      <header>
        <img
          className={shell.logo}
          src="/brand/cashnarra-logo.svg"
          alt="CashNarra"
        />
        <div className={shell.landingTools}>
          <nav aria-label="Public">
            <a href="#how">How it works</a>
            <Link href="/pricing">Pricing</Link>
            <Link href="/auth">Sign in</Link>
          </nav>
          <Link className={shell.button} href="/auth?mode=signup">
            Start free
          </Link>
        </div>
      </header>
      <section className={s.hero}>
        <div>
          <p className={s.kicker}>For you and your business</p>
          <h1>Tell your money story. See the numbers.</h1>
          <p className={s.support}>
            Speak or type what happened with your money. Check the records,
            understand the numbers, and plan what comes next.
          </p>
          <div className={s.actions}>
            <button type="button" className={s.primary} onClick={focusSample}>
              Try an example
            </button>
            <Link className={s.secondary} href="/auth?mode=signup">
              Start free
            </Link>
          </div>
          <p className={s.caption}>Fictional example. No account needed.</p>
        </div>
        <SampleStory />
      </section>
      <section className={s.section} id="how">
        <h2>From what happened to what comes next.</h2>
        <ol className={s.steps}>
          <li>
            <h3>Record</h3>
            <p>Speak or type in your own words.</p>
          </li>
          <li>
            <h3>Understand</h3>
            <p>See money in, money out, what you owe, and what people owe you.</p>
          </li>
          <li>
            <h3>Plan</h3>
            <p>Set a goal and explore what a different monthly amount could change.</p>
          </li>
        </ol>
      </section>
      <section className={s.section}>
        <h2>Give your next goal a clearer path.</h2>
        <p className={s.support}>
          Choose a goal. Try a monthly amount and see how the estimate changes.
        </p>
        <div className={s.goal}>
          <LandingGoal />
        </div>
      </section>
      <section className={s.section}>
        <h2>You stay in control.</h2>
        <ul className={s.control}>
          <li>
            <strong>Check before saving.</strong> Review the records and change a
            detail when needed.
          </li>
          <li>
            <strong>Keep things separate.</strong> Use different workspaces for
            personal and business records.
          </li>
          <li>
            <strong>Keep a copy.</strong> Download your records and summaries.
          </li>
        </ul>
      </section>
      <section className={s.section} aria-labelledby="plans-heading">
        <h2 id="plans-heading">Start free. Choose Plus when you need more.</h2>
        <div className={s.plans}>
          {offer.plans.map((plan) => (
            <article key={plan.id} className={s.plan}>
              <h3>{plan.name}</h3>
              <p className={s.price}>
                {plan.dollars}
                <span> / month</span>
              </p>
              <p className={s.cedi}>{plan.cedi}</p>
              <p className={plan.standard ? s.standard : s.standardEmpty}>
                {plan.standard ? <s>Standard price {plan.standard}</s> : "\u00a0"}
              </p>
              <ul>
                {plan.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <Link
                className={plan.id === "plus" ? s.primary : s.secondary}
                href={plan.href}
              >
                {plan.action}
              </Link>
            </article>
          ))}
        </div>
        <p className={s.rate}>{offer.rateLabel}</p>
        <p className={s.caption}>
          Keep your monthly dollar price unless you choose to upgrade.
        </p>
        <p>
          <Link href="/pricing">See all plan limits</Link>
        </p>
      </section>
      <section className={s.section} id="questions">
        <h2>Questions</h2>
        <div className={s.faq}>
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className={s.close}>
        <h2>Start with one money story.</h2>
        <p>Bring the words. Check the records. See what comes next.</p>
        <div className={s.actions}>
          <Link className={s.primary} href="/auth?mode=signup">
            Start free
          </Link>
        </div>
      </section>
      <footer>
        <hr />
        <p>Tell Your Money Story. See the Numbers.</p>
        <Link href="/privacy">Privacy</Link>
      </footer>
    </main>
  );
}
