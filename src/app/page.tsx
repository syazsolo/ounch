import { ItemsTable } from "@/components/items/table";
import { listItems } from "@/lib/items";
import { parsePage } from "@/lib/pagination";

type SearchParams = Promise<{
  page?: string | string[];
}>;

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto w-full max-w-6xl rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-700 shadow-sm">
      {message}
    </div>
  );
}

function PageHeader({ totalItems }: { totalItems?: number }) {
  return (
    <header className="mx-auto mb-4 flex w-full max-w-6xl items-end justify-between gap-3">
      <h1 className="text-2xl font-semibold text-slate-950">
        Ounch Assessment
      </h1>
      {totalItems === undefined ? null : (
        <p className="text-sm text-slate-500">
          {totalItems.toLocaleString()} records
        </p>
      )}
    </header>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parsePage((await searchParams).page);
  const itemsPage = await listItems(page);

  if (!itemsPage.ok) {
    return (
      <main className="min-h-dvh p-4 sm:p-6">
        <PageHeader />
        <ErrorState message={itemsPage.error} />
      </main>
    );
  }

  const { data } = itemsPage;

  return (
    <main className="flex h-dvh flex-col overflow-hidden p-4 sm:block sm:h-auto sm:min-h-dvh sm:overflow-visible sm:p-6">
      <PageHeader totalItems={data.totalItems} />
      <ItemsTable {...data} className="min-h-0 flex-1 sm:flex-none" />
    </main>
  );
}
