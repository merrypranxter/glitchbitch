// WAVE 20 — ECOLOGICAL SUCCESSION: living colonies rewrite their future soil.
// Pure, bounded historical deposits; no background JS simulation or deletions.
export const MAX_SUCCESSION=6;
export const successionModes=[
  "Pioneer enrichment","Nutrient exhaustion","Allelopathic scars",
  "Niche inversion","Symbiotic compost",
];
export const successionControls=[
  "successionAmount","successionDepth","successionSpread",
  "successionMotion","successionGlow","successionHue","successionBurial",
];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const unit=rng=>{const v=Number(rng());return Number.isFinite(v)?clamp(v,0,1-Number.EPSILON):0;};
const ratio=s=>{const [a,b]=String(s.ratio||"1:1").split(":").map(Number);return a>0&&b>0?a/b:1;};
export const successionEnabled=s=>Boolean(s.successionAmount>0&&s.substrateAmount>0&&
  s.substrateMode!=="Bare canvas"&&(s.successionRecords||[]).length);
export function prepareSuccession(s){
  return {...s,
    substrateMode:s.substrateMode==="Bare canvas"?"Nutrient rivers":s.substrateMode,
    substrateAmount:Math.max(78,s.substrateAmount||0),
    substratePressure:Math.max(68,s.substratePressure||0),
    successionAmount:Math.max(78,s.successionAmount||0),
    successionDepth:Math.max(64,s.successionDepth||0),
    successionGlow:Math.max(55,s.successionGlow||0)};
}
export const packedSuccession=record=>{
  const mode=successionModes.indexOf(record.mode);
  return (record.parent===0?1:-1)*((record.epoch+1)*8+mode+1);
};
export function successionPolarity(mode,parent,resource){
  if(mode==="Pioneer enrichment")return .62;
  if(mode==="Nutrient exhaustion")return -.60;
  if(mode==="Allelopathic scars")return parent===0?-.54:.36;
  if(mode==="Niche inversion")return (1-2*resource)*.78;
  if(mode==="Symbiotic compost")return .32;
  return 0;
}
function sampleWeight(s,record,x,y){
  const spread=.85+(s.successionSpread??58)/100*1.15;
  const distance=Math.hypot((x-record.x)*ratio(s),y-record.y);
  const t=clamp(1-distance/Math.max(.05,record.radius*spread),0,1);
  const age=Math.max(0,(s.successionEpoch||0)-record.epoch);
  return (t*t*(3-2*t))/(1+.24*age);
}
export function successionResourceAt(s,x,y,base){
  if(!successionEnabled(s))return base;
  let resource=base;
  const pressure=(s.successionAmount||0)/100*(s.successionDepth||0)/100;
  for(const record of (s.successionRecords||[]).slice(0,MAX_SUCCESSION)){
    const weight=sampleWeight(s,record,x,y);
    if(weight<=0)continue;
    resource=clamp(resource+weight*pressure*
      successionPolarity(record.mode,record.parent,resource),0,1);
  }
  return resource;
}
export function advanceSuccession(s){
  if(!(s.habitatStamps||[]).length||(s.successionEpoch||0)>=4095||
     (s.successionBurial||0)<=0)return s;
  const state=prepareSuccession(s),epoch=state.successionEpoch||0;
  // Alternate A/B lineages when available, rotate selection each new epoch.
  const a=state.habitatStamps.filter(m=>m.parent===0);
  const b=state.habitatStamps.filter(m=>m.parent===1);
  const ordered=[];
  while(a.length||b.length){if(a.length)ordered.push(a.shift());if(b.length)ordered.push(b.shift());}
  const quota=Math.min(3,Math.max(1,Math.ceil(
    ordered.length*(state.successionBurial||0)/100)));
  const fresh=[];
  for(let n=0;n<Math.min(quota,ordered.length);n++){
    const seed=ordered[(epoch+n)%ordered.length];
    fresh.push({
      id:"soil-"+epoch+"-"+seed.id,origin:seed.id,
      x:seed.x,y:seed.y,radius:seed.radius,parent:seed.parent,
      epoch,mode:state.successionMode,
    });
  }
  // A new epoch explicitly replaces the oldest sediment if the bounded
  // geological window is full. Living seeds and fossil history are untouched.
  const records=[...(state.successionRecords||[]),...fresh].slice(-MAX_SUCCESSION);
  return {...state,successionRecords:records,successionEpoch:epoch+1};
}
export function advanceSuccessionAges(s,steps=3){
  if(!Number.isInteger(steps)||steps<1||steps>8)return s;
  let current=s;
  for(let i=0;i<steps;i++){
    const next=advanceSuccession(current);
    if(next===current)break;
    current=next;
  }
  return current;
}
export const hideSuccession=s=>({...s,successionAmount:0});
export const clearSuccession=s=>({...s,successionRecords:[],successionEpoch:0});
export function shuffleSuccession(s,rng=Math.random){
  const take=()=>unit(rng);
  return {...s,successionMode:successionModes[Math.floor(take()*successionModes.length)],
    successionAmount:62+take()*38,
    successionDepth:43+take()*57,
    successionSpread:24+take()*76,
    successionMotion:15+take()*85,
    successionGlow:38+take()*62,
    successionHue:take()*100,
    successionBurial:15+take()*85};
}
export function successionCensus(s,resourceSampler){
  if(typeof resourceSampler!=="function")return [];
  const raw={...s,successionAmount:0};
  return (s.habitatStamps||[]).map((stamp,index)=>({
    id:stamp.id,index,parent:stamp.parent,
    before:resourceSampler(raw,stamp.x,stamp.y),
    after:resourceSampler(s,stamp.x,stamp.y),
  }));
}
// One small optional loop over six deposited memories, compiled ONLY when
// succession is present. No extra passes, textures or feedback buffers.
// Constants mirror successionResourceAt above, including age and record order.
export const successionGLSL=`
uniform int successionCount;
uniform vec4 successionStamps[6];
uniform float successionAmount,successionDepth,successionSpread;
uniform float successionMotion,successionGlow,successionHue,successionEpoch;
float successionTrace=0.;
float successionTint=0.;
float successionResource(vec2 uv,float original){
  float nutrientLevel=original;
  float pressure=successionAmount*successionDepth;
  float spread=.85+successionSpread*1.15;
  for(int i=0;i<6;i++){
    if(i>=successionCount)break;
    vec4 mark=successionStamps[i];
    float encoded=abs(mark.w);
    float epoch=floor(encoded/8.)-1.;
    float kind=mod(encoded,8.)-1.;
    float age=max(0.,successionEpoch-epoch);
    float radius=max(.05,mark.z*spread);
    float d=length((uv-mark.xy)*vec2(res.x/res.y,1.));
    float t=clamp(1.-d/radius,0.,1.);
    float weight=t*t*(3.-2.*t)/(1.+age*.24);
    if(weight<=0.)continue;
    float polarity=0.;
    if(kind<.5)polarity=.62;
    else if(kind<1.5)polarity=-.60;
    else if(kind<2.5)polarity=mark.w>0.?-.54:.36;
    else if(kind<3.5)polarity=(1.-2.*nutrientLevel)*.78;
    else polarity=.32;
    nutrientLevel=clamp(nutrientLevel+weight*pressure*polarity,0.,1.);
    if(weight>successionTrace){
      successionTrace=weight;
      successionTint=(kind/5.+(mark.w>0.?.1:.57));
    }
  }
  return nutrientLevel;
}
vec3 shadeSuccession(vec3 col,vec2 uv){
  if(successionTrace<=0.||successionGlow<=0.)return col;
  float rim=pow(successionTrace,.58)*(1.-pow(successionTrace,1.9));
  float veins=.5+.5*sin(successionTrace*37.+uv.x*27.-uv.y*19.+
    successionTint*9.);
  float pulse=.5+.5*sin(time*(.07+successionMotion*.65)+
    successionTrace*10.);
  vec3 pigment=palette(successionHue+successionTint*.53+colorTime*.008);
  float coverage=successionTrace*successionAmount;
  col=mix(col,col*.54+pigment*.76,coverage*(.12+.28*veins));
  col+=pigment*coverage*successionGlow*(.12+.32*rim+.18*pulse*veins);
  return clamp(col,vec3(0.),vec3(2.));
}
`;
