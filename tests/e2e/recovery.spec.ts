import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

test("real local recovery link updates password and permits a fresh sign-in", async ({
  page,
}) => {
  let config: Record<string, string>;
  try {
    config = JSON.parse(
      (await readFile(".local/supabase-status.json", "utf8")).replace(
        /^\uFEFF/,
        "",
      ),
    );
  } catch {
    test.skip(true, "Local Supabase status required");
    return;
  }
  if (config.API_URL !== "http://127.0.0.1:58321")
    throw new Error("Recovery test only permits isolated local Supabase");
  const admin = createClient(config.API_URL, config.SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const email = `recovery-${crypto.randomUUID()}@example.test`;
  const password = "New-synthetic-password-2026!";
  const created = await admin.auth.admin.createUser({
    email,
    password: "Original-synthetic-password-2026!",
    email_confirm: true,
  });
  if (created.error)
    throw new Error("Could not create isolated recovery fixture");
  const link = await admin.auth.admin.generateLink({ type: "recovery", email });
  if (link.error) throw new Error("Could not generate isolated recovery link");
  await page.goto(
    `/auth/confirm?type=recovery&token_hash=${encodeURIComponent(link.data.properties.hashed_token)}`,
  );
  await expect(
    page.getByRole("button", { name: "Set new password" }),
  ).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Set new password" }).click();
  await expect(page.getByRole("status")).toContainText("Password updated");
  await page.context().clearCookies();
  await page.goto("/auth");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Sign in", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/app$/);
  expect((await page.request.get("/api/workspaces")).status()).toBe(200);
});
