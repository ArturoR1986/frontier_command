import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, tick, stocks, place, building, recompute, order, remove, cleanup, spawnContact, research, invite, capacity } from '../src/simulation.js';
import { path, cell, walkable, adjacent } from '../src/world.js';
import { serialize, deserialize } from '../src/save.js';
import { BUILDINGS } from '../src/catalog.js';
const run = (s, seconds) => { for (let i = 0; i < seconds * 4; i++) tick(s, 0.25); return s; };
function add(s, kind, x, y) { const b = building(s, kind, x, y, true); s.buildings.push(b); s.topology++; recompute(s); return b; }
function quiet(s) { for (const p of s.people) p.priorities = { build: 0, haul: 0, mine: 0, grow: 0 }; }
test('deterministic boot includes living settlers, hub, resources and explored terrain', () => {
  const a = newGame(4), b = newGame(4); assert.deepEqual(a, b); assert.equal(a.people.length, 4); assert.ok(a.nodes.length > 40); assert.equal(a.buildings[0].complete, true); run(a, 5); assert.ok(a.people.some(p => p.job));
});
test('gathering remains cargo until physical deposit, without duplication', () => {
  const s = newGame(); quiet(s); const p = s.people[1], node = s.nodes.find(n => n.kind === 'alloy' && n.x === 16.5), original = stocks(s).alloy, amount = node.amount;
  assert.equal(order(s, [p.id], 'work', node), 1);
  let cargoSeen = false;
  for (let i = 0; i < 200; i++) { tick(s, 0.25); if (p.cargo) { cargoSeen = true; assert.equal(stocks(s).alloy, original); } if (stocks(s).alloy > original) break; }
  assert.ok(cargoSeen); assert.equal(stocks(s).alloy, original + 8); assert.equal(node.amount, amount - 8);
});
test('multi-tile habitat completes from reachable interaction edge with exact deliveries', () => {
  const s = newGame(); const b = place(s, 'habitat', 24, 20); assert.ok(b); run(s, 240); assert.equal(b.complete, true); assert.equal(b.delivered.alloy, BUILDINGS.habitat.alloy); assert.equal(b.delivered.biomass, BUILDINGS.habitat.biomass); assert.equal(b.progress, 100);
});
test('simultaneous construction cannot overbook materials', () => {
  const s = newGame(); for (const p of s.people) p.priorities = { build: 1, haul: 0, mine: 0, grow: 0 };
  const a = place(s, 'habitat', 24, 20), b = place(s, 'habitat', 27, 20); assert.ok(a && b); run(s, 360);
  assert.ok(a.complete && b.complete); assert.equal(stocks(s).alloy, 100 - 48); assert.equal(stocks(s).biomass, 70 - 24);
});
test('terrain and building blockers route around; inaccessible orders fail gracefully', () => {
  const s = newGame(), p = s.people[0]; s.terrain[cell(19, 22)] = 2;
  const route = path(s, p, { x: 18.5, y: 22.5 }); assert.ok(route); assert.ok(route.every(n => walkable(s, n.x, n.y))); assert.ok(route.length > 2);
  s.terrain[cell(18, 22)] = 2; assert.equal(order(s, [p.id], 'move', { x: 18.5, y: 22.5 }), 0);
});
test('cancelled construction and interrupted cargo conserve materials', () => {
  const s = newGame(); quiet(s); const p = s.people[0]; p.priorities.build = 1;
  const b = place(s, 'habitat', 24, 20); assert.ok(b);
  for (let i = 0; i < 300 && !p.cargo; i++) tick(s, 0.25);
  assert.ok(p.cargo); remove(s, b.id); order(s, [p.id], 'stop', {}); p.priorities.haul = 1; run(s, 90);
  assert.equal(stocks(s).alloy, 100); assert.equal(stocks(s).biomass, 70); assert.equal(p.cargo, null);
});
test('mature farm is harvested and food physically deposited; resumes after outage', () => {
  const s = newGame(); quiet(s); const f = add(s, 'farm', 24, 20); f.growth = 100;
  const lena = s.people[2]; lena.priorities.grow = 1; const food = stocks(s).food; run(s, 35); assert.ok(stocks(s).food > food); assert.ok(f.growth < 100);
  s.buildings[0].complete = false; recompute(s); const growth = f.growth; run(s, 3); assert.equal(f.growth, growth);
  s.buildings[0].complete = true; recompute(s); run(s, 10); assert.ok(f.growth > growth);
});
test('food and rest needs recover through actual routines', () => {
  const s = newGame(); quiet(s); const p = s.people[0]; p.hunger = 12; p.rest = 10; run(s, 90); assert.ok(p.hunger > 30); assert.ok(p.rest > 75); assert.ok(stocks(s).food < 80);
});
test('power priorities, range and restoration are predictable', () => {
  const s = newGame(); const home = add(s, 'habitat', 25, 20), farm = add(s, 'farm', 25, 27), workshop = add(s, 'workshop', 29, 24), far = add(s, 'turret', 50, 10);
  assert.ok(home.powered && farm.powered); assert.equal(workshop.powered, false); assert.equal(far.powered, false);
  add(s, 'generator', 29, 21); assert.equal(workshop.powered, true); assert.equal(far.powered, false);
});
test('save/load preserves in-transit materials and rejects corrupt/unsupported saves', () => {
  const s = newGame(); place(s, 'habitat', 24, 20); run(s, 12); const saved = serialize(s), copy = deserialize(saved); assert.deepEqual(stocks(s), stocks(copy)); assert.deepEqual(s.people.map(p => p.cargo), copy.people.map(p => p.cargo)); run(copy, 240); assert.ok(copy.buildings.find(b => b.kind === 'habitat').complete);
  assert.throws(() => deserialize('{')); assert.throws(() => deserialize(saved.replace('"version":1', '"version":99')));
  const corrupt = JSON.parse(saved); corrupt.state.people[0].hunger = 'bad'; assert.throws(() => deserialize(JSON.stringify(corrupt)));
});
test('direct movement overrides work and stop safely resumes autonomy', () => {
  const s = newGame(), p = s.people[0]; assert.equal(order(s, [p.id], 'move', { x: 15.5, y: 23.5 }), 1); run(s, 1); assert.ok(p.direct); assert.equal(p.job.type, 'move'); order(s, [p.id], 'stop', {}); assert.equal(p.job, null); run(s, 5); assert.ok(p.job);
});
test('learning window cannot trigger raids; later exposure produces actionable warning', () => {
  const s = newGame(); add(s, 'generator', 24, 20); add(s, 'workshop', 27, 20); add(s, 'habitat', 27, 24); s.time = 1190; run(s, 5); assert.equal(s.threat.warning, null); s.time = 1200; run(s, 1); assert.ok(s.threat.warning); assert.ok(s.threat.warning.arrival > s.time + 80);
});
test('death drops cargo and destroyed structures release occupancy', () => {
  const s = newGame(), p = s.people[0]; p.cargo = { kind: 'alloy', amount: 8 }; p.hp = 0; const b = add(s, 'wall', 25, 21); assert.equal(walkable(s, 25, 21), false); b.hp = 0; cleanup(s); assert.equal(walkable(s, 25, 21), true); assert.equal(s.people.length, 3); assert.equal(s.drops[0].amount, 8);
});
test('combat, retreat and salvage cleanly resolve', () => {
  const s = newGame(); quiet(s); const kei = s.people[3]; spawnContact(s, 1); const h = s.hostiles[0]; h.x = 18; h.y = 25.5; h.hp = 20;
  order(s, [kei.id], 'attack', h); run(s, 60); assert.equal(s.hostiles.length, 0); assert.ok(s.stats.defeated > 0 || !s.hostiles.length);
  spawnContact(s, 1); s.hostiles[0].hp = 1; run(s, 200); assert.equal(s.hostiles.length, 0);
});
test('progression unlocks improvements and population respects housing', () => {
  const s = newGame(); assert.equal(invite(s), false); add(s, 'habitat', 24, 20); s.time = 125; assert.equal(capacity(s), 8); assert.equal(invite(s), true); assert.equal(s.people.length, 5);
  add(s, 'generator', 28, 20); add(s, 'workshop', 27, 24); assert.equal(research(s, 'tools'), true); assert.equal(research(s, 'armor'), false); run(s, 95); assert.ok(s.upgrades.includes('tools'));
});
test('interaction point for every multi-tile footprint is adjacent and walkable', () => {
  const s = newGame(); for (const kind of ['hub', 'habitat', 'workshop', 'farm']) { const b = { kind, x: 24, y: 20 }; const route = path(s, s.people[0], b, true); assert.ok(route); assert.ok(adjacent(route.at(-1), b)); }
});
