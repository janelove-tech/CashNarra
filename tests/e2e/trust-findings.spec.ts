import { test, expect, type Page } from "@playwright/test";
import { storyWindow } from "../../src/domain/periods";
import { openSampleWorkspace } from "./demo-entry";

async function demo(page: Page) {
  await page.goto("/");
  await openSampleWorkspace(page);
  await expect(
    page.getByRole("heading", { name: "What happened with your money?" }),
  ).toBeVisible();
}
function visible(page: Page, name: string) {
  return page
    .getByRole("button", { name, exact: true })
    .filter({ visible: true });
}

test("Today keeps its day when Money Stories changes period and date", async ({
  page,
}) => {
  await demo(page);
  await expect(
    page.getByRole("button", { name: /Money in · 13 Oct 2026/ }),
  ).toContainText("2,300.00");
  await visible(page, "Money Stories").click();
  await page.getByLabel("Story date").fill("2026-09-15");
  await page.getByLabel("Story period").selectOption("month");
  await expect(page.getByText("You owe on 30 Sep 2026")).toBeVisible();
  await visible(page, "Home").click();
  const day = page.getByRole("button", { name: /Money in · 13 Oct 2026/ });
  await expect(day).toContainText("2,300.00");
  await day.click();
  await expect(page.getByText("Showing 13 Oct 2026.")).toBeVisible();
  await expect(page.getByText("Cash sales")).toBeVisible();
  await expect(page.getByText("Abena opening balance")).toHaveCount(0);
});

test("an open month says so far and separates later dates", async ({
  page,
}) => {
  await demo(page);
  await visible(page, "Money Stories").click();
  await page.getByLabel("Story date").fill("2026-10-19");
  await page.getByLabel("Story period").selectOption("month");
  const today = new Date().toISOString().slice(0, 10);
  const view = storyWindow("2026-10-19", "month", today);
  await expect(
    page.locator("main small").filter({ hasText: view.heading }),
  ).toBeVisible();
  if (view.status === "so-far") {
    await expect(page.getByText("You owe on 31 Oct 2026")).toHaveCount(0);
    await expect(page.getByText(view.oweLabel!)).toBeVisible();
    await expect(
      page.getByText(
        `No saved records are dated after ${view.heading.split("through ")[1]}`,
      ),
    ).toBeVisible();
  } else {
    await expect(page.getByText(view.oweLabel!)).toBeVisible();
  }
  await visible(page, "Home").click();
  await expect(
    page.getByRole("button", { name: /Money in · 13 Oct 2026/ }),
  ).toContainText("2,300.00");
});

test("Today’s story field keeps the words and explains transcription first", async ({
  page,
}) => {
  await demo(page);
  await expect(
    page.getByText(
      "Transcription is not available yet. Type here, or record and type the words yourself.",
    ),
  ).toBeVisible();
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Synthetic composer note");
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue("Synthetic composer note");
  await visible(page, "Home").click();
  await page.getByRole("button", { name: "Speak", exact: true }).click();
  await expect(
    page.getByText("Voice is not available yet. You can type your story."),
  ).toBeVisible();
  await expect(page.getByText(/Ready · 0 \/ \d+ seconds/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start recording", exact: true }),
  ).toBeVisible();
});

test("a saved story does not stay saved on a new empty story", async ({
  page,
}) => {
  await demo(page);
  await page.getByRole("button", { name: "Add a manual record" }).click();
  await page
    .getByLabel("Description", { exact: true })
    .fill("Synthetic trust receipt");
  await page.getByLabel("Amount · GHS", { exact: true }).fill("3.00");
  await page.getByRole("button", { name: "Review this record" }).click();
  await page.getByRole("button", { name: "Save this record" }).click();
  await expect(page.getByRole("status")).toContainText("records confirmed");
  await visible(page, "Home").click();
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue("");
  await expect(
    page.getByRole("status").filter({ hasText: "Saved" }),
  ).toHaveCount(0);
});

test("a day with no records does not show zero money movement", async ({
  page,
}) => {
  await demo(page);
  await page.locator("#today-date").fill("2026-10-12");
  await expect(
    page.getByText(
      "No records for this day. That does not mean nothing happened.",
    ),
  ).toBeVisible();
  const moneyIn = page.getByRole("button", { name: /Money in · 12 Oct 2026/ });
  await expect(moneyIn).toContainText("No records for this day");
  await expect(moneyIn).not.toContainText("GH₵0.00");
  await expect(page.getByText("Not recorded").first()).toBeVisible();
  await page.locator("#today-date").fill("2026-10-13");
  await expect(
    page.getByRole("button", { name: /Money in · 13 Oct 2026/ }),
  ).toContainText("GH₵");
});
