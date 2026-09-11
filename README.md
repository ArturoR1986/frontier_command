# Frontier Command

Original real-time colony strategy in Ashwater Basin. Four named settlers build a home through visible gathering, hauling and construction. Organize homes, work, care and field duty, then restore three basin installations. Growth raises both capability and Exposure.

Creator: Arturo Ruiz Albarrán. Implementation owner: Codex. Mission: [Issue #1](https://github.com/ArturoR1986/frontier_command/issues/1). See [production status](docs/PRODUCTION_STATUS.md) before treating a development milestone as a release.

## Run

Requires Node.js 22+ and desktop Chrome or Edge. No dependency installation is needed to play, build or run simulation tests.

```sh
git clone https://github.com/ArturoR1986/frontier_command.git
cd frontier_command
node scripts/serve.mjs
```

Open **http://127.0.0.1:4173** and choose **Begin landing**. Stop the server with Ctrl+C.

## Production build

```sh
node scripts/build.mjs
node scripts/serve.mjs --dist
```

The complete game is in `dist/`. To use the downloadable build independently, extract it, open a terminal in that folder, run `node serve.mjs`, and open the local address above. Use HTTP: opening index.html through file:// does not support ES modules. Static hosting at a domain root works; subdirectory hosting requires URL adaptation.

There are no remote assets, CDN fonts, telemetry, accounts or API keys. The local server binds to loopback. The downloaded game runs offline.

## Play

- Left-click selects; drag a box or Shift-click selects a group. The roster also selects people.
- Right-click ground to move, resources to gather, blueprints to assist, damaged structures to repair, or hostiles to engage. X stops orders, then autonomy resumes.
- Build Habitat → Hydro Farm → Generator. Workers physically deliver materials before construction. Leave approaches open.
- WASD/arrows or middle/Shift-drag pan. Wheel/+/- zoom. F or Colony centers the camera. Click the minimap to navigate.
- Space pauses; the speed button cycles 1×, 2×, 4×. Menus pause automatically.
- Build a Workshop for tools, defense or medicine. Barracks train selected settlers. Invite people when housing and food allow it.
- Automatic raids wait 20 simulated minutes. You can start disclosed site expeditions earlier. Afterward, sufficient Exposure creates a directional warning. Rally Kei, power defenses, and repair afterward.

Use **Help** for the full in-game reference, audio volume and guidance settings. [Controls and mechanics](docs/CONTROLS.md) explain the details.

## Saves

Save writes a manual browser-local slot; a separate autosave runs every two simulated minutes. Load prefers manual and falls back to autosave only when no manual slot exists. Menu → Export save creates a portable JSON file; Import save restores one. Starting a new landing first autosaves the existing colony.

Format 2 retains the map, people, needs, cargo, jobs, deliveries, stocks, research, threats and settings. Civic assignments, wounds, suspended work and restored sites persist. Format 1 migrates to civic defaults and adds accessible restoration sites without deleting existing buildings or resource nodes; local landmark terrain is cleared. Paths recalculate safely. Invalid/unsupported saves are rejected before replacing the colony. Browser data belongs to the origin/profile and is lost if site storage is cleared; export to transfer or back up.

## Verify

```sh
node scripts/check.mjs
node --test
node scripts/build.mjs
node --expose-gc scripts/profile.mjs
```

For browser automation only:

```sh
npm install --no-save playwright@1.58.2
npx playwright install chromium
node scripts/smoke.mjs
node scripts/community-playtest.mjs
```

Run tests and profile before smoke: they produce save fixtures in `artifacts/`. The smoke suite uses real interface clicks for placement, commands, pause, save/reload, camera and help. `node scripts/opening-playtest.mjs` plays 20 simulated minutes in a real browser at the normal 4× speed; allow about five minutes.

An existing Playwright can be supplied via PLAYWRIGHT_PATH (absolute index.mjs path), and a Chromium executable via BROWSER_PATH. These are test settings, not game requirements.

[CI](.github/workflows/ci.yml) checks syntax/whitespace, simulation tests, packaging, stress performance and browser behavior, then uploads the playable build. Native JavaScript has no separate TypeScript compilation step.

## Scope and documentation

Target: one 64×48 basin, 16 settlers, 80 structures, keyboard/mouse, 1280×720 or larger. Mobile, multiplayer and campaign play are outside this sandbox release. Natural deposits are finite; farms renew food and contacts may leave salvage. Frontier establishment leads to continued sandbox play.

- [Architecture](docs/ARCHITECTURE.md)
- [QA report and performance](docs/QA_REPORT.md)
- [Release notes](docs/RELEASE_NOTES.md)
- [Credits and rights](docs/CREDITS.md)
- [Changelog](CHANGELOG.md)
- [Original completion criteria](docs/V1_COMPLETION_CRITERIA.md)
- [Agent handoff](CODEX_START_HERE.md)
