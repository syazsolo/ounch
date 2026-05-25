import { ItemsTable } from "@/features/items/items-table";
import { getItemsPage } from "@/features/items/items.queries";
import { parsePageParam } from "@/features/items/pagination";

type SearchParams = Promise<{
  page?: string | string[];
}>;

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#f7f8fb] p-4 text-slate-900 sm:p-6">
      <div className="rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-700 shadow-sm">
        {message}
      </div>
    </main>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const requestedPage = parsePageParam((await searchParams).page);
  const result = await getItemsPage(requestedPage);

  if (!result.ok) {
    return <ErrorState message={result.error} />;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] p-4 text-slate-900 sm:p-6">
      <ItemsTable {...result.data} />
    </main>
  );
}
