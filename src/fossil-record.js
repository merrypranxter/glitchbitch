// FOSSIL RECORD — bounded archaeological memory that changes real ecology.
// Each archived impression records an individual organism's site, genotype,
// species, and epoch. Playback never mutates the past: archival edits only
// occur through explicit undoable user actions. Maximum eight records.
export const MAX_FOSSILS=8;
export const fossilModes=[
  "Dormant","Ancestral compost","Toxic reliquary",
  "Opal reliquary","Ghost mycelium","Stratigraphic mirror",
];
export const fossilControls=[
  "fossilAmount","fossilDepth","fossilMotion","fossilGlow",
  "fossilHue","fossilBurial",
];
export const fossilPresets=[
  {name:"Ancestral Compost Cathedral",fossilMode:"Ancestral compost",
    fossilAmount:95,fossilDepth:83,fossilMotion:48,fossilGlow:87,
    fossilHue:39,fossilBurial:62},
  {name:"Toxic Time Capsule",fossilMode:"Toxic reliquary",
    fossilAmount:97,fossilDepth:91,fossilMotion:72,fossilGlow:93,
    fossilHue:84,fossilBurial:50},
  {name:"Opal Necropolis",fossilMode:"Opal reliquary",
    fossilAmount:99,fossilDepth:88,fossilMotion:61,fossilGlow:97,
    fossilHue:22,fossilBurial:75},
  {name:"Ghost Roots of Atlantis",fossilMode:"Ghost mycelium",
    fossilAmount:94,fossilDepth:85,fossilMotion:78,fossilGlow:96,
    fossilHue:74,fossilBurial:67},
  {name:"Stratigraphic Time Machine",fossilMode:"Stratigraphic mirror",
    fossilAmount:96,fossilDepth:92,fossilMotion:45,fossilGlow:100,
    fossilHue:54,fossilBurial:72},
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const unit=rng=>{
  const x=Number(rng);
  return Number.isFinite(x)?clamp(x,0,1-Number.EPSILON):0;
};
export const fossilEnabled=state=>
  state.fossilMode!=="Dormant" && (state.fossilAmount||0)>0 &&
  state.substrateAmount>0&&state.substrateMode!=="Bare canvas"&&
  (state.fossilRecords||[]).length>0;
export function fossilRadiusWeight(state,record,x,y){
  const dims=String(state.ratio||"1:1").split(":").map(Number);
  const aspect=dims[0]>0&&dims[1]>0?dims[0]/dims[1]:1;
  const d=Math.hypot((x-record.x)*aspect,y-record.y);
  const t=clamp(1-d/Math.max(.05,record.radius),0,1);
  return t*t*(3-2*t);
}
export function fossilResourceAt(state,x,y,base){
  if(!fossilEnabled(state))return base;
  let resource=base;
  const pressure=state.fossilAmount/100*state.fossilDepth/100;
  for(const record of (state.fossilRecords||[]).slice(0,MAX_FOSSILS)){
    const age=Math.max(0,(state.apocalypseEpoch||0)-record.epoch);
    const influence=pressure*fossilRadiusWeight(state,record,x,y)/
      (1+age*.24);
    if(influence<=0)continue;
    let polarity=0;
    if(state.fossilMode==="Ancestral compost")polarity=.55;
    else if(state.fossilMode==="Toxic reliquary")polarity=-.55;
    else if(state.fossilMode==="Opal reliquary")
      polarity=(record.gene/100-.5)*1.1;
    else if(state.fossilMode==="Ghost mycelium")
      polarity=record.parent===0?.55:-.55;
    else if(state.fossilMode==="Stratigraphic mirror")
      polarity=(1-2*resource)*.55;
    resource=clamp(resource+influence*polarity,0,1);
  }
  return resource;
}
export const packedFossil=record=>
  (record.parent===0?1:-1)*
  (record.epoch+1+.05+record.gene/100*.75);
export const unpackageFossil=marker=>{
  const abs=Math.abs(marker),floor=Math.floor(abs);
  return {parent:marker<0?1:0,epoch:floor-1,
    gene:clamp(Math.round((abs-floor-.05)/.75*100),0,100)};
};
export const hideFossils=state=>({...state,fossilAmount:0});
export function applyFossilPreset(state,name){
  const p=fossilPresets.find(p=>p.name===name);
  if(!p)return state;
  const {name:unused,...fields}=p;
  return {...state,...fields};
}
export function shuffleFossils(state,rng=Math.random){
  const next=()=>unit(rng());
  return {...state,
    fossilMode:fossilModes[1+Math.floor(next()*(fossilModes.length-1))],
    fossilAmount:63+next()*37,
    fossilDepth:28+next()*71,
    fossilMotion:12+next()*87,
    fossilGlow:30+next()*69,
    fossilHue:next()*100,
    fossilBurial:34+next()*65,
  };
}
export function archiveFossils(state){
  const existing=state.fossilRecords||[];
  const originals=state.habitatStamps||[];
  if(!originals.length||existing.length>=MAX_FOSSILS)return state;
  const quota=Math.min(MAX_FOSSILS-existing.length,
    Math.max(1,Math.ceil(originals.length*(state.fossilBurial||0)/100)));
  if((state.fossilBurial||0)<=0)return state;
  const epoch=state.apocalypseEpoch||0;
  const ids=new Set(existing.map(x=>x.id));
  const items=originals.map((stamp,i)=>({stamp,i}))
    .sort((a,b)=>a.stamp.parent-b.stamp.parent||a.i-b.i);
  // Interleave A and B families rather than burying all one species.
  const a=items.filter(x=>x.stamp.parent===0);
  const b=items.filter(x=>x.stamp.parent===1);
  const ordered=[];while(a.length||b.length){
    if(a.length)ordered.push(a.shift());
    if(b.length)ordered.push(b.shift());
  }
  const born=[];
  for(const {stamp,i} of ordered){
    if(born.length>=quota)break;
    const id="fossil-"+epoch+"-"+stamp.id;
    if(ids.has(id))continue; // never duplicate one organism in the same epoch
    ids.add(id);
    born.push({id,origin:stamp.id,x:stamp.x,y:stamp.y,
      radius:stamp.radius,parent:stamp.parent,epoch,
      gene:Number.isInteger(stamp.gene)?stamp.gene:50});
  }
  if(!born.length)return state;
  return {...state,fossilRecords:[...existing,...born]};
}
export function archiveAndAdvance(state){
  if((state.apocalypseEpoch||0)>=4095)return state;
  const buried=archiveFossils(state);
  if(buried===state)return state;
  return {...buried,apocalypseEpoch:(state.apocalypseEpoch||0)+1};
}
export const clearFossilArchive=state=>({...state,fossilRecords:[]});

// One 8-record read pass per substrate pixel, compiled only when fossils
// are visible and a real mineral substrate is active. Each marker's sign
// encodes A/B, integer part encodes epoch, fractional part the gene.
export const fossilGLSL=`
uniform int fossilMode,fossilCount;
uniform vec4 fossilStamps[8];
uniform float fossilAmount,fossilDepth,fossilMotion;
uniform float fossilGlow,fossilHue,fossilEpoch;
float fossilTrace=0.;
float fossilTint=0.;
float fossilResource(vec2 uv,float base){
  float current=base;
  float pressure=fossilAmount*fossilDepth;
  for(int i=0;i<8;i++){
    if(i>=fossilCount)break;
    vec4 relic=fossilStamps[i];
    float absMarker=abs(relic.w),encodedEpoch=floor(absMarker)-1.;
    float gene=clamp((fract(absMarker)-.05)/.75,0.,1.);
    float age=max(0.,fossilEpoch-encodedEpoch);
    float radius=max(.05,relic.z);
    float d=length((uv-relic.xy)*vec2(res.x/res.y,1.));
    float t=clamp(1.-d/radius,0.,1.);
    float weight=t*t*(3.-2.*t)/(1.+age*.24);
    float influence=pressure*weight;
    if(influence<=0.)continue;
    float polarity=0.;
    if(fossilMode==1)polarity=.55;
    else if(fossilMode==2)polarity=-.55;
    else if(fossilMode==3)polarity=(gene-.5)*1.1;
    else if(fossilMode==4)polarity=relic.w>0.?.55:-.55;
    else if(fossilMode==5)polarity=(1.-2.*current)*.55;
    current=clamp(current+influence*polarity,0.,1.);
    if(weight>fossilTrace){
      fossilTrace=weight;
      fossilTint=mix(gene,relic.w>0.?.25:.75,.4);
    }
  }
  return current;
}
vec3 shadeFossilRelics(vec3 col,vec2 uv){
  if(fossilTrace<=0.||fossilGlow<=0.)return col;
  float rim=pow(fossilTrace,.55)*(1.-pow(fossilTrace,1.8));
  float stratum=.5+.5*sin(fossilTrace*54.+
    fossilTint*13.+uv.x*17.-uv.y*23.);
  float pulse=.5+.5*sin(time*(.09+fossilMotion*.72)+
    fossilTrace*13.);
  vec3 pigment=palette(fossilHue+fossilTint*.49+colorTime*.008);
  float opacity=clamp(fossilTrace*fossilAmount,0.,1.);
  col=mix(col,col*.58+pigment*.73,
    opacity*(.12+.23*stratum));
  col+=pigment*opacity*fossilGlow*
    (.09+.29*rim+.22*pulse*stratum);
  return clamp(col,vec3(0.),vec3(2.));
}
`;
