import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { AVAILABLE_STATUS } from "@/data/invoice";

export type Status = (typeof AVAILABLE_STATUS)[number]["id"];

const statuses = AVAILABLE_STATUS.map(({ id }) => id) as Array<Status>;

export const statusEnum = pgEnum(
  "status",
  statuses as [Status, ...Array<Status>]
);

export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey().notNull(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  status: statusEnum("status").notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  userId: text("userId").notNull(),
  organisationId: text("organisationId"),
  customerId: integer("customerId")
    .notNull()
    .references(() => Customers.id),
});

export const Customers = pgTable("customers", {
  id: serial("id").primaryKey().notNull(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  name: text("name").notNull(),
  mail: text("mail").notNull(),
  userId: text("userId").notNull(),
  organisationId: text("organisationId"),
});
