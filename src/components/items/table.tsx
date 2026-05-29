import { Table } from "@heroui/react";
import { DataTable } from "@/components/table";
import type { Item } from "@/db/schema";
import { getPageHref } from "@/lib/pagination";

type ItemsTableProps = {
  className?: string;
  currentPage: number;
  items: Item[];
  pageCount: number;
  pageSize: number;
  totalItems: number;
};

export function ItemsTable({
  className,
  currentPage,
  items,
  pageCount,
  pageSize,
  totalItems,
}: ItemsTableProps) {
  return (
    <DataTable
      aria-label="Seeded inventory items"
      className={className}
      columns={[
        {
          id: "id",
          isRowHeader: true,
          label: "ID",
          widthClassName: "w-1/10",
        },
        {
          id: "name",
          label: "Name",
          widthClassName: "w-1/4",
        },
        {
          id: "description",
          label: "Description",
        },
      ]}
      emptyState={{
        title: "No items found",
        description: "Run npm run db:seed to add sample rows.",
      }}
      isEmpty={items.length === 0}
      pagination={{
        currentPage,
        getPageHref,
        pageCount,
        pageSize,
        totalItems,
      }}
    >
      {items.map((item) => (
        <Table.Row id={item.id} key={item.id}>
          <Table.Cell className="w-1/10">
            <span className="font-mono text-sm text-slate-500">#{item.id}</span>
          </Table.Cell>
          <Table.Cell className="w-1/4">
            <span className="font-medium text-slate-950">{item.name}</span>
          </Table.Cell>
          <Table.Cell>
            <span className="text-slate-600">{item.description}</span>
          </Table.Cell>
        </Table.Row>
      ))}
    </DataTable>
  );
}
