# Frontier Command — Decision Log

This file records durable design/engineering decisions. Do not use it for trivial implementation details.

## 2026-09-11 — Codex becomes primary implementation owner

**Decision:** Codex takes over implementation continuity through complete v1.0.

**Reason:** The project has enough design clarity to build, and the creator wants minimal intervention.

**Working rule:** Codex makes routine design/engineering choices autonomously, tests them, and continues. Human input is reserved for true directional ambiguity, specific gameplay-reference needs, unavailable external actions, or irreversible choices.

**Tradeoff:** Codex receives broad implementation authority and therefore must compensate with stronger testing, documentation, and self-review.

---

## 2026-09-11 — v1.0 means final product, not prototype

**Decision:** Completion is governed by `docs/V1_COMPLETION_CRITERIA.md` rather than by milestone labels such as prototype, alpha, or vertical slice.

**Reason:** Earlier builds demonstrated ideas but were sometimes delivered before full launch/play validation.

**Tradeoff:** The implementation phase is larger, but the stop condition becomes honest and testable.

---

## 2026-09-11 — Product identity

**Decision:** The core identity is:

> Turn wilderness into infrastructure while the world gradually notices you.

**System rule:** Growth increases capability and exposure at the same time.

**UX rule:** Important actions should be understandable by watching the world, not only by reading UI text.

**Reason:** These rules distinguish Frontier Command from merely combining familiar RTS and colony-sim feature lists.

---

## 2026-09-11 — Colony building precedes pressure

**Decision:** The opening prioritizes settlement-building enjoyment, learning, attachment, logistics, and spatial planning before serious hostile pressure.

**Reason:** Creator playtests found early surprise combat frustrating and destructive to the desired fantasy.

**Implication:** First contact should be telegraphed, manageable, educational, and interesting rather than a hidden timer punishment.

---

## 2026-09-11 — Autonomy + direct RTS control

**Decision:** Colonists have autonomous work logic/priorities, while the player can issue direct orders that temporarily override autonomy.

**Reason:** This is a core hybrid mechanic joining colony simulation with RTS agency.

---

## 2026-09-11 — Physical/visible logistics

**Decision:** Main resources should use visible work/haul/deposit loops instead of silently teleporting into counters.

**Reason:** Playtest feedback showed that invisible processes made assignments confusing and weakened the sense that the colony was alive.

---

## 2026-09-11 — Construction should visibly develop

**Decision:** Buildings use a visible sequence such as blueprint → delivered materials → foundation/frame/shell/systems → operational structure.

**Reason:** Percentage-only construction did not communicate process or satisfaction.

---

## 2026-09-11 — Terrain is mechanical

**Decision:** Terrain must affect movement, pathfinding, defense, access, and/or building strategy.

**Reason:** Earlier terrain visuals suggested tactical geography but did not actually influence gameplay.

---

## 2026-09-11 — Exposure drives pressure

**Decision:** Hostile attention should primarily emerge from understandable settlement state (population, wealth, power, industry, territory, military footprint, detectable activity) rather than an unexplained fixed raid schedule.

**Reason:** This makes threat a consequence of growth and supports the core product thesis.

---

## 2026-09-11 — Production architecture may replace prototypes

**Decision:** Codex may replace/refactor the single-file Canvas/browser prototype architecture.

**Reason:** The prototypes are evidence and reference, not a technical constraint.

**Boundary:** The final game should remain straightforward to run locally and must preserve the product behavior, not the prototype implementation.

---

## 2026-09-11 — Originality boundary

**Decision:** Commercial reference games are principle references only.

**Must not copy:** protected art, sound, music, maps, races/factions, lore, exact UI assets, names, proprietary text, or other distinctive copyrighted content.

**Reason:** Frontier Command must develop a coherent original identity.
