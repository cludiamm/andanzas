import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { db, destinationsTable, placesTable, tripsTable, votesTable } from "@workspace/db";

type SeedPlace = {
  name: string;
  votes?: Record<string, number>;
  price?: string;
  hours?: string;
  notes?: string;
};

type SeedDestination = {
  country: string;
  city: string;
  estimated_days: number;
  places: SeedPlace[];
};

type SeedFile = {
  trip: { name: string };
  destinations: SeedDestination[];
};

const configuredPath = process.env.SEED_PATH ?? "/seed-private/trips.json";
const workspacePath = "/home/runner/workspace/seed-private/trips.json";

async function resolveSeedPath() {
  try {
    await access(configuredPath);
    return configuredPath;
  } catch {
    await access(workspacePath);
    return workspacePath;
  }
}

function descriptionFor(place: SeedPlace) {
  return [place.notes, place.price ? `Price: ${place.price}` : null, place.hours ? `Hours: ${place.hours}` : null]
    .filter(Boolean)
    .join(" · ") || "A place to consider for the itinerary.";
}

async function main() {
  const seedPath = await resolveSeedPath();
  const seed = JSON.parse(await readFile(seedPath, "utf8")) as SeedFile;

  if (!seed.trip?.name || !Array.isArray(seed.destinations)) {
    throw new Error(`Invalid trip seed: expected trip.name and destinations in ${seedPath}`);
  }

  let destinationCount = 0;
  let placeCount = 0;
  let ratingCount = 0;

  await db.transaction(async (tx) => {
    // Replace the old placeholder-only database contents as part of this
    // one-time import. The live app no longer creates placeholder rows.
    await tx.delete(tripsTable);

    const [trip] = await tx
      .insert(tripsTable)
      .values({
        title: seed.trip.name,
        destination: "Japan & South Korea",
        dates: "2026",
        description: "A family shortlist of places across Japan and South Korea.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1400&q=85",
      })
      .returning({ id: tripsTable.id });

    for (const destinationSeed of seed.destinations) {
      const [destination] = await tx
        .insert(destinationsTable)
        .values({
          tripId: trip.id,
          country: destinationSeed.country,
          city: destinationSeed.city,
          estimatedDays: destinationSeed.estimated_days,
        })
        .returning({ id: destinationsTable.id });
      destinationCount += 1;

      for (const placeSeed of destinationSeed.places) {
        const [place] = await tx
          .insert(placesTable)
          .values({
            tripId: trip.id,
            destinationId: destination.id,
            name: placeSeed.name,
            city: destinationSeed.city,
            category: "Place to consider",
            description: descriptionFor(placeSeed),
            imageUrl: null,
            price: placeSeed.price ?? null,
            hours: placeSeed.hours ?? null,
            notes: placeSeed.notes ?? null,
          })
          .returning({ id: placesTable.id });
        placeCount += 1;

        const ratings = Object.entries(placeSeed.votes ?? {});
        if (ratings.length > 0) {
          await tx.insert(votesTable).values(
            ratings.map(([displayName, rating]) => ({
              tripId: trip.id,
              placeId: place.id,
              displayName,
              mode: "group",
              rating,
            })),
          );
          ratingCount += ratings.length;
        }
      }
    }
  });

  console.log(
    `Imported ${seed.trip.name}: ${destinationCount} destinations, ${placeCount} places, ${ratingCount} ratings from ${seedPath}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { pool } = await import("@workspace/db");
    await pool.end();
  });