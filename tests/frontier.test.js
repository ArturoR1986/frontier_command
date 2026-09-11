import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newWorld, command, step, stock, makeBuilding, makeMachine, journeyQuote, skillFactor, placement, locals } from '../src/frontier/engine.js';
import { STRUCTURES as B } from '../src/frontier/catalog.js';
import { generateTerrain, route } from '../src/frontier/terrain.js';
import { Authority } from '../src/frontier/authority.js';
import { createHash } from 'node:crypto';

function fixture(size = 128) { const w = newWorld(1986, size); for (const f of w.factions) f.ai = false; return w; }
function vacant(w, kind) { const r = w.regions[0]; for (let y = r.start.y - 10; y < r.start.y + 12; y++) for (let x = r.start.x - 10; x < r.start.x + 12; x++) if (!placement(w, r, 'f0', kind, x, y)) return { x, y }; throw new Error('No test placement'); }
function advance(w, seconds) { for (let i = 0; i < seconds; i++) step(w, 1); }

test('home terrain is deterministic, substantial and contains blocked and fertile ground', () => {
  const a = generateTerrain(41, 256), b = generateTerrain(41, 256);
  assert.deepEqual(a, b); assert.equal(a.terrain.length, 65536); assert.ok(a.terrain.includes(2)); assert.ok(a.terrain.includes(3)); assert.ok(Math.max(...a.fertility) > 85);
});
test('construction physically delivers costs and produces a working bed', () => {
  const w = fixture(), r = w.regions[0], p = vacant(w, 'bed');
  const result = command(w, 'f0', { type: 'build', region: r.id, kind: 'bed', ...p });
  const b = r.buildings.find(b => b.id === result.id); assert.equal(b.progress, 0); assert.equal(b.delivered.wood, 0);
  advance(w, 180); assert.equal(b.complete, true); assert.ok(w.entities.some(e => e.memories?.some(m => m.text.includes('Personal bed'))));
});
test('cancelled construction returns delivered goods without erasing carried goods', () => {
  const w = fixture(), r = w.regions[0], b = makeBuilding(w, r, 'f0', 'bed', ...Object.values(vacant(w, 'bed')));
  b.delivered.wood = 7; const e = w.entities[0]; e.cargo = { kind: 'wood', amount: 5, destination: b.id };
  command(w, 'f0', { type: 'cancel', region: r.id, id: b.id });
  assert.equal(r.drops.reduce((s, d) => s + (d.kind === 'wood' ? d.amount : 0), 0), 7); assert.equal(e.cargo.amount, 5); assert.equal(e.cargo.destination, undefined);
});
test('navigation respects region dimensions and does not cross a solid barrier', () => {
  const w = fixture(), r = w.regions[0]; r.terrain.fill(0); r.buildings = []; r.topology++;
  for (let y = 0; y < r.size; y++) r.terrain[y * r.size + 60] = 2; r.topology++;
  assert.equal(route(r, { x: 5, y: 5 }, { x: 100, y: 5 }, B, 'f0'), null);
  r.terrain[10 * r.size + 60] = 0; r.topology++;
  const p = route(r, { x: 5, y: 5 }, { x: 100, y: 5 }, B, 'f0'); assert.ok(p); assert.ok(p.some(p => p.x === 60.5 && p.y === 10.5));
});
test('boarding and travel preserve identity and skills; vehicle improves journey ETA', () => {
  const w = fixture(), r = w.regions[0], e = w.entities[0];
  const v = makeMachine(w, 'f0', r.id, 'hauler', e.x + 1, e.y); v.fuel = 100; r.buildings[0].inventory.food = 1000;
  const foot = journeyQuote(w, 'f0', r.id, 'r0-1', [e.id]); assert.ok(!foot.error);
  const skills = structuredClone(e.skills);
  command(w, 'f0', { type: 'board', region: r.id, ids: [e.id], vehicle: v.id }); assert.equal(locals(w, r).includes(e), false);
  const q = journeyQuote(w, 'f0', r.id, 'r0-1', [v.id], { wood: 20 }); assert.ok(!q.error, q.error); assert.ok(q.seconds < foot.seconds);
  command(w, 'f0', { type: 'travel', region: r.id, destination: 'r0-1', ids: [v.id], cargo: { wood: 20 } });
  assert.equal(e.region, null); assert.equal(v.region, null); assert.equal(e.journey, v.journey);
  const restored = JSON.parse(JSON.stringify(w)); advance(restored, q.seconds + 1);
  const ee = restored.entities.find(p => p.id === e.id), vv = restored.entities.find(p => p.id === v.id);
  assert.equal(ee.region, 'r0-1'); assert.equal(vv.region, 'r0-1'); assert.deepEqual(ee.skills, skills); assert.equal(restored.entities.filter(p => p.id === e.id).length, 1);
  assert.equal(restored.regions[1].drops.filter(d => d.kind === 'wood').reduce((s, d) => s + d.amount, 0), 20);
  command(restored, 'f0', { type: 'disembark', id: v.id }); assert.equal(ee.vehicle, null); assert.ok(skillFactor(ee, 'pilot') > 1);
});
test('unowned commands and malformed quantities are rejected', () => {
  const w = fixture(), enemy = w.entities.find(e => e.faction === 'f1');
  assert.throws(() => command(w, 'f0', { type: 'draft', ids: [enemy.id], value: true }), /only your/);
  assert.equal(journeyQuote(w, 'f0', 'r0-0', 'r0-1', [w.entities[0].id], { food: -1 }).error, 'Cargo must contain nonnegative whole resource amounts.');
});
test('durable command receipts survive checkpoint, journal replay and duplicate retry', () => {
  const folder = mkdtempSync(join(tmpdir(), 'frontier-authority-')), file = join(folder, 'world.sqlite'); let a;
  try {
    a = new Authority(file, { size: 128 }); const account = a.join('f0', 'Test Union'), r = a.world.regions[0], p = vacant(a.world, 'bed');
    const payload = { type: 'build', region: r.id, kind: 'bed', ...p }, result = a.execute(account.token, 'command_0001', payload);
    assert.equal(result.ok, true); assert.equal(a.execute(account.token, 'command_0001', payload).replayed, true);
    a.tick(1, 5); const expected = JSON.stringify(a.world);
    // Simulate process loss without a closing checkpoint; SQLite committed journal is the recovery source.
    a.db.close(); a.closed = true; a = new Authority(file);
    assert.equal(createHash('sha256').update(JSON.stringify(a.world)).digest('hex'), createHash('sha256').update(expected).digest('hex')); assert.equal(a.execute(account.token, 'command_0001', payload).replayed, true);
    assert.equal(a.world.regions[0].buildings.filter(b => b.kind === 'bed').length, 1);
    const enemy = a.world.entities.find(e => e.faction === 'f1'); const before = JSON.stringify(a.world);
    assert.equal(a.execute(account.token, 'command_0002', { type: 'draft', ids: [enemy.id], value: true }).ok, false); assert.equal(JSON.stringify(a.world), before);
  } finally { a?.close(); assert.ok(folder.startsWith(join(tmpdir(), 'frontier-authority-'))); rmSync(folder, { recursive: true, force: true }); }
});

test('four simultaneous builders consume exactly one construction bill', () => {
  const w = fixture(), r = w.regions[0]; for (const n of r.nodes) n.marked = null;
  const people = w.entities.filter(e => e.faction === 'f0'); for (const e of people) { e.priorities.build = 1; e.priorities.gather = 0; }
  const before = stock(r, 'f0').wood, p = vacant(w, 'bed');
  command(w, 'f0', { type: 'build', region: r.id, kind: 'bed', ...p }); advance(w, 200);
  const after = stock(r, 'f0').wood + people.reduce((s, e) => s + (e.cargo?.kind === 'wood' ? e.cargo.amount : 0), 0) + r.drops.filter(d => d.kind === 'wood').reduce((s, d) => s + d.amount, 0);
  assert.equal(before - after, 12);
});
test('fabrication consumes real inputs and produces differentiated robots', () => {
  const w = fixture(), r = w.regions[0], f = w.factions[0]; f.tech = ['tools', 'engineering', 'robotics', 'advanced'];
  for (const n of r.nodes) n.marked = null; const core = r.buildings[0]; Object.assign(core.inventory, { ore: 300, parts: 200, crystal: 40, fuel: 100 });
  const x = r.start.x - 10, y = r.start.y - 10; for (let yy = y - 2; yy < y + 13; yy++) for (let xx = x - 2; xx < x + 14; xx++) r.terrain[yy * r.size + xx] = 0;
  makeBuilding(w, r, 'f0', 'generator', x, y, true); const fab = makeBuilding(w, r, 'f0', 'fabricator', x + 5, y, true);
  for (const e of w.entities.filter(e => e.faction === 'f0')) { for (const k in e.priorities) e.priorities[k] = k === 'craft' ? 1 : 0; }
  command(w, 'f0', { type: 'queue', region: r.id, id: fab.id, kind: 'scout' }); command(w, 'f0', { type: 'queue', region: r.id, id: fab.id, kind: 'artillery' });
  advance(w, 1000);
  const robots = w.entities.filter(e => e.faction === 'f0' && e.type === 'robot'); assert.equal(robots.length, 2); assert.ok(robots.some(e => e.kind === 'scout')); assert.ok(robots.some(e => e.kind === 'artillery'));
  assert.equal(stock(r, 'f0').ore, 300 - 16 - 55); assert.equal(stock(r, 'f0').parts, 200 - 6 - 28);
});
test('a disabled valuable hull ejects the same injured crew for treatment', () => {
  const w = fixture(), r = w.regions[0], e = w.entities[0]; r.terrain.fill(0); r.buildings = []; r.topology++;
  Object.assign(e, { x: 30, y: 30 }); const v = makeMachine(w, 'f0', r.id, 'tank', 31, 30); v.fuel = 100;
  command(w, 'f0', { type: 'board', region: r.id, ids: [e.id], vehicle: v.id });
  v.hp = 170; const enemy = makeMachine(w, 'f1', r.id, 'artillery', 43, 30); w.treaties.push({ kind: 'war', parties: ['f0', 'f1'], effective: 0 });
  advance(w, 1); assert.equal(v.disabled, true); assert.equal(e.vehicle, null); assert.equal(e.wounded, true); assert.ok(e.hp > 0); assert.equal(w.entities.filter(p => p.id === e.id).length, 1); assert.ok(enemy.hp > 0);
});
test('cross-realm travel survives a serialized restart and arrives only once', () => {
  const w = fixture(), r = w.regions[0], p = w.entities[0], v = makeMachine(w, 'f0', r.id, 'hauler', p.x + 1, p.y); v.fuel = 100;
  r.buildings[0].inventory.food = 1000; command(w, 'f0', { type: 'board', region: r.id, ids: [p.id], vehicle: v.id });
  const q = journeyQuote(w, 'f0', r.id, 'r1-4', [v.id], { wood: 30 }); assert.ok(!q.error, q.error); assert.equal(q.crossRealm, true);
  command(w, 'f0', { type: 'travel', region: r.id, destination: 'r1-4', ids: [v.id], cargo: { wood: 30 } });
  const restored = JSON.parse(JSON.stringify(w)); restored.time = restored.journeys[0].arrival - 1; step(restored, 1); step(restored, 1);
  assert.equal(restored.entities.find(e => e.id === p.id).region, 'r1-4'); assert.equal(restored.entities.find(e => e.id === v.id).region, 'r1-4');
  const target = restored.regions.find(r => r.id === 'r1-4'); assert.equal(target.drops.filter(d => d.kind === 'wood').reduce((s, d) => s + d.amount, 0), 30);
});
test('occupation needs provisions and changes ownership without replacing surviving people', () => {
  const w = fixture(), r = w.regions[1], p = w.entities[0]; p.region = r.id; Object.assign(p, { x: r.start.x - 2, y: r.start.y }); p.drafted = true;
  command(w, 'f0', { type: 'claim', region: r.id }); const relay = makeBuilding(w, r, 'f0', 'relay', r.start.x, r.start.y, true);
  w.time = r.occupation.begins; step(w, 1); assert.equal(r.occupation.progress, 0); assert.match(r.occupation.status, /deliver food/);
  relay.inventory.food = 20; advance(w, w.policy.occupationTime + 5); assert.equal(r.owner, 'f0'); assert.equal(r.occupation, null); assert.equal(p.faction, 'f0'); assert.ok(relay.inventory.food < 20);
});
test('trade escrows goods, requires both storages and exchanges exactly once', () => {
  const w = fixture(), r = w.regions[0], other = makeBuilding(w, r, 'f1', 'stockpile', r.start.x + 8, r.start.y + 8, true); other.inventory.ore = 40;
  const before = stock(r, 'f0'); command(w, 'f0', { type: 'diplomacy', region: r.id, other: 'f1', action: 'trade', give: { wood: 10 }, want: { ore: 8 } });
  assert.equal(stock(r, 'f0').wood, before.wood - 10); const offer = w.offers[0];
  command(w, 'f1', { type: 'diplomacy', other: 'f0', action: 'accept', offer: offer.id });
  assert.equal(stock(r, 'f0').ore, before.ore + 8); assert.equal(other.inventory.wood, 10); assert.equal(other.inventory.ore, 32);
  assert.throws(() => command(w, 'f1', { type: 'diplomacy', other: 'f0', action: 'accept', offer: offer.id }), /no longer available/);
});
