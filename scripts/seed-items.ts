import { loadEnvConfig } from "@next/env";
import { faker } from "@faker-js/faker";
import { count } from "drizzle-orm";

loadEnvConfig(process.cwd());

const TARGET_ITEM_COUNT = 250;

const curatedItems = [
  {
    name: "Aurora Desk Lamp",
    description:
      "A dimmable aluminum desk lamp with warm and cool light settings for focused work.",
  },
  {
    name: "Canvas Field Notebook",
    description:
      "A durable notebook with dotted pages, a lay-flat binding, and a water-resistant cover.",
  },
  {
    name: "Modular Cable Kit",
    description:
      "A compact organizer with braided USB-C, Lightning, and HDMI adapters for daily carry.",
  },
  {
    name: "Ceramic Pour-Over Set",
    description:
      "A hand-glazed brewer and matching server designed for clean, consistent coffee extraction.",
  },
  {
    name: "Walnut Monitor Stand",
    description:
      "A solid wood stand with hidden storage space to raise screens and tidy the desktop.",
  },
];

const productAdjectives = [
  "Compact",
  "Modular",
  "Ergonomic",
  "Portable",
  "Refined",
  "Durable",
  "Minimal",
  "Wireless",
  "Adjustable",
  "Precision",
];

const productTypes = [
  "Desk Organizer",
  "Task Lamp",
  "Travel Pouch",
  "Notebook Set",
  "Cable Dock",
  "Monitor Shelf",
  "Storage Tray",
  "Charging Stand",
  "Coffee Kit",
  "Workspace Mat",
];

function buildGeneratedItems(count: number) {
  faker.seed(20260525);

  return Array.from({ length: count }, (_, index) => {
    const adjective = faker.helpers.arrayElement(productAdjectives);
    const productType = faker.helpers.arrayElement(productTypes);
    const material = faker.commerce.productMaterial();
    const color = faker.color.human();
    const feature = faker.helpers.arrayElement([
      "daily desk work",
      "hybrid meetings",
      "organized travel",
      "focused writing sessions",
      "small team studios",
      "home office setups",
      "creative planning",
      "clean cable management",
    ]);

    return {
      name: `${adjective} ${productType} ${index + 1}`,
      description: `A ${color} ${material.toLowerCase()} ${productType.toLowerCase()} designed for ${feature}.`,
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

    const catalog = [...curatedItems, ...buildGeneratedItems(TARGET_ITEM_COUNT)];
    const seedItems = catalog.slice(value, TARGET_ITEM_COUNT);

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
