import { test, expect } from "@playwright/test";
import { openSampleWorkspace } from "./demo-entry";
test("planning dialog stays usable at narrow widths in both appearances", async ({
  page,
}) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  for (const dark of [false, true]) {
    if (dark)
      await page
        .getByRole("button", { name: "Switch to dark appearance" })
        .click();
    await page
      .getByRole("button", { name: "Settings and privacy", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Edit people and dates" })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "People, due dates and goals",
    });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(dialog.getByLabel("Find a saved person")).toBeVisible();
      expect(
        await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/planning-${width}-${dark ? "dark" : "light"}.png`,
      });
    }
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  }
});
test("private draft download restores words without posting records", async ({
  page,
}) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  await page
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Unfinished private story");
  // Backup and restore sit behind the Draft backup control.
  await page.getByText("Draft backup", { exact: true }).click();
  await page
    .getByText("Back up or restore this unfinished story", { exact: true })
    .click();
  const downloading = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download complete draft", exact: true })
    .click();
  const file = await downloading;
  const path = await file.path();
  expect(path).toBeTruthy();
  const before = await (await page.request.get("/api/workspaces")).json();
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Later words");
  await page.getByLabel("Restore a private draft file").setInputFiles(path!);
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue("Later words");
  await page
    .getByRole("button", { name: "Keep my current story", exact: true })
    .click();
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue("Later words");
  await page.getByLabel("Restore a private draft file").setInputFiles(path!);
  await page
    .getByLabel("Your money story", { exact: true })
    .fill("Newest words");
  await expect(
    page.getByRole("button", {
      name: "Replace my unfinished story",
      exact: true,
    }),
  ).toBeDisabled();
  await page.getByLabel("Restore a private draft file").setInputFiles(path!);
  await page
    .getByRole("button", { name: "Replace my unfinished story", exact: true })
    .click();
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toHaveValue("Unfinished private story");
  await expect(page.getByRole("status")).toContainText("Draft restored");
  expect(await (await page.request.get("/api/workspaces")).json()).toEqual(
    before,
  );
});
test("people, goal changes, payment dates, preferences and check-in history are saved", async ({
  page,
}) => {
  await page.goto("/");
  await openSampleWorkspace(page);
  await page
    .getByRole("button", { name: "Settings and privacy", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Edit people and dates" })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "People, due dates and goals",
  });
  await dialog.getByLabel("Name or nickname").fill("Kofi");
  await dialog
    .getByRole("button", { name: "Save person", exact: true })
    .click();
  await expect(dialog.getByText("Kofi · Customer")).toBeVisible();
  await dialog.getByLabel("Find a saved person").fill("Nobody");
  await expect(
    dialog.getByText("No saved people match that name."),
  ).toBeVisible();
  await dialog.getByLabel("Find a saved person").fill("kofi");
  await expect(dialog.getByText("Kofi · Customer")).toBeVisible();
  await dialog.getByLabel("Find a saved person").clear();
  await dialog.getByLabel("Goal name", { exact: true }).fill("Shop equipment");
  await dialog.getByLabel("Target · GHS", { exact: true }).fill("6500.00");
  await dialog
    .getByRole("button", { name: "Update goal", exact: true })
    .click();
  await dialog.getByLabel(/Abena/).fill("2026-10-30");
  await dialog
    .getByRole("button", { name: "Save payment date" })
    .first()
    .click();
  await dialog.getByLabel("Show my recording rhythm").uncheck();
  await dialog.getByLabel(/Show a gentle reminder/).check();
  await dialog
    .getByRole("button", { name: "Save check-in preferences" })
    .click();
  await expect(page.getByRole("status")).toContainText("Saved");
  let w = (await (await page.request.get("/api/workspaces")).json())
    .workspaces[0];
  expect(w.contacts[0].name).toBe("Kofi");
  await dialog.getByText("Edit Kofi", { exact: true }).click();
  await dialog.getByLabel("Saved name", { exact: true }).fill("Kofi shop");
  await dialog
    .getByRole("button", { name: "Update saved person", exact: true })
    .click();
  await expect(
    dialog.getByText("Edit Kofi shop", { exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole("button", {
      name: "Remove Kofi shop from suggestions",
      exact: true,
    })
    .click();
  await expect(dialog.getByText("Edit Kofi shop", { exact: true })).toHaveCount(
    0,
  );
  const withoutContact = (
    await (await page.request.get("/api/workspaces")).json()
  ).workspaces[0];
  expect(withoutContact.contacts).toEqual([]);
  expect(withoutContact.records).toEqual(w.records);
  expect(w.goals[0].target).toBe("6500.00");
  expect(w.goalChanges).toHaveLength(1);
  expect(w.preferences.showRhythm).toBe(false);
  expect(w.debtDates[0].date).toBe("2026-10-30");
  await dialog.getByText("Previous payment dates", { exact: true }).click();
  await expect(dialog.getByText(/Payment date: 2026-10-30/)).toBeVisible();
  await dialog
    .getByRole("button", { name: "Clear payment date for Abena", exact: true })
    .click();
  await expect(dialog.getByLabel(/Abena/)).toHaveValue("");
  await expect(
    dialog.getByText("Payment date cleared", { exact: false }),
  ).toBeVisible();
  await dialog
    .getByText("How we worked this out", { exact: true })
    .click();
  await expect(dialog.getByText(/2026-09 ·.*marked · Checked/)).toBeVisible();
  await dialog
    .getByRole("button", { name: "Check 2026-09 again", exact: true })
    .click();
  await expect(
    dialog.getByRole("button", { name: "Check 2026-09 again", exact: true }),
  ).toHaveCount(0);
  const recheck = (await (await page.request.get("/api/workspaces")).json())
    .workspaces[0];
  expect(recheck.goals[0].reviewedMonths).not.toContain("2026-09");
  expect(recheck.goals[0].allocations).toEqual(w.goals[0].allocations);
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Choose a day", exact: true }).click();
  await page.getByLabel("Date", { exact: true }).fill("2026-10-12");
  await page.getByLabel("What would you like to mark?").selectOption("rest");
  await page
    .getByRole("button", { name: "Record check-in", exact: true })
    .click();
  w = (await (await page.request.get("/api/workspaces")).json()).workspaces[0];
  expect(
    w.checkinHistory.filter((c: { date: string }) => c.date === "2026-10-12"),
  ).toHaveLength(2);
});
