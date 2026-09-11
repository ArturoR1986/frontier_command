import { VERSION, WIDTH, HEIGHT, BUILDINGS } from './catalog.js';
import { recompute } from './simulation.js';

export function serialize(state) {
  return JSON.stringify({ format: 'frontier-command', version: VERSION, state });
}
export function deserialize(text) {
  if (typeof text !== 'string' || text.length > 8_000_000) throw new Error('Save is too large or unreadable.');
  let envelope;
  try { envelope = JSON.parse(text); } catch { throw new Error('Save is not valid JSON. Your current colony is unchanged.'); }
  if (envelope?.format !== 'frontier-command' || envelope.version !== VERSION) throw new Error('Unsupported save version. Your current colony is unchanged.');
  const s = envelope.state;
  const number = v => typeof v === 'number' && Number.isFinite(v);
  const point = p => number(p.x) && number(p.y) && p.x >= 0 && p.y >= 0 && p.x < WIDTH && p.y < HEIGHT;
  const assert = (condition, message) => { if (!condition) throw new Error(`Invalid save: ${message}. Your current colony is unchanged.`); };
  assert(s && s.version === VERSION && number(s.time) && s.time >= 0 && Number.isInteger(s.nextId) && Number.isInteger(s.rng), 'header');
  assert(Array.isArray(s.terrain) && s.terrain.length === WIDTH * HEIGHT && s.terrain.every(t => [0, 1, 2, 3].includes(t)), 'terrain');
  assert(Array.isArray(s.trails) && s.trails.length === WIDTH * HEIGHT && s.trails.every(number), 'trails');
  assert(Array.isArray(s.explored) && s.explored.length === WIDTH * HEIGHT && s.explored.every(v => typeof v === 'boolean'), 'exploration');
  for (const list of ['people', 'buildings', 'nodes', 'hostiles', 'drops', 'events', 'effects', 'upgrades']) assert(Array.isArray(s[list]) && s[list].length <= 10000, list);
  const ids = new Set();
  for (const o of [...s.people, ...s.buildings, ...s.nodes, ...s.hostiles, ...s.drops]) {
    assert(Number.isInteger(o.id) && o.id > 0 && o.id < s.nextId && !ids.has(o.id) && point(o), 'entity identity/position'); ids.add(o.id);
  }
  for (const b of s.buildings) {
    assert(BUILDINGS[b.kind] && number(b.hp) && number(b.progress) && typeof b.complete === 'boolean', 'building');
    assert(b.x + BUILDINGS[b.kind].w <= WIDTH && b.y + BUILDINGS[b.kind].h <= HEIGHT, 'footprint');
    for (const k of ['alloy', 'biomass', 'food']) assert(number(b.inventory?.[k]) && b.inventory[k] >= 0 && number(b.delivered?.[k]) && b.delivered[k] >= 0, 'inventory');
  }
  for (const p of s.people) {
    assert(typeof p.name === 'string' && p.name.length < 100 && typeof p.activity === 'string', 'person');
    for (const k of ['hp', 'hunger', 'rest', 'morale', 'cooldown', 'wait']) assert(number(p[k]), 'needs');
    assert(p.priorities && ['build', 'haul', 'mine', 'grow'].every(k => Number.isInteger(p.priorities[k]) && p.priorities[k] >= 0 && p.priorities[k] <= 4), 'priorities');
    if (p.cargo) assert(['alloy', 'biomass', 'food'].includes(p.cargo.kind) && number(p.cargo.amount) && p.cargo.amount > 0 && p.cargo.amount <= 16, 'cargo');
    if (p.job) assert(['move', 'attack', 'assist', 'gather', 'fetch', 'deliver', 'deposit', 'build', 'grow', 'eat', 'sleep', 'pickup', 'repair'].includes(p.job.type) && number(p.job.work) && (p.job.type !== 'move' || point(p.job.point)), 'job');
    p.route = []; p.routeVersion = -1;
  }
  for (const n of [...s.nodes, ...s.drops]) assert(['alloy', 'biomass', 'food'].includes(n.kind) && number(n.amount) && n.amount >= 0, 'resource');
  for (const h of s.hostiles) { assert(number(h.hp) && number(h.age) && number(h.cooldown), 'hostile'); h.route = []; h.routeVersion = -1; }
  assert(s.threat && number(s.threat.exposure) && number(s.threat.encounters) && number(s.threat.nextContact), 'threat');
  if (s.threat.warning) assert(number(s.threat.warning.arrival) && ['east', 'west'].includes(s.threat.warning.direction) && Number.isInteger(s.threat.warning.count), 'warning');
  assert(s.stats && ['gathered', 'delivered', 'built', 'defeated', 'arrivals'].every(k => number(s.stats[k])), 'statistics');
  assert(s.settings && number(s.settings.volume) && s.settings.volume >= 0 && s.settings.volume <= 1, 'settings');
  assert(s.upgrades.every(k => ['tools', 'armor', 'medicine'].includes(k)), 'upgrades');
  if (s.research) assert(['tools', 'armor', 'medicine'].includes(s.research.kind) && number(s.research.progress), 'research');
  s.effects = []; s.topology = (s.topology || 0) + 1;
  recompute(s);
  return s;
}
