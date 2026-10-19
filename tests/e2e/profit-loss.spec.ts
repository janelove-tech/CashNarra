import { expect, test } from "@playwright/test";

test("a business story can review profit without treating stock or cash movement as profit", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page
    .getByRole("button", { name: "Money Stories", exact: true })
    .filter({ visible: true })
    .click();
  await page.getByRole("button", { name: "Review profit or loss" }).click();
  const dialog = page.getByRole("dialog", { name: "Profit or loss" });
  await dialog.getByRole("button", { name: "Work this out" }).click();
  await expect(dialog.getByRole("heading", { name: "Profit cannot be worked out yet." })).toBeVisible();
  await expect(dialog.getByText(/GH₵2,400\.00/)).toBeVisible();
  await expect(dialog.getByText(/GH₵700\.00/)).toBeVisible();
  await expect(dialog.getByText("Profit or loss before income tax")).toHaveCount(0);
  await dialog
    .getByLabel("Cost of the goods sold", { exact: true })
    .selectOption("amount");
  await dialog.getByLabel("Cost of the goods sold · GHS").fill("400.00");
  await dialog.getByLabel("Equipment cost used up", { exact: true }).selectOption("none");
  await dialog
    .getByLabel("Other costs missing from the records", { exact: true })
    .selectOption("none");
  await dialog
    .getByRole("checkbox", {
      name: "Sales and other income for these dates are complete, including unpaid sales.",
    })
    .check();
  await dialog
    .getByRole("checkbox", {
      name: "Recorded expenses and unpaid bills for these dates are complete.",
    })
    .check();
  await dialog
    .getByLabel("Where did the extra figures come from?")
    .fill("Counted the goods sold from the shelf list.");
  await dialog.getByRole("button", { name: "Work this out" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Profit or loss before income tax" }),
  ).toBeVisible();
  await expect(dialog.getByText("GH₵1,920.00")).toBeVisible();
});
