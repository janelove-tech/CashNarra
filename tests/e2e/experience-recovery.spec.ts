import { test, expect, type Page } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";

// Service workers can bypass route mocks and invalidate lost-response checks.
test.use({ serviceWorkers: "block" });

async function demo(page: Page) {
  await openSampleWorkspace(page);
  await expect(page.getByRole("heading", { name: "What happened with your money?" })).toBeVisible();
}
const visibleButton = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).filter({ visible: true });

test("a failed opening is retriable and does not claim an empty workspace", async ({ page }) => {
  await demo(page);
  await page.route("**/api/workspaces?view=summaries", route => route.abort("failed"), { times: 1 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your records couldn’t load." })).toBeVisible();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("does not mean your records are empty");
  await expect(page.getByRole("heading", { name: "No saved records yet" })).toHaveCount(0);
  await page.getByRole("button", { name: "Try loading records again" }).click();
  await expect(page.getByRole("heading", { name: "What happened with your money?" })).toBeVisible();
});

test("a committed save with a lost response checks its receipt and adds the record once", async ({ page }) => {
  await demo(page);
  let batchPosts = 0;
  await page.route("**/api/workspaces", async route => {
    const request = route.request();
    if (request.method() !== "POST" || request.postDataJSON()?.action !== "batch") return route.continue();
    batchPosts++;
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    if (batchPosts === 1) await route.abort("failed");
    else await route.fulfill({ response });
  });
  await page.getByRole("button", { name: "Add a manual record" }).click();
  await page.getByLabel("Description", { exact: true }).fill("Synthetic recovery check");
  await page.getByLabel("Amount · GHS", { exact: true }).fill("3.00");
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("couldn’t confirm the save");
  await expect(page.getByRole("button", { name: "Check save result", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Check save result", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  expect(batchPosts).toBe(1);
  await visibleButton(page, "Records").click();
  await expect(page.getByRole("heading", { name: "Your records" })).toBeVisible();
  await page.getByLabel("Search records", { exact: true }).fill("Synthetic recovery check");
  await expect(page.getByRole("button", { name: /Synthetic recovery check/ })).toHaveCount(1);
});

test("correction returns to the same search and account filter without discarding its draft", async ({ page }) => {
  await demo(page);
  await visibleButton(page, "Records").click();
  await expect(page.getByRole("heading", { name: "Your records" })).toBeVisible();
  await page.getByLabel("Search records", { exact: true }).fill("Cash sales");
  await page.getByLabel("Filter by account", { exact: true }).selectOption({ label: "Cash" });
  await page.getByRole("button", { name: /^Cash sales/ }).click();
  await page.getByRole("button", { name: "Correct record", exact: true }).click();
  await page.getByRole("button", { name: "Back to records", exact: true }).click();
  await expect(page.getByLabel("Search records", { exact: true })).toHaveValue("Cash sales");
  await expect(page.getByLabel("Filter by account", { exact: true })).toHaveValue(/.+/);
  await expect(page.getByLabel("Filter by account", { exact: true }).locator("option:checked")).toHaveText("Cash");
  await expect(page.getByRole("button", { name: /^Cash sales/ })).toBeFocused();
  await visibleButton(page, "Home").click();
  await expect(page.getByRole("button", { name: "Finish your draft", exact: true })).toBeVisible();
});

test("no search matches keeps the saved-record count and a reset action", async ({ page }) => {
  await demo(page);
  await visibleButton(page, "Records").click();
  await expect(page.getByRole("heading", { name: "Your records" })).toBeVisible();
  await page.getByLabel("Search records", { exact: true }).fill("no-such-synthetic-record-ux");
  await expect(page.getByRole("heading", { name: "No matching records" })).toBeVisible();
  await expect(page.getByText("Your saved records are still here.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching records" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Cash sales/ })).toBeVisible();
});
