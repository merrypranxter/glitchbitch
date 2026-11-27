// Fixed-step deterministic disk dynamics. Cache per settings; rewind on backwards seek.
const cache=new Map(), DT=1/120;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function make(s,w){
 let seed=(Number(s.seed)||0)>>>0;
 const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const count=1+Math.floor(clamp(s.lifePopulation/100,0,1)*23), bodies=[];
 for(let i=0;i<count;i++){
  const h=rng(),r=(.008+.077*s.lifeSize/100)*(1+(s.lifeVariation/100)*(.55+.85*h-1))*Math.min(w,1);
  const angle=rng()*Math.PI*2, speed=(.13+.52*rng())*1.8*s.lifeSpeed/100;
  bodies.push({r,x:r+rng()*(w-2*r),y:r+rng()*(1-2*r),vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed});
 }
 return {bodies,step:0};
}
function advance(sim,w,collision,e){
 const b=sim.bodies;
 for(const p of b){p.x+=p.vx*DT;p.y+=p.vy*DT;}
 for(let pass=0;pass<2;pass++){
  if(collision>0)for(let i=0;i<b.length;i++)for(let j=i+1;j<b.length;j++){
   const a=b[i],c=b[j],dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy),over=a.r+c.r-d;
   if(over<=0)continue;
   const nx=d>1e-8?dx/d:1,ny=d>1e-8?dy/d:0,ia=1/(a.r*a.r),ib=1/(c.r*c.r),sum=ia+ib;
   const correction=over*collision/sum;
   a.x-=nx*correction*ia;a.y-=ny*correction*ia;c.x+=nx*correction*ib;c.y+=ny*correction*ib;
   const rel=(c.vx-a.vx)*nx+(c.vy-a.vy)*ny;
   if(rel<0){const impulse=-(1+e)*rel*collision/sum;a.vx-=impulse*ia*nx;a.vy-=impulse*ia*ny;c.vx+=impulse*ib*nx;c.vy+=impulse*ib*ny;}
  }
  for(const p of b){if(p.x<p.r){p.x=p.r;p.vx=Math.abs(p.vx)}if(p.x>w-p.r){p.x=w-p.r;p.vx=-Math.abs(p.vx)}if(p.y<p.r){p.y=p.r;p.vy=Math.abs(p.vy)}if(p.y>1-p.r){p.y=1-p.r;p.vy=-Math.abs(p.vy)}}
 }
 sim.step++;
}
export function lifePositions(s,time,width,height){
 const w=Math.max(width/height,.1), collision=clamp((s.lifeCollision??100)/100,0,1),e=clamp((s.lifeElasticity??90)/100,0,1);
 const key=JSON.stringify([s.seed,s.lifePopulation,s.lifeSize,s.lifeSpeed,s.lifeVariation,w,collision,e]);
 const target=Math.max(0,Math.floor((Number(time)||0)/DT));
 let sim=cache.get(key);
 if(!sim||sim.step>target){sim=make(s,w);cache.set(key,sim);if(cache.size>4)cache.delete(cache.keys().next().value);}
 while(sim.step<target)advance(sim,w,collision,e);
 const out=new Float32Array(96);
 sim.bodies.forEach((p,i)=>out.set([p.x,p.y,p.r,1],i*4));
 return out;
}
