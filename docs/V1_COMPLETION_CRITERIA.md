# Frontier Command — v1.0 Completion Criteria

Date: 2026-09-11
Owner: Arturo Ruiz Albarrán
Purpose: Define what Codex must satisfy before declaring the game complete.

## 1. Release standard

Frontier Command v1.0 must be a **complete playable game**, not a technical demo or proof of concept.

The final product should support a satisfying session from landing through colony establishment, expansion, meaningful frontier pressure, recovery, and continued sandbox play.

A player should be able to download/run the game, understand the controls, build a functioning settlement, become attached to named colonists, make spatial/economic decisions, face telegraphed threats, recover from setbacks, save progress, return later, and continue without developer intervention.

## 2. Non-negotiable boot/reliability criteria

- The game launches successfully from the documented run path.
- A new game can be started reliably.
- No empty UI-shell startup state.
- Fatal startup/runtime errors are surfaced clearly during development.
- The main gameplay loop can run for at least 60 minutes without unrecoverable corruption or progressive instability in a normal test session.
- Save/load works across supported release builds.
- Loading a save restores a coherent playable state.
- New game/reset works.
- Packaging instructions are accurate and tested.

## 3. Camera and control criteria

The player can:

- pan comfortably
- zoom in/out across strategic and close inspection ranges
- return to a sensible colony framing
- select one colonist
- select multiple colonists
- select buildings
- select resources
- issue movement orders
- issue work/resource orders
- issue combat orders
- cancel/stop orders
- place buildings with clear valid/invalid feedback
- understand when a command was received

Input latency and feedback should feel immediate under normal local conditions.

## 4. World readability criteria

At normal zoom, the player can distinguish without relying on labels alone:

- worker/settler
- security/ranger
- hostile
- Command Hub
- Habitat
- food-production structure
- power structure
- storage
- military structure
- automated defense
- sensor/scouting structure
- primary resources
- blocked terrain
- traversable terrain
- construction blueprint
- damaged/offline structure

At far zoom, the player can still read the broad settlement and threat situation.

At close zoom, the player can visibly inspect work and colony activity.

## 5. Resource/logistics loop

At least the main construction resources and food must have coherent world-visible loops.

Required behavior:

- resource locations exist in the world
- colonists travel to work locations
- gathering takes time
- gathered material is represented as cargo or an equivalent visible logistics state
- material reaches storage/depot before becoming generally available, unless a later production design deliberately changes this
- distance matters
- storage placement can improve logistics
- depleted sources behave correctly
- multiple workers do not duplicate/over-reserve the same impossible quantity
- interrupted jobs recover safely

## 6. Construction loop

Required:

- clear placement preview
- terrain/overlap validation
- blueprint appears immediately after placement
- required materials are visible/inspectable
- materials are delivered physically
- construction does not begin before requirements are met unless design explicitly supports staged partial construction
- structure visibly progresses through multiple construction states
- completion activates structure function
- cancellation handles reserved/delivered resources coherently
- destruction/removal cleans pathing/occupancy state
- multi-tile structures cannot get stuck due to distance/anchor bugs

## 7. Colonist simulation

Every active colonist has at minimum:

- persistent name
- role/specialty
- health
- hunger
- rest
- morale or equivalent state
- skills/priorities relevant to work
- current task
- visible world representation

Required behavior:

- colonists autonomously choose appropriate jobs
- role/priority differences matter
- direct player orders override autonomy
- colonists eat
- colonists rest/sleep
- critical needs affect behavior
- work state is understandable from inspection and world behavior
- dead/incapacitated colonists are cleaned up coherently

The player should begin to distinguish colonists as individuals during normal play.

## 8. Food and settlement-life criteria

Food must be more than a passive number.

Required:

- food can be produced
- food production is visible in the world
- colonist labor contributes where appropriate
- food is consumed
- food shortage creates understandable consequences
- food production can recover from interruption

Quiet-life simulation should include enough routine activity that the colony feels inhabited even without combat.

## 9. Power criteria

Required:

- supply and demand are understandable
- power-producing buildings have a clear role
- power-consuming buildings communicate their state
- insufficient power causes predictable outages/prioritization
- power recovery restores systems
- power contributes meaningfully to settlement capability and/or Exposure

## 10. Terrain/pathing criteria

Terrain must be mechanically meaningful.

Required:

- blocked terrain blocks movement
- pathfinding routes around obstacles
- narrow approaches/chokepoints matter
- buildings affect navigation appropriately
- pathfinding handles destruction/new construction
- colonists and hostiles do not routinely become permanently stuck
- inaccessible orders fail gracefully and visibly

Desirable for v1:

- wear/trails or roads visibly reflect repeated movement
- terrain types influence speed/building/farming/defense where it improves gameplay

## 11. Base-layout criteria

The player's settlement layout must create meaningful tradeoffs.

At least three of the following must have real mechanical consequence:

- storage distance
- work distance
- defensive approach/sight line
- power layout
- housing safety/comfort
- farming suitability
- industrial proximity/noise/pollution
- path congestion
- expansion access

The player should be able to improve a weak layout through redesign/expansion.

## 12. Day/night criteria

Required if retained in final design:

- visual day/night cycle
- settlement lights at night
- readable gameplay despite darkness
- at least one behavioral/systemic change tied to time of day

Night should strengthen atmosphere without making the game frustratingly unreadable.

## 13. Exposure/threat criteria

Threat escalation must be legible and connected to colony state.

Required:

- Exposure or equivalent systemic pressure exists
- player can inspect/understand major contributors
- threats are telegraphed before arrival
- warnings include useful information such as direction, scale, ETA, or uncertainty
- first hostile contact is survivable for a reasonably attentive new player
- early combat teaches rather than randomly punishes
- later pressure scales with settlement capability/state
- threat logic avoids obvious infinite escalation or unrecoverable snowballing in normal play

## 14. Combat criteria

Required:

- player-controlled/security units can engage hostiles
- hostiles navigate toward sensible objectives
- automated defenses work if powered/functional
- damage is visible
- units/structures can die/be destroyed
- dead/destroyed objects clean up correctly
- hostiles can retreat or otherwise exhibit more than mindless suicide behavior where appropriate
- combat aftermath matters: recovery, loot, intel, damage, resource loss, morale, or similar consequences

The first encounter should create a story and future preparation need.

## 15. Progression criteria

v1 must contain a meaningful progression arc beyond placing the first few buildings.

Required:

- settlement develops from landing camp toward established frontier base
- player unlocks or gains access to new capabilities through play
- at least one meaningful economic improvement path
- at least one meaningful military/defense improvement path
- at least one meaningful colony/people improvement path
- progression choices involve tradeoffs rather than only linear upgrades

The final progression structure may use research, construction tiers, workshop upgrades, population milestones, discoveries, or another coherent system.

## 16. Onboarding criteria

A new player should be able to learn without reading external documentation first.

Required:

- opening objective/guide is concise
- first resource task is understandable
- first building placement is understandable
- first construction completion is understandable
- first power/food/housing needs are introduced in manageable sequence
- first threat warning teaches preparation
- controls/help are accessible
- guidance can become less intrusive after onboarding

Avoid tutorial text that replaces visible game behavior.

## 17. UI criteria

Required:

- resources readable
- population readable
- power readable
- current objective readable
- selection/inspection readable
- work state readable
- threat/intel readable
- build options readable
- no core UI overlap at supported desktop resolutions
- no hidden critical controls
- no broken or empty panels in normal game states

UI should support the world, not dominate it.

## 18. Save/load criteria

Save must preserve at minimum:

- world seed/map state
- time/day
- resources
- colonists and stats
- buildings/construction state
- resources/depletion
- power state or enough data to recompute safely
- progression
- threat state safely
- player settings needed for continuity

In-transit/reserved jobs must be restored or safely reconciled without duplicating/loss exploits.

## 19. Audio criteria

v1 should include an original or appropriately licensed audio layer unless the final product direction intentionally ships silent.

If included:

- basic UI feedback
- construction/work ambience
- environmental ambience
- combat feedback
- threat/warning cues
- volume controls

Do not use copyrighted commercial-game audio.

## 20. Performance criteria

Define measurable targets for the chosen stack and document them.

At minimum:

- stable frame pacing on a normal modern laptop at target colony size
- no major memory leak during long-session test
- pathfinding/job scheduling does not freeze the main loop under expected v1 load
- render scale/zoom does not cause severe degradation

Codex should choose realistic target population/map/building counts and test them.

## 21. Accessibility/usability criteria

At minimum:

- essential states are not communicated only by color
- text is readable at default desktop scaling
- controls reference is available
- pause exists
- speed controls exist if simulation speed is variable
- UI buttons have meaningful labels/tooltips where needed

Add further accessibility improvements where low-cost/high-value.

## 22. Error handling criteria

During development:

- fatal errors should be surfaced visibly/logged
- invalid orders should fail gracefully
- corrupt/unsupported saves should not silently destroy current data

Release build should avoid debug noise while still failing safely.

## 23. Testing criteria

Before v1 release, automated coverage must include critical simulation behavior.

Required categories:

- unit tests for pure/core logic
- integration tests for multi-system loops
- launch/smoke test
- save/load test
- deterministic simulation tests where useful
- regression tests for previously discovered critical bugs

Critical regression tests include:

- multi-tile construction distance/anchor bug
- startup blank-shell failure
- resource/cargo duplication/loss
- construction reservation overbooking
- dead/destroyed blocker cleanup
- hostile retreat/path edge behavior
- mature crop/harvest scheduling stall if similar system remains

## 24. CI criteria

Repository should run automated checks on pushes/PRs appropriate to the stack:

- install/build
- lint/format check
- type check if applicable
- tests
- smoke/build artifact check

CI must be documented.

## 25. Documentation criteria

Required final documentation:

- `README.md`
- controls/how to play
- local development setup
- production build instructions
- architecture summary
- testing instructions
- credits/rights notice
- `CHANGELOG.md`
- release notes
- known limitations if any

Documentation must match the actual product.

## 26. Rights/originality criteria

Frontier Command must ship with original project content or assets that are licensed for use.

Do not include copied commercial-game assets, audio, maps, UI artwork, lore, or proprietary text.

Reference inspirations only in internal design documentation unless there is a clear reason to mention them publicly.

## 27. Final QA playthroughs

Before declaring v1.0 complete, Codex must complete/document at least these structured playthroughs:

### A. New-player opening

Goal: verify first 20 minutes are understandable and enjoyable.

### B. Builder/economy session

Goal: verify settlement layout/logistics can be optimized and visually evolves.

### C. Threat session

Goal: verify warning → preparation → combat → aftermath.

### D. Recovery session

Goal: intentionally take losses/damage and confirm colony can recover.

### E. Save/load session

Goal: save during meaningful mid-game state, close/reload, continue correctly.

### F. Long session

Goal: run/play for at least 60 minutes or equivalent accelerated deterministic simulation and inspect stability.

### G. Edge-case session

Try invalid placements, unreachable work, depleted nodes, low food, low power, full population, destroyed routes, multiple simultaneous construction projects.

## 28. Final release gate

Codex may declare **Frontier Command v1.0 complete** only when:

- all non-negotiable criteria pass
- automated tests pass
- production build succeeds
- documented playtests pass without blocking defects
- known issues are genuinely non-blocking
- repository is clean and reproducible
- release notes are written
- final QA report is written

If a criterion is intentionally removed because the design changed, record the decision in `docs/DECISIONS.md` with rationale and ensure the replacement still serves the original product goal.

## Final rule

Do not confuse code volume with completion.

Do not confuse visual polish with system coherence.

Do not confuse passing tests with a fun game.

Build the whole experience, test the whole experience, and release only when the parts work together.