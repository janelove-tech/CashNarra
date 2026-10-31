import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { event } from "../../src/domain/fixture";
import { openSampleWorkspace } from "./demo-entry";

test.use({ serviceWorkers: "block", screenshot: "only-on-failure" });

const visibleButton = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).filter({ visible: true });

async function reviewThreeRecords(page: Page, activityDate = "2026-10-14") {
  await openSampleWorkspace(page);
  let interpretations = 0;
  let saves = 0;
  await page.route("**/api/understand", (route) => {
    interpretations++;
    return route.fulfill({
      json: {
        events: [
          event("sale", "900.00", "Market sales", "cash", {
            date: "2026-10-14",
          }),
          event("expense", "80.00", "Packaging for market orders", "cash", {
            date: "2026-10-14",
          }),
          event(
            "receivable_payment",
            "150.00",
            "Abena market payment",
            "momo",
            {
              date: "2026-10-14",
              party: "Abena",
              obligationId: "opening-abena",
            },
          ),
        ],
        questions: [],
        calculations: [],
        explanation: "Fictional response for interface testing",
      },
    });
  });
  await page.route("**/api/workspaces", (route) => {
    const request = route.request();
    if (
      request.method() === "POST" &&
      request.postDataJSON()?.action === "batch"
    )
      saves++;
    return route.continue();
  });
  await page.getByLabel("Date of activity").fill(activityDate);
  const story =
    "On 14 Oct 2026, market sales were 900 cash, packaging cost 80 cash, and Abena paid 150 into MoMo.";
  await page.getByLabel("Your money story", { exact: true }).fill(story);
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(
    page.getByRole("heading", { name: "Check these 3 records" }),
  ).toBeVisible();
  return { story, interpretations: () => interpretations, saves: () => saves };
}

test("review preserves other records, previews the corrected balance and saves once", async ({
  page,
}) => {
  const calls = await reviewThreeRecords(page, "2026-10-13");
  const records = page.getByRole("group", { name: "Proposed records" });
  const effect = page.getByRole("region", { name: "After saving" });
  await expect(page.getByLabel("Review context")).toContainText(
    "Ama Works · Business · GHS",
  );
  await expect(page.getByLabel("Review context")).toContainText("14 Oct 2026");
  await expect(
    page
      .locator("details")
      .filter({ has: page.locator("summary", { hasText: "Your words" }) }),
  ).not.toHaveAttribute("open");
  await expect(effect).toContainText("Abena would owe you GH₵250.00");
  expect(calls.saves()).toBe(0);

  await records
    .getByRole("button", { name: "Change", exact: true })
    .nth(2)
    .click();
  await page.getByLabel("Amount · GHS", { exact: true }).fill("125.00");
  await page.getByLabel("Account", { exact: true }).selectOption("cash");
  await page.getByRole("button", { name: "Review this record" }).click();
  await expect(records).toContainText("Market sales");
  await expect(records).toContainText("Packaging for market orders");
  await expect(
    records.getByRole("button", { name: /Payment from Abena/ }),
  ).toContainText("Cash");
  await expect(effect).toContainText(
    "Abena would owe you GH₵275.00 on this balance",
  );
  await expect(effect).toContainText("Current recorded balance: GH₵400.00");
  expect(calls.interpretations()).toBe(1);
  expect(calls.saves()).toBe(0);

  await page.getByRole("button", { name: "Save 3 records" }).click();
  const saved = page.getByRole("region", { name: "Saved", exact: true });
  await expect(saved).toContainText("Saved 3 records for 14 Oct 2026");
  await expect(saved).toContainText(
    "Abena now owes you GH₵275.00 on this balance",
  );
  expect(calls.saves()).toBe(1);
  await saved.getByRole("button", { name: "Read the day’s story" }).click();
  await expect(
    page.getByRole("heading", { name: "Money Stories", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Story date")).toHaveValue("2026-10-14");
  await page.reload();
  await visibleButton(page, "Records").click();
  await page
    .getByLabel("Search records", { exact: true })
    .fill("Abena market payment");
  await expect(
    page.getByRole("button", { name: /Payment from Abena/ }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: /Payment from Abena/ }),
  ).toContainText("GH₵125.00");
});

test("source words are optional, retained for editing and hidden with private amounts", async ({
  page,
}) => {
  const calls = await reviewThreeRecords(page);
  await expect(page.getByText(calls.story, { exact: true })).toBeHidden();
  await page.getByText("Your words", { exact: true }).click();
  await expect(page.getByText(calls.story, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Hide amounts", exact: true }).click();
  await expect(page.getByText(calls.story, { exact: true })).toHaveCount(0);
  const effect = page.getByRole("region", { name: "After saving" });
  await expect(effect).not.toContainText("Abena");
  await expect(effect).not.toContainText("250.00");
  await page.getByRole("button", { name: "Change the words" }).click();
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue(calls.story);
  expect(calls.interpretations()).toBe(1);
  expect(calls.saves()).toBe(0);
});

for (const { width, dark } of [
  { width: 320, dark: false },
  { width: 390, dark: true },
  { width: 768, dark: false },
  { width: 1440, dark: true },
]) {
  test(`review and shared screens fit ${width}px ${dark ? "dark" : "light"}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 640 });
    await reviewThreeRecords(page);
    if (dark)
      await page
        .getByRole("button", { name: "Switch to dark appearance" })
        .click();
    const checkLayout = async (screen: string) => {
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      if (screen === "review" || screen === "settings") {
        const contrast = await new AxeBuilder({ page })
          .withRules(["color-contrast"])
          .analyze();
        expect(contrast.violations).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(`${screen}.png`),
          fullPage: true,
          animations: "disabled",
        });
      }
    };
    const save = page.getByRole("button", { name: "Save 3 records" });
    await save.scrollIntoViewIfNeeded();
    await expect(save).toBeInViewport();
    if (width < 760) {
      const saveBox = await save.boundingBox();
      const navBox = await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .filter({ visible: true })
        .boundingBox();
      expect(saveBox!.y + saveBox!.height).toBeLessThanOrEqual(navBox!.y);
    }
    await checkLayout("review");
    await page.getByRole("button", { name: "Discard draft" }).click();
    await page
      .getByRole("dialog", { name: "Discard this draft?" })
      .getByRole("button", { name: "Discard unsaved draft" })
      .click();
    await expect(
      page.getByRole("heading", { name: "What happened with your money?" }),
    ).toBeVisible();
    await checkLayout("home");
    await visibleButton(page, "Records").click();
    await expect(
      page.getByRole("heading", { name: "Your records", exact: true }),
    ).toBeVisible();
    await checkLayout("records");
    await visibleButton(
      page,
      width < 760 ? "Stories" : "Money Stories",
    ).click();
    await expect(
      page.getByRole("heading", { name: "Money Stories", exact: true }),
    ).toBeVisible();
    await checkLayout("stories");
    await visibleButton(page, "Plan").click();
    await expect(
      page.getByRole("heading", { name: "Your goals", exact: true }),
    ).toBeVisible();
    await checkLayout("plan");
    await page
      .getByRole("button", { name: "Workspace, accounts and settings" })
      .click();
    await page
      .getByRole("button", { name: "Settings and privacy", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Settings and privacy", exact: true }),
    ).toBeVisible();
    await checkLayout("settings");
  });
}

test("enlarged review keeps full amounts and the save action reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await reviewThreeRecords(page);
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  const save = page.getByRole("button", { name: "Save 3 records" });
  await save.scrollIntoViewIfNeeded();
  await expect(save).toBeInViewport();
  const overflow = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    elements: [...document.querySelectorAll("main *, header, nav")]
      .filter((node) => node.getBoundingClientRect().right > innerWidth + 1)
      .map((node) => ({
        tag: node.tagName,
        name: node.className,
        width: node.getBoundingClientRect().width,
      }))
      .slice(0, 12),
  }));
  expect(
    overflow.width <= overflow.viewport + 1,
    JSON.stringify(overflow),
  ).toBe(true);
});

test("a long description and the largest accepted amount stay readable on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await openSampleWorkspace(page);
  await expect(
    page.getByRole("heading", { name: "What happened with your money?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add a manual record" }).click();
  const description =
    "Packaging and delivery for the customer orders collected at the Saturday market";
  await page.getByLabel("Description", { exact: true }).fill(description);
  await page
    .getByLabel("Amount · GHS", { exact: true })
    .fill("123456789012345678.90");
  await page.getByRole("button", { name: "Review this record" }).click();
  const record = page.getByRole("group", { name: "Proposed records" });
  await expect(record).toContainText(description);
  await expect(record).toContainText("GH₵123,456,789,012,345,678.90");
  const title = await record.locator("strong").boundingBox();
  expect(title!.width).toBeGreaterThanOrEqual(120);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});

test("keyboard focus stays above the save bar on a short phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 380 });
  await reviewThreeRecords(page);
  await page
    .getByRole("button", { name: "Back to words", exact: true })
    .focus();
  for (let index = 0; index < 9; index++) {
    await page.keyboard.press("Tab");
    const focused = await page.locator(":focus").boundingBox();
    const header = await page.getByRole("banner").boundingBox();
    const footer = await page
      .getByRole("button", { name: "Save 3 records" })
      .locator("..")
      .boundingBox();
    expect(focused!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    expect(focused!.y + focused!.height).toBeLessThanOrEqual(footer!.y + 1);
  }
});

test("a story with several activity dates confirms and opens the actual saved range", async ({
  page,
}) => {
  await openSampleWorkspace(page);
  await page.route("**/api/understand", (route) =>
    route.fulfill({
      json: {
        events: [
          event("sale", "20.00", "Two-day market sale", "cash", {
            date: "2026-10-14",
          }),
          event("expense", "5.00", "Next-day delivery", "cash", {
            date: "2026-10-15",
          }),
        ],
        questions: [],
        calculations: [],
        explanation: "Fictional multi-day response",
      },
    }),
  );
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("I sold 20 cash on 14 October and paid 5 for delivery the next day.");
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(page.getByLabel("Review context")).toContainText(
    "Multiple activity dates",
  );
  await page.getByRole("button", { name: "Save 2 records" }).click();
  const saved = page.getByRole("region", { name: "Saved", exact: true });
  await expect(saved).toContainText(
    "Saved 2 records for 14 Oct 2026 – 15 Oct 2026",
  );
  await saved
    .getByRole("button", { name: "View activity for these dates" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your records", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("2 of 10 saved records shown", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Two-day market sale/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Next-day delivery/ }),
  ).toBeVisible();
});

test("several payments on one balance confirm its remaining amount once", async ({
  page,
}) => {
  await openSampleWorkspace(page);
  await page.route("**/api/understand", (route) =>
    route.fulfill({
      json: {
        events: ["50.00", "75.00"].map((amount, index) =>
          event(
            "receivable_payment",
            amount,
            `Abena payment ${index + 1}`,
            "cash",
            {
              party: "Abena",
              obligationId: "opening-abena",
              date: "2026-10-14",
            },
          ),
        ),
        questions: [],
        calculations: [],
        explanation: "Fictional separate payments",
      },
    }),
  );
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Abena paid 50 cash and then another 75 cash on 14 October.");
  await page.getByRole("button", { name: "Understand my story" }).click();
  await expect(
    page.getByRole("region", { name: "After saving" }),
  ).toContainText("GH₵275.00 on this balance");
  await page.getByRole("button", { name: "Save 2 records" }).click();
  const saved = page.getByRole("region", { name: "Saved", exact: true });
  await expect(
    saved.getByText("Abena now owes you GH₵275.00 on this balance.", {
      exact: true,
    }),
  ).toHaveCount(1);
});
