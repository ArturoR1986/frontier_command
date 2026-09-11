# Frontier Command — Complete Project Handoff

Version: 0.1 handoff package
Date: 2026-09-11
Project owner / creator: Arturo Ruiz Albarrán
Status: Transfer from ChatGPT prototyping phase to Codex implementation ownership

## 1. Why this document exists

This is the continuity package for Codex.

Do not treat Frontier Command as a new blank-slate idea. There is already a design thesis, a sequence of prototypes, real playtest feedback, known failures, and a clearer product direction.

Codex should use this document together with `AGENTS.md` and `docs/V1_COMPLETION_CRITERIA.md` as the primary product context.

## 2. Product identity

Frontier Command is an original real-time colony strategy game.

It takes inspiration from two broad design traditions without copying protected content:

- classic RTS: direct control, resources, base growth, production tradeoffs, tactical defense, map topology, macro/micro pressure, strong input feedback
- colony simulation: named people, needs, skills, work priorities, settlement history, quiet everyday activity, emergent attachment

The product becomes distinct when these layers are not separate.

A soldier is still a hungry/tired person who needs housing.

A skilled worker lost in combat is not just an economic unit lost; it is a specific person and capability lost.

A larger economy gives the player more power while simultaneously making the settlement more visible and valuable to outsiders.

### Core identity sentence

> Turn wilderness into infrastructure while the world gradually notices you.

### Central systemic rule

> Growth increases capability and exposure at the same time.

### Central readability rule

> The player should understand what is happening by watching the world, not by reading the sidebar.

### Opening emotional target

> This place is small, vulnerable, and mine.

## 3. Desired game scale

The long-term design has three nested scales.

### Person scale

- health
- hunger
- rest
- morale
- skills
- traits
- roles
- equipment
- schedules
- relationships (later/deeper where useful)

### Settlement scale

- construction
- storage
- hauling
- power
- food
- production
- housing
- paths
- terrain
- defense
- industry
- research / improvement
- expansion

### Operational scale

- scouting
- squads
- outposts
- contested resources
- territory
- raids / hostile contacts
- migration
- diplomacy/factions if they eventually strengthen the product
- broader strategic pressure

Do not jump to operational complexity before person + settlement scale are fun and clear.

## 4. Visual and world direction

The visual target is not photorealism and not a flat debug-board aesthetic.

The desired blend is:

- strong RTS silhouette readability
- a colony that visibly looks inhabited and used
- credible frontier technology
- modular / manufactured / repaired structures
- visible cables, panels, storage, equipment, damage, repairs, and mismatched improvements
- muted industrial sci-fi rather than glossy utopia

The initial biome is **Ashwater Basin**.

It should contain meaningful geography:

- open buildable flats
- rock formations
- cliffs / blocked terrain
- dry river / channels
- scrub
- vegetation pockets
- rich soil / farm-relevant ground where appropriate
- mineral clusters
- natural chokepoints
- approach corridors
- distant resource opportunities
- areas that feel safe vs exposed

Terrain must affect gameplay, not only appearance.

## 5. Camera philosophy

Frontier Command needs a strategy camera with useful zoom levels.

### Far zoom

- whole colony
- strategic silhouettes
- unit/building markers if needed
- terrain and approach routes readable

### Normal zoom

- standard play
- buildings, units, resources, work loops, commands readable

### Close zoom

- colonist identity
- equipment
- construction stages
- cargo
- work animation
- combat detail
- emotional attachment

Camera navigation must feel effortless.

Known user feedback from v0.2/v0.3: inability to comfortably zoom and understand the map was a major problem.

## 6. Unit identity

Initial colonists used in prototypes:

- Mara — Engineer / Builder direction
- Tomas — Prospector / Mining direction
- Lena — Grower direction
- Kei — Security direction

Prototype traits/roles varied, but the intent is stable: colonists should not be interchangeable circles.

Visual identity should use some combination of:

- hair/head shapes
- clothing
- packs
- tools
- armor
- rifles
- role equipment
- body/silhouette variation
- portrait/icon

Selected colonist information should connect directly to the world representation.

Example:

```text
Mara
Engineer / Builder
Current task: Delivering Alloy → Habitat 01
Mood: Good
Hungry: Slightly
Build: high
Combat: low
```

And the player should literally see Mara carrying material toward the Habitat.

## 7. Building language established so far

### Command Hub

Role:

- starting anchor
- storage/depot in early game
- command / settlement center
- population baseline

Visual:

- broad strong footprint
- central core
- antenna / communications language

### Storage Depot

Role:

- physical storage
- shortens hauling
- makes logistics visible

### Habitat

Role:

- population capacity
- sleep / comfort / settlement permanence

### Hydro Farm

Role:

- food production
- visible crops / growth
- colonist tending

### Generator

Role:

- power supply
- industrial visual signature
- contributes to Exposure

### Workshop

Role:

- upgrades / tool efficiency / fabrication

### Barracks

Role:

- Ranger training
- military preparation

### Sentry Turret

Role:

- powered automated defense
- benefits from sight lines / placement

### Sensor Mast

Role:

- extended detection / earlier warnings / scouting information

### Barrier / wall

Role:

- cheap physical defense
- shapes movement and combat

Codex may change this roster if the final game needs it, but every building should have a clear systemic reason to exist.

## 8. Work must be observable

This became one of the most important lessons from the user's playtests.

### Resource cycle target

```text
walk to deposit
→ work
→ visible material collection
→ carry cargo
→ travel to depot
→ deposit cargo
→ stored resource changes
→ repeat
```

### Construction cycle target

```text
place blueprint
→ material request becomes visible
→ haulers deliver resources
→ foundation
→ frame
→ enclosed shell
→ systems / details
→ building activates
```

A building should not simply be a rectangle stuck at 0% and then jump to complete.

### Food cycle target

```text
plant / establish
→ grow
→ tend
→ harvest
→ haul/store
→ consume
```

### Threat cycle target

```text
evidence / signal
→ detection
→ warning
→ direction / information
→ preparation
→ engagement
→ aftermath / loot / knowledge / consequences
```

## 9. Base design must be enjoyable before combat

This is an explicit creator preference.

The game should not begin as a harsh survival test.

The opening should let the player enjoy:

- watching settlers work
- deciding where things belong
- improving walking distances
- looking at terrain
- exploring resource opportunities
- creating recognizable settlement areas
- watching the colony change visually
- learning individual colonists

A good test is:

> Can four colonists, one hub, natural terrain, resources, and a small building roster entertain the player for 15–20 minutes even if no enemy appears?

If not, more combat/content is not the solution.

## 10. Organic settlement structure

The player should naturally begin creating recognizable zones without being forced into rigid zoning.

Potential pressures:

- living areas want safety / lower industry noise
- farms want usable land / power / water/light logic depending on implementation
- storage wants proximity to routes and work
- industry wants storage / deposits / power
- defenses want approach routes / sight lines
- barracks want access to perimeter routes
- generators may create industrial penalties / signature

Road/path direction:

Repeated foot traffic should gradually wear paths into the ground.

Later roads may formalize these routes and improve movement.

The visual settlement should accumulate history.

## 11. Autonomy + direct command

The intended hybrid is:

> colony autonomy + RTS direct orders

Colonists should have work priorities or role-weighted preferences.

The player can override them directly.

Direct orders should win until completed/cancelled.

Example priority model:

| Colonist | Build | Haul | Mine | Grow | Combat |
|---|---:|---:|---:|---:|---:|
| Mara | 1 | 2 | 4 | 4 | 4 |
| Tomas | 3 | 2 | 1 | 4 | 3 |
| Lena | 4 | 2 | 4 | 1 | 4 |
| Kei | 4 | 3 | 4 | 4 | 1 |

Numbers here are illustrative, not sacred balance values.

## 12. Day/night and quiet life

Day/night is valuable because it creates emotional rhythm, not just lighting.

Desired possibilities:

Day:

- colonists spread into work areas
- exploration/resource work
- outdoor construction

Dusk/night:

- lights activate
- people tend to return closer to base
- exterior space feels more dangerous / unknown
- the settlement becomes a visible island of civilization

Quiet-life activity should matter:

- eating
- sleeping
- talking / pausing
- repairing
- hauling
- tending crops
- patrols
- equipment checks
- routine movement

The colony needs moments where nothing catastrophic is happening.

## 13. Threat and combat direction

Early prototype combat arrived too quickly and felt unfair.

User feedback was explicit: attacks within roughly two minutes made it impossible to learn/build and made the game feel like immediate survival instead of a settlement sandbox.

The corrected pacing direction is:

### Phase 1 — Landing

- safe
- controls
- food/housing
- observe work

### Phase 2 — Settlement

- resources
- logistics
- power
- layout
- small environmental problems

### Phase 3 — Warning

- tracks
- signals
- sensor contacts
- distant movement
- directional information

### Phase 4 — First contact

- small number of hostile scouts
- manageable
- educational
- may retreat
- should create story, loot/intelligence, and future preparation

### Phase 5 — Adaptation

- player understands defenses
- threat responds to colony growth

The first attack should almost be enjoyable.

## 14. Exposure system

Threat should emerge from settlement growth rather than a hidden day/raid table alone.

Potential contributors:

- population
- stored wealth
- power generation
- active industry
- territory
- military presence
- detectable emissions
- extraction intensity

Exposure should be understandable enough that the player can reason about it.

It should not become a simplistic punishment meter.

The goal is to make growth create strategic consequences.

## 15. Input feedback rules

Every important command should answer the player visually.

Required examples:

- select → selection ring / highlight
- move → destination marker / movement acknowledgement
- work → resource/work marker
- build → ghost footprint
- invalid placement → obvious invalid state
- valid placement → obvious valid state
- building placed → blueprint immediately
- attack → target marker
- warning → direction / severity / actionable information

Critical question:

> Did the player ever wonder whether the game received their click?

If yes, fix it.

## 16. Prototype history

### v0.1

Self-contained browser prototype.

Included:

- resources: Alloy, Biomass, Food
- four colonists
- Command Hub
- Habitat
- Hydro Farm
- Generator
- Refinery
- Barracks
- Sentry Turret
- mining/harvesting
- construction
- hunger/rest/morale
- Ranger training
- simple raids

Visuals were mostly rectangles/circles/triangles.

### v0.2 — visual pre-production

Goal: establish a coherent visual language before expensive art.

Decisions:

- top-down / light 2.5D orthographic direction
- silhouette-first units
- building footprint language
- Ashwater Basin identity
- terrain grammar
- separate render/simulation files

Known boundary:

Terrain looked tactical but did not really block movement.

### v0.3 — playtest fix pass

Triggered by creator playtest.

Feedback:

- cannot zoom comfortably
- map hard to see
- colonist assignment unclear
- actions invisible
- Habitat construction unclear
- construction stuck at 0%
- combat arrived far too quickly
- base building not fun enough

A real bug was found:

- builder moved toward building center
- completion distance was checked against top-left
- multi-tile structures could become impossible to complete

v0.3 changes included:

- wheel zoom
- +/- / Fit
- Shift/middle drag pan
- task labels
- task lines
- visible construction progress
- clickable colonist roster
- delayed first threat
- weaker first raid
- slowed needs drain

### v0.4 direction (design target)

The key rule became:

> Understand by watching the world.

Target improvements:

- visible work loops
- visible construction stages
- real terrain obstacles
- stronger camera
- stronger colonist identity
- immediate input feedback
- combat escalation
- quiet life
- day/night
- logistics foundation

### v0.5 / v0.5.1 experiments

A larger self-contained browser implementation was attempted.

It explored:

- physical hauling
- storage
- multi-stage construction
- work priorities
- terrain obstacles/path behavior
- day/night
- exposure-driven warnings
- Sensor Mast
- Workshop upgrades
- Barracks training
- save/load ideas

The first v0.5 launch failed during startup and produced only the UI shell.

A recovery build v0.5.1 was created and syntax-checked.

Important lesson:

Do not trust a build because code exists. Launch it, run it, and test the complete startup/gameplay path before delivery.

The recovery prototype is preserved in `archive/` for reference, not as a production architecture requirement.

## 17. Gameplay reference material

During prototyping the creator supplied recordings of:

- Frontier Command playtest
- RimWorld gameplay
- classic StarCraft Terran gameplay

The earlier ChatGPT environment could not reliably decode the MP4 files, so no claim should be made that those recordings were fully analyzed frame-by-frame.

If Codex can inspect them later and the files are made available, use them as design evidence.

Otherwise ask the creator only for specific screenshots/clips/examples when needed.

Do not make the creator repeatedly record broad gameplay if a targeted example is enough.

## 18. What not to copy

Do not copy from StarCraft, RimWorld, or any other commercial game:

- art assets
- sprites
- sound
- music
- maps
- races/factions
- lore
- exact UI
- exact names
- proprietary text
- exact balance tables
- distinctive protected visual assets

Reference mechanics and design principles at a high level.

Frontier Command must develop its own identity.

## 19. Current product question

The core question is no longer:

> Can we make a browser prototype with RTS + colony features?

That has been demonstrated.

The question now is:

> Can Codex turn this design into a complete game where the world itself communicates work, attachment, growth, danger, and history?

## 20. Recommended first Codex actions

Do these autonomously unless the repository already contains equivalent work:

1. inspect all repository documents
2. inspect the archived prototype
3. choose a maintainable production stack
4. establish a clean project architecture
5. create automated boot/simulation tests
6. implement the smallest polished vertical slice of the full v1 loop
7. run it
8. inspect failures
9. improve it
10. keep expanding toward the v1 criteria

Do not spend a long period only writing design documents.

Use the documentation to build.

## 21. Creator working preference

The creator intentionally delegates heavily.

He prefers:

- best judgment over repeated questions
- real artifacts over conceptual loops
- testing over confident claims
- coherent complexity over oversimplification
- visible progress
- strong continuity
- clean versioning
- clear file names
- completed work rather than approval checkpoints

Do not interpret low human intervention as low interest.

The goal is to let the implementation agent use its full capability while the human remains available for genuine direction.

## 22. Handoff status

Architecture intent: sufficiently clear to build.

Current implementation: prototype only.

Current production state: not v1-ready.

Codex authority: broad implementation authority within the project principles.

Next owner: Codex.

Final target: complete, reviewed, tested Frontier Command v1.0.