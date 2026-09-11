import { STRUCTURES as B } from './catalog.js';
// Orthogonally connected strokes keep diagonal wall gestures gap-free.
export function strokeTiles(a, b, limit = 144) {
  let x = Math.floor(a.x), y = Math.floor(a.y); const tx = Math.floor(b.x), ty = Math.floor(b.y), points = [{x,y}];
  const dx = Math.abs(tx-x), dy = Math.abs(ty-y), sx = Math.sign(tx-x), sy = Math.sign(ty-y); let ix=0, iy=0;
  while ((x!==tx || y!==ty) && points.length < limit) { if (x!==tx && (y===ty || (ix+.5)*dy <= (iy+.5)*dx)) {x+=sx;ix++;} else {y+=sy;iy++;} points.push({x,y}); }
  return points;
}
export function areaTiles(a,b,limit=144) { const out=[]; for(let y=Math.min(a.y,b.y);y<=Math.max(a.y,b.y)&&out.length<limit;y++) for(let x=Math.min(a.x,b.x);x<=Math.max(a.x,b.x)&&out.length<limit;x++) out.push({x,y}); return out; }
export function groundReason(r,faction,kind,x,y) {
  const d=B[kind]; if(!d || !Number.isInteger(x)||!Number.isInteger(y)) return 'Invalid tile';
  if(r.owner && r.owner!==faction) return 'Other colony';
  const known=new Set(r.explored[faction]||[]), stride=Math.ceil(r.size/8);
  for(let yy=y;yy<y+d.h;yy++) for(let xx=x;xx<x+d.w;xx++) {
    if(xx<0||yy<0||xx>=r.size||yy>=r.size) return 'Map edge';
    if(!known.has(Math.floor(yy/8)*stride+Math.floor(xx/8))) return 'Unexplored';
    if(r.terrain[yy*r.size+xx]>=2) return 'Rock or water';
    if(r.buildings.some(b=>b.hp>0&&!(b.kind==='floor'&&kind!=='floor')&&xx>=b.x&&yy>=b.y&&xx<b.x+B[b.kind].w&&yy<b.y+B[b.kind].h)) return 'Occupied';
    if(r.nodes.some(n=>n.amount>0&&n.x===xx&&n.y===yy)) return 'Gather resource first';
  }
  return '';
}
