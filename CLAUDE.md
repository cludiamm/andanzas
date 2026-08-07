# Andanzas — Trip Planner Assistant

## What this is
A trip-planning app: curated place options + group/solo voting, replacing
rushed agency-style trip planning. Built as a PM portfolio piece (fast
prototyping with Claude + Replit) and a personal project intended for
eventual fair monetization.

## Full context
Read docs/01-strategy/strategy-brief.md and docs/02-research/personas.md
before making product decisions. Read docs/04-specs/ before touching a
feature — each file maps 1:1 to a feature module.

## Current MVP scope (Now phase)
Curated place options + group/solo voting only. No finance tracking, no
reservations vault, no mobile app, no user accounts yet (open decision —
see docs/Decision-Log.md).

## Tech stack
Node.js / React, Replit-hosted database for persistence. Deployed on Replit.

## Data handling — important
Never commit real trip data or personal information to this repo. Claude
Code / Agent should only ever see the anonymized sample in docs/04-specs/.
Real seed data lives outside git, uploaded directly into the Replit
workspace, gitignored.

## Folder structure
See docs/ — numbered by category (01-strategy, 02-research, etc.).
docs/Glossary.md and docs/Decision-Log.md track terms and running decisions.
