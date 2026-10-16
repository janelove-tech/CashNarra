import { it, expect, vi } from "vitest";
import { fixture } from "../src/domain/fixture";
import { validateWorkspace } from "../src/domain/ledger";
import { downloadReport } from "../src/lib/exports";

it("rejects reused allocation identifiers and zero-value contributions", () => {
  const w = fixture();
  w.goals[0].allocations.push({ ...w.goals[0].allocations[0] });
  expect(() => validateWorkspace(w)).toThrow("unique");
  w.goals[0].allocations.pop();
  w.goals[0].allocations.push({
    id: "zero",
    date: "2026-10-13",
    amount: "0.00",
  });
  expect(() => validateWorkspace(w)).toThrow("non-zero");
});
it.each([
  new Response("Unavailable", { status: 503 }),
  new Response("<html>offline</html>"),
])(
  "keeps PDF failure recoverable if its font is missing or substituted",
  async (response) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    try {
      await expect(
        downloadReport(fixture(), "2026-10-13", "2026-10-13", "pdf"),
      ).rejects.toThrow(/font/);
    } finally {
      vi.unstubAllGlobals();
    }
  },
);
