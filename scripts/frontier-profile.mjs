import { performance } from 'node:perf_hooks';
import os from 'node:os';
import { newWorld, makePerson, makeMachine, makeBuilding, step } from '../src/frontier/engine.js';
const results = [];
for (const size of [128, 256, 512]) {
  const start = performance.now(), w = newWorld(1986, size), generation = performance.now() - start;
  for (const f of w.factions) {
    f.ai = false; const r = w.regions.find(r => r.id === f.home);
    for (let i = 4; i < 100; i++) makePerson(w, f.id, r.id, r.start.x - 5 - i % 10, r.start.y + Math.floor(i / 10), i);
    for (let i = 0; i < 40; i++) makeMachine(w, f.id, r.id, i % 3 ? 'guard' : 'artillery', r.start.x - 8 - i % 5, r.start.y - 5 - Math.floor(i / 5));
    for (let i = 0; i < 8; i++) makeMachine(w, f.id, r.id, 'hauler', r.start.x + 10, r.start.y + i);
    for (let i = 1; i < 250; i++) makeBuilding(w, r, f.id, 'floor', 5 + i % 25, 5 + Math.floor(i / 25), true);
  }
  const timings = [];
  for (let i = 0; i < 100; i++) { const t = performance.now(); step(w, .1); timings.push(performance.now() - t); }
  timings.sort((a, b) => a - b);
  results.push({ size, generationMs: +generation.toFixed(1), p95TickMs: +timings[95].toFixed(2), maxTickMs: +timings[99].toFixed(2), heapMB: +(process.memoryUsage().heapUsed / 1048576).toFixed(1), serializedMB: +(JSON.stringify(w).length / 1048576).toFixed(1) });
}
console.log(JSON.stringify({ hardware: { cpu: os.cpus()[0].model, logicalCores: os.cpus().length, memoryGB: +(os.totalmem() / 1073741824).toFixed(1), node: process.version, platform: process.platform }, fixture: '18 regions, 4 colonies, 400 people, 160 robots, 32 uncrewed vehicles, 1000 structures. 10 simulated seconds. No active wars; not the final load/soak qualification.', results }, null, 2));
