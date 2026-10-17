import { test, expect, type Page } from "@playwright/test";

async function measure(page: Page, view: string) {
  // Measure settled states, not a partial theme/hover background transition.
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  const measurements = await page.evaluate(() => {
    type RGB = number[];
    function color(value: string): RGB {
      const parts = value.match(/[\d.]+/g)?.map(Number);
      if (!parts || parts.length < 3)
        throw new Error(`Unsupported CSS color: ${value}`);
      return parts;
    }
    function background(el: Element | null): RGB {
      if (!el) return [255, 255, 255];
      const style = getComputedStyle(el);
      if (style.backgroundImage !== "none")
        throw new Error("Gradient requires manual measurement");
      const rgb = color(style.backgroundColor);
      const alpha = rgb[3] ?? 1;
      const behind = alpha < 1 ? background(el.parentElement) : rgb;
      return rgb.slice(0, 3).map((v, i) => alpha * v + (1 - alpha) * behind[i]);
    }
    function ratio(fg: RGB, bg: RGB) {
      if (fg.length > 3 && fg[3] !== 1)
        throw new Error("Transparent indicator requires manual measurement");
      const luminance = (rgb: RGB) =>
        rgb
          .slice(0, 3)
          .map((v) => {
            const c = v / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
      const a = luminance(fg),
        b = luminance(bg);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }
    const visible = (el: Element) =>
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden";
    const result: { kind: string; label: string; ratio: number }[] = [];
    for (const el of document.querySelectorAll(
      "input:not([type=checkbox]):not([type=hidden]), textarea, select",
    )) {
      if (!visible(el) || el.matches(":disabled")) continue;
      const s = getComputedStyle(el);
      if (parseFloat(s.borderTopWidth) < 1)
        throw new Error("Field has no measurable boundary");
      const border = color(s.borderTopColor);
      result.push({
        kind: "field inside",
        label: el.id,
        ratio: ratio(border, background(el)),
      });
      result.push({
        kind: "field outside",
        label: el.id,
        ratio: ratio(border, background(el.parentElement)),
      });
    }
    for (const el of document.querySelectorAll("button:not(:disabled) svg")) {
      if (!visible(el)) continue;
      const s = getComputedStyle(el);
      if (s.stroke === "none") continue;
      result.push({
        kind: "button icon",
        label:
          el.closest("button")?.getAttribute("aria-label") ?? "labelled button",
        ratio: ratio(color(s.stroke), background(el)),
      });
    }
    const focused = document.activeElement;
    if (focused && focused.matches(":focus-visible")) {
      const s = getComputedStyle(focused);
      if (s.outlineStyle === "none" || parseFloat(s.outlineWidth) < 2)
        throw new Error("Missing visible focus outline");
      result.push({
        kind: "focus",
        label: focused.tagName,
        ratio: ratio(color(s.outlineColor), background(focused.parentElement)),
      });
    }
    return result;
  });
  await test.info().attach(view, {
    body: JSON.stringify(measurements, null, 2),
    contentType: "application/json",
  });
  expect(measurements.length).toBeGreaterThan(0);
  for (const m of measurements)
    expect(m.ratio, `${view}: ${m.kind} ${m.label}`).toBeGreaterThanOrEqual(3);
  return measurements;
}

for (const width of [320, 390, 768, 1440])
  for (const theme of ["light", "dark"]) {
    test(`non-text controls ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/");
      await page
        .getByRole("button", { name: "Try the synthetic demo" })
        .click();
      await expect(
        page.getByRole("button", { name: /Recorded account balances/ }),
      ).toContainText("5,970.00");
      if (theme === "dark")
        await page
          .getByRole("button", { name: "Switch to dark appearance" })
          .click();
      await measure(page, "today icons");
      for (const name of [
        "Records",
        width < 760 ? "Stories" : "Money Stories",
        "Plan",
      ]) {
        await page
          .getByRole("button", { name, exact: true })
          .filter({ visible: true })
          .click();
        await measure(page, `${name} fields and icons`);
      }
      await page
        .getByRole("button", { name: "Today", exact: true })
        .filter({ visible: true })
        .focus();
      await page.keyboard.press("Enter");
      await page
        .getByRole("button", { name: "Tell your story", exact: true })
        .click();
      await measure(page, "narration fields and icons");
      await page.getByRole("button", { name: "Add a manual record" }).click();
      await page.keyboard.press("Tab");
      const dialog = await measure(page, "record fields and keyboard focus");
      expect(dialog.some((m) => m.kind === "focus")).toBe(true);
    });
  }
