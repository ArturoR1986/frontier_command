# v1.0 completion — the chosen original game, not repaired v0.5

Guidance revision: 0.4 | Updated: 2026-09-11
Status: outcome-based release gate; Codex must instantiate design-specific tests in its production plan.

## Current mandatory product outcomes

The creator rejected the former restoration scope as completion. **None of the new product gates below has passed.** Historical revision 0.2 QA does not establish revision 0.4 acceptance.

- Readable purpose links colony wellbeing/production to territorial expansion and military capability. Reviewed new-player evidence establishes five-minute goal comprehension and a meaningful next choice; automated clicks cannot prove this.
- Colonies/ownership persist across sessions and authoritative server restarts. Independent human clients share the world; one client's pause/disconnect cannot pause everyone. Ownership checks and retries cannot duplicate resources/orders.
- Geographic/population growth extends beyond the former basin/16-person cap. Distinct regions provide strategic resources, routes and competing interests. Measure PRODUCTION_PLAN.md scale/performance targets on reported hardware.
- The large home map supports substantial local exploration, resource claiming and multiple viable base layouts. Mountains/environment change access, collection and defense. A much larger world map supports actual travel and interaction with tribes and human colonies; it is not only a collection of decorative screens.
- Distance, terrain and transport capability affect journeys with understandable estimates and actual travel state. Technology/vehicles improve mobility or carrying capacity. Validate foot/vehicle comparisons and persistence across journey interruption, map transition and restart.
- Civilian skills develop persistently and materially affect a vehicle-operating role. People can board, operate and leave valuable vehicles without losing identity or duplicating presence. Vehicle damage, crew injury and recovery are separately modeled under disclosed rules. Ordinary civilian replacement is not a rapid expendable-unit queue.
- Manufactured robots provide comparatively replaceable combat strength across different costs and tactical roles. Fabrication, vehicle investment/repair and civilian training all consume real resources or time. Reviewed battles show responsive commands, readable terrain/positioning decisions and a meaningful reason to preserve experienced crews and major equipment.
- Opponent colonies have productive economies. Stronger colonies can conquer useful territory and cores; occupation, supply and recovery have consequences. Defeated players have documented continuing options; offline siege rules work as disclosed.
- At least two persistent realms, each with at least two player colonies, connect for actual travel/trade and cooperation or war. Crash/retry/reconnect tests prove exactly one owner of transferred people/cargo. AI rehearsal or an unlock flag cannot satisfy human cross-realm play.
- Domain victory is achieved through control and remains recorded while colony/world persist. Restoration is not conquest victory. Diplomacy and outward progression follow GAME_DESIGN.md.
- The production plan, including long-lived server reliability, reviewed gameplay, original presentation and distributable client/server experience, is verified. Research and internal slices cannot close Issue #1.

The general quality gates below remain mandatory. Chosen scope, pause and saving must follow this persistent-world direction, not exclude it. Offline attacks are possible, but detailed schedules/protection/recovery policies remain open to playtesting; release requires a disclosed and verified chosen policy, not the earlier candidate timers. Exact balance numbers in the design are experiments, not creator-mandated rules.

## 1. Scope and design gate

A complete release is a coherent original game combining settlement/society development and meaningful resource/base/military play. It is not a renamed reference game, a continuation of the old primitive prototype, a feature checklist or only a vertical slice.

After focused study, Codex chooses a finite v1.0 scope and records the player role, controls/time model, progression, content, supported platform, expected population/map scale and performance targets. Old building/resource/biome names and the Exposure formula are not acceptance requirements. Do not expand forever; do not redefine the hybrid or quality targets away to close the task.

## 2. Reference-to-design evidence

Both references have been studied and important observations have source/edition/access labels. Actual observations are separated from interpretation and proposed mechanics. The design explains what was adopted, adapted, rejected or deferred and how conflicts were resolved. Unavailable recordings are explicitly unreviewed rather than invented evidence.

## 3. Playable whole

The player can start, understand the world, gather/develop resources, design and grow a settlement, organize inhabitants, gain new capabilities, make tactical/economic choices, encounter pressure, recover from a setback, save and return. The final design defines satisfying achievements and continued play or an appropriate ending. It contains more than an opening scene or passive survival timer.

The people/settlement and military/economic layers must materially affect each other. Demonstrate coupled choices involving labor/care, investment/production and positioning/preparation; document their visible consequences. Tests may use alternatives appropriate to the design but may not satisfy this gate with inconsequential need bars or separate minigames.

## 4. Functional integrity

- Boot and new-game paths succeed from the actual package; no empty shell or developer-only launch requirement.
- Selection, navigation, work/build/combat orders, cancellation and any supported group controls work and acknowledge themselves.
- Autonomous behavior and manual intervention have documented precedence, interruption and resumption rules.
- Work has understandable beginning, progress, interruption and completion; failed/unreachable work explains why.
- Multi-cell placement, access, construction and operational activation are coherent.
- Resource/reservation/cargo accounting remains coherent under cancellation, depletion, death, construction, multiple workers and save/load where those models are used.
- Terrain and structures behave consistently with their traversability and tactical cues; navigation recovers after changes.
- Every advertised structure, ability, improvement and encounter has implemented behavior. UI labels or flags alone do not count.
- Individual people and societal organization affect decisions beyond cosmetic names; shortages/care/rest or their chosen equivalents have understandable consequences and recovery.
- Combat creates actual decisions and outcomes; dead/destroyed/retreating objects clean up safely.
- Persistence restores a coherent colony, progression and encounter state. Corrupt saves fail safely and supported compatibility is documented.

## 5. Visual and experiential integrity

Environment, buildings, resources, inhabitants and military/hostile roles are recognizable at normal playing scale, not solely by labels or color. Far and close inspection remain useful. Operating, construction, idle, damaged and disabled states are distinguishable where applicable. Terrain has spatial identity and mechanical meaning rather than being decoration behind counters.

The opening supports learning and enjoyable base design before severe pressure. Quiet play has purposeful activity and meaningful choices, not only waiting. Warnings are understandable and actionable. Progress produces visible development and new decisions. The game has reasons to continue beyond avoiding the next attack.

Review actual scene captures and gameplay sequences. Record which judgments are automated measurements, developer evaluation or real player feedback. Do not claim automated tests establish subjective fun.

## 6. Tests and review

Establish an automated pipeline appropriate to the chosen stack: static/build checks, unit/integration tests, launch smoke test and end-to-end behavior checks. Test the failure classes from `TRIAL_LESSONS.md` without depending on archived code.

Before release, document: a new-player opening; a layout/economy session; a colony-care/organization session; a warning/tactical/aftermath session; an intentional recovery; save/close/load/continue; edge cases; and long-session stability. A simulated stress run is useful but must be labeled as simulation, not human play. Supplement it with real-time rendering/input inspection.

Default stability target: at least 60 minutes of simulated operation, plus representative real-time sessions and a documented target-load performance check. Codex sets and records explicit frame/memory/population/map targets for the engine and available test hardware. Report hardware limitations rather than making unsupported laptop-wide claims.

At final review, examine the product as a skeptical player, not just as its author. Fix material failures and rerun impacted tests plus the final regression suite. Do not delete useful tests or silently skip failures to obtain a green result.

## 7. Delivery and safety

Provide a tested playable artifact or authorized deployment with an unmistakable entry point, correct run instructions, controls/onboarding, pause/settings and readable UI at supported desktop sizes. No source-code viewer link presented as the running game. No missing asset or dependency step silently delegated to the player.

Include source, appropriate CI, test evidence, architecture/run notes, release notes, credits/asset provenance and an accurate limitations list. Original or appropriately licensed content only. Preserve private recordings and unrelated projects; spending and external publication require the proper authority.

## 8. Completion record

Create `docs/FINAL_QA_REPORT.md` identifying the exact release commit/package, commands run, results, artifact locations, reviewed scenarios, remaining non-blocking issues and the design-specific scope covered. The filenames here name required outputs to create, not files claimed already present.

Release only after all defining outcomes and mandatory checks pass. If a platform or permission limitation prevents verification, record a blocker and checkpoint; do not mark it passed. A checkpoint is not a release and a guidance update is not a game build.
