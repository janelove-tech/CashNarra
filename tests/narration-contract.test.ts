import { it, expect } from "vitest";
import { fixture, fixtureEvents } from "../src/domain/fixture";
import {
  assignProposalIds,
  validateExtraction,
  type Extraction,
} from "../src/server/ai";
it("assigns application IDs while preserving question linkage and authorised references", () => {
  const event = fixtureEvents()[0];
  const input: Extraction = {
    events: [event],
    questions: [{ recordId: event.id, field: "party", question: "Who?" }],
    explanation: "",
  };
  const out = assignProposalIds(input);
  expect(out.events[0].id).not.toBe(input.events[0].id);
  expect(out.questions[0].recordId).toBe(out.events[0].id);
  expect(out.events[0].accountId).toBe(input.events[0].accountId);
});
it("asks every missing consequential field and distinguishes uncertainty from validation", () => {
  const input: Extraction = {
    events: [
      {
        ...fixtureEvents()[0],
        kind: "transfer",
        amount: "",
        accountId: null,
        toAccountId: null,
      },
    ],
    questions: [],
    explanation: "",
  };
  const out = validateExtraction(input, fixture());
  expect(out.questions.map((q) => q.field)).toEqual(
    expect.arrayContaining(["accountId", "toAccountId", "amount"]),
  );
  expect(
    out.clarificationSources?.every((q) => q.source === "validation"),
  ).toBe(true);
  expect(input.questions).toEqual([]);
  const debt = {
    ...fixtureEvents()[0],
    kind: "credit_expense" as const,
    accountId: null,
    party: null,
  };
  expect(
    validateExtraction({ ...input, events: [debt] }, fixture()).questions.some(
      (q) => q.field === "party",
    ),
  ).toBe(true);
});
