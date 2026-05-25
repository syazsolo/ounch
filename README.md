# Ounch Items

Interview test app built with Next.js, MySQL, Tailwind CSS, and NextUI/HeroUI.

The app server-renders item data from a MySQL `items` table and includes basic error handling plus URL-driven pagination.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```powershell
Copy-Item .env.local.example .env.local
```

Set your database URL:

```env
DATABASE_URL="mysql://root:password@localhost:3306/sample_db"
```

Create the database:

```sql
CREATE DATABASE IF NOT EXISTS sample_db;
```

Create and seed the table:

```bash
npm run db:push
npm run db:seed
```

The seed script uses `@faker-js/faker` to top the table up to 250 deterministic sample rows. Pagination displays 10 rows per page.

Note: Pagination is URL-driven with `?page=` and uses a compact mobile layout.

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run start` - run production build
- `npm run lint` - run ESLint
- `npm run db:push` - create/update database table
- `npm run db:seed` - insert sample items up to 250 rows

## Database

The app expects:

```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);
```

Main files:

- `src/app/page.tsx` - server-rendered items page
- `src/db/schema.ts` - database schema
- `scripts/seed-items.ts` - deterministic Faker sample data
