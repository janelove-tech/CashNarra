import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { openSampleWorkspace } from "./demo-entry";
import { accountBalance, obligations, report } from "../../src/domain/ledger";
import { RECORDS_CONTEXT_KEY } from "../../src/lib/records-context";
import type { Workspace } from "../../src/domain/types";

test.use({ serviceWorkers: "block", screenshot: "only-on-failure" });
const visibleButton = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: /^(Main|Mobile) navigation$/ })
    .filter({ visible: true })
    .getByRole("button", { name, exact: true });
async function open(page: Page) {
  await openSampleWorkspace(page);
  await expect(
    page.getByRole("heading", { name: "What happened with your money?" }),
  ).toBeVisible();
}
async function records(page: Page) {
  await visibleButton(page, "Records").click();
  await expect(
    page.getByRole("heading", { name: "Your records", exact: true }),
  ).toBeVisible();
}
async function people(page: Page) {
  await records(page);
  await page.getByRole("button", { name: "People", exact: true }).click();
}
async function payment(page: Page, party: string) {
  const row = page
    .locator("strong")
    .filter({ hasText: new RegExp(`^${party}$`) })
    .locator("..")
    .locator("..");
  await row
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Check this record" });
  await expect(dialog).toBeVisible();
  return dialog;
}
async function state(page: Page): Promise<Workspace[]> {
  return (await (await page.request.get("/api/workspaces")).json()).workspaces;
}
async function addWorkspace(page: Page) {
  const id = crypto.randomUUID();
  const response = await page.request.post("/api/workspaces", {
    headers: { Origin: new URL(page.url()).origin },
    data: {
      action: "create",
      workspaceId: id,
      expectedVersion: -1,
      key: crypto.randomUUID(),
      name: "Home tests",
      type: "Personal",
    },
  });
  expect(response.ok()).toBe(true);
  return id;
}
async function switchWorkspace(page: Page, name: string) {
  await page
    .getByRole("button", { name: "Workspace, accounts and settings" })
    .click();
  await page
    .getByRole("dialog", { name: "Your account" })
    .getByRole("button", { name: new RegExp(name) })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Workspace, accounts and settings" }),
  ).toContainText(name);
  await records(page);
}

for (const scenario of [
  {
    party: "Abena",
    balance: "opening-abena",
    kind: "receivable_payment",
    full: "400.00",
    amount: "200.00",
    after: "200.00",
    account: "momo",
    incoming: true,
  },
  {
    party: "Adjei Packaging",
    balance: "opening-supplier",
    kind: "payable_payment",
    full: "500.00",
    amount: "125.00",
    after: "375.00",
    account: "bank",
    incoming: false,
  },
  {
    party: "Business lender",
    balance: "opening-loan",
    kind: "loan_principal",
    full: "1000.00",
    amount: "100.00",
    after: "900.00",
    account: "cash",
    incoming: false,
  },
])
  test(`contextual payment requires a deliberate amount and account for ${scenario.kind}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await open(page);
    const before = (await state(page))[0];
    let saves = 0,
      interpretations = 0;
    page.on("request", (request) => {
      if (request.url().endsWith("/api/understand")) interpretations++;
      if (
        request.method() === "POST" &&
        request.url().endsWith("/api/workspaces") &&
        request.postDataJSON()?.action === "batch"
      )
        saves++;
    });
    await people(page);
    const dialog = await payment(page, scenario.party);
    await expect(
      dialog.getByLabel("Amount · GHS", { exact: true }),
    ).toHaveValue("");
    await expect(dialog.getByLabel("Account", { exact: true })).toHaveValue("");
    await expect(
      dialog.getByLabel("What happened?", { exact: true }),
    ).toHaveValue(scenario.kind);
    await expect(dialog).toContainText(
      scenario.incoming ? "Record money received" : "Record money paid",
    );
    await page.screenshot({ path: info.outputPath("payment-entry.png") });
    await dialog.getByRole("button", { name: "Use full balance" }).click();
    await expect(
      dialog.getByLabel("Amount · GHS", { exact: true }),
    ).toHaveValue(scenario.full);
    await dialog
      .getByLabel("Amount · GHS", { exact: true })
      .fill(scenario.amount);
    await dialog.getByLabel("Date", { exact: true }).fill("2026-10-14");
    await dialog.getByRole("button", { name: "Review this record" }).click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Account", { exact: true })).toBeFocused();
    expect(saves).toBe(0);
    await dialog
      .getByLabel("Account", { exact: true })
      .selectOption(scenario.account);
    await page.screenshot({ path: info.outputPath("payment.png") });
    await dialog.getByRole("button", { name: "Review this record" }).click();
    await expect(
      page.getByRole("region", { name: "After saving" }),
    ).toContainText(`GH₵${scenario.after}`);
    expect(saves).toBe(0);
    expect(interpretations).toBe(0);
    await page
      .getByRole("button", { name: "Save this record", exact: true })
      .click();
    await expect(
      page.getByRole("region", { name: "Saved", exact: true }),
    ).toBeVisible();
    expect(saves).toBe(1);
    await page.reload();
    const after = (await state(page))[0];
    expect(
      obligations(after).find((balance) => balance.id === scenario.balance)
        ?.remaining,
    ).toBe(scenario.after);
    expect(report(after, "2026-10-01", "2026-10-31").sales).toBe(
      report(before, "2026-10-01", "2026-10-31").sales,
    );
    expect(report(after, "2026-10-01", "2026-10-31").expenses).toBe(
      report(before, "2026-10-01", "2026-10-31").expenses,
    );
    const added = after.records.find(
      (record) => !before.records.some((old) => old.id === record.id),
    )!;
    expect(added.accountId).toBe(scenario.account);
    expect(added.amount).toBe(scenario.amount);
    expect(accountBalance(after, scenario.account)).not.toBe(
      accountBalance(before, scenario.account),
    );
  });

test("the full-balance shortcut accounts for another proposed payment without posting early", async ({
  page,
}) => {
  await open(page);
  await people(page);
  let dialog = await payment(page, "Abena");
  await dialog.getByLabel("Amount · GHS", { exact: true }).fill("50.00");
  await dialog.getByLabel("Date", { exact: true }).fill("2026-10-14");
  await dialog.getByLabel("Account", { exact: true }).selectOption("cash");
  await dialog.getByRole("button", { name: "Review this record" }).click();
  await people(page);
  dialog = await payment(page, "Abena");
  await dialog.getByRole("button", { name: "Use full balance" }).click();
  await expect(dialog.getByLabel("Amount · GHS", { exact: true })).toHaveValue(
    "350.00",
  );
  await expect(dialog).toContainText(
    "Full balance after the other proposed changes",
  );
  await dialog.getByLabel("Date", { exact: true }).fill("2026-10-14");
  await dialog.getByLabel("Account", { exact: true }).selectOption("momo");
  await dialog.getByRole("button", { name: "Review this record" }).click();
  expect(
    obligations((await state(page))[0]).find(
      (balance) => balance.id === "opening-abena",
    )?.remaining,
  ).toBe("400.00");
  await page.getByRole("button", { name: "Save 2 records" }).click();
  const saved = page.getByRole("region", { name: "Saved", exact: true });
  await expect(
    saved.getByText("This recorded balance with Abena is now settled.", {
      exact: true,
    }),
  ).toHaveCount(1);
  expect(
    obligations((await state(page))[0]).find(
      (balance) => balance.id === "opening-abena",
    )?.remaining,
  ).toBe("0.00");
});

test("a correction retains entered values and can deliberately settle the corrected payment", async ({
  page,
}) => {
  await open(page);
  await records(page);
  await page.getByLabel("Search records", { exact: true }).fill("Abena");
  await page.getByRole("button", { name: /^Payment from Abena/ }).click();
  await page
    .getByRole("button", { name: "Correct record", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Proposed records" })
    .getByRole("button", { name: "Change", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Amount · GHS", { exact: true })).toHaveValue(
    "200.00",
  );
  await expect(dialog.getByLabel("Account", { exact: true })).toHaveValue(
    "momo",
  );
  await dialog.getByRole("button", { name: "Use full balance" }).click();
  await expect(dialog.getByLabel("Amount · GHS", { exact: true })).toHaveValue(
    "600.00",
  );
  await dialog.getByRole("button", { name: "Review this record" }).click();
  await page
    .getByRole("button", { name: "Save this record", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Saved", exact: true }),
  ).toContainText("This recorded balance with Abena is now settled");
  const w = (await state(page))[0];
  expect(
    obligations(w).find((balance) => balance.id === "opening-abena")?.remaining,
  ).toBe("0.00");
  expect(w.history.length).toBeGreaterThan(0);
});

test("an export explains its scope and downloads all accounts despite visible list filters", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await open(page);
  await records(page);
  await page.getByLabel("Search records", { exact: true }).fill("Abena");
  await page
    .getByLabel("Filter by account", { exact: true })
    .selectOption("momo");
  await page.getByLabel("Filter records", { exact: true }).selectOption("in");
  await expect(page.getByRole("button", { name: /^Cash sales/ })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Export your records" });
  await dialog.getByRole("radio", { name: "Specify", exact: true }).check();
  await dialog.getByLabel("Date", { exact: true }).fill("2026-10-13");
  const scope = dialog.getByRole("region", { name: "Export scope" });
  await expect(scope).toContainText("Ama Works");
  await expect(scope).toContainText("13 Oct 2026");
  await expect(scope).toContainText("All accounts are included");
  await expect(scope).toContainText(
    "Records search, account and type filters are not applied",
  );
  await scope.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("export.png") });
  const downloaded = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "CSV", exact: true }).click();
  const file = await downloaded;
  expect(await file.failure()).toBeNull();
  const csv = await readFile((await file.path())!, "utf8");
  expect(csv).toContain("Cash sales");
  expect(csv).toContain("Stock for the shop");
  expect(csv).toContain("Bank → MoMo");
});

test("export summary follows another workspace and separate-file selection", async ({
  page,
}) => {
  await open(page);
  await addWorkspace(page);
  await page.reload();
  await records(page);
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const dialog = page.getByRole("dialog"),
    scope = dialog.getByRole("region", { name: "Export scope" });
  await dialog.getByRole("radio", { name: /Another workspace/ }).check();
  await expect(scope).toContainText("Home tests");
  await dialog
    .getByRole("radio", { name: "All your workspaces", exact: true })
    .check();
  await expect(scope).toContainText("2 workspaces · one file for each");
  await expect(dialog).toContainText("The same dates are used for each file");
});

test("Records filters and the selected row survive a refresh without entering the URL", async ({
  page,
}) => {
  await open(page);
  await records(page);
  await page.getByLabel("Search records", { exact: true }).fill("Cash sales");
  await page
    .getByLabel("Filter by account", { exact: true })
    .selectOption("cash");
  await page.getByLabel("Filter records", { exact: true }).selectOption("in");
  const row = page.getByRole("button", { name: /^Cash sales/ });
  await row.click();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.getByLabel("Search records", { exact: true })).toHaveValue(
    "Cash sales",
  );
  await expect(
    page.getByLabel("Filter by account", { exact: true }),
  ).toHaveValue("cash");
  await expect(page.getByLabel("Filter records", { exact: true })).toHaveValue(
    "in",
  );
  await expect(row).toBeFocused();
  expect(page.url()).not.toContain("Cash");
});

test("Records restores its reading position and date range after a refresh", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await open(page);
  await page
    .getByRole("button", { name: "Recorded account balances", exact: false })
    .click();
  await records(page);
  const row = page.getByRole("button", { name: /^Money taken home/ });
  await row.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await row.click();
  await page.keyboard.press("Escape");
  const top = await page.evaluate(() => scrollY);
  expect(top).toBeGreaterThan(0);
  await page.reload();
  await expect(row).toBeFocused();
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => scrollY)) - top))
    .toBeLessThan(8);
  // The day drilldown supplies a supported date range, which is also restored.
  await visibleButton(page, "Home").click();
  await page.getByRole("button", { name: /^Money in ·/ }).click();
  await expect(
    page.getByText("Showing 13 Oct 2026.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Showing 13 Oct 2026.", { exact: false }),
  ).toBeVisible();
});

test("workspace switching and reload preserve each workspace's own investigation", async ({
  page,
}) => {
  await open(page);
  await addWorkspace(page);
  await page.reload();
  await records(page);
  await page.getByLabel("Search records", { exact: true }).fill("Abena");
  await page
    .getByLabel("Filter by account", { exact: true })
    .selectOption("momo");
  await switchWorkspace(page, "Home tests");
  await expect(page.getByLabel("Search records", { exact: true })).toHaveValue(
    "",
  );
  await expect(
    page.getByLabel("Filter by account", { exact: true }),
  ).toHaveValue("");
  await page
    .getByLabel("Search records", { exact: true })
    .fill("Personal groceries");
  await switchWorkspace(page, "Ama Works");
  await expect(page.getByLabel("Search records", { exact: true })).toHaveValue(
    "Abena",
  );
  await expect(
    page.getByLabel("Filter by account", { exact: true }),
  ).toHaveValue("momo");
  await switchWorkspace(page, "Home tests");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Workspace, accounts and settings" }),
  ).toContainText("Home tests");
  await expect(page.getByLabel("Search records", { exact: true })).toHaveValue(
    "Personal groceries",
  );
});

test("sign-out and a different authenticated person cannot restore an old search", async ({
  page,
}) => {
  await open(page);
  await records(page);
  await page
    .getByLabel("Search records", { exact: true })
    .fill("Private search from the previous person");
  await page
    .getByRole("button", { name: "Workspace, accounts and settings" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "Sign out of this device?" })
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
  expect(
    await page.evaluate(
      (key) => sessionStorage.getItem(key),
      RECORDS_CONTEXT_KEY,
    ),
  ).toBeNull();
  await open(page);
  await records(page);
  await expect(page.getByLabel("Search records", { exact: true })).toHaveValue(
    "",
  );
});

test("blocked storage preserves current work and explains that refresh will reset the filters", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key)
        throw new DOMException("Storage is blocked", "QuotaExceededError");
      original.call(this, name, value);
    };
  }, RECORDS_CONTEXT_KEY);
  await open(page);
  await records(page);
  await page.getByLabel("Search records", { exact: true }).fill("Cash sales");
  await expect(
    page.getByText(
      "Your filters are kept for now, but refreshing this page will reset them.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Search records", { exact: true })).toHaveValue(
    "",
  );
  await expect(
    page.getByRole("heading", { name: "Your records", exact: true }),
  ).toBeVisible();
});

test("changing a manual record to a payment clears the assumed account", async ({
  page,
}) => {
  await open(page);
  await page.getByRole("button", { name: "Add a manual record" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Description", { exact: true })
    .fill("Manual payment");
  await dialog.getByLabel("Amount · GHS", { exact: true }).fill("20.00");
  await dialog
    .getByLabel("What happened?", { exact: true })
    .selectOption("receivable_payment");
  await expect(dialog.getByLabel("Account", { exact: true })).toHaveValue("");
  await expect(dialog.getByLabel("Amount · GHS", { exact: true })).toHaveValue(
    "20.00",
  );
  await dialog
    .getByLabel("Existing balance", { exact: true })
    .selectOption("opening-abena");
  await expect(
    dialog.getByLabel("Person or business (when money is owed)"),
  ).toHaveValue("Abena");
});

for (const scenario of [
  { width: 320, height: 380, dark: false },
  { width: 390, height: 640, dark: true },
])
  test(`payment and export remain usable at ${scenario.width}×${scenario.height}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({
      width: scenario.width,
      height: scenario.height,
    });
    await open(page);
    if (scenario.dark)
      await page
        .getByRole("button", { name: "Switch to dark appearance" })
        .click();
    await people(page);
    const dialog = await payment(page, "Abena");
    const review = dialog.getByRole("button", { name: "Review this record" });
    await review.scrollIntoViewIfNeeded();
    await expect(review).toBeInViewport({ ratio: 1 });
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    await expect(
      new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze()
        .then((result) => result.violations),
    ).resolves.toEqual([]);
    await page.screenshot({ path: info.outputPath("payment-short.png") });
    await page.keyboard.press("Escape");
    await records(page);
    await page.getByRole("button", { name: "Export", exact: true }).click();
    const exportDialog = page.getByRole("dialog", {
      name: "Export your records",
    });
    const action = exportDialog.getByRole("button", {
      name: "CSV",
      exact: true,
    });
    await action.scrollIntoViewIfNeeded();
    await expect(action).toBeInViewport({ ratio: 1 });
    expect(
      await exportDialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    await expect(
      new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze()
        .then((result) => result.violations),
    ).resolves.toEqual([]);
    await page.screenshot({ path: info.outputPath("export-short.png") });
  });
