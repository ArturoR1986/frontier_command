import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, tick, stocks, building, place, order, recompute, activateSite } from '../src/simulation.js';
import { setDuty, setCharter, assignHome } from '../src/community.js';
import { serialize, deserialize } from '../src/save.js';
const run = (s, seconds) => { for (let i = 0; i < seconds * 4; i++) tick(s, 0.25); };
const quiet = s => { for (const p of s.people) { p.priorities = { build: 0, haul: 0, mine: 0, grow: 0 }; p.caregiver = false; } };

test('field duty preserves loaded cargo and suspended work across save and release', () => {
  let s = newGame(); quiet(s); let p = s.people[0];
  const target = place(s, 'habitat', 24, 20); p.priorities.build = 1;
  for (let i = 0; i < 200 && !p.cargo; i++) tick(s, 0.25);
  assert.ok(p.cargo); const cargo = structuredClone(p.cargo), stock = stocks(s).alloy;
  setDuty(s, [p.id], true); run(s, 5);
  assert.deepEqual(p.cargo, cargo); assert.equal(target.progress, 0); assert.equal(stocks(s).alloy, stock);
  s = deserialize(serialize(s)); p = s.people[0]; assert.ok(p.drafted);
  setDuty(s, [p.id], false); run(s, 180);
  assert.ok(s.buildings.find(b => b.id === target.id).complete);
  assert.equal(stocks(s).alloy, 76);
});

test('care costs physical food and a worker; wounded people do not self-cure', () => {
  let s = newGame(); quiet(s); s.people[0].hp = 42; run(s, 60);
  assert.equal(s.people[0].wounded, true); assert.ok(s.people[0].hp <= 75);
  s.people[2].caregiver = true; const food = stocks(s).food;
  let observedCargo = false;
  for (let i = 0; i < 400 && !s.community.treated; i++) {
    tick(s, 0.25);
    if (s.people[2].cargo?.purpose === 'care') { observedCargo = true; s = deserialize(serialize(s)); }
  }
  assert.ok(observedCargo); assert.equal(s.community.treated, 1); assert.equal(s.people[0].wounded, false);
  assert.equal(stocks(s).food, food - 2); assert.match(s.people[0].memories.at(-1).text, /Lena/);
});

test('two wounded caregivers can rest and then treat each other without deadlock', () => {
  const s = newGame(); quiet(s);
  for (const p of s.people.slice(0, 2)) { p.hp = 42; p.caregiver = true; }
  run(s, 180);
  assert.equal(s.people[0].wounded, false); assert.equal(s.people[1].wounded, false); assert.equal(s.community.treated, 2);
});

test('charters trade gather speed for consumption and fatigue', () => {
  const balanced = newGame(), industry = newGame();
  for (const s of [balanced, industry]) { quiet(s); const p = s.people[1], n = s.nodes.find(n => n.x === 16.5 && n.kind === 'alloy'); p.x = n.x - 0.5; p.y = n.y; order(s, [p.id], 'work', n); }
  setCharter(industry, 'industry'); run(balanced, 3); run(industry, 3);
  assert.equal(balanced.people[1].cargo, null); assert.ok(industry.people[1].cargo);
  assert.ok(industry.people[1].hunger < balanced.people[1].hunger); assert.ok(industry.people[1].rest < balanced.people[1].rest);
});

test('home assignment is bounded and Commons meals consume food to restore connection', () => {
  const s = newGame(); quiet(s); const home = s.buildings[0];
  for (const p of s.people) assert.ok(assignHome(s, p.id, home.id));
  assert.equal(assignHome(s, s.people[0].id, 99999), false);
  const commons = building(s, 'commons', 24, 20, true); s.buildings.push(commons); s.topology++; recompute(s);
  s.people[0].social = 20; const food = stocks(s).food; run(s, 30);
  assert.ok(s.people[0].social > 50); assert.equal(s.community.sharedMeals, 1); assert.equal(stocks(s).food, food - 1);
});

test('site commitment is disclosed, requires exploration and guards precede construction', () => {
  const s = newGame(), site = s.sites.find(t => t.kind === 'archive');
  assert.equal(activateSite(s, site.id), false); assert.equal(s.hostiles.length, 0);
  s.explored.fill(true); assert.equal(activateSite(s, site.id), true);
  assert.equal(s.hostiles.filter(h => h.site === site.id).length, 2);
  assert.equal(activateSite(s, site.id), false); assert.equal(site.building, null);
  const loaded = deserialize(serialize(s)); assert.equal(loaded.hostiles[0].site, site.id); assert.ok(loaded.sites[1].activated);
});

test('a nearby depot increases throughput with the same worker and resource patch', () => {
  const results = [];
  for (const nearby of [false, true]) {
    const s = newGame(); quiet(s); s.people[1].priorities.mine = 1;
    s.nodes = s.nodes.filter(n => n.x === 16.5 && n.kind === 'alloy'); s.buildings[0].inventory.biomass = 10000; s.buildings[0].inventory.alloy = 0;
    if (nearby) { s.buildings.push(building(s, 'depot', 14, 22, true)); s.topology++; }
    const initial = stocks(s).alloy; run(s, 30); results.push(stocks(s).alloy - initial);
  }
  assert.ok(results[1] >= results[0] * 1.2, `near ${results[1]} versus distant ${results[0]}`);
});

test('restoration benefits change crops, research and actionable warning time', () => {
  const results = [];
  for (const restored of [false, true]) {
    const s = newGame(); quiet(s);
    s.buildings.push(building(s, 'farm', 24, 27, true), building(s, 'generator', 28, 20, true), building(s, 'workshop', 28, 25, true));
    for (const site of s.sites) if (restored) { const b = building(s, 'relay', site.x, site.y, true); s.buildings.push(b); site.building = b.id; site.activated = true; site.restored = true; }
    s.buildings[0].inventory.alloy = 10000; s.time = 1200; s.research = { kind: 'tools', progress: 0 };
    const farm = s.buildings.find(b => b.kind === 'farm'); farm.tended = 40; recompute(s);
    run(s, 10); assert.ok(s.threat.warning);
    results.push({ growth: farm.growth, research: s.research.progress, arrival: s.threat.warning.arrival });
  }
  assert.equal(results[1].growth, results[0].growth * 1.25);
  assert.equal(results[1].research, results[0].research * 2);
  assert.equal(results[1].arrival - results[0].arrival, 60);
});

test('legacy saves migrate around occupied landmarks and corrupt suspended jobs fail safely', () => {
  const old = newGame(); const blocker = building(old, 'depot', 9, 12, true); old.buildings.push(blocker);
  delete old.community; delete old.sites; old.version = 1;
  const s = deserialize(JSON.stringify({ format: 'frontier-command', version: 1, state: old }));
  assert.equal(s.version, 2); assert.equal(s.buildings.find(b => b.id === blocker.id).x, 9);
  assert.ok(s.sites[0].x !== 9 || s.sites[0].y !== 12);
  s.people[0].suspended = { type: 'move', work: 0, point: { x: 'invalid', y: 5 } };
  assert.throws(() => deserialize(serialize(s)), /Invalid save: job/);
});

test('home location changes recovery travel and a wounded specialist works more slowly', () => {
  const times = [];
  for (const x of [24, 15]) {
    const s = newGame(); quiet(s); const home = building(s, 'habitat', x, 20, true); s.buildings.push(home); s.topology++; recompute(s);
    const p = s.people[0]; p.x = 30.5; p.y = 22.5; p.rest = 10; assignHome(s, p.id, home.id);
    while (p.rest < 95 && s.time < 100) tick(s, 0.25);
    times.push(s.time); assert.ok(p.rest >= 95);
  }
  assert.ok(times[1] > times[0] + 2, `near ${times[0]} versus distant ${times[1]}`);
  for (const wounded of [false, true]) {
    const s = newGame(); quiet(s); const p = s.people[1], n = s.nodes.find(n => n.x === 16.5 && n.kind === 'alloy');
    p.wounded = wounded; p.hp = wounded ? 75 : 100; p.x = n.x - 0.5; p.y = n.y; order(s, [p.id], 'work', n); run(s, 4);
    assert.equal(Boolean(p.cargo), !wounded);
  }
});
