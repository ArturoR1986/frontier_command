import test from 'node:test';import assert from 'node:assert/strict';
import {newWorld,command,step,stock} from '../src/frontier/engine.js';import {excavationPath} from '../src/frontier/excavation.js';import {STRUCTURES as B} from '../src/frontier/catalog.js';import {route} from '../src/frontier/terrain.js';
test('mining an exposed access tunnel opens buried ore through paid worker time and physical cargo',()=>{
  const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0],people=w.entities.filter(e=>e.faction==='f0');r.terrain.fill(0);r.nodes=[];r.topology++;r.explored.f0=Array.from({length:256},(_,i)=>i);
  for(let y=42;y<55;y++)for(let x=50;x<61;x++)r.terrain[y*r.size+x]=2;r.topology++;
  const ore={id:'buried-ore',x:55,y:48,kind:'ore',amount:12,marked:'f0'};r.nodes.push(ore);const path=excavationPath(r,people[0],ore,B,'f0');assert.ok(path.length>=2);assert.equal(route(r,people[0],ore,B,'f0',true),null);const before=stock(r,'f0').ore;
  for(const face of path.slice(0,-1)){command(w,'f0',{type:'dig',region:r.id,...face});for(let i=0;i<220;i++)step(w,1);assert.equal(r.terrain[face.y*r.size+face.x],0);}
  for(let i=0;i<260;i++)step(w,1);assert.equal(stock(r,'f0').ore,before+12);assert.equal(ore.amount,0);assert.ok((r.terrainRevision||0)>=path.length);
});
test('a mining plan cannot cross a river or carve through a constructed barrier',()=>{
  const w=newWorld(1986,128),r=w.regions[0];r.terrain.fill(0);r.buildings=[];for(let y=0;y<128;y++)r.terrain[y*128+45]=3;r.terrain[64*128+50]=2;r.topology++;assert.deepEqual(excavationPath(r,{x:30,y:64},{x:50,y:64},B,'f0'),[]);r.terrain.fill(0);r.terrain[64*128+50]=2;for(let y=0;y<128;y++)r.buildings.push({id:'wall'+y,x:45,y,kind:'wall',faction:'f0',hp:100});r.topology++;assert.deepEqual(excavationPath(r,{x:30,y:64},{x:50,y:64},B,'f0'),[]);
});

test('many blocked deposits cannot starve a reachable gathering job',()=>{
  const w=newWorld(1986,128);w.factions.forEach(f=>f.ai=false);const r=w.regions[0],people=w.entities.filter(e=>e.faction==='f0');r.terrain.fill(0);r.nodes=[];r.topology++;
  for(let y=5;y<45;y++)for(let x=5;x<45;x++)r.terrain[y*128+x]=2;
  for(let i=0;i<80;i++)r.nodes.push({id:'blocked'+i,x:23+i%20,y:25+Math.floor(i/20),kind:'ore',amount:100,marked:'f0'});
  r.nodes.push({id:'open-ore',x:110,y:64,kind:'ore',amount:12,marked:'f0'});r.topology++;const before=stock(r,'f0').ore;
  for(let i=0;i<180;i++)step(w,1);assert.equal(stock(r,'f0').ore,before+12);assert.ok(people.every(e=>e.activity!=='Blocked route — choosing other work'));
});
