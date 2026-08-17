# Andanzas — The Planning Methodology

*Stage 0 artifact. The differentiator, written down.*
*Extracted from ~7 years of trips (2019–2026). Version 1.0 — August 2026.*

---

## Why this document exists

The strategy brief claims a "field-tested curation methodology refined since 2017" as the core differentiator. Until now that methodology existed only in Claudia's head and in a series of spreadsheets. **If it can't be articulated, it can't be defended, encoded, or tested — and the product is a wrapper.** This is the asset.

---

## 0. The frame

**A journey is lived three times: when we dream it, when we experience it, and when we remember it.**
*(Widely circulated traveller's saying, no verifiable author — use as "there's a saying," don't attribute.)*

Andanzas lives in **stage one** — the dreaming and planning — but exists to **maximize stages two and three.** Planning is part of the trip, not a chore to be eliminated.

**The role model for the system is the co-admin, not the travel agent.**
Even on a solo trip, Claudia planned with a co-admin. The unit of planning is never one person — it is *a planner and a thinking partner*. The partner researches in parallel, remembers the forgotten constraint, says "that doesn't fit," and hands the decision back. Every design question reduces to: **would a good co-admin do this, or would it be overstepping?**

**The competitive claim: curation without abdication.**
People buy from agencies to skip research hours. The hidden cost is preference alignment — they accept places that aren't theirs and don't get the experience they paid for. Andanzas removes the drudgery without removing the ownership.

---

## 1. Segment

**Primary:** people who *want* to plan and need better tools.

**Served indirectly:** people who don't want to plan at all. One planner does the work; the rest of the group votes (or doesn't) and receives the built itinerary.

**Structural consequence:** every trip requires exactly one motivated planner. No planner, no trip. **The top of funnel is planners, never groups.** Value is delivered to the planner; growth comes from passengers who become planners for their own next trip. Design the passenger path to be near-frictionless, and design the conversion deliberately.

**Roles observed in practice:**

| Role | Behaviour | Product need |
|---|---|---|
| **Planner / Admin** (1–2 per trip) | Runs the whole process | The full system |
| **Collaborator** | Proposes places, votes, argues in the meeting | Lightweight participation |
| **Informed Traveller** | Wants to know, not decide; pays for what the admin reserves | Visibility + payment, nothing else |

The Informed Traveller is **observed, not hypothesised** — a friend on the Patagonia trip occupies exactly this role. Most group members are this. Most of the product has been designed for the admins.

**Parked (Later, unvalidated):** travel agents using Andanzas to plan for clients. Real market, different product (multi-trip, client billing, white-label), and in tension with the problem statement. Do not let it shape the first build.

---

## 2. Selection rules — which places survive

**2.1 Trips are desire-seeded.** A trip begins because someone wants to see a *specific* place. Seed places enter the list first and anchor everything. The system must support "I want to see the Ghibli Museum, build Japan around it" — not just "suggest Japan."

**2.2 The proposal pool is unlimited.** Any member adds any place, with links, opening hours, ticket prices, and estimated days. No cap at proposal time. Constraint comes later, and from reality — not from a quota.

**2.3 Advocacy precedes voting.** An online meeting where each member presents their places and argues why each should stay. **This is where the reasoning lives, and it is currently thrown away** — voting captures the verdict, not the argument. Without it, recognisable places beat better ones.

**2.4 Voting filters, typically at 4–5 stars.** Only high-scoring places shortlist.

**2.5 The must-visit exemption — one per member.** Each member designates exactly ONE place that bypasses voting entirely.

> **This is a fairness mechanic, not a round number.** It exists to stop the majority erasing a minority preference. Without it, a member can propose, advocate, and lose everything — and travels on someone else's trip.

**2.6 The only valid overrides on a must-visit:** it is *too far* from the other places, or *too expensive*. Both are **computable**. Distance and cost are deterministic checks, never judgment calls.

**2.7 N = 10.** A larger candidate set confuses the planner rather than helping. Optimise for decidability, not coverage.

---

## 3. Composition rules — how a day is built

**3.1 Two day shapes:**

- **Circled path** — visit places arranged geographically in a loop around the accommodation; start and end on foot at the accommodation.
- **Linear path** — either start at the nearest place and work outward, returning by bus/train; or start at the farthest and finish nearest the accommodation.

**3.2 Balance rules:**
- No more than **2 museums** in one day.
- Distribute **parks and open-air activities** across the trip rather than clustering.
- Always leave time to **sleep, rest, eat, and enjoy**. A full day is not a good day.

**3.3 Opening days and hours override geography.** Two places that are physically adjacent may not be same-day if their opening schedules conflict. **Geography proposes; the calendar disposes.**

**3.4 The calendar assigns a time frame per activity** that may be over- or under-run. Its purpose is **visibility, not enforcement.**

---

## 4. Operations rules — what anchors what

**4.1 The dependency chain.**
Entry and exit points (flights) → trip direction → places that fit → accommodation → local transport → daily route → calendar.

**4.2 Accommodation and transport are the anchors.** The itinerary arranges itself around *where you sleep* and *how you move*. Accommodation is chosen to be cheap enough and either walkable to the chosen places or near a bus/train link.

**4.3 Flight booking is the hard commit point.** Dates are soft until flights are booked. It can happen at any point in the sequence.

**4.4 Commitment is per-item, not per-trip.**

Every item — place, accommodation, transport leg, ticket — carries its own state:

> **proposed → shortlisted → held → booked**

A trip's "phase" is an emergent read of how many items have crossed over. This matters because:
- **Change cost becomes computable.** Cutting a *proposed* place is free; cutting a *booked* one costs money and breaks dependencies.
- **The watch queue is defined.** Anything *shortlisted but not booked* is what needs monitoring.
- **The late-joiner problem becomes tractable.** Query which committed items are per-person and need duplication.

**4.5 The loop is the product.** The linear steps are a fiction — in practice places are added and removed continuously, and every artifact (map, calendar, transport, costs) must be re-checked. **This constraint propagation is the real work, and nobody has automated it for travel.**

---

## 5. Money rules

**5.1 There is no global budget.** Instead: **a ceiling per category** (e.g. accommodation per person in the target area), with a fallback to the cheapest available if nothing fits.

**5.2 Cost is a discussion input, not a filter.** Prices are researched, then debated in the meeting to decide keep-or-drop.

**5.3 Tracking begins at booking.** Who paid, price per person, two currencies (local + Quetzales).

**5.4 Reconciliation is post-hoc and deterministic.** Total per person and who-owes-whom is compiled at the end of planning, with the cut made *before* the trip. **This is arithmetic. No model touches it, ever.**

**5.5 The real metric is coverage, not spend.** "€2,400 spent" is meaningless without knowing whether that's 40% or 90% of the final total. Show **committed** (booked, real) alongside **projected** (shortlisted, estimated); the gap is the honest answer to "am I okay?"

**5.6 Never restrict.** Monitor and surface. Not every user has budget freedom, and a hard gate turns a planning tool into a scold.

---

## 6. During-trip rules

**6.1 The during-trip product is a decision aid, not an editor.**

> *"The plan is not updated but is a tool to make decisions."*

When a ferry strike in Greece killed the Santorini leg, the need was not to re-plan on a phone. It was to **see what skipping Santorini would cost** and decide. Read-mostly, plus scenario queries against a plan that stays intact.

**This is the opposite of what every travel app builds.** They assume you want to edit the itinerary on the move. Smaller build, better product.

**6.2 Actual during-trip usage:** displaying ticket QR codes, boarding passes, visa/insurance/migration documents; and the calendar as a daily reference — what to see, when to catch a bus or call an Uber.

**6.3 Offline is a feature, not an architectural constraint.** The Drive folder is downloaded as insurance; connectivity is normally available. Roadmap item, not a design driver.

**6.4 Personal expense logging during the trip** — unplanned spending, per traveller. Nice-to-have.

---

## 7. What the methodology cannot reach

The three gaps that unlimited time would not solve. **This is the case for AI in Andanzas, and the answer to "why isn't this just a faster spreadsheet."**

**7.1 Staleness.** Curated information decays — prices drift, hours change, venues close. A human cannot maintain 40 places across 3 countries, and re-researching before every trip defeats the purpose. **Corpus maintenance is what turns a decaying asset into an appreciating one.**

**7.2 Tacit on-site knowledge.** Which entrance to use, what to expect, what goes wrong. It exists only in the heads of people who've been, or scattered across blogs and videos. **This is precisely what agencies provide and DIY loses** — and closing it is how stage one maximizes stage two.

**7.3 Preference elicitation.** People don't know what they want but still want their dream trip. Reading each traveller's preferences is impossible even with unlimited time. **An interview is the only known instrument for this** — the same mechanic as an interview-driven discovery skill, arrived at independently in two domains.

---

## 8. Constraints — what must never change

1. **Reconciliation, cost splits, currency conversion, distance and price checks stay deterministic.** No model.
2. **The must-visit exemption is inviolable** except by the two computable overrides.
3. **Opening hours are hard.** A schedule that violates them is not a lesser answer; it is a wrong one.
4. **The system proposes, the planner disposes.** The co-admin test. Never auto-book, never auto-cut.
5. **Advocacy is not replaced.** The system may draft the case for a place; the group still argues and votes.
6. **The manual path stays fully functional.** Everything must work with the model switched off.

---

## Open questions for stage 1

- Which countries are in the curated corpus at launch? *(Recommendation: restrict the operational domain — "we do Japan, Spain, Argentina properly" beats "everywhere, adequately." Expand only when curation exists.)*
- What is the unit of work? *(Deferred to stage 3 — pricing follows the unit of work, which follows from the AI decisions. Signal to park: the Patagonia friend already pays for what Claudia reserves — someone is transacting inside this workflow.)*
- How does a passenger convert into a planner?