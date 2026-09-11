import test from 'node:test';
import assert from 'node:assert/strict';
import {strokeTiles,areaTiles} from '../src/frontier/planning.js';
import {MotionBuffer} from '../src/frontier/motion.js';
import {newWorld,command,makeBuilding,step,stock} from '../src/frontier/engine.js';
import {Authority} from '../src/frontier/authority.js';
import {mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
test('freehand wall strokes are connected in all directions, with bounded floor areas',()=>{
  for(const end of [{x:7,y:3},{x:-7,y:3},{x:-7,y:-3},{x:0,y:0}]){const p=strokeTiles({x:0,y:0},end);assert.deepEqual(p.at(-1),end);for(let i=1;i<p.length;i++)assert.equal(Math.abs(p[i].x-p[i-1].x)+Math.abs(p[i].y-p[i-1].y),1);assert.equal(new Set(p.map(p=>p.x+','+p.y)).size,p.length);}
  assert.equal(strokeTiles({x:0,y:0},{x:10000,y:10000}).length,144);assert.equal(areaTiles({x:4,y:5},{x:2,y:3}).length,9);assert.equal(areaTiles({x:0,y:0},{x:1000,y:1000}).length,144);
});
test('movement renders between real snapshots without extrapolating or carrying positions across regions',()=>{
  const b=new MotionBuffer(100),e={id:'p',x:0,y:0};b.push([e],0,'a');b.push([{...e,x:2}],200,'a');assert.equal(b.position({...e,x:2},200).x,1);assert.equal(b.position({...e,x:2},1000).x,2);b.push([{...e,x:50}],1100,'b');assert.equal(b.position({...e,x:50},1100).x,50);
});
test('batch plans skip occupied tiles, deduplicate, preserve bills and reject oversized requests before mutation',()=>{
  const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0];r.terrain.fill(0);r.nodes=[];r.topology++;r.explored.f0=Array.from({length:256},(_,i)=>i);const x=r.start.x-10,y=r.start.y-6;
  const before=stock(r,'f0').stone,result=command(w,'f0',{type:'buildBatch',region:r.id,kind:'wall',tiles:[{x,y},{x:x+1,y},{x,y},{x:r.start.x,y:r.start.y}]});assert.equal(result.ids.length,2);assert.equal(result.skipped.length,1);assert.equal(stock(r,'f0').stone,before);
  const count=r.buildings.length;assert.throws(()=>command(w,'f0',{type:'buildBatch',region:r.id,kind:'wall',tiles:Array(145).fill({x,y})}));assert.equal(r.buildings.length,count);
  for(let i=0;i<150;i++)step(w,1);assert.ok(result.ids.every(id=>r.buildings.find(b=>b.id===id).complete));assert.equal(stock(r,'f0').stone,before-8);
});
test('appointing a researcher produces actual research despite their previous higher-priority jobs',()=>{
  const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0],e=w.entities.find(e=>e.faction==='f0');makeBuilding(w,r,'f0','laboratory',r.start.x-6,r.start.y,true);e.priorities.gather=1;
  command(w,'f0',{type:'research',region:r.id,kind:'tools'});command(w,'f0',{type:'researcher',region:r.id,id:e.id});for(let i=0;i<120;i++)step(w,1);assert.ok(w.factions[0].research.work>30);assert.equal(e.priorities.research,1);assert.equal(e.priorities.gather,2);
});
test('terrain is sent initially and after excavation, not after ordinary building topology changes',()=>{
  const dir=mkdtempSync(join(tmpdir(),'frontier-terrain-'));try{const a=new Authority(join(dir,'world.sqlite'),{size:128});const {token}=a.join('f0','Terrain test');const r=a.world.regions[0];assert.ok(a.view(token,r.id,false).region.terrain);assert.equal(a.view(token,r.id,false,0).region.terrain,undefined);r.topology++;assert.equal(a.view(token,r.id,false,0).region.terrain,undefined);r.terrainRevision=1;assert.ok(a.view(token,r.id,false,0).region.terrain);a.close();}finally{assert.ok(dir.startsWith(join(tmpdir(),'frontier-terrain-')));rmSync(dir,{recursive:true,force:true});}
});

test('floors retain their layer when furniture is built above them and do not invalidate navigation',()=>{
  const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0];r.terrain.fill(0);r.nodes=[];r.topology++;r.explored.f0=Array.from({length:256},(_,i)=>i);const x=r.start.x-8,y=r.start.y-5,version=r.topology;
  const result=command(w,'f0',{type:'buildBatch',region:r.id,kind:'floor',tiles:areaTiles({x,y},{x:x+3,y:y+3})});assert.equal(r.topology,version);for(let i=0;i<180;i++)step(w,1);assert.ok(result.ids.every(id=>r.buildings.find(b=>b.id===id).complete));
  const bed=command(w,'f0',{type:'build',region:r.id,kind:'bed',x:x+1,y:y+1});assert.ok(bed.id);assert.ok(r.buildings.find(b=>b.id===result.ids[0]).hp>0);
});

test('pioneers eat unloaded supplies and recover outdoors before a permanent camp exists',()=>{
  const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0],people=w.entities.filter(e=>e.faction==='f0');r.buildings=[];r.nodes=[];r.terrain.fill(0);r.topology++;r.drops=[{id:'provisions',x:20,y:20,kind:'food',amount:10,faction:'f0'}];
  for(const e of people){e.x=20;e.y=20;e.hunger=5;e.rest=5;e.job=null;e.cargo=null;}
  for(let i=0;i<600;i++)step(w,1);assert.ok(people.every(e=>e.hunger>18&&e.rest>25&&e.hp>80));assert.ok((r.drops.find(d=>d.id==='provisions')?.amount||0)<10);
});
test('crowded workers separate into visible positions without crossing a rock wall',()=>{
  const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0],people=w.entities.filter(e=>e.faction==='f0');r.buildings=[];r.nodes=[];r.terrain.fill(0);for(let y=0;y<r.size;y++)r.terrain[y*r.size+19]=2;r.topology++;
  for(const e of people){e.x=20.5;e.y=20.5;e.drafted=true;e.job=null;}
  for(let i=0;i<30;i++)step(w,.1);for(let i=0;i<people.length;i++){assert.ok(people[i].x>=20);for(let j=i+1;j<people.length;j++)assert.ok(Math.hypot(people[i].x-people[j].x,people[i].y-people[j].y)>.5);}
});

test('a hungry exhausted crew leaves a safely parked vehicle with the same identity and skills',async()=>{
  const {makeMachine}=await import('../src/frontier/engine.js');const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0],e=w.entities.find(e=>e.faction==='f0'),skills=structuredClone(e.skills),v=makeMachine(w,'f0',r.id,'hauler',e.x+1,e.y);v.fuel=40;
  command(w,'f0',{type:'board',region:r.id,ids:[e.id],vehicle:v.id});e.hunger=20;e.rest=15;step(w,.1);assert.equal(e.vehicle,null);assert.equal(e.region,r.id);assert.deepEqual(e.skills,skills);assert.equal(v.crew.length,0);assert.equal(e.hp,100);assert.ok(w.events.some(n=>n.text.includes('crew break')));
});
