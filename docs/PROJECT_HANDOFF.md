# Frontier Command — Learning transfer and original-game brief

Guidance revision: 0.4 | Updated: 2026-09-11
Creator: Arturo Ruiz Albarrán | Prepared with ChatGPT
Status: corrected production intent; not a specification to finish v0.5

Latest creator direction supersedes the former finite restoration scope: **RimWorld + classic StarCraft; persistent worlds with lasting colonies; territorial growth and conquest; cooperation or war across connected realms.** The earlier completion claim was rejected and Issue #1 is reopened. Read GAMEPLAY_RESEARCH_2026_09_11.md, GAME_DESIGN.md, PRODUCTION_PLAN.md and PRODUCTION_STATUS.md for current evidence, design experiments and the next action. Historical prototype QA is not current product acceptance.

## 1. The central correction

**Latest creator clarification:** local home maps must support substantial exploration and development, with mountains/environment shaping resources and base strategy. A much larger world map adds tribes and players, plausible travel distances, and technology/vehicles that improve mobility. Civilians develop skills over a long time and have hero-like value; they operate valuable vehicles such as original walkers, tanks or ships. Fabricated robots form the more replaceable military force, with costs that vary by technology. StarCraft informs tactical battle feel, not rapid replacement of people and major equipment. Detailed offline-attack rules are deliberately open to playtesting. These requirements supersede incompatible earlier examples; see GAME_DESIGN.md revision 0.4.

The subsequent research request is complete in [DEVELOPER_AND_PLAYER_REVIEW.md](DEVELOPER_AND_PLAYER_REVIEW.md): creators' journals and retrospectives, setbacks, lessons, player praise/criticism, and implications for the persistent-world design. The [PDF](../output/pdf/rimworld-starcraft-development-review.pdf) is the readable companion. This stage changes research and planning only. The revised next implementation introduces shared authority and two clients within P1, then hardens durability in P2; all product milestones remain unpassed.

The creator explicitly clarified that the early trials were a learning curve. The game remained extremely basic and non-functional in important ways; the implementation did not represent what he was trying to create. Transfer the information gathered from those attempts to Codex as guidance for studying the reference games, selecting principles and implementing a new original experience.

**Continuity of learning is required. Continuity of implementation is not.**

The wrong assignment is: recover v0.5, fix it and call its expanded version the final game.

The right assignment is: understand the desired experience and the failed experiments; study classic StarCraft and RimWorld; choose a coherent synthesis; design, build, review and test the resulting game.

## 2. Brief boundaries

This is a research-and-production project, not only maintenance of broken code.

Known from the creator: interest in StarCraft's base/resource/military side and RimWorld's survival/development/society-planning side; desire for an original combination rather than a copy or an arbitrary preference for one reference; frustration with unclear controls, invisible work, stalled construction, premature pressure and a delivered build that did not start; strong delegation of ordinary implementation decisions.

Unknown until Codex studies and tests: best pacing, camera/presentation, engine, population scale, detailed societal model, combat model, progression and finite release content. These are decisions to make, not reasons to repeatedly ask the creator for permission.

Safe working assumption: desktop single-player is the first target, with simple launch on the creator's Windows laptop. A browser is a convenience option, not a technical constraint. Unapproved paid infrastructure, copied commercial content and unrelated personal data are outside scope.

Failure means producing a more polished version of the wrong basic prototype, another disconnected feature checklist, an endlessly expanding design document or a package that cannot be played.

## 3. Preserve these user-facing goals

The player should be able to build and develop a settlement, manage resources and production, care about its inhabitants, and command meaningful defenses or military activity. The world and its contents must be recognizable and interactive. The opening needs room to understand, design, observe and experiment before severe combat pressure.

Routine work should not require constant babysitting, while direct orders should feel responsive. Building placement, routes and environmental features should affect decisions. People, the economy and military activity should change one another rather than run as unrelated subsystems.

These are outcome goals. They do not dictate exact menus, resource chains or building names.

## 4. Separate inherited ideas from requirements

Earlier discussions proposed all of the following. They remain available as hypotheses:

- Working title: Frontier Command.
- Setting: Ashwater Basin, muted industrial frontier, modular repaired technology.
- Perspective: top-down/light 2.5D orthographic with strategic and close inspection zoom.
- Starting people: Mara, Tomas, Lena and Kei; four specialists.
- Resources: Alloy, Biomass, Food and power.
- Structures: Hub, Storage, Habitat, Farm, Generator, Workshop/Refinery, Barracks, Turret, Sensor and Barriers.
- Work: physical cargo, material deliveries, staged construction, worn paths, day/night routines.
- Pressure: an Exposure model connecting growth to detection and hostile attention.
- Long-term scale: person, settlement and operational world; later outposts, factions or diplomacy.
- Emotional phrases: a small vulnerable place that becomes yours; wilderness becoming infrastructure; growth increasing capability and exposure.

None is a proven recipe. Codex may adopt, adapt or reject each. Preserve the intent behind useful ideas, not their literal representation. An alternative pressure model can meet the brief without an Exposure counter. A better society system can replace a handful of static traits. A different camera or engine is allowed.

## 5. Learning sources and limits

`TRIAL_LESSONS.md` distinguishes creator reports, historical assistant claims and proposed responses. It is not a retrospective test certificate. `REFERENCE_STUDY_AND_SYNTHESIS.md` defines the new research method and seed sources; it does not pretend a comparative gameplay study has already been completed.

The earlier uploaded recordings were received but were not successfully inspected through the failing execution path. Do not attribute observations to them without actually inspecting them. No causal claim about YouTube blocking was established.

The initial published handoff had no archived source or recordings. It incorrectly implied a recovery prototype was already preserved in `archive/`. Old source can be consulted if useful and actually available, but retrieving it is not a prerequisite. No unrelated account or personal conversation belongs in this project.

## 6. What Codex should extract from the references

Study actions, feedback, decisions and consequences, not just feature counts. Ask what makes a resource task understandable, what makes a building recognizable, why positioning matters, how people become distinct, what creates quiet engagement and what makes an attack meaningful rather than unfair.

Study the original StarCraft first. Label Brood War/Remastered/StarCraft II material rather than silently treating their behavior as interchangeable. Identify RimWorld base-game, expansion, version or mod context where it matters.

Extract the value of each mechanic before deciding whether its implementation belongs in the new game. Source-derived observations, interpretations and original proposals should be visibly separated.

## 7. Synthesis rather than imitation

The design needs an intentional answer to the conflicts between quick tactical control and autonomous people; short combat timescales and long settlement development; army growth and individual attachment; detailed hauling and player waiting; building richness and visual clutter.

Do not assume that more realism, longer work loops, slower attacks or more systems automatically improve play. Each is a hypothesis with costs. Do not remove the military side merely because early prototype raids were badly paced. Do not reduce society planning to a hunger bar just to preserve RTS speed.

Codex should choose a player role and control model, propose coupled systems, and prove those relationships in a representative playable scene. Testing a small scene is a way to de-risk the final design, not a ceiling on the finished product.

## 8. Expected research-to-build outputs

Keep the research notes selective and practical. Produce an evidence-backed comparison, a short original game design, a finite release plan, and experiments for the major synthesis risks. Then implement the chosen game and continue through the release gate.

Every significant feature should have a chain: source observation or user lesson → extracted value → original design choice → interaction with another system → visible player consequence → test evidence.

The production architecture must serve the new design. Codex may reuse independently useful existing work after review, but no legacy prototype is the default specification. Existing uncommitted or branch work must be preserved while the corrected direction is assessed.

## 9. Completion and autonomy

The target remains a complete, coherent, polished and tested game—not more theory. Define a finite v1.0 scope based on the synthesis, then finish it. The creator should not have to approve normal milestones, move files, reconstruct the chat or discover basic startup failures for the engineer.

Use `V1_COMPLETION_CRITERIA.md` to verify the chosen design's actual implementation and release. Any subjective claim about fun must be identified as design evaluation unless supported by a real player report.
