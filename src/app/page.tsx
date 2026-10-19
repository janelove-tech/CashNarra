"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button, Amount } from "@/components/ui";
import s from "@/components/app.module.css";
export default function Landing() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function demo() {
    setBusy(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      location.href = "/app";
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <main className={s.landing}>
      <header>
        <img
          className={s.logo}
          src="/brand/cashnarra-lockup.svg"
          alt="CashNarra"
        />
        <Link href="/auth" className={s.button}>
          Sign in
        </Link>
      </header>
      <section className={s.landingHero}>
        <div>
          <span className={s.badge}>Record → Understand → Plan</span>
          <h1 style={{ marginTop: 24 }}>
            Your money.
            <br />
            <span>In your words.</span>
          </h1>
          <p>
            Tell CashNarra what happened with your money. Review the records.
            See what the numbers mean.
          </p>
          <div className={s.actions}>
            <Button primary onClick={demo} disabled={busy}>
              Explore with sample data <ArrowRight size={18} />
            </Button>
            <Link className={s.button} href="/auth">
              Start my records
            </Link>
          </div>
          <p className={s.error} role="alert">
            {error}
          </p>
          <small>
            Demo uses fictional Ama Works data. No real AI calls or money
            movement.
          </small>
        </div>
        <div>
          <div className={s.speech}>
            “I sold 900 cash, paid for delivery, and Abena paid part of her
            balance.”
          </div>
          <div className={s.landingProof}>
            <span className={s.eyebrow}>
              <img src="/brand/cashnarra-symbol.svg" alt="" />
              Your story, organised.
            </span>
            {[
              ["Cash sales", "900.00"],
              ["Delivery", "80.00"],
              ["Abena’s old balance payment", "200.00"],
            ].map(([name, value]) => (
              <div key={name} className={s.settingsRow}>
                <span>{name}</span>
                <Amount value={value} />
              </div>
            ))}
            <p style={{ marginTop: 20, marginBottom: 0 }}>
              <Check size={16} /> You review before anything is saved.
            </p>
          </div>
        </div>
      </section>
      <hr />
      <section className={s.formGrid}>
        <div>
          <h2>Serious money. Light interaction.</h2>
          <p>
            Manual Cash, Bank and MoMo records. Clear debt balances. Corrections
            with a history you can follow.
          </p>
        </div>
        <div>
          <h2>See what it could take.</h2>
          <p>
            Choose a goal, note how much you have set aside for it, and try
            different monthly amounts. Your money stays where it is.
          </p>
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
