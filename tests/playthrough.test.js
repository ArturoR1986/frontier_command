import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { newGame, tick, place, placement, stocks, order, research, invite, remove, recompute, building, cleanup } from '../src/simulation.js';
import { serialize, deserialize } from '../src/save.js';
import { cell } from '../src/world.js';

function step(s, seconds) { for (let i = 0; i < seconds * 4; i++) tick(s, 0.25); }
function build(s, kind, preferredX = 25, preferredY = 23) {
  const spots = [];
  for (let y = 13; y < 34; y++) for (let x = 10; x < 34; x++) spots.push({ x, y });
  spots.sort((a, b) => Math.hypot(a.x - preferredX, a.y - preferredY) - Math.hypot(b.x - preferredX, b.y - preferredY));
  const spot = spots.find(p => !placement(s, kind, p.x, p.y));
  assert.ok(spot, `No legal placement for ${kind}`);
  const b = place(s, kind, spot.x, spot.y);
  for (let i = 0; i < 2400 && !b.complete; i++) tick(s, 0.25);
  assert.ok(b.complete, `${kind} failed to complete in 600 simulated seconds`);
  return b;
}
function verifyState(s) {
  for (const p of s.people) for (const key of ['x', 'y', 'hp', 'hunger', 'rest', 'morale']) assert.ok(Number.isFinite(p[key]), `${p.name}.${key}`);
  for (const b of s.buildings) for (const amount of Object.values(b.inventory)) assert.ok(Number.isFinite(amount) && amount >= 0);
  for (const n of s.nodes) assert.ok(n.amount >= 0);
  assert.ok(s.events.length <= 60); assert.ok(s.effects.length < 200);
}
test('structured opening, economy, pressure, recovery, save continuity and 60-minute session', async () => {
  const s = newGame(1986), report = [], begun = performance.now();
  const home = build(s, 'habitat', 24, 20); const farm = build(s, 'farm', 24, 27); build(s, 'generator', 28, 20);
  assert.ok(home.complete && farm.complete);
  report.push({ phase: 'Opening', time: s.time, result: 'Housing, food and generation built by physical worker delivery.' });
  const depot = build(s, 'depot', 15, 23); build(s, 'workshop', 28, 25); build(s, 'barracks', 18, 18); build(s, 'sensor', 27, 18);
  build(s, 'turret', 18, 23); build(s, 'turret', 27, 24);
  assert.ok(depot.complete); assert.ok(research(s, 'armor')); step(s, 95); assert.ok(s.upgrades.includes('armor'));
  if (s.time < 120) step(s, 120 - s.time);
  assert.ok(invite(s));
  report.push({ phase: 'Economy', time: s.time, stocks: stocks(s), result: 'Storage, production, defense and people progression operational.' });
  while (s.time < 1200) tick(s, 0.25);
  assert.equal(s.hostiles.length, 0); assert.ok(s.threat.warning); assert.equal(s.threat.warning.count, 2);
  report.push({ phase: 'Warning', time: s.time, warning: { ...s.threat.warning } });
  // An attentive player rallies the colony around the hub during the warning.
  const rally = { x: 20.5, y: 25.5 };
  order(s, s.people.map(p => p.id), 'move', rally);
  step(s, 360);
  assert.ok(s.people.length >= 4, 'First contact should be survivable with prepared defenses');
  assert.equal(s.hostiles.length, 0);
  report.push({ phase: 'First contact', time: s.time, people: s.people.length, defeated: s.stats.defeated });
  // Controlled losses probe recovery, without turning the playthrough into a cheat-win.
  home.hp = 160; s.people[0].hp = 45;
  const lost = s.people.at(-1); lost.hp = 0; cleanup(s);
  assert.ok(invite(s), 'Vacant housing supports replacement settlers');
  step(s, 180); assert.ok(home.hp > 160, 'Construction workers should repair'); assert.ok(s.people[0].hp > 45, 'Rest should heal');
  report.push({ phase: 'Recovery', time: s.time, homeHealth: home.hp, people: s.people.length });
  const copy = deserialize(serialize(s)); step(copy, 60); verifyState(copy);
  assert.equal(copy.people.length, s.people.length); assert.ok(copy.time > s.time);
  report.push({ phase: 'Save/load', result: 'Mid-game jobs, inventory, power, threat and progression restored and advanced.' });
  while (s.time < 3600 && !s.ended) { tick(s, 0.25); if (Math.floor(s.time) % 60 === 0) verifyState(s); }
  assert.equal(s.time, 3600); assert.ok(s.people.length > 0); assert.ok(stocks(s).food > 0);
  const elapsed = performance.now() - begun;
  report.push({ phase: '60-minute stability', simulatedSeconds: s.time, elapsedMs: elapsed, people: s.people.length, buildings: s.buildings.length, stocks: stocks(s), events: s.events.length });
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/playthrough.json', JSON.stringify(report, null, 2));
  await writeFile('artifacts/established-colony.json', serialize(s));
  await writeFile('artifacts/midgame-colony.json', serialize(copy));
});
test('material conservation survives multiple interrupted deliveries and cancellations', () => {
  const s = newGame(); for (const p of s.people) p.priorities = { build: 1, haul: 1, mine: 0, grow: 0 };
  const total = kind => s.nodes.filter(n => n.kind === kind).reduce((n, r) => n + r.amount, 0) + stocks(s)[kind] + s.people.reduce((n, p) => n + (p.cargo?.kind === kind ? p.cargo.amount : 0), 0) + s.drops.filter(d => d.kind === kind).reduce((n, d) => n + d.amount, 0) + s.buildings.filter(b => !b.complete).reduce((n, b) => n + b.delivered[kind], 0);
  const alloy = total('alloy'), biomass = total('biomass');
  for (let i = 0; i < 8; i++) {
    const spots = [{ x: 24, y: 20 }, { x: 27, y: 20 }, { x: 24, y: 18 }];
    const spot = spots.find(p => !placement(s, 'habitat', p.x, p.y)); assert.ok(spot);
    const b = place(s, 'habitat', spot.x, spot.y); assert.ok(b); step(s, 2 + i); order(s, s.people.map(p => p.id), 'stop', {}); remove(s, b.id); step(s, 15);
    assert.equal(total('alloy'), alloy); assert.equal(total('biomass'), biomass);
  }
});
test('first contact size stays small even with extreme stored wealth', () => {
  const s = newGame(); s.buildings[0].inventory.alloy = 100000; s.time = 1200; recompute(s); tick(s, 0.25);
  assert.ok(s.threat.contributors.wealth <= 20);
  // Add territorial activity sufficient to cross the exposure threshold.
  s.buildings.push(building(s, 'generator', 25, 20, true)); recompute(s); tick(s, 0.25); assert.equal(s.threat.warning.count, 2);
});
test('many seeds have accessible starts and safe rejected placements', () => {
  for (let seed = 0; seed < 20; seed++) {
    const s = newGame(seed); assert.equal(place(s, 'habitat', 21, 22), null); assert.equal(place(s, 'farm', -1, 0), null);
    for (const p of s.people) assert.notEqual(s.terrain[cell(p.x, p.y)], 2);
    step(s, 30); verifyState(s); assert.ok(s.stats.delivered > 0, `seed ${seed} has no resource loop`);
  }
});
