# Reference study → principle extraction → original implementation

Guidance revision: 0.2 | Updated: 2026-09-11
Status: Codex research protocol with a few verified seed sources; not a completed comparative gameplay study.

## 1. Study the experience, not just the feature list

Study classic StarCraft and RimWorld in focused passes. Ask what the player perceives, decides and does; how the game acknowledges the action; how state changes; and why the player cares about the result.

For StarCraft, start with the original. Identify Brood War or Remastered material explicitly and use StarCraft II only as a separately labeled secondary comparison. For RimWorld, distinguish the base game from expansions/mods and note relevant version or storyteller context. Do not generalize a modded recording into base-game behavior.

Use primary manuals, developer explanations and directly inspectable gameplay/visual evidence. Record the actual edition, passage, screenshot or clip timestamp. If only text is accessible, identify which visual/timing conclusions remain unverified. Do not invent observations from inaccessible recordings or copied recollections.

Keep the first pass short but decision-producing. Once the main control, pacing, simulation and visual risks can be tested in an original build, move to synthesis and implementation. Broaden research only to answer a concrete unresolved question.

## 2. What to investigate in classic StarCraft

### Action and command readability

Observe selecting a worker or group, issuing a destination, assigning gathering, placing a building, cancelling an order and commanding an attack. What is acknowledged immediately? What changes in the world versus the command panel? How are selection, ownership, readiness and target distinguished?

### Economy and spatial planning

Trace one resource cycle and one new production capability. Investigate travel distance, bottlenecks, production queues, construction access, technology dependencies and the opportunity cost of investing in economy versus defense. What changes when the player expands? Identify mechanisms rather than copying exact costs or build orders.

### Units, buildings and abilities

Look at silhouettes and equipment at normal playing scale, not only promotional close-ups. How does a structure communicate function? How does a unit's range, mobility, ability or vulnerability create a distinct tactical job? Study a quiet scene and a busy battle for visual hierarchy. Translate the functional distinction into original designs rather than renaming reference units.

### Geography and tactical agency

Investigate scouting, unseen areas, approaches, high-ground/cover behavior where documented, worker exposure, defensive placement and retreat. Which decisions can actually change the outcome? Avoid reducing the reference's military depth to a fixed raid countdown.

## 3. What to investigate in RimWorld

### People and autonomy

Observe how priorities, skills, needs and player instructions affect a colonist's choice of work. Investigate manual/drafted control, interruptions, recovery and how the player understands why someone is not performing a task. Which states create individual attachment rather than merely more statistics?

### Settlement and society planning

Study how living space, food, production, health, work allocation and the environment interact. Find decisions about caring for and organizing people, not only placing buildings. Ask how losses, different capabilities and competing needs alter plans. Do not collapse this layer into a hunger meter attached to RTS workers.

### Quiet activity and consequences

Observe ordinary work, hauling, resting, repairs and resource shortages as well as crises. What is interesting between threats? How is the colony's history communicated? What developments create anticipation, attachment, improvement goals or emergent stories?

### Pacing and recovery

Study preparation, warnings/information, encounters and aftermath under identified conditions. What is controllable, variable or uncertain? Which setbacks are recoverable? Do not assume every reference behavior should be transferred merely because it produces drama.

## 4. Observation record

Keep one compact record for each load-bearing finding:

- Source ID, game/edition and access date.
- Evidence type: direct gameplay observation / screenshot / developer or manual description.
- Exact source locator, scene or timestamp; limits of access.
- What was actually observed or described.
- Player decision and apparent feedback/consequence.
- Interpretation: why this may work (a hypothesis, not source fact).
- Transferable value, separated from its particular implementation.
- Cost or incompatibility in our proposed game.
- Adopt / adapt / reject / defer decision.
- Original implementation proposal and the test that could reject it.

Maintain a small matrix in `docs/REFERENCE_FINDINGS.md` as research is performed. That file is an output Codex creates; do not claim it exists or is complete before it does.

## 5. Resolve the conflicts before stacking systems

| Tension to resolve | Design question |
|---|---|
| Immediate RTS orders vs autonomous individuals | When does direct control begin/end, and what happens to pending work and critical needs? |
| Tactical seconds vs settlement hours | What time model, pause/speed controls and encounter duration make both layers usable? |
| Large forces vs individual attachment | Which people are tracked individually, what population scale stays readable, and how does force growth affect colony life? |
| Physical logistics vs waiting and micro-management | What should be simulated explicitly, automated or abstracted while retaining visible cause and effect? |
| Military growth vs survival and society | How do staffing, supplies, care and defense create connected choices rather than separate minigames? |
| Rich environments vs command clarity | Which shapes, contrast, animation and overlays prioritize gameplay information at each zoom? |
| Pressure vs enjoyable construction | How does danger create decisions and consequences without simply punishing development? |
| Persistent colony vs completion/progression | What constitutes meaningful achievement, recovery and continued play in this particular design? |

Consider a small number of coherent overall designs. Compare them against the creator's goals and the trial lessons. Select and record the best-supported one yourself; do not send routine option lists back for approval. Neither an exact 50/50 mix nor a predetermined RimWorld-heavy design is required.

## 6. Original synthesis contract

Write `docs/GAME_DESIGN.md` from the study, including: player fantasy and role; control/time model; session and progression arc; interconnected people/economy/military systems; environmental strategy; original visual identity; and scope boundaries.

For each proposed major system, state both the decision it gives the player and the system it changes. Include intended emotional effect as a hypothesis, not a guaranteed response.

The hybrid should produce choices that would not exist in either layer alone. Do not create a colony simulator with an unrelated wave-defense mode or an RTS where people have inconsequential need bars.

### Illustrative experiments — not a mandatory recipe

**Work and defense:** redirect a skilled person from an economic task to a defensive assignment. Verify that input is immediate and understandable, materials/tasks stay coherent, and the staffing choice has a visible economic and human consequence. Determine a humane, predictable rule for critical needs and resumption.

**Growth and logistics:** compare two layouts serving the same resource opportunity. Verify a meaningful difference in access, throughput or safety that the player can perceive and improve. Do not assume every solution requires a Storage Depot.

**Settlement care and capability:** introduce a new inhabitant, injury or labor shortage. Verify that the settlement's organization and available capabilities change, rather than only its population counter.

**Preparation and aftermath:** present a discoverable threat, allow more than one viable response, and let the outcome change later plans. The experiment must contain real navigation/interaction, not an alert claiming enemies exist.

Select the experiments that test your chosen synthesis. Change weak hypotheses after evidence, not after prose alone.

## 7. Visual production belongs inside design and implementation

Create original concept/asset references for units, buildings and environment after selecting camera and game scale. Use any appropriately authorized asset tools available; do not claim an unavailable tool or generated asset was used.

Each unit family needs a recognizable silhouette, equipment/role, movement/work/attack states, ownership and selection treatment. Each building needs a visible function, footprint/access logic, construction/working/idle/damaged/offline states as applicable, and actual implemented interaction. The environment needs coherent terrain families, landmarks and traversability cues.

Review scene captures at far, normal and close zoom and at supported desktop sizes. Test crowded scenes, not only isolated assets. Small grey boxes plus labels are acceptable temporary debug art, not an automatic final visual standard. Detailed artwork is also insufficient when commands or functions become hard to read.

Define the final art direction independently. The earlier muted industrial basin and 2.5D view are optional proposals, not a style to reproduce.

## 8. Turn the study into production

Create a finite `docs/PRODUCTION_PLAN.md` with milestones, risks and acceptance tests. Choose engine and architecture for the selected experience, not because the earliest experiment used one HTML file. Validate startup, one economic/work loop, one construction cycle, one colony-life interaction and one tactical consequence together. Then complete the release scope, including progression, presentation, onboarding, persistence, audio/settings as appropriate and actual distribution.

Maintain `docs/PRODUCTION_STATUS.md` with evidence and next actions. Research has done its job when it changes a design decision or test; it is not a substitute for building. A prototype proves a hypothesis, not a finished product.

## 9. Seed sources and what they support

These official pages were retrieved during the guidance correction on 2026-09-11. They are entry points, not a substitute for Codex's comparative study.

- Blizzard, classic StarCraft **Resources**: https://classic.battle.net/scc/gs/res.shtml — describes resource gathering/return and the consequences of distance between deposits and receiving structures. This supports an economy/logistics study question, not an instruction to copy resource amounts or worker ratios.
- Blizzard, **Terran Basics**: https://classic.battle.net/scc/terran/basic.shtml — describes construction continuity and examples of support, upgrades and positional use. Separate the documented behavior from visual observations Codex still needs to make.
- Ludeon, **RimWorld**: https://rimworldgame.com/ — describes the colony/story focus, individual needs and skills, relationships, environments and storyteller-driven events. The description alone does not verify timing or behavior in the creator's uploaded recordings.
- OpenAI, **Custom instructions with AGENTS.md**: https://developers.openai.com/codex/guides/agents-md/ — operational reference for repository instructions, not a game-design source.
- OpenAI, **Run long horizon tasks with Codex**: https://developers.openai.com/blog/run-long-horizon-tasks-with-codex — operational reference for maintaining specifications, milestone plans and progress through extended work. It is not a guarantee of unattended infinite execution.

Commercial references remain study material. Produce original assets, fiction, maps, interface design and code or use material with appropriate recorded licenses. Never copy commercial game files into the release or upload private recordings without authorization and privacy review.
