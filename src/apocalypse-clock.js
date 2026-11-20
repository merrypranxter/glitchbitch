// APOCALYPSE CLOCK — time-stepped ecological catastrophe, not hidden death.
// The integer epoch is saved with the artwork. Nutrient chemistry is static
// within an epoch; visible heat, rain and crystalline light may animate.
// CPU and GLSL evaluate the SAME resource distortion, so survival rankings
// and permanently saved offspring agree with the preview/export environment.
export const apocalypseModes=[
  "Dormant","Crystal winter","Acid monsoon","Solar flare",
  "Tectonic rupture","Radiation garden",
];
export const apocalypseControls=[
  "apocalypseAmount","apocalypseScale","apocalypseMotion",
  "apocalypsePressure","apocalypseGlow","apocalypseHue",
];
export const apocalypsePresets=[
  {name:"Cryogenic Opal Graveyard",apocalypseMode:"Crystal winter",
    apocalypseAmount:97,apocalypseScale:74,apocalypseMotion:32,
    apocalypsePressure:92,apocalypseGlow:96,apocalypseHue:23},
  {name:"Acid Monsoon Cathedral",apocalypseMode:"Acid monsoon",
    apocalypseAmount:95,apocalypseScale:58,apocalypseMotion:86,
    apocalypsePressure:87,apocalypseGlow:91,apocalypseHue:82},
  {name:"Solar Flare Carapace",apocalypseMode:"Solar flare",
    apocalypseAmount:98,apocalypseScale:81,apocalypseMotion:77,
    apocalypsePressure:95,apocalypseGlow:94,apocalypseHue:41},
  {name:"Tectonic Mycelium Rift",apocalypseMode:"Tectonic rupture",
    apocalypseAmount:95,apocalypseScale:67,apocalypseMotion:54,
    apocalypsePressure:89,apocalypseGlow:90,apocalypseHue:65},
  {name:"Radiation Garden Rebirth",apocalypseMode:"Radiation garden",
    apocalypseAmount:99,apocalypseScale:72,apocalypseMotion:68,
    apocalypsePressure:90,apocalypseGlow:100,apocalypseHue:93},
];
const TAU=Math.PI*2;
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const unit=rng=>{
  const value=Number(rng());
  return Number.isFinite(value)?clamp(value,0,1-Number.EPSILON):0;
};
const mix=(a,b,t)=>a+(b-a)*t;
export const apocalypseActive=state=>
  (state.apocalypseAmount||0)>0 && state.apocalypseMode!=="Dormant" &&
  state.substrateAmount>0 && state.substrateMode!=="Bare canvas";
// Keep climate geometry static during animation; changing the discrete
// epoch is the ONLY operation that changes the ecological fitness terrain.
export function apocalypseSignal(state,x,y){
  if(!apocalypseActive(state))return .5;
  const f=1.6+(state.apocalypseScale||0)/100*5.4;
  const phase=(state.apocalypseEpoch||0)*.91;
  let n=.5;
  switch(state.apocalypseMode){
    case "Crystal winter":{
      n=.5+.5*Math.cos((x+y*.65)*f*TAU+
        .6*Math.sin(y*9+phase*.42)+phase);
      break;
    }
    case "Acid monsoon":{
      n=.5+.5*Math.sin(x*f*TAU+
        .9*Math.sin(y*7+phase*.4)+phase);
      break;
    }
    case "Solar flare":{
      n=.5+.5*Math.sin((x*.7-y*.3)*f*TAU+phase);
      break;
    }
    case "Tectonic rupture":{
      const a=Math.pow(1-Math.abs(Math.sin(
        (x+y*.22)*f*TAU+phase)),3);
      const b=Math.pow(1-Math.abs(Math.cos(
        (y-x*.28)*f*TAU-phase*.6)),3);
      n=Math.max(a,b);
      break;
    }
    case "Radiation garden":{
      const radius=Math.hypot(x-.5+.11*Math.sin(phase*.37),
        y-.5+.1*Math.cos(phase*.29));
      n=.5+.5*Math.sin(radius*f*TAU+phase);
      break;
    }
  }
  return clamp(n,0,1);
}
export function apocalypseResource(state,x,y,original){
  if(!apocalypseActive(state))return original;
  const signal=apocalypseSignal(state,x,y);
  let target=signal;
  if(state.apocalypseMode==="Crystal winter")target=signal*.68;
  else if(state.apocalypseMode==="Acid monsoon")target=1-signal;
  else if(state.apocalypseMode==="Solar flare")target=.1+.68*(1-signal);
  else if(state.apocalypseMode==="Tectonic rupture")target=signal;
  else if(state.apocalypseMode==="Radiation garden")target=.18+.82*signal;
  const pressure=state.apocalypseAmount/100*
    state.apocalypsePressure/100;
  return clamp(mix(original,target,pressure),0,1);
}
export function advanceApocalypseEpoch(state){
  if(!apocalypseActive(state) || (state.apocalypseEpoch||0)>=4095)
    return state;
  return {...state,apocalypseEpoch:(state.apocalypseEpoch||0)+1};
}
export const haltApocalypse=state=>({...state,apocalypseAmount:0});
export function shuffleApocalypse(state,rng=Math.random){
  return {...state,
    apocalypseMode:apocalypseModes[1+Math.floor(unit(rng)*(apocalypseModes.length-1))],
    apocalypseAmount:62+unit(rng)*38,
    apocalypseScale:21+unit(rng)*78,
    apocalypseMotion:16+unit(rng)*83,
    apocalypsePressure:34+unit(rng)*65,
    apocalypseGlow:35+unit(rng)*64,
    apocalypseHue:unit(rng)*100,
    apocalypseEpoch:Math.floor(unit(rng)*6),
  };
}
export function applyApocalypsePreset(state,name){
  const p=apocalypsePresets.find(p=>p.name===name);
  if(!p)return state;
  const {name:ignored,...fields}=p;
  return {...state,...fields};
}
export const apocalypseGLSL=`
uniform int apocalypseMode;
uniform float apocalypseAmount,apocalypseScale,apocalypseMotion;
uniform float apocalypsePressure,apocalypseGlow,apocalypseHue;
uniform float apocalypseEpoch;
float apocalypseSignal(vec2 uv){
  float x=uv.x,y=uv.y;
  float f=1.6+apocalypseScale*5.4;
  float phase=apocalypseEpoch*.91;
  float n=.5;
  if(apocalypseMode==1){
    n=.5+.5*cos((x+y*.65)*f*TAU+
      .6*sin(y*9.+phase*.42)+phase);
  }else if(apocalypseMode==2){
    n=.5+.5*sin(x*f*TAU+
      .9*sin(y*7.+phase*.4)+phase);
  }else if(apocalypseMode==3){
    n=.5+.5*sin((x*.7-y*.3)*f*TAU+phase);
  }else if(apocalypseMode==4){
    float a=pow(1.-abs(sin((x+y*.22)*f*TAU+phase)),3.);
    float b=pow(1.-abs(cos((y-x*.28)*f*TAU-phase*.6)),3.);
    n=max(a,b);
  }else if(apocalypseMode==5){
    float radius=length(uv-.5+vec2(.11*sin(phase*.37),
      .1*cos(phase*.29)));
    n=.5+.5*sin(radius*f*TAU+phase);
  }
  return clamp(n,0.,1.);
}
float apocalypseResource(vec2 uv,float original){
  float signal=apocalypseSignal(uv);
  float target=signal;
  if(apocalypseMode==1)target=signal*.68;
  else if(apocalypseMode==2)target=1.-signal;
  else if(apocalypseMode==3)target=.1+.68*(1.-signal);
  else if(apocalypseMode==4)target=signal;
  else if(apocalypseMode==5)target=.18+.82*signal;
  return clamp(mix(original,target,
    apocalypseAmount*apocalypsePressure),0.,1.);
}
vec3 shadeApocalypse(vec3 col,vec2 uv){
  float signal=apocalypseSignal(uv);
  float fronts=pow(signal,2.2);
  float beating=.5+.5*sin(time*(.08+apocalypseMotion*.72)+
    signal*13.+uv.x*5.-uv.y*6.);
  vec3 ion=palette(apocalypseHue+signal*.41+colorTime*.008);
  col=mix(col,col*.44+ion*.83,
    apocalypseAmount*(.12+.44*fronts));
  col+=ion*apocalypseAmount*apocalypseGlow*
    (.13+.31*beating)*fronts;
  return clamp(col,vec3(0.),vec3(2.));
}
`;
