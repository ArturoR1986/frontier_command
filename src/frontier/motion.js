// Render delayed authoritative samples. Never extrapolate through walls or invent arrivals.
export class MotionBuffer {
  constructor(delay=180) { this.delay=delay; this.samples=[]; }
  push(entities,at,region) { if(this.region!==region) {this.samples=[];this.region=region;} this.samples.push({at,entities:new Map(entities.map(e=>[e.id,{x:e.x,y:e.y,vehicle:e.vehicle,journey:e.journey}]))}); while(this.samples.length>8) this.samples.shift(); }
  position(e,now) {
    const time=now-this.delay; if(!this.samples.length) return e;
    let a=this.samples[0],b=a; for(const s of this.samples) {b=s;if(s.at>=time)break;a=s;}
    const p=a.entities.get(e.id),q=b.entities.get(e.id); if(!p||!q||p.vehicle!==q.vehicle||p.journey!==q.journey||Math.hypot(q.x-p.x,q.y-p.y)>6) return e;
    const t=a===b?1:Math.max(0,Math.min(1,(time-a.at)/(b.at-a.at)));
    return {x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t};
  }
}
