import { test, expect } from "@playwright/test";
test("loads summary metadata and one authorised state without bulk refresh", async ({
  page,
  browser,
}) => {
  const reads: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "GET" && r.url().includes("/api/workspaces"))
      reads.push(new URL(r.url()).search);
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Try the synthetic demo" }).click();
  await expect(
    page.getByRole("heading", { name: "Let’s make sense of your money." }),
  ).toBeVisible();
  expect(reads).toContain("?view=summaries");
  expect(reads.some((query) => query.startsWith("?workspace="))).toBe(true);
  expect(reads).not.toContain("");
  const response = await page.request.get("/api/workspaces?view=summaries");
  const data = await response.json();
  expect(Object.keys(data.workspaces[0]).sort()).toEqual([
    "id",
    "name",
    "type",
    "version",
  ]);
  const id = data.workspaces[0].id;
  const state = await (
    await page.request.get(`/api/workspaces?workspace=${id}`)
  ).json();
  expect(state.workspace.id).toBe(id);
  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto("/");
  await otherPage
    .getByRole("button", { name: "Try the synthetic demo" })
    .click();
  expect(
    (await other.request.get(`/api/workspaces?workspace=${id}`)).status(),
  ).toBe(401);
  await other.close();
});
