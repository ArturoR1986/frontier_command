import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { placement } from '../src/simulation.js';
const { chromium } = await import(process.env.PLAYWRIGHT_PATH ? pathToFileURL(process.env.PLAYWRIGHT_PATH).href : 'playwright');
const server = spawn(process.execPath, ['scripts/serve.mjs', '--dist'], { stdio: 'pipe', env: { ...process.env, PORT: '4175' } });
let browser;
try {
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [], report = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:4175'); await page.locator('#new-game').click();
  await page.locator('#speed').click(); await page.locator('#speed').click();
  await mkdir('artifacts', { recursive: true });
  async function position(x, y) {
    const v = await page.evaluate(() => window.frontier.view()), r = await page.locator('#world').boundingBox();
    return { x: r.x + (x - v.x) * v.scale + v.width / 2, y: r.y + (y - v.y) * v.scale + v.height / 2 };
  }
  async function place(kind, x, y) {
    const snapshot = await page.evaluate(() => window.frontier.snapshot());
    const candidates = [];
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) candidates.push({ x: x + dx, y: y + dy });
    candidates.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    const valid = candidates.find(p => !placement(snapshot, kind, p.x, p.y));
    if (!valid) throw new Error(`No legal ground for ${kind}`);
    x = valid.x; y = valid.y;
    await page.locator(`[data-build="${kind}"]`).click(); const p = await position(x + 0.1, y + 0.1); await page.mouse.click(p.x, p.y);
    const s = await page.evaluate(() => window.frontier.snapshot());
    if (!s.buildings.some(b => b.kind === kind && b.x === x && b.y === y)) throw new Error(`UI placement rejected ${kind} at ${x},${y}: ${s.events.at(-1).text}`);
  }
  const actions = [
    [8, () => place('habitat', 24, 20)],
    [55, () => place('farm', 24, 27)],
    [110, () => place('generator', 28, 20)],
    [170, () => place('depot', 15, 23)],
    [250, () => place('workshop', 28, 26)],
    [330, () => place('sensor', 27, 18)],
    [410, () => place('turret', 18, 23)],
    [490, () => place('turret', 27, 24)],
    [580, async () => { await page.locator('#invite').click(); }],
    [670, async () => {
      const s = await page.evaluate(() => window.frontier.snapshot()), workshop = s.buildings.find(b => b.kind === 'workshop'); const p = await position(workshop.x + 1, workshop.y + 1); await page.mouse.click(p.x, p.y);
      await page.locator('[data-research="tools"]').click();
    }],
    [800, async () => { await page.locator('#save').click(); await page.locator('#load').click(); }]
  ];
  let action = 0, nextRecord = 0;
  const deadline = Date.now() + 450000;
  while (Date.now() < deadline) {
    const s = await page.evaluate(() => window.frontier.snapshot());
    if (s.time >= 1205) break;
    if (s.time >= nextRecord) {
      report.push({ time: s.time, people: s.people.length, buildings: s.buildings.map(b => ({ kind: b.kind, complete: b.complete })), phase: s.threat.phase, objective: await page.locator('#objective').textContent() });
      await page.screenshot({ path: `artifacts/opening-${Math.floor(nextRecord / 60)}min.png` });
      console.log(`Opening playtest: ${Math.floor(s.time / 60)} simulated minutes, ${s.people.length} people, ${s.buildings.filter(b => b.complete).length} structures.`);
      nextRecord += 240;
    }
    if (action < actions.length && s.time >= actions[action][0]) { await actions[action][1](); action++; }
    if (errors.length || await page.locator('#fatal').isVisible()) throw new Error(errors.join('\n') || 'Fatal UI visible');
    await page.waitForTimeout(500);
  }
  const final = await page.evaluate(() => window.frontier.snapshot());
  if (final.time < 1200 || final.people.length < 4 || !final.buildings.some(b => b.kind === 'workshop' && b.complete)) throw new Error(`Opening incomplete: ${final.time}s`);
  await page.screenshot({ path: 'artifacts/opening-20min.png' });
  await writeFile('artifacts/browser-opening.json', JSON.stringify({ passed: true, realBrowser: true, simulationSpeed: '4x user control', finalTime: final.time, errors, report }, null, 2));
  console.log('Real browser 20-minute opening playthrough passed.');
} finally { if (browser) await browser.close(); server.kill(); }
