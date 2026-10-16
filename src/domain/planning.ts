import { z } from "zod";
import type { Workspace } from "./types";
import { calendarDate } from "./dates";
import { money } from "./money";
import { obligations } from "./ledger";
const personKey = (name: string) =>
  name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
export const planningSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("contact_edit"),
    contactId: z.string(),
    name: z.string().trim().min(1).max(100),
    role: z.enum(["Customer", "Supplier", "Other"]),
  }),
  z.object({ action: z.literal("contact_remove"), contactId: z.string() }),
  z.object({
    action: z.literal("contact"),
    name: z.string().trim().min(1).max(100),
    role: z.enum(["Customer", "Supplier", "Other"]),
  }),
  z.object({
    action: z.literal("preferences"),
    showRhythm: z.boolean(),
    reminder: z.boolean(),
  }),
  z.object({
    action: z.literal("debt_date"),
    recordId: z.string(),
    date: z.string().nullable(),
  }),
  z.object({
    action: z.literal("goal_unreview"),
    goalId: z.string(),
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  }),
  z.object({
    action: z.literal("goal_edit"),
    goalId: z.string(),
    name: z.string().trim().min(1).max(100),
    target: z.string(),
  }),
  z.object({
    action: z.literal("checkin"),
    date: z.string(),
    kind: z.enum(["review", "rest", "no_activity"]),
  }),
]);
export function updatePlanning(
  w: Workspace,
  input: unknown,
  now = new Date().toISOString(),
) {
  const parsed = planningSchema.safeParse(input);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    const messages: Record<string, string> = {
      name: "Enter a name between 1 and 100 characters.",
      role: "Choose customer, supplier or other.",
      month: "Choose a valid month to check again.",
      date: "Choose a valid date, or clear the payment date.",
      target: "Enter the goal target as an amount.",
    };
    throw new Error(
      messages[String(field)] ??
        "Check the details and try again. Nothing has been saved.",
    );
  }
  const b = parsed.data;
  if (b.action === "contact_remove") {
    if (!w.contacts?.some((c) => c.id === b.contactId))
      throw new Error("That saved person is no longer in this list.");
    w.contacts = w.contacts.filter((c) => c.id !== b.contactId);
  } else if (b.action === "contact_edit") {
    const contact = w.contacts?.find((c) => c.id === b.contactId);
    if (!contact)
      throw new Error("That saved person is no longer in this list.");
    if (
      w.contacts?.some(
        (c) => c.id !== b.contactId && personKey(c.name) === personKey(b.name),
      )
    )
      throw new Error("That person is already in your list.");
    Object.assign(contact, { name: b.name, role: b.role });
  } else if (b.action === "contact") {
    w.contacts ??= [];
    if (w.contacts.some((c) => personKey(c.name) === personKey(b.name)))
      throw new Error("That person is already in your list.");
    w.contacts.push({ id: crypto.randomUUID(), name: b.name, role: b.role });
  } else if (b.action === "preferences")
    w.preferences = { showRhythm: b.showRhythm, reminder: b.reminder };
  else if (b.action === "debt_date") {
    const record = w.records.find((r) => r.id === b.recordId && !r.removed);
    if (
      !record ||
      ![
        "credit_sale",
        "credit_purchase",
        "opening_receivable",
        "opening_payable",
        "opening_loan",
        "loan_received",
      ].includes(record.kind)
    )
      throw new Error("Choose an existing unpaid balance.");
    if (b.date !== null && (!calendarDate(b.date) || b.date < record.date))
      throw new Error(
        "Choose a due date on or after the original balance date.",
      );
    if (
      b.date !== null &&
      !obligations(w).some((o) => o.id === b.recordId && o.remaining !== "0.00")
    )
      throw new Error(
        "This balance is fully paid. It does not need a payment date.",
      );
    if (debtDate(w, b.recordId) === b.date) return;
    (w.debtDates ??= []).push({ recordId: b.recordId, date: b.date, at: now });
  } else if (b.action === "goal_unreview") {
    const g = w.goals.find((g) => g.id === b.goalId);
    if (!g) throw new Error("Goal unavailable.");
    if (!g.reviewedMonths.includes(b.month))
      throw new Error("That month is already waiting to be checked.");
    g.reviewedMonths = g.reviewedMonths.filter((month) => month !== b.month);
  } else if (b.action === "goal_edit") {
    const g = w.goals.find((g) => g.id === b.goalId);
    if (!g) throw new Error("Goal unavailable.");
    const before = { name: g.name, target: g.target },
      after = { name: b.name, target: money(b.target, true) };
    if (before.name === after.name && before.target === after.target) return;
    (w.goalChanges ??= []).push({ goalId: g.id, at: now, before, after });
    Object.assign(g, after);
  } else {
    if (!calendarDate(b.date) || b.date > now.slice(0, 10))
      throw new Error("Choose today or an earlier day.");
    if (
      b.kind === "no_activity" &&
      w.records.some(
        (r) =>
          !r.removed && r.date === b.date && !r.kind.startsWith("opening_"),
      )
    )
      throw new Error(
        "There are saved records for this day. Choose reviewed activity, or correct those records first.",
      );
    w.checkinHistory ??= structuredClone(w.checkins);
    const entry = { date: b.date, kind: b.kind, at: now };
    w.checkinHistory.push(entry);
    w.checkins = w.checkins.filter((c) => c.date !== b.date);
    w.checkins.push(entry);
  }
}
export function debtDate(w: Workspace, id: string) {
  return w.debtDates?.filter((d) => d.recordId === id).at(-1)?.date ?? null;
}
