# Ounch Items

Interview assessment app built with Next.js, MySQL, Tailwind CSS, and NextUI/HeroUI.

The application server-renders rows from a MySQL `items` table, handles database errors gracefully, and includes URL-driven pagination.

## Screenshots

![Desktop default table](docs/screenshots/desktop-default.png)

![Mobile compact pagination](docs/screenshots/mobile-pagination-compact.png)

Additional responsive states are available in [`docs/screenshots`](docs/screenshots).

## Tech Stack

- Next.js 16 with the App Router
- React 19
- MySQL with `mysql2`
- Drizzle ORM for schema management and queries
- Tailwind CSS 4
- NextUI/HeroUI components

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` from the example file:

```powershell
Copy-Item .env.local.example .env.local
```

Update the database connection string:

```env
DATABASE_URL="mysql://root:password@localhost:3306/sample_db"
```

Create the MySQL database:

```sql
CREATE DATABASE IF NOT EXISTS sample_db;
```

Create the `items` table from the Drizzle schema:

```bash
npm run db:push
```

Seed the table with sample data:

```bash
npm run db:seed
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

The app creates and reads from this table:

```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);
```

The seed script fills the table up to 250 demo rows. Pagination displays 10 items per page.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint
- `npm run test:e2e` - run Playwright responsive table tests
- `npm run docs:screenshots` - refresh screenshots in `docs/screenshots`
- `npm run db:push` - create or update the database table from the Drizzle schema
- `npm run db:seed` - insert sample item data up to 250 rows
- `npm run db:fresh` - drop existing tables, push the schema, and seed fresh data

## Main Files

- `src/app/page.tsx` - server-rendered items page
- `src/lib/items.ts` - database fetching, pagination data, and error handling
- `src/components/items/table.tsx` - item table UI
- `src/components/table.tsx` - reusable table and pagination UI
- `src/db/schema.ts` - Drizzle schema for the `items` table
- `scripts/seed-items.ts` - sample data seeding script

## Interview Note

I wanted to add a short note because my perspective on ChatGPT 5.5 has changed since the interview. During the interview, I mentioned that I shape my programming opinions by listening to reputable senior engineers and weighing their reasoning against my own experience.

One example is Theo, an ex-Twitch engineer. I said in the interview that I was not very impressed with ChatGPT 5.5 and preferred using Claude Code, though I could not always rely on it because of quota limits. After watching Theo's perspective, I felt I should give ChatGPT 5.5 a fairer try, because I consider his judgment credible.

The video link below starts at the exact moment where Theo explains why.

[![Theo on coding with AI](https://img.youtube.com/vi/xJaMTo2YgO8/hqdefault.jpg)](https://youtu.be/xJaMTo2YgO8?si=9VWIepJPP-KrFSDq&t=235)
