import { context, sameOrigin } from "@/server/auth";
import {
  commit,
  commitMove,
  get,
  list,
  receipt,
  summaries,
} from "@/server/store";
import { prepareMove } from "@/domain/move";
import { applyBatch, validateWorkspace } from "@/domain/ledger";
import { emptyWorkspace } from "@/domain/fixture";
import { money } from "@/domain/money";
import type { Batch, Goal } from "@/domain/types";
import { boundedJson } from "@/server/request";
import { updatePlanning } from "@/domain/planning";
export async function GET(req: Request) {
  try {
    const ctx = await context();
    const u = new URL(req.url);
    if (u.searchParams.has("request"))
      return Response.json({
        receipt: await receipt(
          ctx,
          u.searchParams.get("workspace")!,
          u.searchParams.get("request")!,
        ),
      });
    if (u.searchParams.has("workspace"))
      return Response.json({
        workspace: await get(ctx, u.searchParams.get("workspace")!),
      });
    return Response.json({
      workspaces:
        u.searchParams.get("view") === "summaries"
          ? await summaries(ctx)
          : await list(ctx),
      userId: ctx.userId,
      demo: ctx.demo,
      aiEnabled: !ctx.demo && process.env.AI_ENABLED === "true",
      voiceEnabled:
        !ctx.demo &&
        process.env.VOICE_ENABLED === "true" &&
        process.env.VOICE_QUALITY_APPROVED === "true" &&
        !!process.env.OPENAI_API_KEY,
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 401 });
  }
}
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const ctx = await context();
    const b = await boundedJson(req);
    if (typeof b.key !== "string" || !b.key.trim() || b.key.length > 150)
      throw new Error("Missing request identifier.");
    if (b.action === "create") {
      const w = emptyWorkspace(
        ctx.userId,
        String(b.name).trim().slice(0, 100),
        b.type === "Personal" ? "Personal" : "Business",
      );
      w.id = b.workspaceId;
      if (!/^[a-f0-9-]{36}$/.test(w.id) || !w.name)
        throw new Error("Add a workspace name.");
      const r = await commit(ctx, w, -1, b.key, b);
      return Response.json({ receipt: r });
    }
    const w = await get(ctx, b.workspaceId);
    // A retry must be looked up before applying a stale revision. The repository compares payload hashes.
    const prior = await receipt(ctx, w.id, b.key);
    if (prior) {
      const r = await commit(ctx, w, w.version, b.key, b);
      return Response.json({ receipt: r });
    }
    if (w.version !== b.expectedVersion)
      throw new Error("These records changed. Refresh and review again.");
    if (b.action === "move") {
      const destination = await get(ctx, b.destinationId);
      if (destination.version !== b.destinationVersion)
        throw new Error("The destination changed. Refresh and review again.");
      const m = prepareMove(
        w,
        destination,
        b.recordId,
        b.accountId,
        b.reason,
        b.key,
      );
      return Response.json({
        receipt: await commitMove(ctx, m.from, m.to, b.key, b, m.recordId),
      });
    }
    let next = structuredClone(w);
    let ids: string[] = [];
    if (b.action === "batch") {
      next = applyBatch(w, { ...b.batch, expectedVersion: w.version } as Batch);
      ids = b.batch.events.map((e: { id: string }) => e.id);
    } else {
      if (
        [
          "contact",
          "contact_edit",
          "contact_remove",
          "preferences",
          "debt_date",
          "goal_edit",
          "goal_unreview",
          "checkin",
        ].includes(b.action)
      ) {
        updatePlanning(next, b);
      } else if (b.action === "account") {
        const a = b.account;
        if (
          !["Cash", "Bank", "MoMo"].includes(a.type) ||
          !a.name?.trim() ||
          !/^\d{4}-\d{2}-\d{2}$/.test(a.openingDate) ||
          next.accounts.some((x) => x.id === a.id)
        )
          throw new Error("Check the account details.");
        next.accounts.push({
          id: a.id,
          name: a.name.slice(0, 80),
          type: a.type,
          currency: "GHS",
          opening: a.opening === null ? null : money(a.opening),
          openingDate: a.openingDate,
        });
      } else if (b.action === "opening") {
        const a = next.accounts.find((a) => a.id === b.accountId);
        if (!a || typeof b.reason !== "string" || !b.reason.trim())
          throw new Error(
            "Choose the account and explain the corrected opening.",
          );
        const before = { ...a };
        a.opening = b.amount === null ? null : money(b.amount);
        next.openingHistory ??= [];
        next.openingHistory.push({
          at: new Date().toISOString(),
          reason: b.reason.slice(0, 300),
          before,
          after: { ...a },
        });
      } else if (b.action === "goal") {
        const g = b.goal;
        if (!g.name?.trim() || !next.accounts.some((a) => a.id === g.accountId))
          throw new Error("Choose a name and account.");
        next.goals.push({
          id: crypto.randomUUID(),
          name: g.name.slice(0, 100),
          target: money(g.target, true),
          accountId: g.accountId,
          allocations: [],
          reviewedMonths: [],
          commitmentsKnown: false,
        });
      } else if (b.action === "allocation") {
        const g = next.goals.find((g) => g.id === b.goalId);
        if (!g) throw new Error("Goal unavailable.");
        const amount = money(b.amount);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date))
          throw new Error("Choose a date.");
        if (b.date > new Date().toISOString().slice(0, 10))
          throw new Error("Future contributions belong in a scenario.");
        g.allocations.push({ id: crypto.randomUUID(), date: b.date, amount });
      } else if (b.action === "goal_review") {
        const g: Goal | undefined = next.goals.find((g) => g.id === b.goalId);
        if (!g || !/^\d{4}-\d{2}$/.test(b.month))
          throw new Error("Choose a goal and month.");
        if (b.month >= new Date().toISOString().slice(0, 7))
          throw new Error("Review a completed month.");
        if (!g.reviewedMonths.includes(b.month)) g.reviewedMonths.push(b.month);
        g.commitmentsKnown = b.commitmentsKnown === true;
      } else if (b.action === "retention") {
        if (![0, 7, 30].includes(b.days))
          throw new Error("Choose a supported retention period.");
        next.retentionDays = b.days;
        next.sources = next.sources.map((s) => ({
          ...s,
          expiresAt: new Date(
            new Date(s.createdAt).getTime() + b.days * 86400000,
          ).toISOString(),
          text: b.days === 0 ? null : s.text,
        }));
      } else if (b.action === "request") {
        if (!["access", "deletion"].includes(b.kind))
          throw new Error("Unknown request.");
        if (
          next.requests.some(
            (r) => r.kind === b.kind && r.status === "pending review",
          )
        )
          throw new Error(
            "This request is already awaiting review. Its status is shown in Privacy and your data.",
          );
        next.requests.push({
          id: crypto.randomUUID(),
          kind: b.kind,
          at: new Date().toISOString(),
          status: "pending review",
        });
      } else throw new Error("Unknown operation.");
      next.version++;
      validateWorkspace(next);
    }
    const r = await commit(ctx, next, w.version, b.key, b, ids);
    return Response.json({ receipt: r });
  } catch (e) {
    return Response.json(
      { error: (e as Error).message, outcome: "rejected" },
      { status: 409 },
    );
  }
}
