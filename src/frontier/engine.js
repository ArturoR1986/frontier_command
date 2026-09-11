import { SCHEMA, RESOURCES, ROLES, STRUCTURES as B, TECH, MACHINES as M, RECIPES, COLORS, emptyStock } from './catalog.js';
import { generateTerrain, hash, tile, inside, distance, footprint, walkable, route, sight } from './terrain.js';

export const id = w => `e${w.nextId++}`;
export const factionOf = (w, id) => w.factions.find(f => f.id === id);
export const regionOf = (w, id) => w.regions.find(r => r.id === id);
export const entityOf = (w, id) => w.entities.find(e => e.id === id);
export const locals = (w, r) => w.entities.filter(e => e.region === r.id && e.hp > 0 && !e.vehicle && !e.journey);
export const skillLevel = (e, key) => Math.min(20, Math.sqrt((e.skills?.[key] || 0) / 300));
export const skillFactor = (e, key) => 1 + skillLevel(e, key) * 0.055;
export function note(w, faction, text, tone = 'info') { w.events.push({ id: id(w), at: w.time, faction, text, tone }); if (w.events.length > 300) w.events.shift(); }
export function makeBuilding(w, r, faction, kind, x, y, complete = false) {
  const d = B[kind], b = { id: id(w), faction, kind, x, y, hp: d.hp, complete, progress: complete ? d.work : 0, delivered: emptyStock(), inventory: emptyStock(), queue: [], growth: 0, tending: 0, powered: !d.demand, active: 'Waiting for work', bill: 24, cooldown: 0 };
  r.buildings.push(b); r.topology++; return b;
}
export function makePerson(w, faction, region, x, y, index = 0) {
  const names = ['Mara', 'Tomas', 'Lena', 'Kei', 'Ada', 'Ivo', 'Nico', 'Sora', 'Jules', 'Remy', 'Sol', 'Ash'];
  const specialty = ROLES[index % ROLES.length];
  const e = { id: id(w), type: 'person', faction, region, x, y, hp: 100, maxHp: 100, name: `${names[index % names.length]}${index >= names.length ? ` ${Math.floor(index / names.length) + 1}` : ''}`, trait: ['Patient', 'Industrious', 'Sociable', 'Steady'][index % 4], specialty, skills: Object.fromEntries(ROLES.map(k => [k, k === specialty ? 4800 : 300])), priorities: Object.fromEntries(ROLES.map(k => [k, k === specialty ? 1 : 3])), hunger: 90, rest: 90, morale: 80, belonging: 75, wounded: false, drafted: false, cargo: null, job: null, route: [], cooldown: 0, activity: 'Ready for work', memories: [], friends: {}, home: null };
  w.entities.push(e); return e;
}
export function makeMachine(w, faction, region, kind, x, y) {
  const d = M[kind], e = { id: id(w), type: d.type, kind, name: d.name, faction, region, x, y, hp: d.hp, maxHp: d.hp, crew: [], fuel: 0, cargo: null, inventory: emptyStock(), job: null, route: [], cooldown: 0, drafted: true, activity: d.type === 'vehicle' ? 'Awaiting operator' : 'Standing guard', disabled: false };
  w.entities.push(e); return e;
}
export function newWorld(seed = 1986, size = 256) {
  const w = { schema: SCHEMA, seed, nextId: 1, time: 0, revision: 0, factions: [], regions: [], entities: [], journeys: [], offers: [], treaties: [], events: [], victories: [], policy: { coreNotice: 3600, occupationTime: 600, frontierNotice: 120, label: 'Experimental: core assaults require one hour notice; frontier claims two minutes. Offline defense remains active.' } };
  const names = ['Ashwater', 'Copper Reach', 'Highgarden', 'Stonewake', 'Cinder Pass', 'Mossbank', 'Glass Coast', 'Northwatch', 'Farwater'];
  for (let realm = 0; realm < 2; realm++) for (let i = 0; i < 9; i++) {
    const rid = `r${realm}-${i}`, data = generateTerrain(seed + realm * 71 + i * 13, size);
    const r = { id: rid, realm, name: `${names[i]}${realm ? ' Beyond' : ''}`, gx: i % 3, gy: Math.floor(i / 3), size, seed: seed + realm * 71 + i * 13, ...data, buildings: [], nodes: [], drops: [], explored: {}, topology: 0, owner: null, occupation: null, distanceKm: 12 + i * 3, resource: i === 4 || i === 8 ? 'crystal' : i % 2 ? 'ore' : 'wood', supplies: 0 };
    for (let y = 5; y < size - 5; y += 3) for (let x = 5; x < size - 5; x += 3) {
      const h = hash(x, y, r.seed + 42); if (h > 0.15 || distance({ x, y }, r.start) < 8) continue;
      const t = r.terrain[tile(r, x, y)]; if (t === 3) continue;
      r.nodes.push({ id: id(w), x, y, kind: t === 2 ? (h < 0.035 && r.resource === 'crystal' ? 'crystal' : h < 0.075 ? 'ore' : 'stone') : h < 0.06 ? 'food' : 'wood', amount: t === 2 ? 160 : 50, marked: null });
    }
    // Guaranteed accessible starter resources; surrounding geography remains procedural.
    for (const [dx, dy, kind] of [[-9, 0, 'wood'], [-8, -4, 'wood'], [8, -7, 'stone'], [10, 4, 'ore'], [-7, 8, 'food'], [6, 10, 'food']]) {
      r.nodes.push({ id: id(w), x: r.start.x + dx, y: r.start.y + dy, kind, amount: 180, marked: null });
    }
    w.regions.push(r);
  }
  for (let i = 0; i < 4; i++) {
    const r = w.regions[(i > 1 ? 9 : 0) + (i % 2 ? 8 : 0)], fid = `f${i}`, f = { id: fid, name: ['Ashwater Union', 'Stonewake Compact', 'Dawn Assembly', 'Farwater League'][i], color: COLORS[i], home: r.id, tech: [], research: null, ai: i % 2 === 1, claimed: false, population: 4, recruiting: null, stance: 'peace', lastSeen: 0, subjectOf: null };
    w.factions.push(f); r.owner = fid;
    const core = makeBuilding(w, r, fid, 'core', r.start.x, r.start.y, true);
    Object.assign(core.inventory, { wood: 100, stone: 65, ore: 35, food: 65, meals: 25, medicine: 6 });
    for (let n = 0; n < 4; n++) makePerson(w, fid, r.id, r.start.x - 2, r.start.y + n + 0.5, n);
    for (const node of r.nodes) if (distance(node, r.start) < 15) node.marked = fid;
    r.explored[fid] = [];
    note(w, fid, 'A home before an empire. Plan beds, food and storage; choose how your people develop.');
  }
  reveal(w); return w;
}
export function stores(r, faction) { return r.buildings.filter(b => b.faction === faction && b.complete && b.hp > 0 && B[b.kind].storage); }
export function stock(r, faction) { const out = emptyStock(); for (const b of stores(r, faction)) for (const k of RESOURCES) out[k] += b.inventory[k] || 0; return out; }
export function canPay(r, faction, cost) { const s = stock(r, faction); return Object.entries(cost).every(([k, v]) => s[k] >= v); }
export function pay(r, faction, cost) { if (!canPay(r, faction, cost)) return false; for (const [k, amount] of Object.entries(cost)) { let left = amount; for (const b of stores(r, faction)) { const n = Math.min(b.inventory[k], left); b.inventory[k] -= n; left -= n; } } return true; }
function nearest(list, e, score = o => distance(e, o.kind && B[o.kind] ? footprint(o, B) : o)) { return [...list].sort((a, b) => score(a) - score(b))[0]; }
function remember(w, e, text, value = 0) { e.memories.push({ at: w.time, text }); if (e.memories.length > 8) e.memories.shift(); e.morale = Math.max(0, Math.min(100, e.morale + value)); }
function clear(e) { e.job = null; e.route = []; e.routeVersion = -1; }
function job(e, type, target, extra = {}) { e.job = { type, target: target.id, work: 0, ...extra }; e.route = []; e.routeVersion = -1; }
function object(w, r, oid) { return r.buildings.find(b => b.id === oid) || r.nodes.find(n => n.id === oid) || r.drops.find(n => n.id === oid) || entityOf(w, oid); }
function practice(e, skill, dt) { if (e.skills) e.skills[skill] += dt * (e.specialty === skill ? 1.4 : 1); }
function usable(e) { return e.hp > 20 && !e.wounded; }
function operator(w, e) { return e.type === 'vehicle' ? e.crew.map(i => entityOf(w, i)).find(p => p && usable(p)) : null; }
export function machineSpeed(w, e) { if (e.type === 'person') return 1.7 * (e.wounded ? 0.45 : 1); const d = M[e.kind]; return d.speed * (e.type === 'vehicle' ? operator(w, e) && e.fuel > 0 && !e.disabled ? skillFactor(operator(w, e), 'pilot') : 0 : 1); }
function at(r, e, target, adjacent = true) {
  const d = target.kind && B[target.kind], w = d?.w || 1, h = d?.h || 1;
  const dx = Math.max(0, target.x - e.x, e.x - (target.x + w)), dy = Math.max(0, target.y - e.y, e.y - (target.y + h));
  return Math.hypot(dx, dy) <= (adjacent ? 1.2 : 0.7);
}
function approach(w, r, e, target, dt, adjacent = true) {
  if (at(r, e, target, adjacent)) { e.route = []; return true; }
  if (e.retry > w.time) return false;
  if (!e.route?.length || e.routeVersion !== r.topology || e.routeTarget !== `${Math.floor(target.x)},${Math.floor(target.y)}`) {
    e.route = route(r, e, target, B, e.faction, adjacent); e.routeVersion = r.topology; e.routeTarget = `${Math.floor(target.x)},${Math.floor(target.y)}`;
    if (!e.route) { e.route = []; e.retry = w.time + 5; e.activity = 'Blocked route — clear an approach'; return false; }
  }
  let budget = machineSpeed(w, e) * dt;
  while (budget > 0 && e.route.length) {
    const p = e.route[0], d = distance(e, p), step = Math.min(d, budget / (r.terrain[tile(r, e.x, e.y)] === 1 ? 1.6 : 1));
    if (d <= 0.01) { e.route.shift(); continue; }
    e.x += (p.x - e.x) / d * step; e.y += (p.y - e.y) / d * step; budget -= step;
    if (step === d) e.route.shift();
    if (e.type === 'vehicle' && step > 0) { e.fuel = Math.max(0, e.fuel - step * 0.003); practice(operator(w, e), 'pilot', dt); }
  }
  return at(r, e, target, adjacent);
}
export function reveal(w) {
  for (const r of w.regions) for (const e of locals(w, r)) {
    const arr = r.explored[e.faction] ||= [], known = new Set(arr), radius = e.kind === 'scout' ? 4 : 2;
    const cx = Math.floor(e.x / 8), cy = Math.floor(e.y / 8), width = Math.ceil(r.size / 8);
    for (let y = Math.max(0, cy - radius); y <= Math.min(width - 1, cy + radius); y++) for (let x = Math.max(0, cx - radius); x <= Math.min(width - 1, cx + radius); x++) known.add(y * width + x);
    r.explored[e.faction] = [...known];
  }
}
export function explored(r, faction, x, y) { return (r.explored[faction] || []).includes(Math.floor(y / 8) * Math.ceil(r.size / 8) + Math.floor(x / 8)); }
export function placement(w, r, faction, kind, x, y) {
  const d = B[kind], f = factionOf(w, faction);
  if (!d || !Number.isInteger(x) || !Number.isInteger(y)) return 'Choose a valid structure and tile.';
  if (d.tech && !f.tech.includes(d.tech)) return `Research ${TECH[d.tech].name} first.`;
  if (r.owner && r.owner !== faction) return 'This land belongs to another colony.';
  if (kind === 'core' && r.buildings.some(b => b.faction === faction && b.kind === 'core' && b.hp > 0)) return 'This region already has a colony hearth.';
  for (let yy = y; yy < y + d.h; yy++) for (let xx = x; xx < x + d.w; xx++) {
    if (!inside(r, xx, yy)) return 'Outside the map.';
    if (!explored(r, faction, xx, yy)) return 'Explore this ground first.';
    if (!walkable(r, xx, yy, B, faction)) return 'Rock, water or a structure blocks this ground.';
    if (r.buildings.some(b => b.hp > 0 && xx >= b.x && yy >= b.y && xx < b.x + B[b.kind].w && yy < b.y + B[b.kind].h)) return 'Another plan occupies this ground.';
    if (r.nodes.some(n => n.amount > 0 && n.x === xx && n.y === yy)) return 'Gather the resource on this tile first.';
  }
  const fake = { id: 'preview', kind, x, y, hp: d.hp, faction };
  const topology = r.topology;
  r.buildings.push(fake); r.topology++;
  const people = locals(w, r).filter(e => e.faction === faction && e.type === 'person');
  const reachable = people.some(e => route(r, e, fake, B, faction, true) !== null);
  const trapped = !d.pass && people.some(e => stores(r, faction).length && !stores(r, faction).some(s => route(r, e, s, B, faction, true) !== null));
  r.buildings.pop(); r.topology = topology;
  return !reachable ? 'No worker can reach the construction edge.' : trapped ? 'This would seal a worker away from supplies. Leave a door.' : '';
}
function inTransit(w, target, kind) { return w.entities.reduce((s, e) => s + (e.cargo?.destination === target && e.cargo.kind === kind ? e.cargo.amount : e.job?.type === 'fetch' && e.job.destination === target && e.job.kind === kind ? e.job.amount : 0), 0); }
function needsInputs(w, b, cost) { return Object.entries(cost).find(([k, n]) => n > (b.delivered[k] || 0) + inTransit(w, b.id, k)); }
function supplyJob(w, r, e, b, cost) {
  const missing = needsInputs(w, b, cost); if (!missing) return false;
  const [kind, total] = missing, source = nearest(stores(r, e.faction).filter(s => s.inventory[kind] > 0), e);
  if (!source) { b.active = `Needs ${kind}`; return false; }
  job(e, 'fetch', source, { destination: b.id, kind, amount: Math.min(12, total - b.delivered[kind] - inTransit(w, b.id, kind)) }); return true;
}
function chooseJob(w, r, e) {
  const bs = r.buildings.filter(b => b.hp > 0 && b.faction === e.faction), f = factionOf(w, e.faction);
  if (e.cargo) { const destination = object(w, r, e.cargo.destination); const b = destination && destination.hp > 0 && destination.faction === e.faction ? destination : nearest(stores(r, e.faction), e); if (b) job(e, 'deliver', b); else e.activity = 'Carrying supplies — build a stockyard'; return; }
  if (e.hunger < 55) { const b = nearest(stores(r, e.faction).filter(b => b.inventory.meals >= 1 || b.inventory.food >= 1), e); if (b) { job(e, 'eat', b); return; } }
  if (e.wounded || e.rest < 25) {
    const beds = bs.filter(b => b.complete && B[b.kind].beds), b = beds.find(b => b.id === e.home) || nearest(beds, e);
    if (b) { job(e, 'rest', b); return; }
    e.rest = Math.min(30, e.rest + 0.05); e.activity = 'Sleeping outdoors — needs a bed'; return;
  }
  if (e.belonging < 35) { const b = nearest(bs.filter(b => b.complete && b.kind === 'table'), e); if (b) { job(e, 'social', b); return; } }
  if (e.drafted) { e.activity = 'Drafted — awaiting orders'; return; }
  const kinds = [...ROLES].sort((a, b) => (e.priorities[a] || 99) - (e.priorities[b] || 99));
  for (const key of kinds) {
    if (!e.priorities[key]) continue;
    if (key === 'care') {
      const hurt = nearest(locals(w, r).filter(p => p.type === 'person' && p.faction === e.faction && p.hp < 85 && p.id !== e.id && p.job?.type === 'rest'), e);
      if (hurt && (stock(r, e.faction).medicine >= 1 || stock(r, e.faction).food >= 2)) { job(e, 'care', hurt); return; }
    }
    if (key === 'build') {
      for (const b of bs.filter(b => !b.complete)) {
        if (supplyJob(w, r, e, b, B[b.kind].cost)) return;
        if (Object.entries(B[b.kind].cost).every(([k, n]) => b.delivered[k] >= n)) { job(e, 'build', b); return; }
      }
      const damaged = nearest([...bs.filter(b => b.complete && b.hp < B[b.kind].hp), ...locals(w, r).filter(v => v.type !== 'person' && v.faction === e.faction && v.hp < v.maxHp)], e);
      if (damaged && stock(r, e.faction).parts >= 1) { job(e, 'repair', damaged); return; }
    }
    if (key === 'grow') {
      const b = nearest(bs.filter(b => b.complete && b.kind === 'field' && (b.tending < 1 || b.growth >= 1) && !w.entities.some(p => p.id !== e.id && p.job?.type === 'grow' && p.job.target === b.id)), e);
      if (b) { job(e, 'grow', b); return; }
    }
    if (key === 'gather') {
      const n = nearest([...r.nodes.filter(n => n.marked === e.faction && n.amount > 0), ...r.drops.filter(n => n.amount > 0 && (!n.faction || n.faction === e.faction))].filter(n => !w.entities.some(p => p.id !== e.id && p.job?.type === 'gather' && p.job.target === n.id)), e);
      if (n) { job(e, 'gather', n); return; }
    }
    if (key === 'craft' || key === 'cook') {
      if (key === 'craft') {
        const vehicle = nearest(locals(w, r).filter(v => v.faction === e.faction && v.type === 'vehicle' && v.fuel + inTransit(w, v.id, 'fuel') < 30), e);
        const source = vehicle && nearest(stores(r, e.faction).filter(b => b.inventory.fuel > 0), e);
        if (source) { job(e, 'fetch', source, { destination: vehicle.id, kind: 'fuel', amount: Math.min(12, 30 - vehicle.fuel - inTransit(w, vehicle.id, 'fuel')) }); return; }
      }
      for (const b of bs.filter(b => b.complete && b.powered)) {
        const recipe = RECIPES[b.recipe || B[b.kind].recipe], queued = b.queue[0], machine = queued && M[queued.kind];
        if (machine && key === 'craft') {
          if (supplyJob(w, r, e, b, machine.cost)) return;
          if (Object.entries(machine.cost).every(([k, n]) => b.delivered[k] >= n)) { job(e, 'fabricate', b); return; }
        }
        if (recipe && recipe.skill === key && (!recipe.tech || f.tech.includes(recipe.tech)) && Object.entries(recipe.output).some(([k]) => stock(r, e.faction)[k] < b.bill)) {
          if (supplyJob(w, r, e, b, recipe.input)) return;
          if (Object.entries(recipe.input).every(([k, n]) => b.delivered[k] >= n)) { job(e, 'craft', b); return; }
        }
      }
    }
    if (key === 'research' && f.research) { const b = nearest(bs.filter(b => b.complete && b.kind === 'laboratory'), e); if (b) { job(e, 'research', b); return; } }
    if (key === 'pilot' && e.training) { const b = nearest(bs.filter(b => b.complete && b.kind === 'garage'), e); if (b) { job(e, 'train', b); return; } }
  }
  e.activity = 'Available — designate resources or plan construction';
}
function doJob(w, r, e, dt) {
  const j = e.job, t = j.point || object(w, r, j.target);
  if (!t || t.hp <= 0 && !t.disabled) { clear(e); return; }
  e.activity = ({ fetch: `Fetching ${j.kind}`, deliver: `Carrying ${e.cargo?.kind || 'supplies'}`, build: 'Constructing', gather: 'Gathering', grow: 'Tending crops', eat: 'Going for food', rest: 'Resting', social: 'Meeting neighbors', research: 'Studying', craft: 'Producing', fabricate: 'Fabricating', repair: 'Repairing', train: 'Operator practice', care: 'Treating wounds', move: 'Moving', attackMove: 'Advancing' })[j.type] || j.type;
  if (!approach(w, r, e, t, dt, !['move', 'attackMove'].includes(j.type))) return;
  const bonus = factionOf(w, e.faction).tech.includes('tools') ? 1.2 : 1;
  if (j.type === 'fetch') {
    const dest = object(w, r, j.destination);
    if (!dest) { clear(e); return; }
    const n = Math.max(0, Math.min(j.amount, t.inventory[j.kind]));
    if (n) { t.inventory[j.kind] -= n; e.cargo = { kind: j.kind, amount: n, destination: dest.id }; job(e, 'deliver', dest); } else clear(e);
  } else if (j.type === 'deliver') {
    if (e.cargo) {
      if (t.type === 'vehicle' && e.cargo.kind === 'fuel') t.fuel = Math.min(100, t.fuel + e.cargo.amount);
      else { const target = e.cargo.destination === t.id && !t.type && (!t.complete || t.queue.length || RECIPES[t.recipe || B[t.kind].recipe]) ? t.delivered : t.inventory; target[e.cargo.kind] += e.cargo.amount; }
      e.cargo = null;
    }
    clear(e);
  } else if (j.type === 'build') {
    if (t.complete) { clear(e); return; }
    t.progress += dt * skillFactor(e, 'build') * bonus; practice(e, 'build', dt); t.active = 'Construction in progress';
    if (t.progress >= B[t.kind].work) { t.complete = true; t.delivered = emptyStock(); t.active = 'Ready'; remember(w, e, `Helped build ${B[t.kind].name}`, 3); note(w, e.faction, `${B[t.kind].name} is ready.`); clear(e); }
  } else if (j.type === 'gather') {
    j.work += dt * skillFactor(e, 'gather') * bonus; practice(e, 'gather', dt);
    if (j.work >= (t.kind === 'wood' || t.kind === 'food' ? 5 : 9)) {
      const n = Math.min(12, t.amount); t.amount -= n; e.cargo = n ? { kind: t.kind, amount: n } : null;
      if (!t.amount && r.terrain[tile(r, t.x, t.y)] === 2) { r.terrain[tile(r, t.x, t.y)] = 0; r.topology++; }
      clear(e);
    }
  } else if (j.type === 'grow') {
    practice(e, 'grow', dt); j.work += dt * skillFactor(e, 'grow');
    if (j.work >= 12) { if (t.growth >= 1) { e.cargo = { kind: 'food', amount: 28 }; t.growth = 0; remember(w, e, 'Brought in a harvest', 2); } t.tending = 1; clear(e); }
  } else if (j.type === 'eat') {
    const k = t.inventory.meals >= 1 ? 'meals' : 'food'; if (t.inventory[k] >= 1) { t.inventory[k]--; e.hunger = Math.min(100, e.hunger + (k === 'meals' ? 45 : 28)); if (k === 'meals') e.morale = Math.min(100, e.morale + 2); } clear(e);
  } else if (j.type === 'rest') {
    const enclosed = roomComfort(r, t), rate = t.kind === 'clinic' ? 0.4 : 0.23 + enclosed * 0.2;
    e.rest = Math.min(100, e.rest + dt * rate); if (!e.wounded) e.hp = Math.min(100, e.hp + dt * 0.035);
    if (e.rest > 90 && !e.wounded) clear(e);
  } else if (j.type === 'social') {
    e.belonging = Math.min(100, e.belonging + dt * 0.5); e.morale = Math.min(100, e.morale + dt * 0.04);
    for (const p of locals(w, r).filter(p => p.type === 'person' && p.id !== e.id && p.job?.target === t.id)) e.friends[p.id] = Math.min(100, (e.friends[p.id] || 0) + dt * 0.01);
    if (e.belonging >= 90) { remember(w, e, 'A quiet meal with the colony', 3); clear(e); }
  } else if (j.type === 'care') {
    j.work += dt * skillFactor(e, 'care'); practice(e, 'care', dt);
    if (j.work >= 20) { const cost = stock(r, e.faction).medicine >= 1 ? { medicine: 1 } : { food: 2 }; if (pay(r, e.faction, cost)) { t.hp = Math.min(100, t.hp + (cost.medicine ? 40 : 18)); if (t.hp >= 65) t.wounded = false; remember(w, t, `Treated by ${e.name}`, 8); } clear(e); }
  } else if (j.type === 'repair') {
    j.work += dt * skillFactor(e, 'craft'); practice(e, 'craft', dt);
    if (j.work >= 8) { if (pay(r, e.faction, { parts: 1 })) { t.hp = Math.min(t.maxHp || B[t.kind].hp, t.hp + 45); if (t.hp > (t.maxHp || 100) * 0.2) t.disabled = false; } clear(e); }
  } else if (j.type === 'research') {
    const f = factionOf(w, e.faction); if (!f.research) { clear(e); return; }
    f.research.work += dt * skillFactor(e, 'research'); practice(e, 'research', dt);
    if (f.research.work >= TECH[f.research.kind].work) { f.tech.push(f.research.kind); note(w, f.id, `Research complete: ${TECH[f.research.kind].name}. New capabilities are available.`); f.research = null; clear(e); }
  } else if (j.type === 'train') {
    if (!e.training) { clear(e); return; } practice(e, 'pilot', dt * 0.6); e.activity = `Operator training · skill ${skillLevel(e, 'pilot').toFixed(1)}`;
  } else if (j.type === 'craft' || j.type === 'fabricate') {
    if (!t.powered) { clear(e); return; }
    const q = t.queue[0], recipe = j.type === 'fabricate' ? q && M[q.kind] : RECIPES[t.recipe || B[t.kind].recipe];
    if (!recipe) { clear(e); return; }
    const inputs = recipe.cost || recipe.input;
    if (!Object.entries(inputs).every(([k, n]) => t.delivered[k] >= n)) { clear(e); return; }
    t.work = (t.work || 0) + dt * skillFactor(e, recipe.skill || 'craft'); practice(e, recipe.skill || 'craft', dt); t.active = j.type === 'craft' ? 'Producing supplies' : `Building ${recipe.name}`;
    if (t.work >= recipe.work) {
      for (const [k, n] of Object.entries(inputs)) t.delivered[k] -= n; t.work = 0;
      if (j.type === 'fabricate') { const spawn = freeEdge(r, t, e.faction); if (!spawn) { for (const [k, n] of Object.entries(inputs)) t.delivered[k] += n; t.active = 'Output blocked — clear the hangar edge'; return; } makeMachine(w, e.faction, r.id, q.kind, spawn.x, spawn.y); t.queue.shift(); note(w, e.faction, `${recipe.name} completed.`); }
      else { const [kind, amount] = Object.entries(recipe.output)[0]; e.cargo = { kind, amount }; }
      clear(e);
    }
  } else if (j.type === 'move' || j.type === 'attackMove') clear(e);
}
function freeEdge(r, b, faction) {
  const d = B[b.kind] || { w: 1, h: 1 };
  for (let y = b.y - 1; y <= b.y + d.h; y++) for (let x = b.x - 1; x <= b.x + d.w; x++) if (walkable(r, x, y, B, faction)) return { x: x + 0.5, y: y + 0.5 };
  return null;
}
const comfortCache = new WeakMap();
export function roomComfort(r, b) {
  let cached = comfortCache.get(r);
  const signature = `${r.topology}:${r.buildings.filter(b => b.complete).length}`;
  if (!cached || cached.signature !== signature) { cached = { signature, values: new Map() }; comfortCache.set(r, cached); }
  if (!cached.values.has(b.id)) cached.values.set(b.id, calculateComfort(r, b));
  return cached.values.get(b.id);
}
function calculateComfort(r, b) {
  // Bounded flood fill: a room must be enclosed, small enough to roof and accessible through doors.
  const p = freeEdge(r, b, b.faction); if (!p) return 0;
  const start = tile(r, p.x, p.y), visited = new Set([start]), open = [start]; let floors = 0;
  while (open.length && visited.size <= 180) {
    const i = open.pop(), x = i % r.size, y = Math.floor(i / r.size);
    if (x < 1 || y < 1 || x >= r.size - 1 || y >= r.size - 1) return 0;
    if (r.buildings.some(o => o.complete && o.kind === 'floor' && o.x === x && o.y === y)) floors++;
    for (const j of [i - 1, i + 1, i - r.size, i + r.size]) {
      if (visited.has(j)) continue; const xx = j % r.size, yy = Math.floor(j / r.size);
      if (r.terrain[j] === 2 || r.buildings.some(o => o.complete && ['wall', 'door'].includes(o.kind) && o.x === xx && o.y === yy)) continue;
      visited.add(j); open.push(j);
    }
  }
  return visited.size <= 180 ? 0.5 + 0.5 * floors / visited.size : 0;
}

export function hostile(w, a, b) { return a !== b && w.treaties.some(t => t.kind === 'war' && t.parties.includes(a) && t.parties.includes(b) && w.time >= t.effective); }
export function allied(w, a, b) { return a === b || w.treaties.some(t => t.kind === 'alliance' && t.parties.includes(a) && t.parties.includes(b)); }
function hurt(w, r, target, damage, attacker) {
  const armor = target.type === 'person' ? 0 : M[target.kind]?.armor || 0;
  target.hp = Math.max(0, target.hp - Math.max(1, damage - armor));
  if (target.type === 'person' && target.hp < 40) { target.wounded = true; target.drafted = false; clear(target); }
  if (target.type === 'vehicle' && target.hp <= target.maxHp * 0.12 && !target.disabled) {
    target.disabled = true; target.hp = Math.max(1, target.hp); clear(target);
    for (const pid of [...target.crew]) { const p = entityOf(w, pid); if (!p) continue; p.vehicle = null; p.region = r.id; const spot = freeEdge(r, target, p.faction) || { x: target.x, y: target.y }; Object.assign(p, spot); p.hp = Math.max(15, p.hp - 45); p.wounded = true; p.drafted = false; clear(p); remember(w, p, `Survived the loss of ${target.name}`, -15); }
    target.crew = []; note(w, target.faction, `${target.name} disabled. Recover the crew and repair the hull.`, 'warning');
  }
  if (target.hp <= 0) {
    clear(target); if (target.cargo) { r.drops.push({ id: id(w), x: target.x, y: target.y, ...target.cargo, faction: target.faction }); target.cargo = null; }
    if (target.inventory) { for (const [kind, amount] of Object.entries(target.inventory)) if (amount) r.drops.push({ id: id(w), x: target.x, y: target.y, kind, amount, faction: target.faction }); target.inventory = emptyStock(); }
    if (B[target.kind]) r.topology++;
    note(w, target.faction, `${target.name || B[target.kind]?.name} lost in fighting.`, 'danger');
    if (attacker?.type === 'person') remember(w, attacker, 'Survived a battle', -3);
  }
}
function combat(w, r, dt) {
  const units = locals(w, r), turrets = r.buildings.filter(b => b.kind === 'turret' && b.complete && b.hp > 0 && b.powered);
  for (const e of [...units, ...turrets]) {
    e.cooldown = Math.max(0, (e.cooldown || 0) - dt);
    if (e.type === 'person' && (!e.drafted || e.wounded) || e.type === 'vehicle' && (!operator(w, e) || e.disabled || e.fuel <= 0) || e.disabled) continue;
    const d = M[e.kind] || B[e.kind] || { range: 9, damage: 5, cycle: 2 }, origin = B[e.kind] ? footprint(e, B) : e;
    if (!d.range) continue;
    const enemies = [...units.filter(o => !o.disabled), ...r.buildings.filter(b => b.hp > 0 && b.complete && ['core', 'relay', 'turret'].includes(b.kind))].filter(o => hostile(w, e.faction, o.faction));
    const forced = e.job?.type === 'attack' && enemies.find(o => o.id === e.job.target);
    const target = forced || nearest(enemies.filter(o => distance(origin, B[o.kind] ? footprint(o, B) : o) <= d.range), origin);
    if (!target) continue;
    const point = B[target.kind] ? footprint(target, B) : target, dist = distance(origin, point);
    if (dist > d.range || d.minRange && dist < d.minRange || !sight(r, origin, point, B)) {
      if (forced && e.type) approach(w, r, e, target, dt, true); continue;
    }
    // Explicit move is a retreat order; attack-move can engage opportunistically.
    if (e.job?.type === 'move') continue;
    e.activity = `Engaging ${target.name || B[target.kind]?.name}`;
    if (e.cooldown <= 0) {
      const op = e.type === 'vehicle' ? operator(w, e) : null;
      e.cooldown = (d.cycle || 2) / (op ? skillFactor(op, 'pilot') : 1);
      e.shot = { x: point.x, y: point.y, at: w.time }; hurt(w, r, target, d.damage, e);
      if (op) practice(op, 'pilot', 3);
    }
  }
}
function power(w, r, dt) {
  for (const b of r.buildings) { b.powered = !B[b.kind].demand; if (!b.complete || b.hp <= 0) continue;
    if (b.kind === 'generator') {
      b.fuelTime = Math.max(0, (b.fuelTime || 0) - dt);
      if (!b.fuelTime && pay(r, b.faction, { fuel: 1 })) b.fuelTime = 120;
      b.powered = b.fuelTime > 0; b.available = b.powered ? B.generator.power : 0;
      b.active = b.powered ? 'Turbine running' : 'Needs fuel in local storage';
    }
  }
  for (const b of r.buildings.filter(b => b.complete && b.hp > 0 && B[b.kind].demand)) {
    const source = r.buildings.find(g => g.kind === 'generator' && g.complete && g.hp > 0 && g.faction === b.faction && g.available >= B[b.kind].demand && distance(g, b) <= 24);
    if (source) { source.available -= B[b.kind].demand; b.powered = true; } else { b.powered = false; b.active = 'Needs nearby powered turbine'; }
  }
}
export function worldRoute(w, fromId, toId, flying = false) {
  const from = regionOf(w, fromId), to = regionOf(w, toId); if (!from || !to || from === to) return null;
  const dist = new Map([[from.id, 0]]), prev = new Map(), open = [from];
  while (open.length) {
    open.sort((a, b) => dist.get(a.id) - dist.get(b.id)); const r = open.shift(); if (r === to) break;
    const neighbors = w.regions.filter(n => n.realm === r.realm && Math.abs(n.gx - r.gx) + Math.abs(n.gy - r.gy) === 1 || n.realm !== r.realm && n.gx === 1 && n.gy === 1 && r.gx === 1 && r.gy === 1);
    for (const n of neighbors) {
      const cross = n.realm !== r.realm, km = cross ? 180 : 18 + (r.distanceKm + n.distanceKm) / 2, terrain = flying ? 1 : n.resource === 'crystal' ? 1.8 : n.gx === 2 ? 1.25 : 1;
      const cost = dist.get(r.id) + km * terrain;
      if (cost >= (dist.get(n.id) ?? Infinity)) continue;
      dist.set(n.id, cost); prev.set(n.id, { from: r.id, km, terrain, cross }); if (!open.includes(n)) open.push(n);
    }
  }
  if (!prev.has(to.id)) return null;
  const legs = []; for (let rid = to.id; rid !== from.id;) { const leg = prev.get(rid); legs.push({ ...leg, to: rid }); rid = leg.from; }
  return { legs: legs.reverse(), km: legs.reduce((s, l) => s + l.km, 0), effort: dist.get(to.id), crossRealm: from.realm !== to.realm };
}
export function journeyQuote(w, faction, region, destination, ids, cargo = {}) {
  const r = regionOf(w, region), members = ids.map(i => entityOf(w, i));
  if (!r || !members.length || new Set(ids).size !== ids.length || members.some(e => !e || e.faction !== faction || e.region !== region || e.journey || e.vehicle || e.hp <= 0 || e.disabled)) return { error: 'Select living, available members of this colony in the departure region.' };
  const vehicles = members.filter(e => e.type === 'vehicle');
  if (vehicles.some(e => !operator(w, e))) return { error: 'Every vehicle needs a fit operator aboard.' };
  if (Object.entries(cargo).some(([k, n]) => !RESOURCES.includes(k) || !Number.isInteger(n) || n < 0)) return { error: 'Cargo must contain nonnegative whole resource amounts.' };
  const walking = members.filter(e => e.type !== 'vehicle'), flying = vehicles.length > 0 && !walking.length && vehicles.every(v => M[v.kind].flying);
  const path = worldRoute(w, region, destination, flying); if (!path) return { error: 'Choose a reachable destination.' };
  const speed = Math.min(...members.map(e => e.type === 'vehicle' ? M[e.kind].travel * skillFactor(operator(w, e), 'pilot') : e.type === 'robot' ? M[e.kind].speed * 2.5 : 4));
  const capacity = members.reduce((s, e) => s + (M[e.kind]?.capacity || (e.type === 'person' ? 18 : 8)), 0), weight = Object.values(cargo).reduce((a, b) => a + b, 0);
  const seconds = Math.ceil(path.effort / speed * 3600), people = members.filter(e => e.type === 'person').length + vehicles.reduce((s, v) => s + v.crew.length, 0), provisions = Math.max(1, Math.ceil(seconds / 3600 * people * 0.3));
  if (weight > capacity) return { error: `Cargo weighs ${weight}; this party can carry ${capacity}.` };
  if (vehicles.some(v => v.fuel < path.km * M[v.kind].fuel)) return { error: 'Refuel the vehicles before departure.', km: path.km };
  if (!canPay(r, faction, { ...cargo, food: (cargo.food || 0) + provisions })) return { error: `Need selected cargo plus ${provisions} food for the journey.` };
  return { ...path, speed, seconds, capacity, provisions, people, fuel: vehicles.reduce((s, v) => s + path.km * M[v.kind].fuel, 0) };
}
function startJourney(w, faction, c) {
  const q = journeyQuote(w, faction, c.region, c.destination, c.ids, c.cargo || {}); if (q.error) throw new Error(q.error);
  const r = regionOf(w, c.region), cargo = { ...emptyStock(), ...c.cargo }, jid = id(w), members = c.ids.map(i => entityOf(w, i)), all = [...members];
  for (const v of members.filter(e => e.type === 'vehicle')) { v.fuel -= q.km * M[v.kind].fuel; for (const pid of v.crew) all.push(entityOf(w, pid)); }
  // Carried goods are retained on their original entity; only explicit cargo is withdrawn.
  pay(r, faction, { ...cargo, food: cargo.food + q.provisions });
  for (const e of all) { e.journey = jid; e.region = null; clear(e); e.activity = `Traveling to ${regionOf(w, c.destination).name}`; }
  const j = { id: jid, faction, from: c.region, to: c.destination, members: all.map(e => e.id), roots: c.ids, cargo, departed: w.time, arrival: w.time + q.seconds, quote: q, status: 'traveling' };
  w.journeys.push(j); note(w, faction, `Expedition departed for ${regionOf(w, c.destination).name}. ${q.km.toFixed(0)} km; ${(q.seconds / 3600).toFixed(1)} hours.`); return j.id;
}
function updateJourneys(w) {
  for (const j of w.journeys.filter(j => j.status === 'traveling' && j.arrival <= w.time)) {
    const r = regionOf(w, j.to), anchor = stores(r, j.faction)[0], point = anchor ? freeEdge(r, anchor, j.faction) : { x: 2.5, y: r.size / 2 + 0.5 };
    for (const eid of j.members) { const e = entityOf(w, eid); e.journey = null; e.region = r.id; Object.assign(e, point || r.start); clear(e); if (e.type === 'person') remember(w, e, `Reached ${r.name}`, 4); }
    for (const [kind, amount] of Object.entries(j.cargo)) if (amount) { if (anchor) anchor.inventory[kind] += amount; else r.drops.push({ id: id(w), ...point, kind, amount, faction: j.faction }); }
    j.cargo = emptyStock(); j.status = 'arrived'; j.arrived = w.time; note(w, j.faction, `Expedition arrived in ${r.name}. Supplies are ${anchor ? 'in local storage' : 'unloaded at the entry point'}.`);
  }
}
function occupation(w, r, dt) {
  if (!r.occupation) return;
  const o = r.occupation, presence = locals(w, r).filter(e => e.faction === o.faction && !e.disabled && usable(e)), defenders = locals(w, r).filter(e => hostile(w, o.faction, e.faction) && usable(e) && !e.disabled);
  if (w.time < o.begins) { o.status = 'Declaration notice'; return; }
  const seat = r.buildings.find(b => b.faction === o.faction && b.complete && b.hp > 0 && ['core', 'relay'].includes(b.kind));
  if (!presence.length || defenders.length || !seat) { o.status = !presence.length ? 'No occupying force' : defenders.length ? 'Defenders contest control' : 'Build a frontier relay'; return; }
  if (o.supplyClock <= 0) { if (!pay(r, o.faction, { food: 1 })) { o.status = 'Occupation stalled: deliver food'; return; } o.supplyClock = 60; }
  o.supplyClock -= dt; o.progress += dt; o.status = 'Integrating supplied territory';
  if (o.progress >= w.policy.occupationTime) {
    const old = r.owner; r.owner = o.faction;
    for (const b of r.buildings.filter(b => b.faction === old && b.hp > 0)) b.faction = o.faction;
    r.topology++; if (old) { const f = factionOf(w, old); if (f.home === r.id) f.subjectOf = o.faction; note(w, old, `${r.name} has fallen. Your people remain yours: evacuate, rebuild elsewhere or negotiate release.`, 'danger'); }
    note(w, o.faction, `${r.name} is now part of your domain.`); r.occupation = null;
    const realm = w.regions.filter(n => n.realm === r.realm);
    if (realm.every(n => n.owner === r.owner) && !w.victories.some(v => v.faction === r.owner && v.realm === r.realm)) { w.victories.push({ faction: r.owner, realm: r.realm, at: w.time }); note(w, r.owner, 'Domain victory recorded. Your colony and world continue; the next realm awaits.'); }
  }
}
function recruit(w, f, dt) {
  if (!f.recruiting) return;
  const r = regionOf(w, f.home), beds = r.buildings.filter(b => b.complete && b.faction === f.id && b.hp > 0).reduce((s, b) => s + (B[b.kind].beds || 0), 0), population = w.entities.filter(e => e.type === 'person' && e.faction === f.id && e.hp > 0).length;
  if (beds <= population) return;
  f.recruiting.work += dt;
  if (f.recruiting.work >= 1800) { const p = makePerson(w, f.id, r.id, r.start.x - 2, r.start.y, f.population++); note(w, f.id, `${p.name} joined the colony. Skills will grow through practice.`); f.recruiting = null; }
}
function ai(w, f) {
  const r = regionOf(w, f.home); if (r.owner !== f.id) return;
  const workers = w.entities.filter(e => e.faction === f.id && e.type === 'person' && e.hp > 0);
  workers.forEach((e, i) => { if (e.drafted || e.vehicle || e.journey) return; const roles = [['build', 'gather'], ['gather', 'build'], ['grow', 'care'], ['cook', 'craft'], ['research', 'craft'], ['craft', 'pilot']][i % 6]; for (const k of ROLES) e.priorities[k] = k === roles[0] ? 1 : k === roles[1] ? 2 : k === 'gather' ? 4 : 3; });
  for (const b of r.buildings) if (b.kind === 'workshop') b.bill = 180; else if (b.kind === 'refinery') b.bill = 100;
  for (const node of r.nodes) if (distance(node, r.start) < 45 && explored(r, f.id, node.x, node.y)) node.marked = f.id;
  const priorities = ['bed', 'bed', 'bed', 'bed', 'field', 'kitchen', 'table', 'workshop', 'laboratory', 'clinic', 'refinery', 'generator', 'garage', 'fabricator'];
  for (let i = 0; i < priorities.length; i++) {
    const kind = priorities[i], required = priorities.slice(0, i + 1).filter(k => k === kind).length;
    if (r.buildings.filter(b => b.faction === f.id && b.kind === kind && b.hp > 0).length >= required || B[kind].tech && !f.tech.includes(B[kind].tech)) continue;
    if (r.buildings.filter(b => !b.complete).length >= 3) break;
    let placed = false;
    for (let yy = -12; yy < 18 && !placed; yy += 4) for (let xx = -12; xx < 18 && !placed; xx += 5) {
      const x = r.start.x + xx, y = r.start.y + yy; if (!placement(w, r, f.id, kind, x, y)) { makeBuilding(w, r, f.id, kind, x, y); placed = true; }
    }
    break;
  }
  if (!f.research && r.buildings.some(b => b.kind === 'laboratory' && b.complete)) {
    const kind = Object.keys(TECH).find(k => !f.tech.includes(k) && (!TECH[k].requires || f.tech.includes(TECH[k].requires)) && canPay(r, f.id, TECH[k].cost));
    if (kind) { pay(r, f.id, TECH[kind].cost); f.research = { kind, work: 0 }; }
  }
  const factory = r.buildings.find(b => b.kind === 'fabricator' && b.complete), garage = r.buildings.find(b => b.kind === 'garage' && b.complete);
  if (factory && !factory.queue.length && canPay(r, f.id, M.guard.cost)) factory.queue.push({ id: id(w), kind: 'guard' });
  if (garage && !garage.queue.length && !w.entities.some(e => e.faction === f.id && e.type === 'vehicle')) garage.queue.push({ id: id(w), kind: 'hauler' });
  if (!f.recruiting && workers.length < 8 && r.buildings.filter(b => b.complete).reduce((s, b) => s + (B[b.kind].beds || 0), 0) > workers.length && pay(r, f.id, { meals: 15, wood: 20 })) f.recruiting = { work: 0 };
}
export function step(w, dt = 0.1) {
  if (!Number.isFinite(dt) || dt <= 0 || dt > 60) throw new Error('Simulation step must be between 0 and 60 seconds.');
  const before = w.time; w.time += dt; w.revision++;
  updateJourneys(w);
  for (const r of w.regions) {
    if (!r.buildings.length && !w.entities.some(e => e.region === r.id)) continue;
    power(w, r, dt);
    for (const b of r.buildings.filter(b => b.complete && b.hp > 0 && b.kind === 'field')) {
      if (b.tending > 0) { const fertility = r.fertility[tile(r, b.x + 2, b.y + 2)] / 100; b.growth = Math.min(1, b.growth + dt / 900 * fertility); b.tending = Math.max(0, b.tending - dt / 1200); }
      b.active = b.growth >= 1 ? 'Ready to harvest' : b.tending <= 0 ? 'Needs grower' : `Growing · ${Math.round(b.growth * 100)}%`;
    }
    for (const e of locals(w, r)) {
      if (e.type === 'person') {
        e.hunger = Math.max(0, e.hunger - dt * 0.025); e.rest = Math.max(0, e.rest - dt * 0.008); e.belonging = Math.max(0, e.belonging - dt * 0.004);
        if (!e.hunger) e.hp = Math.max(1, e.hp - dt * 0.02);
        if (e.job && !['eat', 'rest', 'care', 'deliver'].includes(e.job.type) && !e.drafted && (e.hunger < 18 || e.rest < 8 || e.wounded)) clear(e);
        if (!e.job) chooseJob(w, r, e);
      }
      if (e.job && e.job.type !== 'attack') doJob(w, r, e, dt);
    }
    combat(w, r, dt); occupation(w, r, dt);
    r.drops = r.drops.filter(d => d.amount > 0);
  }
  for (const f of w.factions) { recruit(w, f, dt); if (f.ai && Math.floor(before / 30) !== Math.floor(w.time / 30)) ai(w, f); }
  if (Math.floor(before / 2) !== Math.floor(w.time / 2)) reveal(w);
}
function own(w, faction, ids, region) {
  if (!Array.isArray(ids) || !ids.length || ids.length > 1000 || new Set(ids).size !== ids.length) throw new Error('Select a valid group.');
  const es = ids.map(id => entityOf(w, id));
  if (es.some(e => !e || e.faction !== faction || e.hp <= 0 || e.journey || e.vehicle || region && e.region !== region)) throw new Error('You can command only your available units in this region.'); return es;
}
export function command(w, faction, c) {
  const f = factionOf(w, faction), r = regionOf(w, c?.region); if (!f || !c || typeof c.type !== 'string') throw new Error('Invalid colony command.');
  if (['build', 'designate', 'research', 'recruit', 'queue', 'cancel', 'bill', 'claim'].includes(c.type) && !r) throw new Error('Choose a region.');
  if (c.type === 'build') {
    // A hostile territorial seat may be built during an already declared occupation.
    const original = r.owner; if (c.kind === 'relay' && r.occupation?.faction === faction) r.owner = faction;
    const error = placement(w, r, faction, c.kind, c.x, c.y); r.owner = original; if (error) throw new Error(error);
    const b = makeBuilding(w, r, faction, c.kind, c.x, c.y); return { message: `${B[c.kind].name} planned. Workers will deliver materials.`, id: b.id };
  }
  if (c.type === 'designate') {
    if (!Array.isArray(c.ids)) throw new Error('Select resources.');
    const nodes = r.nodes.filter(n => c.ids.includes(n.id) && n.amount > 0 && explored(r, faction, n.x, n.y));
    if (!nodes.length) throw new Error('No visible resources selected.'); if (r.owner && r.owner !== faction) throw new Error('You do not control these resource claims.');
    for (const n of nodes) n.marked = c.clear ? null : faction; return { message: `${nodes.length} resource deposits ${c.clear ? 'released' : 'designated for gathering'}.` };
  }
  if (c.type === 'order') {
    const es = own(w, faction, c.ids, c.region); if (!r || !['move', 'attackMove', 'attack', 'stop'].includes(c.order)) throw new Error('Choose a valid order.');
    if (c.order === 'attack') { const t = object(w, r, c.target); if (!t || !hostile(w, faction, t.faction)) throw new Error('Declare war and wait for notice before attacking.'); for (const e of es) { clear(e); e.drafted = true; job(e, 'attack', t); } }
    else if (c.order === 'stop') for (const e of es) clear(e);
    else {
      if (!inside(r, c.x, c.y)) throw new Error('Choose a point inside this map.');
      const points = es.map((e, i) => ({ x: Math.floor(c.x) + i % 4 + 0.5, y: Math.floor(c.y) + Math.floor(i / 4) + 0.5 }));
      if (es.some((e, i) => !walkable(r, points[i].x, points[i].y, B, faction) || route(r, e, points[i], B, faction) === null || e.type === 'vehicle' && !machineSpeed(w, e))) throw new Error('The group cannot reach that formation. Vehicles need crew, fuel and a working hull.');
      es.forEach((e, i) => { clear(e); job(e, c.order, { id: null }, { point: points[i] }); });
    }
    return { message: `${es.length} units: ${c.order}.` };
  }
  if (c.type === 'draft') { const es = own(w, faction, c.ids, c.region); for (const e of es) { e.drafted = Boolean(c.value); clear(e); } return { message: c.value ? 'Mobilized. Civilian work is suspended.' : 'Released to civilian work.' }; }
  if (c.type === 'priority') { const [e] = own(w, faction, [c.id]); if (e.type !== 'person' || !ROLES.includes(c.skill) || !Number.isInteger(c.value) || c.value < 0 || c.value > 4) throw new Error('Priority must be 0–4 for a civilian skill.'); e.priorities[c.skill] = c.value; clear(e); return { message: 'Work priority updated.' }; }
  if (c.type === 'home') { const [e] = own(w, faction, [c.id]); const b = regionOf(w, e.region).buildings.find(b => b.id === c.home && b.faction === faction && B[b.kind].beds && b.complete); if (!b) throw new Error('Select an available bed in this region.'); e.home = b.id; return { message: 'Home assigned.' }; }
  if (c.type === 'research') { const d = TECH[c.kind]; if (!d || f.tech.includes(c.kind) || f.research) throw new Error('Choose an available research project.'); if (d.requires && !f.tech.includes(d.requires)) throw new Error(`Requires ${TECH[d.requires].name}.`); if (!r.buildings.some(b => b.faction === faction && b.kind === 'laboratory' && b.complete && b.hp > 0)) throw new Error('Build a study hall first.'); if (!pay(r, faction, d.cost)) throw new Error('Insufficient research materials in this region.'); f.research = { kind: c.kind, work: 0 }; return { message: 'Research commissioned. Assign someone to study.' }; }
  if (c.type === 'recruit') { if (f.recruiting) throw new Error('A newcomer is already preparing to travel.'); if (!pay(r, faction, { meals: 15, wood: 20 })) throw new Error('Welcoming a newcomer needs 15 meals and 20 wood.'); f.recruiting = { work: 0 }; return { message: 'Recruitment begun. Arrival takes 30 minutes and requires a spare bed.' }; }
  if (c.type === 'queue') { const b = r.buildings.find(b => b.id === c.id && b.faction === faction && b.complete && b.hp > 0), d = M[c.kind]; if (!b || !d || b.kind !== (d.type === 'robot' ? 'fabricator' : 'garage') || !f.tech.includes(d.tech)) throw new Error('Select the correct production building and research this design.'); if (b.queue.length >= 20) throw new Error('This queue is full.'); b.queue.push({ id: id(w), kind: c.kind }); return { message: `${d.name} queued. Materials and labor are required.` }; }
  if (c.type === 'bill') { const b = r.buildings.find(b => b.id === c.id && b.faction === faction && RECIPES[B[b.kind].recipe]); if (!b || !Number.isInteger(c.amount) || c.amount < 0 || c.amount > 10000) throw new Error('Choose a valid production target.'); b.bill = c.amount; return { message: 'Production target updated.' }; }
  if (c.type === 'cancel') {
    const b = r.buildings.find(b => b.id === c.id && b.faction === faction && b.hp > 0); if (!b || b.kind === 'core') throw new Error('Select a removable plan or structure.');
    if (c.queue) { b.queue = []; b.work = 0; } else { b.hp = 0; r.topology++; }
    for (const [kind, amount] of Object.entries(b.delivered)) if (amount) r.drops.push({ id: id(w), x: b.x - 0.5, y: b.y - 0.5, kind, amount, faction }); b.delivered = emptyStock();
    if (!c.queue) { for (const [kind, amount] of Object.entries(b.inventory)) if (amount) r.drops.push({ id: id(w), x: b.x - 0.5, y: b.y - 0.5, kind, amount, faction }); b.inventory = emptyStock(); }
    for (const e of w.entities) { if (e.cargo?.destination === b.id) delete e.cargo.destination; if (e.job?.destination === b.id || e.job?.target === b.id) clear(e); }
    return { message: 'Cancelled. Delivered materials remain recoverable on the ground.' };
  }
  if (c.type === 'board') { const es = own(w, faction, c.ids, c.region), v = entityOf(w, c.vehicle); if (!v || v.type !== 'vehicle' || v.faction !== faction || v.region !== c.region || v.journey || v.disabled || es.some(e => e.type !== 'person' || !usable(e) || distance(e, v) > 4) || es.length + v.crew.length > M[v.kind].seats) throw new Error('Move fit civilians within four tiles of a vehicle with empty seats.'); for (const e of es) { clear(e); e.vehicle = v.id; e.drafted = true; e.activity = `Aboard ${v.name}`; v.crew.push(e.id); } return { message: 'Crew aboard. Their home jobs are suspended.' }; }
  if (c.type === 'disembark') { const [v] = own(w, faction, [c.id]); if (v.type !== 'vehicle') throw new Error('Select a vehicle.'); const rr = regionOf(w, v.region), p = freeEdge(rr, v, faction); if (!p) throw new Error('No safe disembarkation tile.'); for (const pid of v.crew) { const e = entityOf(w, pid); e.vehicle = null; Object.assign(e, p); e.drafted = false; clear(e); } v.crew = []; clear(v); return { message: 'Crew disembarked with identity and skills preserved.' }; }
  if (c.type === 'refuel') { const [v] = own(w, faction, [c.id]); const rr = regionOf(w, v.region), depot = stores(rr, faction).find(b => distance(v, footprint(b, B)) < 8); if (v.type !== 'vehicle' || !depot) throw new Error('Move the vehicle within eight tiles of friendly storage.'); const n = Math.min(100 - v.fuel, Math.floor(stock(rr, faction).fuel)); if (n <= 0) throw new Error('No fuel available or the tank is full.'); pay(rr, faction, { fuel: n }); v.fuel += n; return { message: `Loaded ${n.toFixed(1)} fuel.` }; }
  if (c.type === 'train') { const [e] = own(w, faction, [c.id]); if (e.type !== 'person') throw new Error('Select a civilian.'); e.training = Boolean(c.value); e.priorities.pilot = c.value ? 1 : 3; clear(e); return { message: c.value ? 'Operator practice enabled at the hangar.' : 'Operator practice stopped.' }; }
  if (c.type === 'travel') return { message: 'Expedition departed.', id: startJourney(w, faction, c) };
  if (c.type === 'diplomacy') {
    const other = factionOf(w, c.other); if (!other || other.id === faction || !['war', 'peace', 'alliance', 'trade', 'accept', 'reject'].includes(c.action)) throw new Error('Choose a valid diplomatic action.');
    if (c.action === 'war') { w.treaties = w.treaties.filter(t => !(t.parties.includes(faction) && t.parties.includes(other.id))); w.treaties.push({ id: id(w), kind: 'war', parties: [faction, other.id], effective: w.time + w.policy.coreNotice }); note(w, other.id, `${f.name} declared war. Core attacks become possible in one hour. Standing defenses remain active while offline.`, 'warning'); return { message: 'War declared. Notice is visible to both colonies.' }; }
    if (c.action === 'accept' || c.action === 'reject') {
      const offer = w.offers.find(o => o.id === c.offer && o.to === faction && o.status === 'open'); if (!offer) throw new Error('This offer is no longer available.');
      offer.status = c.action === 'accept' ? 'accepted' : 'rejected';
      if (c.action === 'accept') {
        if (offer.kind === 'trade') { const rr = regionOf(w, offer.region), sender = stores(rr, offer.from)[0], recipient = stores(rr, faction)[0]; if (!sender || !recipient || !canPay(rr, faction, offer.want)) { offer.status = 'open'; throw new Error('Both sides need storage and the requested goods in the trading region.'); } pay(rr, faction, offer.want); for (const [k, n] of Object.entries(offer.want)) sender.inventory[k] += n; for (const [k, n] of Object.entries(offer.give)) recipient.inventory[k] += n; offer.give = {}; }
        else { w.treaties = w.treaties.filter(t => !(t.parties.includes(faction) && t.parties.includes(offer.from))); w.treaties.push({ id: id(w), kind: offer.kind, parties: [faction, offer.from], effective: w.time }); }
      } else if (offer.kind === 'trade') { const rr = regionOf(w, offer.region), depot = stores(rr, offer.from)[0]; if (depot) for (const [k, n] of Object.entries(offer.give)) depot.inventory[k] += n; else for (const [kind, amount] of Object.entries(offer.give)) rr.drops.push({ id: id(w), ...rr.start, kind, amount, faction: offer.from }); offer.give = {}; }
      return { message: `Offer ${offer.status}.` };
    }
    const offer = { id: id(w), from: faction, to: other.id, kind: c.action, status: 'open', at: w.time };
    if (c.action === 'trade') { if (!r || !c.give || !c.want || [...Object.entries(c.give), ...Object.entries(c.want)].some(([k, n]) => !RESOURCES.includes(k) || !Number.isInteger(n) || n < 0 || n > 10000)) throw new Error('Trade needs valid resources and quantities.'); if (!pay(r, faction, c.give)) throw new Error('The offered goods are not available.'); Object.assign(offer, { region: r.id, give: c.give, want: c.want }); }
    w.offers.push(offer); note(w, other.id, `${f.name} sent a ${c.action} offer.`); return { message: 'Offer sent to the other colony.' };
  }
  if (c.type === 'claim') { if (r.owner === faction || r.occupation) throw new Error('This region is already controlled or contested.'); if (r.owner && !hostile(w, faction, r.owner)) throw new Error('A hostile claim requires an effective declaration of war.'); if (!locals(w, r).some(e => e.faction === faction && usable(e))) throw new Error('Send an expedition before claiming territory.'); r.occupation = { faction, begins: w.time + w.policy.frontierNotice, progress: 0, supplyClock: 0, status: 'Declaration notice' }; if (r.owner) note(w, r.owner, `${f.name} is attempting to occupy ${r.name}.`, 'warning'); return { message: 'Claim announced. Establish a relay, deliver food and hold the ground.' }; }
  throw new Error('Unknown command.');
}
