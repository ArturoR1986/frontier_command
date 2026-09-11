# Frontier Command — Prototype Archive Notes

This folder is for historical prototypes and experiments only.

Do not treat archived implementations as the required production architecture.

## Prototype lineage

### v0.1

Self-contained browser prototype demonstrating:

- four named colonists
- Alloy / Biomass / Food
- base construction
- needs
- Rangers
- turrets
- simple raids

### v0.2

Visual-direction prototype:

- Ashwater Basin
- stronger building footprints
- stronger unit silhouettes
- environment grammar
- separate simulation/render direction

### v0.3

Playtest-focused prototype:

- camera zoom/pan
- task feedback
- construction bug fix
- slower opening
- telegraphed first raid

### v0.5 staged source

A larger experimental self-contained build was previously staged in another repository during prototyping:

`ArturoR1986/peaklogic-intake-console`

Branch:

`artifact-transfer`

Path:

`frontier-command-v0.5.html`

This file is reference material only. It experienced a startup initialization failure in the creator's real test, showing that the UI shell could load while the simulation did not.

### v0.5.1 recovery experiment

A local recovery build was subsequently created with:

- auto-start instead of the fragile start menu path
- visible fatal-error panel
- simplified colony startup
- colonists/resources/buildings populated immediately
- construction, hauling, power, Exposure, camera, minimap, and basic AI retained in simplified form
- JavaScript syntax check passed

The recovery build was useful as debugging evidence but is not considered production-quality or a required base for v1.

## Lessons Codex must preserve

1. **Run the game, not just syntax/build checks.**
2. A visually loaded UI can still hide a dead simulation.
3. Startup needs a smoke test.
4. Multi-tile construction needs regression coverage.
5. Work should be world-visible.
6. Early combat should not destroy onboarding.
7. The production architecture may be rebuilt cleanly.

## Archive policy

When Codex replaces a meaningful playable milestone, preserve the previous version here only when it remains useful for regression/reference.

Do not let old prototypes become active dependencies unless intentionally migrated and tested.