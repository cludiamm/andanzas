# Andanzas

A trip planning system for people who *want* to plan and need better tools — built around a planning methodology refined across seven years of real trips.

The design frame is deliberate: the system plays the role of a **co-admin**, not a travel agent. It researches in parallel, remembers the constraint you forgot, and says "that doesn't fit" — then hands the decision back to you. The competing claim is *curation without abdication*: remove the drudgery of planning without removing the ownership of it.

---

## What this repository is

This is an in-progress product, not a finished case study. It's also a record of the product decisions — including the ones that were reversed.

| | |
|---|---|
| **[The methodology](docs/01-strategy/methodology.md)** | The planning rules, extracted and written down. The core artifact. |
| **[Strategy](docs/01-strategy/)** | Vision, strategy, AI insertion decisions. |
| **[Evals](docs/02-evals/)** | Golden sets and test cases for the non-deterministic components. |
| **[Decision records](docs/decisions/)** | One file per significant call, including reversals. |
| **[v0 case study](docs/00-case-study-v0/)** | The original portfolio exercise, archived unedited. Tag `v0-portfolio`. |

---

## v0 — the portfolio exercise

The first version was a portfolio case study scoped to a single feature: collaborative voting on places for a group trip. It assumed the product's shape was *propose → vote → generate itinerary*, with AI producing a list of suggested places and then assembling them into a day-by-day plan.

It's preserved unedited in [`docs/00-case-study-v0/`](docs/00-case-study-v0/) and frozen at tag `v0-portfolio`.

## What discovery changed

A structured discovery process against seven years of real trip data invalidated several of v0's core assumptions.

**The model was eating the differentiator.** v0 had AI generating candidate places from its own weights. But the stated differentiator was a curation methodology — so the model was quietly replacing the thing that was supposed to be proprietary. The correction: AI is hired here for *research compression*, not itinerary invention. Retrieve real candidates from a places API, then have the model select and explain. **Curate over retrieved reality; never recall from weights.**

**The calendar is a solver problem, not a generation problem.** Its inputs are all hard constraints — fixed-date tickets, opening hours, geography, accommodation as anchor, path pattern, days available. A language model is a poor solver and a good explainer. The itinerary is computed deterministically against the methodology's path rules; the model's job is to explain trade-offs and propose alternatives when constraints collide.

**The hard part isn't research. It's operations.** Choosing what to see is a small fraction of the work. The rest is capture, sequencing, reconciliation and constraint propagation — when one item changes, every dependent artifact must be re-checked.

**Budget tracking, maps, and collaborative itineraries are table stakes.** The category is crowded and largely free. These belong in the product because it's incomplete without them, but they are not the reason to build it.

**The real gaps are the ones a human planner can't close:** curated information decaying over time, tacit on-site knowledge that only exists in the heads of people who've been there, and preference elicitation for travellers who don't yet know what they want. Those are the case for AI in this product.

---

## Status

Early. Strategy and methodology are documented; vision, AI decisions, evals, and build are in progress.

<!--
TODO before publishing:
- Add a screenshot or diagram once there's something to show
- Add a stack/setup section once the build starts
- Confirm the licence
-->