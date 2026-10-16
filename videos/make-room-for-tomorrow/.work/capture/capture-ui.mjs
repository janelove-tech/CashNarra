// Captures actual CashNarra Interactive Preview states (Design Kit v2) for the film.
// Usage: node capture-ui.mjs <chromePath> <previewHtml> <outDir>
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [chromePath, previewHtml, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const url = pathToFileURL(path.resolve(previewHtml)).href;
const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BOXES = {};
const SEL = "h1,h2,h3,textarea,button,.amount,.badge,.notice,.source-quote,.progress-track,.goal-progress-label,#extra-amount,.story-cover,.story-connections,.connection,.comparison-bars,.goal-main,.forecast,.scenario-box,.scenario-result,.wide-panel,.flow-footer,.review-metrics,.detail-hero,.detail-fields div,.record-row,.row,.bottom-nav,.demo-strip,.flow-options";
const dumpBoxes = async (name) => {
  BOXES[name] = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((el) => {
    const r = el.getBoundingClientRect();
    return { sel: el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : ""),
      action: el.dataset?.action || undefined, text: (el.innerText || "").trim().slice(0, 60).replace(/\s+/g, " "),
      x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  }).filter((b) => b.w > 0 && b.h > 0), SEL);
};
const shot = async (name, full = false) => {
  await wait(250);
  await dumpBoxes(name);
  if (full) {
    // Grow the viewport to the document height so the fixed bottom nav sits at the true bottom.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewport({ width: 390, height: h, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await wait(250);
    await page.screenshot({ path: path.join(outDir, name + ".png") });
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await wait(150);
  } else {
    await page.screenshot({ path: path.join(outDir, name + ".png") });
  }
  console.log("captured", name);
};
const click = async (sel) => { await page.$eval(sel, (el) => el.click()); await wait(450); };
const go = async (hash) => { await page.evaluate((h) => { location.hash = h; }, hash); await wait(500); };

await page.goto(url + "#record", { waitUntil: "load" });
await page.evaluateHandle("document.fonts.ready");
await wait(600);

// 1 — text entry: the complete canonical example, clarification variant (delivery account omitted)
await click('[data-action="unclear"]');
const full = await page.evaluate(() => document.getElementById("narration").value);
if (!full.includes("GH₵80 delivery,") || !full.includes("Abena paid GH₵200")) throw new Error("unexpected variant: " + full);
fs.writeFileSync(path.join(outDir, "narration.txt"), full, "utf8");
const STAGES = 28;
for (let i = 0; i <= STAGES; i++) {
  const n = Math.round((full.length * i) / STAGES);
  await page.evaluate((t) => {
    const ta = document.getElementById("narration");
    ta.value = t; ta.dispatchEvent(new Event("input", { bubbles: true }));
    ta.scrollTop = ta.scrollHeight;
  }, full.slice(0, n));
  await page.screenshot({ path: path.join(outDir, `type_${String(i).padStart(2, "0")}.png`) });
}
console.log("captured typing", STAGES + 1);
await page.evaluate(() => window.scrollTo(0, 0));
await shot("type_full", true);

// 2 — understand → clarification → choose MoMo
await click('[data-action="understand"]');
await shot("clarify");
await shot("clarify_full", true);
await click('[data-action="account-choice"][data-account="MoMo"]');
await shot("clarify_momo");
await shot("clarify_momo_full", true);

// 3 — review the eight records
await click('[data-action="review"]');
await page.evaluate(() => window.scrollTo(0, 0));
await shot("review");
await shot("review_full", true);

// 4 — save
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await wait(300);
await shot("review_bottom");
await page.$eval('[data-action="save"]', (el) => el.click());
await wait(150);
await shot("saving");
await wait(1100);
await page.evaluate(() => window.scrollTo(0, 0));
await shot("saved");
await shot("saved_full", true);

// 5 — Abena's part payment record
await go("records");
await click('[data-action="detail"][data-id="CN-107"]');
await page.evaluate(() => window.scrollTo(0, 0));
await shot("abena");
await shot("abena_full", true);

// Kojo
await go("records");
await click('[data-action="detail"][data-id="CN-103"]');
await page.evaluate(() => window.scrollTo(0, 0));
await shot("kojo_full", true);

// 6 — Money Story
await go("stories");
await page.evaluate(() => window.scrollTo(0, 0));
await shot("story_full", true);

// Records list
await go("records");
await shot("records_full", true);

// 7 — goal and what-if
await go("plan");
await page.evaluate(() => window.scrollTo(0, 0));
await shot("plan_full", true);
await go("scenario");
for (const extra of [0, 50, 100, 150, 200]) {
  await page.evaluate((v) => {
    const r = document.getElementById("extra-amount");
    r.value = v; r.dispatchEvent(new Event("input", { bubbles: true }));
  }, extra);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(`scenario_${extra}_full`, true);
}

// Today (home) for context
await go("today");
await page.evaluate(() => window.scrollTo(0, 0));
await shot("today_full", true);

fs.writeFileSync(path.join(outDir, "boxes.json"), JSON.stringify(BOXES, null, 1));
await browser.close();
