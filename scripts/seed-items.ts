import { loadEnvConfig } from "@next/env";
import { faker } from "@faker-js/faker";
import { count } from "drizzle-orm";

loadEnvConfig(process.cwd());

const TARGET_ITEM_COUNT = 250;

function buildDemoItems(itemCount: number) {
  faker.seed(20260525);

  return Array.from({ length: itemCount }, () => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    };
  });
}

async function main() {
  const [{ db, pool }, { items }] = await Promise.all([
    import("../src/db"),
    import("../src/db/schema"),
  ]);

  try {
    const [{ value }] = await db.select({ value: count() }).from(items);

    if (value >= TARGET_ITEM_COUNT) {
      console.log(
        `Seed skipped: items table already contains ${value} row(s). Target is ${TARGET_ITEM_COUNT}.`,
      );
      return;
    }

    const seedItems = buildDemoItems(TARGET_ITEM_COUNT).slice(value);

    await db.insert(items).values(seedItems);
    console.log(
      `Seeded ${seedItems.length} item rows. Table now targets ${TARGET_ITEM_COUNT} rows.`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed items table.");
  console.error(error);
  process.exit(1);
});
