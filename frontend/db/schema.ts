import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// Minimal placeholder table so Drizzle has something to work with.
export const exampleTable = pgTable("example", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
