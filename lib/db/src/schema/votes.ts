import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { placesTable } from "./places";
import { tripsTable } from "./trips";

export const votesTable = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    tripId: integer("trip_id")
      .notNull()
      .references(() => tripsTable.id, { onDelete: "cascade" }),
    placeId: integer("place_id")
      .notNull()
      .references(() => placesTable.id, { onDelete: "cascade" }),
    voterId: text("voter_id").notNull(),
    mode: text("mode").notNull(),
  },
  (table) => ({
    voterPlaceUnique: unique("votes_trip_place_voter_unique").on(
      table.tripId,
      table.placeId,
      table.voterId,
    ),
  }),
);

export const insertVoteSchema = createInsertSchema(votesTable).omit({ id: true });
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votesTable.$inferSelect;