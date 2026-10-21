import { expect, type Page } from "@playwright/test";

/** Opens the local fictional workspace. The public page does not call this route. */
export async function openSampleWorkspace(page: Page) {
  if (!page.url().startsWith("http"))
    await page.goto("http://127.0.0.1:3100/");
  const status = await page.evaluate(async () => {
    const response = await fetch("/api/demo", { method: "POST" });
    return response.status;
  });
  expect(status).toBe(200);
  await page.goto(`${new URL(page.url()).origin}/app`);
}
