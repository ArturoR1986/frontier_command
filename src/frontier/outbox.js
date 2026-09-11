// Persist before transmitting, remove only after acknowledgement; reuse the original receipt id.
export class CommandOutbox {
  constructor(storage,key,transmit,acknowledge=()=>{}) {this.storage=storage;this.key=key;this.transmit=transmit;this.acknowledge=acknowledge;this.pending=JSON.parse(storage.getItem(key)||'[]');if(!Array.isArray(this.pending))throw Error('Stored orders need recovery.');this.running=null;}
  save(next){this.storage.setItem(this.key,JSON.stringify(next));this.pending=next;}
  enqueue(request){if(!this.pending.some(r=>r.id===request.id))this.save([...this.pending,request]);return this.flush();}
  flush(){if(this.running)return this.running;this.running=this.drain().finally(()=>this.running=null);return this.running;}
  async drain(){let last;while(this.pending.length){const request=this.pending[0];last=await this.transmit(request);this.save(this.pending.slice(1));this.acknowledge(last,request);}return last;}
}
