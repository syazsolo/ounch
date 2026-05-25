import { Table } from "@heroui/react";
import type { Item } from "@/db/schema";
import { ItemsPagination } from "./items-pagination";
import { getPageRange } from "./pagination";

type ItemsTableProps = {
  currentPage: number;
  items: Item[];
  pageCount: number;
  pageSize: number;
  totalItems: number;
};

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
        <Table.Footer className="border-t border-slate-200 p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="text-sm text-slate-500">
              Showing {firstItem}-{lastItem} of {totalItems}
            </p>
            <ItemsPagination
              currentPage={currentPage}
              pageCount={pageCount}
            />
          </div>
        </Table.Footer>
      </Table>
    </div>
  );
}
