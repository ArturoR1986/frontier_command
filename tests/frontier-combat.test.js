import test from 'node:test';import assert from 'node:assert/strict';import {combatFixture} from '../src/frontier/combat-fixture.js';import {command,step} from '../src/frontier/engine.js';
test('prepared forces can cross a real mountain passage, engage and retreat while crew identities persist',()=>{
  const w=combatFixture(),r=w.regions[0],tank=w.entities.find(e=>e.faction==='f0'&&e.kind==='tank'),crew=[...tank.crew],robots=w.entities.filter(e=>e.faction==='f0'&&e.type==='robot'&&e.kind==='guard');
  command(w,'f0',{type:'order',region:r.id,order:'attackMove',ids:robots.map(e=>e.id),x:80,y:60});for(let i=0;i<200;i++)step(w,.1);
  assert.ok(w.entities.some(e=>e.faction==='f1'&&e.region===r.id&&e.hp<e.maxHp));assert.deepEqual(tank.crew,crew);const survivors=robots.filter(e=>e.hp>0);assert.ok(survivors.length);command(w,'f0',{type:'order',region:r.id,order:'move',ids:survivors.map(e=>e.id),x:60,y:62});for(let i=0;i<300;i++)step(w,.1);assert.ok(survivors.some(e=>e.hp>0&&e.x<72));
});
