import {blockedGrid, inside, tile} from './terrain.js';
// A bounded survey plan. Ordinary travel never uses this route: every rock tile
// must first be mined by a worker, and rivers and structures remain obstacles.
export function excavationPath(r, from, target, defs, faction) {
  if(!inside(r,from.x,from.y)||!inside(r,target.x,target.y))return [];
  const n=r.size,grid=blockedGrid(r,defs,faction),start=tile(r,from.x,from.y),goal=tile(r,target.x,target.y),cost=new Map([[start,0]]),previous=new Map(),heap=[];
  function push(i,c){let k=heap.length;heap.push([i,c]);while(k){const p=(k-1)>>1;if(heap[p][1]<=c)break;heap[k]=heap[p];k=p;}heap[k]=[i,c];}
  function pop(){const a=heap[0],z=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&heap[j+1][1]<heap[j][1])j++;if(heap[j][1]>=z[1])break;heap[k]=heap[j];k=j;}heap[k]=z;}return a;}
  push(start,0);let found=false;
  while(heap.length){const [i,c]=pop();if(c!==cost.get(i))continue;if(i===goal){found=true;break;}const x=i%n,y=Math.floor(i/n);
    for(const j of [x?i-1:-1,x<n-1?i+1:-1,y?i-n:-1,y<n-1?i+n:-1]){if(j<0||r.terrain[j]===3||grid[j]&&r.terrain[j]!==2)continue;const next=c+(r.terrain[j]===2?12:1);if(next>=(cost.get(j)??Infinity))continue;cost.set(j,next);previous.set(j,i);push(j,next);}
  }
  if(!found)return [];const path=[];for(let i=goal;i!==start;i=previous.get(i))if(r.terrain[i]===2)path.push({x:i%n,y:Math.floor(i/n)});return path.reverse();
}
