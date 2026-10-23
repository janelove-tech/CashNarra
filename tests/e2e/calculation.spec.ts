import { test, expect } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";
import { event, fixture } from "../../src/domain/fixture";
import { storyCalculation } from "../../src/domain/story-calculation";
test.use({ serviceWorkers: "block" });

test("shows included records and requires confirmation before accepting a percentage", async ({
  page,
}) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  const response = await page.request.get("/api/workspaces");
  const data = await response.json();
  const w = data.workspaces?.[0] ?? data[0] ?? fixture();
  const proposed = event("expense", "", "Synthetic percentage payment", "cash");
  const calculation = storyCalculation(w, {
    recordId: proposed.id,
    percent: "20",
    from: "2026-10-13",
    to: "2026-10-13",
    basis: "revenue",
  });
  await page.route("**/api/understand", (route) =>
    route.fulfill({
      json: {
        events: [proposed],
        questions: [
          {
            recordId: proposed.id,
            field: "amount",
            question: "Confirm the amount",
          },
        ],
        calculations: [calculation],
        explanation: "Synthetic test response",
      },
    }),
  );
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Synthetic percentage example");
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(
    page.getByRole("heading", { name: "Check this amount." }),
  ).toBeVisible();
  await expect(page.getByText("GH₵480.00").first()).toBeVisible();
  await expect(page.getByText(/other income/i).first()).toBeVisible();
  await expect(page.getByText(/older balances/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save this record" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Use GH₵480.00", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Save this record" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: /Synthetic percentage payment/ }),
  ).toContainText("−GH₵480.00");
  // The original words stay open on the review screen.
  await expect(page.getByText("From your story", { exact: true })).toBeVisible();
  await expect(page.getByRole("blockquote")).toContainText(
    "2400.00 × 20.00% = 480.00",
  );
});
