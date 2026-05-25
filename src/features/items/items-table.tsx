import Link from "next/link";
import { Table } from "@heroui/react";
import type { Item } from "@/db/schema";
import { getItemPageHref, getPageRange, getVisiblePages } from "./pagination";

type ItemsTableProps = {
  currentPage: number;
  items: Item[];
  pageCount: number;
  pageSize: number;
  totalItems: number;
};

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
        <PaginationLink
          href={getItemPageHref(previousPage)}
          isDisabled={currentPage === 1}
        >
          Previous
        </PaginationLink>
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
              <PaginationLink
                href={getItemPageHref(page)}
                isCurrent={page === currentPage}
              >
                {page}
              </PaginationLink>
            </span>
          );
        })}
        <PaginationLink
          href={getItemPageHref(nextPage)}
          isDisabled={currentPage === pageCount}
        >
          Next
        </PaginationLink>
      </div>
    </nav>
  );
}

function PaginationLink({
  children,
  href,
  isCurrent = false,
  isDisabled = false,
}: {
  children: React.ReactNode;
  href: string;
  isCurrent?: boolean;
  isDisabled?: boolean;
}) {
  const isNumeric = typeof children === "number";

  return (
    <Link
      aria-current={isCurrent ? "page" : undefined}
      aria-disabled={isDisabled}
      className={`inline-flex items-center justify-center rounded-md border text-sm transition ${
        isNumeric ? "size-9 font-semibold" : "h-9 px-3 font-medium"
      } ${
        isDisabled
          ? "pointer-events-none border-slate-200 text-slate-300"
          : isCurrent
            ? "border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-900/10"
            : "border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700"
      }`}
      href={href}
      prefetch={false}
    >
      {children}
    </Link>
  );
}

export function ItemsTable({
  currentPage,
  items,
  pageCount,
  pageSize,
  totalItems,
}: ItemsTableProps) {
  const { firstItem, lastItem } = getPageRange({
    currentPage,
    pageSize,
    totalItems,
  });

  return (
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
              {items.length > 0 ? (
                items.map((item) => (
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
                  <Table.Cell>Run npm run db:seed to add sample rows.</Table.Cell>
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
  );
}
