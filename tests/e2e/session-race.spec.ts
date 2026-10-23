import { test, expect } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";
test("late processing cannot restore private review after cross-tab sign-out", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let started!: () => void;
  const arrived = new Promise<void>((resolve) => {
    started = resolve;
  });
  await page.route("**/api/understand", async (route) => {
    started();
    await held;
    await route.fulfill({
      json: { events: [], questions: [], explanation: "Late private result" },
    });
  });
  await page.locator("textarea").first().fill("Synthetic delayed narrative");
  await page
    .getByRole("button", { name: "Understand my story", exact: true })
    .click();
  await arrived;
  const other = await context.newPage();
  await other.goto("/");
  await other.evaluate(() => {
    const channel = new BroadcastChannel("cashnarra-session");
    channel.postMessage("signed-out");
    channel.close();
  });
  await expect(page.getByRole("status")).toContainText(
    "Signed out in another tab",
  );
  const response = page.waitForResponse("**/api/understand");
  release();
  await response;
  await expect(
    page.getByText("Understood · Ready to review", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Synthetic delayed narrative", { exact: true }),
  ).toHaveCount(0);
});
