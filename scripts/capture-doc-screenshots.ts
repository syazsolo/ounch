import { chromium, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.join(process.cwd(), "docs", "screenshots");

type ScreenshotTarget = {
  fileName: string;
  path: string;
  prepare?: (page: Page) => Promise<void>;
  viewport: {
    height: number;
    width: number;
  };
};

const targets: ScreenshotTarget[] = [
  {
    fileName: "desktop-default.png",
    path: "/",
    viewport: { height: 720, width: 1280 },
  },
  {
    fileName: "desktop-pagination-near-start.png",
    path: "/?page=2",
    viewport: { height: 720, width: 1280 },
  },
  {
    fileName: "desktop-pagination-middle.png",
    path: "/?page=4",
    viewport: { height: 720, width: 1280 },
  },
  {
    fileName: "desktop-pagination-last.png",
    path: "/?page=25",
    viewport: { height: 720, width: 1280 },
  },
  {
    fileName: "mobile-portrait-default.png",
    path: "/",
    viewport: { height: 667, width: 375 },
  },
  {
    fileName: "mobile-portrait-horizontal-scroll.png",
    path: "/",
    prepare: async (page) => {
      await page
        .getByTestId("data-table-scroll-container")
        .evaluate((element) => {
          element.scrollLeft = element.scrollWidth;
        });
    },
    viewport: { height: 667, width: 375 },
  },
  {
    fileName: "mobile-landscape-default.png",
    path: "/",
    viewport: { height: 375, width: 667 },
  },
  {
    fileName: "mobile-pagination-compact.png",
    path: "/?page=5",
    viewport: { height: 667, width: 375 },
  },
];

async function captureTarget(page: Page, target: ScreenshotTarget) {
  await page.setViewportSize(target.viewport);
  await page.goto(new URL(target.path, baseUrl).toString());
  await page.getByTestId("data-table").waitFor();
  await target.prepare?.(page);
  await page.screenshot({
    path: path.join(outputDir, target.fileName),
  });
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    for (const target of targets) {
      await captureTarget(page, target);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
