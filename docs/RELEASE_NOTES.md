# Frontier Command 1.0

Release build prepared 2026-09-11 for Issue #1.

Four settlers land in Ashwater Basin. Establish a home through physical resource work and construction, develop a powered economy, and prepare for the attention your growth attracts. The game continues as a sandbox after the colony establishes a frontier presence.

## Included

- Named people with specialties, priorities, hunger, rest, health and morale; autonomous work plus direct individual/group orders.
- Physical inventories, gathering, hauling, visible cargo, construction deliveries and staged structures.
- Ten structure types covering storage, housing, food, generation, workshop improvements, ranger training, sensors, defenses and barriers.
- Mechanical terrain, routing, line of sight, fertile soil, channel movement penalties and worn routes.
- Tools, defense equipment and medicine improvements; recruitment up to 16 settlers.
- Exposure contributors, 20-minute safe opening, directional warnings, bounded contacts, retreat, salvage, repair and replacement settlers.
- Command Hub reconstruction using salvaged supplies after destruction.
- Day/night atmosphere, lights, quiet routines and original synthesized audio with volume control.
- Selection/command feedback, map navigation, placement previews, in-game onboarding and controls reference.
- Versioned browser saves, autosave, portable import/export and validation before loading.
- Automated simulation, browser, opening and performance checks; GitHub CI and standalone playable packaging.

## Tested scope

Desktop Chrome/Edge, keyboard and mouse, 1280×720 or larger; a 64×48 map, 16 settlers and an 80-building target. See [QA_REPORT.md](QA_REPORT.md) for evidence, exact checks and boundaries.

## Known non-blocking limitations

- One biome and sandbox mode; no multiplayer, campaign, mobile/touch or cloud saves.
- Canvas world interaction is visual and is not a fully screen-reader-driven game. HTML controls are labeled and keyboard focus is retained.
- Natural deposits are finite. Food production is renewable, and contacts can leave salvage.
- Audio uses original synthesized cues/ambience, not recorded voice or a composed music soundtrack.
- Headless performance measurements are machine-specific. Larger colonies than the stated target are not release-certified.
- Playability/readability was reviewed by the implementation agent; this is not evidence of a broad human player study.

No blocking defect is currently identified by the release checks. The QA report distinguishes executed evidence from product scope.
