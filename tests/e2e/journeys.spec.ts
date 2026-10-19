import { test, expect, type Page } from "@playwright/test";
async function demo(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await expect(
    page.getByRole("heading", { name: "Let’s make sense of your money." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Recorded account balances/ }),
  ).toContainText("5,970.00");
}
test("account balance evidence opens its transfer record", async ({ page }) => {
  await demo(page);
  await page
    .getByRole("button", { name: "Money Stories", exact: true })
    .filter({ visible: true })
    .click();
  await page.getByRole("button", { name: "GH₵2,400.00", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Behind these figures" });
  await dialog
    .getByText("Records for Bank", { exact: true })
    .click();
  await expect(
    dialog.getByText(/transfers remain excluded/).filter({ visible: true }),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "2026-10-13 · Bank → MoMo", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Bank → MoMo");
});
test("manual review, authoritative save, correction, source history and private exports", async ({
  page,
}) => {
  await demo(page);
  await page
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await page.getByRole("button", { name: "Add a manual record" }).click();
  await page
    .getByLabel("Description", { exact: true })
    .fill("Synthetic test delivery");
  await page.getByLabel("Amount · GHS", { exact: true }).fill("12.34");
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  await expect(page.getByText("GH₵942.34", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Records", exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole("button", { name: /Synthetic test delivery Business expense/ })
    .click();
  await page
    .getByRole("button", { name: "Correct record", exact: true })
    .click();
  await page
    .getByRole("button", { name: /Synthetic test delivery Business expense/ })
    .click();
  await page.getByLabel("Amount · GHS", { exact: true }).fill("10.00");
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  await expect(page.getByText("GH₵940.00", { exact: true })).toBeVisible();
  for (const format of ["CSV", "PDF", "XLSX"]) {
    await page.getByRole("button", { name: "Export", exact: true }).click();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: format, exact: true }).click();
    const file = await download;
    await file.saveAs(`test-results/export.${format.toLowerCase()}`);
    expect(await file.failure()).toBeNull();
  }
});
test("mock clarification and unsupported input remain drafts", async ({
  page,
}) => {
  await demo(page);
  await page
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Unlisted synthetic example");
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "This demo can read the two sample stories" }),
  ).toContainText("This demo can read the two sample stories");
  await page.getByRole("button", { name: "Try an unclear version" }).click();
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(
    page.getByRole("heading", { name: "One thing to fill in." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save 8 records" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "MoMo", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your story, organised." }),
  ).toBeVisible();
  await expect(page.getByText("This may already be recorded.")).toBeVisible();
});
for (const width of [320, 390, 768, 1440])
  for (const dark of [false, true])
    test(`layout ${width}px ${dark ? "dark" : "light"} and keyboard dialog`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      await demo(page);
      if (dark)
        await page
          .getByRole("button", { name: "Switch to dark appearance" })
          .click();
      await page.screenshot({
        path: `test-results/today-${width}-${dark ? "dark" : "light"}.png`,
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page
        .getByRole("button", { name: "Workspace, accounts and settings" })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "Workspace, accounts and settings" }),
      ).toBeFocused();
      expect(errors).toEqual([]);
    });
test("lost save response recovers the records confirmed without posting twice", async ({
  page,
}) => {
  await demo(page);
  await page
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await page.getByRole("button", { name: "Add a manual record" }).click();
  await page
    .getByLabel("Description", { exact: true })
    .fill("Lost-response synthetic record");
  await page.getByLabel("Amount · GHS", { exact: true }).fill("0.10");
  await page.getByRole("button", { name: "Review this record" }).click();
  let intercepted = false;
  await page.route("**/api/workspaces", async (route) => {
    if (route.request().method() === "POST" && !intercepted) {
      intercepted = true;
      await route.fetch();
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("Save not confirmed");
  await page
    .getByRole("button", { name: "Check original save request" })
    .click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  const state = await (await page.request.get("/api/workspaces")).json();
  expect(
    state.workspaces[0].records.filter(
      (r: { description: string }) =>
        r.description === "Lost-response synthetic record",
    ),
  ).toHaveLength(1);
});
test("offline draft recovery and later explicit reviewed save", async ({
  page,
  context,
}) => {
  await demo(page);
  await page
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await page.getByLabel("Keep drafts on this private device").check();
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("An offline synthetic note");
  await expect(page.getByRole("status")).toContainText("Draft on this device");
  await context.setOffline(true);
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("A revised offline synthetic note");
  await expect(page.getByRole("status")).toContainText("Draft on this device");
  await context.setOffline(false);
  page.on("dialog", (d) => d.accept());
  await page.reload();
  await page
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue("A revised offline synthetic note");
  await page.getByRole("button", { name: "Add a manual record" }).click();
  await page
    .getByLabel("Description", { exact: true })
    .fill("Reviewed after reconnecting");
  await page.getByLabel("Amount · GHS", { exact: true }).fill("1.00");
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
});
test("two synthetic users cannot read or mutate the other workspace", async ({
  page,
  browser,
}) => {
  await demo(page);
  const first = await (await page.request.get("/api/workspaces")).json();
  const other = await browser.newContext({ baseURL: "http://127.0.0.1:3100" });
  const second = await other.newPage();
  await demo(second);
  const denied = await other.request.get(
    `/api/workspaces?workspace=${first.workspaces[0].id}&request=anything`,
  );
  expect(denied.status()).toBe(401);
  const write = await other.request.post("/api/workspaces", {
    headers: { origin: "http://127.0.0.1:3100" },
    data: {
      action: "checkin",
      workspaceId: first.workspaces[0].id,
      expectedVersion: 2,
      key: "foreign",
      date: "2026-10-13",
      kind: "review",
    },
  });
  expect(write.status()).toBe(409);
  await other.close();
});

