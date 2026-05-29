import { expect, test, type Page } from "@playwright/test";

type TableMetrics = {
  bodyClientHeight: number;
  bodyOverflowY: string;
  bodyScrollHeight: number;
  bodyScrollTop: number;
  documentScrollHeight: number;
  footerBottom: number;
  footerHeight: number;
  gapBetweenRowsAndFooter: number | null;
  headerBottom: number;
  headerTop: number;
  tableBodyTop: number;
  viewportHeight: number;
};

async function getTableMetrics(page: Page): Promise<TableMetrics> {
  return page.evaluate(() => {
    const body = document.querySelector<HTMLElement>(
      '[data-testid="data-table-body"]',
    );
    const footer = document.querySelector<HTMLElement>(
      '[data-testid="data-table-footer"]',
    );
    const header = document.querySelector<HTMLElement>(
      '[data-slot="table-header"]',
    );
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="table-row"]'),
    );
    const lastRow = rows.at(-1);

    if (!body || !footer || !header) {
      throw new Error("Expected table body, footer, and header to be present.");
    }

    const bodyRect = body.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();

    return {
      bodyClientHeight: body.clientHeight,
      bodyOverflowY: getComputedStyle(body).overflowY,
      bodyScrollHeight: body.scrollHeight,
      bodyScrollTop: body.scrollTop,
      documentScrollHeight: document.documentElement.scrollHeight,
      footerBottom: footerRect.bottom,
      footerHeight: footerRect.height,
      gapBetweenRowsAndFooter: lastRow
        ? footerRect.top - lastRow.getBoundingClientRect().bottom
        : null,
      headerBottom: headerRect.bottom,
      headerTop: headerRect.top,
      tableBodyTop: bodyRect.top,
      viewportHeight: window.innerHeight,
    };
  });
}

test.describe("responsive data table", () => {
  test("mobile portrait scrolls rows while keeping pagination visible", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 667, width: 375 });
    await page.goto("/?page=5");

    await expect(page.getByText("Page 5 / 25", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Showing 41-50 of 250", { exact: true }),
    ).toBeHidden();

    const initial = await getTableMetrics(page);
    expect(initial.documentScrollHeight).toBeLessThanOrEqual(
      initial.viewportHeight + 1,
    );
    expect(initial.bodyOverflowY).toBe("auto");
    expect(initial.bodyScrollHeight).toBeGreaterThan(initial.bodyClientHeight);
    expect(initial.footerBottom).toBeLessThanOrEqual(
      initial.viewportHeight + 1,
    );
    expect(initial.footerHeight).toBeLessThanOrEqual(64);
    expect(Math.abs(initial.headerBottom - initial.tableBodyTop)).toBeLessThan(
      1,
    );

    await page
      .getByTestId("data-table-body")
      .evaluate((element) => element.scrollTo({ top: 160 }));

    const scrolled = await getTableMetrics(page);
    expect(scrolled.bodyScrollTop).toBeGreaterThan(0);
    expect(scrolled.headerTop).toBe(initial.headerTop);
  });

  test("mobile landscape still uses the compact row-scrolling layout", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 375, width: 667 });
    await page.goto("/?page=5");

    await expect(page.getByText("Page 5 / 25", { exact: true })).toBeVisible();

    const metrics = await getTableMetrics(page);
    expect(metrics.documentScrollHeight).toBeLessThanOrEqual(
      metrics.viewportHeight + 1,
    );
    expect(metrics.bodyOverflowY).toBe("auto");
    expect(metrics.bodyScrollHeight).toBeGreaterThan(metrics.bodyClientHeight);
    expect(metrics.footerBottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
    expect(metrics.footerHeight).toBeLessThanOrEqual(64);
  });

  test("desktop keeps natural table height and full pagination", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 720, width: 1280 });
    await page.goto("/?page=5");

    await expect(
      page.getByText("Showing 41-50 of 250", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Page 5 of 25", { exact: true })).toBeHidden();
    await expect(
      page.getByText("Page 5 / 25", { exact: true }),
    ).toBeHidden();

    const metrics = await getTableMetrics(page);
    expect(metrics.bodyOverflowY).toBe("visible");
    expect(metrics.gapBetweenRowsAndFooter).not.toBeNull();
    expect(Math.abs(metrics.gapBetweenRowsAndFooter ?? 0)).toBeLessThan(1);
  });
});
