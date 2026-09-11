import { STRUCTURES as B, MACHINES as M } from './catalog.js';
import { hash } from './terrain.js';
import { MotionBuffer } from './motion.js';
import { facility } from './facilities.js';

export const ICONS = { core: '⌂', stockpile: '▤', wall: '▥', door: '▯', floor: '▦', bed: '▱', table: '⊞', field: '♧', kitchen: '♨', clinic: '✚', workshop: '⚒', laboratory: '⌘', generator: 'ϟ', refinery: '◉', fabricator: '⬡', garage: '⌂', turret: '⌖', relay: '⚑' };
const resourceColor = { wood: '#b79366', stone: '#a9afb0', ore: '#c29a73', food: '#acc982', meals: '#e3bc7b', parts: '#87b9ba', fuel: '#d6a15c', medicine: '#c6d5bb', crystal: '#91b6dd' };
export class Renderer {
  constructor(canvas, minimap) { this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.mini = minimap; this.mx = minimap.getContext('2d'); this.camera = { x: 81, y: 128, zoom: .85 }; this.frameTimes = []; this.last = performance.now(); this.keys = new Set(); this.terrain = null; this.lastTerrain = ''; this.soil = false; this.mouse = null; this.motion = new MotionBuffer(); this.preview = []; this.commandMarker = null; }
  resize() { const box = this.canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio); if (this.canvas.width !== Math.round(box.width * dpr) || this.canvas.height !== Math.round(box.height * dpr)) { this.canvas.width = Math.round(box.width * dpr); this.canvas.height = Math.round(box.height * dpr); } this.width = box.width; this.height = box.height; this.dpr = dpr; }
  point(x, y) { const scale = 22 * this.camera.zoom; return { x: (x - this.camera.x) * scale + this.width / 2, y: (y - this.camera.y) * scale + this.height / 2 }; }
  world(x, y) { const scale = 22 * this.camera.zoom; return { x: (x - this.width / 2) / scale + this.camera.x, y: (y - this.height / 2) / scale + this.camera.y }; }
  center(point) { this.camera.x = point.x; this.camera.y = point.y; }
  zoom(delta, x = this.width / 2, y = this.height / 2) { const a = this.world(x, y); this.camera.zoom = Math.max(0.12, Math.min(3, this.camera.zoom * delta)); const b = this.world(x, y); this.camera.x += a.x - b.x; this.camera.y += a.y - b.y; }
  terrainImage(r) {
    const key = `${r.id}:${r.terrainRevision || 0}:${this.soil}`; if (key === this.lastTerrain || !r.terrain) return;
    this.lastTerrain = key; const c = document.createElement('canvas'); c.width = c.height = r.size * 6; const g = c.getContext('2d');
    for (let y = 0; y < r.size; y++) for (let x = 0; x < r.size; x++) {
      const i = y * r.size + x, t = r.terrain[i], n = hash(x, y, r.seed), px = x * 6, py = y * 6;
      g.fillStyle = this.soil && t < 2 ? `hsl(${55 + r.fertility[i] * 0.65} 24% ${20 + r.fertility[i] * 0.2}%)` : t === 0 ? `hsl(${83 + n * 9} 16% ${29 + n * 1.8}%)` : t === 1 ? `hsl(83 17% ${20 + n * 5}%)` : t === 2 ? `hsl(45 7% ${26 + n * 7}%)` : `hsl(174 20% ${23 + n * 5}%)`;
      g.fillRect(px, py, 6, 6);
      if (t === 2) {
        const above = y && r.terrain[i - r.size] === 2, below = y < r.size - 1 && r.terrain[i + r.size] === 2;
        if (!above) { g.fillStyle = '#b1ad8b'; g.fillRect(px, py, 6, 1); }
        if (!below) { g.fillStyle = '#242822'; g.fillRect(px, py + 3, 6, 3); }
        if (n > 0.6) { g.strokeStyle = '#575b4b'; g.beginPath(); g.moveTo(px, py + 2); g.lineTo(px + 3, py); g.stroke(); }
      } else if (t === 3 && n > 0.55) { g.fillStyle = '#5b8077'; g.fillRect(px + 1, py + 3, 4, 0.5); }
      else if (t < 2 && n > 0.5) { g.fillStyle = '#78806055'; g.fillRect(px + n * 3, py + 2, 1, 2); }
    }
    this.terrain = c;
  }
  draw(view, selection, build, box) {
    this.groupSelection=selection.length>1; this.resize(); const g = this.ctx, now = performance.now(), dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
    this.frameTimes.push(this.frameAt ? now - this.frameAt : 16.7); this.frameAt = now; if (this.frameTimes.length > 600) this.frameTimes.shift();
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); g.fillStyle = '#14211b'; g.fillRect(0, 0, this.width, this.height); if (!view) return;
    const r = view.region, speed = 22 * dt / this.camera.zoom;
    if (this.keys.has('a') || this.keys.has('ArrowLeft')) this.camera.x -= speed;
    if (this.keys.has('d') || this.keys.has('ArrowRight')) this.camera.x += speed;
    if (this.keys.has('w') || this.keys.has('ArrowUp')) this.camera.y -= speed;
    if (this.keys.has('s') || this.keys.has('ArrowDown')) this.camera.y += speed;
    this.camera.x = Math.max(0, Math.min(r.size, this.camera.x)); this.camera.y = Math.max(0, Math.min(r.size, this.camera.y));
    this.terrainImage(r); const s = 22 * this.camera.zoom, origin = this.point(0, 0);
    if (this.terrain) { g.imageSmoothingEnabled = false; g.drawImage(this.terrain, origin.x, origin.y, r.size * s, r.size * s); }
    const a = this.world(0, 0), z = this.world(this.width, this.height), visible = o => o.x > a.x - 8 && o.y > a.y - 8 && o.x < z.x + 8 && o.y < z.y + 8;
    if (build && s > 10) { g.strokeStyle = '#d6d8aa23'; g.lineWidth = 0.5; for (let x = Math.max(0, Math.floor(a.x)); x <= Math.min(r.size, z.x); x++) { const p = this.point(x, 0); g.beginPath(); g.moveTo(p.x, 0); g.lineTo(p.x, this.height); g.stroke(); } for (let y = Math.max(0, Math.floor(a.y)); y <= Math.min(r.size, z.y); y++) { const p = this.point(0, y); g.beginPath(); g.moveTo(0, p.y); g.lineTo(this.width, p.y); g.stroke(); } }
    for (const b of r.buildings.filter(b => b.hp > 0 && visible(b) && ['floor', 'field'].includes(b.kind))) this.building(b, view, s, now, selection.includes(b.id));
    for (const n of r.nodes.filter(n => n.amount > 0 && visible(n))) this.resource(n, s, selection.includes(n.id), view.faction.id);
    const objects = [...r.buildings.filter(b => b.hp > 0 && !['floor', 'field'].includes(b.kind)), ...view.entities.filter(e => e.hp > 0 && !e.vehicle && !e.journey)].filter(visible).sort((a, b) => a.y - b.y);
    for (const o of objects) { if (o.type) this.entity(o, view, s, now, selection.includes(o.id)); else this.building(o, view, s, now, selection.includes(o.id)); }
    for (const d of r.drops.filter(visible)) { const p = this.point(d.x, d.y); g.fillStyle = resourceColor[d.kind]; g.fillRect(p.x - s * 0.2, p.y - s * 0.15, s * 0.5, s * 0.3); }
    // Shroud represents explored cells; live enemy visibility is enforced by the server.
    const known = new Set(r.explored[view.faction.id] || []), n = Math.ceil(r.size / 8); g.fillStyle = '#111b1966';
    for (let y = Math.max(0, Math.floor(a.y / 8)); y < Math.min(n, Math.ceil(z.y / 8)); y++) for (let x = Math.max(0, Math.floor(a.x / 8)); x < Math.min(n, Math.ceil(z.x / 8)); x++) if (!known.has(y * n + x)) { const p = this.point(x * 8, y * 8); g.fillRect(p.x, p.y, s * 8 + 1, s * 8 + 1); }
    for (const e of view.entities.filter(e => selection.includes(e.id) && e.route?.length)) {
      g.strokeStyle = '#cbe4b180'; g.lineWidth = 1; g.setLineDash([4, 5]); g.beginPath(); let p = this.point(e.x, e.y); g.moveTo(p.x, p.y); for (const wp of e.route) { p = this.point(wp.x, wp.y); g.lineTo(p.x, p.y); } g.stroke(); g.setLineDash([]);
    }
    if (build && this.mouse) { const x = Math.floor(this.mouse.x), y = Math.floor(this.mouse.y), p = this.point(x, y), d = B[build]; g.fillStyle = '#add4a144'; g.strokeStyle = '#d5e3ba'; g.lineWidth = 2; g.fillRect(p.x, p.y, d.w * s, d.h * s); g.strokeRect(p.x, p.y, d.w * s, d.h * s); g.font = '12px Segoe UI'; g.fillStyle = '#fff2ce'; g.fillText(d.name, p.x, p.y - 8); }
    for(const tile of this.preview) {const p=this.point(tile.x,tile.y);g.fillStyle=tile.reason?'#e6896960':'#a9d6b65c';g.strokeStyle=tile.reason?'#ef9979':'#d7eac2';g.lineWidth=1;g.fillRect(p.x,p.y,s,s);g.strokeRect(p.x+.5,p.y+.5,s-1,s-1);}
    if(this.commandMarker && now-this.commandMarker.at<850) {const p=this.point(this.commandMarker.x,this.commandMarker.y),t=(now-this.commandMarker.at)/850;g.strokeStyle=this.commandMarker.bad?'#f49979':'#e9d29a';g.globalAlpha=1-t;g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y,s*(.4+t),s*(.3+t*.5),0,0,Math.PI*2);g.stroke();g.globalAlpha=1;}
    if (box) { g.strokeStyle = '#d4e7bb'; g.fillStyle = '#a4d7b422'; g.fillRect(box.x, box.y, box.w, box.h); g.strokeRect(box.x, box.y, box.w, box.h); }
    this.drawMini(view);
  }
  resource(n, s, selected, faction) {
    const g = this.ctx, p = this.point(n.x + 0.5, n.y + 0.5); g.save(); g.translate(p.x, p.y);
    if (n.kind === 'wood') { g.fillStyle = '#1b281d66'; g.beginPath(); g.ellipse(s * .25, s * .18, s * .8, s * .4, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6c5137'; g.fillRect(-s * .12, -s * .2, s * .24, s * .65); for (let i = 0; i < 3; i++) { g.fillStyle = ['#354c34', '#4e6741', '#6f8050'][i]; g.beginPath(); g.moveTo(0, -s * (1.3 - i * .27)); g.lineTo(s * (.65 - i * .12), -s * i * .16); g.lineTo(-s * (.65 - i * .12), -s * i * .16); g.closePath(); g.fill(); } }
    else if (n.kind === 'food') { g.fillStyle = '#536e39'; g.beginPath(); g.ellipse(0, 0, s * .45, s * .32, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#d4a06e'; for (let i = 0; i < 4; i++) g.fillRect((i % 2 - .6) * s * .3, (Math.floor(i / 2) - .5) * s * .25, s * .1, s * .1); }
    else { g.fillStyle = resourceColor[n.kind]; g.beginPath(); g.moveTo(-s * .4, s * .2); g.lineTo(-s * .25, -s * .3); g.lineTo(s * .12, -s * .48); g.lineTo(s * .42, -.1 * s); g.lineTo(s * .35, s * .25); g.closePath(); g.fill(); g.strokeStyle = '#e1e3bc66'; g.stroke(); }
    if (n.marked === faction || selected) { g.strokeStyle = selected ? '#ffe0a1' : '#bed8a484'; g.lineWidth = 1; g.strokeRect(-s * .5, -s * .5, s, s); }
    g.restore();
  }
  building(b, view, s, now, selected) {
    const g = this.ctx, d = B[b.kind], p = this.point(b.x, b.y), w = d.w * s, h = d.h * s, color = view.factions.find(f => f.id === b.faction)?.color || '#d6b779';
    g.save(); g.translate(p.x, p.y);
    if (!b.complete) { g.fillStyle = '#8eab9750'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c4d7a8'; g.setLineDash([5, 5]); g.strokeRect(1, 1, w - 2, h - 2); g.setLineDash([]); g.strokeStyle = '#b9a278'; for (let x = 0; x < w; x += s) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } this.bar(g, 0, h + 3, w, (b.progress || 0) / d.work, '#c4d7a8'); if (selected || s > 29) { g.fillStyle = '#efe5c6'; g.font = '10px Segoe UI'; g.fillText(d.name, 0, -4); } g.restore(); return; }
    if (b.kind === 'field') { g.fillStyle = '#635e3c'; g.fillRect(0, 0, w, h); for (let y = 0; y < d.h; y++) for (let x = 0; x < d.w; x++) { g.fillStyle = '#353f27'; g.fillRect(x * s + s * .4, y * s, s * .2, s); g.fillStyle = b.growth >= 1 ? '#d1bc68' : '#8aa557'; const leaf = s * (.1 + .25 * b.growth); g.beginPath(); g.ellipse(x * s + s / 2, y * s + s / 2, leaf, leaf / 2, -.8, 0, 7); g.fill(); } }
    else if (b.kind === 'floor') { g.fillStyle = '#927551'; g.fillRect(0, 0, w, h); g.strokeStyle = '#5c513c'; for (let y = 0; y < 3; y++) { g.beginPath(); g.moveTo(0, y * s / 3); g.lineTo(w, y * s / 3); g.stroke(); } }
    else if (b.kind === 'wall' || b.kind === 'door') { g.fillStyle = '#2c332c'; g.fillRect(s * .15, s * .2, w, h); g.fillStyle = b.kind === 'door' ? '#a18051' : '#9e9b83'; g.fillRect(0, -s * .2, w, h); g.strokeStyle = '#d0c5a2'; g.strokeRect(1, -s * .2 + 1, w - 2, h - 2); g.strokeStyle = '#5b5e4d'; g.beginPath(); g.moveTo(0, s * .3); g.lineTo(w, s * .3); g.stroke(); }
    else if (b.kind === 'bed') { g.fillStyle = '#493f2c'; g.fillRect(1, 1, w, h); g.fillStyle = '#d6cab0'; g.fillRect(s * .1, s * .12, w * .8, s * .5); g.fillStyle = '#829a89'; g.fillRect(s * .1, s * .75, w * .8, h - s * .85); g.strokeStyle = '#acb79c'; g.strokeRect(2, 2, w - 4, h - 4); }
    else if (b.kind === 'table') { g.fillStyle = '#a38051'; g.fillRect(w * .14, h * .2, w * .72, h * .6); g.strokeStyle = '#dac18d'; g.strokeRect(w * .14, h * .2, w * .72, h * .6); g.fillStyle = '#685237'; for (let i = 0; i < 2; i++) { g.fillRect(w * (.2 + i * .4), 0, w * .2, h * .15); g.fillRect(w * (.2 + i * .4), h * .85, w * .2, h * .15); } }
    else if (b.kind === 'stockpile') { g.fillStyle = '#5b5740'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b79c6c'; g.strokeRect(0, 0, w, h); for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? '#a8895c' : '#7f7556'; g.fillRect((i % 4) * s + 3, Math.floor(i / 4) * s + 3, s * .8, s * .7); g.strokeStyle = '#cfbc87'; g.strokeRect((i % 4) * s + 3, Math.floor(i / 4) * s + 3, s * .8, s * .7); } }
    else if (facility(g,b,w,h,s,now,color)) { if(selected){g.fillStyle='#e8e1c2';g.textAlign='center';g.font='12px Segoe UI';g.fillText(d.name,w/2,h+14);} }
    else {
      g.fillStyle = '#19251b70'; g.fillRect(s * .3, s * .4, w, h); g.fillStyle = '#655c49'; g.fillRect(0, 0, w, h); g.fillStyle = '#af9b74'; g.fillRect(0, -s * .4, w, h * .9); g.strokeStyle = '#d2c299'; g.lineWidth = 2; g.strokeRect(1, -s * .4, w - 2, h * .9); g.fillStyle = '#536657'; g.beginPath(); g.moveTo(-s * .15, h * .15); g.lineTo(w / 2, -s * .8); g.lineTo(w + s * .15, h * .15); g.lineTo(w / 2, h * .55); g.closePath(); g.fill(); g.strokeStyle = '#9bad87'; g.stroke();
      g.fillStyle = '#233c34'; g.fillRect(w * .42, h * .64, w * .18, h * .36); g.fillStyle = color; g.fillRect(w * .1, h * .57, w * .13, h * .15); g.fillRect(w * .74, h * .57, w * .13, h * .15);
      if (['workshop', 'kitchen', 'refinery'].includes(b.kind)) { g.fillStyle = '#565449'; g.fillRect(w * .76, -s * .65, s * .45, s * .9); if (b.active?.includes('Produc')) { g.fillStyle = '#cfcec047'; g.beginPath(); g.arc(w * .8 + Math.sin(now / 800) * 3, -s * (1 + now % 1500 / 1500), s * .25, 0, 7); g.fill(); } }
      if (b.kind === 'clinic') { g.fillStyle = '#e5dec3'; g.fillRect(w * .42, -s * .26, w * .16, s * .65); g.fillRect(w * .34, -s * .08, w * .32, s * .25); }
      if (b.kind === 'generator') { g.fillStyle = '#7c9786'; g.beginPath(); g.arc(w / 2, h * .12, s * .7, 0, 7); g.fill(); g.save(); g.translate(w / 2, h * .12); g.rotate(b.powered ? now / 250 : 0); g.strokeStyle = '#d7d3ad'; for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, 0); g.lineTo(s * .5, 0); g.stroke(); } g.restore(); }
      if (b.kind === 'garage' || b.kind === 'fabricator') { g.fillStyle = '#253a32'; g.fillRect(w * .25, h * .45, w * .5, h * .55); g.strokeStyle = '#91bca3'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(w * .25, h * (.45 + i * .13)); g.lineTo(w * .75, h * (.45 + i * .13)); g.stroke(); } }
      if (b.kind === 'turret' || b.kind === 'relay') { g.strokeStyle = '#c5c6ab'; g.lineWidth = s * .14; g.beginPath(); g.moveTo(w / 2, h * .3); g.lineTo(w / 2, -s * 1.2); g.stroke(); g.fillStyle = color; g.fillRect(w / 2, -s * 1.2, s * .5, s * .3); }
      if (selected || s > 29) { g.fillStyle = '#e5e6ce'; g.textAlign = 'center'; g.font = `${Math.min(12, s * .48)}px Segoe UI`; g.fillText(d.name, w / 2, h + 13); }
    }
    if (selected) { g.strokeStyle = '#f2d697'; g.lineWidth = 2; g.strokeRect(-3, -3, w + 6, h + 6); }
    if (b.hp < d.hp) this.bar(g, 0, -s * .9, w, b.hp / d.hp, '#dda078');
    if (d.demand && !b.powered) { g.fillStyle = '#f2c28a'; g.font = 'bold 17px Segoe UI'; g.fillText('ϟ', w / 2, h / 2); }
    g.restore();
  }
  bar(g, x, y, w, value, color) { g.fillStyle = '#15231ce6'; g.fillRect(x, y, w, 4); g.fillStyle = color; g.fillRect(x, y, Math.max(0, Math.min(1, value)) * w, 4); }
  entity(e, view, s, now, selected) {
    const g = this.ctx, pos = this.motion.position(e, now), p = this.point(pos.x, pos.y), color = view.factions.find(f => f.id === e.faction)?.color || '#d19774', moving = e.route?.length > 0, bob = moving ? Math.sin(now / 90) * 1.5 : 0;
    g.save(); g.translate(p.x, p.y);
    g.fillStyle = '#14201870'; g.beginPath(); g.ellipse(s * .12, s * .18, s * (e.type === 'vehicle' ? 1 : .4), s * .25, 0, 0, 7); g.fill();
    if (selected) { g.strokeStyle = '#eed39a'; g.lineWidth = 2; g.beginPath(); g.ellipse(0, s * .18, s * (e.type === 'vehicle' ? 1.2 : .6), s * .35, 0, 0, 7); g.stroke(); }
    if (e.type === 'person') {
      g.fillStyle = '#343c31'; g.fillRect(-s * .2, -s * .05, s * .16, s * .3 + bob); g.fillRect(s * .06, -s * .05, s * .16, s * .3 - bob);
      g.fillStyle = color; g.beginPath(); g.ellipse(0, -s * .22, s * .29, s * .33, 0, 0, 7); g.fill(); g.fillStyle = '#e1be96'; g.beginPath(); g.arc(0, -s * .57 + bob * .25, s * .2, 0, 7); g.fill(); g.fillStyle = '#504d39'; g.fillRect(-s * .2, -s * .8, s * .4, s * .13);
      if (e.drafted) { g.strokeStyle = '#343e36'; g.lineWidth = Math.max(2, s * .11); g.beginPath(); g.moveTo(s * .18, -s * .35); g.lineTo(s * .55, -s * .1); g.stroke(); }
      if (e.cargo) { g.fillStyle = resourceColor[e.cargo.kind]; g.fillRect(s * .18, -s * .12, s * .32, s * .28); g.strokeStyle = '#dfd5a4'; g.strokeRect(s * .18, -s * .12, s * .32, s * .28); }
      if (e.wounded) { g.fillStyle = '#e8b399'; g.font = 'bold 14px Segoe UI'; g.fillText('+', s * .3, -s * .7); }
    } else if (e.type === 'robot') {
      g.strokeStyle = '#38483e'; g.lineWidth = s * .14;
      for (let side = -1; side <= 1; side += 2) { g.beginPath(); g.moveTo(0, -s * .1); g.lineTo(side * s * .5, s * .2 + bob); g.stroke(); }
      g.fillStyle = color; g.fillRect(-s * .35, -s * .6, s * .7, s * .55); g.strokeStyle = '#d6d7ba'; g.lineWidth = 1; g.strokeRect(-s * .35, -s * .6, s * .7, s * .55); g.fillStyle = '#162f2c'; g.fillRect(-s * .15, -s * .48, s * .3, s * .13);
      if (e.kind === 'artillery') { g.strokeStyle = '#b6c5ae'; g.lineWidth = s * .18; g.beginPath(); g.moveTo(0, -s * .4); g.lineTo(s * .85, -s * .8); g.stroke(); }
    } else {
      g.fillStyle = '#2c3730'; g.fillRect(-s, -s * .55, s * 2, s * .3); g.fillRect(-s, s * .28, s * 2, s * .3); g.fillStyle = e.disabled ? '#726d56' : color; g.fillRect(-s * .85, -s * .5, s * 1.7, s * .9); g.strokeStyle = '#d0d5b5'; g.lineWidth = 1.5; g.strokeRect(-s * .85, -s * .5, s * 1.7, s * .9); g.fillStyle = '#304c44'; g.fillRect(-s * .6, -s * .36, s * .45, s * .55);
      if (e.kind === 'tank') { g.fillStyle = '#718b7a'; g.beginPath(); g.ellipse(s * .15, -s * .1, s * .5, s * .4, 0, 0, 7); g.fill(); g.strokeStyle = '#bed0b5'; g.lineWidth = s * .2; g.beginPath(); g.moveTo(s * .25, -s * .12); g.lineTo(s * 1.4, -s * .2); g.stroke(); }
      if (e.kind === 'aircraft') { g.fillStyle = '#b3c1a6'; g.beginPath(); g.moveTo(-s, -s); g.lineTo(s * .4, -s * .2); g.lineTo(-s, s); g.lineTo(-s * .4, 0); g.closePath(); g.fill(); }
      if (e.disabled) { g.strokeStyle = '#efad91'; g.lineWidth = 2; g.beginPath(); g.moveTo(-s * .3, -s * .3); g.lineTo(s * .3, s * .3); g.moveTo(s * .3, -s * .3); g.lineTo(-s * .3, s * .3); g.stroke(); }
    }
    if(!moving && e.type==='person' && ['build','gather','craft','fabricate','research','grow','care'].includes(e.job?.type)) {const work=e.job.type;g.strokeStyle=work==='care'?'#e7c3a2':'#d9cfa6';g.lineWidth=1.7;g.beginPath();g.moveTo(s*.2,-s*.28);g.lineTo(s*.55,-s*(.2+.28*Math.sin(now/150)));g.stroke();if(work==='research'){g.fillStyle='#dec68e';g.fillRect(s*.25,-s*.35,s*.38,s*.24);}if(work==='build'&&now%650<150){g.fillStyle='#e4c276';g.fillRect(s*.6,-s*.2,2,2);}}
    if (selected || e.hp < e.maxHp) this.bar(g, -s * .6, -s * 1.03, s * 1.2, e.hp / e.maxHp, e.hp < e.maxHp * .4 ? '#df9577' : '#b5d2a3');
    if (selected && !this.groupSelection || s > 29 && e.type === 'person') { g.font = '11px Segoe UI'; g.textAlign = 'center'; g.fillStyle = '#14251bea'; const text = e.name; g.fillRect(-g.measureText(text).width / 2 - 4, s * .4, g.measureText(text).width + 8, 15); g.fillStyle = '#efe6cb'; g.fillText(text, 0, s * .4 + 11); }
    g.restore();
    if (e.shot && view.time - e.shot.at < .3) { const t = this.point(e.shot.x, e.shot.y); g.strokeStyle = '#ffe5a1'; g.lineWidth = e.type === 'vehicle' ? 3 : 1.5; g.beginPath(); g.moveTo(p.x, p.y - s * .3); g.lineTo(t.x, t.y); g.stroke(); g.fillStyle = '#fbe2a8'; g.beginPath(); g.arc(t.x, t.y, 5, 0, 7); g.fill(); }
  }
  drawMini(view) {
    const r = view.region, g = this.mx, w = this.mini.width, scale = w / r.size; g.fillStyle = '#16231e'; g.fillRect(0, 0, w, w); if (this.terrain) g.drawImage(this.terrain, 0, 0, w, w);
    const known = new Set(r.explored[view.faction.id] || []), n = Math.ceil(r.size / 8); g.fillStyle = '#13201966'; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!known.has(y * n + x)) g.fillRect(x * 8 * scale, y * 8 * scale, 8 * scale + 1, 8 * scale + 1);
    for (const b of r.buildings.filter(b => b.hp > 0)) { g.fillStyle = view.factions.find(f => f.id === b.faction)?.color || '#e6ba83'; g.fillRect(b.x * scale, b.y * scale, Math.max(2, B[b.kind].w * scale), Math.max(2, B[b.kind].h * scale)); }
    for (const e of view.entities.filter(e => !e.vehicle && e.hp > 0)) { g.fillStyle = e.faction === view.faction.id ? '#d4e4b5' : '#f0996e'; g.fillRect(e.x * scale, e.y * scale, 2, 2); }
    const a = this.world(0, 0), z = this.world(this.width, this.height); g.strokeStyle = '#efdfb3'; g.lineWidth = 1; g.strokeRect(a.x * scale, a.y * scale, (z.x - a.x) * scale, (z.y - a.y) * scale);
  }
}
