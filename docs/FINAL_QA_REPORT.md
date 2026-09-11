# Final QA report — Frontier Command 1.0

Guidance/release gate: revision 0.2, 2026-09-11. Owner: Codex for Issue #1.

**Status: PASS — all eight outcome gates satisfied for the finite design.** The exact-revision opening completed successfully; the tested runtime, package and CI results below are verified.

## Exact deliverable

Runtime/source release commit: `6814c55daa59f36786747b69caacc87fb20528ff` on `codex/issue-1-v1`, reconciled with corrected main guidance `051747f`. Subsequent evidence-only commits do not change the tested runtime.

- Playable ZIP: `artifacts/frontier-command-1.0.0-6814c55.zip`.
- SHA-256: `9A5424FE803510155AA0ADD863DE0775C3AFDE783304408BB60C534C60BFB470`.
- Independently extracted and tested: `artifacts/release-6814c55/`.
- Package entry: open a terminal in the extracted folder, run `node serve.mjs`, then open `http://127.0.0.1:4173` and choose **Begin landing**. Requires Node 22+ and desktop Chrome/Edge; no npm install or network is required to play.
- In this workspace the same tested build is served from `dist/` at the address above. A local server must remain running.
- Source and review: https://github.com/ArturoR1986/frontier_command/pull/2.
- Candidate PR CI passed: https://github.com/ArturoR1986/frontier_command/actions/runs/34592954394. It includes static checks, 35 tests, build, hour profile, browser smoke and civic/expedition browser session.

The local ZIP has its own checked `build.json` naming the exact source commit. The earlier e23b2fd package and QA_REPORT.md are historical and superseded for completion purposes.

## Outcome gate assessment

| Gate | Evidence / result |
| --- | --- |
| 1. Scope and design | GAME_DESIGN.md defines civic expedition strategy: one 64×48 basin, 16 people, twelve functional structures, three improvements, three active restoration objectives, independent-community achievement and continued sandbox. PRODUCTION_PLAN.md bounds work and measurable targets. |
| 2. Reference evidence | REFERENCE_FINDINGS.md identifies classic StarCraft developer material and RimWorld base/expansion sources separately, plus directly inspected official screenshots. Observations, interpretations and tests are separate. Unavailable private recordings are explicitly unreviewed. |
| 3. Playable whole | The no-resource-injection campaign starts a new colony, physically builds food/housing/industry/community/defense, recruits/equips people, scouts and clears sites, delivers restoration materials, earns the achievement and continues after save/load. Its three restorations finish at 324.25, 408.25 and 502.75 simulated seconds; seven people survive. This is a scripted efficient run, not a claim about typical player completion time. |
| 4. Functional integrity | 35 passing tests cover deterministic starts, construction access and exact deliveries, resource ownership under cancellation/depletion/death, cargo/work interruption, route recovery, direct/group commands, farm/power/research/defense, wounds/care, homes/Commons/charters, disclosed site commitment/rewards, destruction/recovery, and valid/corrupt/migrated saves. |
| 5. Visual/experiential integrity | Actual package and world captures reviewed at 1280×720, 1440×900 and 1600×1000, including far/normal/close, new colony, dense base, care, field team, contact, restoration and achievement. Distinct canopies, crop beds, stores, industrial hardware, antenna stations, turrets, rocks and equipment communicate function. Quiet play has layout, staffing, improvements and voluntary exploration; progression does not require waiting for raids. See skeptical review below. |
| 6. Tests and review | Static/build, Node regressions, browser controls, played opening, care/organization, expedition/aftermath, controlled recovery, save/reload/continue, corruption/edge cases and simulated hour are documented below. The exact-revision opening completed 20 simulated minutes with no page errors. |
| 7. Delivery and safety | Actual ZIP extracted and booted with its own included server; no missing files or runtime errors. Controls/onboarding/settings, source, architecture, credits and release limitations supplied. Original code-drawn art and synthesized audio; no copied commercial assets, paid infrastructure, private recordings or unrelated project changes. |
| 8. Completion record | This report identifies the exact source/package and evidence. The exact-revision opening and all other mandatory checks passed. |

## Measured coupling, not separate feature flags

- **Labor/field duty:** the only builder is mobilized while carrying reserved construction goods. Construction remains at zero during duty, with unchanged cargo/stock. Save/reload and release complete the habitat with exactly 24 alloy spent. The player gains a field unit by losing that worker's production.
- **Care/capability:** a wounded specialist works more slowly, cannot self-clear the wound through sleep, and recovers when another person physically transports two food and completes treatment. The browser session assigns Lena, saves during care transit, reloads and observes treatment. Two wounded caregivers can recover and treat each other without deadlock.
- **Organization:** Industry increases gathering rate while consuming hunger/rest faster. Recovery trades work rate for treatment/rest. Assigned-home comparison changes recovery time through travel. Commons visits consume one food and restore connection; aid/loss changes connection and leaves visible personal history. These are a compact social model, not simulated relationships.
- **Investment/position:** equal-worker depot comparison exceeds a 20% throughput improvement before reserve caps are reached. Footprint access, distance, fertile soil, power reach, rock/wall sight lines and channel movement affect actual work or defense.
- **Preparation/progression:** the same trained workers travel as a team and fight disclosed defenders before restoration. All three cost ordinary materials/labor. Separate comparisons confirm +25% crop growth, doubled research progress and +60 seconds warning from the respective restorations. The full run receives no injected equipment, health, resources, site flags or combat wins.

## Commands and scenarios actually executed

| Command/scenario | Result and evidence |
| --- | --- |
| `node scripts/check.mjs` | Syntax/whitespace passed. |
| `node --test` | 35/35 passed, none skipped. Includes full campaign and a 60-minute integrated settlement scenario. |
| `node scripts/build.mjs` | Standalone `dist/` built from named release commit. |
| `node --expose-gc scripts/profile.mjs` | 60 simulated minutes at 16 people/80 buildings; 16/80 remain at end. No unbounded event/effect growth. |
| `node scripts/smoke.mjs` | Real browser input for startup, selection/groups, direct orders, placement/rejection, stop, camera, pause, save/reload, corruption handling, civic controls, site feedback and supported screen sizes. Passed with zero page errors. |
| `node scripts/community-playtest.mjs` | Real browser care assignment, physical provision job, save/reload, recovery, guarded-site fight, release to work, material delivery and completed station. Passed. The injury fixture is a controlled loss imposed on a genuinely played settlement, not misrepresented combat damage. |
| `node scripts/opening-playtest.mjs` | The exact release commit completed 20 simulated minutes through normal 4× browser speed, including nine constructed structures, five settlers, tools and save/return. This is automated browser input with live rendering, not independent human play. |
| Intentional recovery | Integrated scenario damages a home and settler, removes one arrival, replaces the lost settler, repairs and treats, then saves/loads/continues. Separate regression rebuilds a destroyed hub from salvaged physical goods. Losses are controlled test inputs. |
| Package extraction/launch | PowerShell Compress-Archive and Expand-Archive; `node artifacts/package-check.mjs` launched only the extracted folder at port 4176, checked four settlers/three sites, civic settings, save/reload and no missing files. SHA checked using Get-FileHash. |

Browser tests use Playwright with installed Chrome on this Windows machine. Snapshots are read-only; test fixture imports use the production save path. CI independently runs Chromium on Ubuntu.

## Performance

Measured Windows x64, Intel Core i7-13650HX, Node v24.19.0; browser headless Chrome. These measurements are specific to this environment.

| Measurement | Target | Observed |
| --- | --- | --- |
| Simulation p99 | <16 ms | 0.517 ms |
| Retained heap change after explicit GC | <20 MB | 497,936 bytes (~0.48 MiB) |
| Browser frame p95, 16 settlers/80 structures | <50 ms | 17.6 ms |
| Browser median / p99 | Report | 16.7 / 25.8 ms |
| Simulated stability duration | ≥60 min | 60 min, plus separate campaign and browser scenarios |

## Skeptical developer evaluation

This is a deliberately compact, forgiving settlement/expedition game. Its strongest connection is that named civilian workers also form the field team and perform recovery. Layout affects travel and power; restoration rewards encourage venturing beyond the landing area. An efficiently prepared ranger team can complete the arc quickly and without casualties. That is acceptable for the chosen approachable scope, but it limits sustained tactical difficulty.

The actual captures made several defects apparent during production: stale waiting guidance hid completed victory, safe-window text conflicted with voluntary combat, and the invite button overlaid roster rows. All were corrected and the final browser captures rechecked. Care persistence testing found a same-cell route endpoint bug; recovery testing found wounded caregivers sleeping indefinitely. Those were fixed with retained regression tests.

Structures and worker equipment remain distinguishable across zoom levels. At crowded interaction edges, name labels can overlap; selecting in the scrollable roster remains reliable. At 1280×720 the roster and Community panel scroll, while critical intelligence and the dialog return control stay visible. These are supported compact layouts, not all-information-at-once displays. World text can refresh up to 350 ms after simulation state changes.

Developer inspection supports readability and purposeful play; automated checks do not prove enjoyment. No independent new-player feedback or private-video review is claimed. Memories record aid/loss alongside connection effects; there are no relationships, body-part medicine, room interiors, large armies, multiplayer or mobile controls. The source package has no automatic OS installer and needs the explicitly documented Node server.

No known blocking defect remains. Future balance/art expansion is optional, not unfinished advertised v1 functionality.

## Evidence locations

Machine-readable reports and selected final captures are copied to `docs/qa/v1/`. Full local logs, fixtures, captures, ZIP and extracted package are in `artifacts/`. Scripts/tests remain in source for reproduction. PRODUCTION_STATUS.md records the final milestone state; RELEASE_NOTES.md records supported scope and limitations.
