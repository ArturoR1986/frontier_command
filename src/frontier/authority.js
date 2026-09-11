import { DatabaseSync } from 'node:sqlite';
import { randomBytes, createHash } from 'node:crypto';
import { newWorld, command, step, factionOf, regionOf, locals, explored, allied, stock } from './engine.js';

const digest = s => createHash('sha256').update(s).digest('hex');
export class Authority {
  constructor(filename, options = {}) {
    this.db = new DatabaseSync(filename);
    this.db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; CREATE TABLE IF NOT EXISTS checkpoints (id INTEGER PRIMARY KEY CHECK(id=1), seq INTEGER NOT NULL, world TEXT NOT NULL); CREATE TABLE IF NOT EXISTS journal (seq INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT NOT NULL); CREATE TABLE IF NOT EXISTS accounts (token TEXT PRIMARY KEY, faction TEXT UNIQUE NOT NULL, name TEXT NOT NULL); CREATE TABLE IF NOT EXISTS receipts (account TEXT NOT NULL, id TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY(account,id));');
    const saved = this.db.prepare('SELECT * FROM checkpoints WHERE id=1').get();
    this.world = saved ? JSON.parse(saved.world) : newWorld(options.seed || 1986, options.size || 256);
    if (this.world.schema !== 3) throw new Error('Unsupported world schema; preserve the database and use its matching server.');
    const tail = this.db.prepare('SELECT event FROM journal WHERE seq>? ORDER BY seq').all(saved?.seq || 0);
    for (const { event } of tail) this.apply(JSON.parse(event));
    this.checkpoint(); this.closed = false;
  }
  apply(event) {
    if (event.type === 'tick') { for (let i = 0; i < event.count; i++) step(this.world, event.dt); }
    if (event.type === 'command') command(this.world, event.faction, event.command);
    if (event.type === 'join') { const f = factionOf(this.world, event.faction); f.claimed = true; f.ai = false; f.name = event.name; }
  }
  transaction(fn) { this.db.exec('BEGIN IMMEDIATE'); try { const result = fn(); this.db.exec('COMMIT'); return result; } catch (e) { this.db.exec('ROLLBACK'); throw e; } }
  append(event) { this.db.prepare('INSERT INTO journal(event) VALUES(?)').run(JSON.stringify(event)); }
  checkpoint() {
    const seq = this.db.prepare('SELECT COALESCE(MAX(seq),0) AS seq FROM journal').get().seq;
    this.transaction(() => { this.db.prepare('INSERT OR REPLACE INTO checkpoints(id,seq,world) VALUES(1,?,?)').run(seq, JSON.stringify(this.world)); this.db.prepare('DELETE FROM journal WHERE seq<=?').run(seq); });
  }
  account(token) { if (typeof token !== 'string' || token.length > 256) return null; return this.db.prepare('SELECT faction,name,token FROM accounts WHERE token=?').get(digest(token)) || null; }
  join(faction, name) {
    const f = factionOf(this.world, faction);
    if (!f || f.claimed) throw new Error('This colony already has an owner. Restore its access key or choose another colony.');
    if (typeof name !== 'string' || name.trim().length < 2 || name.length > 40) throw new Error('Use a colony name between 2 and 40 characters.');
    const token = randomBytes(32).toString('base64url'), event = { type: 'join', faction, name: name.trim() };
    this.transaction(() => { this.db.prepare('INSERT INTO accounts(token,faction,name) VALUES(?,?,?)').run(digest(token), faction, name.trim()); this.append(event); });
    this.apply(event); return { token, faction, name: name.trim() };
  }
  execute(token, requestId, payload) {
    const a = this.account(token); if (!a) throw new Error('Restore your colony access key to reconnect.');
    if (typeof requestId !== 'string' || !/^[a-zA-Z0-9_-]{8,96}$/.test(requestId)) throw new Error('A valid unique command id is required.');
    const old = this.db.prepare('SELECT result FROM receipts WHERE account=? AND id=?').get(a.token, requestId);
    if (old) return { ...JSON.parse(old.result), replayed: true };
    // Validation and mutation happen on a candidate. A rejected or failed transaction
    // cannot leave a half-applied command in the authoritative world.
    const candidate = structuredClone(this.world); let result;
    try { result = { ok: true, ...command(candidate, a.faction, payload) }; } catch (e) { result = { ok: false, message: e.message }; }
    this.transaction(() => {
      if (result.ok) this.append({ type: 'command', faction: a.faction, command: payload });
      this.db.prepare('INSERT INTO receipts(account,id,result) VALUES(?,?,?)').run(a.token, requestId, JSON.stringify(result));
    });
    if (result.ok) this.world = candidate;
    return result;
  }
  tick(dt = 0.1, count = 1) {
    if (!Number.isFinite(dt) || dt <= 0 || dt > 60 || !Number.isInteger(count) || count < 1 || count > 1000) throw new Error('Invalid tick batch.');
    const event = { type: 'tick', dt, count };
    // Durable input precedes simulation. If execution stops, recovery replays the input.
    this.transaction(() => this.append(event)); this.apply(event);
  }
  lobby() { return { colonies: this.world.factions.map(f => ({ id: f.id, name: f.name, color: f.color, claimed: f.claimed, realm: regionOf(this.world, f.home).realm })), policy: this.world.policy }; }
  view(token, requested, includeTerrain = true, terrainRevision = -1) {
    const a = this.account(token); if (!a) throw new Error('Invalid colony access key.');
    const w = this.world, f = factionOf(w, a.faction), r = regionOf(w, requested) || regionOf(w, f.home);
    includeTerrain ||= terrainRevision !== (r.terrainRevision || 0);
    const vision = e => e.faction === f.id || allied(w, f.id, e.faction) || explored(r, f.id, e.x, e.y) && locals(w, r).some(p => p.faction === f.id && Math.hypot(e.x - p.x, e.y - p.y) < 22);
    const entities = w.entities.filter(e => e.region === r.id && (e.faction === f.id || !e.vehicle && vision(e))).map(e => {
      if (e.faction === f.id) return e;
      return { id: e.id, name: e.name, type: e.type, kind: e.kind, faction: e.faction, x: e.x, y: e.y, hp: e.hp, maxHp: e.maxHp, disabled: e.disabled, shot: e.shot };
    });
    return {
      scenario: w.scenario, schema: w.schema, time: w.time, revision: w.revision, faction: f, policy: w.policy,
      region: { ...r, terrain: includeTerrain ? r.terrain : undefined, fertility: includeTerrain ? r.fertility : undefined, explored: { [f.id]: r.explored[f.id] || [] }, buildings: r.buildings.filter(b => b.faction === f.id || vision(b)).map(b => b.faction === f.id ? b : { id: b.id, faction: b.faction, kind: b.kind, x: b.x, y: b.y, hp: b.hp, complete: b.complete }), nodes: r.nodes.filter(n => explored(r, f.id, n.x, n.y)), drops: r.drops.filter(n => explored(r, f.id, n.x, n.y)) },
      entities, stocks: stock(r, f.id), factions: w.factions.map(o => ({ id: o.id, name: o.name, color: o.color, home: o.home, subjectOf: o.subjectOf })),
      world: w.regions.map(n => ({ id: n.id, name: n.name, realm: n.realm, gx: n.gx, gy: n.gy, owner: n.owner, resource: n.resource, occupation: n.occupation, distanceKm: n.distanceKm })),
      journeys: w.journeys.filter(j => j.faction === f.id), offers: w.offers.filter(o => o.from === f.id || o.to === f.id), treaties: w.treaties.filter(t => t.parties.includes(f.id)), events: w.events.filter(e => !e.faction || e.faction === f.id).slice(-50), victories: w.victories,
      roster: w.entities.filter(e => e.faction === f.id && e.type === 'person').map(e => ({ id: e.id, name: e.name, hp: e.hp, region: e.region, journey: e.journey, vehicle: e.vehicle, activity: e.activity, hunger: e.hunger, rest: e.rest, specialty: e.specialty }))
    };
  }
  close(checkpoint = true) { if (this.closed) return; if (checkpoint) this.checkpoint(); this.db.close(); this.closed = true; }
}
