# 0002 — Split methodology constraints into invariants and configurable defaults

**Date:** 2026-08-17
**Status:** Accepted
**Supersedes:** §8 of `docs/01-strategy/methodology.md` v1.0

---

## Context

Methodology §8 was titled *"Constraints — what must never change"* and listed six items as inviolable. Three of them are physics or ethics — deterministic arithmetic, opening hours, propose-don't-dispose. Three of them are the author's personal planning taste, written in the same register and therefore indistinguishable from law:

- no more than 2 museums in a day (§3.2)
- exactly one must-visit per member (§2.5)
- the synchronous advocacy meeting happens (§2.3)

The methodology's own frame rejects this. The stated design test is *"would a good co-admin do this, or would it be overstepping?"* A good co-admin does not arrive with a rulebook; they learn the planner's. Silently enforcing "no two museums" on a traveller whose trip is deliberately built from museums is the definition of overstepping. The stated competitive claim is **curation without abdication** — the hidden cost of an agency being that you accept places that are not yours. Frozen composition rules substitute the author's taste for the agency's. That is abdication with a better origin story.

Three concrete costs followed:

1. **The golden set could not be built cleanly.** If "no 2 museums" is an invariant, a violation is a failure case. If it is a preference, the same violation may be correct service. Nothing in the document let a grader tell those apart, which would have encoded the author's taste into the ground truth and then measured the model's agreement with it.
2. **§7.3 contradicted §8.** Preference elicitation is named as one of the three gaps AI exists to close, and then the preferences were frozen. If the interview cannot move the composition rules, it is eliciting nothing.
3. **The addressable segment was silently capped** at people who plan the way the author plans — possibly the right call, but arriving by accident through a constraints list rather than as a stated operational domain.

## Decision

**Split §8 into invariants and defaults, and state them at different levels: invariants are outcomes, configurable defaults are mechanisms.**

An **invariant** is a property of the result. Violating it makes the output *wrong*.
A **default** is a mechanism for reaching that property. Violating it makes the output *someone else's trip* — permitted, but the system says out loud that it did so.

The three taste rules move down a level and are replaced by the outcome they were serving:

| Was frozen (mechanism) | Now the invariant (outcome) | Now configurable |
|---|---|---|
| No more than 2 museums per day | No day exceeds the trip's load budget | the budget value; per-place intensity and modality tags |
| Exactly one must-visit per member | Every member ends the shortlist with at least one place they chose still standing | the allowance (1, 2, scaled by trip length) |
| The advocacy meeting happens | Every shortlisted place carries its argument, not only its score | synchronous meeting vs. async written advocacy |

Generalising "no 2 museums" to a per-activity-type setting was considered and rejected: it produces a taxonomy that grows forever, a settings page nobody fills in, and no coverage of cases the taxonomy missed (four temples in a day is the same problem and would not be caught). Intensity and modality are the underlying primitive; activity type is a proxy for them.

### Governance of the configuration

Three governance models were considered — planner sets everything; group ratifies the fairness settings; settings fixed at creation and locked. All three are permission-based answers, and the methodology already contains a better principle in §5.6: *"Never restrict. Monitor and surface."* Written for money, it generalises. Configuration abuse works because it is invisible, not because it is permitted.

1. **The planner configures.** No ratification gate, no quorum. §1 establishes that one motivated planner is the whole top of funnel; a blocking process step is paid for by the person the product depends on.
2. **The configuration freezes when proposals open.** This is a timing constraint, not a permission constraint — far cheaper to build, and it prevents the abuse that actually matters: watching votes arrive, seeing a preferred place lose, and raising the allowance retroactively. The rules are set before anyone knows what is at stake.
3. **The rules are disclosed to every member at invite,** in one plain sentence — *"This trip: one must-visit each, written advocacy, standard day load."* A sentence, not a settings screen.
4. **The system reports invariant violations to the planner** while they are still cheap to fix — *"Ana has no surviving place."*

## Consequences

**Positive**

- The golden set becomes gradeable across configurations. A grader can check "did every member keep something of theirs" without knowing that group's settings, because the invariant is an outcome. Checking mechanisms instead would require shipping each case's config alongside it.
- §7.3 now has something to act on. Preference elicitation can move the defaults, which is what makes it an interview rather than a survey.
- The differentiator survives the demotion. No competitor enforces day-load balance at all; the rule remains distinctive as an announced default. It stops being a law and starts being visible reasoning — *"I split these because two museums in a day is a slog"* — which is also the advocacy surface.
- Governance is transparency rather than permissions: cheaper to build than a ratification system and harder to route around, because the cost of tuning the rules becomes social rather than technical.
- Per-member outcome reporting is the first place the product takes a position on group dynamics rather than merely recording them. No competitor does this.

**Negative**

- New data requirements: per-place intensity and modality tags, and per-member outcome tracking across the proposal→shortlist transition.
- A configuration surface now exists where none did. It must stay small — the load budget, the must-visit allowance, the advocacy format, the vote threshold. Growth in this list is a regression, not a feature.
- The freeze creates a hole for the late joiner (§4.4): a member arriving after proposals open has no must-visit allocation against a sealed configuration.
- Telling a planner that a specific member has been shut out is socially uncomfortable by design. It is the co-admin saying the awkward thing, and some planners will experience it as an accusation.

**Follow-on decisions required**

- **The late joiner.** Either they receive an allowance by exception — and the freeze has a documented hole — or they do not, and the fairness invariant excludes exactly the member most likely to be steamrolled.
- **The trigger point for the invariant report.** "Before flights are booked" is unreliable: §4.3 states flight booking can occur anywhere in the sequence. The likely trigger is the first item crossing into *held*, the moment change starts costing money.
- **Intensity/modality tagging is a new AI insertion** (candidate #8). Depth 1; low variance and cheap to be wrong, therefore *automate silently* — a mis-tagged place produces one lumpy day the planner can see and correct.
- **The default load budget value needs calibration** against the golden set rather than assertion. "Standard" currently means whatever reproduces the author's historical days.
