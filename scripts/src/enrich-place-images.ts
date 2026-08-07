/**
 * One-time enrichment script: fetches an Unsplash photo for every place that
 * lacks one, stores the URL and attribution, then exits.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run enrich-place-images
 *
 * Requires the UNSPLASH_KEY environment variable (Access Key from the
 * Unsplash developer dashboard).
 */

import { db, placesTable } from "@workspace/db";
import { isNull, or } from "drizzle-orm";
import { eq } from "drizzle-orm";

const UNSPLASH_KEY = process.env.UNSPLASH_KEY;
if (!UNSPLASH_KEY) {
  console.error("UNSPLASH_KEY environment variable is not set.");
  process.exit(1);
}

interface UnsplashResult {
  urls: { regular: string };
  user: { name: string; links: { html: string } };
}

interface UnsplashSearchResponse {
  results: UnsplashResult[];
}

async function searchUnsplash(query: string): Promise<UnsplashResult | null> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_KEY}`,
      "Accept-Version": "v1",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Unsplash API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as UnsplashSearchResponse;
  return data.results[0] ?? null;
}

// Polite delay between API calls to stay well under the 50 req/hr Demo limit.
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Fetch all places that are missing an image.
  const places = await db
    .select({
      id: placesTable.id,
      name: placesTable.name,
      city: placesTable.city,
    })
    .from(placesTable)
    .where(or(isNull(placesTable.imageUrl)));

  console.log(`Found ${places.length} place(s) without an image.`);

  let enriched = 0;
  let fallback = 0;
  let failed = 0;

  for (const place of places) {
    const specificQuery = `${place.name} ${place.city}`;
    console.log(`  → Searching: "${specificQuery}"`);

    let result = await searchUnsplash(specificQuery);
    let usedFallback = false;

    if (!result) {
      console.log(`    No result — falling back to city: "${place.city}"`);
      result = await searchUnsplash(place.city);
      usedFallback = true;
    }

    if (!result) {
      console.warn(`    ✗ No image found for "${place.name}" (${place.city})`);
      failed++;
      await sleep(400);
      continue;
    }

    await db
      .update(placesTable)
      .set({
        imageUrl: result.urls.regular,
        imageAttributionName: result.user.name,
        imageAttributionUrl: `${result.user.links.html}?utm_source=andanzas&utm_medium=referral`,
      })
      .where(eq(placesTable.id, place.id));

    if (usedFallback) {
      fallback++;
      console.log(`    ✓ Fallback image saved (${result.user.name})`);
    } else {
      enriched++;
      console.log(`    ✓ Image saved (${result.user.name})`);
    }

    // ~1.4 seconds between calls → safely under the 50 req/hr cap.
    await sleep(1400);
  }

  console.log(
    `\nDone. ${enriched} specific, ${fallback} fallback, ${failed} failed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
