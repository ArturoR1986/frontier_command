# Production plan — persistent colony conquest

Guidance 0.3, 2026-09-11. All new milestones are **unpassed**. The old restoration package is a technical prototype. This plan addresses the creator's request to study and define the next step; planning does not complete the game mission.

## P1 — Prove why the colony grows

Build a reproducible nine-region fixture with two economically active colonies and a contested resource outpost. Regions support building and cross-region travel, not decorative screens. Introduce ownership and faction-scoped stocks before opponent production. Reuse safe jobs, care and cargo. Replace restoration as the main purpose with supplied expansion and territorial control; show objective, benefit, bottleneck and next action.

Acceptance:

- Both colonies gather, construct, equip/recruit and suffer economic interruption under the same rules. No free scheduled armies as the rival economy.
- Starting territory cannot provide every advanced capability. The outpost changes measured income or production options. Home investment and early expansion are both playable.
- Supply physically reaches the outpost. Blockade depletes reserves before readiness changes; recovery conserves cargo.
- Battle and occupation change ownership and productive output. Defeat permits retreat, treatment and rebuilding. Mobilization visibly costs domestic labor.
- Save/restart preserves both colonies, ownership, routes and unfinished work. Region crossings neither duplicate nor lose people/goods.
- A reviewed 30–45 minute session covers preparation, expansion, conflict and aftermath. A fresh-player review checks five-minute goal comprehension and next-action clarity; scripted tests cannot establish this. Label developer judgment separately.

This internal proof does not redefine v1. **First implementation action:** faction/region state contracts and a deterministic two-colony economy fixture, then the playable expansion loop.

## P2 — Prove persistence with real clients

Move time and commands to a durable local server early, before broad content. Connect two independent browser clients with separate identities. Commands carry sequence IDs and ownership validation; rejection explains why. Rendering/prediction stays separate from authoritative results.

Acceptance: unauthorized commands fail; retries cannot double-spend; reconnect restores the same world; one client's pause/hide/disconnect cannot halt another; server restart preserves ownership/pending work. Test races over assets, reconnect during combat, malformed orders and crash recovery. Show an offline return summary. localStorage export is not shared persistence.

## P3 — Conquest and recovery

Implement declared sieges, defense windows, garrisons, occupation/integration, surrender/evacuation and recoverable defeat. Add production choices, scouting and counters rather than only more hit points. Test a stronger colony taking useful weaker-colony territory, a failed overextended invasion, and offline rules across timezones. The winner gains control; the loser understands their continuing role.

## P4 — Connected realms and diplomacy

Run two persistent realms with at least two player colonies each. Connections support trade/travel and cooperation or war between previously separate domains. Durable transfer IDs and prepare/commit/recovery states prevent duplication. Inject crashes/disconnects before and after every transfer boundary; exactly one realm owns each person and cargo afterward. Verify treaty changes, vision revocation and simultaneous claims. A map button or unlock flag does not establish realm connectivity.

## P5 — Content, usability and release qualification

Complete onboarding, original visual states, audio/settings, administrative recovery, account/session handling, backups, abuse controls and packaged client/server startup. Development requires no paid service. Select an authorized accessible delivery environment before final release.

Initial engineering load target, not implemented capacity: two realms of at least nine expandable regions each; four connected player clients total; 100 persistent people per colony; 1,000 structures world-wide; two simultaneous engagements. On reported hardware, target server tick p95 below 50 ms at 10 Hz and client frame p95 below 33 ms at 1280×720 with action visible. Measure active/inactive regions, navigation churn, retained memory and transfer traffic. Profile failures require optimization or an explicit blocker, not a return to the 16-person completion scope.

Run a 24-hour persistent-world soak with restart/disconnected-player cases, plus reviewed real-time opening, ordinary development, war, recovery, diplomacy and cross-realm sessions. Verify victory without resetting the world. Preserve useful regressions; update obsolete restoration expectations honestly. Qualify the actual package. Automated success and player comprehension are separate gates.

## Ordering and release rule

P1 proves purpose; P2 establishes authority before broad content; P3/P4 deliver conquest and larger-world play; P5 qualifies the whole. Resume research only for specific unresolved decisions. Record implementation, executed evidence and failures in PRODUCTION_STATUS.md. Issue #1 remains open until current V1_COMPLETION_CRITERIA.md passes. Research, P1 or the old tests cannot close it.
