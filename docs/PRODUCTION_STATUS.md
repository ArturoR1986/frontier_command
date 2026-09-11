# Production status

2026-09-11 · guidance revision 0.2 · owner Codex · Issue #1.

Current milestone: implementation and representative play review complete; final release-candidate verification and packaging.

Main guidance 051747f was safely reconciled in merge f93571c. A subsequent fetch confirmed no newer main guidance. Original code was retained after focused classic StarCraft/RimWorld study and extended into civic expedition strategy. The corrected design, bounded scope and reference evidence are in GAME_DESIGN.md, PRODUCTION_PLAN.md and REFERENCE_FINDINGS.md.

Implemented: physical economy/construction, terrain/defense, needs/roles, civilian-field work suspension, treatment provisions, homes, Commons, charter, three disclosed restoration expeditions and a persistent achievement. Format 2 retains civic and frontier state; format 1 migrates safely.

Verified during production: 35 simulation/integration checks; browser community controls and care/save/reload/expedition/restoration; a real-browser 20-minute opening at 4×; deterministic hour; target-load profile below limits. Review caught and fixed same-cell path recovery, wounded-caregiver sleep deadlock, stale victory guidance, inaccurate safe-window text during voluntary combat and roster/button overlap.

Exact next actions: commit the candidate; rebuild and rerun static, full tests, profile, smoke and community browser session; inspect new captures; test extracted ZIP; obtain CI; write FINAL_QA_REPORT.md with exact source/package evidence. Previous QA_REPORT.md is historical, not the corrected completion record. No claim that automated checks establish subjective fun or independent player feedback.
