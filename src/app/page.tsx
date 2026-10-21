"use client";
import Link from "next/link";
import { SampleStory } from "@/components/landing/sample-story";
import shell from "@/components/app.module.css";
import s from "@/components/landing/landing.module.css";

const questions = [
  [
    "Do I need to know accounting?",
    "No. Describe what happened as you normally would. CashNarra suggests the records and you review them before saving.",
  ],
  [
    "Does CashNarra connect to my bank or MoMo?",
    "Not in this version. You add and update Cash, Bank and MoMo records yourself. Shown balances come from your entries, not from a bank.",
  ],
  [
    "Will it move or hold my money?",
    "No. CashNarra records and explains money activity. It does not transfer funds or operate a wallet.",
  ],
  [
    "What if it misunderstands a payment?",
    "Correct the proposed event before saving. Saved records can also be corrected, and the change keeps a history.",
  ],
  [
    "Can I use it for business and personal money?",
    "Yes. Keep separate workspaces so shop records and personal records stay apart.",
  ],
  [
    "Is speaking available?",
    "Text is the way to record a story today. Short audio transcription is still being checked, and it is not generally available.",
  ],
] as const;

export default function Landing() {
  function focusSample() {
    document.getElementById("sample")?.scrollIntoView({ block: "nearest" });
    document.getElementById("read-sample")?.focus();
  }
  return (
    <main className={shell.landing}>
      <div className={shell.landingMarks} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <header>
        <img
          className={shell.logo}
          src="/brand/cashnarra-logo.svg"
          alt="CashNarra"
        />
        <div className={shell.landingTools}>
          <nav aria-label="On this page">
            <a href="#how">How it works</a>
            <a href="#questions">Questions</a>
          </nav>
          <Link href="/auth" className={s.secondary}>
            Sign in
          </Link>
        </div>
      </header>
      <section className={s.hero}>
        <div>
          <h1>Tell us what happened with your money. We’ll help you make sense of it.</h1>
          <p className={s.support}>
            Describe a sale, expense or payment in your own words. Check the
            records CashNarra finds, save them, and see the numbers clearly.
          </p>
          <div className={s.actions}>
            <button type="button" className={s.primary} onClick={focusSample}>
              Try a sample story
            </button>
            <Link className={s.secondary} href="/auth?mode=signup">
              Create my account
            </Link>
          </div>
          <p className={s.caption}>
            Fictional example. No account needed. Nothing is saved.
          </p>
        </div>
        <SampleStory />
      </section>
      <section className={s.section} id="how">
        <h2>One story. Clear records. Your decision.</h2>
        <ol className={s.steps}>
          <li>
            <span>1</span>
            <h3>Tell it your way</h3>
            <p>Several events can go in one message.</p>
          </li>
          <li>
            <span>2</span>
            <h3>Check what CashNarra understood</h3>
            <p>Fix a detail if it needs one.</p>
          </li>
          <li>
            <span>3</span>
            <h3>Save and see the meaning</h3>
            <p>Your accounts, records and Money Stories update from what you confirm.</p>
          </li>
        </ol>
      </section>
      <section className={s.section}>
        <h2>Know what came in—and what it meant.</h2>
        <p>
          Old customer payments are not counted as new sales. Transfers are
          not expenses.
        </p>
        <div className={s.metrics}>
          <div>
            <span>Sales in the example</span>
            <strong>GH₵900.00</strong>
          </div>
          <div>
            <span>Money received</span>
            <strong>GH₵1,100.00</strong>
          </div>
          <div>
            <span>Net movement</span>
            <strong>GH₵1,020.00</strong>
          </div>
        </div>
        <p>
          The extra GH₵200.00 is Abena paying an old debt. It is cash in, and
          it is not another sale.
        </p>
      </section>
      <section className={s.section}>
        <h2>For the shop, the side hustle and your own everyday money.</h2>
        <div className={s.uses}>
          <article>
            <h3>The shop</h3>
            <p>A cash sale, a delivery payment, and a customer paying an old balance.</p>
          </article>
          <article>
            <h3>The side hustle</h3>
            <p>Money you earned, money you spent, and what you still owe someone.</p>
          </article>
          <article>
            <h3>Everyday money</h3>
            <p>Cash, bank and MoMo, kept as the records you choose to save.</p>
          </article>
        </div>
        <p className={s.trust}>
          Your money stays in your accounts. CashNarra records what you tell
          it. It doesn’t access your bank or MoMo automatically.
        </p>
      </section>
      <section className={s.section} id="questions">
        <h2>A few things worth knowing</h2>
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
        <h2>Your next money story starts with one ordinary day.</h2>
        <p>Start with something you remember. Check the details before saving.</p>
        <div className={s.actions}>
          <Link className={s.primary} href="/auth?mode=signup">
            Create my account
          </Link>
          <button type="button" className={s.secondary} onClick={focusSample}>
            Try the fictional example again
          </button>
        </div>
      </section>
      <footer>
        <hr />
        <p>Tell Your Money Story. See the Numbers.</p>
        <Link href="/privacy">Privacy and development status</Link>
      </footer>
    </main>
  );
}
