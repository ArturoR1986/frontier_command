# Codex — Start here: learn, synthesize, create

Guidance revision: 0.4 | Updated: 2026-09-11
Repository: `ArturoR1986/frontier_command` | Branch for this guidance: `main`
Mission: https://github.com/ArturoR1986/frontier_command/issues/1

## Current direction and next action

**Implementation is now active.** The creator's final instruction is to finish the multi-video study, then build and review autonomously until the game is complete. Read `docs/GAMEPLAY_VIDEO_REVIEW.md` and the current `docs/PRODUCTION_STATUS.md`. New code is in `src/frontier/`, with `node scripts/frontier-server.mjs` serving the persistent development build at http://127.0.0.1:4180/. Continue that work; the research-only checkpoint below is historical. No current release gate has been declared passed.

Latest creator refinement: substantial local home-map play shaped by mountains, resources and terrain; a much larger world map with tribes/players and meaningful travel distances; mobility improved by technology and vehicles; long-developed civilian specialists operating valuable vehicles; manufactured robots at varied costs as the more replaceable military force. Offline attacks remain possible, with detailed rules to be worked out in play. Earlier siege timings and the rushed first-hour expedition example are not fixed requirements.

The creator rejected the earlier restoration sandbox as completion: purpose is unclear, the map is too small, and growth does not lead to conquest. References are **RimWorld and classic StarCraft**, not Factorio. The creator explicitly chose **persistent worlds with lasting colonies**. Strong colonies must take territory, grow into a wider world, and cooperate or fight with powerful colonies from other realms.

Issue #1 remains open. The latest requested stage was an extensive creator/developer and player-feedback review before the next build. That review is now recorded in `docs/DEVELOPER_AND_PLAYER_REVIEW.md`, with a PDF in `output/pdf/` and a source inventory in `docs/research/developer-review-sources.json`. Read it alongside `docs/GAMEPLAY_RESEARCH_2026_09_11.md`, `docs/GAME_DESIGN.md`, `docs/PRODUCTION_PLAN.md` and `docs/PRODUCTION_STATUS.md`.

The former v1 package/QA are historical technical evidence, not acceptance of the requested game. Next implementation: begin P1 with authoritative ownership/location, terrain/travel and person/robot/vehicle/crew contracts, then home-map, economy and crewed-journey fixtures. Include two independent clients in P1; P2 hardens persistence and failure recovery. Continue through conquest and connected realms. A research pass or internal slice does not complete this mission. This design checkpoint contains no new gameplay implementation.

## Important correction from the creator

**You are not picking up the old game where ChatGPT left off.** Versions 0.1–0.5, including the recovery experiment, are learning material about what we tried, what confused the player and what failed. They do not represent the intended game and are not a foundation you must complete.

Your job is to study classic StarCraft and RimWorld, extract the useful design principles, resolve their incompatibilities, and create a complete original game informed by those principles and the trial lessons.

This revision supersedes the previous continuation framing, mandatory prototype roster and assumption that archived code must be recovered first.

## Read, then act

1. `AGENTS.md` — authority, research-to-production loop and evidence discipline.
2. `docs/PROJECT_HANDOFF.md` — actual intent, boundaries and freedoms.
3. `docs/TRIAL_LESSONS.md` — what the experiments taught us, with evidence limits.
4. `docs/REFERENCE_STUDY_AND_SYNTHESIS.md` — what to observe, how to extract principles and how to combine them.
5. `docs/V1_COMPLETION_CRITERIA.md` — functional and experiential release outcomes, not a v0.5 repair checklist.
6. `docs/DECISIONS.md` — fixed intent versus provisional ideas.

Do a focused reference study. Write the short game design and finite production plan yourself, choose the architecture, prove the integrated experience, then continue building and testing through release. Do not ask the creator to approve routine milestones or transfer files you can retrieve/create yourself.

If already implementing, compare your work to this corrected brief. Preserve useful work and adapt what is misaligned. Do not automatically restart everything or discard uncommitted changes. Update your local guidance safely before proceeding.

## Workspace and evidence

Verify that the local repository origin is `https://github.com/ArturoR1986/frontier_command.git` (or its SSH equivalent). Do not search or modify unrelated prompt-module projects. Use authorized tools to clone or open the correct workspace if needed.

The initial published handoff contained documentation only. No legacy game source or playtest videos are required to begin. Local chat attachment paths do not imply those files exist in a Codex checkout. Where media is unavailable, use accessible primary sources and verified visual examples; ask for one targeted example only if it blocks a material decision.

Keep `docs/PRODUCTION_STATUS.md` current. A repository update or issue comment is context, not proof that a separate Codex run has started or consumed it.
