import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fixture } from "@/domain/fixture";
import type { Receipt, Workspace } from "@/domain/types";
export type Context = {
  userId: string;
  demo: boolean;
  db: SupabaseClient | null;
};
type Store = {
  workspaces: Workspace[];
  receipts: Record<string, { hash: string; receipt: Receipt }>;
};
const globalStore = globalThis as typeof globalThis & {
  cashnarraQueue?: Promise<unknown>;
};
const root = path.join(process.cwd(), ".local", "demo");
function file(ctx: Context) {
  return path.join(
    root,
    createHash("sha256").update(ctx.userId).digest("hex") + ".json",
  );
}
async function read(ctx: Context): Promise<Store> {
  try {
    return JSON.parse(await readFile(file(ctx), "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    const initial: Store = { workspaces: [fixture(ctx.userId)], receipts: {} };
    await mkdir(root, { recursive: true });
    try {
      await writeFile(file(ctx), JSON.stringify(initial), {
        encoding: "utf8",
        flag: "wx",
      });
      return initial;
    } catch (writeError) {
      if ((writeError as NodeJS.ErrnoException).code === "EEXIST")
        return JSON.parse(await readFile(file(ctx), "utf8"));
      throw writeError;
    }
  }
}
async function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const result = (globalStore.cashnarraQueue ?? Promise.resolve()).then(fn, fn);
  globalStore.cashnarraQueue = result.catch(() => {});
  return result;
}
export async function list(ctx: Context): Promise<Workspace[]> {
  if (ctx.demo)
    return exclusive(async () => {
      const s = await read(ctx);
      let changed = false;
      for (const w of s.workspaces)
        for (const source of w.sources)
          if (source.text && source.expiresAt <= new Date().toISOString()) {
            source.text = null;
            changed = true;
          }
      if (changed) {
        const temp = file(ctx) + "." + randomUUID() + ".tmp";
        await writeFile(temp, JSON.stringify(s), "utf8");
        await rename(temp, file(ctx));
      }
      return s.workspaces;
    });
  const minimized = await ctx.db!.rpc("minimize_my_sources");
  if (minimized.error)
    throw new Error("Could not apply narration privacy settings.");
  const { data, error } = await ctx.db!.from("workspaces").select("state");
  if (error) throw new Error("Could not load your workspaces.");
  return (data ?? []).map((x) => x.state as Workspace);
}
export async function get(ctx: Context, id: string) {
  const w = (await list(ctx)).find(
    (w) => w.id === id && w.ownerId === ctx.userId,
  );
  if (!w) throw new Error("Workspace unavailable.");
  return w;
}
export async function receipt(
  ctx: Context,
  wid: string,
  key: string,
): Promise<Receipt | null> {
  await get(ctx, wid);
  if (ctx.demo)
    return (await read(ctx)).receipts[wid + ":" + key]?.receipt ?? null;
  const { data, error } = await ctx
    .db!.from("save_receipts")
    .select("receipt")
    .eq("workspace_id", wid)
    .eq("request_key", key)
    .maybeSingle();
  if (error) throw new Error("Save outcome is not confirmed. Keep this draft.");
  return data?.receipt ?? null;
}
export async function commit(
  ctx: Context,
  next: Workspace,
  expected: number,
  key: string,
  payload: unknown,
  recordIds: string[] = [],
): Promise<Receipt> {
  if (next.ownerId !== ctx.userId) throw new Error("Workspace unavailable.");
  const hash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
  if (!ctx.demo) {
    const { data, error } = await ctx.db!.rpc("commit_workspace", {
      p_state: next,
      p_expected: expected,
      p_key: key,
      p_hash: hash,
      p_record_ids: recordIds,
    });
    if (error) throw new Error(error.message);
    return data as Receipt;
  }
  return exclusive(async () => {
    const s = await read(ctx);
    const existing = s.receipts[next.id + ":" + key];
    if (existing) {
      if (existing.hash !== hash)
        throw new Error(
          "This request was already used with different contents.",
        );
      return existing.receipt;
    }
    const index = s.workspaces.findIndex((w) => w.id === next.id);
    if ((index < 0 ? -1 : s.workspaces[index].version) !== expected)
      throw new Error("These records changed. Refresh and review again.");
    if (index < 0) s.workspaces.push(next);
    else s.workspaces[index] = next;
    const r = {
      requestId: key,
      revision: next.version,
      version: next.version,
      recordIds,
      savedAt: new Date().toISOString(),
    };
    s.receipts[next.id + ":" + key] = { hash, receipt: r };
    await mkdir(root, { recursive: true });
    const temp = file(ctx) + "." + randomUUID() + ".tmp";
    await writeFile(temp, JSON.stringify(s), "utf8");
    await rename(temp, file(ctx));
    return r;
  });
}
export async function commitMove(
  ctx: Context,
  from: Workspace,
  to: Workspace,
  key: string,
  payload: unknown,
  recordId: string,
): Promise<Receipt> {
  if (from.ownerId !== ctx.userId || to.ownerId !== ctx.userId)
    throw new Error("Workspace unavailable.");
  const hash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
  if (!ctx.demo) {
    const { data, error } = await ctx.db!.rpc("move_workspace_record", {
      p_from: from,
      p_to: to,
      p_key: key,
      p_hash: hash,
      p_record_id: recordId,
    });
    if (error) throw new Error(error.message);
    return data as Receipt;
  }
  return exclusive(async () => {
    const s = await read(ctx);
    const prior = s.receipts[from.id + ":" + key];
    if (prior) {
      if (prior.hash !== hash)
        throw new Error(
          "This request was already used with different contents.",
        );
      return prior.receipt;
    }
    const a = s.workspaces.findIndex((w) => w.id === from.id),
      b = s.workspaces.findIndex((w) => w.id === to.id);
    if (
      a < 0 ||
      b < 0 ||
      s.workspaces[a].version !== from.version - 1 ||
      s.workspaces[b].version !== to.version - 1
    )
      throw new Error(
        "A workspace changed. Refresh and review the move again.",
      );
    s.workspaces[a] = from;
    s.workspaces[b] = to;
    const r = {
      requestId: key,
      revision: from.version,
      version: from.version,
      recordIds: [recordId],
      savedAt: new Date().toISOString(),
    };
    s.receipts[from.id + ":" + key] = { hash, receipt: r };
    await mkdir(root, { recursive: true });
    const temp = file(ctx) + "." + randomUUID() + ".tmp";
    await writeFile(temp, JSON.stringify(s), "utf8");
    await rename(temp, file(ctx));
    return r;
  });
}
