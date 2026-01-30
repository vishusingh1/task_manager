import { PgTable, text, serial, timestamp, pgTable, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user",{
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").defaultNow()
})

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),

  title: text("title").notNull(),
  description: text("description"),

  priority: text("priority").notNull().default("medium"), // low | medium | high
  status: text("status").notNull().default("pending"),   // pending | completed

  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow(),
});