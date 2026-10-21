import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
test("real local Supabase login, workspace, unknown account, opening obligation and logout", async ({
  page,
}) => {
  let credentials: { email: string; password: string };
  try {
    credentials = JSON.parse(
      await readFile(".local/auth-test-user.json", "utf8"),
    );
  } catch {
    test.skip(true, "Run npm run test:supabase against local Supabase first.");
    return;
  }
  const workspaceName = "Personal test " + crypto.randomUUID().slice(0, 8);
  await page.goto("/auth");
  await page.getByLabel("Email", { exact: true }).fill(credentials.email);
  await page.getByLabel("Password", { exact: true }).fill(credentials.password);
  await page
    .getByRole("button", { name: "Sign in", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Let’s make sense of your money." }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Synthetic demo · fictional Ama Works data · no real AI calls",
    ),
  ).not.toBeVisible();
  await page
    .getByRole("button", { name: "Workspace, accounts and settings" })
    .click();
  await page.getByLabel("Name", { exact: true }).fill(workspaceName);
  await page.getByLabel("Use", { exact: true }).selectOption("Personal");
  await page
    .getByRole("button", { name: "Create workspace", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Workspace, accounts and settings" })
    .click();
  await page
    .getByRole("button", { name: workspaceName + " · Personal", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Workspace, accounts and settings" })
    .click();
  await page.getByRole("button", { name: "Manage accounts" }).click();
  await page.getByRole("button", { name: "Add account", exact: true }).click();
  await page.getByLabel("Account nickname").fill("Personal cash");
  await page.getByLabel("I don’t know the starting balance yet").check();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Add account" })
    .click();
  await expect(
    page.getByText("Unknown", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Check starting balance" }).click();
  await page
    .getByLabel("Correct amount · GHS (blank if unknown)")
    .fill("100.00");
  await page
    .getByLabel("Reason for this correction")
    .fill("Counted opening cash");
  await page.getByRole("button", { name: "Save starting balance" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByText("GH₵100.00", { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Records", exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole("button", { name: "Add a balance from before CashNarra" })
    .click();
  await page.getByLabel("Amount · GHS", { exact: true }).fill("20.00");
  await page
    .getByLabel("Person or business (when money is owed)")
    .fill("Synthetic friend");
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  await page
    .getByRole("button", { name: "Records", exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  const snapshot = await (await page.request.get("/api/workspaces")).json();
  const personal = snapshot.workspaces.find(
    (w: { name: string }) => w.name === workspaceName,
  );
  expect(
    personal.records.filter((r: { kind: string }) => r.kind === "sale"),
  ).toHaveLength(0);
  expect(
    personal.records.filter(
      (r: { kind: string }) => r.kind === "receivable_payment",
    ),
  ).toHaveLength(1);
  await page
    .getByRole("button", { name: "Settings and privacy", exact: true })
    .click();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page
    .getByRole("button", { name: "Erase local drafts and sign out" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Tell us what happened with your money. We’ll help you make sense of it.",
    }),
  ).toBeVisible();
  const privateData = await page.request.get("/api/workspaces");
  expect(privateData.status()).toBe(401);
});
