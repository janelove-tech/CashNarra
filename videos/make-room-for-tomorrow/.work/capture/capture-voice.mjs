// Captures the voice-capture screen of the CashNarra Interactive Preview (kit v2) + geometry.
import puppeteer from "puppeteer-core";
import fs from "node:fs"; import path from "node:path"; import { pathToFileURL } from "node:url";
const [chromePath, previewHtml, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const b = await puppeteer.launch({ executablePath: chromePath, headless: true });
const p = await b.newPage();
const vp = (h) => p.setViewport({ width: 390, height: h, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await vp(844);
await p.goto(pathToFileURL(path.resolve(previewHtml)).href + "#voice", { waitUntil: "load" });
await p.evaluateHandle("document.fonts.ready"); await new Promise((r) => setTimeout(r, 700));
await p.screenshot({ path: path.join(outDir, "voice.png") });
const h = await p.evaluate(() => document.documentElement.scrollHeight); await vp(h); await new Promise((r) => setTimeout(r, 300));
await p.screenshot({ path: path.join(outDir, "voice_full.png") });
const boxes = await p.evaluate(() => [...document.querySelectorAll("h1,.badge,.voice-display,.voice-display .amount,.voice-wave,button,.notice")].map((e) => {
  const r = e.getBoundingClientRect(); return { sel: e.tagName + "." + e.className, text: e.innerText.trim().slice(0, 50), x: r.left, y: r.top + scrollY, w: r.width, h: r.height }; }));
fs.writeFileSync(path.join(outDir, "voice-boxes.json"), JSON.stringify(boxes, null, 1));
console.log(JSON.stringify(boxes)); await b.close();
