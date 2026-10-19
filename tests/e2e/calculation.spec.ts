import { test, expect } from "@playwright/test";
import { event, fixture } from "../../src/domain/fixture";
import { storyCalculation } from "../../src/domain/story-calculation";
test.use({ serviceWorkers: "block" });

test("shows included records and requires confirmation before accepting a percentage", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
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
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Synthetic percentage example");
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(
    page.getByRole("heading", { name: "Let’s check the amount" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Use this amount", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Save reviewed 1 records" }),
  ).toBeDisabled();
  await page.getByLabel("These are the dates and records I meant.").check();
  await page
    .getByRole("button", { name: "Use this amount", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Save reviewed 1 records" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: /Synthetic percentage payment/ }),
  ).toContainText("−GH₵480.00");
  await page.getByText("Read the original story", { exact: true }).click();
  await expect(page.getByRole("blockquote")).toContainText(
    "2400.00 × 20.00% = 480.00",
  );
});
