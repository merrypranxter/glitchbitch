// MUTATION BLOODLINES — per-colony heritable DNA with zero new GPU arrays.
// A gene is a single integer 0..100. It alters the actual colony boundary
// and its palette response. Daughters carry an identifiable ancestor and
// inherit a reproducible mutant/recombinant allele.
export const geneControls=["geneAmount","geneMutation","geneCrossbreed","geneGlow"];
export const genePresets=[
  {name:"Ruffled Dynasties",geneAmount:97,geneMutation:75,geneCrossbreed:19,geneGlow:68},
  {name:"Neon Mendelian Circus",geneAmount:99,geneMutation:91,geneCrossbreed:92,geneGlow:100},
  {name:"Quartz Gene Drift",geneAmount:88,geneMutation:38,geneCrossbreed:66,geneGlow:91},
  {name:"Darwin's Disco Spore",geneAmount:94,geneMutation:82,geneCrossbreed:43,geneGlow:96},
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?clamp(n,0,1-Number.EPSILON):0;
};
const hashText=text=>{
  let n=2166136261;
  for(let i=0;i<text.length;i++){
    n=Math.imul(n^text.charCodeAt(i),16777619);
  }
  return (n>>>0)/4294967295;
};
export const founderGene=(state,stamp)=>Math.round(100*hashText(
  String(state.seed||0)+":"+stamp.id+":"+stamp.parent
));
export const packGeneMarker=(stamp,enabled)=>
  stamp.parent+(enabled&&Number.isInteger(stamp.gene)
    ? .010+(stamp.gene/100)*.075 : 0);
export const geneEnabled=state=>
  (state.geneAmount||0)>0 && (state.habitatStamps||[])
    .some(m=>Number.isInteger(m.gene)) &&
  ((state.atmoAmount>0&&state.atmoMaskMode==="Painted colonies")||
   (state.atmoBAmount>0&&state.atmoBMaskMode==="Painted colonies"));
export function seedGenePool(state,rng=Math.random){
  if(!(state.habitatStamps||[]).length)return state;
  return {...state,geneAmount:Math.max(65,state.geneAmount||0),
    habitatStamps:state.habitatStamps.map(m=>({
      ...m,gene:Math.floor(unit(rng)*101),
      generation:m.generation??0,
    }))};
}
export function mutateGenePool(state,rng=Math.random){
  if(!(state.habitatStamps||[]).length)return state;
  const amount=(state.geneMutation??55)/100;
  return {...state,geneAmount:Math.max(67,state.geneAmount||0),
    habitatStamps:state.habitatStamps.map(m=>{
      const original=Number.isInteger(m.gene)?m.gene:founderGene(state,m);
      const magnitude=(8+amount*47)*(unit(rng)*2-1);
      return {...m,gene:clamp(Math.round(original+magnitude),0,100),
        generation:m.generation??0};
    })};
}
export function mutateSelectedGene(state,id,rng=Math.random){
  if(!(state.habitatStamps||[]).some(m=>m.id===id))return state;
  const rate=(state.geneMutation??55)/100;
  return {...state,geneAmount:Math.max(67,state.geneAmount||0),
    habitatStamps:state.habitatStamps.map(m=>{
      if(m.id!==id)return m;
      const gene=Number.isInteger(m.gene)?m.gene:founderGene(state,m);
      return {...m,gene:clamp(Math.round(
        gene+(unit(rng)*2-1)*(8+rate*47)),0,100),
        generation:m.generation??0};
    })};
}
export function inheritColonyGene(state,parent,index,site){
  if(!(state.geneAmount>0))return {};
  const generation=clamp((parent.generation??0)+1,0,4095);
  const source=Number.isInteger(parent.gene)
    ?parent.gene:founderGene(state,parent);
  const mutation=(state.geneMutation??55)/100;
  const partnerWeight=(state.geneCrossbreed??35)/100;
  const ratio=String(state.ratio||"1:1").split(":").map(Number);
  const aspect=ratio[0]>0&&ratio[1]>0?ratio[0]/ratio[1]:1;
  let partner=null,near=Infinity;
  for(const potential of state.habitatStamps||[]){
    if(potential.parent===parent.parent)continue;
    const d=Math.hypot((potential.x-site.x)*aspect,potential.y-site.y);
    if(d<near){partner=potential;near=d;}
  }
  let inherited=source;
  if(partner && near<=.29){
    const other=Number.isInteger(partner.gene)
      ?partner.gene:founderGene(state,partner);
    const physicalContact=clamp((.29-near)/.29,0,1);
    inherited+=(other-inherited)*partnerWeight*physicalContact*.82;
  }
  const roll=hashText(parent.id+":"+String(index)+":"+
    String(state.sporeGeneration||0)+":"+String(state.seed||0));
  inherited+=(roll*2-1)*(3+mutation*43);
  return {gene:clamp(Math.round(inherited),0,100),
    generation,ancestor:parent.id};
}
export function applyGenePreset(state,name,rng=Math.random){
  const p=genePresets.find(x=>x.name===name);
  if(!p)return state;
  const {name:ignored,...fields}=p;
  return seedGenePool({...state,...fields},rng);
}
export const hideGenetics=state=>({...state,geneAmount:0});
export const geneGLSL=`
uniform float geneAmount,geneGlow;
vec2 genomeSignalA=vec2(0.);
vec2 genomeSignalB=vec2(0.);
float geneCarrier(float marker){
  return step(.005,fract(marker));
}
float geneAllele(float marker){
  return clamp((fract(marker)-.010)/.075,0.,1.);
}
float geneEdgeFactor(float marker,float angle,float t,float index){
  float carrier=geneCarrier(marker);
  if(carrier<.5)return 1.;
  float g=geneAllele(marker);
  float fringe=sin(angle*(5.+floor(g*13.))+t*.33+index*.61);
  float expression=(g-.5)*2.;
  return clamp(1.+geneAmount*(.26*expression+.15*fringe),.57,1.43);
}
vec3 tintColonyGenome(vec3 base,float mask,vec2 sig,float hue){
  if(sig.x<=.001||geneAmount<=.001)return base;
  float carrier=clamp(mask*sig.x*geneAmount,0.,1.);
  float difference=(sig.y-.5)*2.;
  vec3 pigment=palette(hue+difference*.37+colorTime*.009);
  float tissue=.5+.5*sin(sig.y*15.+time*.11+hue*11.);
  base=mix(base,base*.58+pigment*.75,carrier*.46);
  base+=pigment*carrier*geneGlow*(.15+.25*tissue);
  return clamp(base,vec3(0.),vec3(2.));
}
`;
