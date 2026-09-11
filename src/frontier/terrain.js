// Deterministic region geometry. Runtime navigation caches are deliberately not saved.
export const hash = (x, y, seed) => { let n = Math.imul(x + 374761393, 668265263) ^ Math.imul(y + seed, 1274126177); n = Math.imul(n ^ n >>> 13, 1274126177); return ((n ^ n >>> 16) >>> 0) / 4294967296; };
const smooth = n => n * n * (3 - 2 * n);
function noise(x, y, seed, scale) {
  const ix = Math.floor(x / scale), iy = Math.floor(y / scale), fx = smooth(x / scale - ix), fy = smooth(y / scale - iy);
  const a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed), c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}
export function generateTerrain(seed, size = 256) {
  const terrain = new Uint8Array(size * size), fertility = new Uint8Array(size * size);
  const cx = Math.floor(size * 0.32), cy = Math.floor(size * 0.5);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x, h = noise(x, y, seed, 33) * 0.7 + noise(x, y, seed + 9, 12) * 0.3;
    const river = size * 0.64 + Math.sin(y / 22 + seed) * 10;
    terrain[i] = h > 0.64 ? 2 : Math.abs(x - river) < 3 && y % 64 > 7 ? 3 : h < 0.30 ? 1 : 0;
    if (Math.hypot(x - cx, y - cy) < 15 || y < 4 || y >= size - 4 || x < 4 || x >= size - 4) terrain[i] = 0;
    fertility[i] = Math.round(45 + 55 * noise(x, y, seed + 32, 20));
  }
  return { terrain: Array.from(terrain), fertility: Array.from(fertility), start: { x: cx, y: cy } };
}
export const tile = (r, x, y) => Math.floor(y) * r.size + Math.floor(x);
export const inside = (r, x, y) => Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x < r.size && y < r.size;
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export function footprint(b, defs) { const d = defs[b.kind]; return { x: b.x + d.w / 2, y: b.y + d.h / 2 }; }
export function blockedGrid(r, defs, faction) {
  const grid = Uint8Array.from(r.terrain, t => t >= 2 ? 1 : 0);
  for (const b of r.buildings) {
    const d = defs[b.kind];
    if (b.hp <= 0 || d.pass && (b.kind !== 'door' || b.faction === faction)) continue;
    for (let y = b.y; y < b.y + d.h; y++) for (let x = b.x; x < b.x + d.w; x++) grid[tile(r, x, y)] = 1;
  }
  return grid;
}
const caches = new WeakMap();
const components = new WeakMap();
function labelsFor(grid, n) {
  if (components.has(grid)) return components.get(grid);
  const labels = new Uint32Array(grid.length), queue = new Int32Array(grid.length); let label = 0;
  for (let start = 0; start < grid.length; start++) {
    if (grid[start] || labels[start]) continue; label++; let head = 0, tail = 1; queue[0] = start; labels[start] = label;
    while (head < tail) { const i = queue[head++], x = i % n, y = Math.floor(i / n); for (const j of [x ? i - 1 : -1, x < n - 1 ? i + 1 : -1, y ? i - n : -1, y < n - 1 ? i + n : -1]) if (j >= 0 && !grid[j] && !labels[j]) { labels[j] = label; queue[tail++] = j; } }
  }
  components.set(grid, labels); return labels;
}
function gridFor(r, defs, faction) {
  let c = caches.get(r);
  if (!c || c.version !== r.topology) { c = { version: r.topology, grids: {} }; caches.set(r, c); }
  return c.grids[faction] ||= blockedGrid(r, defs, faction);
}
export function walkable(r, x, y, defs, faction) { return inside(r, x, y) && !gridFor(r, defs, faction)[tile(r, x, y)]; }
// Fast connectivity query for job selection. Reuses topology component labels;
// a large number of unreachable jobs must not keep crowding out useful work.
export function reachable(r,from,target,defs,faction,adjacent=true){
  if(!inside(r,from.x,from.y)||!inside(r,target.x,target.y))return false;
  const labels=labelsFor(gridFor(r,defs,faction),r.size),component=labels[tile(r,from.x,from.y)];if(!component)return true;
  const d=defs[target.kind],w=d?.w||1,h=d?.h||1,x=Math.floor(target.x),y=Math.floor(target.y),edge=adjacent?1:0;
  for(let yy=y-edge;yy<y+h+edge;yy++)for(let xx=x-edge;xx<x+w+edge;xx++)if(inside(r,xx,yy)&&Math.max(0,x-xx,xx-(x+w-1))+Math.max(0,y-yy,yy-(y+h-1))<=edge&&labels[yy*r.size+xx]===component)return true;return false;
}
// A* with binary heap and Manhattan heuristic; targets can be multi-cell footprints.
export function route(r, from, target, defs, faction, adjacent = false, flying = false) {
  if (!inside(r, from.x, from.y) || !inside(r, target.x, target.y)) return null;
  if (flying) {
    const end = { x: Math.floor(target.x) + 0.5, y: Math.floor(target.y) + 0.5 }, count = Math.max(1, Math.ceil(distance(from, end) / 3));
    return Array.from({ length: count }, (_, i) => ({ x: from.x + (end.x - from.x) * (i + 1) / count, y: from.y + (end.y - from.y) * (i + 1) / count }));
  }
  const d = target.kind && defs[target.kind], w = d?.w || 1, h = d?.h || 1;
  const tx = Math.floor(target.x), ty = Math.floor(target.y), n = r.size, grid = gridFor(r, defs, faction);
  const labels = labelsFor(grid, n), component = labels[tile(r, from.x, from.y)];
  if (component) {
    let connected = false;
    for (let yy = ty - (adjacent ? 1 : 0); yy < ty + h + (adjacent ? 1 : 0); yy++) for (let xx = tx - (adjacent ? 1 : 0); xx < tx + w + (adjacent ? 1 : 0); xx++) {
      const d = Math.max(0, tx - xx, xx - (tx + w - 1)) + Math.max(0, ty - yy, yy - (ty + h - 1));
      if (inside(r, xx, yy) && d <= (adjacent ? 1 : 0) && labels[yy * n + xx] === component) connected = true;
    }
    if (!connected) return null;
  }
  const heuristic = (x, y) => Math.max(0, tx - x, x - (tx + w - 1)) + Math.max(0, ty - y, y - (ty + h - 1));
  const start = tile(r, from.x, from.y), g = new Map([[start, 0]]), prev = new Map(), heap = [];
  function push(i, f) { let k = heap.length; heap.push([i, f]); while (k) { const p = (k - 1) >> 1; if (heap[p][1] <= f) break; heap[k] = heap[p]; k = p; } heap[k] = [i, f]; }
  function pop() { const a = heap[0], z = heap.pop(); if (heap.length) { let k = 0; while (k * 2 + 1 < heap.length) { let j = k * 2 + 1; if (j + 1 < heap.length && heap[j + 1][1] < heap[j][1]) j++; if (heap[j][1] >= z[1]) break; heap[k] = heap[j]; k = j; } heap[k] = z; } return a[0]; }
  push(start, heuristic(Math.floor(from.x), Math.floor(from.y)));
  const closed = new Set(); let found = -1;
  while (heap.length) {
    const i = pop(); if (closed.has(i)) continue; closed.add(i);
    const x = i % n, y = Math.floor(i / n), dist = heuristic(x, y);
    if ((!adjacent && dist === 0 || adjacent && dist <= 1) && (!grid[i] || i === start)) { found = i; break; }
    for (const j of [x > 0 ? i - 1 : -1, x < n - 1 ? i + 1 : -1, y > 0 ? i - n : -1, y < n - 1 ? i + n : -1]) {
      if (j < 0 || grid[j] || closed.has(j)) continue;
      const cost = g.get(i) + (r.terrain[j] === 1 ? 1.6 : 1);
      if (cost >= (g.get(j) ?? Infinity)) continue;
      g.set(j, cost); prev.set(j, i); push(j, cost + heuristic(j % n, Math.floor(j / n)));
    }
  }
  if (found < 0) return null;
  const path = []; for (let i = found; i !== start; i = prev.get(i)) path.push({ x: i % n + 0.5, y: Math.floor(i / n) + 0.5 });
  return path.reverse();
}
export function sight(r, a, b, defs, targetId = null) {
  const len = Math.ceil(distance(a, b) * 2);
  for (let step = 1; step < len; step++) {
    const x = Math.floor(a.x + (b.x - a.x) * step / len), y = Math.floor(a.y + (b.y - a.y) * step / len);
    if (!inside(r, x, y) || r.terrain[tile(r, x, y)] === 2) return false;
    if (r.buildings.some(o => o.id !== targetId && o.hp > 0 && o.complete && o.kind === 'wall' && x === o.x && y === o.y)) return false;
  }
  return true;
}
