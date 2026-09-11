# Production status

2026-09-11 · guidance revision 0.3 · owner Codex · Issue #1 OPEN / in progress.

## Current milestone

The requested extensive developer/player review is complete: [DEVELOPER_AND_PLAYER_REVIEW.md](DEVELOPER_AND_PLAYER_REVIEW.md), its [13-page PDF](../output/pdf/rimworld-starcraft-development-review.pdf), and [27-source inventory](research/developer-review-sources.json). It includes process journals and retrospectives, development setbacks, contrasting player feedback, sampling limits, original recommendations and seven proposed experiments. The player sample contains 14 named review records and four discussion sources; it is not representative population evidence.

**Product completion: NOT PASSED.** The creator rejected the former restoration sandbox because purpose, map scale and sustained growth were inadequate. Confirmed references: RimWorld and classic StarCraft, not Factorio. Confirmed persistence: lasting colonies in ongoing worlds. This stage fulfilled the request for research before the next build; no gameplay implementation occurred.

GAMEPLAY_RESEARCH_2026_09_11.md separates sampled footage/transcript evidence, official mechanics, code findings and inference. GAME_DESIGN.md proposes the colony → production → supplied expansion → conquest → connected-realms loop. PRODUCTION_PLAN.md defines P1–P5 and unpassed acceptance tests. Offline siege timings and victory/occupation rules are design experiments, not additional user answers.

## Implemented and historical evidence

Baseline before this review: 2e1783f00167ef7429ea210a3d3ad60b38e6c8e1. Runtime: 6814c55daa59f36786747b69caacc87fb20528ff. This revision changes research, planning, a report-generation utility and its PDF. No new gameplay or multiplayer capability has been implemented or verified.

Historical runtime checks: syntax/whitespace; 35 simulation tests; build; stress profile; browser smoke, civic and opening sessions; extracted-package checks and CI. Exact evidence remains in FINAL_QA_REPORT.md and docs/qa/v1. Those results cover the earlier 64×48/16-person restoration prototype, not current product acceptance. The former statement that no game work remains is withdrawn.

Prototype entry: run node scripts/serve.mjs, open http://127.0.0.1:4173 and choose Begin landing. Historical ZIP: artifacts/frontier-command-1.0.0-6814c55.zip. Requires Node 22+ and desktop Chrome/Edge. This is available for regression comparison, not a connected-world release.

## Open work and exact next action

All P1–P5 milestones remain unpassed: clear growth/competition loop, owned multi-region economy, rival production, authoritative persistence and human clients, conquest/recovery/offline rules, diplomacy/realm transfers, broader scale, content and final artifact qualification. Core defects are absence of these systems and the creator-reported lack of purpose/depth; they are not non-blocking polish.

Next implementation: begin P1 with an authoritative command boundary, stable faction/region IDs and ownership/stock contracts; create a deterministic two-colony economy fixture, then make a supplied contested outpost change real production and territorial ownership across a nine-region test world. Include two independent clients in P1; P2 now hardens durability and failure recovery. Preserve useful jobs/care/cargo regressions. The review adds explicit tests for purpose, coupled decisions, navigation, workload at scale, persistence, conquest/recovery and realm interaction. These are unexecuted proposals, including the initial five-participant comprehension screen.

P1 is an internal proof; it cannot close Issue #1 or replace required persistent human cross-realm play. Siege timing, defeat continuation and unequal-entry rules remain hypotheses. No background execution is implied by this checkpoint.

## Research-revision verification

Executed for the report: generated PDF with ReportLab; reopened/extracted every page; verified all 27 source IDs resolve and the PDF contains source hyperlinks; rendered and visually inspected all 13 final pages, including both tables and the source appendix. No clipped text, orphan source pages or missing citation separators remain. The editable Markdown and source JSON reproduce the report via `scripts/build-research-report.py` using the bundled Python document runtime.

Repository verification: nine affected Markdown documents checked, 26 local links resolved, all 27 original source URLs present in PDF annotations, and `git diff --check` passed. Remote fetch confirmed origin/main remained at the review baseline before saving. [Review validation](research/developer-review-validation.md) identifies the delivered PDF and evidence limits.

No gameplay suite was rerun for unchanged game code. New gameplay tests belong to implementation milestones; experiential acceptance requires reviewed play rather than old green test counts. Historical runtime QA remains explicitly superseded for product acceptance.
