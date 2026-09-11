# Frontier Command — Changelog

## 1.0.0 — 2026-09-11 — Ashwater Basin

- Completed the integrated colony sandbox, progression, threat and recovery loops.
- Added portable playable packaging, local run/build instructions, controls, architecture and rights documentation.
- Hardened save validation and retained camera preferences; invalid saves cannot replace the current colony.
- Added Command Hub reconstruction from salvaged inventory, group movement spacing and idle-person separation.
- Cached terrain rendering after measured frame-pacing failures; retained dynamic units, structures and work feedback.
- Verified the real-browser 20-minute opening and deterministic 60-minute gameplay/recovery sessions.
- Added final QA evidence and release notes. See the QA report for exact release checks and CI revision.

## 0.6.0 — 2026-09-11 — Integrated production development milestone

- Added modular deterministic simulation, terrain routing and physical storage/cargo.
- Added colonist needs, priorities, direct commands, construction, food, power, research and recruitment.
- Added exposure warnings, bounded first contact, tactical combat, salvage and recovery.
- Added Canvas world rendering, camera, group selection, placement previews, onboarding, help and procedural audio.
- Added versioned save/load, portable import/export and corrupt-save rejection.
- Added simulation regressions, structured hour-long playthrough, browser smoke tests, stress profiling and CI.
- Fixed depot-origin pathing, automatic stockpile escalation and UI refresh interrupting clicks during validation.
- This milestone remains under release validation; it is not yet the completed v1.0 release.

## 2026-09-11 — Codex Handoff / Production Reset

### Added

- `AGENTS.md` — Codex operating contract and autonomy rules.
- `docs/PROJECT_HANDOFF.md` — complete project history, design intent, creator feedback, and prototype lessons.
- `docs/V1_COMPLETION_CRITERIA.md` — final product release gate.
- `docs/DECISIONS.md` — durable decision log.
- `README.md` — repository entry point.

### Changed

- Project ownership moved from conversational prototyping to Codex-led production implementation.
- Product target explicitly changed from iterative prototype to complete tested v1.0.
- Human involvement reduced to genuine direction, specific gameplay references, external-action blockers, or irreversible choices.

### Historical prototype summary

#### v0.1

- Browser prototype with four colonists, resources, building, needs, Rangers, and simple raids.
- Visuals were primarily debug primitives.

#### v0.2

- Established Ashwater Basin visual direction.
- Added stronger unit/building silhouettes and environment grammar.
- Terrain still lacked real mechanical blocking.

#### v0.3

- Added camera zoom/pan and clearer task/status feedback.
- Fixed a multi-tile construction completion-distance bug.
- Delayed/reduced first hostile encounter after playtest feedback.

#### v0.4 design direction

- Locked the principle that work should be understandable by watching the world.
- Prioritized physical logistics, staged construction, meaningful terrain, quiet-life simulation, day/night, and telegraphed threats.

#### v0.5 / v0.5.1 experiments

- Explored physical hauling, work autonomy, power, Exposure, Sensor/Workshop/Barracks functions, minimap, warnings, and richer terrain.
- v0.5 suffered a startup initialization failure that produced a blank gameplay shell.
- v0.5.1 recovery build simplified startup and added visible fatal-error handling.

### Testing lesson

A build is not considered delivered merely because source exists or syntax passes. It must launch, run, and survive structured gameplay testing.
