# Frontier Command 1.0 QA report

Date: 2026-09-11. Reviewer: Codex. Scope: the original `V1_COMPLETION_CRITERIA.md`, unchanged.

Release gate: PASS for the declared desktop sandbox scope. Runtime revision e23b2fd6ea6008609916d320aaceefde24cbb347 passed local checks and hosted CI. The final 1.0 browser opening rerun also passed. No original completion criterion was removed or weakened.

## Executed checks

| Check | Result and evidence |
| --- | --- |
| Syntax/format | `node scripts/check.mjs` passes all production/test scripts |
| Unit/integration/regressions | `node --test`: 24 passed, zero failed |
| Production packaging | `node scripts/build.mjs`: complete 1.0.0 static build and independent local server |
| Browser smoke | Real Chrome: boot, new game, ticking simulation, pause, save, reload/load, help, selection, Shift and box groups, movement, stop, pan, zoom, placement and overlap rejection |
| Save failure | Invalid JSON, unsupported versions, invalid settings/buildings/jobs and malformed data rejected before colony replacement |
| Resolution/zoom | 1280×720, 1440×900, 1600×1000; far/normal/close screenshots inspected; frontier intelligence stays visible |
| Opening | Real browser via normal 4× speed and UI commands: 20 simulated minutes, no browser errors, housing/farm/generation/workshop/sensor/defenses, recruitment, research, save/load |
| Integrated hour | Landing → economy → warning → contact → recovery → save/load → continued play for 3,600 simulated seconds |
| Maximum fixture | 16 settlers / 80 structures / 64×48 map for another 3,600 simulated seconds; bounded retained memory and simulation time |
| Hosted CI | [Release CI passed](https://github.com/ArturoR1986/frontier_command/actions/runs/34590285658) on runtime revision e23b2fd6ea6008609916d320aaceefde24cbb347 |

Generated machine-readable reports and selected screenshots are preserved in `docs/qa/`. The scripts regenerate the raw artifacts in `artifacts/`.

## Criterion coverage

| Original sections | Result | Evidence |
| --- | --- | --- |
| 1–2: complete loop, boot, reliability | Pass | Playable packaged browser game; real opening and integrated hour, reset/save/load and visible fatal handler |
| 3: camera/controls | Pass | Browser clicks, group selection, direct commands, stop, placement, pan and zoom |
| 4: world readability | Pass in agent review | Distinct structures, civilian/security/hostile equipment, resources, terrain, cargo, staged construction, damage/offline states; three zoom screenshots |
| 5–6: logistics/construction | Pass | Actual pickup/haul/deposit; withdrawal claims; staged completion; cancellation and interruption conservation; multi-tile edge regression |
| 7–8: people/food/life | Pass | Named needs and priorities; eating/rest/healing; tended farms, harvest/deposit, outage recovery, starvation behavior |
| 9: power | Pass | Supply/demand, source radius, priority outages and restoration tests; world wires/OFF labels |
| 10–11: terrain/layout | Pass | Blocked routes and sight-line tests; topology invalidation; storage/work distances, power radius, soil, channel speed and defense geography |
| 12: day/night | Pass | Day/night tint and settlement lights; time-dependent rest thresholds |
| 13–14: threats/combat | Pass | Safe floor plus exposure threshold, warning direction/ETA/count, two-scout first contact, bounded later groups, attacks, retreat, turret power, death/salvage and cleanup |
| 15: progression | Pass | Workshop tools/defense/medicine with shared cost and sequential research; barracks training and housing-limited recruitment |
| 16–17: onboarding/UI | Pass in agent review | Guided sequence and in-game manual; real opening progression; resources, work, selection, builds and persistent frontier panel |
| 18: saves | Pass | Versioned data, in-flight cargo, deliveries, map/time, research, threats, volume/speed/guide/camera; paths recomputed |
| 19: audio | Pass | Original synthesized UI/work/environment/combat/warning cues, gesture activation and volume control; no third-party recordings |
| 20: performance | Pass for measured targets | Simulation and browser profiling below declared thresholds; bounded state/history and retained heap |
| 21–22: usability/errors | Pass within desktop scope | Text/symbol states, pause/speed/help, keyboard-focus retention, actionable invalid-order feedback, guarded startup and rejected corrupt saves |
| 23–24: tests/CI | Pass | Pure logic and integrated regressions, browser launch/action suite, workflow packaging and artifact upload |
| 25–26: documentation/rights | Pass | Actual local run/build path, architecture, controls, testing, credits, changelog and release notes; original project art/audio |
| 27: structured playthroughs | Pass | Details below |
| 28: release gate | Pass | Final runtime CI, opening rerun, package launch and release evidence recorded; no known blocking defect |

## Structured playthroughs

**A — Opening:** Browser-driven UI at 4×, not a test-only fast-forward mutation. A new seed-1986 landing constructed housing, food, power, storage, workshop, sensor and two turrets, invited a fifth person, completed tools research and saved/reloaded before the first warning. Screenshots were inspected for world/guide consistency. This establishes an agent-reviewed opening, not a claim about broad human enjoyment testing.

**B — Builder/economy:** Integration constructed the roster through physical deliveries, placed nearer storage, maintained food and researched defensive equipment. Stock and cargo remained coherent. Layout affects actual travel and power.

**C — Threat:** At 1,200 seconds the prepared colony received a warning for two contacts arriving at 1,350 seconds. The test rallied settlers around defenses; the encounter resolved with the colony intact. Separate tests distinguish kills/salvage from retreat and validate blocked fire lines.

**D — Recovery:** The fixture intentionally damaged a home and a settler and removed one person. Repair restored the home, rest healed the survivor, and spare housing permitted replacement. A separate regression destroyed the Command Hub and reconstructed it from physically salvaged stock.

**E — Save/load:** Saved in-progress construction/cargo and mid-game research/threat state; loaded and advanced successfully. Real browser save → page reload → load passed. Corrupt saves left the running colony untouched.

**F — Long session:** Normal integrated colony survived one simulated hour with five people and ten structures. The separate 16-person/80-structure fixture survived an additional full simulated hour with bounded history and memory.

**G — Edge cases:** Overlap/out-of-bounds/unexplored placement, blocked paths and sight lines, depleted sources shared by multiple workers, low food/rest, outages, full housing, destroyed occupancy, several simultaneous projects, repeated cancellation, malformed saves and retreat edge handling are covered.

## Measurements

Windows x64, Node 24.19.0, Intel Core i7-13650HX. At 16 people and 80 structures: simulation p99 approximately 0.65 ms, maximum observed tick approximately 6.43 ms, retained heap change approximately 0.49 MB after forced GC across one simulated hour. Target: p99 below 16 ms and retained increase below 20 MB.

Headless local Chrome at 1600×1000: median frame interval 16.7 ms, p95 17.5 ms, p99 25.3 ms. Target: p95 below 50 ms in this automated environment. These are measurements, not universal hardware guarantees. Caching replaced a failing terrain redraw measured at 79 ms p95.

## Limitations and review boundary

One biome; sandbox only; finite mineral/biomass deposits; no mobile, multiplayer or cloud saves. System-generated visual/audio assets are intentionally compact. Canvas gameplay is not fully screen-reader operated. Human population-wide enjoyment/accessibility studies were not performed. These are declared scope boundaries, not hidden blocking defects; no original completion criterion was removed or weakened.

## Final delivery verification

The independently extracted ZIP launched with its bundled `node serve.mjs`; a real browser began a new colony with four people and an advancing simulation, with zero page errors. Final opening evidence and snapshots accompany this report. ZIP SHA-256: `48931BA5FEA0551307C744DD982CCB63DACD758363B3EBB07A1A4029C3BE2AF1`. Documentation-only completion commits do not change the tested runtime.
