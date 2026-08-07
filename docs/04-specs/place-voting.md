# Spec: Place Voting (MVP)

## Problem Statement
Travelers want to be part of planning their trip without either ceding
full control to a rushed agency itinerary or doing all the destination
research themselves.

## Goals
- Let a user curate a shortlist of place options for a trip
- Let one person (solo) or several people (group) vote on those options
- Surface which places have the most votes, persisted across sessions

## Non-Goals
- Finance/budget tracking
- Reservations & tickets vault
- Mobile app / offline support
- User accounts and authentication (open decision, see Decision-Log.md)

## Success Metrics
- A full vote-and-result cycle works end to end with real seed data
- Demo is stable enough to hand a live link to a recruiter without errors

## Background
See docs/01-strategy/strategy-brief.md and docs/02-research/personas.md.

## Proposed Solution
Trip → list of Place options → Vote (solo: save favorite; group: multiple
voters, tally shown) → Result view.

## Open Questions
- Auth approach for MVP (real accounts vs. shared link)
- Which past trips become the seed data
