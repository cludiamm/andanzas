import { Router, type IRouter } from "express";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { db, placesTable, tripsTable, votesTable } from "@workspace/db";
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

const sampleTrips = [
  {
    trip: {
      title: "A long weekend in Lisbon",
      destination: "Lisbon, Portugal",
      dates: "May 16–19, 2026",
      description:
        "Three sunlit days of tiled streets, late lunches, and the best viewpoints in the city.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=85",
    },
    places: [
      {
        name: "Miradouro da Senhora do Monte",
        city: "Graça",
        category: "Viewpoint",
        description:
          "The quietest big view of Lisbon, with the castle and red roofs opening out below.",
        imageUrl:
          "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Time Out Market",
        city: "Cais do Sodré",
        category: "Food hall",
        description:
          "A lively first-night landing spot for small plates, local wine, and a little people watching.",
        imageUrl:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Praia da Ursa",
        city: "Sintra",
        category: "Beach",
        description:
          "A wild Atlantic cove for the day when the itinerary needs salt air and no reservations.",
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Museu Nacional do Azulejo",
        city: "Xabregas",
        category: "Culture",
        description:
          "A beautiful former convent filled with the blue-and-white stories of Portugal.",
        imageUrl:
          "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    trip: {
      title: "The Dolomites, slowly",
      destination: "South Tyrol, Italy",
      dates: "September 4–9, 2026",
      description:
        "A mountain reset built around easy mornings, dramatic trails, and long dinners.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1400&q=85",
    },
    places: [
      {
        name: "Lago di Braies",
        city: "Prags",
        category: "Lake",
        description:
          "An early-morning walk around the milky-blue lake before the day-trippers arrive.",
        imageUrl:
          "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Seceda Ridgeline",
        city: "Val Gardena",
        category: "Hike",
        description:
          "The iconic ridge, reached by cable car and best lingered over rather than rushed.",
        imageUrl:
          "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Alpe di Siusi",
        city: "Castelrotto",
        category: "Meadow",
        description:
          "A wide, gentle landscape for the day when the only plan is to keep walking.",
        imageUrl:
          "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    trip: {
      title: "Kyoto after dark",
      destination: "Kyoto, Japan",
      dates: "November 6–11, 2026",
      description:
        "Lantern-lit lanes, tiny bars, and the particular magic of an autumn evening in Kyoto.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=85",
    },
    places: [
      {
        name: "Pontocho Alley",
        city: "Nakagyo",
        category: "Nightlife",
        description:
          "A narrow lantern-lit lane where the best evening plan is to choose a door and see.",
        imageUrl:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Fushimi Inari Taisha",
        city: "Fushimi",
        category: "Temple",
        description:
          "Walk beneath thousands of vermilion gates after the crowds have thinned.",
        imageUrl:
          "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Nishiki Market",
        city: "Nakagyo",
        category: "Market",
        description:
          "A colorful street of pickles, tea, skewers, and the perfect excuse to graze.",
        imageUrl:
          "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
];

let seedPromise: Promise<void> | undefined;

async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [{ value: tripCount }] = await db
        .select({ value: count() })
        .from(tripsTable);
      if (Number(tripCount) > 0) return;

      for (const sample of sampleTrips) {
        const [trip] = await db.insert(tripsTable).values(sample.trip).returning();
        await db.insert(placesTable).values(
          sample.places.map((place) => ({ ...place, tripId: trip.id })),
        );
      }
    })().catch((error) => {
      seedPromise = undefined;
      throw error;
    });
  }
  await seedPromise;
}

function displayNameFromRequest(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

async function getPlaceCounts(tripId: number, displayName?: string) {
  const rows = await db
    .select({
      id: placesTable.id,
      tripId: placesTable.tripId,
      name: placesTable.name,
      city: placesTable.city,
      category: placesTable.category,
      description: placesTable.description,
      imageUrl: placesTable.imageUrl,
      voteCount: count(votesTable.id),
      isVoted: displayName
        ? sql<boolean>`bool_or(${votesTable.displayName} = ${displayName})`
        : sql<boolean>`false`,
      voters: sql<string[]>`coalesce(
        array_agg(distinct ${votesTable.displayName})
          filter (where ${votesTable.displayName} is not null),
        ARRAY[]::text[]
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
    isVoted: Boolean(row.isVoted),
    voters: row.voters ?? [],
  }));
}

router.get("/trips", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const trips = await db.select().from(tripsTable).orderBy(desc(tripsTable.id));
  const results = await Promise.all(
    trips.map(async (trip) => {
      const places = await getPlaceCounts(trip.id);
      return {
        ...trip,
        placeCount: places.length,
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
  const result = {
    ...trip,
    placeCount: places.length,
    totalVotes: places.reduce((sum, place) => sum + place.voteCount, 0),
    places,
  };
  res.json(GetTripResponse.parse(result));
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
  const result = {
    tripId: trip.id,
    totalVotes: places.reduce((sum, place) => sum + place.voteCount, 0),
    leadingPlace: places[0]?.voteCount > 0 ? places[0].name : null,
    places: places.map((place) => ({
      placeId: place.id,
      name: place.name,
      voteCount: place.voteCount,
    })),
  };
  res.json(GetTripSummaryResponse.parse(result));
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