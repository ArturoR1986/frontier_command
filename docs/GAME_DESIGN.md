# Frontier Command — lasting colonies, contested worlds

Guidance 0.3, 2026-09-11. **Design target, not implemented behavior.** Supersedes the small restoration-community scope. Evidence: [gameplay study](GAMEPLAY_RESEARCH_2026_09_11.md).

## Confirmed direction and purpose

Combine RimWorld and classic StarCraft in an original game. Colonies persist between sessions. Players develop strong colonies, conquer weaker rivals, expand into a larger world and encounter powerful colonies from other realms, with cooperation or war. Dominance must be possible. The current 64×48, 16-person restoration sandbox does not satisfy this direction.

The player governs a colony and commands expeditions. **Build a society capable of taking and holding a growing domain.** Each stage reveals a concrete opportunity, benefit, cost and competing threat.

## Progression

| Stage | Main decision | Result and next purpose |
| --- | --- | --- |
| Establish a home | Allocate labor between food, housing and equipment | Reserves and rested specialists make an expedition sustainable. |
| Develop capacity | Invest in civilians, production, training or defenses | More output and different field capabilities; army growth competes with domestic investment. |
| Reach the frontier | Scout a route and choose a resource outpost | A supplied outpost adds material income or an equipment tier. |
| Contest a region | Raid logistics, defend, negotiate or assault | The rival loses supply/production or yields territory; the player incurs casualties and upkeep. |
| Consolidate a domain | Repair, supply and staff occupied territory | Assets contribute after integration; overextension creates vulnerable routes. |
| Connect realms | Establish contact with another developed domain | Trade, access agreements, joint operations or war with another persistent player. |

A region contains detailed terrain; a realm contains connected regions; the wider world connects realms. Linked local/regional views show travel times and ownership. The first nine-region proof is a test fixture, not the final size limit. Final capacity requires profiling.

## Civilian and military interaction

People retain identity, skills, needs, wounds and assignments. Squads simplify commands without deleting individuals. Field duty reserves people/equipment and previews lost civilian staffing. Production needs labor, inputs and facilities; training takes time and equipment. Rival forces cannot appear from an abstract threat timer.

Goods live at owned locations. Routes supply food, equipment and materials to outposts. A broken route consumes local reserves before readiness falls; show cause, buffer and recovery action. Homes need purposeful ordinary work and living conditions without constant emergency clicking.

Opponents use the same economy and ownership rules. AI is a reproducible development opponent, not a substitute for human multiplayer. Scouting reveals observations; hidden enemy changes do not magically update intelligence.

## Persistent rules selected for prototyping

These are reversible Codex design choices, not additional user requirements or verified balance:

- A server owns time and state. Menus pause local input only; solo rehearsal can offer pause. Civilians follow stored policies while the owner is absent, with recovery reserves and a return summary.
- Frontier raids can damage logistics. Taking a core requires a declared siege, advance notice and a published defense window. Prototype 24-hour notice and a defender-selected daily two-hour core vulnerability window. Travel cannot bypass it. Test timezone abuse and indefinite avoidance.
- Conquest transfers territory and repairable productive assets after military control and occupation. The loser can surrender, accept subordination or evacuate survivors. A refuge preserves a recovery path without retaining conquered territory for free.
- Occupation requires a supplied garrison and integration time. Expansion exposes routes and increases administration costs. Strength remains advantageous; overextension and coalitions offer resistance without making conquest cosmetic.
- A dominant colony wins a realm after controlling strategic centers and capturing or securing formal submission of remaining cores, then maintaining that state through a published contest period. Prototype a 24-hour hold. Record the winner and open outward progression; do not reset the colony/world. Allies can assist a colony's victory; shared victory is not assumed. Further connected realms extend the contest.
- Initial diplomacy offers explicit peace/war, trade, access and revocable alliances/shared vision. Access revocation gives a visible withdrawal grace period before stranded units become hostile. No instant surprise attack through a canceled treaty.

Notice/window/hold numbers are experiments. Accelerated fixtures test correctness, but real offline/online sessions must assess the waiting experience.

## Clarity contract

Always answer: **What am I pursuing? Why does it matter? What blocks it? What can I do next?** Start with a local need, show the resulting capacity, then reveal a contested resource. Explain a blockade through the route and reserve, not an unexplained percentage. New buildings, traffic, forces and territory states make growth visible beyond the HUD.

Provide optional guidance and an inspectable progression map without enforcing one build order. After five minutes, a new player should identify the purpose and explain one meaningful next choice.

## Architecture and finite release boundary

Preserve tested rules where useful. Introduce stable world/realm/region/faction/entity IDs, ownership and validated commands. Use regional navigation plus local paths, spatial indexes and visibility-filtered subscriptions. Peaceful inactive regions may advance coarsely; contested regions require consistent authoritative detail. Verify equivalence and activation transitions.

Keep the browser as the first client. Build a durable local server before public hosting. Account operations and abuse handling remain production work. Cross-realm travel requires exactly one owner and a durable transfer record so crashes/retries cannot duplicate people or goods.

Finite v1 includes the complete loop, at least two connected persistent realms, real human clients, lasting ownership, conquest/recovery, cooperation/war and tested domain victory. Load targets are in the plan, not a massive-multiplayer claim. Mobile, paid economies and copied franchise content are excluded. Persistence, territorial growth and cross-realm interaction cannot be excluded to close Issue #1.
