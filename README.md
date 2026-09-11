# Frontier Command

**Status:** active development / Codex takeover

**Creator:** Arturo Ruiz Albarrán  
**Current target:** complete, tested v1.0

Frontier Command is an original real-time colony strategy game about turning wilderness into infrastructure while the world gradually notices you.

The project combines two design pressures:

- direct RTS control, economy, spatial base building, scouting, defense, and tactical response
- named colonists with needs, skills, autonomous work, visible everyday life, and settlement continuity

The central systemic rule is:

> **Growth increases capability and exposure at the same time.**

The central UX rule is:

> **Important actions should be understandable by watching the world, not only by reading UI text.**

## Start here

Codex should read these files in order:

1. [`AGENTS.md`](AGENTS.md) — implementation authority, autonomy rules, completion doctrine
2. [`docs/PROJECT_HANDOFF.md`](docs/PROJECT_HANDOFF.md) — full project history, design intent, creator feedback, prototype lessons
3. [`docs/V1_COMPLETION_CRITERIA.md`](docs/V1_COMPLETION_CRITERIA.md) — release gate / definition of done
4. [`docs/DECISIONS.md`](docs/DECISIONS.md) — durable design/engineering decisions
5. [`CHANGELOG.md`](CHANGELOG.md) — project evolution

## Codex mandate

Codex owns implementation continuity from this point forward.

The goal is **not** another concept prototype. The goal is a finished game.

Codex should:

- choose and establish a production architecture
- implement the complete gameplay loop
- test continuously
- run the game, not just compile it
- fix defects discovered during testing
- make normal implementation decisions autonomously
- minimize human coordination overhead
- ask the creator only when genuine creative direction, unavailable external action, or a specific gameplay reference is needed

The creator should not be used as a copy/paste operator or continuous approval checkpoint.

See `AGENTS.md` for the full operating contract.

## Product north star

The desired emotional progression is:

```text
landing camp
→ functioning settlement
→ lived-in colony
→ capable frontier base
→ visible regional presence
→ increased attention and pressure
```

The opening should feel:

> **This place is small, vulnerable, and mine.**

The settlement should be enjoyable to build and watch before hostile pressure becomes important.

## Core systems expected for v1

- named colonists
- work priorities + direct RTS overrides
- resource gathering and physical logistics
- storage
- multi-stage construction
- food production/consumption
- hunger/rest/morale
- power generation/consumption
- meaningful terrain and pathfinding
- camera zoom/pan and strong command feedback
- settlement layout consequences
- day/night or equivalent world rhythm
- Exposure-driven frontier pressure
- scouting / warnings
- tactical combat
- defenses
- progression
- save/load
- onboarding
- polished UI
- audio layer if retained in final design
- automated tests and CI

The exact architecture and final system details may evolve if the changes preserve the product identity and improve the finished game.

## Originality

Frontier Command may study commercial games for design principles, but the final product must use original or appropriately licensed assets/content.

Do not copy protected art, audio, maps, lore, factions, UI assets, names, or proprietary text from reference games.

## Development principle

> **Make it exist before making it great — then test it until it becomes great.**

The expected loop is:

```text
build
→ run
→ play/test
→ observe
→ fix
→ improve
→ repeat
```

Do not let research/design become a substitute for producing and testing the game.

## Completion

The release is complete only when the criteria in `docs/V1_COMPLETION_CRITERIA.md` have been met and the whole game has passed final QA.
