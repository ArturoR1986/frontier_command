# Production plan — persistent colony conquest

Guidance 0.4, 2026-09-11. All new milestones are **unpassed**. The old restoration package is a technical prototype. Latest creator direction adds substantial home-map play, world travel improved by technology, slowly developed civilian operators, valuable crewed vehicles and manufactured robots. Planning does not complete the game mission.

## P1 — Prove why the colony grows

Build a reproducible nine-region world fixture with two economically active colonies, substantial detailed home maps and a contested destination. Prove local exploration, resource claiming and terrain-shaped base development before requiring a world expedition. Establish an authoritative command boundary from the start and connect two independent browser clients within P1. Reuse safe jobs, care and cargo. Show objective, benefit, bottleneck and next action without making the home map a forced short tutorial.

P1 must also prove the new force model: one crewed transport, one crewed combat vehicle, and basic/advanced robot examples with different fabrication costs and tactical roles. These are internal representative classes, not a locked final roster. Demonstrate boarding, operation, disembarking, repair and a crew-recovery case. Existing generic settler mobilization alone no longer establishes the intended combat experience.

Acceptance:

- Both colonies gather, construct, train operators, fabricate robots and build vehicles under the same rules. No free scheduled armies as the rival economy.
- Local terrain/resources support more than one viable base layout and substantial growth. Mountains affect access and defense. The wider-world destination adds a useful capability, resource advantage or interaction without making basic home development depend on immediate departure.
- Compare travel to the same destination on foot and with transport. Route length, terrain and vehicle capability change the displayed arrival estimate and measured journey. Cargo and crew occupy exactly one place; transitions and interruptions preserve them.
- Persistent practice/training improves a civilian skill that changes a disclosed operating capability. Assigning that person to a vehicle changes home staffing. Robot replacement consumes the appropriate inputs/time; a higher tier is not simply a free stronger unit.
- Boarding/disembarking and disabled-vehicle recovery preserve crew identity, earned skills and cargo. Vehicle hull loss and crew injury are separate states governed by disclosed prototype rules.
- Supply physically reaches the outpost. Blockade depletes reserves before readiness changes; recovery conserves cargo.
- Battle and occupation change ownership and productive output. Defeat permits retreat, treatment and rebuilding. Mobilization visibly costs domestic labor.
- Save/restart preserves both colonies, ownership, routes and unfinished work. Region crossings neither duplicate nor lose people/goods.
- Two independent clients act for separate factions in the same server-owned world. Reject commands against unowned assets. One client's menu/disconnect does not pause the other. Basic reconnect returns to the same colony; P2 supplies systematic durability and failure testing.
- Review a home-development session and a separate expedition/combat/aftermath session. Accelerated fixtures may compress travel and training to test correctness, but label that acceleration; they cannot establish normal pacing. The former 30–45 minute full-loop example is not a requirement to rush the player into war. Fresh-player review checks five-minute goal comprehension and next-action clarity; scripted tests cannot establish this.

This internal proof does not redefine v1. **First implementation action:** define authoritative ownership/location, terrain/travel and person/robot/vehicle/crew contracts, then create reproducible home-map, two-colony economy and crewed-journey fixtures. Compare 128, 256 and 512-tile map widths with meaningful terrain and active entities to choose a home-map target before broad content; these are engineering candidates, not approved final dimensions. The review proposes an initial comprehension screen with five first-time participants and at least four independently identifying the objective and next choice. This is an unexecuted usability threshold, not statistical validation; unavailable human evidence remains unverified.

## P2 — Prove persistence with real clients

Harden the local authority and two-client flow introduced in P1 before broad content. Commands carry sequence IDs and ownership validation; rejection explains why. Rendering/prediction stays separate from authoritative results. Expand restart and reconnect handling into explicit persistence, transaction and failure-recovery contracts.

Acceptance: unauthorized commands fail; retries cannot double-spend; reconnect restores the same world; one client's pause/hide/disconnect cannot halt another; server restart preserves ownership/pending work. Test races over assets, reconnect during combat, malformed orders and crash recovery. Show an offline return summary. localStorage export is not shared persistence.

## P3 — Conquest and recovery

Prototype offline attack rules through play rather than treating the prior siege schedule as settled. Compare disclosed notice/window candidates with standing defenses and absent owners; choose and document a rule set after evidence. Implement garrisons, occupation/integration and tested defeat/recovery options. Include valuable operators and vehicles alongside more replaceable robots, with scouting, terrain and counters. Test a stronger colony taking useful weaker-colony territory, a failed overextended invasion and offline cases across timezones. The winner gains control; the loser understands their continuing role. Final offline policy does not block P1, but must be disclosed and verified before release.

## P4 — Connected realms and diplomacy

Run two persistent realms with at least two player colonies each. Connections support trade/travel and cooperation or war between previously separate domains. Durable transfer IDs and prepare/commit/recovery states prevent duplication. Inject crashes/disconnects before and after every transfer boundary; exactly one realm owns each person and cargo afterward. Verify treaty changes, vision revocation and simultaneous claims. A map button or unlock flag does not establish realm connectivity.

## P5 — Content, usability and release qualification

Complete onboarding, original visual states, audio/settings, administrative recovery, account/session handling, backups, abuse controls and packaged client/server startup. Development requires no paid service. Select an authorized accessible delivery environment before final release.

Initial engineering load target, not implemented capacity: two realms of at least nine expandable regions each; four connected player clients total; 100 persistent people, 40 robots and eight vehicles per colony; 1,000 structures world-wide; two simultaneous engagements. These are benchmark populations, not unit caps or a required army composition. Select and record substantial home-map dimensions from P1 profiling. On reported hardware, target server tick p95 below 50 ms at 10 Hz and client frame p95 below 33 ms at 1280×720 with action visible. Measure active/inactive regions, crewed navigation, travel parties, retained memory and transfer traffic. Profile failures require optimization or an explicit blocker, not a return to the 16-person completion scope.

Run a 24-hour persistent-world soak with restart/disconnected-player cases, plus reviewed real-time opening, ordinary development, war, recovery, diplomacy and cross-realm sessions. Verify victory without resetting the world. Preserve useful regressions; update obsolete restoration expectations honestly. Qualify the actual package. Automated success and player comprehension are separate gates.

## Ordering and release rule

P1 proves purpose with shared authority; P2 hardens persistence before broad content; P3/P4 deliver conquest and larger-world play; P5 qualifies the whole. The developer/player review's seven experiments supplement these gates with checks for control reliability, attention at scale and continued play after defeat. Resume research only for specific unresolved decisions. Record implementation, executed evidence and failures in PRODUCTION_STATUS.md. Issue #1 remains open until current V1_COMPLETION_CRITERIA.md passes. Research, P1 or the old tests cannot close it.
