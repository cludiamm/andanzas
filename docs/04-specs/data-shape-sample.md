# Data shape sample (for schema design only — not the full dataset)

Real seed data lives in /seed-private/trips.json (gitignored, not in this repo).
Votes are per-place (not per-city) — each place has its own 1-5 rating from
each family member. Not everyone votes on every place, and some places have
no votes yet (proposed but not yet rated).

```json
{
  "trip": { "name": "Japan & South Korea 2023" },
  "destinations": [
    {
      "country": "Japan", "city": "Tokyo", "estimated_days": 4.0,
      "places": [
        {
          "name": "Sensoji Temple",
          "votes": {"Claudia": 5, "Gaby": 5, "Lucky": 4, "Luis": 3, "Diego": 5, "Vero": 5, "Dorjaen": 4},
          "total": 31, "price": "Free", "hours": "06:30 to 17:00"
        },
        {
          "name": "Akihabara",
          "votes": {},
          "total": null, "price": "Free", "notes": "street of electronics shops"
        }
      ]
    }
  ]
}
```
