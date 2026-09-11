// Original canvas artwork. Each work building has a recognizable functional silhouette.
export function facility(g,b,w,h,s,now,color) {
  if(!['laboratory','workshop','kitchen','clinic','garage','fabricator','refinery','generator','relay','turret'].includes(b.kind)) return false;
  const active=b.powered && (b.active?.includes('Produc')||b.active?.includes('Building')||b.active?.includes('running'));
  const rect=(x,y,ww,hh,fill,stroke)=>{g.fillStyle=fill;g.fillRect(x,y,ww,hh);if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.strokeRect(x,y,ww,hh);}};
  const circle=(x,y,r,fill)=>{g.fillStyle=fill;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();};
  rect(s*.2,s*.35,w,h,'#13251b60');rect(0,0,w,h,'#575e53','#b0ac8b');
  rect(2,2,w-4,h-4,'#6c7869');rect(w*.1,h*.88,w*.8,h*.1,'#313e37');
  if(b.kind==='laboratory') {
    rect(s*.12,-s*.18,w*.6,h*.9,'#d0c5a0','#eee0b7');rect(w*.15,h*.24,w*.45,h*.18,'#426e70','#9dc8bd');
    circle(w*.76,h*.33,s*.7,'#2c4845');circle(w*.76,h*.33,s*.52,'#99bbb1');g.strokeStyle='#dbe4c3';g.lineWidth=2;g.beginPath();g.moveTo(w*.76,h*.33);g.lineTo(w*.93,-s*.25);g.stroke();rect(w*.14,h*.6,w*.34,h*.18,'#7d7151');rect(w*.18,h*.6,s*.32,s*.3,'#e4dbb1');
  } else if(b.kind==='workshop') {
    rect(0,0,w*.35,h,'#4e5b52','#aba27d');rect(w*.1,h*.1,w*.15,h*.7,'#b39d6d');rect(w*.5,h*.35,w*.4,h*.2,'#baa17b','#e0ca9e');
    for(let i=0;i<3;i++)circle(w*(.58+i*.12),h*.45,s*.15,'#52666a');rect(w*.5,h*.7,w*.33,h*.17,'#2e453e');g.strokeStyle='#d1b37b';g.lineWidth=3;g.beginPath();g.moveTo(w*.68,h*.6);g.lineTo(w*.75+Math.sin(now/180)*(active?4:0),h*.34);g.stroke();
  } else if(b.kind==='kitchen') {
    rect(w*.08,h*.08,w*.84,h*.45,'#bea87a','#e0c997');rect(w*.08,h*.62,w*.84,h*.19,'#80694d');circle(w*.28,h*.3,s*.37,'#273b32');circle(w*.69,h*.3,s*.37,'#273b32');circle(w*.69,h*.3,s*.22,active?'#dfaa57':'#736850');rect(w*.7,-s*.6,s*.36,s*.82,'#4a514b','#b0ac90');
  } else if(b.kind==='clinic') {
    rect(0,-s*.1,w,h*.84,'#cfceb1','#eff0d2');rect(w*.13,h*.14,w*.22,h*.42,'#698e87');rect(w*.64,h*.14,w*.22,h*.42,'#698e87');rect(w*.45,h*.1,w*.1,h*.46,'#a55340');rect(w*.36,h*.27,w*.28,h*.12,'#a55340');
  } else if(b.kind==='garage'||b.kind==='fabricator') {
    rect(w*.06,-s*.22,w*.88,h*.42,b.kind==='garage'?'#7e8c81':'#9a8f6b','#c4c3a0');
    const bays=b.kind==='garage'?2:3;for(let i=0;i<bays;i++){const x=w*(.1+i*.8/bays);rect(x,h*.32,w*.7/bays,h*.53,'#203b34','#899c83');rect(x+2,h*.79,w*.7/bays-4,h*.06,'#b5aa75');}
    if(b.kind==='fabricator'){g.strokeStyle='#c1b784';g.lineWidth=s*.12;g.beginPath();g.moveTo(w*.5,h*.3);g.lineTo(w*.5,h*.5);g.lineTo(w*.65+Math.sin(now/240)*(active?5:0),h*.62);g.stroke();}
  } else if(b.kind==='refinery') {
    for(let i=0;i<2;i++){rect(w*(.12+i*.46),h*.25,w*.3,h*.55,'#9e9c7b','#d6c49a');g.fillStyle='#c4ba91';g.beginPath();g.ellipse(w*(.27+i*.46),h*.25,w*.15,h*.12,0,0,7);g.fill();}
    rect(w*.1,h*.74,w*.8,h*.1,'#4c6861');rect(w*.45,-s*.65,s*.3,h*.6,'#677568','#bdc4a5');
  } else if(b.kind==='generator') {
    circle(w*.5,h*.5,Math.min(w,h)*.39,'#354e48');circle(w*.5,h*.5,Math.min(w,h)*.25,'#a2b8a5');g.save();g.translate(w*.5,h*.5);g.rotate(b.powered?now/350:0);g.strokeStyle='#3a554c';g.lineWidth=s*.17;for(let i=0;i<4;i++){g.rotate(Math.PI/2);g.beginPath();g.moveTo(0,0);g.lineTo(s*.7,0);g.stroke();}g.restore();
  } else if(b.kind==='relay') {
    rect(w*.12,h*.52,w*.76,h*.3,'#969a75');g.strokeStyle='#b7c5a6';g.lineWidth=3;g.beginPath();g.moveTo(w*.5,h*.6);g.lineTo(w*.5,-s*.7);g.stroke();g.fillStyle='#c7ccb0';g.beginPath();g.ellipse(w*.5,0,s*.75,s*.35,-.6,0,7);g.fill();circle(w*.5,0,s*.13,color);
  } else {circle(w*.5,h*.5,s*.75,'#3d5650');circle(w*.5,h*.45,s*.5,color);rect(w*.5,h*.3,s*1.1,s*.18,'#c2cbb0');}
  rect(w*.08,h*.86,w*.14,h*.08,color);circle(w*.86,h*.9,s*.07,b.powered?'#a4dab1':'#dba779');
  if(active && ['kitchen','refinery'].includes(b.kind)){g.globalAlpha=.22;circle(w*.7,-s*(.9+now%1500/1500),s*.22,'#e7d8b2');g.globalAlpha=1;}
  return true;
}
