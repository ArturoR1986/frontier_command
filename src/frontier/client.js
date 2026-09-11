import { STRUCTURES as B, TECH, MACHINES as M, ROLES, RESOURCES } from './catalog.js';
import { skillLevel } from './engine.js';
import { Renderer, ICONS } from './render.js';

const $ = id => document.getElementById(id), esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const cost = o => Object.entries(o).map(([k, n]) => `${n} ${k}`).join(' · ') || 'No materials';
const duration = seconds => seconds >= 3600 ? `${(seconds / 3600).toFixed(1)} h` : `${Math.ceil(seconds / 60)} min`;
const renderer = new Renderer($('map'), $('minimap'));
let view, selection = [], build = null, drag = null, box = null, currentRegion = null, lastTopology = -1, loading = false, lastPanel = '', selectedWorld = null;
let token = sessionStorage.getItem('frontier-key') || (new URLSearchParams(location.search).has('join') ? '' : localStorage.getItem('frontier-key')) || '';
let audioContext, volume = Number(localStorage.getItem('frontier-volume') || .12), noticeTimer, serial = Promise.resolve();
const categories = { home: ['stockpile', 'wall', 'door', 'floor', 'bed', 'table', 'field'], work: ['kitchen', 'clinic', 'workshop', 'laboratory', 'core'], industry: ['refinery', 'generator', 'garage', 'fabricator', 'turret', 'relay'] };
function sound(note = 440) { if (!volume) return; try { audioContext ||= new AudioContext(); const o = audioContext.createOscillator(), g = audioContext.createGain(); o.type = 'sine'; o.frequency.value = note; g.gain.setValueAtTime(volume * .18, audioContext.currentTime); g.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .15); o.connect(g); g.connect(audioContext.destination); o.start(); o.stop(audioContext.currentTime + .16); } catch {} }
function notice(text, bad = false) { $('notice').textContent = text; $('notice').className = `show${bad ? ' danger' : ''}`; clearTimeout(noticeTimer); noticeTimer = setTimeout(() => $('notice').className = '', 5500); sound(bad ? 180 : 620); }
async function api(path, data) { const res = await fetch(`/api/${path}`, { method: data ? 'POST' : 'GET', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(data ? { 'Content-Type': 'application/json' } : {}) }, body: data ? JSON.stringify(data) : undefined }); const result = await res.json(); if (!res.ok) throw new Error(result.error || 'Server unavailable'); return result; }
function send(command) {
  const request = { id: crypto.randomUUID().replaceAll('-', '_'), command: { region: currentRegion, ...command } };
  serial = serial.catch(() => {}).then(async () => {
    sessionStorage.setItem('frontier-pending', JSON.stringify(request));
    try { const result = await api('command', request); sessionStorage.removeItem('frontier-pending'); notice(result.message, !result.ok); await refresh(true); return result; }
    catch (e) { notice(`${e.message}. The order will be retried with its original receipt id.`, true); throw e; }
  }); return serial;
}
async function refresh(force = false) {
  if (!token || loading) return; loading = true;
  try {
    const next = await api(`state?region=${encodeURIComponent(currentRegion || '')}&terrain=${force || lastTopology < 0 ? 1 : 0}`);
    if (next.region.terrain) renderer.lastTerrain = '';
    if (!next.region.terrain && view?.region.id === next.region.id) { next.region.terrain = view.region.terrain; next.region.fertility = view.region.fertility; }
    const changed = !view || next.region.id !== view.region.id; if (changed) { renderer.center(next.region.start); selection = []; }
    if (!force && lastTopology !== next.region.topology) lastTopology = -1; else lastTopology = next.region.topology;
    view = next; currentRegion = view.region.id; $('connection').textContent = '● WORLD ONLINE'; $('fatal').hidden = true; updateUI();
  } catch (e) { $('connection').textContent = 'Reconnecting'; $('fatal').hidden = false; }
  finally { loading = false; }
}
function button(text, action, attrs = '', disabled = false) { return `<button data-action="${action}" ${attrs}${disabled ? ' disabled' : ''}>${text}</button>`; }
function meter(label, value, max = 100) { return `<div class="stat-label"><span>${label}</span><span>${Math.round(value || 0)} / ${max}</span></div><div class="meter"><i style="width:${Math.max(0, Math.min(100, value / max * 100))}%"></i></div>`; }
function picked() { return view && [...view.entities, ...view.region.buildings, ...view.region.nodes].find(e => e.id === selection[0]); }
function selectedUnits() { return view.entities.filter(e => selection.includes(e.id) && e.faction === view.faction.id && !e.vehicle && e.hp > 0); }
function updateUI() {
  const f = view.faction, r = view.region; $('colony-name').textContent = f.name.toUpperCase(); $('region-name').textContent = r.name; $('map-size').textContent = `${r.size} × ${r.size} HOME TERRAIN · REALM ${r.realm + 1}`;
  $('clock').textContent = `Day ${1 + Math.floor(view.time / 86400)} · ${Math.floor(view.time / 3600) % 24}:${String(Math.floor(view.time / 60) % 60).padStart(2, '0')}`;
  $('stocks').innerHTML = RESOURCES.filter(k => ['wood', 'stone', 'ore', 'food', 'meals'].includes(k) || view.stocks[k] > 0).map(k => `<span>${Math.floor(view.stocks[k])}<small>${k}</small></span>`).join('');
  $('domain').textContent = `${view.world.filter(r => r.owner === f.id).length} territories · ${view.roster.filter(e => e.hp > 0).length} people`;
  $('population').textContent = view.roster.filter(e => e.hp > 0).length;
  $('roster').innerHTML = view.roster.filter(e => e.hp > 0).slice(0, 8).map(e => `<button class="person-row ${selection.includes(e.id) ? 'active' : ''}" data-action="select-person" data-id="${e.id}"><span class="portrait">${esc(e.name[0])}</span><div><b>${esc(e.name)}</b><small>${esc(e.activity)}</small></div><small>${e.hp < 65 ? '✚' : e.vehicle ? 'CREW' : ''}</small></button>`).join('');
  const bs = r.buildings.filter(b => b.faction === f.id && b.hp > 0), done = kind => bs.some(b => b.kind === kind && b.complete);
  let title = 'Give each person a place to rest', text = 'Place beds near the hearth. Workers gather, carry materials and construct your plans.';
  if (done('bed')) { title = 'Make food reliable'; text = 'Choose fertile ground for a growing plot, then add a cookhouse. Assign growing and cooking in People & work.'; }
  if (done('field') && done('kitchen')) { title = 'Shape a productive home'; text = 'Shorten hauling with stockyards. Arrange bedrooms, gathering space and care. A workshop turns ore into parts.'; }
  if (done('workshop')) { title = 'Develop your own capabilities'; text = 'Build a study hall and assign a researcher. Tools, power and transport open new choices.'; }
  if (f.tech.includes('transport')) { title = 'The frontier is a choice'; text = 'Prepare trained crews, fuel and supplies. Compare an expedition with another investment at home.'; }
  if (f.subjectOf) { title = 'Your colony can recover'; text = 'Your people remain yours. Evacuate to unclaimed land, rebuild a hearth, or negotiate with the occupying colony.'; }
  $('objective').innerHTML = `<strong>${title}</strong>${text}`;
  $('journal').innerHTML = view.events.slice(-8).reverse().map(e => `<p class="${e.tone === 'danger' || e.tone === 'warning' ? 'danger' : ''}"><time>${duration(e.at)} into this world</time>${esc(e.text)}</p>`).join('');
  inspect(); buildMenu();
}
function buildMenu() {
  if (!view) return;
  $('buildings').innerHTML = categories[$('build-category').value].map(kind => { const d = B[kind], locked = d.tech && !view.faction.tech.includes(d.tech); return `<button class="build-card ${build === kind ? 'active' : ''}" data-action="plan" data-kind="${kind}" title="${esc(d.description)}${locked ? ` Requires ${TECH[d.tech].name}.` : ''}" ${locked ? 'disabled' : ''}><span class="icon">${ICONS[kind]}</span><b>${d.name}</b><small>${locked ? TECH[d.tech].name : cost(d.cost)}</small></button>`; }).join('');
}
function inspect() {
  const p = picked(), el = $('inspection');
  if (!p) { el.innerHTML = '<div class="eyebrow">INSPECTION</div><h2>A place worth keeping.</h2><p>Select a person to see their work and skills. Select resources to gather them, or choose a structure below to plan your home.</p>'; return; }
  if (selection.length > 1 && selectedUnits().length > 1) { el.innerHTML = `<div class="eyebrow">SELECTED GROUP</div><h2>${selectedUnits().length} units</h2><p>Right-click to move. Attack-move stops to engage targets. Ordinary movement is a retreat order.</p><div class="actions">${button('Mobilize', 'draft', 'data-value="1"')}${button('Civilian work', 'draft', 'data-value="0"')}${button('Attack-move', 'attack-mode')}${button('Stop', 'stop')}${button('Prepare journey', 'world')}</div>`; return; }
  const own = p.faction === view.faction.id;
  let html = `<div class="eyebrow">${p.type === 'person' ? 'A MEMBER OF YOUR COLONY' : p.type ? p.type.toUpperCase() : B[p.kind] ? 'STRUCTURE' : 'LOCAL RESOURCE'}</div><h2>${esc(p.name || B[p.kind]?.name || p.kind)}</h2>`;
  if (p.type === 'person') {
    html += `<p>${esc(p.trait || '')} · ${esc(p.specialty || '')}<br>${esc(p.activity || '')}</p>${meter('Health', p.hp)}${own ? meter('Food', p.hunger) + meter('Rest', p.rest) + meter('Belonging', p.belonging) : ''}`;
    if (own) {
      html += `<div class="actions">${button(p.drafted ? 'Return to work' : 'Mobilize', 'draft', `data-value="${p.drafted ? 0 : 1}"`)}${button('Priorities', 'people')}${button('Operator practice', 'training', `data-id="${p.id}" data-value="${p.training ? 0 : 1}"`)}</div>`;
      for (const key of [p.specialty, 'pilot', 'care'].filter((v, i, a) => a.indexOf(v) === i)) html += `<div class="detail-line"><span>${esc(key)}</span><b>Skill ${skillLevel(p, key).toFixed(1)}</b></div>`;
      const vehicles = view.entities.filter(v => v.type === 'vehicle' && v.faction === view.faction.id && !v.disabled && !v.journey);
      html += vehicles.map(v => button(`Board ${esc(v.name)}`, 'board', `data-vehicle="${v.id}"`)).join('');
      html += `<p class="muted">Pilot skill improves vehicle speed and firing cycle. Training competes with ordinary work.</p>`;
      html += (p.memories || []).slice(-3).map(m => `<p class="muted">${esc(m.text)}</p>`).join('');
      if (p.cargo) html += `<p>Carrying ${p.cargo.amount} ${p.cargo.kind}</p>`;
    }
  } else if (p.type) {
    const d = M[p.kind]; html += `<p>${d.description}</p>${meter('Hull', p.hp, p.maxHp)}<p>${esc(p.activity || '')}</p>`;
    if (own) { if (p.type === 'vehicle') html += `<div class="detail-line"><span>Fuel</span><b>${p.fuel.toFixed(1)} / 100</b></div><p>Crew: ${p.crew.map(id => esc(view.roster.find(e => e.id === id)?.name)).join(', ') || 'none'}</p><div class="actions">${button('Refuel', 'refuel', `data-id="${p.id}"`)}${button('Disembark', 'disembark', `data-id="${p.id}"`)}</div>`; html += `<div class="actions">${button('Attack-move', 'attack-mode')}${button('Journey', 'world')}${button('Stop', 'stop')}</div>`; }
  } else if (B[p.kind]) {
    const d = B[p.kind]; html += `<p>${d.description}</p>${meter('Integrity', p.hp, d.hp)}`;
    if (own) {
      html += `<p>${esc(p.active)}</p>`;
      if (!p.complete) html += meter('Construction', p.progress, d.work) + `<p class="muted">Delivered: ${cost(Object.fromEntries(Object.entries(d.cost).map(([k, n]) => [k, `${p.delivered[k] || 0}/${n}`])))}</p>`;
      if (d.storage) html += `<p class="muted">Stored here: ${cost(Object.fromEntries(Object.entries(p.inventory).filter(([, n]) => n > 0)))}</p>`;
      if (p.kind === 'laboratory' && p.complete) html += button('Choose research', 'research');
      if (p.kind === 'core') html += button(view.faction.recruiting ? 'Newcomer preparing' : 'Welcome a newcomer', 'recruit', '', Boolean(view.faction.recruiting)) + '<p class="muted">15 meals · 20 wood · spare bed · 30 minutes</p>';
      if (['garage', 'fabricator'].includes(p.kind) && p.complete) {
        html += Object.entries(M).filter(([, d]) => (p.kind === 'garage') === (d.type === 'vehicle')).map(([kind, d]) => `<p>${button(`Build ${d.name}`, 'queue', `data-id="${p.id}" data-kind="${kind}"`, !view.faction.tech.includes(d.tech))}<small>${cost(d.cost)} · ${duration(d.work)} labor</small></p>`).join('');
        if (p.queue.length) html += `<p>Queue: ${p.queue.map(q => M[q.kind].name).join(' → ')}</p>${meter('Production', p.work || 0, M[p.queue[0].kind].work)}${button('Cancel queue', 'cancel-queue', `data-id="${p.id}"`)}`;
      }
      if (d.recipe && p.complete) html += `<div class="actions">${button('Target − 10', 'bill', `data-id="${p.id}" data-amount="${Math.max(0, p.bill - 10)}"`)}${button(`Target ${p.bill} → +10`, 'bill', `data-id="${p.id}" data-amount="${p.bill + 10}"`)}</div>`;
      if (p.kind !== 'core') html += `<div class="actions">${button(p.complete ? 'Dismantle' : 'Cancel plan', 'remove', `data-id="${p.id}"`)}</div>`;
    }
  } else html += `<p>${p.amount} ${p.kind} remain.</p><p class="muted">Gathering produces physical cargo. Your total rises when it reaches storage.</p>${button(p.marked ? 'Release designation' : 'Gather this resource', 'designate', `data-id="${p.id}" data-clear="${p.marked ? 1 : 0}"`)}`;
  el.innerHTML = html;
}
function openPanel(kind, html) { lastPanel = kind; $('panel-content').innerHTML = html; if (!$('panel').open) $('panel').showModal(); renderer.keys.clear(); }
function peoplePanel() {
  openPanel('people', `<div class="eyebrow">PEOPLE & WORK</div><h2>Choose who your people become.</h2><p>1 is highest priority; 4 is lowest; — disables a task. Needs and treatment take precedence. Drafted people and vehicle crews leave their home jobs.</p><div style="overflow:auto"><table><thead><tr><th>Person</th>${ROLES.map(k => `<th>${k}</th>`).join('')}<th>State</th></tr></thead><tbody>${view.entities.filter(e => e.type === 'person' && e.faction === view.faction.id).map(e => `<tr><td>${esc(e.name)}<small>${esc(e.specialty)}</small></td>${ROLES.map(k => `<td>${button(e.priorities[k] || '—', 'priority', `data-id="${e.id}" data-skill="${k}" data-value="${(e.priorities[k] + 1) % 5}"`)}<small>${skillLevel(e, k).toFixed(1)}</small></td>`).join('')}<td>${esc(e.vehicle ? 'Vehicle crew' : e.activity)}</td></tr>`).join('')}</tbody></table></div><p class="muted">Numbers beneath priorities show persistent skill. Practice builds skill slowly. A more experienced operator makes an expensive vehicle more useful.</p>`);
}
function researchPanel() { openPanel('research', `<div class="eyebrow">RESEARCH & CAPABILITY</div><h2>Let the home support the frontier.</h2><p>A study hall and a researcher turn materials and sustained work into new capabilities. The colony remains useful while research proceeds.</p>${view.faction.research ? `<div class="journey">Studying ${TECH[view.faction.research.kind].name}${meter('Progress', view.faction.research.work, TECH[view.faction.research.kind].work)}</div>` : ''}<div class="cards">${Object.entries(TECH).map(([kind, d]) => `<article class="card"><h3>${d.name}</h3><p>${d.description}</p><small>${cost(d.cost)} · ${duration(d.work)} base research labor${d.requires ? `<br>Requires ${TECH[d.requires].name}` : ''}</small><div class="actions">${button(view.faction.tech.includes(kind) ? 'Completed' : 'Commission', 'start-research', `data-kind="${kind}"`, view.faction.tech.includes(kind) || Boolean(view.faction.research) || d.requires && !view.faction.tech.includes(d.requires))}</div></article>`).join('')}</div>`); }
function worldPanel() {
  selectedWorld ||= view.world.find(r => r.id !== currentRegion)?.id;
  openPanel('world', `<div class="eyebrow">WORLD & EXPEDITIONS</div><h2>Your home is one part of a larger world.</h2><p>Explore each home map locally. Expeditions take actual time across the world; compare the route before departure. Technology changes speed, capacity and terrain costs.</p><div class="split">${[0, 1].map(realm => `<div><h3>Realm ${realm + 1}</h3><div class="world-grid">${view.world.filter(r => r.realm === realm).map(r => `<button class="region-card ${r.id === selectedWorld ? 'selected' : ''}" data-action="region" data-id="${r.id}"><b>${esc(r.name)}</b><small>${esc(view.factions.find(f => f.id === r.owner)?.name || 'Unclaimed frontier')}</small><small>${r.resource.toUpperCase()} · ${r.occupation ? 'CONTESTED' : 'LAND'}</small></button>`).join('')}</div></div>`).join('')}</div><div class="split"><div><h3>Expedition from ${esc(view.region.name)}</h3><p>Destination: <b>${esc(view.world.find(r => r.id === selectedWorld)?.name)}</b></p><div>${view.entities.filter(e => e.faction === view.faction.id && e.hp > 0 && !e.vehicle && !e.journey).map(e => `<label class="crew-option"><input type="checkbox" name="party" value="${e.id}" ${selection.includes(e.id) ? 'checked' : ''}>${esc(e.name)} · ${e.type}${e.type === 'vehicle' ? ` · ${e.crew.length} crew` : ''}</label>`).join('')}</div></div><div><h3>Supplies to transport</h3><div class="cargo-grid">${['food', 'wood', 'stone', 'ore', 'parts', 'fuel'].map(k => `<label>${k}<input data-cargo="${k}" type="number" min="0" max="10000" value="0"></label>`).join('')}</div><div class="actions">${button('Calculate route', 'quote')}${button('Depart', 'depart')}</div><div id="quote-result" class="journey">Select a party and calculate its route. Civilians aboard vehicles travel with that vehicle.</div><div class="actions">${button('Inspect destination', 'inspect-region')}${button('Claim current region', 'claim')}</div></div></div><h3>Journeys</h3>${view.journeys.slice(-8).reverse().map(j => `<div class="journey">${esc(view.world.find(r => r.id === j.from)?.name)} → ${esc(view.world.find(r => r.id === j.to)?.name)}<br>${j.status === 'traveling' ? `${duration(Math.max(0, j.arrival - view.time))} remaining · ${j.quote.km.toFixed(0)} km` : 'Arrived; people and goods are at the destination.'}</div>`).join('') || '<p>No journeys yet. Develop the home at your own pace.</p>'}`);
}
function party() { return { region: currentRegion, destination: selectedWorld, ids: [...document.querySelectorAll('input[name="party"]:checked')].map(e => e.value), cargo: Object.fromEntries([...document.querySelectorAll('[data-cargo]')].map(e => [e.dataset.cargo, Number(e.value)])) }; }
function diplomacyPanel() {
  openPanel('diplomacy', `<div class="eyebrow">DIPLOMACY & DOMAIN</div><h2>Choose what kind of neighbor to be.</h2><p>${esc(view.policy.label)} These are prototype rules awaiting play review.</p><div class="cards">${view.factions.filter(f => f.id !== view.faction.id).map(f => { const treaty = view.treaties.find(t => t.parties.includes(f.id)); return `<article class="card"><h3>${esc(f.name)}</h3><p>${treaty ? `${treaty.kind}${treaty.effective > view.time ? ` · effective in ${duration(treaty.effective - view.time)}` : ''}` : 'Neutral relations'}</p><div class="actions">${button('Offer alliance', 'diplomatic', `data-other="${f.id}" data-kind="alliance"`)}${button('Offer peace', 'diplomatic', `data-other="${f.id}" data-kind="peace"`)}${button('Declare war', 'diplomatic', `data-other="${f.id}" data-kind="war"`)}</div></article>`; }).join('')}</div><h3>Offers</h3>${view.offers.filter(o => o.status === 'open').map(o => `<div class="journey">${esc(view.factions.find(f => f.id === o.from)?.name)} proposes ${o.kind}${o.kind === 'trade' ? `<br>${cost(o.give)} for ${cost(o.want)}` : ''}${o.to === view.faction.id ? `<div class="actions">${button('Accept', 'offer', `data-id="${o.id}" data-other="${o.from}" data-kind="accept"`)}${button('Decline', 'offer', `data-id="${o.id}" data-other="${o.from}" data-kind="reject"`)}</div>` : '<small>Waiting for a reply</small>'}</div>`).join('') || '<p>No open offers.</p>'}<h3>Local trade</h3><p>Trade exchanges goods held in storage in the same region. Transport them there first. Offered goods are held until the recipient accepts or declines.</p><div class="split"><label>Other colony<select id="trade-other">${view.factions.filter(f => f.id !== view.faction.id).map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select></label><div><label>Offer<input id="give-count" type="number" value="10" min="1"></label><select id="give-kind">${RESOURCES.map(k => `<option>${k}</option>`).join('')}</select></div><div><label>Request<input id="want-count" type="number" value="10" min="1"></label><select id="want-kind">${RESOURCES.map(k => `<option>${k}</option>`).join('')}</select></div></div><div class="actions">${button('Offer exchange', 'trade')}</div>`);
}
function manual() { openPanel('manual', `<div class="eyebrow">FIELD MANUAL</div><h2>A lasting colony, a growing domain.</h2><div class="manual-grid"><article><h3>Begin with the home</h3><p>Place beds, a growing plot and a cookhouse. Gather visible resources. A stockyard near work reduces walking. Walls, doors and floor tiles let you arrange sheltered rooms.</p></article><article><h3>Understand the work</h3><p>People fetch supplies, carry them to a plan, then construct it. Inspect the plan to see deliveries and progress. Priorities range from 1 to 4; — disables a job. People stop for urgent needs.</p></article><article><h3>Learn and specialize</h3><p>A workshop makes parts. A study hall unlocks technology when someone researches. Practice grows lasting skills. Recruit slowly after making spare beds and meals.</p></article><article><h3>Field command</h3><p>Click or drag to select. Right-click gives a move order. Mobilize civilians to suspend normal work. Attack-move engages opponents; ordinary movement allows retreat. Stone blocks firing lanes.</p></article><article><h3>Crews and machines</h3><p>Foundries produce robots; hangars build vehicles. Move a civilian within four tiles, select them, then Board. Refuel near storage. Experienced pilots improve equipment. Disabled hulls eject injured crew for recovery.</p></article><article><h3>Distance and territory</h3><p>The World panel quotes real journey time and capacity. Carried supplies and crews retain their identities. Hold a claim with a relay, food and a surviving force. Occupation needs control of the region.</p></article><article><h3>Returning and defeat</h3><p>World time continues while clients are offline. The server stores progress. After conquest your people remain yours: evacuate, rebuild or negotiate. Domain victories remain recorded without resetting the world.</p></article><article><h3>Controls</h3><p>WASD/arrows pan; wheel or +/− zoom. F centers home. X stops. Esc cancels placement or closes this panel. Menus do not pause the shared world.</p></article></div><p class="danger">${esc(view.policy.label)}</p><label>Audio volume<input id="audio-volume" type="range" min="0" max="0.5" step="0.01" value="${volume}"></label><h3>Keep your colony access key</h3><p class="muted">This key restores ownership in another browser. Keep it private. Your world is stored by the server, not in this key.</p><div class="key-box">${esc(token)}</div><div class="actions">${button('Download access key', 'save-key')}${button('Change colony', 'logout')}</div>`); }

document.addEventListener('click', async event => {
  const b = event.target.closest('[data-action]'); if (!b || !view) return;
  const d = b.dataset;
  try {
    if (d.action === 'plan') { build = d.kind; notice(`Plan ${B[build].name}. Click explored, clear ground. ${cost(B[build].cost)}.`); buildMenu(); }
    if (d.action === 'select-person') { const e = view.roster.find(e => e.id === d.id); if (e.region && e.region !== currentRegion) { currentRegion = e.region; lastTopology = -1; await refresh(true); } selection = [d.id]; const p = view.entities.find(e => e.id === d.id); if (p) renderer.center(p); inspect(); }
    if (d.action === 'draft') await send({ type: 'draft', ids: selectedUnits().map(e => e.id), value: d.value === '1' });
    if (d.action === 'stop') await send({ type: 'order', order: 'stop', ids: selectedUnits().map(e => e.id) });
    if (d.action === 'attack-mode') { build = 'attack'; notice('Right-click a destination to advance and engage.'); }
    if (d.action === 'designate') await send({ type: 'designate', ids: [d.id], clear: d.clear === '1' });
    if (d.action === 'people') peoplePanel(); if (d.action === 'research') researchPanel(); if (d.action === 'world') worldPanel();
    if (d.action === 'priority') { await send({ type: 'priority', id: d.id, skill: d.skill, value: Number(d.value) }); peoplePanel(); }
    if (d.action === 'start-research') { await send({ type: 'research', kind: d.kind }); researchPanel(); }
    if (d.action === 'recruit') await send({ type: 'recruit' });
    if (d.action === 'queue') await send({ type: 'queue', id: d.id, kind: d.kind });
    if (d.action === 'cancel-queue') await send({ type: 'cancel', id: d.id, queue: true });
    if (d.action === 'remove') { await send({ type: 'cancel', id: d.id }); selection = []; }
    if (d.action === 'bill') await send({ type: 'bill', id: d.id, amount: Number(d.amount) });
    if (d.action === 'board') await send({ type: 'board', ids: selectedUnits().filter(e => e.type === 'person').map(e => e.id), vehicle: d.vehicle });
    if (['refuel', 'disembark'].includes(d.action)) await send({ type: d.action, id: d.id });
    if (d.action === 'training') await send({ type: 'train', id: d.id, value: d.value === '1' });
    if (d.action === 'region') { selectedWorld = d.id; worldPanel(); }
    if (d.action === 'inspect-region') { currentRegion = selectedWorld; lastTopology = -1; $('panel').close(); await refresh(true); }
    if (d.action === 'quote') { const q = await api('quote', party()); $('quote-result').textContent = q.error || `${q.km.toFixed(0)} km · ${q.speed.toFixed(1)} km/h before terrain · ${duration(q.seconds)} · capacity ${q.capacity} · journey food ${q.provisions} · fuel ${q.fuel.toFixed(1)}${q.crossRealm ? ' · crosses the realm passage' : ''}`; }
    if (d.action === 'depart') { await send({ type: 'travel', ...party() }); worldPanel(); }
    if (d.action === 'claim') { await send({ type: 'claim' }); worldPanel(); }
    if (d.action === 'diplomatic') { await send({ type: 'diplomacy', other: d.other, action: d.kind }); diplomacyPanel(); }
    if (d.action === 'offer') { await send({ type: 'diplomacy', other: d.other, action: d.kind, offer: d.id }); diplomacyPanel(); }
    if (d.action === 'trade') { await send({ type: 'diplomacy', other: $('trade-other').value, action: 'trade', give: { [$('give-kind').value]: Number($('give-count').value) }, want: { [$('want-kind').value]: Number($('want-count').value) } }); diplomacyPanel(); }
    if (d.action === 'save-key') { const blob = new Blob([JSON.stringify({ colony: view.faction.name, accessKey: token }, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'frontier-colony-key.json'; a.click(); URL.revokeObjectURL(url); }
    if (d.action === 'logout') { token = ''; sessionStorage.removeItem('frontier-key'); localStorage.removeItem('frontier-key'); $('panel').close(); await lobby(); }
  } catch (e) { notice(e.message, true); }
});
function hit(p) {
  return view.entities.filter(e => !e.vehicle && e.hp > 0 && Math.hypot(e.x - p.x, e.y - p.y) < (e.type === 'vehicle' ? 1.4 : .8)).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0] || view.region.buildings.find(b => b.hp > 0 && p.x >= b.x && p.y >= b.y && p.x < b.x + B[b.kind].w && p.y < b.y + B[b.kind].h) || view.region.nodes.find(n => n.amount > 0 && Math.hypot(n.x + .5 - p.x, n.y + .5 - p.y) < .9);
}
$('map').addEventListener('pointerdown', e => { if (!view) return; $('map').focus(); const rect = $('map').getBoundingClientRect(); drag = { x: e.clientX - rect.left, y: e.clientY - rect.top, button: e.button, shift: e.shiftKey, cam: { ...renderer.camera } }; $('map').setPointerCapture(e.pointerId); });
$('map').addEventListener('pointermove', e => { const rect = $('map').getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top; renderer.mouse = renderer.world(x, y); if (!drag) return; if (drag.button === 1 || drag.shift) { renderer.camera.x = drag.cam.x - (x - drag.x) / (22 * renderer.camera.zoom); renderer.camera.y = drag.cam.y - (y - drag.y) / (22 * renderer.camera.zoom); } else if (drag.button === 0 && !build) box = { x: drag.x, y: drag.y, w: x - drag.x, h: y - drag.y }; });
$('map').addEventListener('pointerup', async e => {
  if (!drag || !view) return; const rect = $('map').getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top, p = renderer.world(x, y), start = drag; drag = null; const selectedBox = box; box = null;
  try {
    if (start.button === 1 || start.shift) return;
    if (start.button === 2) { const target = hit(p), es = selectedUnits(); if (!es.length) { notice('Select your people or machines first.'); return; } if (target?.faction && target.faction !== view.faction.id) await send({ type: 'order', order: 'attack', ids: es.map(e => e.id), target: target.id }); else await send({ type: 'order', order: build === 'attack' ? 'attackMove' : 'move', ids: es.map(e => e.id), x: p.x, y: p.y }); build = null; return; }
    if (build && build !== 'attack') { await send({ type: 'build', kind: build, x: Math.floor(p.x), y: Math.floor(p.y) }); return; }
    if (selectedBox && Math.hypot(selectedBox.w, selectedBox.h) > 8) { const a = renderer.world(start.x, start.y); selection = view.entities.filter(e => e.faction === view.faction.id && !e.vehicle && e.hp > 0 && e.x >= Math.min(a.x, p.x) && e.x <= Math.max(a.x, p.x) && e.y >= Math.min(a.y, p.y) && e.y <= Math.max(a.y, p.y)).map(e => e.id); }
    else { const o = hit(p); selection = o ? [o.id] : []; sound(370); } inspect();
  } catch (e) { notice(e.message, true); }
});
$('map').addEventListener('contextmenu', e => e.preventDefault());
$('map').addEventListener('wheel', e => { e.preventDefault(); const r = $('map').getBoundingClientRect(); renderer.zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
$('minimap').addEventListener('click', e => { if (!view) return; const r = $('minimap').getBoundingClientRect(); renderer.center({ x: (e.clientX - r.left) / r.width * view.region.size, y: (e.clientY - r.top) / r.height * view.region.size }); });
document.addEventListener('keydown', e => { if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return; if ($('panel').open || $('lobby').open) return; if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { renderer.keys.add(e.key); e.preventDefault(); } if (e.key === 'Escape') { build = null; selection = []; inspect(); buildMenu(); } if (e.key === 'f') renderer.center(view.region.start); if (e.key === '+' || e.key === '=') renderer.zoom(1.2); if (e.key === '-') renderer.zoom(1 / 1.2); if (e.key === 'x' && selectedUnits().length) send({ type: 'order', order: 'stop', ids: selectedUnits().map(e => e.id) }).catch(() => {}); });
document.addEventListener('keyup', e => renderer.keys.delete(e.key)); window.addEventListener('blur', () => renderer.keys.clear());
$('build-category').onchange = buildMenu; $('cancel-plan').onclick = () => { build = null; buildMenu(); };
$('zoom-out').onclick = () => renderer.zoom(1 / 1.2); $('zoom-in').onclick = () => renderer.zoom(1.2); $('center').onclick = () => view && renderer.center(view.region.start);
$('fertility').onclick = () => { renderer.soil = !renderer.soil; $('fertility').classList.toggle('active', renderer.soil); };
$('home').onclick = async () => { if (!view) return; currentRegion = view.faction.home; lastTopology = -1; await refresh(true); renderer.center(view.region.start); };
$('world-button').onclick = () => view && worldPanel(); $('people-button').onclick = () => view && peoplePanel(); $('research-button').onclick = () => view && researchPanel(); $('diplomacy-button').onclick = () => view && diplomacyPanel(); $('settings').onclick = () => view && manual(); $('close-panel').onclick = () => $('panel').close();
document.addEventListener('input', e => { if (e.target.id === 'audio-volume') { volume = Number(e.target.value); localStorage.setItem('frontier-volume', volume); sound(); } });
async function connected(key) { token = key; sessionStorage.setItem('frontier-key', token); localStorage.setItem('frontier-key', token); currentRegion = null; lastTopology = -1; await api('state'); $('lobby').close(); await refresh(true); const pending = sessionStorage.getItem('frontier-pending'); if (pending) { const result = await api('command', JSON.parse(pending)); sessionStorage.removeItem('frontier-pending'); notice(result.message, !result.ok); } }
async function lobby() { const l = await api('lobby'); $('colony-choice').innerHTML = l.colonies.map(f => `<option value="${f.id}" ${f.claimed ? 'disabled' : ''}>${esc(f.name)} · Realm ${f.realm + 1}${f.claimed ? ' · owned' : ''}</option>`).join(''); $('new-name').value = l.colonies.find(f => f.id === $('colony-choice').value)?.name || ''; $('colony-choice').onchange = () => $('new-name').value = l.colonies.find(f => f.id === $('colony-choice').value)?.name || ''; if (!$('lobby').open) $('lobby').showModal(); }
$('join').onclick = async () => { try { const a = await api('join', { faction: $('colony-choice').value, name: $('new-name').value }); await connected(a.token); openPanel('welcome', `<div class="eyebrow">YOUR FIRST HOME</div><h2>Four people. Room to grow.</h2><p>Start with beds and food. Your people already gather nearby resources. Plans become physical jobs: fetch, carry, build. You decide how the home takes shape.</p><p><b>Next choice:</b> place beds near the hearth, or plan a fertile growing plot first. There is no opening raid countdown.</p><div class="actions">${button('Keep my access key', 'save-key')}</div><p class="muted">The field manual contains your recovery key. Close this panel to begin.</p>`); } catch (e) { $('lobby-error').textContent = e.message; } };
$('restore').onclick = async () => { try { await connected($('restore-key').value.trim()); } catch (e) { $('lobby-error').textContent = e.message; token = ''; } };
function frame() { try { renderer.draw(view, selection, build === 'attack' ? null : build, box); } catch (e) { console.error(e); } requestAnimationFrame(frame); } frame();
setInterval(() => refresh(), 500);
try { if (token) await connected(token); else await lobby(); } catch (e) { token = ''; $('lobby-error').textContent = e.message; await lobby(); }
