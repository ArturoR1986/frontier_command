import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { deserialize, serialize } from '../src/save.js';
const { chromium } = await import(process.env.PLAYWRIGHT_PATH ? pathToFileURL(process.env.PLAYWRIGHT_PATH).href : 'playwright');
const server = spawn(process.execPath, ['scripts/serve.mjs', '--dist'], { stdio: 'pipe', env: { ...process.env, PORT: '4177' } });
let browser;
try {
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [], report = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:4177'); await page.locator('#new-game').click();
  async function loadFile(path) { await page.locator('#menu').click(); await page.locator('#save-file').setInputFiles(path); await page.waitForFunction(() => !document.getElementById('welcome').open); }
  const care = deserialize(await readFile('artifacts/campaign-prepared.json', 'utf8'));
  // Controlled aftermath fixture: preserves a genuinely constructed settlement;
  // injury injection isolates treatment/recovery, not claimed as combat damage.
  for (const p of care.people) { p.caregiver = false; p.job = null; p.direct = false; p.cargo = null; }
  care.people[0].hp = 42; care.people[0].wounded = true; care.people[0].x = 20.5; care.people[0].y = 22.5;
  care.people[2].x = 20.5; care.people[2].y = 24.5; care.settings.speed = 4;
  await writeFile('artifacts/care-fixture.json', serialize(care));
  await loadFile('artifacts/care-fixture.json');
  await page.locator('#community').click();
  await page.locator('[data-charter="recovery"]').click();
  await page.locator('[data-care]').nth(2).click();
  await page.screenshot({ path: 'artifacts/care-organization.png' });
  await page.locator('#close-community').click();
  await page.waitForFunction(() => window.frontier.snapshot().people.some(p => p.cargo?.purpose === 'care'), { timeout: 20000 });
  await page.locator('#save').click(); await page.reload(); await page.locator('#continue').click();
  await page.screenshot({ path: 'artifacts/care-in-transit.png' });
  await page.waitForFunction(() => window.frontier.snapshot().community.treated > 0, { timeout: 30000 });
  const healed = await page.evaluate(() => window.frontier.snapshot());
  if (healed.people[0].wounded) throw new Error('Treatment did not restore capability');
  report.push({ scenario: 'Care organization, provision transit, save/reload, treatment', fixture: 'Controlled injury in played settlement', treated: healed.community.treated, memories: healed.people[0].memories });
  await loadFile('artifacts/campaign-archive-contact.json');
  await page.locator('#speed').click(); await page.locator('#speed').click();
  await page.locator('#community').click(); await page.locator('[data-site-focus]').nth(1).click();
  await page.screenshot({ path: 'artifacts/expedition-contact.png' });
  await page.waitForFunction(() => !window.frontier.snapshot().hostiles.some(h => h.site), { timeout: 60000 });
  await page.locator('#community').click(); await page.locator('[data-site]').nth(1).click();
  await page.locator('#community').click();
  while (await page.getByRole('button', { name: 'Release to civilian work' }).count()) await page.getByRole('button', { name: 'Release to civilian work' }).first().click();
  await page.locator('#close-community').click();
  await page.waitForFunction(() => window.frontier.snapshot().sites[1].restored, { timeout: 60000 });
  await page.screenshot({ path: 'artifacts/expedition-restored.png' });
  report.push({ scenario: 'Prepared field team, defenders, release, delivery and station restoration', time: await page.evaluate(() => window.frontier.snapshot().time) });
  await loadFile('artifacts/campaign-complete.json'); await page.locator('#pause').click(); await page.locator('#fit').click();
  await page.screenshot({ path: 'artifacts/community-colony.png' });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.locator('#community').click(); await page.screenshot({ path: 'artifacts/community-1280.png' }); await page.locator('#close-community').click();
  if (errors.length || await page.locator('#fatal').isVisible()) throw new Error(errors.join('\n') || 'Fatal panel');
  await writeFile('artifacts/community-playtest.json', JSON.stringify({ passed: true, report, errors }, null, 2));
  console.log('Community and expedition browser playtest passed.');
} finally { if (browser) await browser.close(); server.kill(); }
