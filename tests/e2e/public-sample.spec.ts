import { expect, test } from "@playwright/test";

test("public sample stays in the browser and does not open a demo session", async ({
  page,
}) => {
  const demoCalls: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/demo") || request.url().includes("/api/understand"))
      demoCalls.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Tell us what happened with your money. We’ll help you make sense of it.",
    }),
  ).toBeVisible();
  const sample = page.getByRole("article");
  await expect(sample.getByText("Cash sale", { exact: true })).toBeVisible();
  await expect(sample.getByText("not a new sale").first()).toBeVisible();
  await expect(sample.getByText("Net movement GH₵1,020.00")).toBeVisible();
  await page.getByRole("button", { name: "Try a trickier story" }).click();
  await expect(
    page.getByText("Choose the delivery account before this example shows a money total."),
  ).toBeVisible();
  await page.getByRole("button", { name: "MoMo", exact: true }).click();
  await expect(page.getByText("Payment for delivery · MoMo")).toBeVisible();
  await expect(page.getByText("Net movement GH₵1,020.00")).toBeVisible();
  await page.getByRole("link", { name: "Record my own story" }).click();
  await expect(page).toHaveURL(/\/auth\?mode=signup/);
  await expect(
    page.getByRole("heading", { name: "Start your money records." }),
  ).toBeVisible();
  await expect(page.getByText("At least 8 characters.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open records" })).toHaveCount(0);
  expect(demoCalls).toEqual([]);
});

test("sign-in keeps one primary action and a nearby password reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: "Sign in." })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Forgot password?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("button", { name: "Send recovery email" }),
  ).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toHaveCount(0);
});
