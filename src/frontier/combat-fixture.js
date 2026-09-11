import {newWorld,makeBuilding,makeMachine,command,reveal} from './engine.js';
import {TECH,emptyStock} from './catalog.js';
export function combatFixture() {
  const w=newWorld(1986,128),r=w.regions[0],f=w.factions[0];w.scenario='COMBAT REHEARSAL · prepared late-game equipment; not normal progression';w.factions.forEach(f=>f.ai=false);f.tech=Object.keys(TECH);r.terrain.fill(0);r.nodes=[];r.topology++;r.terrainRevision=1;
  // Two passages create a choice between the central lane and a wider southern flank.
  for(let y=8;y<110;y++)if(y<57||y>66&&y<87||y>95)for(let x=70;x<74;x++)r.terrain[y*r.size+x]=2;
  const core=r.buildings[0];core.inventory={...emptyStock(),wood:500,stone:400,ore:300,food:250,meals:80,parts:180,fuel:100,medicine:20};
  for(const [kind,x,y]of [['workshop',32,53],['laboratory',37,53],['generator',45,53],['garage',48,46],['fabricator',55,47],['clinic',31,69],['field',31,77],['kitchen',40,73],['bed',31,62],['bed',33,62],['table',35,62]]) makeBuilding(w,r,f.id,kind,x,y,true);
  const crew=w.entities.filter(e=>e.faction===f.id);crew[0].x=55;crew[0].y=65;crew[1].x=55;crew[1].y=66;const tank=makeMachine(w,f.id,r.id,'tank',56,65);tank.fuel=100;command(w,f.id,{type:'board',region:r.id,ids:[crew[0].id,crew[1].id],vehicle:tank.id});
  for(let i=0;i<5;i++)makeMachine(w,f.id,r.id,'guard',60+i%2*2,58+Math.floor(i/2)*3);
  makeMachine(w,f.id,r.id,'artillery',51,59);makeMachine(w,f.id,r.id,'scout',60,73);
  for(let i=0;i<6;i++)makeMachine(w,'f1',r.id,'guard',86+i%2*2,58+Math.floor(i/2)*3);
  makeMachine(w,'f1',r.id,'artillery',95,64);makeMachine(w,'f1',r.id,'artillery',94,68);
  w.treaties.push({id:'rehearsal-war',kind:'war',parties:['f0','f1'],effective:0});reveal(w);return w;
}
