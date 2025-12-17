import {
  check,
  date,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const people = pgTable(
  "people",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    description: text("description").notNull(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    paidBy: integer("paid_by")
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
    id: serial("id").primaryKey(),
    expenseId: integer("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    personId: integer("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  },
  table => ({
    expenseIdx: index("splits_expense_id_idx").on(table.expenseId),
    personIdx: index("splits_person_id_idx").on(table.personId),
  })
);

export const settlements = pgTable(
  "settlements",
  {
    id: serial("id").primaryKey(),
    fromPersonId: integer("from_person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict", onUpdate: "cascade" }),
    toPersonId: integer("to_person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict", onUpdate: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    fromPersonIdx: index("settlements_from_person_idx").on(table.fromPersonId),
    toPersonIdx: index("settlements_to_person_idx").on(table.toPersonId),
    amountPositive: check("settlements_amount_positive", sql`${table.amount} > 0`),
    distinctParticipants: check("settlements_distinct_participants", sql`${table.fromPersonId} <> ${table.toPersonId}`),
  })
);

export const peopleRelations = relations(people, ({ many }) => ({
  paidExpenses: many(expenses, { relationName: "expensePaidBy" }),
  splits: many(splits),
  settlementsFrom: many(settlements, { relationName: "settlementFrom" }),
  settlementsTo: many(settlements, { relationName: "settlementTo" }),
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

export const settlementsRelations = relations(settlements, ({ one }) => ({
  fromPerson: one(people, {
    fields: [settlements.fromPersonId],
    references: [people.id],
    relationName: "settlementFrom",
  }),
  toPerson: one(people, {
    fields: [settlements.toPersonId],
    references: [people.id],
    relationName: "settlementTo",
  }),
}));
