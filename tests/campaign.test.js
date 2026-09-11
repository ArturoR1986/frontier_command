import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { newGame, tick, place, placement, order, research, invite, train, activateSite, stocks } from '../src/simulation.js';
import { setDuty, setCharter, assignHome } from '../src/community.js';
import { serialize, deserialize } from '../src/save.js';
import { cell, distance } from '../src/world.js';

test('complete basin campaign uses real economy, expeditions, construction and persistent rewards', async () => {
  let s = newGame(1986); const report = [];
  const until = (predicate, seconds, label) => { for (let i = 0; i < seconds * 4 && !predicate(); i++) tick(s, 0.25); assert.ok(predicate(), `${label}: ${JSON.stringify({ time: s.time, stocks: stocks(s), people: s.people.map(p => [p.name, Math.round(p.hp), p.activity]), events: s.events.slice(-3) })}`); };
  const build = (kind, x, y) => {
    const spots = [];
    for (let yy = 14; yy < 31; yy++) for (let xx = 12; xx < 34; xx++) if (!placement(s, kind, xx, yy)) spots.push({ x: xx, y: yy });
    spots.sort((a, b) => distance(a, { x, y }) - distance(b, { x, y })); assert.ok(spots.length);
    const b = place(s, kind, spots[0].x, spots[0].y); until(() => b.complete, 600, `${kind} construction`); return b;
  };
  build('habitat', 24, 20); build('farm', 24, 27); build('generator', 28, 20); build('commons', 18, 18);
  build('workshop', 28, 25); build('barracks', 24, 17); build('turret', 28, 23); build('turret', 18, 23);
  until(() => stocks(s).alloy >= 45, 300, 'research supplies'); assert.ok(research(s, 'armor')); until(() => !s.research, 120, 'armor');
  while (s.people.length < 7) { until(() => stocks(s).food >= 20, 300, 'arrival food'); assert.ok(invite(s)); }
  const homes = s.buildings.filter(b => ['hub', 'habitat'].includes(b.kind));
  s.people.forEach((p, i) => assignHome(s, p.id, homes[Math.floor(i / 4)].id));
  until(() => stocks(s).alloy >= 60, 300, 'field equipment');
  const team = s.people.filter(p => p.role !== 'Grower').slice(0, 4).map(p => p.id); assert.ok(train(s, team));
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/campaign-prepared.json', serialize(s));
  report.push({ phase: 'Prepared settlement', time: s.time, stock: stocks(s), team });
  for (const kind of ['water', 'archive', 'signal']) {
    let site = s.sites.find(t => t.kind === kind);
    setDuty(s, team, true); assert.ok(order(s, team, 'move', { x: site.x - 2, y: site.y + 2 }));
    until(() => s.explored[cell(site.x, site.y)] && s.people.filter(p => team.includes(p.id)).every(p => !p.job), 180, `${kind} expedition`);
    assert.ok(activateSite(s, site.id), `${kind} activation`);
    if (site.guards) {
      await writeFile(`artifacts/campaign-${kind}-contact.json`, serialize(s));
      until(() => !s.hostiles.some(h => h.site === site.id), 240, `${kind} combat`);
      assert.ok(activateSite(s, site.id), `${kind} restoration blueprint`);
    }
    setDuty(s, team, false);
    until(() => site.restored, 900, `${kind} restoration`);
    assert.ok(s.people.length >= 4, 'Expedition preserves a viable community');
    report.push({ phase: `${kind} restored`, time: s.time, people: s.people.length, treated: s.community.treated, stock: stocks(s) });
    s = deserialize(serialize(s)); site = s.sites.find(t => t.kind === kind); assert.ok(site.restored);
  }
  setCharter(s, 'recovery');
  until(() => s.community.achievement, 600, 'Independent basin');
  const completedAt = s.time;
  s = deserialize(serialize(s)); for (let i = 0; i < 240; i++) tick(s, 0.25);
  assert.ok(s.community.achievement && s.time > completedAt);
  report.push({ phase: 'Independent basin and continued play', time: s.time, community: s.community });
  await writeFile('artifacts/campaign-complete.json', serialize(s));
  await writeFile('artifacts/campaign-report.json', JSON.stringify(report, null, 2));
});
