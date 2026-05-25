import { asc, count } from "drizzle-orm";
import { formatDbError } from "@/db/errors";
import { items, type Item } from "@/db/schema";
import { ITEMS_PAGE_SIZE } from "./pagination";

export type ItemsPage =
  | {
      ok: true;
      data: {
        currentPage: number;
        items: Item[];
        pageCount: number;
        pageSize: number;
        totalItems: number;
      };
    }
  | {
      ok: false;
      error: string;
    };

export async function getItemsPage(page: number): Promise<ItemsPage> {
  try {
    const { db } = await import("@/db");
    const totalRows = await db.select({ value: count() }).from(items);

    const totalItems = Number(totalRows[0]?.value ?? 0);
    const pageCount = Math.max(Math.ceil(totalItems / ITEMS_PAGE_SIZE), 1);
    const currentPage = Math.min(page, pageCount);
    const offset = (currentPage - 1) * ITEMS_PAGE_SIZE;
    const itemRows = await db
      .select()
      .from(items)
      .orderBy(asc(items.id))
      .limit(ITEMS_PAGE_SIZE)
      .offset(offset);

    return {
      ok: true,
      data: {
        currentPage,
        items: itemRows,
        pageCount,
        pageSize: ITEMS_PAGE_SIZE,
        totalItems,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      error: formatDbError(error),
    };
  }
}
