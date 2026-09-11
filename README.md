# Frontier Command

**v0.2.0 — early playable prototype.** Original persistent colony strategy informed by RimWorld's colony development and classic StarCraft's tactical combat. The creator's intended v1.0 is still in production; tests do not establish enjoyment or release readiness.

Build a lasting home on a 256×256 terrain map, develop named specialists, and work toward vehicles, manufactured forces and supplied territorial expansion across two realms. These systems exist in the current build but their integration, balance, multiplayer experience and long-term reliability remain under review. Creator: Arturo Ruiz Albarrán. Implementation owner: Codex. [Issue #1](https://github.com/ArturoR1986/frontier_command/issues/1) remains open.

## Play the current build

Requires **Node.js 24+** and a desktop browser. No dependency installation is needed.

On Windows, open **Launch Frontier.cmd**, or run:

~~~sh
node scripts/frontier-server.mjs
~~~

Open **http://127.0.0.1:4180/**. Choose an unclaimed colony or restore your existing access key. Keep the server running while playing. Stop it with Ctrl+C. It binds to this computer by default; no public hosting is configured.

The world is stored in **data/world.sqlite**, independently of the browser. Retain your colony access key, available in the field manual, to return from another browser. Client menus do not pause a shared world. The local simulation advances while its server is running and resumes its saved time after shutdown; it does not simulate the computer's powered-off time.

Drag to draw walls or fill floor areas. Use the mouse wheel, WASD, Shift-drag, Whole map and Expand workspace to navigate the home terrain. Research shows its infrastructure/material requirements and lets you assign a named researcher. [Current controls](docs/CURRENT_CONTROLS.md).

## Build, check and back up

~~~sh
node scripts/check.mjs
node --test
node scripts/build.mjs
node scripts/frontier-http-smoke.mjs --package
node scripts/frontier-backup.mjs
~~~

The current development package is in **dist/frontier-command/**. Launch its own server script or Windows launcher. Builds never copy live worlds or access keys. The backup command creates a consistent SQLite backup and verifies its integrity, including when the server is running. Stop the server before restoring a backup; preserve the current database and any WAL files before replacing anything.

Research: [sampled gameplay review](docs/GAMEPLAY_VIDEO_REVIEW.md), [developer/player review](docs/DEVELOPER_AND_PLAYER_REVIEW.md). Production evidence and remaining gates: [status](docs/PRODUCTION_STATUS.md). Historical restoration code and its QA are retained for regression only; npm run legacy serves that earlier prototype on port 4173.
