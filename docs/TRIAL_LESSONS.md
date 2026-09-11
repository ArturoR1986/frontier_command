# Trial lessons — v0.1 through v0.5 and the recovery experiment

Guidance revision: 0.2 | Updated: 2026-09-11
Basis: creator feedback and the historical project conversation, not a new replay analysis.
Purpose: help Codex avoid repeating mistakes while designing an original game.

## Evidence labels

- **Creator report:** the player's description, including confusion, frustration or preference.
- **Visible evidence:** a supplied screenshot or inspected artifact; state its limits.
- **Historical claim:** an earlier assistant description of what it built or fixed, not independent proof that it worked.
- **Design hypothesis:** a proposed answer to a problem that still needs testing.

The versions are experiments, not a ladder of verified releases. A later version label does not establish more functionality. These trials do not validate the old engine, art direction, balance, roster or the proposed hybrid as a finished experience.

## Trial lineage, without inflated capability claims

### v0.1 — concept made minimally interactive

The initial experiment explored resource gathering, buildings, people and combat using very simple shapes. Its main learning value is how large the gap remained between a compelling verbal design and its actual representation. Earlier feature lists are historical claims; they are not a production feature inventory.

### v0.2 — first visual differentiation and direct playtest

Creator report: it looked better than the first version, but the map was hard to inspect without comfortable zoom. Colonists could be assigned work, yet what they were doing and how the process worked were unclear. Habitat construction appeared to activate but remain at zero. Hostile pressure arrived roughly within the first two minutes and felt impossible to survive. The creator wanted more enjoyment in base design and development.

This supports the need for clearer interaction and better opening pacing. It does not prove that a particular art style, exact raid delay or construction mechanism will solve the problem.

### v0.3 — proposed usability and pacing repairs

Historical claims: zoom/pan, status labels, activity feedback, a construction-distance fix, gentler needs and delayed/weaker raids were added. The earlier diagnosis attributed the construction stall to inconsistent multi-tile distance anchors. Preserve the reported symptom and the bug class for testing; do not treat that diagnosis as a fresh reproduction or the repair as a passed acceptance test.

The supplied recordings were not successfully reviewed through the earlier failing runtime. They are not available as timestamped behavioral evidence in this brief.

### v0.4–v0.5 — richer theory, uncertain execution

Discussion expanded toward observable work, physical hauling, material delivery, terrain/pathfinding, individual identity, routines, pressure signals and meaningful building functions. Much of this was design direction or source-writing claims rather than demonstrated integrated play.

Visible evidence and creator report: the staged v0.5 opened a UI shell with zeroed counters and an empty game area; the player reported that nothing happened. The screenshot establishes a non-functioning user experience, not the exact code cause.

### v0.5.1 — reduced recovery experiment

A simplified recovery HTML was created and a historical JavaScript syntax check passed. That established parsability only. The recovery was not a verified final game, and reducing scope to restore startup did not resolve the original design ambition. It should not become the default v1.0 foundation.

## Lessons to carry into the new design

| Evidence or failure | What it teaches | What Codex should investigate and test |
|---|---|---|
| Player could not comfortably inspect the map | Navigation is part of understanding, not optional polish | Start framing, pan/zoom range, object size, hit targets and readable states at actual play scale |
| Work assignment existed but activity was unclear | An assigned task is not an understandable process | Acknowledgement, travel/work/carry/wait states, visible progress, target and completion |
| Habitat appeared stuck at 0% | An unexplained wait feels like a broken command | Multi-cell access, requirements, reservations, assignment, interruption and an explicit blocked reason |
| Early combat overwhelmed the opening | Pressure before comprehension suppresses experimentation | A teaching sequence, actionable warning, viable preparation and recovery; not merely a longer hidden timer |
| Player requested more enjoyable base design | A calm period still needs choices and rewards | Several meaningful layout choices, visible change and reasons to improve or explore |
| Player asked what units/buildings actually look like | Names and colored shapes are insufficient identity | Distinct silhouettes, equipment, scale, operating states and contextual abilities |
| Proposed terrain looked meaningful before functioning that way | Visual affordance must match simulation | Rocks, water, walls, routes and access should behave as their presentation suggests |
| Build opened as an empty shell | Packaging and startup are part of the product | Test the distributed artifact from a clean launch, not only the developer process |
| Source links sent the player to a code viewer | A technical artifact is not a usable handoff | One unmistakable play/run route, verified from the player's perspective |
| Feature descriptions exceeded demonstrated behavior | Documentation can falsely inflate progress | Maintain proposed/written/executed/verified states and identify unsupported claims |
| Video-processing calls repeatedly timed out | Available evidence and tools must be established honestly | Inspect accessible files or primary visual sources; label unavailable footage; ask narrowly only when necessary |
| Creator rejects the prototypes as representative | Anchoring production to them would preserve the wrong limits | Use lessons as constraints and tests; design the actual game from the reference study and intent |

## What we have not established

We have not proved that every resource should be hauled individually, that construction needs a fixed number of stages, that four colonists is the right population scale, that the world must use Ashwater Basin, that a single Exposure value is the best pressure model, or that the final game must use an orthographic browser renderer.

We have not proved that the game becomes fun by postponing combat, adding day/night, adding more buildings or increasing graphical detail. Those ideas need integrated playtests. Earlier discussion about relationships, factions, outposts or vehicles is a possibility set, not an automatically committed feature list.

The creator wants both references studied. The trials did not determine a final ratio between their influences or show that one should dominate.

## Translate lessons into questions, not prescriptions

Instead of 'add cargo because the last plan said so', ask: can the player see where resources come from, what delays them and how to improve delivery? Compare implementations and choose one that provides this value without needless waiting.

Instead of 'make raids later', ask: what can the player understand and enjoy before pressure, what warning is actionable, and what does surviving change? Early fighting can remain if it teaches and respects the intended opening.

Instead of 'upgrade the sprites', ask: can a player distinguish functions, ownership, activity and threat under normal gameplay conditions? Better art and better information design must work together.

Instead of 'repair everything in v0.5', ask: what architecture and mechanics best realize the original synthesis, given what the trials exposed?

## Regression evidence for the new game

Create new tests for the failure classes even if no old code is reused: startup/new game, camera and selection, task acknowledgement, multi-cell construction, material accounting, unreachable orders, navigation updates, first-contact comprehension, actual combat, save/return continuity and package launch.

A failed trial is useful because it reveals a risk. It is not an obligation to carry its implementation forward.
