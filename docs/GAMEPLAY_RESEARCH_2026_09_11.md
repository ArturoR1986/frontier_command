# Gameplay study: a colony worth growing and a frontier worth contesting

2026-09-11. Follow-up to the creator's rejection of the earlier completion claim. References: **RimWorld and classic StarCraft**, not Factorio or StarCraft II. Persistent worlds with lasting colonies are confirmed user intent. Proposals here describe our original design.

## Evidence and limits

This pass inspected selected browser-played video frames at the timestamps below, an exported auto-generated transcript excerpt, official mechanics documentation, and our source. It did not review complete playthroughs, measure animation timing, play either commercial game firsthand, or test multiplayer balance. Narrow/illegible frames were not used for detailed UI claims. Timestamps are video positions, not in-game clocks. An attempted later RimWorld sample encountered an advertisement and supplies no evidence.

| Source and edition | Evidence actually inspected | What it supports |
| --- | --- | --- |
| [quill18, Beginner-Friendly Vanilla RimWorld, Ep 2](https://www.youtube.com/watch?v=cSWX10Dzw54&t=180s), title specifies no mods/DLC; exact patch unverified | Frames near 3:00 show beds in a rough interior and a recreation warning; near 3:45, a stockpile/storage filter; near 5:30, colonists and items around enclosed rooms. Auto-transcript excerpt 0:33–9:36 describes sleep/room penalties, filters, hauling priorities, eating and recreation. | Domestic work has reasons: organize space, move goods, improve living conditions. Priority-to-hauling causality is supported by narration, not a continuously observed controlled experiment. |
| [VGL, StarCraft Remastered Terran campaign](https://www.youtube.com/watch?v=pAZ86llMm9Q&t=300s), original campaign rendered in Remastered; exact patch unverified | Frame near 5:00 shows mineral workers, Command Center, Supply Depots and selected supply information. Earlier ~2:00 samples were too narrow for precise tutorial text. | Economic activity and capacity have visible world objects and inspectable status. This pass does not establish the tutorial's complete objective/unlock sequence. |
| [Stu, 1 Terran vs 7 Computers](https://www.youtube.com/watch?v=brcL2Lipi_E&t=900s), Remastered; description names random AI on Meatgrinder; exact rules/patch unverified | Near 6:00: forces at a terrain-constrained approach. Near 15:00: dense military infrastructure and many vehicles. [Near 23:00](https://www.youtube.com/watch?v=brcL2Lipi_E&t=1380s): selected vehicle group fighting in the field, fog beyond it. | Buildup and field command visibly operate at different spatial scales. This unusual AI challenge does not establish standard PvP fairness, persistence, or a full observed victory. |

Official rule evidence, distinct from footage:

- Blizzard's [resources guide](https://classic.battle.net/scc/gs/res.shtml) links resource return distance and worker saturation to income; fresh deposits support production when old sources diminish. **Inference:** expansion should change throughput and capabilities, not reveal more identical empty ground.
- Blizzard's [recon guide](https://classic.battle.net/scc/gs/recon.shtml) connects scouting to enemy production, expansion denial and counter-forces. **Inference:** an opponent needs an economy the player can understand and disrupt; random attacks cannot carry the whole strategy layer.
- Blizzard's [Terran basics](https://classic.battle.net/scc/terran/basic.shtml) describes supply constraints, vulnerable construction, production/upgrade choices and placement. **Inference:** preparation needs opportunity costs and visible bottlenecks.
- RimWorld's [official overview](https://rimworldgame.com/) describes individual colonists, needs, relationships, injuries and colony stories. **Inference:** people should carry consequences between battles, not become interchangeable counters when combat starts.

Neither reference establishes how our persistent cross-realm conquest should work. That is a new design and engineering problem.

## Why the current build feels directionless

The creator reports unclear purpose and inadequate growth. This overrides the earlier developer assessment of completion. Inspection of runtime 6814c55 (merged in b01f827) explains plausible causes:

| Current implementation | Consequence for the requested experience |
| --- | --- |
| src/catalog.js: 64×48 world; population capped at 16 in simulation.js/main.js | Home and frontier share a small finite space; geography and population prevent sustained expansion. |
| src/simulation.js: three restoration sites and an independence achievement | Progress terminates in a local checklist, without a regional power contest. |
| Hostiles are spawned contacts/site defenders without their own settlement or production | Enemy strength cannot be traced to territory, labor, investment or supply. |
| Goods/jobs exist, but no faction ownership or territorial economy | Domestic choices have local effects without a larger strategic purpose. |
| src/main.js: browser-local time, pause, hidden-tab suspension and localStorage | Other players cannot share an authoritative persistent world. |
| src/world.js: whole-map route buffers and footprint scans | Increasing map constants is not a demonstrated scalable architecture. |

Existing care, hauling, construction, interruption and save tests remain useful. They demonstrate parts of a simulation, not a satisfying conquest game.

## Synthesis

**Central loop:** keep a colony capable → invest in production/equipment → scout valuable frontier → establish and protect supply → contest rival territory → occupy and develop the gain → meet stronger colonies across connected realms.

RimWorld contributes the value of home and people. StarCraft contributes the contest over income, information, production and battlefield position. Our proposed connection is material: mobilization costs home throughput; casualties require care and training; good living conditions sustain expeditions; outposts supply capabilities; losing a route constrains an army.

Adopt visible civilian work, direct field commands, readable shortages, scouting and economically funded opponents. Adapt control to squads with persistent individual members. Do not copy a reference UI, race roster or art. Global pause cannot carry into shared play. Deep anatomy/romance simulation and three asymmetric species are not prerequisites.

The next proof must answer whether a player can see why growth matters, choose how to grow, and change the balance against another colony. A larger decorative map or building list would not answer it. See [design](GAME_DESIGN.md) and [plan](PRODUCTION_PLAN.md) for proposed rules and unpassed gates.
