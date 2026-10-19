import { test, expect, type Page } from "@playwright/test";
import { storyWindow } from "../../src/domain/periods";

async function demo(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await expect(
    page.getByRole("heading", { name: "Let’s make sense of your money." }),
  ).toBeVisible();
}
function visible(page: Page, name: string) {
  return page.getByRole("button", { name, exact: true }).filter({ visible: true });
}

test("Today keeps its day when Money Stories changes period and date", async ({
  page,
}) => {
  await demo(page);
  await expect(
    page.getByRole("button", { name: /Money in · 13 Oct 2026/ }),
  ).toContainText("2,300.00");
  await visible(page, "Money Stories").click();
  await page.getByLabel("Story date").fill("2026-09-15");
  await page.getByLabel("Story period").selectOption("month");
  await expect(page.getByText("You owe on 30 Sep 2026")).toBeVisible();
  await visible(page, "Today").click();
  const day = page.getByRole("button", { name: /Money in · 13 Oct 2026/ });
  await expect(day).toContainText("2,300.00");
  await day.click();
  await expect(page.getByText("Showing 13 Oct 2026.")).toBeVisible();
  await expect(page.getByText("Cash sales")).toBeVisible();
  await expect(page.getByText("Abena opening balance")).toHaveCount(0);
});

test("an open month says so far and separates later dates", async ({ page }) => {
  await demo(page);
  await visible(page, "Money Stories").click();
  await page.getByLabel("Story date").fill("2026-10-19");
  await page.getByLabel("Story period").selectOption("month");
  const today = new Date().toISOString().slice(0, 10);
  const view = storyWindow("2026-10-19", "month", today);
  await expect(page.getByText(view.heading)).toBeVisible();
  if (view.status === "so-far") {
    await expect(page.getByText("You owe on 31 Oct 2026")).toHaveCount(0);
    await expect(page.getByText(view.oweLabel!)).toBeVisible();
    await expect(
      page.getByText(`No saved records are dated after ${view.heading.split("through ")[1]}`),
    ).toBeVisible();
  } else {
    await expect(page.getByText(view.oweLabel!)).toBeVisible();
  }
  await visible(page, "Today").click();
  await expect(
    page.getByRole("button", { name: /Money in · 13 Oct 2026/ }),
  ).toContainText("2,300.00");
});

test("a saved story does not stay saved on a new empty story", async ({
  page,
}) => {
  await demo(page);
  await page.getByRole("button", { name: "Tell your story", exact: true }).click();
  await page.getByRole("button", { name: "Add a manual record" }).click();
  await page.getByLabel("Description", { exact: true }).fill("Synthetic trust receipt");
  await page.getByLabel("Amount · GHS", { exact: true }).fill("3.00");
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  await visible(page, "Today").click();
  await page.getByRole("button", { name: "Tell your story", exact: true }).click();
  await expect(page.getByLabel("Your money story", { exact: true })).toHaveValue("");
  await expect(page.getByRole("status").filter({ hasText: "Saved" })).toHaveCount(0);
});
