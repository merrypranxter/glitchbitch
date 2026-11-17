/**
 * TEXT CHOREOGRAPHER
 * One-tap editable FX recipes. NEVER touches actual words, typeface, user fill
 * stops, stroke rings, manual placement, font size or background artwork.
 * Each named preset deliberately changes only text FX/movement parameters.
 */
import { letteringStyles } from "./data.js";
import { letteringMotionPaths } from "./lettering-motion.js";
import { letteringBlendModes } from "./lettering-blends.js";

const preset=(id,label,description,settings)=>({id,label,description,settings});
export const textChoreographyGroups=[
 {label:"Prismatic Glamour",presets:[
  preset("opal-orbit","Opal Orbit","Iridescent halo on an elliptical orbit.",{
   letteringStyle:"Holographic",letteringBlendMode:"Screen",letteringBlendStrength:88,
   letteringMotionPath:"Ellipse",letteringMotionPath2:"Letter wave",letteringMotionMix:45,
   letteringMotion:68,letteringMotionSpeed:1,letteringMotionStagger:18,letteringWarp:18}),
  preset("chrome-jellyfish","Chrome Jellyfish","Polished metal pulsates like a floating organism.",{
   letteringStyle:"Chrome foil",letteringBlendMode:"Hard light",letteringBlendStrength:81,
   letteringMotionPath:"Float",letteringMotionPath2:"Letter rubber",letteringMotionMix:73,
   letteringMotion:76,letteringMotionSpeed:2,letteringMotionStagger:24,letteringWarp:47}),
  preset("liquid-lollipop","Liquid Lollipop","Candy colors loop in a soft wobbly figure eight.",{
   letteringStyle:"Liquid candy",letteringBlendMode:"Soft light",letteringBlendStrength:72,
   letteringMotionPath:"Figure eight",letteringMotionPath2:"Letter float",letteringMotionMix:53,
   letteringMotion:82,letteringMotionSpeed:1,letteringMotionStagger:17,letteringWarp:63}),
  preset("prism-pirouette","Prism Pirouette","A chromatic swirl with staggered letter spins.",{
   letteringStyle:"Prism pulse",letteringBlendMode:"Color dodge",letteringBlendStrength:79,
   letteringMotionPath:"Orbit",letteringMotionPath2:"Letter spin counterclockwise",letteringMotionMix:66,
   letteringMotion:75,letteringMotionSpeed:2,letteringMotionStagger:11,letteringWarp:22}),
  preset("shimmer-tide","Shimmer Tide","Spectral shimmer flowing through a wave of letters.",{
   letteringStyle:"Chromatic shimmer",letteringBlendMode:"Overlay",letteringBlendStrength:87,
   letteringMotionPath:"Breathing",letteringMotionPath2:"Letter wave",letteringMotionMix:90,
   letteringMotion:83,letteringMotionSpeed:2,letteringMotionStagger:26,letteringWarp:54}),
  preset("glitterquake","Glitterquake","Sequin glitter, pulsing bounce and hot pink energy.",{
   letteringStyle:"Glitter ink",letteringBlendMode:"Linear dodge",letteringBlendStrength:75,
   letteringMotionPath:"Heartbeat",letteringMotionPath2:"Letter bounce",letteringMotionMix:80,
   letteringMotion:92,letteringMotionSpeed:3,letteringMotionStagger:29,letteringWarp:32})
 ]},
 {label:"Internet Necromancy",presets:[
  preset("myspace-afterlife","MySpace Afterlife","Holographic ghosts dancing through old-internet color splits.",{
   letteringStyle:"RGB split",letteringBlendMode:"Afterimage ink",letteringBlendStrength:95,
   letteringMotionPath:"Classic drift",letteringMotionPath2:"Letter wiggle",letteringMotionMix:75,
   letteringMotion:87,letteringMotionSpeed:3,letteringMotionStagger:35,letteringWarp:48}),
  preset("negative-seance","Negative Séance","Difference inversion with an unsettling pendulum ritual.",{
   letteringStyle:"Void stencil",letteringBlendMode:"Negative blink",letteringBlendStrength:100,
   letteringMotionPath:"Pendulum",letteringMotionPath2:"Letter sway",letteringMotionMix:69,
   letteringMotion:75,letteringMotionSpeed:1,letteringMotionStagger:14,letteringWarp:28}),
  preset("vhs-love-spasm","VHS Love Spasm","Chromatic teeth and a rapid jittery slalom.",{
   letteringStyle:"RGB split",letteringBlendMode:"Chromatic teeth",letteringBlendStrength:94,
   letteringMotionPath:"Slalom",letteringMotionPath2:"Letter flutter",letteringMotionMix:84,
   letteringMotion:96,letteringMotionSpeed:3,letteringMotionStagger:31,letteringWarp:61}),
  preset("404-haunting","404 Haunting","Foggy spectral leftovers with a slow spectral swap.",{
   letteringStyle:"Ghost echo",letteringBlendMode:"Spectral swap",letteringBlendStrength:87,
   letteringMotionPath:"Float",letteringMotionPath2:"Letter fade",letteringMotionMix:75,
   letteringMotion:65,letteringMotionSpeed:1,letteringMotionStagger:30,letteringWarp:29}),
  preset("dialup-exorcism","Dialup Exorcism","Nasty add/subtract colors with rhythmic rubber motions.",{
   letteringStyle:"Electric glow",letteringBlendMode:"Hard mix",letteringBlendStrength:86,
   letteringMotionPath:"Zigzag",letteringMotionPath2:"Letter rubber",letteringMotionMix:72,
   letteringMotion:94,letteringMotionSpeed:3,letteringMotionStagger:28,letteringWarp:68}),
  preset("ghost-in-the-modem","Ghost in the Modem","Inverse blinking with a skipping beat and phosphor ghosts.",{
   letteringStyle:"Ghost echo",letteringBlendMode:"Exclusion",letteringBlendStrength:93,
   letteringMotionPath:"Ricochet",letteringMotionPath2:"Letter twinkle",letteringMotionMix:70,
   letteringMotion:88,letteringMotionSpeed:2,letteringMotionStagger:42,letteringWarp:21})
 ]},
 {label:"Math Ballet",presets:[
  preset("mobius-tango","Möbius Tango","Opposing spinning letters travel along an infinity loop.",{
   letteringStyle:"Holographic",letteringBlendMode:"Difference",letteringBlendStrength:92,
   letteringMotionPath:"Infinity loop",letteringMotionPath2:"Letter spin clockwise",letteringMotionMix:64,
   letteringMotion:83,letteringMotionSpeed:2,letteringMotionStagger:13,letteringWarp:20}),
  preset("pendulum-choir","Pendulum Choir","Swinging sine-wave lettering with a calming echo.",{
   letteringStyle:"Soft shadow",letteringBlendMode:"Soft light",letteringBlendStrength:77,
   letteringMotionPath:"Pendulum",letteringMotionPath2:"Letter sway",letteringMotionMix:85,
   letteringMotion:75,letteringMotionSpeed:1,letteringMotionStagger:16,letteringWarp:29}),
  preset("corkscrew-opera","Corkscrew Opera","Ribbon-like spinning around an imaginary shaft.",{
   letteringStyle:"Chrome foil",letteringBlendMode:"Reflect",letteringBlendStrength:88,
   letteringMotionPath:"Corkscrew",letteringMotionPath2:"Letter corkscrew",letteringMotionMix:80,
   letteringMotion:85,letteringMotionSpeed:2,letteringMotionStagger:16,letteringWarp:35}),
  preset("rubber-universe","Rubber Universe","Springy impacts and pulsing, breathing letterforms.",{
   letteringStyle:"Liquid candy",letteringBlendMode:"Vivid light",letteringBlendStrength:81,
   letteringMotionPath:"Rubber bounce",letteringMotionPath2:"Letter pulse",letteringMotionMix:92,
   letteringMotion:95,letteringMotionSpeed:2,letteringMotionStagger:22,letteringWarp:72}),
  preset("lissajous-love","Lissajous Love","A geometric figure eight with offset liquid waves.",{
   letteringStyle:"Neon bling",letteringBlendMode:"Screen",letteringBlendStrength:90,
   letteringMotionPath:"Figure eight",letteringMotionPath2:"Letter wave",letteringMotionMix:93,
   letteringMotion:85,letteringMotionSpeed:3,letteringMotionStagger:33,letteringWarp:42}),
  preset("constellation-breath","Constellation Breath","Slow synchronized orbiting with pearlescent shimmer.",{
   letteringStyle:"Holographic",letteringBlendMode:"Lighten",letteringBlendStrength:76,
   letteringMotionPath:"Orbit",letteringMotionPath2:"Letter float",letteringMotionMix:36,
   letteringMotion:53,letteringMotionSpeed:1,letteringMotionStagger:23,letteringWarp:15})
 ]},
 {label:"Unhinged Circus",presets:[
  preset("acid-carnival","Acid Carnival","Overdriven color burn on jittering letters.",{
   letteringStyle:"Heatwave",letteringBlendMode:"Acid smear",letteringBlendStrength:94,
   letteringMotionPath:"Ricochet",letteringMotionPath2:"Letter wiggle",letteringMotionMix:91,
   letteringMotion:100,letteringMotionSpeed:4,letteringMotionStagger:37,letteringWarp:90}),
  preset("prism-possession","Prism Possession","A spectral flip through neon color channels.",{
   letteringStyle:"Prism pulse",letteringBlendMode:"Prism bleed",letteringBlendStrength:100,
   letteringMotionPath:"Spin counterclockwise",letteringMotionPath2:"Letter flutter",letteringMotionMix:68,
   letteringMotion:85,letteringMotionSpeed:2,letteringMotionStagger:29,letteringWarp:73}),
  preset("neon-feral","Neon Feral","Electric add mode and a hyperactive sliding word dance.",{
   letteringStyle:"Electric glow",letteringBlendMode:"Add",letteringBlendStrength:91,
   letteringMotionPath:"Slide side to side",letteringMotionPath2:"Letter bounce",letteringMotionMix:84,
   letteringMotion:100,letteringMotionSpeed:4,letteringMotionStagger:40,letteringWarp:44}),
  preset("void-rat-king","Void Rat King","Shadowy inversion dripping from a slalom path.",{
   letteringStyle:"Void stencil",letteringBlendMode:"Void leak",letteringBlendStrength:100,
   letteringMotionPath:"Slalom",letteringMotionPath2:"Letter rubber",letteringMotionMix:78,
   letteringMotion:96,letteringMotionSpeed:3,letteringMotionStagger:38,letteringWarp:77}),
  preset("holo-heart-attack","Holo Heart Attack","Stuttering glitter and a pounding typography heartbeat.",{
   letteringStyle:"Glitter ink",letteringBlendMode:"Strobe XOR",letteringBlendStrength:92,
   letteringMotionPath:"Heartbeat",letteringMotionPath2:"Letter twinkle",letteringMotionMix:95,
   letteringMotion:100,letteringMotionSpeed:4,letteringMotionStagger:45,letteringWarp:52}),
  preset("melt-the-moon","Melt the Moon","Slow liquid chroma as letters collapse into each other.",{
   letteringStyle:"Liquid candy",letteringBlendMode:"Color burn",letteringBlendStrength:80,
   letteringMotionPath:"Breathing",letteringMotionPath2:"Letter rubber",letteringMotionMix:70,
   letteringMotion:74,letteringMotionSpeed:1,letteringMotionStagger:12,letteringWarp:95})
 ]}
];
export const textChoreographies=textChoreographyGroups.flatMap(g=>g.presets);
export const textChoreographyKeys=[
 "letteringStyle","letteringBlendMode","letteringBlendStrength",
 "letteringMotionPath","letteringMotionPath2","letteringMotionMix",
 "letteringMotion","letteringMotionSpeed","letteringMotionStagger",
 "letteringMotionDirection","letteringWarp"
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const integer=(min,max,rng)=>min+Math.floor(Math.max(0,Math.min(.999999999,rng()))*(max-min+1));
const other=(arr,current,rng)=>{const options=arr.filter(x=>x!==current);return options[integer(0,options.length-1,rng)]||current;};
export function applyTextChoreography(layer,id){
 const recipe=textChoreographies.find(p=>p.id===id);
 if(!recipe)return layer;
 // Preserve all user-authored content, layout, typography and color.
 return {...layer,...recipe.settings,letteringMotionDirection:recipe.settings.letteringMotionDirection||"Forward"};
}
export function remixTextChoreography(layer,scope="all",rng=Math.random){
 if(scope==="all"){
   const current=textChoreographies.find(p=>
     p.settings.letteringMotionPath===layer.letteringMotionPath &&
     p.settings.letteringBlendMode===layer.letteringBlendMode &&
     p.settings.letteringStyle===layer.letteringStyle);
   const options=textChoreographies.filter(p=>p.id!==current?.id);
   const choice=options[integer(0,options.length-1,rng)];
   return applyTextChoreography(layer,choice.id);
 }
 if(scope==="motion"){
   const primary=other(letteringMotionPaths,layer.letteringMotionPath||"Classic drift",rng);
   const second=rng()<.3?"None":other(letteringMotionPaths,primary,rng);
   return {...layer,letteringMotionPath:primary,letteringMotionPath2:second,
     letteringMotion:integer(50,100,rng),letteringMotionSpeed:integer(1,4,rng),
     letteringMotionMix:integer(35,95,rng),letteringMotionStagger:integer(5,55,rng),
     letteringMotionDirection:rng()<.5?"Forward":"Reverse",
     letteringWarp:integer(5,85,rng)};
 }
 if(scope==="blend"){
   return {...layer,
     letteringStyle:other(letteringStyles,layer.letteringStyle||"Custom ink",rng),
     letteringBlendMode:other(letteringBlendModes,layer.letteringBlendMode||"Normal",rng),
     letteringBlendStrength:integer(50,100,rng)};
 }
 return layer;
}
export function mutateTextChoreography(layer,rng=Math.random){
 const number=(field,step,min,max)=>{
   const value=Number.isFinite(Number(layer[field]))?Number(layer[field]):min;
   return Math.round(clamp(value + (rng()-.5)*2*step,min,max));
 };
 const changed={...layer,
   letteringMotion:number("letteringMotion",25,0,100),
   letteringMotionMix:number("letteringMotionMix",25,0,100),
   letteringMotionStagger:number("letteringMotionStagger",20,0,100),
   letteringWarp:number("letteringWarp",25,0,100),
   letteringBlendStrength:number("letteringBlendStrength",20,0,100)
 };
 if(rng()<.23)changed.letteringMotionPath=other(letteringMotionPaths,layer.letteringMotionPath,rng);
 if(rng()<.21)changed.letteringBlendMode=other(letteringBlendModes,layer.letteringBlendMode,rng);
 if(rng()<.18)changed.letteringStyle=other(letteringStyles,layer.letteringStyle,rng);
 if(rng()<.15)changed.letteringMotionSpeed=integer(1,4,rng);
 return changed;
}
