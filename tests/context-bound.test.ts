import { expect, it } from "vitest";
import { emptyWorkspace } from "../src/domain/fixture";
import { extractionRequest } from "../src/server/ai";

it("keeps a named account inside the bounded narration context", () => {
  const w = emptyWorkspace("owner");
  w.accounts = Array.from({ length: 51 }, (_, index) => ({
    id: `account-${index}`,
    name: `Account ${index}`,
    type: "Cash" as const,
    currency: "GHS" as const,
    opening: "0.00",
    openingDate: "2026-10-01",
  }));
  const input = JSON.parse(
    extractionRequest(
      "I paid fuel from Account 50",
      w,
      "2026-10-19",
    ).input,
  );
  expect(input.accounts.map((account: { name: string }) => account.name)).toContain(
    "Account 50",
  );
  expect(input.accounts).toHaveLength(50);
  expect(input.accountsOmitted).toBe(true);
});
