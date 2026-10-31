import { expect, test, type Locator, type Page } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";

test.use({ serviceWorkers: "block" });
const nav = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: /^(Main|Mobile) navigation$/ })
    .filter({ visible: true })
    .getByRole("button", { name, exact: true });
const box = async (locator: Locator) => {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  return value!;
};

for (const view of [
  { width: 320, height: 640, dark: false },
  { width: 390, height: 640, dark: true },
  { width: 768, height: 640, dark: false },
  { width: 1280, height: 900, dark: false },
])
  test(`fields, filters and report actions stay grouped at ${view.width} ${view.dark ? "dark" : "light"}`, async ({
    page,
  }) => {
    await page.setViewportSize(view);
    await openSampleWorkspace(page);
    await expect(
      page.getByRole("heading", { name: "What happened with your money?" }),
    ).toBeVisible();
    if (view.dark)
      await page.getByRole("button", { name: /dark appearance/i }).click();
    const bar = await box(page.getByRole("banner"));
    const date = await box(page.getByLabel("Date of activity"));
    expect(date.y).toBeGreaterThanOrEqual(bar.y + bar.height);

    await page
      .getByRole("button", { name: "Add a manual record", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Check this record" });
    const description = await box(
      dialog.getByLabel("Description", { exact: true }),
    );
    const label = dialog.locator('label[for="amount"]');
    const amountLabel = await box(label);
    expect(
      amountLabel.y - description.y - description.height,
    ).toBeGreaterThanOrEqual(16);
    const amount = await box(
      dialog.getByLabel("Amount · GHS", { exact: true }),
    );
    expect(amount.y - amountLabel.y - amountLabel.height).toBeLessThanOrEqual(
      12,
    );
    expect(
      await label.evaluate((node) =>
        parseFloat(getComputedStyle(node).fontSize),
      ),
    ).toBeLessThan(
      await dialog
        .getByLabel("Amount · GHS", { exact: true })
        .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
    );
    const formBody = await box(dialog.locator("form").locator(".."));
    const review = await box(
      dialog.getByRole("button", { name: "Review this record", exact: true }),
    );
    expect(review.y).toBeGreaterThanOrEqual(formBody.y + formBody.height);
    expect(review.y + review.height).toBeLessThanOrEqual(view.height - 8);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();

    await nav(page, "Records").click();
    const filters = page.getByRole("search", { name: "Records filters" });
    const search = await box(filters.getByLabel("Search records"));
    const account = await box(filters.getByLabel("Filter by account"));
    if (view.width <= 760)
      expect(account.y).toBeGreaterThanOrEqual(search.y + search.height + 8);
    await expect(
      page.getByRole("button", { name: "Add record", exact: true }),
    ).toHaveCount(1);

    await nav(page, view.width <= 760 ? "Stories" : "Money Stories").click();
    const first = await box(
      page.getByRole("button", { name: "See money received", exact: true }),
    );
    const second = await box(
      page.getByRole("button", { name: "See money paid out", exact: true }),
    );
    if (second.y > first.y + 2)
      expect(second.y - first.y - first.height).toBeGreaterThanOrEqual(8);
    else expect(second.x - first.x - first.width).toBeGreaterThanOrEqual(8);
    const sales = page.locator("section").filter({
      has: page.getByRole("heading", {
        name: "Sales and money received",
        exact: true,
      }),
    });
    expect(
      (await box(sales.locator("p button").first())).height,
    ).toBeLessThanOrEqual(32);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  });

test("the record editor keeps its action visible while native validation and keyboard focus reach its fields on a short phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 380 });
  await openSampleWorkspace(page);
  await page
    .getByRole("button", { name: "Add a manual record", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Check this record" });
  const review = dialog.getByRole("button", {
    name: "Review this record",
    exact: true,
  });
  await expect(review).toBeVisible();
  await review.click();
  await expect(dialog.getByLabel("Description", { exact: true })).toBeFocused();
  const footer = await box(review.locator(".."));
  for (const name of [
    "Description",
    "Amount · GHS",
    "Date",
    "What happened?",
    "Account",
    "Person or business (when money is owed)",
  ]) {
    const field = dialog.getByLabel(name, { exact: true });
    await field.focus();
    const fieldBox = await box(field);
    expect(fieldBox.y + fieldBox.height).toBeLessThanOrEqual(footer.y);
  }
  await dialog
    .getByLabel("Description", { exact: true })
    .fill("A layout verification expense");
  await dialog.getByLabel("Amount · GHS", { exact: true }).fill("20.00");
  await review.click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Check this record", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save this record", exact: true }),
  ).toBeEnabled();
});

test("a short payment editor shows its balance and first field together", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 380 });
  await openSampleWorkspace(page);
  await nav(page, "Records").click();
  await page.getByRole("button", { name: "People", exact: true }).click();
  await page
    .locator("strong")
    .filter({ hasText: /^Abena$/ })
    .locator("..")
    .locator("..")
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Check this record" });
  const body = await box(dialog.locator("form").locator(".."));
  const first = await box(dialog.getByLabel("Description", { exact: true }));
  expect(first.y + first.height).toBeLessThanOrEqual(body.y + body.height);
  await expect(dialog).toContainText("Recorded balance: GH₵400.00");
});

test("account and goal footer actions submit their own forms without changing existing money", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await openSampleWorkspace(page);
  const before = (await (await page.request.get("/api/workspaces")).json())
    .workspaces[0];
  await nav(page, "Records").click();
  await page.getByRole("button", { name: "Accounts", exact: true }).click();
  await page.getByRole("button", { name: "Add account", exact: true }).click();
  let dialog = page.getByRole("dialog", { name: "Track an account" });
  await dialog
    .getByRole("button", { name: "Add account", exact: true })
    .click();
  await expect(dialog.getByLabel("Account nickname")).toBeFocused();
  await dialog.getByLabel("Account nickname").fill("Household cash");
  await dialog
    .getByRole("button", { name: "Add account", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Household cash", exact: true }),
  ).toBeVisible();
  await nav(page, "Plan").click();
  await page.getByRole("button", { name: "New goal", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "What are you working towards?" });
  await dialog
    .getByRole("button", { name: "Create goal", exact: true })
    .click();
  await expect(dialog.getByLabel("Goal name")).toBeFocused();
  await dialog.getByLabel("Goal name").fill("School fund");
  await dialog.getByLabel("Fixed target · GHS").fill("900.00");
  await dialog.getByLabel("Tracked account").selectOption("cash");
  await dialog
    .getByRole("button", { name: "Create goal", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "School fund", exact: true }),
  ).toBeVisible();
  const after = (await (await page.request.get("/api/workspaces")).json())
    .workspaces[0];
  expect(after.records).toEqual(before.records);
  expect(after.accounts.slice(0, before.accounts.length)).toEqual(
    before.accounts,
  );
  expect(
    after.accounts.find(
      (account: { name: string }) => account.name === "Household cash",
    ).opening,
  ).toBeNull();
  expect(
    after.goals.find((goal: { name: string }) => goal.name === "School fund")
      .allocations,
  ).toEqual([]);
});
