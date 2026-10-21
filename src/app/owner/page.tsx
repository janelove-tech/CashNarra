import Link from "next/link";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { OwnerConsole } from "@/components/owner-console";
import s from "@/components/billing.module.css";
import { context } from "@/server/auth";
import { platformOwnerFromContext } from "@/server/platform-owner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Owner console — CashNarra",
};

export default async function OwnerPage() {
  let allowed = false;
  try {
    allowed = platformOwnerFromContext(await context());
  } catch {
    allowed = false;
  }
  if (!allowed)
    return (
      <main className={s.page}>
        <div className={s.frame}>
          <h1>This page is not available for this account.</h1>
          <p>Plan settings stay with the platform owner.</p>
          <Link className={s.back} href="/">
            Back to CashNarra
          </Link>
        </div>
      </main>
    );
  return (
    <OwnerConsole
      readiness={{
        groqKey: Boolean(process.env.GROQ_API_KEY),
        freePlanFile: existsSync(resolve(".local/evaluation/groq-plan.json")),
        voiceSwitch: process.env.VOICE_ENABLED === "true",
        storyPause: existsSync(
          resolve(".local/evaluation/provider-pause.json"),
        ),
      }}
    />
  );
}
