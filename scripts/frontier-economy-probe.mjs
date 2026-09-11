import { performance } from 'node:perf_hooks';
import { mkdir, writeFile } from 'node:fs/promises';
import { newWorld, step, stock } from '../src/frontier/engine.js';
const w = newWorld(1986, 128), start = performance.now(), timeline = [], ticks = [];
for (const f of w.factions) f.ai = true;
let stopped = false;
for (let i = 0; i < 14400; i++) {
  const before = performance.now(); step(w, 2); ticks.push(performance.now() - before);
  if (i % 900 === 899) { const record = { hours: w.time / 3600, elapsedSeconds: Math.round((performance.now() - start) / 1000), colonies: w.factions.map(f => ({ id: f.id, tech: f.tech, buildings: w.regions.find(r => r.id === f.home).buildings.length, machines: w.entities.filter(e => e.faction === f.id && e.type !== 'person').length })) }; timeline.push(record); console.log(JSON.stringify(record)); }
  if (performance.now() - start > 55000) { stopped = true; break; }
}
ticks.sort((a, b) => a - b);
const report = { journeys: w.journeys.map(j=>({id:j.id,faction:j.faction,to:j.to,status:j.status,arrival:j.arrival})), regions: w.regions.map(r=>({id:r.id,owner:r.owner,occupation:r.occupation,buildings:r.buildings.map(b=>({kind:b.kind,faction:b.faction,complete:b.complete,active:b.active})),drops:r.drops})), accelerated: true, simulatedHours: w.time / 3600, stoppedAtWallBudget: stopped, p95TickMs: ticks[Math.floor(ticks.length * .95)], maxTickMs: ticks.at(-1), timeline, colonies: w.factions.map(f => ({ ...f, stock: stock(w.regions.find(r => r.id === f.home), f.id), buildings: w.regions.find(r => r.id === f.home).buildings.map(b => ({ kind: b.kind, complete: b.complete, active: b.active, delivered: b.delivered })), people: w.entities.filter(e => e.faction === f.id && e.type === 'person').map(e => ({ name: e.name, region:e.region, vehicle:e.vehicle, hunger:e.hunger, hp: e.hp, rest: e.rest, activity: e.activity, job: e.job })) })) };
await mkdir('artifacts', { recursive: true }); await writeFile('artifacts/frontier-economy-probe.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ report: 'artifacts/frontier-economy-probe.json', simulatedHours: report.simulatedHours, stoppedAtWallBudget: stopped, p95TickMs: report.p95TickMs, maxTickMs: report.maxTickMs }));
