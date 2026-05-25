import { loadEnvConfig } from "@next/env";
import mysql, { type RowDataPacket } from "mysql2/promise";

loadEnvConfig(process.cwd());

type TableRow = RowDataPacket & {
  tableName: string;
};

function quoteIdentifier(identifier: string) {
  return `\`${identifier.replaceAll("`", "``")}\``;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local.");
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const [tables] = await connection.query<TableRow[]>(
      `
        SELECT TABLE_NAME AS tableName
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND TABLE_TYPE = 'BASE TABLE'
      `,
    );

    if (tables.length === 0) {
      console.log("No database tables to drop.");
      return;
    }

    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    try {
      for (const table of tables) {
        await connection.query(
          `DROP TABLE IF EXISTS ${quoteIdentifier(table.tableName)}`,
        );
      }
    } finally {
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    }

    console.log(`Dropped ${tables.length} database table(s).`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Failed to drop database tables.");
  console.error(error);
  process.exit(1);
});
