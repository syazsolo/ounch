import { loadEnvConfig } from "@next/env";
import { count } from "drizzle-orm";

loadEnvConfig(process.cwd());

const sampleItems = [
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

async function main() {
  const [{ db }, { items }] = await Promise.all([
    import("../src/db"),
    import("../src/db/schema"),
  ]);

  const [{ value }] = await db.select({ value: count() }).from(items);

  if (value > 0) {
    console.log(`Seed skipped: items table already contains ${value} row(s).`);
    return;
  }

  await db.insert(items).values(sampleItems);
  console.log(`Seeded ${sampleItems.length} item rows.`);
}

main().catch((error) => {
  console.error("Failed to seed items table.");
  console.error(error);
  process.exit(1);
});
