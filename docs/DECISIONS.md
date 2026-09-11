# Decision log — intent, hypotheses and chosen design

Guidance revision: 0.2 | Updated: 2026-09-11

## 2026-09-11 — Creator correction: learning transfer, not prototype continuation

**Status: adopted user intent.** The early v0.1–v0.5 experiments are a learning curve and failure record, not a representation of the desired game. Codex is commissioned to study the reference games, synthesize an original design and create the finished product. Old code recovery, preservation or repair is not required for production.

Reason: the creator explicitly rejected treating the very basic, unreliable prototypes as the foundation to complete.

Implication: replace the previous continuation framing in the entry points, mission and release gate. Preserve useful existing Codex work after evaluating it against this corrected intent; do not erase it reflexively.

## 2026-09-11 — What remains fixed

**Status: user goals and working arrangement.** Study classic StarCraft and RimWorld; create an original combination rather than a copy; support base/resources/military capability and survival/people/settlement/society development; make world contents and actions distinguishable; make building enjoyable and avoid the premature, overwhelming pressure reported in the trials. Codex owns routine research, engineering, testing and delivery; human involvement is for genuine direction, narrowly needed examples or required external authority.

## 2026-09-11 — Earlier product doctrines reclassified

**Status: provisional hypotheses, not locked decisions.** Ashwater Basin, the four named founders, Alloy/Biomass, the prototype structure roster, exact construction/hauling sequence, orthographic 2.5D, day/night, worn trails, the single-file browser target and the named Exposure system may be retained, altered or rejected after study and tests.

The phrases about wilderness becoming infrastructure and growth increasing exposure are useful candidate framing, not proof of the right final design. Earlier decisions that mandated these particulars are superseded by this classification. Earlier versions remain in Git history.

## 2026-09-11 — Evidence and release discipline retained

**Status: required operating practice.** Source writing is not verified behavior; a passed syntax check is not a launch/playtest. Tests must cover the distributed artifact and the integrated experience. Keep known defects and evidence limits visible. Finish a finite original product scope rather than merely updating a prototype version number.

## Recording future decisions

For material choices record: date/status, source observation or user goal, selected design, alternatives, reason/tradeoff, experiment or acceptance test, and result when known. Separate a planned test from its executed result. Ordinary reversible decisions do not require creator approval.

## 2026-09-11 — Civic expedition strategy selected and verified

Status: implemented in release runtime 6814c55. After the reference comparison in REFERENCE_FINDINGS.md, choose a small restoration community whose workers also supply field teams and care. Alternatives were a large-army RTS with light needs, or a deep-room colony simulator with incidental defense. The selected design makes mobilization remove real civilian labor, makes wounds require another person's time/provisions, and makes remote restoration return economic and warning capabilities.

Retain the independently implemented Ashwater setting, deterministic simulation and physical economy because they support this synthesis; the old trials are not the code foundation or acceptance roster. Extend the social/active-progression layers that the corrected brief exposed as missing. Bound v1 at one basin, sixteen people, twelve structures, three improvements and three restored installations, with continued sandbox after achievement. The tradeoff is approachable tactical depth and compact social modeling rather than large armies or simulated relationships.

Executed evidence: all three sites restored using real travel/combat/deliveries; duty preserves loaded cargo across save and resume; care restores a wounded specialist at a two-food staffing cost; depot/home comparisons and charter/reward comparisons demonstrate actual effects. Static checks, 35 tests, browser civic/expedition sessions and the extracted package pass. Final evidence and exact package hash are recorded in FINAL_QA_REPORT.md.
