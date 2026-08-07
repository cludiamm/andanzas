import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, real, serial, text, unique } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { tripsTable } from "./trips";

export const destinationsTable = pgTable(
  "destinations",
  {
    id: serial("id").primaryKey(),
    tripId: integer("trip_id")
      .notNull()
      .references(() => tripsTable.id, { onDelete: "cascade" }),
    country: text("country").notNull(),
    city: text("city").notNull(),
    estimatedDays: real("estimated_days").notNull(),
  },
  (table) => ({
    tripCountryCityUnique: unique("destinations_trip_country_city_unique").on(
      table.tripId,
      table.country,
      table.city,
    ),
  }),
);

export const insertDestinationSchema = createInsertSchema(destinationsTable).omit({ id: true });
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;