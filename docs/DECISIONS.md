# Decision log — intent, hypotheses and chosen design

Guidance revision: 0.4 | Updated: 2026-09-11

## 2026-09-11 — Large home map, world travel, skilled crews and robots

**Status: adopted creator direction.** The home map must itself be large and engaging: explore, claim resources and choose layouts affected by mountains and the environment. A second, much larger world map includes other tribes and human colonies. Travel distance matters and transport technology improves mobility. The home remains relevant after world interaction begins; an early compulsory expedition is not the intended pacing.

Civilians are long-developed, hero-like individuals whose skills make them costly to lose. They operate valuable vehicles; walkers, tanks and ships are illustrative classes, with original names/assets. Robots are fabricated in colony production facilities and are comparatively replaceable, with a range of costs depending on technology. StarCraft's tactical fighting remains an influence; its rapid unit replacement is not the target economy.

**Open by explicit creator choice:** players can be attacked while absent, but detailed online/offline interaction rules will be worked out through play. The previous 24-hour notice, two-hour window and exact scheduled-battle suggestion remain candidates only. Do not present them as approved policy or block initial gameplay on their final selection.

**Implementation implications, unverified:** persist distinct people, skills, robot units, vehicle hulls, crew assignments and travelling parties. Test a substantial home map plus a journey where transport changes actual time/capacity/access, and a battle with both a skilled vehicle operator and fabricated robots. Initial representative classes and benchmark counts in PRODUCTION_PLAN.md are engineering choices, not creator-mandated rosters or limits. Crew survival, fuel/energy rules, technology prices, travel clock scale and final map dimensions remain hypotheses.

The 13-page developer/player review is retained as a dated research artifact. This later direction supersedes its incompatible pacing and unit-model recommendations; it does not retroactively change the evidence reviewed. No new gameplay capability is claimed by this documentation revision.

## 2026-09-11 — Persistent conquest supersedes restoration completion

**Subsequent research checkpoint:** the creator requested an extensive review before the next build, and clarified that "Richter" meant creators/developers generally. [DEVELOPER_AND_PLAYER_REVIEW.md](DEVELOPER_AND_PLAYER_REVIEW.md) records 27 documentary sources, 14 named player-review records, four discussion sources, contrary evidence and sampling limits. No new gameplay was implemented in that stage.

**Chosen sequencing change, unverified in code:** bring authoritative commands and two independent clients into P1; use P2 for systematic durability and failure recovery. Reason: shared-world control and return flows shape the core experience and must be tested before broad content. Reject silent wealth-triggered rival power and inherited interface restrictions as default design rules. Retain economically earned opponents, human consequences and regional supply. The detailed siege/recovery/realm rules remain hypotheses, with explicit experiments in review sections 10-11.

**Adopted user direction:** the creator rejected the game as far from done: purpose is unclear, space/growth inadequate, and progress should lead to stronger colonies conquering weaker ones and meeting developed players from connected realms, with cooperation or war. References were explicitly corrected to RimWorld and classic StarCraft, not Factorio. The persistence answer was **persistent worlds with lasting colonies**.

The earlier civic expedition selection below is historical implementation, not current acceptance. Issue #1 is reopened. Technical QA and useful code remain; the completion claim is withdrawn. Current evidence is in GAMEPLAY_RESEARCH_2026_09_11.md. PRODUCTION_PLAN.md defines P1–P5; no new gate has passed.

**Selected for prototyping, unverified:** economically funded rivals, faction/region ownership, physical outpost supply and a shared authoritative server. Prototype announced core sieges/defense windows, occupation costs, evacuation/surrender and persistent domain victory. Specific rules/timings in GAME_DESIGN.md are Codex proposals, not user answers. Test growth, recovery, offline fairness and meaningful conquest. Nine regions/two colonies form an internal proof, not the product boundary. Finite v1 retains human clients and at least two connected persistent realms.

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
