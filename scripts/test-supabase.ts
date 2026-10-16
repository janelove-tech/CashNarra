import { createClient } from "@supabase/supabase-js";
import { readFile, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { emptyWorkspace, fixture, fixtureEvents } from "../src/domain/fixture";
import { applyBatch, report } from "../src/domain/ledger";
import type { Workspace } from "../src/domain/types";
const config = JSON.parse(
  (await readFile(".local/supabase-status.json", "utf8")).replace(
    /^\uFEFF/,
    "",
  ),
);
if (config.API_URL !== "http://127.0.0.1:58321")
  throw new Error("Only the isolated CashNarra local Supabase is allowed.");
const client = () =>
  createClient(config.API_URL, config.ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
const email = `cashnarra-${crypto.randomUUID()}@example.test`,
  password = "Synthetic-local-test-only-2026!";
const one = client(),
  two = client(),
  anon = client();
const signed = await one.auth.signUp({ email, password });
assert.ifError(signed.error);
assert.ok(signed.data.user);
assert.ok(
  signed.data.session,
  "Local test config must disable email confirmation",
);
assert.ifError(
  (
    await two.auth.signUp({
      email: `other-${crypto.randomUUID()}@example.test`,
      password,
    })
  ).error,
);
async function save(w: Workspace, expected: number, key: string) {
  const result = await one.rpc("commit_workspace", {
    p_state: w,
    p_expected: expected,
    p_key: key,
    p_hash: createHash("sha256").update(JSON.stringify(w)).digest("hex"),
    p_record_ids: [],
  });
  assert.ifError(result.error);
  return result.data;
}
let w = emptyWorkspace(signed.data.user!.id);
await save(w, -1, "create");
const openings = fixture(w.ownerId, false);
w = { ...openings, id: w.id, version: 1 };
await save(w, 0, "openings");
w = applyBatch(w, {
  requestId: "batch",
  revision: 0,
  expectedVersion: 1,
  source: "Synthetic fixture through real Supabase Auth and Data API",
  events: fixtureEvents(),
  replaceIds: [],
  reason: "",
  allowDuplicates: true,
});
await save(w, 1, "batch");
const mine = await one.from("workspaces").select("state").eq("id", w.id);
assert.ifError(mine.error);
assert.equal(
  report(mine.data![0].state, "2026-10-13", "2026-10-13").total,
  "5970.00",
);
assert.deepEqual(
  (await two.from("workspaces").select("*").eq("id", w.id)).data,
  [],
);
assert.deepEqual(
  (await two.from("journal_lines").select("*").eq("workspace_id", w.id)).data,
  [],
);
assert.ok((await anon.from("workspaces").select("*")).error);
assert.ok(
  (
    await two.rpc("commit_workspace", {
      p_state: { ...w, ownerId: (await two.auth.getUser()).data.user!.id },
      p_expected: w.version,
      p_key: "foreign",
      p_hash: "a".repeat(64),
    })
  ).error,
);
assert.ifError((await one.rpc("minimize_my_sources")).error);
await one.auth.signOut();
assert.ifError((await one.auth.signInWithPassword({ email, password })).error);
assert.ifError(
  (
    await one.auth.resetPasswordForEmail(email, {
      redirectTo: "http://127.0.0.1:3100/auth/confirm?recovery=1",
    })
  ).error,
);
await writeFile(
  ".local/auth-test-user.json",
  JSON.stringify({ email, password, workspaceId: w.id }),
);
try {
  await access(".env.local");
} catch {
  await writeFile(
    ".env.local",
    `NEXT_PUBLIC_SUPABASE_URL=${config.API_URL}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${config.ANON_KEY}\nAI_ENABLED=false\nVOICE_ENABLED=false\nVOICE_QUALITY_APPROVED=false\nDEMO_ENABLED=true\nSITE_URL=http://127.0.0.1:3100\n`,
  );
}
console.log(
  "PASS: actual local Supabase signup/password signin, authenticated RPC and baseline, anonymous denial, cross-user read/write isolation, retention RPC, recovery email request. Synthetic login saved privately in .local/auth-test-user.json; no live provider credentials used.",
);
