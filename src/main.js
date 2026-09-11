import { BUILDINGS, UPGRADES, WIDTH, HEIGHT } from './catalog.js';
import { newGame, tick, stocks, capacity, order, place, remove, research, train, invite, objective } from './simulation.js';
import { serialize, deserialize } from './save.js';
import { render, zoom, screenToWorld, worldToScreen, GLYPHS } from './render.js';
import { occupied, distance, center } from './world.js';
import { AudioLayer } from './audio.js';

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
let state = newGame(), paused = false, started = false, last = performance.now(), accumulator = 0, lastUI = 0, autosave = 0, lastEvent = '';
const ui = { view: { x: 22, y: 24, scale: 32, width: 800, height: 600 }, selected: [], build: null, mouse: null, drag: null, marker: null };
const keys = new Set(), audio = new AudioLayer(), canvas = $('world');
function fatal(error) { paused = true; $('fatal').hidden = false; $('fatal').querySelector('pre').textContent = error?.stack || String(error); }
window.addEventListener('error', e => fatal(e.error || e.message));
window.addEventListener('unhandledrejection', e => fatal(e.reason));
function notify(text) { $('notice').textContent = text; clearTimeout(notify.timer); notify.timer = setTimeout(() => { $('notice').textContent = ''; }, 5500); }
function fit() { ui.view.x = 22.5; ui.view.y = 24; ui.view.scale = Math.min(36, Math.max(22, ui.view.width / 29)); }
function save(slot = 'frontier-command-save') {
  try { localStorage.setItem(slot, serialize(state)); if (slot.endsWith('-save')) notify('Colony saved on this browser. Export a file for a portable backup.'); return true; }
  catch (e) { notify(`Could not save: ${e.message}. Use Export save.`); return false; }
}
function load() {
  try { const text = localStorage.getItem('frontier-command-save') || localStorage.getItem('frontier-command-auto'); if (!text) throw new Error('No saved colony on this browser.'); applySave(deserialize(text)); notify('Colony restored. Work and cargo continue.'); }
  catch (e) { notify(e.message); }
}
function applySave(next) { state = next; started = true; paused = false; accumulator = 0; ui.selected = []; ui.build = null; audio.volume = state.settings.volume; $('welcome').close(); fit(); updateUI(); }
function select(id, add = false) { ui.selected = add ? ui.selected.includes(id) ? ui.selected.filter(i => i !== id) : [...ui.selected, id] : [id]; audio.tone(); updateUI(); }
function hit(p) {
  return state.people.find(q => distance(p, q) < 0.65) || state.hostiles.find(q => distance(p, q) < 0.65) || occupied(state, Math.floor(p.x), Math.floor(p.y)) || state.nodes.find(q => q.amount > 0 && distance(p, q) < 0.65);
}
function bar(label, value) { return `<div><div class="bar-label">${label}<span>${Math.round(value)}%</span></div><div class="bar"><i style="width:${Math.max(0, Math.min(100, value))}%"></i></div></div>`; }
function updateUI() {
  const stock = stocks(state);
  $('stocks').innerHTML = [['◇', 'ALLOY', Math.floor(stock.alloy)], ['♧', 'BIOMASS', Math.floor(stock.biomass)], ['◒', 'FOOD', Math.floor(stock.food)], ['ϟ', 'POWER', `${state.power.used}/${state.power.supply}`]].map(([icon, name, value]) => `<div class="metric"><small>${name}</small><i>${icon}</i>${value}</div>`).join('');
  const dayPart = state.time % 600;
  $('day').textContent = `DAY ${Math.floor(state.time / 600) + 1} · ${dayPart < 200 ? 'MORNING' : dayPart < 400 ? 'AFTERNOON' : 'NIGHT'} · ${Math.floor(state.time / 60)}:${String(Math.floor(state.time % 60)).padStart(2, '0')}`;
  $('pause').textContent = paused ? '▶' : 'Ⅱ'; $('pause').title = paused ? 'Resume (Space)' : 'Pause (Space)';
  $('speed').textContent = `${state.settings.speed}×`;
  $('objective').textContent = objective(state); $('objective').hidden = !state.settings.guide;
  $('population').textContent = `${state.people.length} / ${capacity(state)}`;
  $('roster').innerHTML = state.people.map(p => `<button class="person ${ui.selected.includes(p.id) ? 'active' : ''}" data-person="${p.id}"><span class="portrait" style="--person:${escape(p.color)}">${p.ranger ? '♟' : '♙'}</span><span><strong>${escape(p.name)}</strong> <span class="role">${escape(p.role)}</span><span class="task">${escape(p.activity)}</span></span><span class="hp">${Math.ceil(p.hp)}♥</span></button>`).join('');
  $('invite').disabled = state.people.length >= Math.min(16, capacity(state)) || stock.food < 20 || state.time < 120;
  const selected = [...state.people, ...state.buildings, ...state.nodes, ...state.hostiles].find(p => ui.selected.includes(p.id));
  $('selection-count').textContent = ui.selected.length ? `${ui.selected.length} SELECTED` : '';
  let html = '<h3>Your first foothold.</h3><p>Select a settler or a structure to inspect it. Work continues autonomously; direct orders take priority.</p>';
  if (selected?.name && state.people.includes(selected)) {
    const p = selected;
    html = `<h3>${escape(p.name)}</h3><p>${escape(p.role)} · ${escape(p.trait)}${p.ranger ? ' · Ranger kit' : ''}</p><p>${escape(p.activity)}${p.direct ? ' · DIRECT ORDER' : ''}${p.cargo ? `<br>Carrying ${p.cargo.amount} ${p.cargo.kind}` : ''}</p><div class="bars">${bar('Health', p.hp)}${bar('Food', p.hunger)}${bar('Rest', p.rest)}${bar('Morale', p.morale)}</div><p>Work priorities · 1 highest · 0 disabled</p><div class="priorities">${Object.entries(p.priorities).map(([k, v]) => `<button data-priority="${k}" title="Cycle ${k} priority">${k} ${v}</button>`).join('')}</div><div class="actions"><button data-action="stop">Stop orders [X]</button><button data-action="train">Train ranger · 12 alloy</button><button data-action="focus">Focus</button></div>`;
  } else if (selected && BUILDINGS[selected.kind]) {
    const b = selected, d = BUILDINGS[b.kind];
    html = `<h3>${d.name}</h3><p>${d.description}</p><p>${b.complete ? d.demand ? b.powered ? '● ONLINE' : 'ϟ OFFLINE · Check supply and 11-tile range' : '● OPERATIONAL' : `${b.progress < 5 ? 'Blueprint / material delivery' : b.progress < 25 ? 'Foundation' : b.progress < 60 ? 'Frame' : 'Systems'} · ${Math.floor(b.progress)}%`}</p>${bar('Integrity', b.hp / d.hp * 100)}${!b.complete ? `<p>Delivered: ${b.delivered.alloy}/${d.alloy} alloy · ${b.delivered.biomass}/${d.biomass} biomass</p>` : ''}${['hub', 'depot'].includes(b.kind) ? `<p>Stored here: ${b.inventory.alloy} alloy · ${b.inventory.biomass} biomass · ${b.inventory.food} food</p>` : ''}${b.kind === 'farm' ? `<p>Crop growth ${Math.floor(b.growth)}% · ${b.tended > 0 ? 'Tended' : 'Awaiting grower'}</p>` : ''}<div class="actions"><button data-action="focus">Focus</button>${b.kind !== 'hub' ? `<button data-action="remove">${b.complete ? 'Dismantle · 50% salvage' : 'Cancel · recover materials'}</button>` : ''}</div>`;
    if (b.kind === 'workshop' && b.complete) html += `<p>${state.research ? `Researching ${UPGRADES[state.research.kind].name} · ${Math.floor(state.research.progress / 90 * 100)}%` : 'Choose what the colony needs next.'}</p><div class="actions">${Object.entries(UPGRADES).map(([k, u]) => `<button data-research="${k}" title="${u.description}" ${state.upgrades.includes(k) || state.research || !b.powered || stock.alloy < u.cost ? 'disabled' : ''}>${u.name}${state.upgrades.includes(k) ? ' ✓' : ` · ${u.cost} alloy`}</button>`).join('')}</div>`;
  } else if (selected?.amount !== undefined) html = `<h3>${selected.kind === 'alloy' ? 'Mineral outcrop' : selected.kind === 'food' ? 'Edible basin shrubs' : 'Scrub biomass'}</h3><p>${selected.amount} ${selected.kind} remaining.</p><p>Select settlers, then right-click here to gather. Cargo must reach a depot before it becomes available.</p>`;
  else if (selected) html = `<h3>Basin scavenger</h3><p>${selected.retreat ? 'Retreating' : 'Approaching the settlement'} · ${Math.ceil(selected.hp)} health</p><p>Select Kei and right-click this contact to engage.</p>`;
  $('inspection').innerHTML = html;
  $('phase').textContent = state.threat.phase;
  $('threat').innerHTML = `<div class="exposure"><strong>${state.threat.exposure}</strong><span>EXPOSURE</span></div><p class="muted">${Object.entries(state.threat.contributors).map(([k, v]) => `${k} ${v}`).join(' · ')}</p>${state.threat.warning ? `<div class="warning">⚠ ${state.threat.warning.count} contacts from the ${state.threat.warning.direction.toUpperCase()}<br>ETA ${Math.max(0, Math.ceil(state.threat.warning.arrival - state.time))}s · Rally Kei, check powered defenses.</div>` : `<p class="muted">${state.time < 1200 ? `Learning window · ${Math.ceil((1200 - state.time) / 60)} min of safe settlement building.` : state.hostiles.length ? `${state.hostiles.length} contacts in the basin. Protect your people.` : 'Listen to the horizon. Growth draws attention.'}</p>`}`;
  $('journal').innerHTML = [...state.events].reverse().slice(0, 5).map(e => `<div class="journal-entry"><time>${Math.floor(e.time / 60)}:${String(Math.floor(e.time % 60)).padStart(2, '0')}</time>${escape(e.text)}</div>`).join('');
  $('zoom-level').textContent = `${Math.round(ui.view.scale / 32 * 100)}%`;
  const latest = state.events.at(-1);
  if (latest && latest.text !== lastEvent) { lastEvent = latest.text; if (['warning', 'danger'].includes(latest.tone)) audio.tone('warning'); }
}
$('buildings').innerHTML = Object.entries(BUILDINGS).filter(([k]) => k !== 'hub').map(([k, b]) => `<button data-build="${k}" title="${b.name}: ${b.description}"><span class="glyph">${GLYPHS[k]}</span>${b.name.replace('Storage ', '').replace('Sentry ', '').replace('Hydro ', '').replace('Sensor Mast', 'Sensor')}<small>${b.alloy} A · ${b.biomass} B</small></button>`).join('');
$('buildings').addEventListener('click', e => { const b = e.target.closest('[data-build]'); if (!b) return; ui.build = b.dataset.build; for (const button of $('buildings').children) button.classList.toggle('active', button === b); notify(`${BUILDINGS[ui.build].name}: click valid ground to place. Escape cancels.`); audio.tone(); });
$('roster').addEventListener('click', e => { const b = e.target.closest('[data-person]'); if (b) select(Number(b.dataset.person), e.shiftKey); });
$('inspection').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const selected = [...state.people, ...state.buildings].find(p => ui.selected.includes(p.id));
  if (b.dataset.priority && selected?.priorities) { const k = b.dataset.priority; selected.priorities[k] = (selected.priorities[k] + 1) % 5; }
  if (b.dataset.research) notify(research(state, b.dataset.research) ? 'Research started.' : 'Requires an idle powered workshop and enough alloy.');
  if (b.dataset.action === 'stop') order(state, ui.selected, 'stop', {});
  if (b.dataset.action === 'train') notify(train(state, ui.selected) ? 'Ranger equipment issued.' : 'Requires powered Barracks, untrained settlers and 12 alloy each.');
  if (b.dataset.action === 'remove') { remove(state, selected.id); ui.selected = []; }
  if (b.dataset.action === 'focus' && selected) { const p = BUILDINGS[selected.kind] ? center(selected) : selected; ui.view.x = p.x; ui.view.y = p.y; }
  updateUI();
});
canvas.addEventListener('pointerdown', e => {
  if (!started) return;
  audio.start(); canvas.focus(); canvas.setPointerCapture(e.pointerId);
  const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  if (e.button === 2) return;
  ui.drag = { x, y, currentX: x, currentY: y, pan: e.button === 1 || e.shiftKey, box: false, vx: ui.view.x, vy: ui.view.y, shift: e.shiftKey };
});
canvas.addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  ui.mouse = screenToWorld(ui.view, x, y);
  if (ui.drag) { const d = ui.drag; d.currentX = x; d.currentY = y; const moved = Math.hypot(x - d.x, y - d.y) > 5; if (d.pan && moved) { ui.view.x = d.vx - (x - d.x) / ui.view.scale; ui.view.y = d.vy - (y - d.y) / ui.view.scale; } else if (moved) d.box = true; }
});
canvas.addEventListener('pointerup', e => {
  if (!ui.drag) return;
  const d = ui.drag; ui.drag = null;
  if (d.pan && Math.hypot(d.currentX - d.x, d.currentY - d.y) > 5) return;
  const p = screenToWorld(ui.view, d.currentX, d.currentY);
  if (d.box) { ui.selected = state.people.filter(p => { const q = worldToScreen(ui.view, p.x, p.y); return q.x >= Math.min(d.x, d.currentX) && q.x <= Math.max(d.x, d.currentX) && q.y >= Math.min(d.y, d.currentY) && q.y <= Math.max(d.y, d.currentY); }).map(p => p.id); }
  else if (ui.build) { const b = place(state, ui.build, p.x, p.y); if (b) { select(b.id); audio.tone('build'); if (!e.shiftKey) cancelBuild(); } else notify(state.events.at(-1).text); }
  else { const target = hit(p); if (target) select(target.id, e.shiftKey); else ui.selected = []; }
  updateUI();
});
canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  if (ui.build) { cancelBuild(); return; }
  const r = canvas.getBoundingClientRect(), p = screenToWorld(ui.view, e.clientX - r.left, e.clientY - r.top), target = hit(p);
  const type = target && state.hostiles.includes(target) ? 'attack' : target && (state.nodes.includes(target) || state.buildings.includes(target)) ? 'work' : 'move';
  if (order(state, ui.selected, type, target && type !== 'move' ? target : p)) { ui.marker = { ...p, until: performance.now() + 1200 }; audio.tone(); notify(type === 'move' ? 'Move acknowledged.' : type === 'attack' ? 'Engage acknowledged.' : 'Work acknowledged.'); }
  else notify(state.events.at(-1).text);
  updateUI();
});
canvas.addEventListener('wheel', e => { e.preventDefault(); const r = canvas.getBoundingClientRect(); zoom(ui.view, e.deltaY > 0 ? 0.9 : 1.1, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
function cancelBuild() { ui.build = null; for (const b of $('buildings').children) b.classList.remove('active'); }
document.addEventListener('keydown', e => {
  if (e.target.matches('input') || $('welcome').open || $('help-dialog').open) return;
  const k = e.key.toLowerCase(); keys.add(k);
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
  if (e.repeat) return;
  if (k === ' ') paused = !paused;
  if (k === 'f') fit();
  if (k === '+' || k === '=') zoom(ui.view, 1.15);
  if (k === '-') zoom(ui.view, 1 / 1.15);
  if (k === 'escape') cancelBuild();
  if (k === 'x') order(state, ui.selected, 'stop', {});
  updateUI();
});
document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());
$('minimap').addEventListener('click', e => { const r = e.target.getBoundingClientRect(); ui.view.x = (e.clientX - r.left) / r.width * WIDTH; ui.view.y = (e.clientY - r.top) / r.height * HEIGHT; });
$('fit').onclick = fit; $('zoom-in').onclick = () => zoom(ui.view, 1.2); $('zoom-out').onclick = () => zoom(ui.view, 1 / 1.2);
$('pause').onclick = () => { paused = !paused; updateUI(); };
$('speed').onclick = () => { state.settings.speed = state.settings.speed === 1 ? 2 : state.settings.speed === 2 ? 4 : 1; updateUI(); };
$('save').onclick = () => save(); $('load').onclick = load;
$('invite').onclick = () => { notify(invite(state) ? 'A new settler has joined the colony.' : 'Needs a spare bed, 20 food and an established landing (2 minutes).'); updateUI(); };
$('menu').onclick = () => { $('resume').hidden = !started; $('welcome').showModal(); };
$('new-game').onclick = () => { if (started && !save('frontier-command-auto')) return; state = newGame(Number($('seed').value) >>> 0); started = true; paused = false; accumulator = 0; ui.selected = []; cancelBuild(); $('welcome').close(); audio.start(); fit(); updateUI(); };
$('continue').onclick = load; $('resume').onclick = () => $('welcome').close();
$('help').onclick = () => { $('volume').value = state.settings.volume; $('guide').checked = state.settings.guide; $('help-dialog').showModal(); };
$('close-help').onclick = () => $('help-dialog').close();
$('volume').oninput = e => { state.settings.volume = Number(e.target.value); audio.volume = state.settings.volume; audio.start(); audio.tone(); };
$('guide').onchange = e => { state.settings.guide = e.target.checked; updateUI(); };
$('export').onclick = () => { const url = URL.createObjectURL(new Blob([serialize(state)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = `frontier-command-day-${Math.floor(state.time / 600) + 1}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
$('import').onclick = () => $('save-file').click();
$('save-file').onchange = async e => { try { const file = e.target.files[0]; if (file) applySave(deserialize(await file.text())); } catch (error) { notify(error.message); } e.target.value = ''; };
document.addEventListener('visibilitychange', () => { last = performance.now(); accumulator = 0; });
function frame(now) {
  try {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const modal = $('welcome').open || $('help-dialog').open;
    if (!modal) {
      ui.view.x += ((keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0)) * dt * 18;
      ui.view.y += ((keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0)) * dt * 18;
      ui.view.x = Math.max(0, Math.min(WIDTH, ui.view.x)); ui.view.y = Math.max(0, Math.min(HEIGHT, ui.view.y));
    }
    if (started && !paused && !modal && !document.hidden) {
      accumulator += dt * state.settings.speed;
      while (accumulator >= 0.1) { tick(state, 0.1); accumulator -= 0.1; }
      audio.update(state);
      if (state.time - autosave >= 120) { autosave = state.time; save('frontier-command-auto'); }
    }
    render(canvas, $('minimap'), state, ui);
    if (now - lastUI > 350) { updateUI(); lastUI = now; }
    requestAnimationFrame(frame);
  } catch (error) { fatal(error); }
}
updateUI(); $('resume').hidden = true; $('welcome').showModal(); requestAnimationFrame(frame);
// Read-only snapshots support launch tests without exposing mutable game state.
window.frontier = { snapshot: () => structuredClone(state), view: () => ({ ...ui.view }), selected: () => [...ui.selected] };
