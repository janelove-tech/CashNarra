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
    "No. Say what happened in your own words. CashNarra sorts out whether it was a sale, a payment, a transfer or an old debt, and you check the records before anything is saved.",
  ],
  [
    "What happens after I speak or type?",
    "You see the records CashNarra understood, one at a time. If something matters and is unclear, it asks one short question. Nothing is saved until you choose to save.",
  ],
  [
    "What if a detail is wrong?",
    "Change it before you save. You can also correct a saved record later. The original words and the correction stay in the history.",
  ],
  [
    "Can I keep business and personal money separate?",
    "Yes. Each workspace has its own records, people and stories. One plan covers all of them.",
  ],
  [
    "Does CashNarra hold or move my money?",
    "No. CashNarra keeps records. Your money stays in your own cash, bank and mobile-money accounts, and nothing here can pay anyone.",
  ],
] as const;

const offer = landingOffer();

export default function Landing() {
  function focusSample() {
    document.getElementById("sample")?.scrollIntoView({ block: "nearest" });
    (
      document.getElementById("read-sample") ??
      document.getElementById("sample-result")
    )?.focus({ preventScroll: true, focusVisible: true } as FocusOptions);
  }
  return (
    <main className={shell.landing}>
      <a className={shell.skip} href="#sample">
        Skip to the example
      </a>
      <header className={s.header}>
        <img className={s.logo} src="/brand/cashnarra-logo.svg" alt="CashNarra" />
        <div className={s.tools}>
          <nav aria-label="Public">
            <a href="#how">How it works</a>
            <Link href="/pricing">Pricing</Link>
            <Link href="/auth">Sign in</Link>
          </nav>
          <Link className={s.primary} href="/auth?mode=signup">
            Start free
          </Link>
        </div>
      </header>

      <section className={s.hero}>
        <div>
          <span className={s.eyebrow}>
            Cash, MoMo, credit and the people you deal with
          </span>
          <h1>
            Say what happened. <em>Know where you stand.</em>
          </h1>
          <p className={s.support}>
            Type or speak your day the way you would tell a friend. CashNarra
            turns it into records you check before anything is saved, then
            shows what came in, what went out and who still owes.
          </p>
          <div className={s.actions}>
            <Link className={s.primary} href="/auth?mode=signup">
              Start free
            </Link>
            <button type="button" className={s.secondary} onClick={focusSample}>
              Try an example
            </button>
          </div>
          <p className={s.caption}>
            Fictional example. No account needed, and nothing is saved.
          </p>
        </div>
        <SampleStory />
      </section>

      <section className={s.section} id="how">
        <h2>Three things, in your own words.</h2>
        <p>
          There are no categories to pick before you start. You describe the
          day; CashNarra does the sorting and shows its working.
        </p>
        <ol className={s.steps}>
          <li>
            <h3>Say it</h3>
            <p>
              Several things at once: a sale, a delivery, Abena paying part of
              what she owed. Speak it or type it, on any day you remember.
            </p>
          </li>
          <li>
            <h3>Check it</h3>
            <p>
              Each record appears as a plain row with its amount, account and
              person. If a detail changes the meaning, CashNarra asks one
              question. You save when you are happy.
            </p>
          </li>
          <li>
            <h3>Know where you stand</h3>
            <p>
              Money in, money out and who owes what, for a day, a week or a
              month. Every figure opens the records behind it.
            </p>
          </li>
        </ol>
      </section>

      <section className={s.band} aria-labelledby="answers-heading">
        <div>
          <span className={s.eyebrow}>A month of days becomes an answer</span>
          <h2 id="answers-heading">Numbers you can trace back to what you said.</h2>
          <p>
            Money Stories add your days up. Net movement is money in minus
            money out, and CashNarra says plainly that it is not profit. For a
            business, a separate review asks about costs before it works profit
            out.
          </p>
        </div>
        <div className={s.answer}>
          <small>The example day above, added up · fictional</small>
          <dl>
            <div>
              <dt>Money in</dt>
              <dd className="in">GH₵1,100.00</dd>
            </div>
            <div>
              <dt>Money out</dt>
              <dd className="out">GH₵80.00</dd>
            </div>
            <div>
              <dt>Net movement · not profit</dt>
              <dd>GH₵1,020.00</dd>
            </div>
            <div>
              <dt>Sales, without the old debt</dt>
              <dd>GH₵900.00</dd>
            </div>
          </dl>
          <small style={{ marginTop: 12 }}>
            Abena’s GH₵200.00 counts as money in, not as a sale.
          </small>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.split}>
          <div>
            <h2>Give a goal a date you can argue with.</h2>
            <p>
              Set a target, mark money towards it, and try a monthly amount to
              see roughly when you would get there. Trying an amount changes
              the estimate, never your records.
            </p>
          </div>
          <LandingGoal />
        </div>
      </section>

      <section className={s.section}>
        <h2>You stay in control.</h2>
        <ul className={s.control}>
          <li>
            <strong>Nothing is saved without you.</strong> Transcripts and
            suggestions are not records until you check them and save.
          </li>
          <li>
            <strong>Your money stays where it is.</strong> CashNarra keeps
            records. It cannot move, hold or pay money.
          </li>
          <li>
            <strong>Business and personal stay apart.</strong> Separate
            workspaces, one plan.
          </li>
          <li>
            <strong>Take your records with you.</strong> Download a tidy PDF or
            Excel report, or a CSV for another tool.
          </li>
        </ul>
      </section>

      <section className={s.section} aria-labelledby="plans-heading">
        <h2 id="plans-heading">Start free. Choose Plus when you need more.</h2>
        <p>Both plans keep unlimited financial records.</p>
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
                {plan.standard ? (
                  <s>Standard price {plan.standard}</s>
                ) : (
                  " "
                )}
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
          Keep your monthly dollar price unless you choose to upgrade.{" "}
          <Link href="/pricing">See all plan limits</Link>
        </p>
      </section>

      <section className={s.section} id="questions">
        <h2>Questions people ask first.</h2>
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
        <h2>Start with what happened today.</h2>
        <p>
          One story, checked and saved, is enough to see the point. The rest
          builds day by day.
        </p>
        <Link className={s.primary} href="/auth?mode=signup">
          Start free
        </Link>
      </section>
      <footer className={s.footer}>
        <span>Say what happened. Know where you stand.</span>
        <Link href="/privacy">Privacy</Link>
      </footer>
    </main>
  );
}
