import { Router, type IRouter } from "express";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import {
  db,
  destinationsTable,
  placesTable,
  tripsTable,
  votesTable,
} from "@workspace/db";
import {
  CastVoteBody,
  CastVoteParams,
  CastVoteResponse,
  GetTripParams,
  GetTripQueryParams,
  GetTripResponse,
  GetTripSummaryParams,
  GetTripSummaryQueryParams,
  GetTripSummaryResponse,
  ListTripsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Seeding is an explicit one-time operation. Requests must never recreate or
// overwrite user data with placeholder content.
async function ensureSeeded(): Promise<void> {
  return;
}

function displayNameFromRequest(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

async function getPlaceCounts(tripId: number, displayName?: string) {
  const rows = await db
    .select({
      id: placesTable.id,
      tripId: placesTable.tripId,
      destinationId: placesTable.destinationId,
      name: placesTable.name,
      city: placesTable.city,
      category: placesTable.category,
      description: placesTable.description,
      imageUrl: placesTable.imageUrl,
      price: placesTable.price,
      hours: placesTable.hours,
      notes: placesTable.notes,
      voteCount: count(votesTable.id),
      ratingTotal: sql<number>`coalesce(sum(${votesTable.rating}), 0)`,
      ratingAverage: sql<number | null>`avg(${votesTable.rating})`,
      isVoted: displayName
        ? sql<boolean>`bool_or(${votesTable.displayName} = ${displayName})`
        : sql<boolean>`false`,
      voters: sql<string[]>`coalesce(
        array_agg(distinct ${votesTable.displayName})
          filter (where ${votesTable.displayName} is not null),
        ARRAY[]::text[]
      )`,
      ratings: sql<Array<{ displayName: string; rating: number }>>`coalesce(
        json_agg(
          json_build_object(
            'displayName', ${votesTable.displayName},
            'rating', ${votesTable.rating}
          )
        ) filter (where ${votesTable.rating} is not null),
        '[]'::json
      )`,
    })
    .from(placesTable)
    .leftJoin(
      votesTable,
      and(eq(votesTable.placeId, placesTable.id), eq(votesTable.tripId, tripId)),
    )
    .where(eq(placesTable.tripId, tripId))
    .groupBy(placesTable.id)
    .orderBy(desc(count(votesTable.id)), asc(placesTable.id));

  return rows.map((row) => ({
    ...row,
    voteCount: Number(row.voteCount),
    ratingTotal: Number(row.ratingTotal),
    ratingAverage: row.ratingAverage === null ? null : Number(row.ratingAverage),
    isVoted: Boolean(row.isVoted),
    voters: row.voters ?? [],
    ratings: row.ratings ?? [],
  }));
}

async function getDestinations(
  tripId: number,
  places: Awaited<ReturnType<typeof getPlaceCounts>>,
) {
  const destinations = await db
    .select()
    .from(destinationsTable)
    .where(eq(destinationsTable.tripId, tripId))
    .orderBy(asc(destinationsTable.id));

  return destinations.map((destination) => ({
    ...destination,
    places: places.filter((place) => place.destinationId === destination.id),
  }));
}

router.get("/trips", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const trips = await db.select().from(tripsTable).orderBy(desc(tripsTable.id));
  const results = await Promise.all(
    trips.map(async (trip) => {
      const places = await getPlaceCounts(trip.id);
      const destinations = await getDestinations(trip.id, places);
      return {
        ...trip,
        placeCount: places.length,
        destinationCount: destinations.length,
        totalVotes: places.reduce((sum, place) => sum + place.voteCount, 0),
        leadingPlace: places[0]?.voteCount > 0 ? places[0].name : null,
      };
    }),
  );
  res.json(ListTripsResponse.parse(results));
});

router.get("/trips/:tripId", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = GetTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const query = GetTripQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const [trip] = await db
    .select()
    .from(tripsTable)
    .where(eq(tripsTable.id, params.data.tripId));
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  const places = await getPlaceCounts(
    trip.id,
    displayNameFromRequest(query.data.displayName),
  );
  const destinations = await getDestinations(trip.id, places);
  res.json(
    GetTripResponse.parse({
      ...trip,
      placeCount: places.length,
      totalVotes: places.reduce((sum, place) => sum + place.voteCount, 0),
      destinations,
      places,
    }),
  );
});

router.get("/trips/:tripId/summary", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = GetTripSummaryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const query = GetTripSummaryQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const [trip] = await db
    .select({ id: tripsTable.id })
    .from(tripsTable)
    .where(eq(tripsTable.id, params.data.tripId));
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  const places = await getPlaceCounts(
    trip.id,
    displayNameFromRequest(query.data.displayName),
  );
  res.json(
    GetTripSummaryResponse.parse({
      tripId: trip.id,
      totalVotes: places.reduce((sum, place) => sum + place.voteCount, 0),
      leadingPlace: places[0]?.voteCount > 0 ? places[0].name : null,
      places: places.map((place) => ({
        placeId: place.id,
        name: place.name,
        voteCount: place.voteCount,
      })),
    }),
  );
});

router.post(
  "/trips/:tripId/places/:placeId/vote",
  async (req, res): Promise<void> => {
    await ensureSeeded();
    const params = CastVoteParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const body = CastVoteBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    const [place] = await db
      .select({ id: placesTable.id, tripId: placesTable.tripId })
      .from(placesTable)
      .where(
        and(
          eq(placesTable.id, params.data.placeId),
          eq(placesTable.tripId, params.data.tripId),
        ),
      );
    if (!place) {
      res.status(404).json({ error: "Place not found" });
      return;
    }

    const existing = await db
      .select({ id: votesTable.id })
      .from(votesTable)
      .where(
        and(
          eq(votesTable.tripId, place.tripId),
          eq(votesTable.placeId, place.id),
          eq(votesTable.displayName, body.data.displayName),
        ),
      );

    if (existing[0]) {
      await db.delete(votesTable).where(eq(votesTable.id, existing[0].id));
    } else {
      await db.insert(votesTable).values({
        tripId: place.tripId,
        placeId: place.id,
        displayName: body.data.displayName,
        mode: body.data.mode,
        rating: null,
      });
    }

    const [updated] = await db
      .select({ voteCount: count(votesTable.id) })
      .from(votesTable)
      .where(and(eq(votesTable.tripId, place.tripId), eq(votesTable.placeId, place.id)));
    const [total] = await db
      .select({ totalVotes: count(votesTable.id) })
      .from(votesTable)
      .where(eq(votesTable.tripId, place.tripId));

    res.json(
      CastVoteResponse.parse({
        tripId: place.tripId,
        placeId: place.id,
        voteCount: Number(updated.voteCount),
        totalVotes: Number(total.totalVotes),
        isVoted: !existing[0],
        mode: body.data.mode,
      }),
    );
  },
);

export default router;