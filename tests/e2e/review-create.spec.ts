import { test, expect } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";
import { event } from "../../src/domain/fixture";

test.use({ serviceWorkers: "block" });

test("review offers to create a missing account and balance", async ({ page }) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  const packaging = event("expense", "85.00", "Packaging", null, {
    date: "2026-10-06",
  });
  const payment = event("receivable_payment", "400.00", "Mabel payment", "cash", {
    date: "2026-10-16",
  });
  await page.route("**/api/understand", (route) =>
    route.fulfill({
      json: {
        events: [packaging, payment],
        questions: [
          {
            recordId: packaging.id,
            field: "accountId",
            question: "Which account paid for packaging?",
            suggestion: "Shop cash",
          },
          {
            recordId: payment.id,
            field: "obligationId",
            question: "Which balance did Mabel pay?",
            suggestion: "Mabel",
          },
        ],
        calculations: [],
        explanation: "Synthetic test response",
      },
    }),
  );
  await page.getByRole("button", { name: "Tell your story", exact: true }).click();
  await page.getByLabel("Your money story", { exact: true }).fill("Packaging and Mabel");
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(page.getByRole("heading", { name: "One thing to fill in." })).toBeVisible();
  await expect(
    page.getByText("Shop cash is not in this workspace. Create it and use it for this record?"),
  ).toBeVisible();
  await expect(page.getByText("There is no saved balance for Mabel.")).toBeVisible();

  const balance = page.locator("form").filter({ hasText: "There is no saved balance for Mabel." });
  await balance.getByLabel("Amount owed before this payment · GHS").fill("600.00");
  await balance.getByLabel("Balance date").fill("2026-10-03");
  await balance.getByRole("button", { name: "Create balance and use it" }).click();
  await expect(page.getByRole("button", { name: /Opening balance owed by Mabel/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Payment from Mabel/ })).toBeVisible();

  const account = page.locator("form").filter({ hasText: "Shop cash is not in this workspace" });
  await account.getByRole("button", { name: "Create account and use it" }).click();
  await expect(page.getByRole("button", { name: /Packaging/ })).toContainText("Shop cash");
  await expect(page.getByRole("button", { name: "Save 3 records" })).toBeEnabled();
});
