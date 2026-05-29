import { Table } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getPageRange, getVisiblePages } from "@/lib/pagination";
import styles from "./table.module.css";

export type DataTableColumn = {
  id: string;
  isRowHeader?: boolean;
  label: ReactNode;
  widthClassName?: string;
};

type DataTableEmptyState = {
  title: string;
  description?: string;
};

type DataTablePaginationProps = {
  currentPage: number;
  getPageHref: (page: number) => string;
  pageCount: number;
  pageSize: number;
  totalItems: number;
};

type DataTableProps = {
  "aria-label": string;
  children: ReactNode;
  className?: string;
  columns: DataTableColumn[];
  contentClassName?: string;
  emptyState: DataTableEmptyState;
  isEmpty: boolean;
  pagination: DataTablePaginationProps;
};

export function DataTable({
  "aria-label": ariaLabel,
  children,
  className,
  columns,
  contentClassName,
  emptyState,
  isEmpty,
  pagination,
}: DataTableProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm",
        "flex min-h-0 flex-col md:block",
        className,
      )}
      data-testid="data-table"
    >
      <Table
        className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] md:block md:flex-none"
        variant="secondary"
      >
        <Table.ScrollContainer
          className="min-h-0 overflow-x-auto overflow-y-hidden md:overflow-y-visible"
          data-testid="data-table-scroll-container"
        >
          <Table.Content
            aria-label={ariaLabel}
            className={cn(
              "min-w-170 table-fixed",
              styles.mobileBodyScroll,
              "h-full md:h-auto",
              contentClassName,
            )}
            data-testid="data-table-content"
          >
            <Table.Header>
              {columns.map((column, index) => (
                <Table.Column
                  className={cn(
                    index === 0 && "rounded-none!",
                    index === columns.length - 1 && "rounded-none!",
                    column.widthClassName,
                  )}
                  isRowHeader={column.isRowHeader}
                  key={column.id}
                >
                  {column.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body data-testid="data-table-body">
              {isEmpty ? (
                <Table.Row id="empty">
                  <Table.Cell colSpan={columns.length}>
                    <div className="py-6 text-center">
                      <p className="font-medium text-slate-950">
                        {emptyState.title}
                      </p>
                      {emptyState.description ? (
                        <p className="mt-1 text-sm text-slate-500">
                          {emptyState.description}
                        </p>
                      ) : null}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                children
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer
          className="border-t border-slate-200 p-2.5 md:p-4"
          data-testid="data-table-footer"
        >
          <DataTablePagination {...pagination} />
        </Table.Footer>
      </Table>
    </div>
  );
}

function DataTablePagination({
  currentPage,
  getPageHref,
  pageCount,
  pageSize,
  totalItems,
}: DataTablePaginationProps) {
  const { firstItem, lastItem } = getPageRange({
    currentPage,
    pageSize,
    totalItems,
  });
  const previousLink: PageLink = {
    ariaLabel: "Previous page",
    href: getPageHref(Math.max(currentPage - 1, 1)),
    isDisabled: currentPage === 1,
    label: <ChevronLeft aria-hidden="true" size={18} strokeWidth={2.5} />,
    size: "icon",
  };
  const nextLink: PageLink = {
    ariaLabel: "Next page",
    href: getPageHref(Math.min(currentPage + 1, pageCount)),
    isDisabled: currentPage === pageCount,
    label: <ChevronRight aria-hidden="true" size={18} strokeWidth={2.5} />,
    size: "icon",
  };

  return (
    <div className="md:flex md:items-center md:justify-between md:gap-4">
      <p className="hidden text-sm text-slate-500 md:block">
        Showing {firstItem}-{lastItem} of {totalItems}
      </p>
      <nav
        aria-label="Table pagination"
        className="flex items-center justify-center gap-2"
      >
        <MobilePagination
          className="md:hidden"
          currentPage={currentPage}
          nextLink={nextLink}
          pageCount={pageCount}
          previousLink={previousLink}
        />
        <DesktopPagination
          className="hidden md:flex"
          currentPage={currentPage}
          getPageHref={getPageHref}
          nextLink={nextLink}
          pageCount={pageCount}
          previousLink={previousLink}
        />
      </nav>
    </div>
  );
}

type PageLink = {
  ariaLabel?: string;
  href: string;
  isDisabled?: boolean;
  label: ReactNode;
  size: "icon" | "page";
};

function MobilePagination({
  className,
  currentPage,
  nextLink,
  pageCount,
  previousLink,
}: {
  className: string;
  currentPage: number;
  nextLink: PageLink;
  pageCount: number;
  previousLink: PageLink;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className,
      )}
    >
      <PaginationLink {...previousLink} />
      <span className="inline-flex h-9 min-w-16 items-center justify-center rounded-md bg-teal-600 px-3 text-sm font-semibold text-white shadow-sm shadow-teal-900/10">
        <span className="mr-1 font-medium text-teal-50">Page</span>{" "}
        {currentPage}{" "}
        <span className="mx-1 text-teal-100">/</span>
        {" "}
        {pageCount}
      </span>
      <PaginationLink {...nextLink} />
    </div>
  );
}

function DesktopPagination({
  className,
  currentPage,
  getPageHref,
  nextLink,
  pageCount,
  previousLink,
}: {
  className: string;
  currentPage: number;
  getPageHref: (page: number) => string;
  nextLink: PageLink;
  pageCount: number;
  previousLink: PageLink;
}) {
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <div className={cn("flex-wrap items-center gap-2", className)}>
      <PaginationLink {...previousLink} />
      {visiblePages.map((page, index) => {
        const previousVisiblePage = visiblePages[index - 1];
        const hasGap =
          previousVisiblePage !== undefined && page - previousVisiblePage > 1;

        return (
          <span className="flex items-center gap-2" key={page}>
            {hasGap ? <PaginationEllipsis /> : null}
            <PaginationLink
              href={getPageHref(page)}
              isCurrent={page === currentPage}
              label={page}
              size="page"
            />
          </span>
        );
      })}
      <PaginationLink {...nextLink} />
    </div>
  );
}

function PaginationEllipsis() {
  return (
    <span className="inline-flex size-9 items-center justify-center text-sm text-slate-400">
      ...
    </span>
  );
}

function PaginationLink({
  ariaLabel,
  className = "",
  href,
  isCurrent = false,
  isDisabled = false,
  label,
  size,
}: PageLink & {
  className?: string;
  isCurrent?: boolean;
}) {
  return (
    <Link
      aria-current={isCurrent ? "page" : undefined}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-md border text-sm transition",
        size === "icon" ? "size-9" : "size-9 font-semibold",
        isDisabled
          ? "pointer-events-none border-slate-200 text-slate-300"
          : isCurrent
            ? "border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-900/10"
            : "border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700",
        className,
      )}
      href={href}
      prefetch={false}
    >
      {label}
    </Link>
  );
}
