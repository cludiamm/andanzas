# Andanzas — Case Study

## The problem
Travel agencies sell "the perfect trip" but deliver a rushed, one-size-fits-all
itinerary — fixed hours per stop, commission-driven restaurants, souvenir
stops that serve the agency's margin more than the traveler's interest. The
alternative, full DIY planning, is a second job. Andanzas is a structured
middle path: curated place options plus group or solo voting, built on a
trip-planning methodology refined since 2017.

## What I built
An MVP focused on one feature, deliberately: curated place options with
group and solo voting. Non-goals for this phase: finance tracking,
reservations, mobile app, user accounts. Full spec: `docs/04-specs/`.

## Process
Strategy, market research, competitive analysis, and specs were done in
Claude — including a JTBD-driven persona exercise and a competitive scan of
Wanderlog, TripIt, Mindtrip, and group-voting apps like Troupe and
WePlanify to find the actual gap: nobody combines curated, field-tested
place selection with both solo and group voting in one system. The app
itself was built with Replit's Agent, working from those specs.

## Key decisions
- **No user accounts.** Voting uses a lightweight name-per-visit identity
  instead of full auth — a shared demo login would have made every visitor
  appear as the same voter, hiding the one feature most worth showing:
  group consensus.
- **Real data, handled carefully.** The seed data is a real family trip
  (Japan & South Korea 2026 — 7 destinations, 47 places, 322 individual
  ratings), not placeholder content. A file containing personal and
  financial information about named individuals was identified during
  handoff and excluded entirely from anything committed to source control
  or seeded into the app.
- **Scope discipline.** Finance tracking and a reservations vault are real
  parts of the long-term product vision but were deliberately cut from
  this sprint to ship a working, testable core loop first.

## What's next
Finance/budget tracking and a reservations & tickets vault (`Next` phase);
PWA/offline support and monetization model (`Later` phase). Full roadmap in
`docs/01-strategy/strategy-brief.md`.

## Links
- **Live demo**: https://andanzas-trip-planner.replit.app/
- **Source**: this repository
