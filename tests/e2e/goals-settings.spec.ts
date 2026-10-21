import { expect, test } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";

test("a goal shows the marked amount and remaining without moving money", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await openSampleWorkspace(page);
  await page
    .getByRole("button", { name: "Plan", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page.getByRole("heading", { name: "Your goals" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "New equipment" })).toBeVisible();
  await expect(page.getByText("GH₵1,200.00").first()).toBeVisible();
  await expect(page.getByText("GH₵4,800.00").first()).toBeVisible();
  await expect(page.getByText("20.0%")).toBeVisible();
  await expect(
    page.getByText("This does not move or reserve money in your bank or MoMo."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try a monthly amount" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "your saved records stay as they are",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Workspace, accounts and settings" })
    .click();
  await page
    .getByRole("button", { name: "Settings and privacy", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Appearance" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recording and drafts" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your data" })).toBeVisible();
  await page.getByRole("button", { name: "Use shared-device mode" }).click();
  await expect(
    page.getByRole("dialog", { name: "Clear drafts on this device?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Stay" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
  ).toBe(true);
});
