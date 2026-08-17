# 0001 — Curate over retrieved reality, don't generate from weights

**Date:** 2026-08-17
**Status:** Accepted
**Supersedes:** the place-generation step in the v0 build brief

---

## Context

The v0 build brief specified that when a trip is created, the backend calls a language model to generate a list of ten suggested places for the destination, saves them, and offers them to the group for voting.

The strategy brief states the product's differentiator as a field-tested curation methodology, explicitly *not* generic AI-generated itineraries.

These two statements are incompatible. A model producing candidate places from its own training data is generic AI-generated content — the exact thing the strategy positions against. The model had been handed the job that was supposed to be the product's own.

There is also a correctness problem independent of strategy. Opening hours, ticket prices, and closure status are precisely the facts a language model invents most confidently. The failure is delayed and asymmetric: a hallucinated venue looks correct at planning time and fails on the ground, in another country, when the user can no longer do anything about it. The user cannot evaluate the output at the moment they receive it.

## Decision

**Retrieve candidates from a real source, then use the model to curate and explain — never to recall.**

1. Pull a larger candidate set (40–60 places) for the destination from a places API, carrying real hours, location, and price data.
2. The model's job is to *select* from that set and *explain why each one is here*, applying the documented selection rules.
3. Every suggestion is traceable to a real record. No place enters the pool that doesn't exist in retrieved data.

## Consequences

**Positive**

- The AI moves out of the expensive-to-be-wrong quadrant. Selection with a stated reason is high-variance but cheap to be wrong — a mediocre suggestion simply loses the vote.
- The methodology becomes the differentiator in practice, not just in the brief. "Which ten, and why" *is* the curation method, and it can be versioned, tested, and defended.
- Grounded suggestions carry real operating hours, which the downstream calendar solver requires anyway.
- Answers the wrapper test: proprietary selection logic over retrieved state, with vote signal available as a feedback loop.

**Negative**

- Adds a places API dependency, with associated cost and rate limits.
- Coverage is now bounded by the API's data quality, which varies by region — this constrains which destinations can launch.
- More moving parts than a single model call.

**Follow-on decisions required**

- Which places API, and what the per-trip cost is.
- Which countries launch first, gated on verified data quality rather than on curation labour.
- What the model does when retrieval returns too few viable candidates. ("I don't know" must be a valid output.)