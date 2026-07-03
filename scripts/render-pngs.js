import { chromium } from "playwright";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { resolve } from "path";

const tasks = [
  { svg: "logo.svg", png: "logo.png", w: 400, h: 400 },
  { svg: "logo.svg", png: "logo@2x.png", w: 800, h: 800 },
  { svg: "logo-dark.svg", png: "logo-dark.png", w: 400, h: 400 },
  { svg: "social-preview.svg", png: "social-preview.png", w: 1200, h: 600 },
];

const browser = await chromium.launch();

for (const t of tasks) {
  const svgPath = resolve("assets", t.svg);
  const tmpHtml = resolve("assets", "_render.html");

  const html = `<html><body style="margin:0"><img src="file:///${svgPath.replace(/\\/g, "/")}" width="${t.w}" height="${t.h}"></body></html>`;
  writeFileSync(tmpHtml, html);

  const page = await browser.newPage({ viewport: { width: t.w, height: t.h } });
  await page.goto("file:///" + tmpHtml.replace(/\\/g, "/"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve("assets", t.png) });
  await page.close();

  unlinkSync(tmpHtml);
  console.log("  " + t.png);
}

await browser.close();
