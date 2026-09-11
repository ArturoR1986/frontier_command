# Persistent simulation contracts

Implementation direction, 11 September 2026. The former local restoration simulation remains preserved while the persistent game is implemented separately.

- The server alone advances time and accepts commands. A session owns one faction. Every command includes an id; the durable receipt and resulting world are committed together before acknowledgement. Retries return that receipt. Client menus never pause the world.
- Every person, robot, vehicle and item stack has one stable id and one location: a region, a journey, or a vehicle. Boarding removes independent movement; destruction injures and ejects crew rather than replacing their identity. A single durable world contains both realms so a realm crossing is one atomic transaction, not two independently acknowledged writes.
- Inventory belongs to physical storage, a carrier, a site delivery pile or a journey. Construction consumes delivered materials. Interruption retains carried goods; cancellation returns delivered materials as a physical pile. Goods are never manufactured by retrying an order.
- Autonomous work considers care and urgent needs first, then player priorities. Drafted people suspend ordinary work. Jobs expose approach, work and delivery states. A blocked approach yields a visible reason and retries after a bounded delay. Navigation uses region dimensions and live obstacles; no inherited 64-by-48 global coordinates.
- People gain persistent practice in the skill they use. Fabrication consumes materials and labor. Vehicles require a living operator; operational skill modifies speed/weapon cycle and the interface discloses the modifier. Losing a skilled operator costs colony labor and recovery time.
- Local maps and world routes are separate scales. Journeys reserve their actual participants and cargo at departure; arrival moves those same ids. Distance, terrain and the slowest vehicle/party capability determine ETA. A restart restores remaining simulation time without duplicating departures or arrivals.
- Attacks require hostility. Combat uses range, visibility, obstacles, armor and cooldowns. Holding territory requires a surviving presence and provisions, not merely clicking its icon. Domain victories are historical records; the world continues.
- Offline conquest policy is explicitly experimental until reviewed. Persistence does not imply a validated fairness policy. Human comprehension and cross-realm play evidence remain separate from automated correctness tests.

Acceptance is in V1_COMPLETION_CRITERIA.md. These contracts are implementation commitments, not passed tests.
