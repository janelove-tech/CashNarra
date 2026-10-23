import { expect, test } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";

test("records, accounts and money stories keep the same figures in a clearer hierarchy", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await openSampleWorkspace(page);
  const storyBox = await page.locator("#today-story").boundingBox();
  const balanceBox = await page
    .getByRole("button", { name: /Recorded account balances/ })
    .boundingBox();
  expect(storyBox && balanceBox && storyBox.y < balanceBox.y).toBe(true);
  const dateBox = await page.getByLabel("Date of activity").boundingBox();
  expect(dateBox && storyBox && dateBox.y < storyBox.y + storyBox.height).toBe(
    true,
  );
  await expect(
    page.getByRole("button", { name: "Understand my story" }),
  ).toBeDisabled();
  await page.locator("#today-story").fill("A sale of 20 cash.");
  await expect(
    page.getByRole("button", { name: "Understand my story" }),
  ).toBeEnabled();
  await page.locator("#today-story").fill("");
  await page
    .getByRole("button", { name: "Stories", exact: true })
    .filter({ visible: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Here’s what moved this period." }),
  ).toBeVisible();
  const cover = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Here’s what moved this period." }),
  });
  await expect(cover.getByText("Money in", { exact: true })).toBeVisible();
  await expect(cover.getByText("Money out", { exact: true })).toBeVisible();
  await expect(cover.getByText("Net movement", { exact: true })).toBeVisible();
  await expect(cover.getByText("It is not profit.")).toBeVisible();
  await expect(cover.locator("[data-metric=received]")).toContainText("GH₵");
  await expect(cover.locator("[data-metric=paid]")).toContainText("GH₵");
  await expect(cover.locator("[data-metric=net]")).toContainText("GH₵");
  const colors = await cover.evaluate((node) => {
    const colorOf = (metric: string) => {
      const amount = node
        .querySelector(`[data-metric=${metric}]`)
        ?.querySelector("span:last-of-type");
      return amount ? getComputedStyle(amount).color : "";
    };
    return {
      received: colorOf("received"),
      paid: colorOf("paid"),
      net: colorOf("net"),
    };
  });
  expect(colors.received).toBe("rgb(186, 202, 251)");
  expect(colors.paid).toBe("rgb(241, 186, 148)");
  const sign = await cover.locator("[data-metric=net]").getAttribute("data-sign");
  expect(colors.net).toBe(
    sign === "out"
      ? colors.paid
      : sign === "in"
        ? colors.received
        : "rgb(255, 255, 255)",
  );
  await page
    .getByRole("button", { name: "Records", exact: true })
    .filter({ visible: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your records" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "People", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "People & balances" }),
  ).toBeVisible();
  await expect(page.getByText("People owe you", { exact: true })).toBeVisible();
  await expect(page.getByText("You owe", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Records", exact: true }).filter({ visible: true }).last().click();
  await page.getByLabel("Filter records").selectOption("credit_sale");
  await expect(page.getByText("No cash received").first()).toBeVisible();
  await page.setViewportSize({ width: 1100, height: 900 });
  await page
    .getByRole("button", { name: "Accounts", exact: true })
    .filter({ visible: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your recorded accounts" }),
  ).toBeVisible();
  await expect(page.getByText("Cash", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("MoMo", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Bank", { exact: true }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
