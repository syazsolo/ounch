import { asc, count } from "drizzle-orm";
import Link from "next/link";
import { Table } from "@heroui/react";
import { items } from "@/db/schema";

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  page?: string | string[];
}>;

type ItemsPageResult =
  | {
      ok: true;
      data: {
        currentPage: number;
        items: (typeof items.$inferSelect)[];
        pageCount: number;
        pageSize: number;
        totalItems: number;
      };
    }
  | {
      ok: false;
      error: string;
    };

type DatabaseError = Error & {
  code?: string;
  errno?: number;
  sqlState?: string;
};

function parsePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

function pageHref(page: number) {
  return page <= 1 ? "/" : `/?page=${page}`;
}

function getVisiblePages(currentPage: number, pageCount: number) {
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

function getDatabaseErrorMessage(error: unknown) {
  const dbError = error as DatabaseError;

  if (dbError.message?.includes("DATABASE_URL")) {
    return "Database connection is not configured. Add DATABASE_URL to .env.local.";
  }

  if (dbError.code === "ECONNREFUSED" || dbError.code === "ENOTFOUND") {
    return "Unable to connect to MySQL. Confirm the database server is running and DATABASE_URL points to the right host.";
  }

  if (dbError.code === "ER_ACCESS_DENIED_ERROR") {
    return "MySQL rejected the configured credentials. Check the user name and password in DATABASE_URL.";
  }

  if (dbError.code === "ER_BAD_DB_ERROR") {
    return "The configured MySQL database does not exist. Confirm DATABASE_URL points to sample_db.";
  }

  if (dbError.code === "ER_NO_SUCH_TABLE") {
    return "The items table does not exist yet. Run npm run db:push, then npm run db:seed.";
  }

  return "Unable to fetch items from MySQL. Check the server logs for the full database error.";
}

async function getItemsPage(page: number): Promise<ItemsPageResult> {
  try {
    const { db } = await import("@/db");
    const totalRows = await db.select({ value: count() }).from(items);

    const totalItems = Number(totalRows[0]?.value ?? 0);
    const pageCount = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);
    const currentPage = Math.min(page, pageCount);
    const offset = (currentPage - 1) * PAGE_SIZE;
    const itemRows = await db
      .select()
      .from(items)
      .orderBy(asc(items.id))
      .limit(PAGE_SIZE)
      .offset(offset);

    return {
      ok: true,
      data: {
        currentPage,
        items: itemRows,
        pageCount,
        pageSize: PAGE_SIZE,
        totalItems,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      error: getDatabaseErrorMessage(error),
    };
  }
}

function PaginationControls({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) {
  const visiblePages = getVisiblePages(currentPage, pageCount);
  const previousPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, pageCount);

  return (
    <nav
      aria-label="Items pagination"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-700">{currentPage}</span>{" "}
        of <span className="font-medium text-slate-700">{pageCount}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          prefetch={false}
          aria-disabled={currentPage === 1}
          className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition ${
            currentPage === 1
              ? "pointer-events-none border-slate-200 text-slate-300"
              : "border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700"
          }`}
          href={pageHref(previousPage)}
        >
          Previous
        </Link>
        {visiblePages.map((page, index) => {
          const previousVisiblePage = visiblePages[index - 1];
          const hasGap =
            previousVisiblePage !== undefined && page - previousVisiblePage > 1;

          return (
            <span className="flex items-center gap-2" key={page}>
              {hasGap ? (
                <span className="inline-flex size-9 items-center justify-center text-sm text-slate-400">
                  ...
                </span>
              ) : null}
              <Link
                prefetch={false}
                aria-current={page === currentPage ? "page" : undefined}
                className={`inline-flex size-9 items-center justify-center rounded-md text-sm font-semibold transition ${
                  page === currentPage
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-900/10"
                    : "border border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700"
                }`}
                href={pageHref(page)}
              >
                {page}
              </Link>
            </span>
          );
        })}
        <Link
          prefetch={false}
          aria-disabled={currentPage === pageCount}
          className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition ${
            currentPage === pageCount
              ? "pointer-events-none border-slate-200 text-slate-300"
              : "border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700"
          }`}
          href={pageHref(nextPage)}
        >
          Next
        </Link>
      </div>
    </nav>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#f7f8fb] p-4 text-slate-900 sm:p-6">
      <div className="rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-700 shadow-sm">
        {message}
      </div>
    </main>
  );
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const requestedPage = parsePage((await searchParams).page);
  const result = await getItemsPage(requestedPage);

  if (!result.ok) {
    return <ErrorState message={result.error} />;
  }

  const { currentPage, items: itemRows, pageCount, pageSize, totalItems } =
    result.data;
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <main className="min-h-screen bg-[#f7f8fb] p-4 text-slate-900 sm:p-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Seeded inventory items"
              className="min-w-170"
            >
              <Table.Header>
                <Table.Column isRowHeader>ID</Table.Column>
                <Table.Column>Name</Table.Column>
                <Table.Column>Description</Table.Column>
              </Table.Header>
              <Table.Body>
                {itemRows.length > 0 ? (
                  itemRows.map((item) => (
                    <Table.Row id={item.id} key={item.id}>
                      <Table.Cell>
                        <span className="font-mono text-sm text-slate-500">
                          #{item.id}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-slate-950">
                          {item.name}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600">
                          {item.description}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row id="empty">
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>No items found</Table.Cell>
                    <Table.Cell>
                      Run npm run db:seed to add sample rows.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
          <Table.Footer className="border-t border-slate-200 p-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-500">
                Showing {firstItem}-{lastItem} of {totalItems}
              </p>
              <PaginationControls
                currentPage={currentPage}
                pageCount={pageCount}
              />
            </div>
          </Table.Footer>
        </Table>
      </div>
    </main>
  );
}
