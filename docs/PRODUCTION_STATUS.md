# Production status

2026-09-11 · guidance revision 0.2 · owner Codex · Issue #1.

Current milestone: v1.0 completion gates PASS. Runtime commit 6814c55daa59f36786747b69caacc87fb20528ff. Final evidence-only changes document the already tested runtime; no further game implementation remains.

Focused classic StarCraft/RimWorld source and visual study informed the finite civic expedition design. Corrected main 051747f was reconciled without discarding useful code or force-pushing; subsequent milestone/final fetches confirmed no newer guidance. See REFERENCE_FINDINGS.md, GAME_DESIGN.md, PRODUCTION_PLAN.md and DECISIONS.md.

Commands executed and passed: node scripts/check.mjs; node --test (35/35); node scripts/build.mjs; node --expose-gc scripts/profile.mjs; node scripts/smoke.mjs; node scripts/community-playtest.mjs; node scripts/opening-playtest.mjs (exact release commit, 20 simulated minutes at normal 4× browser speed); extracted-package check. Candidate push and PR CI both succeeded. Captures reviewed at normal/far/close, minimum desktop size and the 16-person/80-structure target load.

Playable entry: http://127.0.0.1:4173 while the local dist server runs. ZIP: artifacts/frontier-command-1.0.0-6814c55.zip. Standalone: extract, run node serve.mjs, open the address and choose Begin landing. Requires Node 22+ and Chrome/Edge; no installation of game dependencies or internet is needed.

FINAL_QA_REPORT.md is the authoritative completion record, including source/package hash, eight gate assessments, measurements, reviewed scenarios and non-blocking limitations. docs/qa/v1 preserves evidence. QA_REPORT.md and earlier candidate packages remain historical.

Repository record: PR #2 carries the verified implementation and final evidence for Issue #1. GitHub records the merge/closure status. No further game work remains within the finite v1.0 plan; no external hosting deployment is required.
