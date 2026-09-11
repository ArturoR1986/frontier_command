# Finite production plan — guidance 0.2

## Milestones

1. Reconcile corrected brief; preserve working implementation and previous test evidence. Complete focused reference findings and choose the original design.
2. Implement civil/field duty, safe interruption/resumption, caregiver treatment, homes, Commons and charter. Prove labor/care/military consequences.
3. Implement three map restoration sites, disclosed defenders, physical restoration and distinct rewards. Prove a complete restoration/independence arc.
4. Refine original world art, civic/tactical UI, scene states, onboarding and save compatibility. Inspect crowded scenes and operation sequences.
5. Run all regressions, comparison experiments, care/organization, expedition/aftermath, intentional recovery, save/return, opening and hour-long stability sessions; profile target load.
6. Test extracted package, record FINAL_QA_REPORT.md against revision 0.2, reconcile remote guidance, obtain CI on final source and complete the mission only then.

## Design-specific gates

- Equal-worker depot comparison shows a material throughput difference.
- Mobilizing Mara slows construction; release restores it, with conserved material ownership.
- An injured specialist has lower capability until another person supplies treatment; staffing and provisions have observable cost.
- Charter/home/Commons organization changes recovery, morale or labor rate in measured tests, and is inspectable in UI.
- At least one remote-site run uses real movement, defense, material delivery and a persistent reward. A full run restores all three and reaches the independent-network achievement.
- Sites do not spawn concealed punishment; inspection gives requirements and defenders before commitment.
- Every new state survives save/close/load; format compatibility and corruption handling remain explicit.
- All previous useful regressions remain. Browser tests cover civic controls, duty and frontier interaction in addition to existing commands.
- Normal and crowded visuals show function, people, duties, work and tactical pressure at 1280×720 and larger.
- 60 simulated minutes at 16 people/80 structures; p99 simulation below 16 ms and headless frame p95 below 50 ms on reported hardware; retained heap growth below 20 MB.

Risks: care starving essential labor, duty silently orphaning cargo, remote guards bypassing the safe opening, passive research/flags pretending to be progression, and new panels hiding core controls. Tests must target these directly. An internal slice is not the release.
