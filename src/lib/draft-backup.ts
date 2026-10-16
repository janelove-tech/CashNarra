import { z } from "zod";
import { eventSchema } from "@/domain/types";
import { calendarDate } from "@/domain/dates";
import type { Draft } from "./drafts";
const schema = z.object({
  format: z.literal("cashnarra-draft-1"),
  draft: z.object({
    ownerId: z.string(),
    workspaceId: z.string(),
    text: z.string().max(12000),
    date: z.string().refine(calendarDate),
    revision: z.number().int().nonnegative(),
    events: z.array(eventSchema).max(100),
    replaceIds: z.array(z.string()).max(100),
    reason: z.string().max(1000),
    pendingRequest: z.unknown().optional(),
  }),
});
export function draftBackup(draft: Draft) {
  return JSON.stringify({ format: "cashnarra-draft-1", draft }, null, 2);
}
export function restoreBackup(
  text: string,
  owner: string,
  workspace: string,
): Draft {
  if (new TextEncoder().encode(text).length > 256000)
    throw new Error("That backup is too large.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      "This file could not be read. Choose a CashNarra draft backup.",
    );
  }
  const result = schema.safeParse(parsed);
  if (!result.success)
    throw new Error(
      "This is not a complete CashNarra draft backup. Your current draft has not changed.",
    );
  const { draft } = result.data;
  if (draft.ownerId !== owner || draft.workspaceId !== workspace)
    throw new Error(
      "Open the same account and workspace that made this backup.",
    );
  if (draft.pendingRequest) {
    const op = z
      .object({
        action: z.string(),
        workspaceId: z.string(),
        key: z.string().min(1).max(150),
        expectedVersion: z.number().int(),
      })
      .passthrough()
      .safeParse(draft.pendingRequest);
    if (!op.success)
      throw new Error(
        "The saved action in this backup is incomplete. Your current draft has not changed.",
      );
    if (
      op.data.workspaceId !== workspace ||
      ![
        "batch",
        "account",
        "opening",
        "goal",
        "allocation",
        "goal_review",
        "checkin",
        "retention",
        "request",
        "move",
        "contact",
        "contact_edit",
        "contact_remove",
        "preferences",
        "debt_date",
        "goal_edit",
        "goal_unreview",
      ].includes(op.data.action)
    )
      throw new Error("This saved action does not belong to this workspace.");
    if (op.data.action === "batch") {
      const batch = z
        .object({
          requestId: z.string().min(1),
          revision: z.number().int().nonnegative(),
          expectedVersion: z.number().int().nonnegative(),
          source: z.string().max(12000),
          events: z.array(eventSchema).max(100),
          replaceIds: z.array(z.string()).max(100),
          reason: z.string().max(1000),
          allowDuplicates: z.boolean(),
        })
        .safeParse(op.data.batch);
      if (!batch.success)
        throw new Error(
          "This backup is missing part of its unconfirmed save. Your current draft has not changed.",
        );
      if (
        JSON.stringify(batch.data.events) !== JSON.stringify(draft.events) ||
        JSON.stringify(batch.data.replaceIds) !==
          JSON.stringify(draft.replaceIds) ||
        batch.data.reason !== draft.reason ||
        batch.data.source !== (draft.text || "Manually reviewed record") ||
        batch.data.expectedVersion !== op.data.expectedVersion
      )
        throw new Error(
          "The records in this backup do not match its unconfirmed save. Restore an unchanged backup instead.",
        );
    }
  }
  return draft;
}
