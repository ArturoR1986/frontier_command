# Architecture

Native JavaScript modules, no runtime package dependencies, Canvas 2D world and semantic HTML controls.

| Module | Responsibility |
| --- | --- |
| catalog.js | Buildings, people, research, save version |
| world.js | Seeded terrain, occupancy, adjacency, BFS, sight lines |
| simulation.js | State, commands, work, needs, logistics, power, pressure, combat |
| community.js | Civil/field duty, home assignments, charters, memories and restoration definitions |
| save.js | Data serialization and validation before state replacement |
| render.js | Terrain cache, dynamic world, cargo, stages, minimap |
| audio.js | Original synthesized Web Audio cues |
| main.js | Input, DOM, storage integration and fixed-step loop |

The browser simulates 0.1-second steps independently of animation frames. Tests use bounded 0.25-second steps. Hidden tabs suspend progress instead of attempting unbounded catch-up; dialogs pause. Runtime exceptions stop the loop and surface an error panel.

## Navigation and material ownership

The 64×48 grid combines blocked terrain and living building footprints. Bounded BFS routes to walkable interaction edges, never building centers. Topology versions invalidate routes after placement/removal. Movement follows cell centers continuously; work is timed after arrival.

Inventories belong to depots. Pickup atomically decreases its source and creates cargo. Deposit transfers cargo to storage. Construction claims material only on physical withdrawal, subtracting delivered and in-flight amounts from demand. Cancellation, destruction and interruptions explicitly handle cargo. Research and repair spend from pooled depots; construction always requires delivery.

## Saves and rendering

Format 2 stores data only, including suspended civilian jobs, duty, care provisions, wounds, homes, memories, charter and restoration/defender state. Deserialization validates identity, geometry, inventories, active/suspended work, needs, crop state, research, settings and threats before replacing the colony. Format 1 migrates to civic defaults and adds clear restoration sites near their intended positions, avoiding existing structures and resource nodes. Local terrain around those new sites is cleared. Cargo and reservations persist, routes recalculate, and render caches rebuild. Manual and automatic browser slots remain separate; file import/export needs no backend.

Original Canvas geometry renders structures, people, equipment, cargo, crops, hardware and wear. Terrain/trails are cached in an offscreen surface and refreshed every two simulated seconds; people and structures remain dynamic. This addresses the measured full-map redraw bottleneck.

## Performance and verification

Target workload: 16 settlers, 80 buildings, one 3,072-cell map. Simulation p99 should be under 16 ms. Headless browser frame p95 should be under 50 ms at the maximum fixture; typical measured local performance is faster, but hardware varies. Profile results record environment and timings.

Node tests cover individual mechanics, multi-system behavior, multiple seeds, interrupted material jobs, recovery and an accelerated hour. Playwright sends real interface clicks; the exposed game snapshots are read-only. Tests generate save fixtures and load them through production handling. A separate opening test runs 20 simulated minutes through the normal 4× browser speed control.

Static packaging produces dist/. GitHub Actions checks, builds, tests and uploads that folder. The same local HTTP path is used for development, production smoke and distribution. No hosting or external publishing is needed to play locally.
