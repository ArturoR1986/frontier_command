import { VERSION, WIDTH, HEIGHT, BUILDINGS } from './catalog.js';
import { recompute } from './simulation.js';
import { initializeCommunity, CHARTERS } from './community.js';
import { occupied, cell } from './world.js';

export function serialize(state) {
  return JSON.stringify({ format: 'frontier-command', version: VERSION, state });
}
export function deserialize(text) {
  if (typeof text !== 'string' || text.length > 8_000_000) throw new Error('Save is too large or unreadable.');
  let envelope;
  try { envelope = JSON.parse(text); } catch { throw new Error('Save is not valid JSON. Your current colony is unchanged.'); }
  if (envelope?.format !== 'frontier-command' || ![1, VERSION].includes(envelope.version)) throw new Error('Unsupported save version. Your current colony is unchanged.');
  const s = envelope.state;
  if (envelope.version === 1 && s) { s.version = VERSION; initializeCommunity(s); }
  const number = v => typeof v === 'number' && Number.isFinite(v);
  const point = p => number(p.x) && number(p.y) && p.x >= 0 && p.y >= 0 && p.x < WIDTH && p.y < HEIGHT;
  const assert = (condition, message) => { if (!condition) throw new Error(`Invalid save: ${message}. Your current colony is unchanged.`); };
  assert(s && s.version === VERSION && number(s.time) && s.time >= 0 && Number.isInteger(s.nextId) && Number.isInteger(s.rng) && Number.isInteger(s.seed) && typeof s.ended === 'boolean', 'header');
  assert(Array.isArray(s.terrain) && s.terrain.length === WIDTH * HEIGHT && s.terrain.every(t => [0, 1, 2, 3].includes(t)), 'terrain');
  assert(Array.isArray(s.trails) && s.trails.length === WIDTH * HEIGHT && s.trails.every(number), 'trails');
  assert(Array.isArray(s.explored) && s.explored.length === WIDTH * HEIGHT && s.explored.every(v => typeof v === 'boolean'), 'exploration');
  for (const list of ['people', 'buildings', 'nodes', 'hostiles', 'drops', 'events', 'effects', 'upgrades']) assert(Array.isArray(s[list]) && s[list].length <= 10000, list);
  const ids = new Set();
  assert(Array.isArray(s.sites) && s.sites.length === 3 && s.community && Object.hasOwn(CHARTERS, s.community.charter), 'community');
  for (const o of [...s.people, ...s.buildings, ...s.nodes, ...s.hostiles, ...s.drops, ...s.sites]) {
    assert(Number.isInteger(o.id) && o.id > 0 && o.id < s.nextId && !ids.has(o.id) && point(o), 'entity identity/position'); ids.add(o.id);
  }
  for (const b of s.buildings) {
    assert(Object.hasOwn(BUILDINGS, b.kind) && number(b.hp) && b.hp >= 0 && number(b.progress) && b.progress >= 0 && b.progress <= 100 && typeof b.complete === 'boolean' && Number.isInteger(b.x) && Number.isInteger(b.y), 'building');
    for (const k of ['growth', 'tended', 'cooldown']) assert(number(b[k]), 'building work state');
    assert(b.growth >= 0 && b.growth <= 100 && b.tended >= 0, 'crop state');
    assert(b.x + BUILDINGS[b.kind].w <= WIDTH && b.y + BUILDINGS[b.kind].h <= HEIGHT, 'footprint');
    for (const k of ['alloy', 'biomass', 'food']) assert(Number.isInteger(b.inventory?.[k]) && b.inventory[k] >= 0 && Number.isInteger(b.delivered?.[k]) && b.delivered[k] >= 0 && b.delivered[k] <= (BUILDINGS[b.kind][k] || 0), 'inventory');
  }
  for (const p of s.people) {
    assert(['name', 'role', 'trait', 'color', 'activity'].every(k => typeof p[k] === 'string' && p[k].length < 200) && typeof p.direct === 'boolean' && typeof p.ranger === 'boolean', 'person');
    for (const k of ['hp', 'hunger', 'rest', 'morale', 'cooldown', 'wait']) assert(number(p[k]), 'needs');
    assert(p.priorities && ['build', 'haul', 'mine', 'grow'].every(k => Number.isInteger(p.priorities[k]) && p.priorities[k] >= 0 && p.priorities[k] <= 4), 'priorities');
    if (p.cargo) assert(['alloy', 'biomass', 'food'].includes(p.cargo.kind) && number(p.cargo.amount) && p.cargo.amount > 0 && p.cargo.amount <= 16, 'cargo');
    for (const j of [p.job, p.suspended]) if (j) assert(['move', 'attack', 'assist', 'gather', 'fetch', 'deliver', 'deposit', 'build', 'grow', 'eat', 'sleep', 'pickup', 'repair', 'fetchCare', 'care', 'socialize'].includes(j.type) && number(j.work) && (j.type !== 'move' || j.point && point(j.point)), 'job');
    assert(['drafted', 'caregiver', 'wounded'].every(k => typeof p[k] === 'boolean') && number(p.social) && p.social >= 0 && p.social <= 100 && Array.isArray(p.memories) && p.memories.length <= 4 && p.memories.every(m => number(m.time) && typeof m.text === 'string' && m.text.length < 200), 'civil duty and memory');
    assert(p.home === null || Number.isInteger(p.home), 'home assignment');
    p.route = []; p.routeVersion = -1;
  }
  for (const n of [...s.nodes, ...s.drops]) assert(['alloy', 'biomass', 'food'].includes(n.kind) && number(n.amount) && n.amount >= 0, 'resource');
  for (const h of s.hostiles) { assert(['hp', 'maxHp', 'age', 'cooldown', 'hunger', 'rest'].every(k => number(h[k])) && h.maxHp > 0 && typeof h.retreat === 'boolean', 'hostile'); h.route = []; h.routeVersion = -1; }
  assert(s.threat && number(s.threat.exposure) && number(s.threat.encounters) && number(s.threat.nextContact), 'threat');
  if (s.threat.warning) assert(number(s.threat.warning.arrival) && ['east', 'west'].includes(s.threat.warning.direction) && Number.isInteger(s.threat.warning.count) && s.threat.warning.count >= 1 && s.threat.warning.count <= 6, 'warning');
  assert(s.stats && ['gathered', 'delivered', 'built', 'defeated', 'arrivals'].every(k => number(s.stats[k])), 'statistics');
  assert(s.settings && number(s.settings.volume) && s.settings.volume >= 0 && s.settings.volume <= 1 && [1, 2, 4].includes(s.settings.speed) && typeof s.settings.guide === 'boolean', 'settings');
  if (s.settings.camera) { const c = s.settings.camera; assert(number(c.x) && number(c.y) && c.x >= 0 && c.x <= WIDTH && c.y >= 0 && c.y <= HEIGHT && number(c.scale) && c.scale >= 12 && c.scale <= 70, 'camera'); }
  assert(s.events.length <= 60 && s.events.every(e => number(e.time) && typeof e.text === 'string' && e.text.length < 1000 && ['info', 'warning', 'danger', 'success'].includes(e.tone)), 'journal');
  assert(s.upgrades.every(k => ['tools', 'armor', 'medicine'].includes(k)), 'upgrades');
  assert(number(s.community.treated) && number(s.community.sharedMeals) && typeof s.community.achievement === 'boolean', 'community history');
  for (const site of s.sites) assert(['water', 'archive', 'signal'].includes(site.kind) && typeof site.name === 'string' && site.name.length < 100 && typeof site.description === 'string' && site.description.length < 300 && typeof site.restored === 'boolean' && typeof site.activated === 'boolean' && Number.isInteger(site.guards) && site.guards >= 0 && site.guards <= 3, 'restoration site');
  if (s.research) assert(['tools', 'armor', 'medicine'].includes(s.research.kind) && number(s.research.progress), 'research');
  if (envelope.version === 1) {
    // Add playable landmark footprints without deleting legacy structures or goods.
    for (const site of s.sites) {
      const spots = [];
      for (let y = 2; y < HEIGHT - 3; y++) for (let x = 2; x < WIDTH - 3; x++) spots.push({ x, y });
      spots.sort((a, b) => Math.hypot(a.x - site.x, a.y - site.y) - Math.hypot(b.x - site.x, b.y - site.y));
      const spot = spots.find(p => !s.sites.some(t => t.id !== site.id && Math.abs(t.x - p.x) < 3 && Math.abs(t.y - p.y) < 3) && [0, 1].every(dx => [0, 1].every(dy => !occupied(s, p.x + dx, p.y + dy) && !s.nodes.some(n => cell(n.x, n.y) === cell(p.x + dx, p.y + dy)))));
      assert(spot, 'no room for restoration sites'); Object.assign(site, spot);
      for (let y = site.y - 1; y <= site.y + 2; y++) for (let x = site.x - 1; x <= site.x + 2; x++) s.terrain[cell(x, y)] = 0;
    }
  }
  s.effects = []; s.topology = (s.topology || 0) + 1;
  recompute(s);
  return s;
}
