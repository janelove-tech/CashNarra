import { it, expect } from "vitest";
import { boundedJson } from "../src/server/request";
import { fixture } from "../src/domain/fixture";
import { report } from "../src/domain/ledger";
it("counts actual UTF-8 bytes before parsing JSON", async () => {
  const req = new Request("http://localhost", {
    method: "POST",
    body: JSON.stringify({ text: "₵".repeat(20) }),
  });
  await expect(boundedJson(req, 40)).rejects.toThrow("too large");
});
it.each(["null", "[]", "false", "broken"])(
  "rejects non-object request %s",
  async (body) => {
    await expect(
      boundedJson(new Request("http://localhost", { method: "POST", body })),
    ).rejects.toThrow("valid request");
  },
);
it("accepts a bounded object and refuses invalid report periods", async () => {
  expect(
    await boundedJson(
      new Request("http://localhost", {
        method: "POST",
        body: '{"value":"0.10"}',
      }),
    ),
  ).toEqual({ value: "0.10" });
  expect(() => report(fixture(), "2026-02-30", "2026-03-01")).toThrow("period");
  expect(() => report(fixture(), "2026-10-14", "2026-10-13")).toThrow("period");
});
