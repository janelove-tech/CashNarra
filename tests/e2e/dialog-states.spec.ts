import { expect, test, type Page } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";

test.use({ serviceWorkers: "block" });
const nav = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: /^(Main|Mobile) navigation$/ })
    .filter({ visible: true })
    .getByRole("button", { name, exact: true });
const dialog = (page: Page) => page.getByRole("dialog");
async function start(page: Page) {
  await openSampleWorkspace(page);
  await expect(
    page.getByRole("heading", { name: "What happened with your money?" }),
  ).toBeVisible();
}
async function close(page: Page) {
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
}
async function mark(page: Page) {
  await nav(page, "Plan").click();
  await page.getByRole("button", { name: "Assign money", exact: true }).click();
}
async function footerFits(page: Page, action: string) {
  const button = dialog(page).getByRole("button", {
    name: action,
    exact: true,
  });
  await expect(button).toBeVisible();
  const bounds = await button.boundingBox();
  const body = await dialog(page)
    .locator("[data-dialog-content]")
    .boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(body!.y + body!.height);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
    page.viewportSize()!.height - 8,
  );
  expect(
    await dialog(page).evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
}
async function addWorkspace(
  page: Page,
  name = "Household",
  withAccount = true,
) {
  const id = crypto.randomUUID();
  const response = await page.request.post("/api/workspaces", {
    headers: { Origin: new URL(page.url()).origin },
    data: {
      action: "create",
      workspaceId: id,
      expectedVersion: -1,
      key: crypto.randomUUID(),
      name,
      type: "Personal",
    },
  });
  expect(response.ok()).toBe(true);
  if (withAccount) {
    const account = await page.request.post("/api/workspaces", {
      headers: { Origin: new URL(page.url()).origin },
      data: {
        action: "account",
        workspaceId: id,
        expectedVersion: 0,
        key: crypto.randomUUID(),
        account: {
          id: crypto.randomUUID(),
          name: "Home cash",
          type: "Cash",
          currency: "GHS",
          opening: null,
          openingDate: "2026-10-01",
        },
      },
    });
    expect(account.ok()).toBe(true);
  }
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "What happened with your money?" }),
  ).toBeVisible();
  return id;
}
async function openMove(page: Page) {
  await nav(page, "Records").click();
  await page.getByRole("button", { name: /^Cash sales/ }).click();
  await page
    .getByRole("button", { name: "Move workspace", exact: true })
    .click();
}
async function visibleError(page: Page, text: string) {
  const alert = dialog(page).getByRole("alert");
  await expect(alert).toContainText(text);
  await expect(alert).toBeFocused();
  // Closed draft-backup details contain an unrelated empty alert on Home.
  await expect(
    page.locator('main [role="alert"]').filter({ hasText: text }),
  ).toHaveCount(0);
}

for (const view of [
  { width: 320, height: 380, dark: false },
  { width: 390, height: 640, dark: true },
  { width: 1280, height: 900, dark: false },
])
  test(`remaining form footers, validation and masked context at ${view.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(view);
    await start(page);
    if (view.dark)
      await page.getByRole("button", { name: /dark appearance/i }).click();
    if (view.width === 320) {
      const gutter = await page.evaluate(
        () => innerWidth - document.documentElement.clientWidth,
      );
      await page.setViewportSize({
        width: 320 - Math.max(0, 15 - gutter),
        height: view.height,
      });
    }
    await page.getByRole("button", { name: "Check in", exact: true }).click();
    await footerFits(page, "Record check-in");
    await close(page);
    await page
      .getByRole("button", { name: "Hide amounts", exact: true })
      .click();
    await mark(page);
    const facts = dialog(page).getByRole("region", {
      name: "Goal mark context",
    });
    await expect(facts.locator("dd")).toHaveText(["••••", "••••", "••••"]);
    await expect(facts).not.toContainText("GH₵");
    await footerFits(page, "Save mark");
    await dialog(page)
      .getByRole("button", { name: "Save mark", exact: true })
      .click();
    await expect(
      dialog(page).getByLabel("Amount · GHS", { exact: true }),
    ).toBeFocused();
    await close(page);
    await page
      .getByRole("button", { name: "Show amounts", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Review history", exact: true })
      .click();
    await footerFits(page, "Record review");
    await close(page);
    await nav(page, "Records").click();
    await page.getByRole("button", { name: /^Cash sales/ }).click();
    await footerFits(page, "Correct record");
    const sourceTitle = await dialog(page)
      .getByRole("heading", { name: "From your story", exact: true })
      .boundingBox();
    const quote = await dialog(page).locator("blockquote").boundingBox();
    expect(
      quote!.y - sourceTitle!.y - sourceTitle!.height,
    ).toBeGreaterThanOrEqual(8);
    expect(quote!.y - sourceTitle!.y - sourceTitle!.height).toBeLessThanOrEqual(
      16,
    );
    await close(page);
    await page.getByRole("button", { name: "Accounts", exact: true }).click();
    const cash = page.locator("article").filter({
      has: page.getByRole("heading", { name: "Cash", exact: true }),
    });
    await cash
      .getByText("Starting balance and later records", { exact: true })
      .click();
    await cash
      .getByRole("button", { name: "Check starting balance", exact: true })
      .click();
    await footerFits(page, "Save starting balance");
    await dialog(page)
      .getByRole("button", { name: "Save starting balance", exact: true })
      .click();
    await expect(
      dialog(page).getByLabel("Reason for this correction"),
    ).toBeFocused();
  });

test("a rejected goal mark stays in its dialog with one error and retained input", async ({
  page,
}) => {
  await start(page);
  const before = await (await page.request.get("/api/workspaces")).json();
  await mark(page);
  await dialog(page).getByLabel("Amount · GHS", { exact: true }).fill("10.00");
  await page.route("**/api/workspaces", (route) =>
    route.request().method() === "POST" &&
    route.request().postDataJSON()?.action === "allocation"
      ? route.fulfill({
          status: 400,
          json: {
            error: "This amount cannot be marked for this goal.",
            outcome: "rejected",
          },
        })
      : route.continue(),
  );
  await dialog(page)
    .getByRole("button", { name: "Save mark", exact: true })
    .click();
  await visibleError(page, "This amount cannot be marked");
  await expect(
    dialog(page).getByLabel("Amount · GHS", { exact: true }),
  ).toHaveValue("10.00");
  await expect(
    dialog(page).getByLabel("Amount · GHS", { exact: true }),
  ).toBeEnabled();
  expect(await (await page.request.get("/api/workspaces")).json()).toEqual(
    before,
  );
  await close(page);
  await page.getByRole("button", { name: "New goal", exact: true }).click();
  await expect(dialog(page).getByRole("alert")).toHaveCount(0);
  await close(page);
  await page.getByRole("button", { name: "Assign money", exact: true }).click();
  await expect(dialog(page).getByRole("alert")).toHaveCount(0);
});

test("an invalid local mark is explained beside the form without a write", async ({
  page,
}) => {
  await start(page);
  let writes = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      request.url().endsWith("/api/workspaces")
    )
      writes++;
  });
  await mark(page);
  await dialog(page)
    .getByLabel("Amount · GHS", { exact: true })
    .fill("not an amount");
  await dialog(page)
    .getByRole("button", { name: "Save mark", exact: true })
    .click();
  await expect(dialog(page).getByRole("alert")).not.toBeEmpty();
  await expect(dialog(page).getByRole("alert")).toBeFocused();
  await expect(page.locator('main [role="alert"]')).toHaveCount(0);
  expect(writes).toBe(0);
});

test("a lost goal response retains the form and recovers the same request once", async ({
  page,
}) => {
  await start(page);
  await nav(page, "Plan").click();
  await page.getByRole("button", { name: "New goal", exact: true }).click();
  const requests: unknown[] = [];
  await page.route("**/api/workspaces", async (route) => {
    const request = route.request();
    if (
      request.method() !== "POST" ||
      request.postDataJSON()?.action !== "goal"
    )
      return route.continue();
    requests.push(request.postDataJSON());
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    if (requests.length === 1) await route.abort("failed");
    else await route.fulfill({ response });
  });
  await dialog(page).getByLabel("Goal name").fill("Retained school fund");
  await dialog(page).getByLabel("Fixed target · GHS").fill("900.00");
  await dialog(page).getByLabel("Tracked account").selectOption("cash");
  await dialog(page)
    .getByRole("button", { name: "Create goal", exact: true })
    .click();
  await visibleError(page, "couldn’t confirm that change");
  await expect(dialog(page).getByLabel("Goal name")).toHaveValue(
    "Retained school fund",
  );
  await expect(dialog(page).getByLabel("Goal name")).toBeDisabled();
  await expect(
    dialog(page).getByRole("button", { name: "Create goal", exact: true }),
  ).toHaveCount(0);
  await dialog(page)
    .getByRole("button", { name: "Check change result", exact: true })
    .click();
  await expect(dialog(page)).toHaveCount(0);
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual(requests[0]);
  const workspace = (await (await page.request.get("/api/workspaces")).json())
    .workspaces[0];
  expect(
    workspace.goals.filter(
      (goal: { name: string }) => goal.name === "Retained school fund",
    ),
  ).toHaveLength(1);
});

test("Edit goals opens at goals while the people entry opens at people", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await start(page);
  await nav(page, "Plan").click();
  await page.getByRole("button", { name: "Edit goals", exact: true }).click();
  const goals = dialog(page).getByRole("heading", {
    name: "Change a goal",
    exact: true,
  });
  await expect(goals).toBeFocused();
  const body = await dialog(page)
    .locator("[data-dialog-content]")
    .boundingBox();
  expect((await goals.boundingBox())!.y).toBeLessThan(body!.y + 24);
  const goalName = dialog(page).getByLabel("Goal name", { exact: true });
  await goalName.fill("An edited draft target");
  await page.route("**/api/workspaces", (route) =>
    route.request().method() === "POST" &&
    route.request().postDataJSON()?.action === "goal_edit"
      ? route.fulfill({
          status: 400,
          json: {
            error: "Check this target before saving.",
            outcome: "rejected",
          },
        })
      : route.continue(),
  );
  await dialog(page)
    .getByRole("button", { name: "Update goal", exact: true })
    .click();
  await visibleError(page, "Check this target");
  await expect(goalName).toHaveValue("An edited draft target");
  await close(page);
  await nav(page, "Records").click();
  await page.getByRole("button", { name: "People", exact: true }).click();
  await page
    .getByRole("button", { name: "Add a person or a due date", exact: true })
    .click();
  await expect(
    dialog(page).getByRole("heading", {
      name: "People you record money with",
      exact: true,
    }),
  ).toBeFocused();
  await expect(dialog(page).getByRole("alert")).toHaveCount(0);
});

test("a move account-load failure is visible, retriable and keeps the destination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await start(page);
  const targetId = await addWorkspace(page);
  await openMove(page);
  await page.route(
    `**/api/workspaces?workspace=${targetId}`,
    (route) => route.abort("failed"),
    { times: 1 },
  );
  await dialog(page).getByLabel("Correct workspace").selectOption(targetId);
  await visibleError(page, "accounts for this workspace could not be loaded");
  const retry = dialog(page).getByRole("button", {
    name: "Try loading accounts again",
    exact: true,
  });
  const body = await dialog(page)
    .locator("[data-dialog-content]")
    .boundingBox();
  const retryBox = await retry.boundingBox();
  expect(retryBox!.y + retryBox!.height).toBeLessThanOrEqual(
    body!.y + body!.height,
  );
  await expect(dialog(page).getByLabel("Correct workspace")).toHaveValue(
    targetId,
  );
  await expect(
    dialog(page).getByLabel("Account that actually received or paid"),
  ).toBeDisabled();
  await dialog(page)
    .getByRole("button", { name: "Try loading accounts again", exact: true })
    .click();
  await expect(dialog(page).getByRole("alert")).toHaveCount(0);
  await expect(
    dialog(page).getByLabel("Account that actually received or paid"),
  ).toBeEnabled();
  await expect(
    dialog(page)
      .getByLabel("Account that actually received or paid")
      .locator("option"),
  ).not.toHaveCount(1);
});

test("privacy and sign-out confirmations keep one footer and show failed actions inside the dialog", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 380 });
  await start(page);
  await page
    .getByRole("button", {
      name: "Workspace, accounts and settings",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Settings and privacy", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Request account-data deletion", exact: true })
    .click();
  await footerFits(page, "Record deletion request");
  await expect(
    dialog(page).getByRole("button", { name: "Close", exact: true }),
  ).toHaveCount(0);
  await page.route("**/api/workspaces", (route) =>
    route.request().method() === "POST" &&
    route.request().postDataJSON()?.action === "request"
      ? route.fulfill({
          status: 400,
          json: {
            error: "The deletion request was not recorded. Try again.",
            outcome: "rejected",
          },
        })
      : route.continue(),
  );
  await dialog(page)
    .getByRole("button", { name: "Record deletion request", exact: true })
    .click();
  await visibleError(page, "deletion request was not recorded");
  await close(page);
  await page
    .getByRole("button", { name: "Delete original stories", exact: true })
    .click();
  await footerFits(page, "Remove original words now");
  await dialog(page)
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Clear stored drafts", exact: true })
    .click();
  await footerFits(page, "Clear drafts and use shared-device mode");
  await dialog(page).getByRole("button", { name: "Stay", exact: true }).click();
  await nav(page, "Home").click();
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("My unfinished private story");
  await page
    .getByRole("button", {
      name: "Workspace, accounts and settings",
      exact: true,
    })
    .click();
  await dialog(page)
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await footerFits(page, "Sign out");
  await page.route("**/api/logout", (route) =>
    route.fulfill({ status: 500, json: { error: "Synthetic failure" } }),
  );
  await dialog(page)
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await visibleError(page, "Sign-out did not finish");
  await dialog(page).getByRole("button", { name: "Stay", exact: true }).click();
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue("My unfinished private story");
});

test("a rejected move keeps its details editable and an uncertain move reuses the original request", async ({
  page,
}) => {
  await start(page);
  const targetId = await addWorkspace(page);
  await openMove(page);
  await dialog(page).getByLabel("Correct workspace").selectOption(targetId);
  const account = dialog(page).getByLabel(
    "Account that actually received or paid",
  );
  await expect(account).toBeEnabled();
  const accountValue = await account
    .locator("option")
    .nth(1)
    .getAttribute("value");
  await account.selectOption(accountValue!);
  await dialog(page)
    .getByLabel("Why was this filed incorrectly?")
    .fill("Recorded in the wrong workspace");
  await dialog(page).getByRole("checkbox").check();
  const requests: Record<string, unknown>[] = [];
  await page.route("**/api/workspaces", async (route) => {
    if (
      route.request().method() !== "POST" ||
      route.request().postDataJSON()?.action !== "move"
    )
      return route.continue();
    requests.push(route.request().postDataJSON());
    if (requests.length === 1)
      return route.fulfill({
        status: 400,
        json: { error: "Check the destination account.", outcome: "rejected" },
      });
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    if (requests.length === 2) await route.abort("failed");
    else await route.fulfill({ response });
  });
  await dialog(page)
    .getByRole("button", { name: "Save reviewed move", exact: true })
    .click();
  await visibleError(page, "Check the destination account");
  await expect(account).toBeEnabled();
  await expect(
    dialog(page).getByLabel("Why was this filed incorrectly?"),
  ).toHaveValue("Recorded in the wrong workspace");
  await dialog(page)
    .getByRole("button", { name: "Save reviewed move", exact: true })
    .click();
  await visibleError(page, "change could not be confirmed");
  await expect(account).toBeDisabled();
  await close(page);
  // Reopening must still recover the frozen original operation, even without reloading the target.
  await page.getByRole("button", { name: /^Cash sales/ }).click();
  await page
    .getByRole("button", { name: "Move workspace", exact: true })
    .click();
  await expect(dialog(page).getByLabel("Correct workspace")).toHaveValue(
    targetId,
  );
  await expect(
    dialog(page).getByLabel("Account that actually received or paid"),
  ).toHaveValue(accountValue!);
  await expect(
    dialog(page).getByLabel("Why was this filed incorrectly?"),
  ).toHaveValue("Recorded in the wrong workspace");
  await expect(dialog(page).getByRole("checkbox")).toBeChecked();
  await dialog(page)
    .getByRole("button", { name: "Retry original move", exact: true })
    .click();
  await expect(dialog(page)).toHaveCount(0);
  expect(requests).toHaveLength(3);
  expect(requests[1].key).not.toBe(requests[0].key);
  expect(requests[2]).toEqual(requests[1]);
  const workspace = (
    await (
      await page.request.get(`/api/workspaces?workspace=${targetId}`)
    ).json()
  ).workspace;
  expect(
    workspace.records.filter(
      (record: { description: string; removed: boolean }) =>
        record.description === "Cash sales" && !record.removed,
    ),
  ).toHaveLength(1);
});

test("an empty Plan has one useful entry and move summaries honor hidden amounts", async ({
  page,
}) => {
  await start(page);
  const emptyId = await addWorkspace(page, "Household", false);
  await page.getByRole("button", { name: "Hide amounts", exact: true }).click();
  await nav(page, "Records").click();
  // Hidden rows retain their reading order without exposing the original words.
  await page.locator("button[data-record-id]").first().click();
  await expect(dialog(page)).not.toContainText("GH₵");
  await page
    .getByRole("button", { name: "Move workspace", exact: true })
    .click();
  await expect(dialog(page)).not.toContainText("GH₵");
  await expect(dialog(page).locator("form > p").first()).toContainText("••••");
  await dialog(page).getByLabel("Correct workspace").selectOption(emptyId);
  await expect(
    dialog(page)
      .getByRole("status")
      .filter({ hasText: "There are no accounts" }),
  ).toBeVisible();
  await expect(
    dialog(page).getByRole("button", {
      name: "Save reviewed move",
      exact: true,
    }),
  ).toBeDisabled();
  await close(page);
  await page.getByRole("button", { name: "Show amounts", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Workspace, accounts and settings",
      exact: true,
    })
    .click();
  await dialog(page)
    .getByRole("button", { name: "Household · Personal", exact: true })
    .click();
  await nav(page, "Plan").click();
  await expect(
    page.getByText("Goals are optional.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit goals", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Add account", exact: true }).click();
  await expect(
    dialog(page).getByLabel("Account nickname", { exact: true }),
  ).toBeVisible();
  await dialog(page)
    .getByLabel("Account nickname", { exact: true })
    .fill("Household cash");
  await dialog(page)
    .getByRole("button", { name: "Add account", exact: true })
    .click();
  await expect(dialog(page)).toHaveCount(0);
  await page.getByRole("button", { name: "New goal", exact: true }).click();
  await expect(
    dialog(page).getByLabel("Goal name", { exact: true }),
  ).toBeVisible();
});
