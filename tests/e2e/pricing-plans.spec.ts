import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1280]) {
  test(`compares the offer and voice/report limits at ${width}px without charging`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 640 });
    await page.goto("/pricing");
    const free = page
      .locator("article")
      .filter({
        has: page.getByRole("heading", { name: "Free", exact: true }),
      });
    const plus = page
      .locator("article")
      .filter({
        has: page.getByRole("heading", { name: "Plus", exact: true }),
      });
    await expect(
      free.getByText("30 AI stories a month", { exact: true }),
    ).toBeVisible();
    await expect(
      plus.getByText("300 AI stories a month", { exact: true }),
    ).toBeVisible();
    await expect(
      free.getByText("3 voice notes a day, up to 1 minute each", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      plus.getByText("3 voice notes a day, up to 2 minutes each", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      free.getByText("2 PDF/Excel report packs a month", { exact: true }),
    ).toBeVisible();
    await expect(
      plus.getByText("30 PDF/Excel report packs a month", { exact: true }),
    ).toBeVisible();
    await expect(
      free.getByText("Unlimited CSV downloads", { exact: true }),
    ).toBeVisible();
    await expect(
      plus.getByText("Unlimited CSV downloads", { exact: true }),
    ).toBeVisible();
    await expect(plus.getByText("$4.00", { exact: true })).toHaveCSS(
      "text-decoration-line",
      "line-through",
    );
    await expect(plus).toContainText("$2.99");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
    await plus.getByRole("link", { name: "Choose Plus", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Review Plus", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.getByRole("status")).toContainText(
      "Plus is not started.",
    );
  });
}

test("the public landing retains the regular price while app pricing offers the discount", async ({
  page,
}) => {
  await page.goto("/");
  const pricing = page.getByRole("region", {
    name: "Start free. Choose Plus when you need more.",
    exact: true,
  });
  await expect(pricing).toContainText("$4.00");
  await expect(pricing).not.toContainText("$2.99");
  await expect(pricing).not.toContainText("$0.99");
  await page.goto("/pricing");
  await expect(page.getByRole("main")).toContainText("$2.99");
});
