import { expect, test } from "@playwright/test";

test("recorded costs are enough when the user says nothing else is missing", async ({
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
  await expect(dialog.getByText(/GH₵2,400\.00/)).toBeVisible();
  await expect(dialog.getByText(/GH₵80\.00/)).toBeVisible();
  await expect(dialog.getByText(/GH₵700\.00/)).toBeVisible();
  await expect(dialog.getByLabel("Cost of the goods sold")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Yes, work out the profit" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Profit or loss before income tax" }),
  ).toBeVisible();
  await expect(dialog.getByText("GH₵2,320.00")).toBeVisible();
  await dialog.getByRole("button", { name: "No, something is missing" }).click();
  await dialog
    .getByLabel("Cost of the goods sold", { exact: true })
    .selectOption("amount");
  await dialog.getByLabel("Cost of the goods sold · GHS").fill("400.00");
  await dialog
    .getByLabel("Equipment cost used up", { exact: true })
    .selectOption("none");
  await dialog.getByLabel("Any other missing cost", { exact: true }).selectOption("none");
  await dialog
    .getByLabel("Where did the extra figures come from?")
    .fill("Counted the goods sold from the shelf list.");
  await dialog.getByRole("button", { name: "Work this out" }).click();
  await expect(dialog.getByText("GH₵1,920.00")).toBeVisible();
});
