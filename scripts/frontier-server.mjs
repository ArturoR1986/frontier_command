import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { Authority } from '../src/frontier/authority.js';
import { journeyQuote } from '../src/frontier/engine.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.FRONTIER_PORT || 4180), host = process.env.FRONTIER_HOST || '127.0.0.1';
const data = path.resolve(process.env.FRONTIER_DATA || path.join(root, 'data'));
await mkdir(data, { recursive: true });
const authority = new Authority(path.join(data, 'world.sqlite'), { size: Number(process.env.FRONTIER_MAP_SIZE || 256) });
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const rates = new Map(), timings = [];
setInterval(()=>{const now=Date.now();for(const [key,rate]of rates)if(now-rate.at>60000)rates.delete(key);},30000).unref(); let shuttingDown = false, ticks = 0;
const send = (res, code, value) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
async function body(req) { let text = ''; for await (const chunk of req) { text += chunk; if (text.length > 65536) throw new Error('Command too large.'); } return JSON.parse(text || '{}'); }
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  try {
    const expectedHosts=new Set([host,'127.0.0.1','localhost','[::1]']); const incoming=new URL(`http://${req.headers.host}`); if(!expectedHosts.has(incoming.hostname)||incoming.port!==String(port))return send(res,403,{error:'Host not allowed.'});
    const url = new URL(req.url, `http://${req.headers.host}`), token = req.headers.authorization?.replace(/^Bearer /, '');
    if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) return send(res, 403, { error: 'Origin not allowed.' });
    if (token && token.length>256) return send(res,401,{error:'Invalid access key.'});
    if (url.pathname.startsWith('/api/')) {
      const rateAccount=token?authority.account(token):null;
      const key = `${req.socket.remoteAddress}:${rateAccount?.token || 'guest'}`, now = Date.now(), rate = rates.get(key) || { at: now, count: 0 };
      if (now - rate.at > 1000) { rate.at = now; rate.count = 0; } rate.count++; rates.set(key, rate);
      if (rate.count > 25) return send(res, 429, { error: 'Too many requests; try again shortly.' });
      if (req.method === 'GET' && url.pathname === '/api/lobby') return send(res, 200, authority.lobby());
      if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { status: 'running', time: authority.world.time, clients: rates.size, tickP95: [...timings].sort((a, b) => a - b)[Math.floor(timings.length * 0.95)] || 0 });
      if (req.method === 'POST' && url.pathname === '/api/join') { const c = await body(req); return send(res, 200, authority.join(c.faction, c.name)); }
      const account = rateAccount; if (!account) return send(res, 401, { error: 'Colony access key required.' });
      if (req.method === 'GET' && url.pathname === '/api/state') return send(res, 200, authority.view(token, url.searchParams.get('region'), url.searchParams.get('terrain') !== '0', Number(url.searchParams.get('terrainRevision') ?? -1)));
      if (req.method === 'POST' && url.pathname === '/api/command') { const c = await body(req); return send(res, 200, authority.execute(token, c.id, c.command)); }
      if (req.method === 'POST' && url.pathname === '/api/quote') { const c = await body(req); return send(res, 200, journeyQuote(authority.world, account.faction, c.region, c.destination, c.ids || [], c.cargo || {})); }
      return send(res, 404, { error: 'Unknown endpoint.' });
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, ''); if (!relative) relative = 'frontier.html';
    // Serve only explicit public assets. The database, tests and source authority never leave the server.
    if (!(relative === 'frontier.html' || relative.startsWith('src/frontier/')) || relative.includes('authority') || relative.includes('..') || !['.html', '.js', '.css', '.svg', '.png'].includes(path.extname(relative))) return send(res, 404, { error: 'Not found.' });
    const file = path.resolve(root, relative); if (!file.startsWith(root + path.sep)) return send(res, 404, { error: 'Not found.' });
    const content = await readFile(file); res.writeHead(200, { 'Content-Type': mime[path.extname(file)], 'Cache-Control': 'no-cache' }); res.end(req.method === 'HEAD' ? undefined : content);
  } catch (e) { send(res, e.code === 'ENOENT' ? 404 : 400, { error: e.message }); }
});
const interval = setInterval(() => {
  if (shuttingDown) return;
  const start = performance.now();
  try { authority.tick(0.1); if (++ticks % 600 === 0) authority.checkpoint(); timings.push(performance.now() - start); if (timings.length > 600) timings.shift(); }
  catch (e) { console.error('Simulation stopped; durable input retained:', e); shutdown(1); }
}, 100);
function shutdown(code = 0) { if (shuttingDown) return; shuttingDown = true; clearInterval(interval); server.close(() => { authority.close(code === 0); process.exit(code); }); }
process.on('SIGINT', () => shutdown()); process.on('SIGTERM', () => shutdown());
server.listen(port, host, () => console.log(`Frontier Command persistent world: http://${host}:${port}\nDatabase: ${path.join(data, 'world.sqlite')}`));
