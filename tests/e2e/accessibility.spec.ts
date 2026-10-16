import { test, expect } from "@playwright/test";
test("record errors are associated and focusable; dialog stays keyboard-contained under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Try the synthetic demo" }).click();
  await page
    .getByRole("button", { name: "Tell your story", exact: true })
    .click();
  await page.getByRole("button", { name: "Add a manual record" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Description", { exact: true })
    .fill("Synthetic expense");
  const amount = dialog.getByLabel("Amount · GHS", { exact: true });
  await amount.fill("abc");
  await dialog.getByRole("button", { name: "Review this record" }).click();
  const error = dialog.getByRole("alert");
  await expect(error).toBeFocused();
  await expect(amount).toHaveAttribute("aria-invalid", "true");
  expect(await amount.getAttribute("aria-describedby")).toBe(
    await error.getAttribute("id"),
  );
  await amount.fill("10.00");
  await expect(amount).not.toHaveAttribute("aria-invalid", "true");
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  expect(
    await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
  const close = dialog.getByRole("button", { name: "Close dialog" });
  const box = await close.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(
    await close.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  const opener = page.getByRole("button", { name: "Add a manual record" });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});
