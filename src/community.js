export const CHARTERS = {
  balanced: { name: 'Balanced', work: 1, fatigue: 1, hunger: 1, care: 1, description: 'Steady work, normal provisions and recovery.' },
  recovery: { name: 'Recovery', work: 0.8, fatigue: 0.7, hunger: 1, care: 1.7, description: '20% slower work; faster treatment and rest, lower fatigue.' },
  industry: { name: 'Industry', work: 1.25, fatigue: 1.6, hunger: 1.4, care: 0.85, description: '25% faster work; 60% more fatigue and 40% more food need.' }
};
export function initializeCommunity(s) {
  s.community ||= { charter: 'balanced', treated: 0, sharedMeals: 0, achievement: false };
  for (const p of s.people) {
    p.drafted ??= false; p.caregiver ??= p.role === 'Grower'; p.wounded ??= false;
    p.social ??= 70; p.home ??= null; p.memories ??= []; p.suspended ??= null;
  }
  s.sites ||= [
    { id: s.nextId++, x: 9, y: 12, kind: 'water', name: 'Spillway Station', guards: 0, restored: false, activated: false, building: null, description: 'Restore clean-water pumps. Farms grow 25% faster.' },
    { id: s.nextId++, x: 46, y: 22, kind: 'archive', name: 'Survey Archive', guards: 2, restored: false, activated: false, building: null, description: 'Recover field knowledge. Research runs twice as fast.' },
    { id: s.nextId++, x: 51, y: 36, kind: 'signal', name: 'Longwatch Relay', guards: 3, restored: false, activated: false, building: null, description: 'Rebuild the basin warning network. Contact warnings gain 60 seconds.' }
  ];
}
export function remember(p, time, text) { p.memories.push({ time, text }); p.memories = p.memories.slice(-4); }
export function setCharter(s, charter) {
  if (!Object.hasOwn(CHARTERS, charter)) return false;
  s.community.charter = charter;
  return true;
}
export function setDuty(s, ids, drafted) {
  for (const p of s.people.filter(p => ids.includes(p.id))) {
    if (p.drafted === drafted) continue;
    if (drafted) { p.suspended = p.job ? structuredClone(p.job) : null; p.job = null; }
    else { p.job = p.suspended; p.suspended = null; }
    p.drafted = drafted; p.direct = false; p.route = []; p.routeVersion = -1; p.wait = 0;
    p.activity = drafted ? 'Holding field position' : 'Returning to civilian work';
  }
}
export function assignHome(s, id, homeId) {
  const p = s.people.find(p => p.id === id), home = s.buildings.find(b => b.id === homeId && b.complete && ['habitat', 'hub'].includes(b.kind));
  if (!p || !home || s.people.filter(p => p.home === homeId && p.id !== id).length >= 4) return false;
  p.home = homeId; return true;
}
export function cohesion(s) { return s.people.length ? s.people.reduce((n, p) => n + p.social, 0) / s.people.length : 0; }
