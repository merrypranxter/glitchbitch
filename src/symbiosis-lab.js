// SYMBIOSIS LAB — living contact chemistry shared by two painted populations.
// Contact is computed from existing A/B habitat masks, not from new seed
// loops, framebuffer textures, random frame history, or extra GPU passes.
export const symbiosisModes=[
  "Dormant","Mutualistic lace","Parasitic rot",
  "Hybrid membrane","Electric synapse",
];
export const symbiosisControls=[
  "symbiosisAmount","symbiosisDetail","symbiosisMotion",
  "symbiosisGlow","symbiosisDominance",
];
export const symbiosisPresets=[
  {name:"Mycelial Handshake",symbiosisMode:"Mutualistic lace",
    symbiosisAmount:95,symbiosisDetail:78,
    symbiosisMotion:54,symbiosisGlow:93,symbiosisDominance:50},
  {name:"Neon Necrotic Siege",symbiosisMode:"Parasitic rot",
    symbiosisAmount:98,symbiosisDetail:91,
    symbiosisMotion:77,symbiosisGlow:87,symbiosisDominance:89},
  {name:"Chromatic Third Kingdom",symbiosisMode:"Hybrid membrane",
    symbiosisAmount:97,symbiosisDetail:81,
    symbiosisMotion:63,symbiosisGlow:96,symbiosisDominance:51},
  {name:"Synaptic Coral Covenant",symbiosisMode:"Electric synapse",
    symbiosisAmount:94,symbiosisDetail:88,
    symbiosisMotion:91,symbiosisGlow:100,symbiosisDominance:24},
];
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?clamp(n,0,1-Number.EPSILON):0;
};
const choose=(arr,rng)=>arr[Math.floor(unit(rng)*arr.length)];
export const symbiosisActive=s=>s.symbiosisAmount>0 &&
  s.symbiosisMode!=="Dormant"&&s.atmoAmount>0&&s.atmoBAmount>0&&
  s.atmoMaskMode==="Painted colonies"&&s.atmoBMaskMode==="Painted colonies";
const touches=(a,b,aspect)=>{
  const deltaX=(a.x-b.x)*aspect, deltaY=a.y-b.y;
  return Math.hypot(deltaX,deltaY)<(.66*(a.radius+b.radius));
};
const hasContact=(stamps,aspect)=>{
  const a=stamps.filter(s=>s.parent===0),b=stamps.filter(s=>s.parent===1);
  return a.some(x=>b.some(y=>touches(x,y,aspect)));
};
export function ensureSymbioticContact(state){
  // Never erase, translate, or silently relabel any hand-painted seed.
  // Where the 16-seed budget is already full, keep the art and let the
  // artist arrange contact manually.
  const result={...state,atmoAmount:Math.max(70,state.atmoAmount||0),
    atmoBAmount:Math.max(70,state.atmoBAmount||0),
    atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies"};
  const stamps=[...(result.habitatStamps||[])];
  const pair=String(result.ratio||"1:1").split(":").map(Number);
  const aspect=pair[0]>0&&pair[1]>0?pair[0]/pair[1]:1;
  if(hasContact(stamps,aspect))return result;
  if(stamps.length>=16)return result;
  const hasA=stamps.some(s=>s.parent===0);
  const hasB=stamps.some(s=>s.parent===1);
  // Put the contact site near the canvas center; on very wide formats,
  // normalize the x separation so the populations can actually overlap.
  const anchor=stamps.find(s=>s.parent===0) ||
    stamps.find(s=>s.parent===1);
  const x=anchor?clamp(anchor.x,.13,.87):.50;
  const y=anchor?clamp(anchor.y,.13,.87):.51;
  const shift=Math.min(.09,.07/aspect);
  const n=(result.seed||0)+"-"+(result.sporeGeneration||0);
  const ids=new Set(stamps.map(s=>s.id));
  const add=(parent,suffix,px)=>{
    let id="symbiosis-"+n+"-"+suffix;
    let tries=0;
    while(ids.has(id))id="symbiosis-"+n+"-"+suffix+"-"+(++tries);
    ids.add(id);
    stamps.push({id,x:clamp(px,.055,.945),y,radius:.19,parent});
  };
  if(!hasA&&!hasB){
    add(0,"a",x-shift);
    add(1,"b",x+shift);
  }else if(!hasA){
    add(0,"a",x-shift);
  }else if(!hasB){
    add(1,"b",x+shift);
  }else{
    // Both parent families exist but are disjoint. Add a new adjacent
    // daughter of the opposite family without moving painted work.
    const origin=stamps.find(s=>s.parent===0);
    const x1=clamp(origin.x+shift,.055,.945);
    add(1,"bridge",x1);
  }
  return {...result,habitatStamps:stamps};
}
export function applySymbiosisPreset(state,name){
  const preset=symbiosisPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:ignored,...values}=preset;
  return ensureSymbioticContact({...state,...values});
}
export function shuffleSymbiosis(state,rng=Math.random){
  const mode=choose(symbiosisModes.slice(1),rng);
  return ensureSymbioticContact({...state,
    symbiosisMode:mode,
    symbiosisAmount:64+unit(rng)*36,
    symbiosisDetail:27+unit(rng)*72,
    symbiosisMotion:18+unit(rng)*81,
    symbiosisGlow:38+unit(rng)*61,
    symbiosisDominance:unit(rng)*100,
  });
}
export const stopSymbiosis=state=>({...state,symbiosisAmount:0});
// GLSL ES 1.00: fragment-local, mathematically repeatable and confined
// to mask contact. Combines several textile-like/organism-like motifs.
export const symbiosisGLSL=`
uniform int symbiosisMode;
uniform float symbiosisAmount,symbiosisDetail,symbiosisMotion;
uniform float symbiosisGlow,symbiosisDominance;
float symbioticContact(float a,float b){
  // Only already-painted A/B intersection qualifies. No invisible
  // reaction on an empty canvas, and no extra 16-seed mask loop.
  return smoothstep(.10,.65,min(a,b));
}
vec3 livingSymbiosis(vec3 base,vec2 uv,float a,float b){
  float overlap=symbioticContact(a,b)*symbiosisAmount;
  if(overlap<=.0001||symbiosisMode==0)return base;
  vec2 uvAspect=(uv-.5)*vec2(res.x/res.y,1.);
  float t=time*(.06+symbiosisMotion*.66);
  float detail=4.+symbiosisDetail*17.;
  float phaseA=atmoHue+colorTime*.009;
  float phaseB=atmoBHue+colorTime*.009;
  vec3 aInk=palette(phaseA);
  vec3 bInk=palette(phaseB);
  vec3 third=palette((phaseA+phaseB)*.5+.31);
  float contactRim=4.*a*(1.-a)+4.*b*(1.-b);
  float tissue=0.;
  if(symbiosisMode==1){
    // Mutualism: stitched cross-threads and interlinked fluorescent
    // hyphal crossings illuminate the overlapping living interior.
    float threads=pow(max(0.,cos(uvAspect.x*detail*TAU+
      .37*sin(uvAspect.y*detail*.52-t*.17))),12.);
    float crossing=pow(max(0.,sin(uvAspect.y*detail*TAU*.79+
      .39*cos(uvAspect.x*detail*.43+t*.13))),12.);
    tissue=clamp(threads+crossing*.9,0.,1.);
    base=mix(base,base*.81+mix(aInk,bInk,.5)*.72,
      overlap*(.17+.50*tissue));
  }else if(symbiosisMode==2){
    // Parasitism: one population carves living black rot channels into
    // the other, with ionized borders carrying colored infection.
    float invasion=sin(uvAspect.x*detail*7.+
      .92*sin(uvAspect.y*detail*5.-t*.42)+t*.36);
    float lesions=smoothstep(.20,.79,invasion)*
      (.37+.63*pow(max(0.,cos(uvAspect.y*detail*4.+t*.31)),5.));
    float invader=symbiosisDominance;
    vec3 infection=mix(aInk,bInk,invader);
    base=mix(base,base*(.12+.19*infection),overlap*lesions*.79);
    tissue=lesions*(.35+.65*contactRim*.40);
  }else if(symbiosisMode==3){
    // Third-kingdom membranes: neither parental color owns the
    // interference surface; a new prismatic compound is born there.
    float bands=sin(uvAspect.x*detail*5.-
      uvAspect.y*detail*4.+sin(uvAspect.y*19.+t*.2)+t*.43);
    tissue=.5+.5*bands;
    vec3 child=palette((phaseA+phaseB)*.5+tissue*.42+
      .12*sin(t*.24));
    base=mix(base,child*(.68+.66*tissue),
      overlap*(.28+.64*tissue));
  }else if(symbiosisMode==4){
    // Electrochemical synapses spark where rival growth fronts meet.
    float spark=sin(uvAspect.x*detail*13.+t*.7+
      1.1*sin(uvAspect.y*detail*5.-t*.31));
    float arc=pow(max(0.,spark),20.);
    float cross=pow(max(0.,sin(uvAspect.y*detail*9.-
      uvAspect.x*detail*3.+t*.37)),18.);
    tissue=clamp(arc+cross*.65,0.,1.);
    base=mix(base,base*.73+third*.49,
      overlap*(.12+.48*tissue));
  }
  // Exposed edges always have an independently tunable light trace.
  float intensity=overlap*symbiosisGlow*
    (.16+min(1.,tissue)*.84)*(.34+.66*min(1.,contactRim*.6));
  base+=mix(third,mix(aInk,bInk,symbiosisDominance),.31)*
    intensity*.86;
  return clamp(base,vec3(0.),vec3(2.));
}
`;
