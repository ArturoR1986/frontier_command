# Production status

2026-09-11 · guidance revision 0.3 · owner Codex · Issue #1 OPEN / in progress.

## Current milestone

Focused gameplay research and revised persistent-world design recorded. **Product completion: NOT PASSED.** The creator rejected the former restoration sandbox because purpose, map scale and sustained growth were inadequate. Confirmed references: RimWorld and classic StarCraft, not Factorio. Confirmed persistence: lasting colonies in ongoing worlds.

GAMEPLAY_RESEARCH_2026_09_11.md separates sampled footage/transcript evidence, official mechanics, code findings and inference. GAME_DESIGN.md proposes the colony → production → supplied expansion → conquest → connected-realms loop. PRODUCTION_PLAN.md defines P1–P5 and unpassed acceptance tests. Offline siege timings and victory/occupation rules are design experiments, not additional user answers.

## Implemented and historical evidence

Existing main baseline: b01f827db169c16cc3c16305beae90cc7474e32b. Runtime: 6814c55daa59f36786747b69caacc87fb20528ff. This research revision changes documentation only. No new gameplay or multiplayer capability has been implemented or verified.

Historical runtime checks: syntax/whitespace; 35 simulation tests; build; stress profile; browser smoke, civic and opening sessions; extracted-package checks and CI. Exact evidence remains in FINAL_QA_REPORT.md and docs/qa/v1. Those results cover the earlier 64×48/16-person restoration prototype, not current product acceptance. The former statement that no game work remains is withdrawn.

Prototype entry: run node scripts/serve.mjs, open http://127.0.0.1:4173 and choose Begin landing. Historical ZIP: artifacts/frontier-command-1.0.0-6814c55.zip. Requires Node 22+ and desktop Chrome/Edge. This is available for regression comparison, not a connected-world release.

## Open work and exact next action

All P1–P5 milestones remain unpassed: clear growth/competition loop, owned multi-region economy, rival production, authoritative persistence and human clients, conquest/recovery/offline rules, diplomacy/realm transfers, broader scale, content and final artifact qualification. Core defects are absence of these systems and the creator-reported lack of purpose/depth; they are not non-blocking polish.

Begin P1: introduce stable faction/region IDs and ownership/stock contracts, create a deterministic two-colony economy fixture, then make a supplied contested outpost change real production and territorial ownership across a nine-region test world. Preserve useful jobs/care/cargo regressions. P1 is an internal proof; it cannot close Issue #1 or replace required persistent human cross-realm play. No background execution is implied by this checkpoint.

## Research-revision verification

Executed: local-link and whitespace audit across all 11 revised documents passed; git diff --check passed. Remote guidance fetch confirmed origin/main still b01f827 before saving this revision. Reviewed current entry points, design, plan and gate for consistency; historical QA is explicitly superseded. No runtime suite was rerun for unchanged code. New gameplay tests belong to implementation milestones; experiential acceptance requires reviewed play rather than old green test counts.
