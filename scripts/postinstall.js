import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const cacheDir = process.platform === "win32"
  ? join(process.env.LOCALAPPDATA, "ms-playwright")
  : join(process.env.HOME, ".cache", "ms-playwright");

if (!existsSync(cacheDir)) {
  console.log("\n  Installing Playwright Chromium browser (~200MB)...");
  try {
    execSync("npx playwright install chromium", { stdio: "inherit" });
    console.log("  ✓ Chromium installed");
  } catch {
    console.log("  ⚠ Could not auto-install. Run: npx playwright install chromium");
  }
} else {
  console.log("  ✓ Playwright browser cache found");
}
