import { test, expect } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";
test("recovery callback is private and invalid links give a usable recovery path", async ({
  page,
}) => {
  const response = await page.request.get(
    "/auth/confirm?token_hash=invalid&type=recovery",
    { maxRedirects: 0 },
  );
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["referrer-policy"]).toBe("no-referrer");
  await page.goto("/auth?link_error=1");
  await expect(page.getByRole("status")).toContainText("expired");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("button", { name: "Send recovery email" }),
  ).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toHaveCount(0);
});
test("privacy requests are visible and repeat submissions do not queue duplicates", async ({
  page,
}) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  await page.getByRole("button", { name: "Workspace, accounts and settings" }).click();
  await page
    .getByRole("button", { name: "Settings and privacy", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Request a copy of my data", exact: true })
    .click();
  await expect(page.getByText(/access request · pending review/)).toBeVisible();
  await page
    .getByRole("button", { name: "Request a copy of my data", exact: true })
    .click();
  await expect(page.getByText(/already awaiting review/)).toBeVisible();
  expect(
    (await (await page.request.get("/api/workspaces")).json()).workspaces[0]
      .requests,
  ).toHaveLength(1);
});
test("masked report evidence remains named and keyboard-operable", async ({
  page,
}) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  await page
    .getByRole("button", { name: "Money Stories", exact: true })
    .filter({ visible: true })
    .click();
  await page.getByRole("button", { name: "Hide amounts", exact: true }).click();
  const evidence = page
    .getByRole("button", { name: "Open evidence for hidden amount" })
    .first();
  await evidence.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Behind these figures" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(evidence).toBeFocused();
});
