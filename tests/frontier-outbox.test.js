import test from 'node:test';import assert from 'node:assert/strict';import {CommandOutbox} from '../src/frontier/outbox.js';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};};
test('disconnect preserves multiple ordered commands and reload retries their same receipt ids',async()=>{
  const s=storage();let online=false;const sent=[];const q=new CommandOutbox(s,'f0',async r=>{sent.push(r.id);if(!online)throw Error('Offline');return {ok:true};});
  await assert.rejects(q.enqueue({id:'first',command:{type:'build'}}));await assert.rejects(q.enqueue({id:'second',command:{type:'research'}}));assert.deepEqual(q.pending.map(r=>r.id),['first','second']);online=true;const replay=new CommandOutbox(s,'f0',async r=>{sent.push(r.id);return {ok:true};});await replay.flush();assert.deepEqual(sent.slice(-2),['first','second']);assert.deepEqual(JSON.parse(s.getItem('f0')),[]);
});
test('commands appended during a request are preserved and acknowledged exactly once',async()=>{
  const s=storage();let finish;const ack=[];const q=new CommandOutbox(s,'f0',r=>r.id==='first'?new Promise(resolve=>finish=resolve):Promise.resolve({ok:true}),(_,r)=>ack.push(r.id));const first=q.enqueue({id:'first'});q.enqueue({id:'second'});finish({ok:true});await first;assert.deepEqual(ack,['first','second']);assert.equal(q.pending.length,0);
});
test('storage failure cannot silently transmit or discard an order',async()=>{
  let sent=0;const q=new CommandOutbox({getItem:()=>null,setItem:()=>{throw Error('Quota');}},'f0',async()=>sent++);assert.throws(()=>q.enqueue({id:'a'}),/Quota/);assert.equal(sent,0);
});
