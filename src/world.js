import { WIDTH, HEIGHT, BUILDINGS } from './catalog.js';

export function random(state) {
  state.rng = (Math.imul(state.rng, 1664525) + 1013904223) >>> 0;
  return state.rng / 4294967296;
}
export const cell = (x, y) => Math.floor(y) * WIDTH + Math.floor(x);
export const inside = (x, y) => x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;
export const center = b => ({ x: b.x + BUILDINGS[b.kind].w / 2, y: b.y + BUILDINGS[b.kind].h / 2 });
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export function occupied(s, x, y, ignore = null) {
  return s.buildings.find(b => b.id !== ignore && b.hp > 0 && x >= b.x && y >= b.y && x < b.x + BUILDINGS[b.kind].w && y < b.y + BUILDINGS[b.kind].h);
}
export function walkable(s, x, y) {
  return inside(x, y) && s.terrain[cell(x, y)] !== 2 && !occupied(s, Math.floor(x), Math.floor(y));
}
export function adjacent(a, b) {
  const def = BUILDINGS[b.kind];
  if (!def) return distance(a, b) < 1.35;
  const dx = Math.max(b.x - a.x, 0, a.x - (b.x + def.w));
  const dy = Math.max(b.y - a.y, 0, a.y - (b.y + def.h));
  return Math.hypot(dx, dy) < 0.85;
}

// Breadth-first grid routing is deterministic and bounded by the 3,072-cell map.
// Routes terminate at an accessible interaction edge, never a building's center.
export function path(s, from, target, edge = false) {
  const start = cell(from.x, from.y);
  const parent = new Int32Array(WIDTH * HEIGHT).fill(-1);
  const queue = new Int32Array(WIDTH * HEIGHT);
  const blocked = new Uint8Array(s.terrain.map(t => t === 2 ? 1 : 0));
  for (const b of s.buildings) {
    if (b.hp <= 0) continue;
    const d = BUILDINGS[b.kind];
    for (let y = b.y; y < b.y + d.h; y++) for (let x = b.x; x < b.x + d.w; x++) blocked[cell(x, y)] = 1;
  }
  let head = 0, tail = 1;
  queue[0] = start;
  parent[start] = start;
  while (head < tail) {
    const idx = queue[head++], x = idx % WIDTH, y = Math.floor(idx / WIDTH);
    const point = { x: x + 0.5, y: y + 0.5 };
    if (edge ? adjacent(point, target) : idx === cell(target.x, target.y)) {
      const result = [];
      for (let p = idx; p !== start; p = parent[p]) result.push({ x: p % WIDTH + 0.5, y: Math.floor(p / WIDTH) + 0.5 });
      if (!result.length) return [edge ? point : { x: target.x, y: target.y }];
      return result.reverse();
    }
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (!inside(nx, ny)) continue;
      const n = cell(nx, ny);
      if (parent[n] >= 0 || blocked[n]) continue;
      parent[n] = idx;
      queue[tail++] = n;
    }
  }
  return null;
}

export function lineOfSight(s, a, b) {
  const steps = Math.ceil(distance(a, b) * 3);
  for (let i = 1; i < steps; i++) {
    const x = a.x + (b.x - a.x) * i / steps, y = a.y + (b.y - a.y) * i / steps;
    if (s.terrain[cell(x, y)] === 2 || occupied(s, Math.floor(x), Math.floor(y))?.kind === 'wall') return false;
  }
  return true;
}

export function generate(s) {
  s.terrain = Array.from({ length: WIDTH * HEIGHT }, (_, i) => {
    const x = i % WIDTH, y = Math.floor(i / WIDTH);
    const ridge = (x === 39 || x === 40) && y > 5 && y < 42 && !(y >= 20 && y <= 24) && !(y >= 33 && y <= 35);
    const rocks = distance({ x, y }, { x: 21, y: 23 }) > 12 && random(s) < 0.06;
    return ridge || rocks ? 2 : y > 29 && y < 33 ? 3 : random(s) < 0.16 ? 1 : 0;
  });
  s.trails = new Array(WIDTH * HEIGHT).fill(0);
  s.explored = new Array(WIDTH * HEIGHT).fill(false);
  for (let i = 0; i < 65; i++) {
    const x = 3 + Math.floor(random(s) * (WIDTH - 6)), y = 3 + Math.floor(random(s) * (HEIGHT - 6));
    if (!walkable(s, x, y) || occupied(s, x, y) || s.nodes.some(n => cell(n.x, n.y) === cell(x, y))) continue;
    s.nodes.push({ id: s.nextId++, x: x + 0.5, y: y + 0.5, kind: i % 3 ? 'alloy' : 'biomass', amount: 150 + Math.floor(random(s) * 150) });
  }
  for (const [x, y, kind] of [[16, 21, 'alloy'], [18, 29, 'biomass'], [26, 25, 'alloy'], [23, 29, 'food']]) {
    s.terrain[cell(x, y)] = kind === 'food' ? 1 : 0;
    s.nodes.push({ id: s.nextId++, x: x + 0.5, y: y + 0.5, kind, amount: kind === 'food' ? 160 : 500 });
  }
}
