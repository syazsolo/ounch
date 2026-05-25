import Link from "next/link";
import { getItemPageHref, getVisiblePages } from "./pagination";

type ItemsPaginationProps = {
  currentPage: number;
  pageCount: number;
};

type PageLink = {
  href: string;
  isDisabled?: boolean;
  label: React.ReactNode;
};

export function ItemsPagination({
  currentPage,
  pageCount,
}: ItemsPaginationProps) {
  const previousLink: PageLink = {
    href: getItemPageHref(Math.max(currentPage - 1, 1)),
    isDisabled: currentPage === 1,
    label: "Previous",
  };
  const nextLink: PageLink = {
    href: getItemPageHref(Math.min(currentPage + 1, pageCount)),
    isDisabled: currentPage === pageCount,
    label: "Next",
  };

  return (
    <nav
      aria-label="Items pagination"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-700">{currentPage}</span>{" "}
        of <span className="font-medium text-slate-700">{pageCount}</span>
      </p>
      <MobilePagination
        currentPage={currentPage}
        nextLink={nextLink}
        pageCount={pageCount}
        previousLink={previousLink}
      />
      <DesktopPagination
        currentPage={currentPage}
        nextLink={nextLink}
        pageCount={pageCount}
        previousLink={previousLink}
      />
    </nav>
  );
}

function MobilePagination({
  currentPage,
  nextLink,
  pageCount,
  previousLink,
}: ItemsPaginationProps & {
  nextLink: PageLink;
  previousLink: PageLink;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:hidden">
      <PaginationLink className="w-full" {...previousLink} />
      <span className="inline-flex h-9 min-w-16 items-center justify-center rounded-md bg-teal-600 px-3 text-sm font-semibold text-white shadow-sm shadow-teal-900/10">
        {currentPage}
        <span className="mx-1 text-teal-100">/</span>
        {pageCount}
      </span>
      <PaginationLink className="w-full" {...nextLink} />
    </div>
  );
}

function DesktopPagination({
  currentPage,
  nextLink,
  pageCount,
  previousLink,
}: ItemsPaginationProps & {
  nextLink: PageLink;
  previousLink: PageLink;
}) {
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <div className="hidden flex-wrap items-center gap-2 sm:flex">
      <PaginationLink {...previousLink} />
      {visiblePages.map((page, index) => {
        const previousVisiblePage = visiblePages[index - 1];
        const hasGap =
          previousVisiblePage !== undefined && page - previousVisiblePage > 1;

        return (
          <span className="flex items-center gap-2" key={page}>
            {hasGap ? <PaginationEllipsis /> : null}
            <PaginationLink
              href={getItemPageHref(page)}
              isCurrent={page === currentPage}
              label={page}
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
  className = "",
  href,
  isCurrent = false,
  isDisabled = false,
  label,
}: PageLink & {
  className?: string;
  isCurrent?: boolean;
}) {
  const isNumeric = typeof label === "number";

  return (
    <Link
      aria-current={isCurrent ? "page" : undefined}
      aria-disabled={isDisabled}
      className={`inline-flex items-center justify-center rounded-md border text-sm transition ${className} ${
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
      {label}
    </Link>
  );
}
