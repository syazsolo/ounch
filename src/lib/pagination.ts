export const ITEMS_PAGE_SIZE = 10;

export function parsePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function getPageHref(page: number) {
  return page <= 1 ? "/" : `/?page=${page}`;
}

export function getVisiblePages(currentPage: number, pageCount: number) {
  const pages = new Set([1, pageCount]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= pageCount) {
      pages.add(page);
    }
  }

  if (currentPage <= 2) {
    pages.add(3);
  }

  if (currentPage >= pageCount - 1) {
    pages.add(pageCount - 2);
  }

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b);
}

export function getPageRange({
  currentPage,
  pageSize,
  totalItems,
}: {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}) {
  return {
    firstItem: totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    lastItem: Math.min(currentPage * pageSize, totalItems),
  };
}
