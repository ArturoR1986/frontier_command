import {request as httpRequest} from 'node:http';
import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';
const dir=await mkdtemp(path.join(tmpdir(),'frontier-http-')),entry=process.argv.includes('--package')?'dist/frontier-command/scripts/frontier-server.mjs':'scripts/frontier-server.mjs';
const child=spawn(process.execPath,[entry],{env:{...process.env,FRONTIER_DATA:dir,FRONTIER_PORT:'4187',FRONTIER_MAP_SIZE:'128'},stdio:['pipe','pipe','pipe']});let stderr='';child.stderr.on('data',c=>stderr+=c);
try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Server startup timeout: '+stderr)),10000);child.stdout.once('data',()=>{clearTimeout(timer);resolve();});child.once('error',reject);child.once('exit',code=>{clearTimeout(timer);reject(Error('Server exit '+code+': '+stderr));});});
  const base='http://127.0.0.1:4187';let token='';async function request(url,data){const res=await fetch(base+url,{method:data?'POST':'GET',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});return {status:res.status,body:await res.json()};}
  assert.equal(await new Promise((resolve,reject)=>{const req=httpRequest(base+'/api/lobby',{headers:{Host:'untrusted.example:4187'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();}),403);
  const page=await fetch(base+'/');assert.equal(page.status,200);assert.ok((await page.text()).includes('/src/frontier/client.js'));assert.equal((await fetch(base+'/src/frontier/motion.js')).status,200);assert.equal((await request('/api/state')).status,401);
  const joined=await request('/api/join',{faction:'f0',name:'Package review'});assert.equal(joined.status,200);token=joined.body.token;
  const compressed=await fetch(base+'/api/state',{headers:{Authorization:'Bearer '+token,'Accept-Encoding':'gzip'}});assert.equal(compressed.headers.get('content-encoding'),'gzip');const first=await compressed.json();assert.equal(first.roster.length,4);assert.equal(first.world.length,18);assert.equal(first.region.size,128);assert.ok(first.region.terrain);
  const lean=await request('/api/state?terrain=0&terrainRevision=0');assert.equal(lean.body.region.terrain,undefined);
  const id='smoke_researcher_01',payload={id,command:{type:'researcher',region:first.region.id,id:first.roster[0].id}};assert.equal((await request('/api/command',payload)).body.ok,true);assert.equal((await request('/api/command',payload)).body.replayed,true);
  assert.equal((await fetch(base+'/data/world.sqlite')).status,404);assert.equal((await fetch(base+'/src/frontier/authority.js')).status,404);
  console.log('HTTP '+(process.argv.includes('--package')?'package':'source')+' smoke passed: boot, assets, auth, two-realm world, terrain cache, command receipt, private files.');
} finally {child.stdin.end('quit\n');await new Promise(resolve=>child.exitCode!==null?resolve():child.once('exit',resolve));assert.ok(dir.startsWith(path.join(tmpdir(),'frontier-http-')));await rm(dir,{recursive:true,force:true});}
