import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

async function contrast(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  const result = await new AxeBuilder({ page })
    .withRules(["color-contrast"])
    .analyze();
  await test.info().attach(name, {
    body: JSON.stringify(result, null, 2),
    contentType: "application/json",
  });
  expect(result.violations, `${name}: measured text contrast`).toEqual([]);
  console.log(
    JSON.stringify({
      view: name,
      measuredNodes: result.passes.flatMap((rule) => rule.nodes).length,
      manualReview: result.incomplete.flatMap((rule) =>
        rule.nodes.map((node) => ({
          target: node.target,
          reason: node.failureSummary,
        })),
      ),
    }),
  );
  // Incomplete results remain in the report for manual review, never a PASS.
}

for (const width of [390, 1440]) {
  for (const theme of ["light", "dark"]) {
    test(`text contrast at ${width}px in ${theme} appearance`, async ({
      page,
    }) => {
      test.setTimeout(120000);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/");
      await contrast(page, "landing");
      await page
        .getByRole("button", { name: "Explore with sample data" })
        .click();
      await expect(
        page.getByRole("button", { name: /Recorded account balances/ }),
      ).toContainText("5,970.00");
      if (theme === "dark") {
        await page
          .getByRole("button", { name: "Switch to dark appearance" })
          .click();
      }
      await contrast(page, "today");
      for (const name of [
        "Records",
        width < 760 ? "Stories" : "Money Stories",
        "Plan",
      ]) {
        await page
          .getByRole("button", { name, exact: true })
          .filter({ visible: true })
          .click();
        await contrast(page, name);
      }
      await page
        .getByRole("button", { name: "Today", exact: true })
        .filter({ visible: true })
        .click();
      await page
        .getByRole("button", { name: "Tell your story", exact: true })
        .click();
      await contrast(page, "narration");
      await page.getByRole("button", { name: "Add a manual record" }).click();
      await contrast(page, "manual record dialog");
    });
  }
}
