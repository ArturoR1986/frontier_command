import { performance } from 'node:perf_hooks';
import { cpus, platform, arch } from 'node:os';
import { mkdir, writeFile } from 'node:fs/promises';
import { newGame, building, person, tick, recompute, stocks } from '../src/simulation.js';
import { serialize } from '../src/save.js';
import { BUILDINGS } from '../src/catalog.js';
import { walkable, occupied } from '../src/world.js';
const s = newGame(2017);
s.explored.fill(true);
// A stress fixture, deliberately distinct from the no-injection gameplay test.
const types = ['habitat', 'farm', 'generator', 'depot', 'turret', 'workshop', 'sensor', 'barracks'];
for (let y = 3; y < 42 && s.buildings.length < 80; y += 4) for (let x = 3; x < 60 && s.buildings.length < 80; x += 4) {
  const kind = types[s.buildings.length % types.length], d = BUILDINGS[kind];
  let valid = true;
  for (let yy = y; yy < y + d.h; yy++) for (let xx = x; xx < x + d.w; xx++) if (!walkable(s, xx, yy) || occupied(s, xx, yy)) valid = false;
  if (valid) s.buildings.push(building(s, kind, x, y, true));
}
while (s.people.length < 16) { const p = person(s, s.people.length, 20.5, 22.5); p.ranger = true; s.people.push(p); }
for (const b of s.buildings) if (b.kind === 'depot') b.inventory = { alloy: 40, biomass: 25, food: 20 };
recompute(s);
const sizes = { people: s.people.length, buildings: s.buildings.length, map: '64x48' };
for (let i = 0; i < 400; i++) tick(s, 0.25);
if (global.gc) global.gc();
const heapStart = process.memoryUsage().heapUsed, durations = [], start = performance.now();
for (let i = 0; i < 14400; i++) { const begin = performance.now(); tick(s, 0.25); durations.push(performance.now() - begin); }
if (global.gc) global.gc();
const heapEnd = process.memoryUsage().heapUsed;
durations.sort((a, b) => a - b);
const result = { environment: { node: process.version, platform: platform(), arch: arch(), cpu: cpus()[0]?.model }, fixture: sizes, simulatedSeconds: 3600, wallMs: performance.now() - start, tickMs: { median: durations[Math.floor(durations.length * 0.5)], p95: durations[Math.floor(durations.length * 0.95)], p99: durations[Math.floor(durations.length * 0.99)], max: durations.at(-1) }, heap: { gcAvailable: Boolean(global.gc), startBytes: heapStart, endBytes: heapEnd, changeBytes: heapEnd - heapStart }, final: { time: s.time, people: s.people.length, buildings: s.buildings.length, stocks: stocks(s) } };
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/performance.json', JSON.stringify(result, null, 2));
await writeFile('artifacts/stress-colony.json', serialize(s));
console.log(JSON.stringify(result, null, 2));
if (result.tickMs.p99 > 16 || heapEnd - heapStart > 20_000_000) process.exitCode = 1;
