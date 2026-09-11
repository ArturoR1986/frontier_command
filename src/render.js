import { WIDTH, HEIGHT, BUILDINGS } from './catalog.js';
import { cell, center } from './world.js';
import { placement } from './simulation.js';

const colors = ['#596452', '#596452', '#687362', '#736e59'];
export const GLYPHS = { hub: '⌂', depot: '▤', habitat: '⌂', farm: '♧', generator: 'ϟ', workshop: '⚒', barracks: '⚑', turret: '⊕', sensor: '♜', wall: '▬' };
export function screenToWorld(view, x, y) { return { x: (x - view.width / 2) / view.scale + view.x, y: (y - view.height / 2) / view.scale + view.y }; }
export function worldToScreen(view, x, y) { return { x: (x - view.x) * view.scale + view.width / 2, y: (y - view.y) * view.scale + view.height / 2 }; }
export function zoom(view, factor, sx = view.width / 2, sy = view.height / 2) {
  const before = screenToWorld(view, sx, sy);
  view.scale = Math.max(12, Math.min(70, view.scale * factor));
  const after = screenToWorld(view, sx, sy);
  view.x += before.x - after.x; view.y += before.y - after.y;
}
function polygon(c, points, fill, stroke) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.stroke(); }
}
function structure(c, b, time) {
  const d = BUILDINGS[b.kind], w = d.w, h = d.h;
  c.save(); c.translate(b.x, b.y);
  c.fillStyle = '#1d292b66'; c.fillRect(0.23, 0.25, w, h);
  if (!b.complete) {
    c.fillStyle = '#b9ccad18'; c.fillRect(0.05, 0.05, w - 0.1, h - 0.1);
    c.strokeStyle = '#c4d6b2'; c.setLineDash([0.14, 0.12]); c.lineWidth = 0.035; c.strokeRect(0.07, 0.07, w - 0.14, h - 0.14); c.setLineDash([]);
    if (b.progress > 5) { c.fillStyle = '#74766b'; c.fillRect(0.17, 0.17, w - 0.34, h - 0.34); }
    if (b.progress > 25) { c.strokeStyle = '#ccb68e'; for (let x = 0.2; x < w; x += 0.5) { c.beginPath(); c.moveTo(x, 0.2); c.lineTo(x, h - 0.2); c.stroke(); } }
    if (b.progress > 60) { c.fillStyle = d.color; c.globalAlpha = 0.65; c.fillRect(0.2, 0.2, w - 0.4, h - 0.4); c.globalAlpha = 1; }
    const delivered = b.delivered.alloy + b.delivered.biomass;
    for (let i = 0; i < Math.min(5, Math.ceil(delivered / 10)); i++) { c.fillStyle = i % 2 ? '#b19a71' : '#9babb0'; c.fillRect(0.15 + i * 0.22, h - 0.38, 0.17, 0.17); }
    c.fillStyle = '#182827'; c.fillRect(0.08, h - 0.14, w - 0.16, 0.08); c.fillStyle = '#d7b96f'; c.fillRect(0.08, h - 0.14, (w - 0.16) * b.progress / 100, 0.08);
    c.restore(); return;
  }
  c.fillStyle = '#354446'; c.fillRect(0.05, 0.05, w - 0.1, h - 0.1);
  c.strokeStyle = '#1e2c2c'; c.lineWidth = 0.055;
  if (b.kind === 'hub') {
    polygon(c, [[0.2, 0.6], [0.6, 0.2], [2.4, 0.2], [2.8, 0.6], [2.8, 2.35], [2.35, 2.75], [0.6, 2.75], [0.2, 2.35]], '#b4b5a0', '#263a3b');
    c.fillStyle = '#758d8a'; c.fillRect(0.6, 0.5, 1.8, 1.5); c.fillStyle = '#d3b773'; c.fillRect(0.8, 0.65, 1.4, 0.27);
    c.fillStyle = '#3d575d'; c.fillRect(0.55, 2.13, 1.9, 0.22); c.fillStyle = '#bdd8c4'; for (let i = 0; i < 4; i++) c.fillRect(0.65 + i * 0.44, 2.16, 0.28, 0.07);
    c.strokeStyle = '#d9d1ad'; c.lineWidth = 0.08; c.beginPath(); c.moveTo(2.1, 0.8); c.lineTo(2.1, -0.45); c.stroke(); c.fillStyle = '#d9bf74'; c.beginPath(); c.arc(2.1, -0.45, 0.09, 0, 7); c.fill();
  } else if (b.kind === 'habitat' || b.kind === 'barracks') {
    c.fillStyle = d.color; c.beginPath(); c.roundRect(0.15, 0.2, w - 0.3, h - 0.45, 0.35); c.fill(); c.stroke();
    c.fillStyle = '#718888'; c.fillRect(0.4, 0.2, w - 0.8, 0.4); c.fillStyle = '#273d43'; for (let i = 0; i < 4; i++) c.fillRect(0.45 + i * 0.54, 1.12, 0.32, 0.35);
    c.fillStyle = b.powered ? '#d3d9aa' : '#607b7a'; for (let i = 0; i < 4; i++) c.fillRect(0.48 + i * 0.54, 1.15, 0.26, 0.2);
    if (b.kind === 'barracks') { c.strokeStyle = '#ead3a1'; c.beginPath(); c.moveTo(2.5, 0.5); c.lineTo(2.5, -0.3); c.stroke(); polygon(c, [[2.5, -0.3], [3, -0.13], [2.5, 0.05]], '#bd785c'); }
  } else if (b.kind === 'farm') {
    c.fillStyle = '#918b70'; c.fillRect(0.15, 0.15, w - 0.3, h - 0.3);
    for (let row = 0; row < 3; row++) { c.fillStyle = '#344d36'; c.fillRect(0.3, 0.3 + row * 0.48, w - 0.6, 0.3); for (let i = 0; i < 8; i++) { c.fillStyle = b.growth >= 100 ? '#c4bb6b' : '#91b175'; c.beginPath(); c.ellipse(0.45 + i * 0.3, 0.44 + row * 0.48, 0.04 + b.growth / 900, 0.05 + b.growth / 1000, 0.4, 0, 7); c.fill(); } }
    c.strokeStyle = '#bdd6c155'; c.lineWidth = 0.05; c.strokeRect(0.2, 0.2, w - 0.4, h - 0.4);
  } else if (b.kind === 'generator') {
    c.fillStyle = '#7d8c86'; c.fillRect(0.18, 0.35, 1.6, 1.35); c.fillStyle = d.color; c.fillRect(0.25, 0.4, 0.85, 1.15);
    c.fillStyle = '#33474b'; c.fillRect(0.35, 0.55, 0.6, 0.18); c.fillRect(0.35, 0.92, 0.6, 0.18);
    c.fillStyle = '#c6c5aa'; c.fillRect(1.3, 0.05, 0.27, 1.25); c.fillStyle = '#263438'; c.fillRect(1.3, 0.05, 0.27, 0.2);
    for (let i = 0; i < 3; i++) { const age = (time * 0.4 + i / 3) % 1; c.fillStyle = `rgba(204,209,184,${0.16 * (1 - age)})`; c.beginPath(); c.arc(1.44 + age * 0.3, -age * 0.7, 0.1 + age * 0.15, 0, 7); c.fill(); }
  } else if (b.kind === 'depot') {
    c.fillStyle = '#9a9982'; c.fillRect(0.13, 0.13, 1.74, 1.74); for (let y = 0; y < 2; y++) for (let x = 0; x < 3; x++) { c.fillStyle = (x + y) % 2 ? '#779496' : '#bba579'; c.fillRect(0.25 + x * 0.52, 0.27 + y * 0.65, 0.43, 0.52); c.strokeRect(0.25 + x * 0.52, 0.27 + y * 0.65, 0.43, 0.52); }
  } else if (b.kind === 'workshop') {
    c.fillStyle = '#a5a6a0'; c.fillRect(0.15, 0.15, 2.7, 1.7); polygon(c, [[0.1, 0.6], [1.5, 0.05], [2.9, 0.6], [2.9, 1.1], [0.1, 1.1]], '#9395a0', '#344145'); c.fillStyle = '#35474a'; c.fillRect(0.4, 1.25, 1, 0.5); c.fillStyle = '#c0b195'; c.fillRect(2, 1.25, 0.55, 0.45);
  } else if (b.kind === 'turret') {
    c.fillStyle = '#abb5a3'; c.beginPath(); c.arc(0.5, 0.5, 0.39, 0, 7); c.fill(); c.stroke(); c.save(); c.translate(0.5, 0.5); c.rotate(Math.sin(time * 0.15) * 0.5); c.fillStyle = '#536b6c'; c.fillRect(-0.16, -0.23, 0.32, 0.46); c.fillStyle = '#d1c69b'; c.fillRect(-0.08, -0.58, 0.16, 0.42); c.restore();
  } else if (b.kind === 'sensor') {
    polygon(c, [[0.15, 0.85], [0.5, 0.1], [0.85, 0.85]], '#a4b1a0', '#33474b'); c.strokeStyle = '#dfd7b4'; c.lineWidth = 0.09; c.beginPath(); c.moveTo(0.5, 0.8); c.lineTo(0.5, -0.65); c.stroke(); c.fillStyle = '#b9d0c7'; c.beginPath(); c.ellipse(0.5, -0.5, 0.37, 0.12, Math.sin(time) * 0.4, 0, 7); c.fill();
  } else { c.fillStyle = '#9a9f90'; c.fillRect(0.08, 0.2, 0.84, 0.6); c.strokeRect(0.08, 0.2, 0.84, 0.6); c.fillStyle = '#535f5b'; c.fillRect(0.38, 0.2, 0.2, 0.6); }
  if (b.hp < d.hp) { c.strokeStyle = '#513b2c'; c.lineWidth = 0.045; c.beginPath(); c.moveTo(w * 0.3, h * 0.3); c.lineTo(w * 0.5, h * 0.55); c.lineTo(w * 0.38, h * 0.65); c.stroke(); c.fillStyle = '#412f29'; c.fillRect(0.05, h - 0.1, w - 0.1, 0.06); c.fillStyle = '#d89675'; c.fillRect(0.05, h - 0.1, (w - 0.1) * b.hp / d.hp, 0.06); }
  // Hardware, wear and service aprons give the modular buildings a used frontier character.
  if (w > 1) {
    c.fillStyle = '#b8ad853f'; c.fillRect(0.25, h - 0.04, Math.min(1, w - 0.4), 0.17);
    c.fillStyle = '#455655'; c.fillRect(w - 0.5, h - 0.42, 0.2, 0.22);
    c.strokeStyle = '#314444'; c.lineWidth = 0.025;
    for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(w - 0.49, h - 0.38 + i * 0.05); c.lineTo(w - 0.31, h - 0.38 + i * 0.05); c.stroke(); }
    c.fillStyle = '#e3dac4'; for (const [x, y] of [[0.22, 0.25], [w - 0.25, 0.25], [0.22, h - 0.26], [w - 0.25, h - 0.26]]) c.fillRect(x, y, 0.045, 0.045);
    c.fillStyle = '#5b665d33'; for (let i = 0; i < 5; i++) c.fillRect(0.3 + (i * 0.47 % (w - 0.6)), 0.4 + (i * 0.37 % (h - 0.6)), 0.09, 0.025);
  }
  if (d.demand && !b.powered) { c.font = 'bold 0.35px sans-serif'; c.fillStyle = '#f4d094'; c.fillText('ϟ OFF', 0.08, -0.08); }
  c.restore();
}
function unit(c, p, selected, time, hostile = false) {
  c.save(); c.translate(p.x, p.y);
  c.fillStyle = '#10212466'; c.beginPath(); c.ellipse(0.06, 0.14, 0.25, 0.13, 0, 0, 7); c.fill();
  if (selected) { c.strokeStyle = '#e9d997'; c.lineWidth = 0.045; c.beginPath(); c.ellipse(0, 0.05, 0.36, 0.28, 0, 0, 7); c.stroke(); }
  const stride = p.route.length ? Math.sin(time * 12 + p.id) * 0.08 : 0;
  c.strokeStyle = '#253639'; c.lineWidth = 0.09; c.beginPath(); c.moveTo(-0.08, 0.05); c.lineTo(-0.1, 0.22 + stride); c.moveTo(0.08, 0.05); c.lineTo(0.1, 0.22 - stride); c.stroke();
  c.fillStyle = hostile ? '#bf745e' : p.color; c.fillRect(-0.15, -0.18, 0.3, 0.3);
  if (p.ranger || hostile) { c.fillStyle = hostile ? '#654d43' : '#536b6b'; c.fillRect(-0.18, -0.18, 0.36, 0.19); c.strokeStyle = '#d1c6a6'; c.lineWidth = 0.07; c.beginPath(); c.moveTo(0.17, -0.1); c.lineTo(0.35, -0.35); c.stroke(); }
  c.fillStyle = '#d3b691'; c.beginPath(); c.arc(0, -0.25, 0.11, 0, 7); c.fill(); c.fillStyle = hostile ? '#655550' : '#574d42'; c.fillRect(-0.1, -0.34, 0.2, 0.07);
  if (p.cargo) { c.fillStyle = p.cargo.kind === 'food' ? '#b9bf76' : p.cargo.kind === 'alloy' ? '#a8c8cb' : '#b6a27e'; c.fillRect(0.15, 0.02, 0.21, 0.21); c.strokeStyle = '#4d5950'; c.lineWidth = 0.025; c.strokeRect(0.15, 0.02, 0.21, 0.21); }
  if (['gather', 'build', 'repair', 'grow'].includes(p.job?.type) && !p.route.length) { c.strokeStyle = '#d5cba4'; c.lineWidth = 0.06; c.beginPath(); c.moveTo(-0.12, -0.07); c.lineTo(-0.28, -0.2 + Math.sin(time * 9) * 0.15); c.stroke(); }
  if (p.activity === 'Sleeping') { c.fillStyle = '#d7dfd3'; c.font = '0.24px sans-serif'; c.fillText('z', 0.2, -0.35); }
  if (p.hp < (hostile ? p.maxHp : 100)) { c.fillStyle = '#253b3b'; c.fillRect(-0.25, 0.32, 0.5, 0.04); c.fillStyle = hostile ? '#e79975' : '#beca89'; c.fillRect(-0.25, 0.32, 0.5 * p.hp / (hostile ? p.maxHp : 100), 0.04); }
  c.restore();
}
export function render(canvas, minimap, s, ui) {
  const v = ui.view, c = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
  v.width = rect.width; v.height = rect.height;
  if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) { canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr); }
  c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = '#263634'; c.fillRect(0, 0, v.width, v.height);
  c.translate(v.width / 2, v.height / 2); c.scale(v.scale, v.scale); c.translate(-v.x, -v.y); c.lineWidth = 0.035;
  if (!ui.terrainCache || ui.terrainCache.state !== s || ui.terrainCache.epoch !== Math.floor(s.time / 2)) {
    const surface = ui.terrainCache?.surface || new OffscreenCanvas(WIDTH * 32, HEIGHT * 32);
    const ground = surface.getContext('2d');
    ground.setTransform(32, 0, 0, 32, 0, 0); ground.lineWidth = 0.035;
    drawTerrain(ground, s);
    ui.terrainCache = { surface, state: s, epoch: Math.floor(s.time / 2) };
  }
  c.drawImage(ui.terrainCache.surface, 0, 0, WIDTH, HEIGHT);
  for (const n of s.nodes) {
    if (n.amount <= 0 || !s.explored[cell(n.x, n.y)]) continue;
    if (n.kind === 'alloy') { polygon(c, [[n.x - 0.35, n.y + 0.18], [n.x - 0.21, n.y - 0.25], [n.x + 0.08, n.y - 0.4], [n.x + 0.3, n.y + 0.16]], '#acc0b6', '#334b4b'); polygon(c, [[n.x + 0.07, n.y + 0.24], [n.x + 0.16, n.y - 0.12], [n.x + 0.4, n.y - 0.04], [n.x + 0.41, n.y + 0.26]], '#8da9ad', '#405959'); }
    else { c.fillStyle = '#354f3d'; c.beginPath(); c.arc(n.x, n.y, 0.38, 0, 7); c.fill(); c.fillStyle = n.kind === 'food' ? '#bec18a' : '#97ac72'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(n.x + Math.cos(i * 1.3) * 0.18, n.y + Math.sin(i * 1.3) * 0.18, 0.18, 0.11, i, 0, 7); c.fill(); } }
    if (ui.selected.includes(n.id)) { c.strokeStyle = '#e4d38c'; c.lineWidth = 0.05; c.strokeRect(n.x - 0.5, n.y - 0.5, 1, 1); }
  }
  // Physical power lines communicate layout before a player opens an inspector.
  for (const b of s.buildings.filter(b => b.complete && BUILDINGS[b.kind].demand)) {
    const source = s.buildings.find(g => g.complete && BUILDINGS[g.kind].power && Math.hypot(center(g).x - center(b).x, center(g).y - center(b).y) <= 11);
    if (source) { c.strokeStyle = b.powered ? '#d8c88844' : '#df856c55'; c.lineWidth = 0.025; c.beginPath(); c.moveTo(center(source).x, center(source).y); c.lineTo(center(b).x, center(b).y); c.stroke(); }
  }
  for (const b of [...s.buildings].sort((a, b) => a.y - b.y)) {
    structure(c, b, s.time);
    if (ui.selected.includes(b.id)) { c.strokeStyle = '#e4d38c'; c.lineWidth = 0.05; c.strokeRect(b.x - 0.08, b.y - 0.08, BUILDINGS[b.kind].w + 0.16, BUILDINGS[b.kind].h + 0.16); }
  }
  for (const d of s.drops) { c.fillStyle = d.kind === 'alloy' ? '#abc1c2' : '#b5b587'; c.fillRect(d.x - 0.15, d.y - 0.15, 0.3, 0.3); c.strokeStyle = '#314742'; c.lineWidth = 0.04; c.strokeRect(d.x - 0.15, d.y - 0.15, 0.3, 0.3); }
  for (const p of s.people) {
    if (ui.selected.includes(p.id) && p.route.length) { c.strokeStyle = '#ece1a866'; c.lineWidth = 0.035; c.setLineDash([0.12, 0.1]); c.beginPath(); c.moveTo(p.x, p.y); for (const n of p.route) c.lineTo(n.x, n.y); c.stroke(); c.setLineDash([]); }
    unit(c, p, ui.selected.includes(p.id), s.time);
  }
  for (const h of s.hostiles) if (s.explored[cell(h.x, h.y)]) unit(c, h, ui.selected.includes(h.id), s.time, true);
  for (const e of s.effects) { c.strokeStyle = e.type === 'shot' ? '#f2d49b' : '#e09678'; c.lineWidth = 0.045; c.beginPath(); c.moveTo(e.x, e.y); c.lineTo(e.tx, e.ty); c.stroke(); }
  const night = Math.max(0, Math.cos(((s.time % 600) - 490) / 600 * Math.PI * 2));
  c.fillStyle = `rgba(12,27,49,${night * 0.23})`; c.fillRect(0, 0, WIDTH, HEIGHT);
  if (night > 0.1) for (const b of s.buildings.filter(b => b.complete && b.powered && b.kind !== 'wall')) {
    const p = center(b), g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, 2.4); g.addColorStop(0, `rgba(244,210,125,${night * 0.16})`); g.addColorStop(1, '#edd39b00'); c.fillStyle = g; c.fillRect(p.x - 2.4, p.y - 2.4, 4.8, 4.8);
  }
  if (ui.build && ui.mouse) {
    const x = Math.floor(ui.mouse.x), y = Math.floor(ui.mouse.y), d = BUILDINGS[ui.build], error = placement(s, ui.build, x, y);
    c.fillStyle = error ? '#dc806350' : '#bcdfa350'; c.strokeStyle = error ? '#f0a18b' : '#def3b9'; c.lineWidth = 0.07; c.fillRect(x, y, d.w, d.h); c.strokeRect(x, y, d.w, d.h); c.font = '0.45px sans-serif'; c.fillStyle = '#fff0c9'; c.fillText(error ? '×' : '✓', x + 0.1, y + 0.5);
  }
  if (ui.marker && ui.marker.until > performance.now()) { const m = ui.marker; c.strokeStyle = '#f1d787'; c.lineWidth = 0.05; c.beginPath(); c.arc(m.x, m.y, 0.4, 0, 7); c.moveTo(m.x - 0.6, m.y); c.lineTo(m.x + 0.6, m.y); c.moveTo(m.x, m.y - 0.6); c.lineTo(m.x, m.y + 0.6); c.stroke(); }
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (const p of s.people) if (v.scale > 28 || ui.selected.includes(p.id)) {
    const point = worldToScreen(v, p.x, p.y); c.font = '10px Segoe UI'; c.textAlign = 'center'; c.fillStyle = '#102328ca'; const label = p.name; c.fillRect(point.x - 23, point.y - 30, 46, 14); c.fillStyle = '#e3e5c9'; c.fillText(label, point.x, point.y - 19);
    if (ui.selected.includes(p.id)) { c.font = '9px Segoe UI'; c.fillStyle = '#f0e2b4'; c.fillText(p.activity, point.x, point.y + 24); }
  }
  c.textAlign = 'left';
  if (ui.drag?.box) { const d = ui.drag; c.strokeStyle = '#ecd995'; c.fillStyle = '#ece0ab16'; c.fillRect(d.x, d.y, d.currentX - d.x, d.currentY - d.y); c.strokeRect(d.x, d.y, d.currentX - d.x, d.currentY - d.y); }
  drawMinimap(minimap, s, v);
}
function drawMinimap(canvas, s, view) {
  const c = canvas.getContext('2d'), sx = canvas.width / WIDTH, sy = canvas.height / HEIGHT;
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) { const i = cell(x, y); c.fillStyle = s.explored[i] ? colors[s.terrain[i]] : '#223431'; c.fillRect(x * sx, y * sy, sx, sy); }
  for (const b of s.buildings) { c.fillStyle = b.complete ? '#e0c48a' : '#aab6a0'; c.fillRect(b.x * sx, b.y * sy, BUILDINGS[b.kind].w * sx, BUILDINGS[b.kind].h * sy); }
  for (const p of s.people) { c.fillStyle = '#e4e8d1'; c.fillRect(p.x * sx - 1, p.y * sy - 1, 2, 2); }
  for (const h of s.hostiles) { c.fillStyle = '#e98e76'; c.fillRect(h.x * sx - 1, h.y * sy - 1, 3, 3); }
  const min = screenToWorld(view, 0, 0), max = screenToWorld(view, view.width, view.height); c.strokeStyle = '#e9d39b'; c.lineWidth = 1; c.strokeRect(min.x * sx, min.y * sy, (max.x - min.x) * sx, (max.y - min.y) * sy);
}

function drawTerrain(c, s) {
  const min = { x: 0, y: 0 }, max = { x: WIDTH, y: HEIGHT };
  for (let y = Math.max(0, Math.floor(min.y)); y < Math.min(HEIGHT, max.y + 1); y++) for (let x = Math.max(0, Math.floor(min.x)); x < Math.min(WIDTH, max.x + 1); x++) {
    const i = cell(x, y), t = s.terrain[i], hash = (Math.imul(x + 17, y + 113) % 19) / 19;
    c.fillStyle = s.explored[i] ? colors[t] : '#303e3b'; c.fillRect(x, y, 1.02, 1.02);
    if (!s.explored[i]) { c.fillStyle = '#8993810b'; c.fillRect(x + 0.1, y + 0.1, 0.02, 0.02); continue; }
    c.fillStyle = hash > 0.5 ? '#e7e4b306' : '#101e2208'; c.beginPath(); c.ellipse(x + 0.5, y + 0.5, 0.65, 0.43, hash * 3, 0, 7); c.fill();
    if (t === 1) {
      c.fillStyle = '#80915b35'; c.beginPath(); c.ellipse(x + 0.5, y + 0.5, 0.58, 0.46, hash * 2, 0, 7); c.fill();
      c.strokeStyle = '#95a67177'; c.lineWidth = 0.018;
      for (let i = 0; i < 4; i++) { const px = x + 0.12 + (i * 0.31 + hash) % 0.75, py = y + 0.2 + (i * 0.23) % 0.65; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 0.035, py - 0.12); c.moveTo(px, py); c.lineTo(px + 0.07, py - 0.07); c.stroke(); }
    }
    if (t === 2) { c.fillStyle = '#293a3b66'; c.fillRect(x + 0.12, y + 0.2, 0.9, 0.8); polygon(c, [[x + 0.04, y + 0.4], [x + 0.3, y + 0.05], [x + 0.77, y + 0.14], [x + 0.98, y + 0.65], [x + 0.65, y + 0.93], [x + 0.1, y + 0.87]], '#828474', '#667365'); polygon(c, [[x + 0.04, y + 0.4], [x + 0.3, y + 0.05], [x + 0.77, y + 0.14], [x + 0.55, y + 0.46]], '#969583'); }
    else { c.fillStyle = t === 1 ? '#afbb7950' : '#b8bd9440'; c.fillRect(x + hash * 0.7, y + 0.3, 0.06, 0.035); c.fillRect(x + 0.6, y + hash, 0.035, 0.035); }
    if (s.trails[i] > 2) {
      const opacity = Math.min(0.28, s.trails[i] / 180); c.strokeStyle = `rgba(174,157,121,${opacity})`; c.lineWidth = 0.25;
      for (const [dx, dy] of [[1, 0], [0, 1]]) if (x + dx < WIDTH && y + dy < HEIGHT && s.trails[cell(x + dx, y + dy)] > 2) { c.beginPath(); c.moveTo(x + 0.5, y + 0.5); c.lineTo(x + dx + 0.5, y + dy + 0.5); c.stroke(); }
      c.lineWidth = 0.035;
    }
  }
}
