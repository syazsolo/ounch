import { ItemsTable } from "@/components/items/table";
import { listItems } from "@/lib/items";
import { parsePage } from "@/lib/pagination";

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
  const page = parsePage((await searchParams).page);
  const itemsPage = await listItems(page);

  return (
    <main className="min-h-dvh p-4 sm:p-6">
      {itemsPage.ok ? (
        <ItemsTable {...itemsPage.data} />
      ) : (
        <ErrorState message={itemsPage.error} />
      )}
    </main>
  );
}
