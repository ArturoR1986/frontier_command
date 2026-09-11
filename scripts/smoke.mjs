import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const moduleName = process.env.PLAYWRIGHT_PATH ? pathToFileURL(process.env.PLAYWRIGHT_PATH).href : 'playwright';
const { chromium } = await import(moduleName);
const server = spawn(process.execPath, ['scripts/serve.mjs', '--dist'], { stdio: 'pipe', env: { ...process.env, PORT: '4174' } });
let browser, page;
try {
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); server.once('exit', c => reject(new Error(`Server exited ${c}`))); });
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:4174');
  await page.getByRole('button', { name: 'Begin landing' }).click();
  await page.waitForFunction(() => window.frontier?.snapshot().time > 1);
  const start = await page.evaluate(() => window.frontier.snapshot());
  if (start.people.length !== 4 || start.buildings.length !== 1) throw new Error('Blank-shell regression');
  await page.locator('[data-person]').first().click();
  if (!(await page.evaluate(() => window.frontier.selected().length))) throw new Error('Selection failed');
  await page.getByRole('button', { name: 'Ⅱ', exact: true }).click();
  const before = await page.evaluate(() => window.frontier.snapshot().time);
  await page.waitForTimeout(350);
  if ((await page.evaluate(() => window.frontier.snapshot().time)) !== before) throw new Error('Pause failed');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Continue saved colony' }).click();
  const restored = await page.evaluate(() => window.frontier.snapshot());
  if (restored.time < before) throw new Error('Save continuity failed');
  const scale = await page.evaluate(() => window.frontier.view().scale);
  await page.locator('#zoom-in').click();
  if ((await page.evaluate(() => window.frontier.view().scale)) <= scale) throw new Error('Zoom failed');
  await page.getByRole('button', { name: 'Help', exact: true }).click();
  if (!(await page.locator('#help-dialog').isVisible())) throw new Error('Help did not open');
  await page.getByRole('button', { name: 'Return to basin' }).click();
  await page.locator('#pause').click();
  await page.locator('#fit').click();
  async function point(x, y) {
    const v = await page.evaluate(() => window.frontier.view());
    const r = await page.locator('#world').boundingBox();
    return { x: r.x + (x - v.x) * v.scale + v.width / 2, y: r.y + (y - v.y) * v.scale + v.height / 2 };
  }
  // Exercise real placement and command inputs, not a test-only mutation API.
  await page.locator('[data-build="habitat"]').click();
  let p = await point(25.2, 20.2); await page.mouse.move(p.x, p.y); await page.mouse.click(p.x, p.y);
  if (!(await page.evaluate(() => window.frontier.snapshot().buildings.some(b => b.kind === 'habitat')))) throw new Error('Building placement failed');
  await page.locator('[data-build="farm"]').click();
  p = await point(22, 23); await page.mouse.click(p.x, p.y);
  if ((await page.evaluate(() => window.frontier.snapshot().buildings.length)) !== 2) throw new Error('Invalid overlap accepted');
  await page.keyboard.press('Escape');
  await page.locator('[data-person]').first().click();
  await page.locator('[data-person]').nth(1).click({ modifiers: ['Shift'] });
  if ((await page.evaluate(() => window.frontier.selected().length)) !== 2) throw new Error('Group selection failed');
  p = await point(18.5, 23.5); await page.mouse.click(p.x, p.y, { button: 'right' });
  if ((await page.evaluate(() => window.frontier.snapshot().people.filter(p => p.direct && p.job?.type === 'move').length)) !== 2) throw new Error('Direct group movement failed');
  await page.keyboard.press('x');
  if ((await page.evaluate(() => window.frontier.snapshot().people.filter(p => p.direct).length))) throw new Error('Stop failed');
  const camera = await page.evaluate(() => window.frontier.view());
  await page.keyboard.down('d'); await page.waitForTimeout(200); await page.keyboard.up('d');
  if ((await page.evaluate(() => window.frontier.view().x)) <= camera.x) throw new Error('Pan failed');
  await page.locator('#fit').click();
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/launch-1440.png' });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.screenshot({ path: 'artifacts/launch-1280.png' });
  const midgame = await readFile('artifacts/midgame-colony.json', 'utf8');
  await page.evaluate(text => localStorage.setItem('frontier-command-save', text), midgame);
  await page.locator('#load').click();
  await page.locator('#pause').click();
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'artifacts/colony-normal.png' });
  for (let i = 0; i < 3; i++) await page.locator('#zoom-out').click();
  await page.screenshot({ path: 'artifacts/colony-far.png' });
  for (let i = 0; i < 6; i++) await page.locator('#zoom-in').click();
  await page.screenshot({ path: 'artifacts/colony-close.png' });
  // A failed load must leave the current playable state intact.
  const validTime = await page.evaluate(() => window.frontier.snapshot().time);
  await page.evaluate(() => localStorage.setItem('frontier-command-save', '{corrupt'));
  await page.locator('#load').click();
  if ((await page.evaluate(() => window.frontier.snapshot().time)) !== validTime) throw new Error('Corrupt save replaced current state');
  // Verify core intelligence remains on screen at the minimum supported desktop size.
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(200);
  const intelligence = await page.locator('#threat').boundingBox();
  if (!intelligence || intelligence.y + intelligence.height > 630) throw new Error('Critical intelligence panel is below the visible workspace');
  const stress = await readFile('artifacts/stress-colony.json', 'utf8');
  await page.evaluate(text => localStorage.setItem('frontier-command-save', text), stress);
  await page.locator('#load').click();
  await page.setViewportSize({ width: 1600, height: 1000 });
  for (let i = 0; i < 4; i++) await page.locator('#zoom-out').click();
  const frames = await page.evaluate(async () => {
    const times = []; let previous = performance.now();
    for (let i = 0; i < 240; i++) { await new Promise(requestAnimationFrame); const now = performance.now(); times.push(now - previous); previous = now; }
    return times.slice(10).sort((a, b) => a - b);
  });
  const browserPerformance = { frameMs: { median: frames[Math.floor(frames.length * 0.5)], p95: frames[Math.floor(frames.length * 0.95)], p99: frames[Math.floor(frames.length * 0.99)] }, population: await page.evaluate(() => window.frontier.snapshot().people.length), buildings: await page.evaluate(() => window.frontier.snapshot().buildings.length) };
  await writeFile('artifacts/browser-performance.json', JSON.stringify(browserPerformance, null, 2));
  if (browserPerformance.frameMs.p95 > 50) throw new Error(`Frame pacing below 20fps target: ${JSON.stringify(browserPerformance)}`);
  if (await page.locator('#fatal').isVisible()) throw new Error('Fatal panel visible');
  if (errors.length) throw new Error(errors.join('\n'));
  await writeFile('artifacts/smoke.json', JSON.stringify({ passed: true, checks: ['boot', 'new game', 'simulation running', 'roster selection', 'pause', 'save', 'reload', 'load', 'zoom', 'help', 'placement', 'overlap rejection', 'group selection', 'group move', 'stop', 'pan', 'midgame load', 'corrupt save rejection', 'far/normal/close', '1440x900', '1280x720'], errors }, null, 2));
  console.log('Browser smoke passed; screenshots in artifacts/.');
} catch (error) {
  if (page) {
    await page.screenshot({ path: 'artifacts/smoke-failure.png' });
    console.error(await page.evaluate(() => ({ dialogs: [...document.querySelectorAll('dialog')].map(d => [d.id, d.open]), fatal: document.getElementById('fatal').textContent, roster: document.getElementById('roster').getBoundingClientRect().toJSON() })));
  }
  throw error;
} finally { if (browser) await browser.close(); server.kill(); }
