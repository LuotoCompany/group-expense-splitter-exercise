import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const people = pgTable(
  "people",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    nameUniqueIdx: uniqueIndex("people_name_unique_idx").on(table.name),
    createdAtIdx: index("people_created_at_idx").on(table.createdAt),
  })
);

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    description: text("description").notNull(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    paidBy: uuid("paid_by")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),
    date: timestamp("date").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    paidByIdx: index("expenses_paid_by_idx").on(table.paidBy),
    dateIdx: index("expenses_date_idx").on(table.date),
  })
);

export const splits = pgTable(
  "splits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expenseId: uuid("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  },
  table => ({
    expenseIdx: index("splits_expense_id_idx").on(table.expenseId),
    personIdx: index("splits_person_id_idx").on(table.personId),
  })
);

export const peopleRelations = relations(people, ({ many }) => ({
  paidExpenses: many(expenses, { relationName: "expensePaidBy" }),
  splits: many(splits),
}));

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  payer: one(people, {
    fields: [expenses.paidBy],
    references: [people.id],
    relationName: "expensePaidBy",
  }),
  splits: many(splits),
}));

export const splitsRelations = relations(splits, ({ one }) => ({
  expense: one(expenses, {
    fields: [splits.expenseId],
    references: [expenses.id],
  }),
  person: one(people, {
    fields: [splits.personId],
    references: [people.id],
  }),
}));
