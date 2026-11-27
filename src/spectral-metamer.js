import {D65_CMF} from "./vendor/spectral.js";
import {pigmentStop} from "./spectral-pigment.js";
import {xyzToLin,linToSrgb} from "./colorspaces.js";

export const illuminantNames=["Reference daylight","Amber furnace","Blue-violet LED","Magenta discharge","Green spectral spike","Alien triple-band"];
const N=D65_CMF[0].length;
const clampMeta=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const finiteMeta=(x,f)=>Number.isFinite(x)?x:f;
const dotMeta=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const refWhite=D65_CMF.map(row=>row.reduce((a,b)=>a+b,0));
const gaussianMeta=(x,c,w)=>Math.exp(-.5*((x-c)/w)**2);
// Artistic nonnegative spectral power ratios relative to the D65 weighting.
// These are not measured lamps or CIE standard illuminants other than reference.
export function spectralIlluminant(mode){
 return Array.from({length:N},(_,i)=>{
  const x=i/(N-1);
  switch(Math.round(mode)){
   case 1:return .13+2.8*x*x;
   case 2:return .08+2.5*gaussianMeta(x,.20,.10)+.35*gaussianMeta(x,.55,.16);
   case 3:return .06+2.4*gaussianMeta(x,.19,.055)+2.1*gaussianMeta(x,.69,.065);
   case 4:return .045+3.4*gaussianMeta(x,.48,.045);
   case 5:return .05+2.8*gaussianMeta(x,.13,.035)+2.6*gaussianMeta(x,.41,.045)+3*gaussianMeta(x,.73,.05);
   default:return 1;
  }
 });
}
function solveMeta3(matrix,vector){
 const rows=matrix.map((r,i)=>[...r,vector[i]]);
 for(let i=0;i<3;i++){
  let p=i;for(let j=i+1;j<3;j++)if(Math.abs(rows[j][i])>Math.abs(rows[p][i]))p=j;
  if(Math.abs(rows[p][i])<1e-13)return null;
  [rows[i],rows[p]]=[rows[p],rows[i]];
  const d=rows[i][i];for(let k=i;k<4;k++)rows[i][k]/=d;
  for(let j=0;j<3;j++)if(j!==i){const f=rows[j][i];for(let k=i;k<4;k++)rows[j][k]-=f*rows[i][k];}
 }
 return rows.map(r=>r[3]);
}
// Project a spectral oscillation into the null space of the D65 tristimulus
// operator, using available reflectance headroom as a metric. Both variants
// remain valid reflectances and have the same reference XYZ.
export function metamerPair(reflectance,phase=0){
 const R=reflectance.map(v=>clampMeta(v));
 const head=R.map(v=>Math.min(v,1-v));
 const raw=R.map((_,i)=>Math.sin(i*.79+phase)+.63*Math.cos(i*1.31-phase*.7));
 const matrix=D65_CMF.map(a=>D65_CMF.map(b=>a.reduce((sum,v,i)=>sum+v*b[i]*head[i],0)));
 const rhs=D65_CMF.map(a=>a.reduce((sum,v,i)=>sum+v*head[i]*raw[i],0));
 const coef=solveMeta3(matrix,rhs);
 if(!coef)return [R.slice(),R.slice()];
 const q=raw.map((v,i)=>v-D65_CMF.reduce((sum,row,k)=>sum+row[i]*coef[k],0));
 const peak=Math.max(1e-12,...q.map(Math.abs));
 const d=q.map((v,i)=>head[i]*v/peak*.98);
 return [R.map((v,i)=>clampMeta(v+d[i])),R.map((v,i)=>clampMeta(v-d[i]))];
}
export function referenceXYZ(R){return D65_CMF.map(row=>dotMeta(row,R));}
export function makeSpectralObserver(mode=0,adaptation=100){
 const light=spectralIlluminant(mode);
 const weighted=D65_CMF.map(row=>row.map((v,i)=>v*light[i]));
 const white=weighted.map(row=>row.reduce((a,b)=>a+b,0));
 const adapt=clampMeta(finiteMeta(adaptation,100)/100);
 const correction=white.map((v,i)=>(1-adapt)/white[1]+adapt*refWhite[i]/v);
 return R=>weighted.map((row,i)=>dotMeta(row,R)*correction[i]);
}
export function bakeMetamerPalette(s,width,mapGamut){
 const stops=s.colors.map(pigmentStop);
 const phase=finiteMeta(s.chromaticMetaPhase,0)/100*Math.PI*2;
 const amount=clampMeta(finiteMeta(s.chromaticMetaAmount,100)/100);
 const bands=Math.round(clampMeta(finiteMeta(s.chromaticMetaBands,3),1,8));
 const pairs=stops.map((p,i)=>metamerPair(p.reflectance,phase+i*1.618));
 const observe=makeSpectralObserver(s.chromaticIlluminant??0,s.chromaticMetaAdapt??100);
 const out=new Uint8Array(width*4);
 for(let i=0;i<width;i++){
  const pos=i/width,q=pos*stops.length,j=Math.floor(q),k=(j+1)%stops.length,f=q-j,t=f*f*(3-2*f);
  const wave=.5+.5*amount*Math.sin(Math.PI*2*bands*pos+phase);
  const R=pairs[j][0].map((v,n)=>{
   const a=pairs[j][1][n]+(v-pairs[j][1][n])*wave;
   const b=pairs[k][1][n]+(pairs[k][0][n]-pairs[k][1][n])*wave;
   return a+(b-a)*t;
  });
  const rgb=linToSrgb(mapGamut(xyzToLin(observe(R))));
  for(let n=0;n<3;n++)out[i*4+n]=Math.round(255*clampMeta(finiteMeta(rgb[n],0)));
  out[i*4+3]=255;
 }
 return out;
}
