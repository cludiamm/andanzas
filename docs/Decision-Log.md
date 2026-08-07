# Decision Log

Format: Date — Decision — Why

- 2026-08-06 — Working name locked as "Andanzas" for the portfolio sprint —
  avoids friction of building without a name; cheap to change later.
- 2026-08-06 — Repo is public, License = None (all-rights-reserved default)
  — supports portfolio visibility now; revisit if real personal data enters
  the repo or monetization plans firm up.
- 2026-08-06 — MVP scope = place voting only (solo + group), no finance/
  reservations/mobile — keeps the 1-2 day sprint achievable.
- 2026-08-06 — Real trip data never committed to GitHub — Claude Code/Agent
  gets an anonymized sample only; full sanitized data goes directly into
  Replit, personal-info tab excluded entirely.
- 2026-08-07 — Auth approach resolved: no user accounts. Voting uses a lightweight name-per-visit identity instead — a shared login would have made every visitor appear as the same voter, undermining the group-consensus feature we most want to demonstrate.
- 2026-08-07 — Seed data resolved: real family trip data from "Japan & South Korea 2026" (Busan, Seoul, Miyajima, Hokkaido, Osaka, Kyoto, Tokyo — 7 destinations, 47 places, 322 individual ratings). The personal-info tab and full itinerary/finance file were excluded entirely; only place-voting data was used.
- 2026-08-07 — Place images sourced via the Unsplash API (properly licensed, matched by place name + city) rather than general web scraping.
