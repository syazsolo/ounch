type DatabaseError = Error & {
  code?: string;
  errno?: number;
  sqlState?: string;
};

export function formatDbError(error: unknown) {
  const dbError = error as DatabaseError;

  if (dbError.message?.includes("DATABASE_URL")) {
    return "Database connection is not configured. Add DATABASE_URL to .env.local.";
  }

  if (dbError.code === "ECONNREFUSED" || dbError.code === "ENOTFOUND") {
    return "Unable to connect to MySQL. Confirm the database server is running and DATABASE_URL points to the right host.";
  }

  if (dbError.code === "ER_ACCESS_DENIED_ERROR") {
    return "MySQL rejected the configured credentials. Check the user name and password in DATABASE_URL.";
  }

  if (dbError.code === "ER_BAD_DB_ERROR") {
    return "The configured MySQL database does not exist. Confirm DATABASE_URL points to the expected database.";
  }

  if (dbError.code === "ER_NO_SUCH_TABLE") {
    return "A required database table does not exist yet. Run npm run db:push, then npm run db:seed.";
  }

  return "Unable to complete the database request. Check the server logs for the full database error.";
}
