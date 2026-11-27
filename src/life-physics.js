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
  bodies.push({r,base:r,age:0,gene:rng(),cycle:2+rng()*5,x:r+rng()*(w-2*r),y:r+rng()*(1-2*r),vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed});
 }
 return {bodies,step:0,rng, trails:[], impacts:[]};
}
function advance(sim,w,collision,e,mode,strength,speed,evolution,birth,mutation,mortality){
 const b=sim.bodies;
 const t=sim.step*DT;
 const snapshot=b.map(p=>({...p}));
 for(let i=0;i<b.length;i++){
  const p=b[i],m=mode===8?i%8:mode;
  let ax=0,ay=0,dx=w*.5-p.x,dy=.5-p.y;
  if(m===1){ax=Math.sin(t*3.1+i*7.3)+.5*Math.cos(t*7.7+i);ay=Math.cos(t*2.7+i*3.9);}
  if(m===2){ax=dx*3.-dy*2.;ay=dy*3.+dx*2.;}
  if(m===3||m===4||m===7){
   let n=0;
   for(let j=0;j<snapshot.length;j++){if(i===j)continue;const q=snapshot[j],x=q.x-p.x,y=q.y-p.y,l=Math.max(.015,Math.hypot(x,y));
    if(m===3){const f=l<.12?-1.:.35;ax+=x/l*f;ay+=y/l*f;}
    if(m===4&&l<.3){ax+=(q.vx-p.vx)*2+x;ay+=(q.vy-p.vy)*2+y;n++;}
    if(m===7&&((i%3===0)!==(j%3===0))){const f=i%3===0?1.:-1.;ax+=f*x/l;ay+=f*y/l;n++;}
   }
   if(n>0){ax/=n;ay/=n;}
   if(m===3){ax/=Math.max(1,b.length-1);ay/=Math.max(1,b.length-1);}
  }
  if(m===5){ax=Math.sin(p.y*13.+t)*1.5;ay=-Math.sin(p.x*13.-t)*1.5;}
  if(m===6){const burst=Math.pow(Math.max(0,Math.sin(t*2.7+i*2.1)),12);ax=Math.cos(i*7.1+t)*burst*5;ay=Math.sin(i*7.1+t)*burst*5;}
  if(m!==0){p.vx+=ax*strength*speed*DT;p.vy+=ay*strength*speed*DT;const cap=1.8*speed,v=Math.hypot(p.vx,p.vy);if(v>cap&&v>0){p.vx*=cap/v;p.vy*=cap/v;}}
  p.x+=p.vx*DT;p.y+=p.vy*DT;
 }
 for(let pass=0;pass<2;pass++){
  if(collision>0)for(let i=0;i<b.length;i++)for(let j=i+1;j<b.length;j++){
   const a=b[i],c=b[j],dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy),over=a.r+c.r-d;
   if(over<=0)continue;
   const nx=d>1e-8?dx/d:1,ny=d>1e-8?dy/d:0,ia=1/(a.r*a.r),ib=1/(c.r*c.r),sum=ia+ib;
   const correction=over*collision/sum;
   a.x-=nx*correction*ia;a.y-=ny*correction*ia;c.x+=nx*correction*ib;c.y+=ny*correction*ib;
   const rel=(c.vx-a.vx)*nx+(c.vy-a.vy)*ny;
   if(rel<0){if(pass===0 && rel<-.04){sim.impacts.push([(a.x+c.x)*.5,(a.y+c.y)*.5,t,Math.min(1,-rel)]);if(sim.impacts.length>8)sim.impacts.shift();}const impulse=-(1+e)*rel*collision/sum;a.vx-=impulse*ia*nx;a.vy-=impulse*ia*ny;c.vx+=impulse*ib*nx;c.vy+=impulse*ib*ny;}
  }
  for(const p of b){if(p.x<p.r){p.x=p.r;p.vx=Math.abs(p.vx)}if(p.x>w-p.r){p.x=w-p.r;p.vx=-Math.abs(p.vx)}if(p.y<p.r){p.y=p.r;p.vy=Math.abs(p.vy)}if(p.y>1-p.r){p.y=1-p.r;p.vy=-Math.abs(p.vy)}}
 }
 if(evolution>0){
  const rng=sim.rng;
  for(let i=b.length-1;i>=0;i--){
   const p=b[i];p.age+=DT*evolution;
   p.r=p.base*clamp(.65+p.age*.35, .65,1.35);
   const period=p.cycle/(.15+birth*2);
   if(mortality>0 && p.age>p.cycle*3/(.1+mortality*2) && b.length>1){b.splice(i,1);continue;}
   if(birth>0 && p.age>period && b.length<24){
    const angle=rng()*Math.PI*2,nx=Math.cos(angle),ny=Math.sin(angle);
    const base=clamp(p.base*.82*(1+(rng()-.5)*mutation*.5),.004,.12*Math.min(w,1));
    p.age=0;p.base=Math.max(.004,p.base*.82);p.r=p.base*.65;
    const child={...p,base,r:base*.65,age:0,cycle:2+rng()*5,gene:(p.gene+(rng()-.5)*mutation+1)%1};
    child.x=clamp(p.x+nx*(p.r+child.r),child.r,w-child.r);child.y=clamp(p.y+ny*(p.r+child.r),child.r,1-child.r);
    child.vx+=nx*.2*speed;child.vy+=ny*.2*speed;p.vx-=nx*.2*speed;p.vy-=ny*.2*speed;
    b.push(child);
   }
  }
 }
 sim.step++;
 if(sim.step%12===0){sim.trails.push(b.slice(0,8).map(p=>[p.x,p.y,p.gene]));if(sim.trails.length>9)sim.trails.shift();}
}
export function lifePositions(s,time,width,height){
 const w=Math.max(width/height,.1), collision=clamp((s.lifeCollision??100)/100,0,1),e=clamp((s.lifeElasticity??90)/100,0,1);
 const mode=Math.floor(clamp((s.lifeBehavior??0)/100,0,.99999)*9),strength=clamp((s.lifeForce??50)/100,0,1),speed=clamp(s.lifeSpeed/100,0,1);
 const [evolution,birth,mutation,mortality]=[s.lifeEvolution??0,s.lifeBirthRate??50,s.lifeMutation??30,s.lifeMortality??20].map(v=>clamp(v/100,0,1));
 const key=JSON.stringify([s.seed,s.lifePopulation,s.lifeSize,s.lifeSpeed,s.lifeVariation,w,collision,e,mode,strength,evolution,birth,mutation,mortality]);
 const target=Math.max(0,Math.floor((Number(time)||0)/DT));
 let sim=cache.get(key);
 if(!sim||sim.step>target){sim=make(s,w);cache.set(key,sim);if(cache.size>4)cache.delete(cache.keys().next().value);}
 while(sim.step<target)advance(sim,w,collision,e,mode,strength,speed,evolution,birth,mutation,mortality);
 const out=new Float32Array(96);
 sim.bodies.forEach((p,i)=>out.set([p.x,p.y,p.r,1+p.gene],i*4));
 const trails=new Float32Array(8*8*4);
 // Match bodies by their stable object identity rather than shifting array indices.
 for(let j=1;j<sim.trails.length;j++)for(let i=0;i<Math.min(sim.trails[j].length,sim.trails[j-1].length);i++){const a=sim.trails[j-1][i],b=sim.trails[j][i];if(a[2]===b[2])trails.set([a[0],a[1],b[0],b[1]],((j-1)*8+i)*4);}
 const impacts=new Float32Array(32);sim.impacts.forEach((v,i)=>impacts.set([v[0],v[1],Math.max(0,target*DT-v[2]),v[3]],i*4));out.impacts=impacts;
 out.trails=trails;out.trailCount=Math.max(0,sim.trails.length-1);
 return out;
}
