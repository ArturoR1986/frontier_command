# Production status

## Active v0.2 continuation — 11 September 2026

The creator has explicitly resumed autonomous development from the existing checkpoint. The feedback-only pause below is historical. Version is now **0.2.0**, matching the agreed early-prototype maturity; the earlier 1.0.0-dev.1 label overstated alignment. Issue #1 remains open and P1–P5 remain unpassed.

Current work addresses the creator's lag, cramped map, repetitive wall placement and unclear research reports. Implemented: stable DOM controls; 150 ms state polling with buffered movement rendering; terrain revision caching independent of ordinary construction; connected freehand wall strokes and rectangular floor fills with blocked-tile/cost previews; floor/furniture layering; expanded workspace and whole-map survey; actionable colony-development guidance; live research requirements, staffing and progress; original facility silhouettes and work animation; physical separation of overlapping units; field rations and outdoor recovery; AI outpost camp construction; persistent ordered client retries; basic Host validation and bounded inactive rate records; an actual current-game package, Windows launcher and SQLite backup utility.

Executed evidence so far: **68/68 combined tests passed**. Recursive checks passed for 43 source/script/test files. The rebuilt current package passed HTTP startup, assets, authorization, terrain caching, receipt retry, Host rejection and private-file checks. The backup utility verified both the preserved player world and live review world while its server was running. A 144-tile floor plan improved from about 665 ms to 18 ms in the same synthetic 256-map fixture. Actual browser wall/floor drags placed 16 and 15 plans; workers delivered supplies and completed them. The research panel showed 327/900 work and increasing skills in a normal-time review copy. Reviewed home and battle scenes showed roughly 17–19 ms rolling p95 frame times and 3–5 ms network samples at 1280×720; these are scene samples, not final four-client load qualification.

The latest eight-hour accelerated AI probe completed in 36 seconds (p95 tick 4.58 ms, maximum 15.83 ms). Two supplied outposts completed their relays, beds and fields; their pioneers remained at 100 health with food and rest. The previous stranded-crew starvation defect was corrected with safe parked crew breaks and preboarding reserves: all 32 people ended this probe at 100 health. Resource and route stalls still prevent some rivals from producing or expanding. This is accelerated survival evidence, not normal-time pacing qualification. Active browser combat used a labeled prepared-equipment rehearsal: robots were lost, the crawler/artillery survived, and a retreat order was issued. This does not establish complete tactical balance or normal progression.

The creator's live world has been preserved at data/world.sqlite. Browser work uses separate copies at data/review-20260911 (port 4181) and data/review-combat-2026-09-11T17-30-15-896Z (port 4182). Do not replace the live colony with either rehearsal. Rebuild target: dist/frontier-command; run its scripts/frontier-server.mjs. README and CURRENT_CONTROLS.md now describe the persistent game rather than the superseded restoration build. No public hosting occurred.

Continue: finish current regression/package/backup checks, inspect the revised tactical labels and recovery flow, rerun the AI economy/arrival probe, and extend strategic rival behavior and sustainable expansion. Then continue authority failure/reconnect/upgrade tests, defeat/recovery and realm interaction. Final active-load measurements, 24-hour persistent soak, human comprehension/attachment/pacing/fairness and actual human cross-realm play remain unverified. Do not claim that these engineering improvements prove the game is exciting or complete.


## Continued progression and performance review — 11 September 2026

Checkpoint base: 3ccb6b6. Further implemented work: exposed-face excavation plans for AI ore access; cached connectivity checks to prevent unreachable jobs starving useful work; reusable carriers and return journeys; additional rival housing/recruitment to twelve people; camp food production during occupation; peaceful withdrawal when another colony claims a destination; departure using a faction's own unloaded supplies; simulation fingerprint protection for crash-journal upgrades; compact route/state presentation and gzip responses; staggered idle work searches; removal of irrelevant structure/refuel checks; and less repetitive crop tending.

Executed regression: **75/75 tests passed**, including physical tunnel mining, blocked jobs, carrier return, field departure conservation and upgrade protection. Recursive checks passed for 48 files. The rebuilt package passed HTTP/auth/retry/private-file/compressed-response/clean-stop checks and was launched in an actual browser at port 4183 using a new verified copy of the player world. Joining and onboarding worked. Additional scene/input inspection remains active.

The sixteen-hour accelerated campaign before the final work-scheduling changes finished in 35 seconds, p95 tick 2.01 ms, maximum 13.20 ms. All four rivals grew to twelve people, made sixteen robots and one carrier, controlled three regions each and started another journey; all 48 people remained at 100 health. Two rivals targeted the same frontier, motivating the withdrawal recovery change. That new race behavior needs broader campaign verification. This is a funded-through-normal-rules AI simulation, not human pacing or strategic-war qualification.

The new active-load exercise uses 400 people, 160 robots, 32 actually crewed vehicles, 1,000 structures, 18 regions, two realms, two engagements and four simulated HTTP clients on an i7-13650HX / Node 24.19.0. Its latest run transferred 7.68 MB compressed (106.45 MB decoded) over 20.17 seconds; final server tick p95 **62.53 ms**, request p95 **160.84 ms**, maximum request 209.17 ms. The server target below 50 ms is **not passed**. A separate 20-second simulation CPU profile after optimization measured p95 11.86 ms and maximum 21.54 ms, compared with 484.72 ms p95 in the earlier unoptimized profile. End-to-end authority/storage/response costs still need investigation; do not equate CPU time with full-server performance. These short prepared loads do not qualify browser frames, sustained memory, four human clients or a 24-hour soak.

Preservation: data/world.sqlite remains untouched by gameplay reviews. A verified package-review copy is data/review-package-20260911-2035/world.sqlite, with its server on port 4183. Earlier ports 4181/4182 were stopped by the process tool (exit 1, so do not assume a clean checkpoint); retain those review databases and backups. New servers support the local console line **quit** for a verified graceful checkpoint, in addition to Ctrl+C in an interactive terminal. Never erase a crash journal or replay it with a different simulation build to bypass the new protection.

Next: finish actual-package input/reconnect inspection; profile full-server persistence and response latency; fix sustainable AI claim races and military projection; then continue P2 failure tests, conquest/recovery/diplomacy/realm play and P5 qualification. Product gates remain unpassed. No claim of comparable player excitement or v1 completion is justified.

## Creator playtest feedback — saved before shutdown, 11 September 2026

The creator confirmed playing briefly while updates were being made. This is actual human feedback, but it does not identify every earlier client action or pass the formal human-play gates. The instruction now is to record feedback only and remain paused. Continue from the existing checkpoint when asked; do not start from scratch or reset the colony.

- **Lag:** the game felt very laggy. On resumption, reproduce input/rendering/network responsiveness under ordinary play and active updates; existing simulation tick measurements do not explain or dismiss this report.
- **Building space:** the usable building area felt limited and the presentation felt very tight/cramped. Review camera scale, navigation, interface coverage and access to the larger home terrain; nominal map dimensions alone do not establish a spacious experience.
- **Wall placement:** explicitly support clicking and dragging with the pointer to place multiple wall segments, instead of requiring a separate click for each tile. The precise gesture implied by the transcribed phrase about a line is unclear; preserve the clear drag-placement requirement without inventing a confirmed shape constraint.
- **Interactions and research:** the creator also reported difficulties involving interactions and research, but those portions of the voice transcription are too unclear to identify an exact failure. Review these flows on resumption; do not record a specific cause, failed command or research defect as established fact.

These concerns should lead the next usability review before further feature expansion. No code changes, server restart or new play session are authorized by this feedback-only turn. The existing saved world and backup remain intact.

## Shutdown checkpoint — 11 September 2026, 14:28 UTC

The creator needs to turn off the computer. Work is safely paused, not complete. The persistent server was stopped and the world checkpointed. Verified SQLite backup: `data/backups/world-2026-09-11T14-28-46-292Z.sqlite` (`PRAGMA integrity_check`: `ok`). Live database: `data/world.sqlite`. Both remain local and ignored by Git. Simulation time is 1784.9 seconds; Ashwater Union and Stonewake Review Colony are claimed, with 136 structures across the world. Preserve this world and its access keys; additional client actions were observed but their human origin and comprehension are unverified.

The checkpoint adds geographic world-map routes, excavation, home assignment, medicine recipes and resettlement controls; connected-component navigation and alternate work targets; actual aircraft traversal; attack-move engagement and wall targeting; physical vehicle fuel service; mutual care recovery; cargo conservation and first-outpost construction from mixed expedition supplies; and economically funded AI scouting, production and expeditions. These are implementation improvements, not completed product gates.

Validation at shutdown: **55/55 tests passed**, including 20 current persistent-world tests and 35 legacy regressions. The latest bounded AI economy probe reached 5.48 accelerated simulation hours before its 55-second wall budget, with p95 tick 15.66 ms and maximum 30.27 ms. Three factions funded expedition orders; completed arrivals, outpost capture and military invasions remain unverified. This is neither real-time pacing evidence nor the required 24-hour soak. Two browser clients and revised map/home screens were inspected; no horizontal overflow or browser errors were found in the last checks. Build packaging still targets the older entry and must be updated.

**Resume here:** start `node scripts/frontier-server.mjs` using Node v24.19.0, then open http://127.0.0.1:4180/ with the existing browser session. Continue integrated home-to-industry and expedition/battle review. Extend the economy probe to report journey arrivals and non-home ownership; fix any outpost stalls and implement/review rival military projection. Verify resettlement, cargo/death failure paths and crew recovery, then continue P2–P5 durability, conquest, realm interaction, packaging, load/soak and human play gates. Do not restart research, reset the saved colony, close Issue #1 or claim v1 completion. No work continues while this computer is off.

## Active implementation checkpoint — 11 September 2026

The creator requested a final multi-video gameplay review followed by autonomous implementation through completion. [GAMEPLAY_VIDEO_REVIEW.md](GAMEPLAY_VIDEO_REVIEW.md) records three distinct videos per reference with exact inspected frames/narration and limitations. The previous research-only status below is historical. **P1 is being implemented; P1–P5 product gates remain unpassed.** Do not restart general research or return to the old small-map scope.

New code is preserved separately in `src/frontier/`. New entry: `node scripts/frontier-server.mjs` → **http://127.0.0.1:4180/**. `npm run dev` now selects this persistent server; `npm run legacy` retains the 4173 prototype. Version: 1.0.0-dev.1. Source baseline before these changes: c14042c.

Written systems: 256×256 home terrain; two realms of nine regions; four factions; physical gathering/hauling/construction; priorities, persistent practice, meals, rest, social activity and treatment; research/power/fabrication; three robot and three crewed-vehicle roles; boarding, separate hull/crew damage, travel quotes and journeys; diplomacy, escrowed trade, supplied occupation and persistent victory records. Feature writing does not establish all behavior or release quality. Candidate commands and durable SQLite receipts prevent partial rejected orders and replay duplication. Both realms live in one authority, so crossings are atomic location changes rather than separately acknowledged servers. Default hosting is loopback; no public deployment occurred. Ignored database: `data/world.sqlite`.

Executed evidence:

- `node --test tests/frontier.test.js`: **13/13 passed**. Deterministic terrain, construction delivery, cancellation/cargo recovery, large-map blocked navigation, crew/travel identity, ownership and malformed quantities, SQLite crash replay/idempotency, simultaneous-builder cost conservation, basic/advanced fabrication costs, disabled hull/crew separation, cross-realm arrival exactly once, supplied occupation and escrowed trade.
- Engine/client/renderer syntax checks passed. Full regression and new-package qualification remain to be run.
- Two actual browser tabs connected as different colonies to the same server. The first completed a bed while the second held a menu open. Reload returned to the same colony. Lobby, home and world screenshots inspected; browser error log empty at that inspection. This is agent-operated browser evidence, not human play or complete UI qualification.
- `node scripts/frontier-profile.mjs`: 18 regions, 4 colonies, 400 people, 160 robots, 32 **uncrewed** vehicles, 1,000 structures; 10 simulated seconds, no wars. Windows/Node v24.19.0/i7-13650HX/20 logical cores/31.7 GB RAM. For map widths 128/256/512, p95 tick = 24.90/22.04/32.28 ms; maximum = 48.37/52.49/93.45 ms; serialized world = 2.4/7.6/28.4 MB. Select 256 as the current candidate. This does not pass active-battle/client-frame/24-hour qualification.
- Fixed defects: placement preview mutated persistent topology; concurrent fetches could over-deliver construction; canceled queues retained fetch destinations; room evaluation needed caching. Current targeted tests pass after these fixes.

Exact next work:

1. Complete integrated home-to-industry and expedition/battle browser review, using clearly labeled advanced fixtures where necessary. Verify priorities, production, roles/counters, treatment, physical fuel service, room behavior and practice. Improve map/structure readability and the world grid's geographic/route presentation.
2. Audit known gaps: economically funded AI projection beyond its home; local aircraft terrain traversal matching its claim; attack-move holding to engage; recovery that lets defeated people establish a new home; broader cargo/reservation/death failure tests. These are not established by the current tests.
3. Finish P1, harden P2 receipts/crash/reconnect, and complete P3/P4 conquest/offline/diplomacy/realm behavior. Four-client human cross-realm play has not occurred.
4. Update the distributed build, recursive checks, CI and launch instructions; run useful legacy and new regressions, actual-package launch, admin backup/recovery and the active-load benchmark. The required 24-hour persistent soak has not run.
5. Continue skeptical play review. Human comprehension, attachment, pacing, fairness and actual human cross-realm play remain unverified. Do not replace those gates with scripted clicks or accelerated time.

The experimental one-hour core notice, two-minute frontier notice and supplied occupation values are implementation candidates, not creator-approved fairness findings. Issue #1 remains OPEN / in progress. The documentary PDF is unchanged. Historical runtime 6814c55 and its 35 tests cover only the rejected 64×48 restoration scope. The historical FINAL_QA_REPORT.md cannot certify this build.

---

## Historical research-only checkpoint (superseded by active implementation above)

2026-09-11 · guidance revision 0.4 · owner Codex · Issue #1 OPEN / in progress.

## Current milestone

Latest creator direction recorded in the design, plan and completion gate: substantial terrain-rich home maps; a much larger world containing tribes/players; realistic-feeling distances and useful transport technology; slowly developed civilian specialists operating valuable vehicles; and manufactured robots with varied costs as the more replaceable fighting force. Detailed offline attack rules will be developed through play. Earlier siege schedules and a compulsory first-hour expedition are not settled requirements. This revision updates documentation only; all P1-P5 product gates remain unpassed.

The requested extensive developer/player review is complete: [DEVELOPER_AND_PLAYER_REVIEW.md](DEVELOPER_AND_PLAYER_REVIEW.md), its [13-page PDF](../output/pdf/rimworld-starcraft-development-review.pdf), and [27-source inventory](research/developer-review-sources.json). It includes process journals and retrospectives, development setbacks, contrasting player feedback, sampling limits, original recommendations and seven proposed experiments. The player sample contains 14 named review records and four discussion sources; it is not representative population evidence.

**Product completion: NOT PASSED.** The creator rejected the former restoration sandbox because purpose, map scale and sustained growth were inadequate. Confirmed references: RimWorld and classic StarCraft, not Factorio. Confirmed persistence: lasting colonies in ongoing worlds. This stage fulfilled the request for research before the next build; no gameplay implementation occurred.

GAMEPLAY_RESEARCH_2026_09_11.md separates sampled footage/transcript evidence, official mechanics, code findings and inference. GAME_DESIGN.md proposes the colony → production → supplied expansion → conquest → connected-realms loop. PRODUCTION_PLAN.md defines P1–P5 and unpassed acceptance tests. Offline siege timings and victory/occupation rules are design experiments, not additional user answers.

## Implemented and historical evidence

Baseline before the latest direction update: ae8af2f (completed documentary review). Runtime: 6814c55daa59f36786747b69caacc87fb20528ff. The research PDF/source inventory are retained as dated evidence; later creator direction takes precedence over incompatible recommendations. No new gameplay or multiplayer capability has been implemented or verified.

Historical runtime checks: syntax/whitespace; 35 simulation tests; build; stress profile; browser smoke, civic and opening sessions; extracted-package checks and CI. Exact evidence remains in FINAL_QA_REPORT.md and docs/qa/v1. Those results cover the earlier 64×48/16-person restoration prototype, not current product acceptance. The former statement that no game work remains is withdrawn.

Prototype entry: run node scripts/serve.mjs, open http://127.0.0.1:4173 and choose Begin landing. Historical ZIP: artifacts/frontier-command-1.0.0-6814c55.zip. Requires Node 22+ and desktop Chrome/Edge. This is available for regression comparison, not a connected-world release.

## Open work and exact next action

All P1–P5 milestones remain unpassed: clear growth/competition loop, owned multi-region economy, rival production, authoritative persistence and human clients, conquest/recovery/offline rules, diplomacy/realm transfers, broader scale, content and final artifact qualification. Core defects are absence of these systems and the creator-reported lack of purpose/depth; they are not non-blocking polish.

Next implementation: define authoritative ownership/location, terrain/travel and person/robot/vehicle/crew contracts. Create reproducible home-map, two-colony economy and crewed-journey fixtures. P1 must demonstrate substantial local play, transport improving a real journey, persistent skilled operators, valuable vehicles and basic/advanced fabricated robots, alongside the supplied contested destination and two independent clients. P2 hardens durability and failure recovery. Preserve useful jobs/care/cargo regressions. Review local development separately from expedition/combat pacing; accelerated fixtures cannot validate realistic-feeling travel or long-term skill investment. Tests in the updated plan are unexecuted proposals.

P1 is an internal proof; it cannot close Issue #1 or replace required persistent human cross-realm play. Siege timing, defeat continuation and unequal-entry rules remain hypotheses. No background execution is implied by this checkpoint.

## Direction-revision verification

Checked nine updated Markdown documents and 28 local links; all targets resolve. `git diff --check` passed. Remote main matched ae8af2f before the update. Reviewed entry points, design, plan and release gates for consistency with the new terrain, travel, civilian/vehicle/robot and offline-play direction. No game code or research PDF changed, so no runtime tests or PDF rendering were repeated.

## Historical research-revision verification

Executed for the report: generated PDF with ReportLab; reopened/extracted every page; verified all 27 source IDs resolve and the PDF contains source hyperlinks; rendered and visually inspected all 13 final pages, including both tables and the source appendix. No clipped text, orphan source pages or missing citation separators remain. The editable Markdown and source JSON reproduce the report via `scripts/build-research-report.py` using the bundled Python document runtime.

Repository verification: nine affected Markdown documents checked, 26 local links resolved, all 27 original source URLs present in PDF annotations, and `git diff --check` passed. Remote fetch confirmed origin/main remained at the review baseline before saving. [Review validation](research/developer-review-validation.md) identifies the delivered PDF and evidence limits.

No gameplay suite was rerun for unchanged game code. New gameplay tests belong to implementation milestones; experiential acceptance requires reviewed play rather than old green test counts. Historical runtime QA remains explicitly superseded for product acceptance.
