import { test, expect } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";

// Everyday phone use: the bar, the Back gesture, the address, drafts and
// the installed-app foundation. Emulated in headless Edge; a real phone is
// separate evidence and stays recorded as such in the build log.
test.use({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true });

test("the phone bar reaches every destination, Tell lands in the story box, and Back walks the same history", async ({
  page,
}) => {
  await openSampleWorkspace(page);
  await expect(page).toHaveURL(/\/app$/);
  const bar = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(bar.getByRole("button")).toHaveText([
    /Home/,
    /Records/,
    /Tell/,
    /Stories/,
    /Plan/,
  ]);
  await bar.getByRole("button", { name: "Records", exact: true }).click();
  await expect(page).toHaveURL(/\/app\?view=records$/);
  await expect(page.getByRole("heading", { name: "Your records" })).toBeVisible();
  await bar.getByRole("button", { name: "Tell what happened" }).click();
  await expect(page.getByLabel("Your money story")).toBeFocused();
  await expect(page).toHaveURL(/\/app$/);
  // Nothing was saved by tapping Tell.
  await expect(page.getByText("Nothing recorded yet")).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Your records" })).toBeVisible();
  await expect(page).toHaveURL(/view=records/);
  // A view in the address survives a refresh for the signed-in workspace.
  await page.goto("/app?view=people");
  await expect(
    page.getByRole("heading", { name: "People & balances" }),
  ).toBeVisible();
  // A dialog has its own history entry: Back and Escape both close it.
  const menu = page.getByRole("button", { name: "Workspace, accounts and settings" });
  await menu.click();
  await expect(page.getByRole("dialog", { name: "Your account" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/view=people/);
  await menu.click();
  await expect(page.getByRole("dialog", { name: "Your account" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(menu).toBeFocused();
  // Back never discards a draft; it only changes what is on screen.
  await bar.getByRole("button", { name: "Tell what happened" }).click();
  await page.getByLabel("Your money story").fill("Sold 900 cash today");
  await bar.getByRole("button", { name: "Plan", exact: true }).click();
  await expect(page).toHaveURL(/view=plan/);
  await page.goBack();
  await expect(page.getByLabel("Your money story")).toHaveValue(
    "Sold 900 cash today",
  );
  await expect(page.getByRole("button", { name: "Understand my story" })).toBeEnabled();
});

test("a short phone keeps the story actions and the bar reachable without overlap", async ({
  page,
}) => {
  await openSampleWorkspace(page);
  await page.setViewportSize({ width: 360, height: 380 });
  await page.getByLabel("Your money story").focus();
  const understand = page.getByRole("button", { name: "Understand my story" });
  await understand.scrollIntoViewIfNeeded();
  const action = await understand.boundingBox();
  const bar = await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .boundingBox();
  expect(action && bar && action.y + action.height <= bar.y).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test("the installed-app foundation: manifest, viewport, worker and the offline page", async ({
  page,
  context,
}) => {
  await openSampleWorkspace(page);
  const manifest = await (await page.request.get("/manifest.webmanifest")).json();
  expect(manifest).toMatchObject({
    id: "/app",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    theme_color: "#5B49C7",
  });
  expect(
    manifest.icons.filter((i: { purpose?: string }) => i.purpose === "maskable"),
  ).toHaveLength(2);
  expect(manifest.shortcuts.map((s: { url: string }) => s.url)).toEqual([
    "/app?compose=1",
    "/app?view=records",
  ]);
  await expect(page.locator("meta[name=viewport]")).toHaveAttribute(
    "content",
    /viewport-fit=cover/,
  );
  await expect(page.locator("meta[name=viewport]")).toHaveAttribute(
    "content",
    /interactive-widget=resizes-content/,
  );
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.goto("/app?view=stories").catch(() => {});
  await expect(
    page.getByRole("heading", { name: "You’re offline right now." }),
  ).toBeVisible();
  await expect(page.getByText(/Nothing has been saved or lost/)).toBeVisible();
  // The stylesheet is not cached. The link colour has to come from the document.
  await expect(page.getByRole("link", { name: "Try again" })).toHaveCSS(
    "background-color",
    "rgb(91, 73, 199)",
  );
  await context.setOffline(false);
  await page.goto("/app?compose=1");
  await expect(page.getByLabel("Your money story")).toBeFocused();
  await expect(page).toHaveURL(/\/app$/);
});
