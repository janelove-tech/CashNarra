// One bounded local reader check. Does not save financial records.
import { realExtract } from "../src/server/ai";
import { emptyWorkspace } from "../src/domain/fixture";
import { EvaluationBudget } from "./lib/evaluation-budget";
import { readProviderPause } from "./lib/provider-pause";

process.loadEnvFile(".env.local");

async function main() {
  if (!process.argv.includes("--once"))
    throw new Error("Pass --once for the single authorised check.");
  if (!process.env.OPENAI_API_KEY)
    throw new Error("The story-reading key is missing.");
  const directory = ".local/evaluation";
  const pauseBefore = await readProviderPause(directory);
  const budget = await EvaluationBudget.acquire(directory);
  const before = await budget.state();
  const unsettled = [...before.calls.values()].filter(
    (call) => !call.settled,
  ).length;
  const raised = await budget.approveCeiling();
  await budget.close();
  console.log(
    JSON.stringify({
      pauseBefore,
      calls: before.calls.size,
      unsettled,
      committedMicros: before.committed,
      ceilingMicros: raised.ceiling,
    }),
  );
  const workspace = emptyWorkspace(
    "reader-recovery",
    "Recovery check",
    "Business",
  );
  workspace.id = "00000000-0000-4000-8000-000000000001";
  workspace.accounts = [
    {
      id: "cash",
      name: "Cash",
      type: "Cash",
      currency: "GHS",
      opening: "0.00",
      openingDate: "2026-10-21",
    },
  ];
  try {
    const result = await realExtract(
      "I received GH₵10 cash for a delivery today.",
      workspace,
      "2026-10-21",
      "extract",
      [],
      undefined,
      { permitPause: "billing_rejected" },
    );
    console.log(
      JSON.stringify({
        result: "usable",
        events: result.events.length,
        questions: result.questions.length,
        pauseAfter: await readProviderPause(directory),
      }),
    );
  } catch (error) {
    const failure = error as { message?: string; status?: number; code?: string };
    console.log(
      JSON.stringify({
        result: "failed",
        message: failure.message ?? "Unknown failure",
        status: failure.status ?? null,
        code: failure.code ?? null,
        pauseAfter: await readProviderPause(directory),
      }),
    );
    process.exitCode = 1;
  }
}

main().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
