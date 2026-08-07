import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { destinationsTable } from "./destinations";
import { tripsTable } from "./trips";

export const placesTable = pgTable("places", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
    destinationId: integer("destination_id").references(() => destinationsTable.id, {
      onDelete: "set null",
    }),
  name: text("name").notNull(),
  city: text("city").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  price: text("price"),
  hours: text("hours"),
  notes: text("notes"),
});

export const insertPlaceSchema = createInsertSchema(placesTable).omit({ id: true });
export type InsertPlace = z.infer<typeof insertPlaceSchema>;
export type Place = typeof placesTable.$inferSelect;