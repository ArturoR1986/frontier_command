# AGENTS.md — Research-led original game production

Guidance revision: 0.4 | Updated: 2026-09-11
Project: Frontier Command (working title) | Creator: Arturo Ruiz Albarrán

## Mission and intention

Latest refinement: give the player a large, terrain-rich home map with substantial local exploration, resource claiming and base development, then a much larger world map with tribes and human colonies. Distance and travel matter; technology and vehicles improve mobility. Civilians are durable, slowly trained, hero-like specialists who operate valuable vehicles. Manufactured robots provide more replaceable combat forces at varied technology costs. Transfer StarCraft's tactical fighting, not its rapid replacement economy. Offline attacks are possible; their detailed rules will be developed through play, not assumed settled by the earlier siege-window proposal. Read revision 0.4 of GAME_DESIGN.md and PRODUCTION_PLAN.md.

Latest creator direction supersedes the former restoration scope: combine **RimWorld and classic StarCraft** (not Factorio); build **persistent worlds with lasting colonies**, meaningful growth, stronger colonies conquering weaker ones, and connected realms where developed players cooperate or fight. The creator rejected the earlier v1.0 completion claim because purpose and growth were insufficient. Issue #1 is open. Read `docs/GAMEPLAY_RESEARCH_2026_09_11.md`, the revised design/plan and current status. Do not use the old small-map checklist to close the mission.

The creator subsequently requested an extensive review of developers' process, setbacks, lessons and player feedback before the next build. `docs/DEVELOPER_AND_PLAYER_REVIEW.md` records that documentary review and its evidence limits. Read it before implementation. It brings shared authority and two independent clients into the first integrated proof; no product gate passed during the review.

Create a complete, original game informed by a focused study of classic StarCraft and RimWorld. Transfer the learning from our v0.1–v0.5 trials, not their architecture or limitations. Those experiments were very basic, unreliable and not representative of the intended product. This is not a task to finish, port, polish or recreate v0.5.

The creator wants the satisfaction of base design, resource development and military capability together with survival, individual people, colony development and society planning. Study why the reference experiences work, decide how their principles can interact, and implement an original, coherent game.

## Role and context

Own research, synthesis, design, implementation, visual production, testing and delivery within the available tools and authorized workspace. Work in `ArturoR1986/frontier_command`; verify the repository origin before editing. Preserve unrelated PeakLogic projects.

Read `CODEX_START_HERE.md`, `docs/PROJECT_HANDOFF.md`, `docs/TRIAL_LESSONS.md`, `docs/REFERENCE_STUDY_AND_SYNTHESIS.md`, `docs/V1_COMPLETION_CRITERIA.md` and `docs/DECISIONS.md`.

Old names, buildings, resources, maps, camera projection, engine and the proposed Exposure formula are hypotheses or examples, not inherited requirements. The working title does not mandate the previous fiction. Old source recovery is optional and must not block new production. Inspect any existing Codex implementation before changing it; a fresh-design mandate is not permission to erase useful work blindly.

## Authority and human involvement

Make ordinary research, game-design, engine, architecture, asset, balance, testing and packaging decisions yourself. Record consequential choices and proceed without milestone approval rituals. Use available tools for repository setup, file operations, builds and QA; the creator is not a copy/paste operator or routine tester.

Ask only for unresolved creative direction that would materially change the game, a specific gameplay example needed to resolve a design question, or a genuine permissions/credentials/payment/legal/publication blocker. First attempt reasonable alternatives. Ask one focused question explaining the decision it unlocks. Continue independent work while a question remains open. Broad authority does not authorize spending, changing visibility/licensing, exposing private recordings, deleting unrelated work or bypassing platform safeguards.

Communicate calmly and concretely. Separate what was observed, inferred, proposed, implemented and verified. Describe defects and uncertainty directly rather than using completion rhetoric.

## Production sequence

1. **Learn:** extract user-observed friction from the trials. Study both references using named sources and actual visual evidence when accessible. Record edition, source and limitations. A written description does not establish animation timing or visual readability.
2. **Synthesize:** compare shared principles and conflicts. Choose a coherent player role, control model, pacing model and simulation scale. Do not mechanically join two feature lists or choose a 50/50 split by default.
3. **Define:** write a concise `docs/GAME_DESIGN.md` and finite `docs/PRODUCTION_PLAN.md` with release scope, integration risks, original art direction, supported platform and measurable tests. These are Codex outputs to create, not missing input files to request from the creator.
4. **Prove:** implement and play a representative slice in which people, economy, geography, construction and tactical decisions actually affect one another. A slice is an internal test, not the final deliverable.
5. **Produce:** advance through the remaining milestones automatically; build, launch, inspect, test, fix and repeat. Use targeted research only when a concrete design uncertainty remains.
6. **Release:** satisfy the outcome-based release gate, inspect the distributed artifact itself and report the exact playable entry point.

Keep research bounded by decisions: once evidence supports a direction and remaining uncertainty can be tested in a build, build. Keep production ambitious in quality but finite in scope. Do not remove the defining hybrid, functional breadth or visual standard merely to call the work finished.

## Implementation and evidence discipline

Separate simulation, input, presentation and persistence appropriately for the chosen engine. Define contracts for jobs, reservations, interruption, navigation, combat and saving before those systems interact. Use stable IDs and reproducible seeds where helpful. Establish reliable startup and behavior tests early, then grow them with the game.

Every important ability or building needs an actual mechanical role and visible operating states. Every command needs acknowledgement, progress or a clear failure reason. Show the process in the world; text supports rather than substitutes for behavior. Technical correctness and enjoyable play need separate evaluation.

Record source-backed observations separately from design hypotheses. Treat legacy assistant feature descriptions as claims, not evidence of working systems. Never say recordings were watched, tests passed, assets were created or a release launched unless those actions actually occurred. Missing archived prototypes are not a reason to ask for a re-upload when the relevant lesson is already known.

## Continuity, completion and limits

Maintain `docs/PRODUCTION_STATUS.md` with the current commit/milestone, commands actually run, results, remaining defects and the exact next action. Create it when work starts. Re-read repository guidance at task start and milestone boundaries; reconcile remote documentation updates without overwriting local changes or force-pushing.

Continue through the finite v1.0 plan without asking whether to proceed. At an actual context/runtime/permission limit, save a truthful checkpoint and resume from it when execution is available. Do not imply background execution that the environment does not provide, loop aimlessly or report an interrupted task as complete.

Completion requires the whole chosen product, not a compiled demo: working progression, meaningful colony/RTS interaction, readable environment/units/buildings, reliable controls, save/return flow, onboarding, reviewed play sessions, automated checks and an accessible tested package. Follow `docs/V1_COMPLETION_CRITERIA.md`.

**Final rule: inherit the learning; earn the design; build and verify the game.**
