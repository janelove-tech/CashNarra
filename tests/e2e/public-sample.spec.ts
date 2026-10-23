import { expect, test } from "@playwright/test";

test("public sample stays in the browser and does not open a demo session", async ({
  page,
}) => {
  const demoCalls: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/demo") || request.url().includes("/api/understand"))
      demoCalls.push(request.url());
  });
  page.on("request", (request) => {
    if (request.url().includes("/api/transcribe")) demoCalls.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Say what happened. Know where you stand.",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try an example" }).focus();
  await page.keyboard.press("Enter");
  const reveal = page.getByRole("button", { name: "See the records" });
  await expect(reveal).toBeFocused();
  await expect(reveal).toHaveCSS("outline-style", "solid");
  await expect(page.getByText("Cash sale", { exact: true })).toHaveCount(0);
  await reveal.click();
  const sample = page.getByRole("article", { name: "Fictional example" });
  await expect(sample.getByText("Cash sale", { exact: true })).toBeVisible();
  await expect(sample.getByText("It is not a new sale.")).toBeVisible();
  await expect(sample.getByText("Sales stay GH₵900.00.")).toBeVisible();
  await expect(sample.getByText("GH₵1,100.00")).toBeVisible();
  await expect(sample.getByText("GH₵1,020.00")).toBeVisible();
  await page.getByRole("button", { name: "Try a missing detail" }).click();
  await expect(
    page.getByText("Choose the delivery account before this example shows a money total."),
  ).toBeVisible();
  await expect(sample.getByText("GH₵1,020.00")).toHaveCount(0);
  await page.getByRole("button", { name: "MoMo", exact: true }).click();
  await expect(sample.getByText("MoMo · Payment for delivery")).toBeVisible();
  await expect(sample.getByText("GH₵1,020.00")).toBeVisible();
  await page.getByRole("button", { name: "Reset the story example" }).click();
  await expect(page.getByText("Cash sale", { exact: true })).toHaveCount(0);
  await expect(reveal).toBeFocused();
  await reveal.click();
  await sample.getByRole("link", { name: "Start free" }).click();
  await expect(page).toHaveURL(/\/auth\?mode=signup/);
  await expect(
    page.getByRole("heading", { name: "Start your money records." }),
  ).toBeVisible();
  await expect(page.getByText("At least 8 characters.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open records" })).toHaveCount(0);
  expect(demoCalls).toEqual([]);
});

test("Choose Plus opens the review and does not start Plus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Choose Plus" }).click();
  await expect(page).toHaveURL(/\/pricing\/plus/);
  await expect(page.getByRole("heading", { name: "Review Plus" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText(
      "Plus is not started. Payment is not connected, so your Free plan stays as it is.",
    ),
  ).toBeVisible();
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
