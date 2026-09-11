import { VERSION, BUILDINGS, PEOPLE, UPGRADES, WIDTH, HEIGHT } from './catalog.js';
import { generate, random, cell, inside, walkable, occupied, path, adjacent, distance, center, lineOfSight } from './world.js';

const empty = () => ({ alloy: 0, biomass: 0, food: 0 });
export function event(s, text, tone = 'info') {
  s.events.push({ time: s.time, text, tone });
  if (s.events.length > 60) s.events.shift();
}
export function building(s, kind, x, y, complete = false) {
  const d = BUILDINGS[kind];
  return { id: s.nextId++, kind, x, y, hp: d.hp, complete, progress: complete ? 100 : 0, delivered: empty(), inventory: empty(), powered: false, growth: 0, tended: 0, cooldown: 0 };
}
export function person(s, index, x, y) {
  const [name, role, trait, color, priorities] = PEOPLE[index % PEOPLE.length];
  return { id: s.nextId++, name: index < 4 ? name : ['Nico', 'Sora', 'Ivo', 'Ada', 'Remy', 'Jules', 'Sol', 'Ash'][index - 4] || `Settler ${index + 1}`, role, trait, color, priorities: { ...priorities }, x, y, hp: 100, hunger: 95, rest: 95, morale: 80, ranger: role === 'Security', cargo: null, job: null, route: [], routeVersion: -1, direct: false, activity: 'Taking in the basin', cooldown: 0, wait: 0 };
}
export function newGame(seed = 1986) {
  const s = { version: VERSION, seed, rng: seed >>> 0, nextId: 1, time: 0, buildings: [], people: [], nodes: [], hostiles: [], drops: [], events: [], effects: [], upgrades: [], research: null, topology: 0, stats: { gathered: 0, delivered: 0, built: 0, defeated: 0, arrivals: 0 }, threat: { exposure: 0, phase: 'Landing', warning: null, nextContact: 0, encounters: 0, lastContact: 0 }, settings: { volume: 0.25, guide: true, speed: 1 }, ended: false };
  const hub = building(s, 'hub', 21, 22, true);
  hub.inventory = { alloy: 100, biomass: 70, food: 80 };
  s.buildings.push(hub);
  generate(s);
  for (let i = 0; i < 4; i++) s.people.push(person(s, i, 20.5, 22.5 + i));
  event(s, 'Ashwater Basin. Four people, one landing hub. Make this place your own.');
  recompute(s);
  reveal(s);
  return s;
}
export function stocks(s) {
  const result = empty();
  for (const b of s.buildings) if (b.complete && b.hp > 0) for (const k in result) result[k] += b.inventory[k];
  return result;
}
export function capacity(s) { return s.buildings.filter(b => b.complete).reduce((n, b) => n + (b.kind === 'hub' || b.kind === 'habitat' ? 4 : 0), 0); }
export function depots(s) { return s.buildings.filter(b => b.hp > 0 && b.complete && ['hub', 'depot'].includes(b.kind)); }
function nearest(list, p) { return [...list].sort((a, b) => distance(p, a.kind in BUILDINGS ? center(a) : a) - distance(p, b.kind in BUILDINGS ? center(b) : b)); }
function find(s, id) { return [...s.buildings, ...s.nodes, ...s.drops, ...s.hostiles].find(o => o.id === id); }
function drop(s, p) {
  if (!p.cargo) return;
  s.drops.push({ id: s.nextId++, x: p.x, y: p.y, kind: p.cargo.kind, amount: p.cargo.amount });
  p.cargo = null;
}
function clear(p) { p.job = null; p.route = []; p.direct = false; p.activity = 'Available'; }
function job(p, type, target, extra = {}) { p.job = { type, target: target.id, work: 0, ...extra }; p.route = []; p.routeVersion = -1; }
export function order(s, ids, type, target) {
  let accepted = 0;
  for (const p of s.people.filter(p => ids.includes(p.id))) {
    clear(p);
    if (type === 'stop') { p.wait = 3; accepted++; continue; }
    if (type === 'move') {
      const offsets = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2], [2, 1], [-2, 1], [1, 2]];
      const offset = offsets[accepted % offsets.length];
      const point = { x: Math.floor(target.x) + 0.5 + offset[0], y: Math.floor(target.y) + 0.5 + offset[1] };
      if (!inside(point.x, point.y) || !walkable(s, point.x, point.y) || path(s, p, point) === null) continue;
      job(p, 'move', { id: 0 }, { point });
    } else {
      const t = find(s, target.id);
      if (!t || path(s, p, t, true) === null) continue;
      if (type === 'attack') job(p, 'attack', t);
      else if (s.nodes.includes(t)) job(p, 'gather', t);
      else if (s.buildings.includes(t) && !t.complete) job(p, 'assist', t);
      else if (s.buildings.includes(t) && t.hp < BUILDINGS[t.kind].hp) job(p, 'repair', t);
      else continue;
    }
    p.direct = true;
    accepted++;
  }
  if (!accepted) event(s, 'Order unavailable: select settlers and choose an accessible target.', 'warning');
  return accepted;
}
export function placement(s, kind, x, y) {
  const d = BUILDINGS[kind];
  if (!d || kind === 'hub' && s.buildings.some(b => b.kind === 'hub')) return 'Choose a buildable structure. Only one Command Hub can operate.';
  for (let yy = y; yy < y + d.h; yy++) for (let xx = x; xx < x + d.w; xx++) {
    if (!inside(xx, yy)) return 'Outside the basin.';
    if (!s.explored[cell(xx, yy)]) return 'Scout this ground first.';
    if (!walkable(s, xx, yy)) return 'Blocked by terrain or another structure.';
    if (s.people.some(p => cell(p.x, p.y) === cell(xx, yy)) || s.hostiles.some(p => cell(p.x, p.y) === cell(xx, yy))) return 'Someone is standing here.';
    if (s.nodes.some(n => n.amount > 0 && cell(n.x, n.y) === cell(xx, yy))) return 'A resource deposit occupies this ground.';
  }
  const candidate = { id: -1, kind, x, y, hp: d.hp };
  s.buildings.push(candidate);
  const reachable = s.people.some(p => path(s, p, candidate, true) !== null);
  const escape = !depots(s).length || s.people.every(p => depots(s).some(b => path(s, p, b, true) !== null));
  s.buildings.pop();
  if (!reachable || !escape) return 'Would seal access. Leave a walkable approach.';
  return '';
}
export function place(s, kind, x, y) {
  x = Math.floor(x); y = Math.floor(y);
  const error = placement(s, kind, x, y);
  if (error) { event(s, error, 'warning'); return null; }
  const b = building(s, kind, x, y);
  s.buildings.push(b); s.topology++;
  event(s, `${BUILDINGS[kind].name} blueprint placed. Workers will haul materials to its edge.`);
  return b;
}
export function remove(s, id) {
  const b = s.buildings.find(b => b.id === id);
  if (!b || b.kind === 'hub') return false;
  const resources = b.complete ? { alloy: Math.floor(BUILDINGS[b.kind].alloy / 2), biomass: Math.floor(BUILDINGS[b.kind].biomass / 2) } : b.delivered;
  const spot = { x: b.x + 0.5, y: b.y + 0.5 };
  for (const [kind, amount] of Object.entries(resources)) if (amount) s.drops.push({ id: s.nextId++, ...spot, kind, amount });
  b.hp = 0;
  cleanup(s);
  event(s, 'Site removed. Recoverable materials are on the ground.');
  return true;
}
function pay(s, kind, amount) {
  if (stocks(s)[kind] < amount) return false;
  for (const b of depots(s)) { const n = Math.min(b.inventory[kind], amount); b.inventory[kind] -= n; amount -= n; }
  return true;
}
export function research(s, kind) {
  if (!UPGRADES[kind] || s.upgrades.includes(kind) || s.research || !s.buildings.some(b => b.kind === 'workshop' && b.complete && b.powered)) return false;
  if (!pay(s, 'alloy', UPGRADES[kind].cost)) return false;
  s.research = { kind, progress: 0 };
  event(s, `${UPGRADES[kind].name} research started. Powered workshop required.`);
  return true;
}
export function train(s, ids) {
  if (!s.buildings.some(b => b.kind === 'barracks' && b.complete && b.powered)) return false;
  let trained = false;
  for (const p of s.people.filter(p => ids.includes(p.id) && !p.ranger)) if (pay(s, 'alloy', 12)) { p.ranger = true; trained = true; }
  return trained;
}
export function invite(s) {
  if (s.people.length >= Math.min(16, capacity(s)) || stocks(s).food < 20 || s.time < 120) return false;
  const hub = s.buildings.find(b => b.kind === 'hub');
  if (!hub || !pay(s, 'food', 20)) return false;
  const spots = [];
  for (let y = hub.y - 2; y < hub.y + 5; y++) for (let x = hub.x - 2; x < hub.x + 5; x++) if (walkable(s, x, y)) spots.push({ x: x + 0.5, y: y + 0.5 });
  if (!spots.length) return false;
  const p = person(s, 4 + s.stats.arrivals++, spots[0].x, spots[0].y);
  s.people.push(p); event(s, `${p.name} answered your beacon. A new life in the basin.`);
  return true;
}
export function recompute(s) {
  const complete = s.buildings.filter(b => b.complete && b.hp > 0);
  const sources = complete.filter(b => BUILDINGS[b.kind].power);
  let supply = sources.reduce((n, b) => n + BUILDINGS[b.kind].power, 0), used = 0;
  const priorities = ['hub', 'generator', 'habitat', 'farm', 'turret', 'sensor', 'barracks', 'workshop', 'depot', 'wall'];
  for (const b of s.buildings) b.powered = false;
  for (const b of [...complete].sort((a, b) => priorities.indexOf(a.kind) - priorities.indexOf(b.kind))) {
    const demand = BUILDINGS[b.kind].demand;
    const connected = !demand || sources.some(g => distance(center(g), center(b)) <= 11);
    b.powered = connected && used + demand <= supply;
    if (b.powered) used += demand;
  }
  s.power = { supply, used, demand: complete.reduce((n, b) => n + BUILDINGS[b.kind].demand, 0) };
  const wealth = stocks(s);
  s.threat.contributors = { people: s.people.length * 2, wealth: Math.min(20, Math.floor((wealth.alloy + wealth.biomass) / 35)), power: Math.floor(supply / 3), territory: complete.length * 2, industry: complete.filter(b => b.kind === 'workshop').length * 8, military: complete.filter(b => b.kind === 'turret').length * 3 };
  s.threat.exposure = Object.values(s.threat.contributors).reduce((a, b) => a + b, 0);
}
function reveal(s) {
  for (const p of [...s.people, ...s.buildings.filter(b => b.complete && b.kind === 'sensor' && b.powered).map(center)]) {
    const radius = 'name' in p ? 10 : 19;
    for (let y = Math.max(0, Math.floor(p.y - radius)); y < Math.min(HEIGHT, p.y + radius); y++) for (let x = Math.max(0, Math.floor(p.x - radius)); x < Math.min(WIDTH, p.x + radius); x++) if (distance(p, { x, y }) < radius) s.explored[cell(x, y)] = true;
  }
}
function routeTo(s, p, target, dt, edge = true) {
  if (edge ? adjacent(p, target) : distance(p, target) < 0.12) return 1;
  if (!p.route.length || p.routeVersion !== s.topology) {
    p.route = path(s, p, target, edge);
    p.routeVersion = s.topology;
    if (p.route === null) { p.route = []; return -1; }
  }
  let budget = dt * (p.hunger < 15 || p.rest < 15 ? 1.05 : 2.2);
  while (budget > 0 && p.route.length) {
    const next = p.route[0], d = distance(p, next);
    const terrain = s.terrain[cell(p.x, p.y)];
    const speed = terrain === 3 ? 0.65 : 1 + Math.min(0.15, s.trails[cell(p.x, p.y)] / 1000);
    const step = Math.min(d, budget * speed);
    if (d > 0) { p.x += (next.x - p.x) / d * step; p.y += (next.y - p.y) / d * step; }
    budget -= step / speed;
    if (d <= step + 0.001) { p.route.shift(); s.trails[cell(p.x, p.y)] = Math.min(200, s.trails[cell(p.x, p.y)] + 1); }
    if (d === 0) p.route.shift();
  }
  return 0;
}
function accessible(s, p, list) { return nearest(list, p).find(t => path(s, p, t, true) !== null); }
function deliveryNeed(s, b, kind) {
  const inbound = s.people.reduce((sum, p) => sum + (p.cargo?.destination === b.id && p.cargo.kind === kind ? p.cargo.amount : 0), 0);
  return Math.max(0, (BUILDINGS[b.kind][kind] || 0) - b.delivered[kind] - inbound);
}
function chooseConstruction(s, p, only = null) {
  for (const b of nearest(s.buildings.filter(b => !b.complete && (!only || b.id === only)), p)) {
    if (path(s, p, b, true) === null) continue;
    for (const kind of ['alloy', 'biomass']) {
      const need = deliveryNeed(s, b, kind);
      const sources = [...depots(s).filter(d => d.inventory[kind] > 0), ...s.drops.filter(d => d.kind === kind && d.amount > 0)];
      const depot = need > 0 && accessible(s, p, sources);
      // Both targets are reachable from the worker's connected walkable region.
      // A depot center is inside its blocked footprint and is not a route origin.
      if (depot) { job(p, 'fetch', depot, { destination: b.id, kind }); return true; }
    }
    if (['alloy', 'biomass'].every(k => b.delivered[k] >= BUILDINGS[b.kind][k])) { job(p, 'build', b); return true; }
  }
  return false;
}
function choose(s, p) {
  if (p.cargo) {
    const destination = s.buildings.find(b => b.id === p.cargo.destination && !b.complete && path(s, p, b, true) !== null);
    if (!destination) delete p.cargo.destination;
    const depot = destination || accessible(s, p, depots(s));
    if (depot) job(p, destination ? 'deliver' : 'deposit', depot);
    else { drop(s, p); p.wait = 4; }
    return;
  }
  const enemy = nearest(s.hostiles.filter(h => !h.retreat && distance(h, p) < (p.ranger ? 8 : 3)), p)[0];
  if (enemy) { job(p, 'attack', enemy); return; }
  if (p.hunger < 55) {
    const depot = accessible(s, p, depots(s).filter(b => b.inventory.food > 0));
    if (depot) { job(p, 'eat', depot); return; }
  }
  if (p.rest < 25 || (s.time % 600 > 420 && p.rest < 65) || p.hp < 65) {
    const home = accessible(s, p, s.buildings.filter(b => b.complete && ['habitat', 'hub'].includes(b.kind)));
    if (home) { job(p, 'sleep', home); return; }
  }
  const tasks = Object.entries(p.priorities).sort((a, b) => a[1] - b[1]);
  for (const [type, priority] of tasks) {
    if (priority === 0) continue;
    if (type === 'build') {
      if (chooseConstruction(s, p)) return;
      const damaged = accessible(s, p, s.buildings.filter(b => b.complete && b.hp < BUILDINGS[b.kind].hp));
      if (damaged && stocks(s).alloy > 0) { job(p, 'repair', damaged); return; }
    }
    if (type === 'haul') {
      const cargo = accessible(s, p, s.drops.filter(d => d.amount > 0));
      if (cargo) { job(p, 'pickup', cargo); return; }
    }
    if (type === 'grow') {
      const farm = stocks(s).food < 120 + s.people.length * 10 && accessible(s, p, s.buildings.filter(b => b.kind === 'farm' && b.complete && b.powered && (b.growth >= 100 || b.tended < 15) && !s.people.some(q => q.id !== p.id && q.job?.target === b.id && q.job?.type === 'grow')));
      if (farm) { job(p, 'grow', farm); return; }
    }
    if (type === 'mine') {
      const stock = stocks(s);
      const pending = s.buildings.filter(b => !b.complete);
      const alloyTarget = 120 + pending.reduce((n, b) => n + deliveryNeed(s, b, 'alloy'), 0);
      const biomassTarget = 80 + pending.reduce((n, b) => n + deliveryNeed(s, b, 'biomass'), 0);
      const wanted = stock.food < 25 ? 'food' : stock.alloy < alloyTarget && (stock.alloy < stock.biomass * 1.8 || stock.biomass >= biomassTarget) ? 'alloy' : stock.biomass < biomassTarget ? 'biomass' : stock.alloy < alloyTarget ? 'alloy' : null;
      if (!wanted) continue;
      const node = accessible(s, p, s.nodes.filter(n => n.amount > 0 && n.kind === wanted));
      if (node && depots(s).some(b => path(s, node, b, true) !== null)) { job(p, 'gather', node); return; }
    }
  }
  p.activity = 'Quiet moment'; p.wait = 2;
}
function work(s, p, dt) {
  if (!p.job) return;
  const j = p.job, target = j.type === 'move' ? j.point : find(s, j.target);
  if (!target || target.hp <= 0) { clear(p); return; }
  if (j.type === 'assist') { const id = target.id; clear(p); if (chooseConstruction(s, p, id)) p.direct = true; return; }
  if (j.type === 'attack') {
    p.activity = `Engaging ${target.name || 'contact'}`;
    const range = p.ranger ? 6 : 1.6;
    if (distance(p, target) <= range && lineOfSight(s, p, target)) {
      p.route = [];
      if (p.cooldown <= 0) { target.hp -= (p.ranger ? 15 : 5) * (s.upgrades.includes('armor') ? 1.4 : 1); p.cooldown = 1.2; s.effects.push({ x: p.x, y: p.y, tx: target.x, ty: target.y, life: 0.2, type: 'shot' }); }
      return;
    }
    if (routeTo(s, p, target, dt) < 0) clear(p);
    return;
  }
  const descriptions = { move: 'Moving', gather: `Collecting ${target.kind}`, fetch: `Fetching ${j.kind}`, deliver: `Delivering ${p.cargo?.kind}`, deposit: `Hauling ${p.cargo?.kind} to storage`, build: 'Constructing', grow: target.growth >= 100 ? 'Harvesting' : 'Tending crops', eat: 'Going to eat', sleep: 'Returning to rest', pickup: 'Recovering cargo', repair: 'Repairing' };
  p.activity = descriptions[j.type] || j.type;
  const reached = routeTo(s, p, target, dt, j.type !== 'move');
  if (reached < 0) { if (p.direct) event(s, `${p.name}: route is blocked; order cancelled.`, 'warning'); clear(p); p.wait = 3; return; }
  if (!reached) return;
  const efficiency = (s.upgrades.includes('tools') ? 1.4 : 1) * (j.type === 'build' && p.role === 'Engineer' || j.type === 'gather' && p.role === 'Prospector' ? 1.25 : 1);
  j.work += dt * efficiency;
  switch (j.type) {
    case 'move': clear(p); p.wait = 1; break;
    case 'gather':
      if (p.cargo) { clear(p); break; }
      if (j.work >= 4) {
        const amount = Math.min(8, target.amount);
        target.amount -= amount;
        if (amount) { p.cargo = { kind: target.kind, amount }; s.stats.gathered += amount; }
        clear(p);
      }
      break;
    case 'fetch': {
      const dest = s.buildings.find(b => b.id === j.destination && !b.complete);
      if (dest && !p.cargo) {
        const amount = Math.min(8, target.inventory ? target.inventory[j.kind] : target.amount, deliveryNeed(s, dest, j.kind));
        if (amount > 0) {
          if (target.inventory) target.inventory[j.kind] -= amount; else target.amount -= amount;
          p.cargo = { kind: j.kind, amount, destination: dest.id };
        }
      }
      clear(p); break;
    }
    case 'deliver':
      if (p.cargo && !target.complete) {
        const n = Math.min(p.cargo.amount, BUILDINGS[target.kind][p.cargo.kind] - target.delivered[p.cargo.kind]);
        target.delivered[p.cargo.kind] += n; p.cargo.amount -= n;
        if (p.cargo.amount <= 0) p.cargo = null;
        else delete p.cargo.destination;
      } else if (p.cargo) delete p.cargo.destination;
      clear(p); break;
    case 'deposit':
      if (p.cargo) { target.inventory[p.cargo.kind] += p.cargo.amount; s.stats.delivered += p.cargo.amount; p.cargo = null; }
      clear(p); break;
    case 'pickup': {
      if (!p.cargo) { const n = Math.min(8, target.amount); if (n) p.cargo = { kind: target.kind, amount: n }; target.amount -= n; }
      clear(p); break;
    }
    case 'build':
      if (target.complete) { clear(p); break; }
      if (['alloy', 'biomass'].every(k => target.delivered[k] >= BUILDINGS[target.kind][k])) target.progress += dt * efficiency * 3;
      if (target.progress >= 100) { target.progress = 100; target.complete = true; s.stats.built++; event(s, `${BUILDINGS[target.kind].name} operational.`, 'success'); clear(p); recompute(s); }
      break;
    case 'grow':
      if (!target.powered) { clear(p); break; }
      if (j.work >= 5) {
        if (target.growth >= 100 && !p.cargo) { p.cargo = { kind: 'food', amount: 16 }; target.growth = 0; }
        target.tended = 65; clear(p);
      }
      break;
    case 'eat':
      p.activity = 'Eating together';
      if (j.work >= 3) { if (target.inventory.food >= 1) { target.inventory.food--; p.hunger = Math.min(100, p.hunger + 45); } clear(p); }
      break;
    case 'sleep':
      p.activity = 'Sleeping';
      p.rest = Math.min(100, p.rest + dt * (target.kind === 'habitat' && target.powered ? 3 : 1.5));
      p.hp = Math.min(100, p.hp + dt * (s.upgrades.includes('medicine') ? 0.8 : 0.4));
      if (p.rest >= 95 && p.hp >= 95 || p.hunger < 20) clear(p);
      break;
    case 'repair':
      if (j.work >= 2) { if (target.hp < BUILDINGS[target.kind].hp && pay(s, 'alloy', 1)) target.hp = Math.min(BUILDINGS[target.kind].hp, target.hp + 25); else clear(p); j.work = 0; }
      break;
  }
}
export function spawnContact(s, count = 2, direction = 'east') {
  const spots = [];
  for (let y = 1; y < HEIGHT - 1; y++) { const x = direction === 'east' ? WIDTH - 2 : 1; if (walkable(s, x, y)) spots.push({ x: x + 0.5, y: y + 0.5 }); }
  for (let i = 0; i < count && spots.length; i++) {
    const spot = spots[Math.floor(random(s) * spots.length)];
    s.hostiles.push({ id: s.nextId++, ...spot, name: 'Basin scavenger', hp: 55 + Math.min(25, s.threat.encounters * 4), maxHp: 55 + Math.min(25, s.threat.encounters * 4), route: [], routeVersion: -1, cooldown: 0, hunger: 100, rest: 100, retreat: false, age: 0 });
  }
  event(s, `Contact from the ${direction}. Protect the colony; wounded scavengers may retreat.`, 'danger');
}
function threats(s, dt) {
  const t = s.threat;
  t.phase = s.time < 300 ? 'Landing' : t.encounters ? 'Adaptation' : 'Settlement';
  // A safe learning floor is only a guard; colony exposure is the trigger.
  if (!t.warning && !s.hostiles.length && s.time >= 1200 && t.exposure >= 35 && s.time >= t.nextContact) {
    const sensor = s.buildings.some(b => b.kind === 'sensor' && b.powered);
    t.warning = { direction: random(s) > 0.5 ? 'east' : 'west', arrival: s.time + (sensor ? 150 : 90), count: t.encounters === 0 ? 2 : Math.min(6, Math.max(2, Math.ceil(s.people.length / 2)), 2 + Math.floor(Math.max(0, t.exposure - 65) / 25)) };
    event(s, `Tracks detected ${t.warning.direction}. ${t.warning.count} contacts, ${sensor ? 150 : 90}s to arrival. Rally Kei and check defenses.`, 'warning');
  }
  if (t.warning) {
    t.phase = 'Warning';
    if (s.time >= t.warning.arrival) { spawnContact(s, t.warning.count, t.warning.direction); t.warning = null; t.encounters++; t.lastContact = s.time; t.nextContact = s.time + 480; }
  }
  if (s.hostiles.length) t.phase = 'Contact';
  for (const h of s.hostiles) {
    h.age += dt; h.cooldown -= dt;
    if (h.hp < h.maxHp * 0.3 || h.age > 150) h.retreat = true;
    if (h.retreat) {
      const exit = { x: h.x < WIDTH / 2 ? 1.5 : WIDTH - 1.5, y: h.y };
      if (routeTo(s, h, exit, dt, false) < 0) { h.age += 10; }
      if (distance(h, exit) < 1 || h.age > 190) h.escaped = true;
      continue;
    }
    const target = nearest(s.people, h).find(p => distance(p, h) < 8) || s.buildings.find(b => b.kind === 'hub') || s.people[0];
    if (!target) { h.retreat = true; continue; }
    if (target.kind ? adjacent(h, target) : distance(h, target) < 1.7) {
      if (h.cooldown <= 0) { target.hp -= s.upgrades.includes('armor') ? 3 : 5; h.cooldown = 1.7; s.effects.push({ x: h.x, y: h.y, tx: target.x, ty: target.y, life: 0.25, type: 'hit' }); }
    } else if (routeTo(s, h, target, dt) < 0) {
      const obstacle = nearest(s.buildings.filter(b => b.kind === 'wall'), h).find(b => adjacent(h, b));
      if (obstacle) obstacle.hp -= dt * 5;
      else h.retreat = true;
    }
  }
}
export function cleanup(s) {
  for (const p of s.people.filter(p => p.hp <= 0)) { drop(s, p); event(s, `${p.name} was lost. The colony will remember.`, 'danger'); }
  s.people = s.people.filter(p => p.hp > 0);
  for (const b of s.buildings.filter(b => b.hp <= 0)) {
    for (const [kind, amount] of Object.entries(b.inventory)) if (amount) s.drops.push({ id: s.nextId++, x: b.x + 0.5, y: b.y + 0.5, kind, amount });
    s.topology++; event(s, `${BUILDINGS[b.kind].name} removed from the grid.`, 'warning');
  }
  s.buildings = s.buildings.filter(b => b.hp > 0);
  for (const h of s.hostiles.filter(h => h.hp <= 0)) { s.drops.push({ id: s.nextId++, x: h.x, y: h.y, kind: 'alloy', amount: 10 }); s.stats.defeated++; }
  s.hostiles = s.hostiles.filter(h => h.hp > 0 && !h.escaped);
  s.drops = s.drops.filter(d => d.amount > 0);
  s.ended = s.people.length === 0;
}
export function tick(s, dt = 0.1) {
  if (s.ended) return;
  dt = Math.min(0.25, Math.max(0, dt));
  const before = Math.floor(s.time);
  s.time += dt;
  if (Math.floor(s.time) !== before) { recompute(s); reveal(s); }
  for (const b of s.buildings) {
    b.cooldown -= dt;
    if (b.kind === 'farm' && b.complete && b.powered) { b.tended = Math.max(0, b.tended - dt); if (b.tended > 0) b.growth = Math.min(100, b.growth + dt * (s.terrain[cell(b.x, b.y)] === 1 ? 1.5 : 1)); }
    if (b.kind === 'turret' && b.complete && b.powered && b.cooldown <= 0) {
      const c = center(b), h = nearest(s.hostiles, c).find(h => distance(c, h) < 8 && lineOfSight(s, c, h));
      if (h) { h.hp -= s.upgrades.includes('armor') ? 24 : 18; b.cooldown = 1.2; s.effects.push({ ...c, tx: h.x, ty: h.y, life: 0.2, type: 'shot' }); }
    }
  }
  for (const p of s.people) {
    p.cooldown -= dt; p.wait -= dt;
    p.hunger = Math.max(0, p.hunger - dt * 0.045); p.rest = Math.max(0, p.rest - dt * 0.025);
    if (p.hunger <= 0) p.hp -= dt * 0.15;
    p.morale = Math.max(0, Math.min(100, (p.hunger + p.rest) / 2 + (capacity(s) > s.people.length ? 8 : 0) + (s.upgrades.includes('medicine') ? 8 : 0)));
    if (!p.direct && p.job && !['eat', 'sleep', 'deposit', 'deliver'].includes(p.job.type) && (p.hunger < 15 || p.rest < 8 || s.hostiles.some(h => distance(h, p) < 3))) clear(p);
    if (!p.job && p.wait <= 0) choose(s, p);
    work(s, p, dt);
  }
  if (s.research && s.buildings.some(b => b.kind === 'workshop' && b.powered)) {
    s.research.progress += dt;
    if (s.research.progress >= 90) { s.upgrades.push(s.research.kind); event(s, `${UPGRADES[s.research.kind].name} ready.`, 'success'); s.research = null; }
  }
  // Idle settlers make room for each other without becoming navigation blockers.
  for (let i = 0; i < s.people.length; i++) for (let j = i + 1; j < s.people.length; j++) {
    const p = s.people[i], q = s.people[j];
    if (p.job || q.job || distance(p, q) >= 0.45) continue;
    const length = distance(p, q), dx = length > 0.01 ? (p.x - q.x) / length : 1, dy = length > 0.01 ? (p.y - q.y) / length : 0;
    const x = p.x + dx * dt, y = p.y + dy * dt;
    if (walkable(s, x, y)) { p.x = x; p.y = y; }
  }
  threats(s, dt);
  for (const e of s.effects) e.life -= dt;
  s.effects = s.effects.filter(e => e.life > 0);
  cleanup(s);
}
export function objective(s) {
  if (s.ended) return 'The settlement fell silent. Load a save or begin a new landing.';
  if (s.stats.delivered < 8) return '1 / SETTLE IN — Select Tomas, then right-click a mineral cluster. Watch him gather, carry and deposit.';
  if (!s.buildings.some(b => b.kind === 'habitat' && b.complete)) return '2 / A PLACE TO STAY — Place a Habitat near the hub. Mara will deliver materials and build it.';
  if (!s.buildings.some(b => b.kind === 'farm' && b.complete)) return '3 / ROOTS — Build a Hydro Farm. Lena tends, harvests and hauls food. Rich green ground grows faster.';
  if (!s.buildings.some(b => b.kind === 'generator' && b.complete)) return '4 / POWER — Add a Generator within 11 tiles of your buildings. Homes and food get power first.';
  if (!s.upgrades.length) return '5 / CAPABILITY — Build a Workshop and choose an improvement. Invite settlers when you have beds and food.';
  if (!s.threat.encounters) return '6 / HORIZON — Establish a sensor and defenses. Growth raises Exposure; the first 20 minutes remain peaceful.';
  return 'FRONTIER ESTABLISHED — Recover, improve hauling routes and expand. The basin is yours to shape.';
}
