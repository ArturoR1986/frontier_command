# Production status

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
