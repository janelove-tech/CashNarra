import { chromium, test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

for (const theme of ["light", "dark"]) {
  test(`200% browser zoom retains narration, review and keyboard access in ${theme}`, async () => {
    const profile = test.info().outputPath("zoom-profile");
    await mkdir(join(profile, "Default"), { recursive: true });
    await writeFile(
      join(profile, "Default", "Preferences"),
      JSON.stringify({
        partition: { default_zoom_level: { x: Math.log(2) / Math.log(1.2) } },
      }),
    );
    const context = await chromium.launchPersistentContext(profile, {
      channel: "msedge",
      headless: true,
      viewport: null,
      args: ["--window-size=1440,1000", "--force-device-scale-factor=1"],
    });
    try {
      const page = await context.newPage();
      await page.goto("http://127.0.0.1:3100/");
      // Verify real browser layout zoom, not CSS zoom or pinch magnification.
      const metrics = await page.evaluate(() => ({
        ratio: devicePixelRatio,
        inner: innerWidth,
        outer: outerWidth,
      }));
      expect(metrics.ratio).toBeCloseTo(2, 1);
      // Browser chrome/scrollbars occupy some outer-window pixels.
      expect(metrics.inner / metrics.outer).toBeGreaterThan(0.45);
      expect(metrics.inner / metrics.outer).toBeLessThanOrEqual(0.5);
      await test.info().attach("verified-browser-zoom", {
        body: JSON.stringify(metrics),
        contentType: "application/json",
      });
      await page
        .getByRole("button", { name: "Explore with sample data" })
        .click();
      await expect(
        page.getByRole("button", { name: /Recorded account balances/ }),
      ).toContainText("5,970.00");
      if (theme === "dark")
        await page
          .getByRole("button", { name: "Switch to dark appearance" })
          .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await page
        .getByRole("button", { name: "Tell your story", exact: true })
        .click();
      await page.getByRole("button", { name: "Add a manual record" }).click();
      const dialog = page.getByRole("dialog");
      await dialog
        .getByLabel("Description", { exact: true })
        .fill("Zoom check synthetic delivery");
      await dialog.getByLabel("Amount · GHS", { exact: true }).fill("12.34");
      expect(
        await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      ).toBe(true);
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press("Tab");
        expect(
          await dialog.evaluate((el) => el.contains(document.activeElement)),
        ).toBe(true);
      }
      // Let the browser capture its physical surface without Playwright's
      // CSS-pixel clip calculation (which assumes 100% browser zoom).
      const cdp = await context.newCDPSession(page);
      const screenshot = await cdp.send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
      });
      await writeFile(
        test.info().outputPath(`zoom-${theme}.png`),
        Buffer.from(screenshot.data, "base64"),
      );
      await dialog.getByRole("button", { name: "Review this record" }).click();
      await expect(
        page.getByRole("button", { name: "Save this record" }),
      ).toBeEnabled();
      await page
        .getByRole("button", { name: "Today", exact: true })
        .filter({ visible: true })
        .click();
    } finally {
      await context.close();
    }
  });
}
