# Frontier Command — lasting colonies, contested worlds

Guidance 0.4, 2026-09-11. **Design target, not implemented behavior.** The latest creator clarification takes precedence over earlier research recommendations. Evidence: creator direction recorded in [DECISIONS.md](DECISIONS.md), [gameplay study](GAMEPLAY_RESEARCH_2026_09_11.md) and [developer/player review](DEVELOPER_AND_PLAYER_REVIEW.md).

## Decisions from the developer/player review

The documentary review supports testing a society that produces military power and wars that change the society. These remain design hypotheses, not proven player responses:

- Put shared authority and two independent clients inside the first integrated gameplay proof. P2 hardens that foundation.
- Prioritize dependable commands, readable causes and a concrete strategic opportunity before broad content. Test navigation separately from combat balance.
- Let larger territory introduce routes, commitments, delegation and diplomacy. Population growth must not merely multiply household maintenance.
- Make opponent capabilities economically earned. Do not silently create stronger rival armies solely because the player accumulated wealth.
- Use squad and production controls to preserve strategic choices while reducing repetition; do not inherit classic selection limits as a requirement.
- Integrate new systems into ordinary colony and military decisions. Preserve visible individual consequences as forces grow.

Offline windows, recovery, unequal entry and realm victory remain experiments. Neither reference validates the proposed timer values. See review sections 9-11 for tradeoffs, rejection conditions and human-evidence requirements.

## Confirmed direction and purpose

Combine RimWorld and classic StarCraft in an original game. Colonies persist between sessions. Players develop strong colonies, conquer weaker rivals, expand into a larger world and encounter powerful colonies from other realms, with cooperation or war. Dominance must be possible. The current 64×48, 16-person restoration sandbox does not satisfy this direction.

The player governs a colony and commands expeditions. **Build a society capable of taking and holding a growing domain.** Each stage reveals a concrete opportunity, benefit, cost and competing threat.

## Two connected scales of play

**Confirmed creator direction:** the main home map is large and supports substantial exploration, claiming local resources, experimentation and colony growth. Mountains and the environment affect base layout, resource access and strategy. This is an engaging phase in its own right. The earlier first-hour expedition example is illustrative, not a deadline that forces the player out of an inadequate home map.

The second scale is a much larger world map or globe containing other tribes, colonies and human players. Local play continues after world travel becomes available. A home region is a detailed place inside that world, not a tiny base screen or a separate disposable mission. Connected realms remain the later extension of the persistent-world goal; the wider map must already support meaningful interaction before realm dominance.

**Design implications to prove:** terrain presents multiple viable settlement layouts, resource approaches and defensible routes. Local and world views share locations and movement state. Terrain looks and traversal rules agree. Exact map dimensions and the world map's projection are engineering/design choices, not confirmed numbers. The nine-region fixture remains an internal test world, not a maximum globe size.

## Distance, transport and technology

**Confirmed creator direction:** travel and distance should feel reasonably realistic; vehicles and technology materially improve mobility across the larger world.

**Proposed implementation:** show route, distance, estimated arrival and supply requirements before dispatch. Travel time depends on route length, terrain, transport mode and load; vehicle types have actual passage constraints. Improved transport changes speed, carrying capacity or reachable routes rather than unlocking a decorative map button. Fuel/energy, repair and operating requirements should make transport investment meaningful; exact formulas and clock compression remain playtest variables.

People and cargo occupy one location while travelling. Travel, vehicle boarding and map transitions must preserve identity, ownership, crew and cargo through saves, reconnects and interruption. A slower distant journey should create a planning choice; literal real-world waiting times have not been selected.

## People, vehicles and robots

| Category | Confirmed role | Proposed consequences to test |
| --- | --- | --- |
| Skilled civilians | Long-lived individuals whose skills take substantial time to develop; hero-like value to the colony. They can operate vehicles. | Preserve identity and earned skills across assignments. Mobilizing a specialist removes their civilian contribution. Treatment, evacuation and experienced replacements matter. |
| Crewed vehicles | Valuable investments operated by people, with examples including walkers, tanks and ships. They are less expendable than rapid RTS replacements. | Boarding assigns a real operator; relevant experience affects a disclosed operating capability. Crew and hull have separate state. Repairing or recovering a disabled vehicle can be preferable to replacement. |
| Manufactured robots | More replaceable military units produced in colony facilities. Costs vary with technology; basic units can be affordable while advanced units are expensive. | Fabrication consumes actual inputs and time. Robots supply replaceable combat strength without requiring a newly trained civilian for every casualty. Higher tiers need distinct tactical roles and meaningful production costs. |

The creator's Goliath reference illustrates a piloted combat walker; use original designs and naming. Examples do not freeze the final vehicle roster, seat counts or skill formulas. Hero-like value does not establish a separate supernatural hero class or an invulnerability rule. Crew survival after vehicle destruction is unresolved: prototype visible evacuation/rescue options and distinguish vehicle damage from operator injury, without promising automatic survival.

The combat reference is StarCraft's tactical fighting: responsive orders, readable engagements and meaningful positioning. The economy and replacement pace must support durable people and equipment. Population growth, robot production and vehicle construction are separate processes, not one generic unit queue.

## Progression

| Stage | Main decision | Result and next purpose |
| --- | --- | --- |
| Establish a home | Explore local terrain, claim resources and choose a base layout | A substantial local economy and developing people support continued home play. |
| Develop capacity | Invest in skills, robot fabrication, vehicles, production or defenses | Different field capabilities and transport options compete with domestic investment. |
| Reach the wider world | Scout a destination and choose crew, transport, cargo and route | A journey reaches another tribe, player or resource opportunity at a visible time and cost. |
| Contest a region | Raid logistics, defend, negotiate or assault | The rival loses supply/production or yields territory; the player incurs casualties and upkeep. |
| Consolidate a domain | Repair, supply and staff occupied territory | Assets contribute after integration; overextension creates vulnerable routes. |
| Connect realms | Establish contact with another developed domain | Trade, access agreements, joint operations or war with another persistent player. |

A region contains detailed terrain; a realm contains connected regions; the wider world connects realms. Linked local/world views show travel times and ownership. Final capacity requires profiling detailed home maps alongside robots, vehicles and travelling parties, rather than only empty map area.

## Civilian and military interaction

People retain identity, learned skills, needs, wounds and assignments. Squads simplify commands without deleting individuals. Field duty and vehicle operation reserve real people/equipment and preview lost civilian staffing. Production needs labor, inputs and facilities; training takes time and equipment. Robots have their own production costs and damage state. Rival forces cannot appear from an abstract threat timer.

Goods live at owned locations. Routes supply food, equipment and materials to outposts. A broken route consumes local reserves before readiness falls; show cause, buffer and recovery action. Homes need purposeful ordinary work and living conditions without constant emergency clicking.

Opponents use the same economy and ownership rules. AI is a reproducible development opponent, not a substitute for human multiplayer. Scouting reveals observations; hidden enemy changes do not magically update intelligence.

## Persistent rules and open offline-attack decisions

**Latest creator direction:** this is long-lasting online/offline play, colonies can be subject to attack while their owners are absent, and interaction rules will be worked out through play. This does not select unrestricted destruction, permanent protection, or any exact schedule. Do not block the initial playable experience on finalizing these rules.

The following are reversible candidates, not approved final rules or verified balance:

- A server owns time and state. Menus pause local input only; solo rehearsal can offer pause. Civilians follow stored policies while the owner is absent, with recovery reserves and a return summary.
- Compare frontier raids and core attacks with and without notice or scheduled windows in disclosed test scenarios. The earlier 24-hour notice and daily two-hour window are historical candidate values only; the later exact-battle-time suggestion is also provisional. Offline status must not silently change the selected test rules. Test standing defenses, ally intervention, return summaries, timezone abuse and indefinite avoidance.
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
