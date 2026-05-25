import { ItemsTable } from "@/features/items/items-table";
import { getItemsPage } from "@/features/items/items.queries";
import { parsePageParam } from "@/features/items/pagination";

type SearchParams = Promise<{
  page?: string | string[];
}>;

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-700 shadow-sm">
      {message}
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const requestedPage = parsePageParam((await searchParams).page);
  const result = await getItemsPage(requestedPage);

  return (
    <main className="min-h-dvh p-4 sm:p-6">
      {result.ok ? (
        <ItemsTable {...result.data} />
      ) : (
        <ErrorState message={result.error} />
      )}
    </main>
  );
}
