/**
 * Text blend recipes. Standard modes are genuine CSS/Canvas compositing.
 * Extended and original looks deliberately emulate Photoshop-like effects
 * with documented native blend + color/echo layers: no GPU shader dependency.
 */
export const letteringBlendGroups = [
  {label:"Classic / Photoshop",modes:[
    "Normal","Multiply","Screen","Overlay","Darken","Lighten",
    "Color dodge","Color burn","Hard light","Soft light","Difference",
    "Exclusion","Hue","Saturation","Color","Luminosity"
  ]},
  {label:"Add / Subtract / Negative",modes:[
    "Add","Linear dodge","Color add","Subtract","Divide","Linear burn",
    "Negate","Negative","Negative blink","Darker color","Lighter color"
  ]},
  {label:"Advanced light math",modes:[
    "Vivid light","Pin light","Linear light","Hard mix","Hard mix posterized",
    "Reflect","Glow","Phoenix"
  ]},
  {label:"Experimental weirdos",modes:[
    "Prism bleed","Ghost burn","Acid smear","Void leak","Strobe XOR",
    "Spectral swap","Solarize","Chromatic teeth","Afterimage ink"
  ]}
];
export const letteringBlendModes=letteringBlendGroups.flatMap(g=>g.modes);
// The first two UI families use fundamental CSS/Canvas compositing. Their
// text shadows and colored ink MUST pass through the SAME chosen blend, or
// the exporter gets a pale Screen halo that the live preview never used.
// The more involved experimental families retain their own effects.
const foundationModes=new Set(letteringBlendGroups.slice(0,2).flatMap(g=>g.modes));
export const isFoundationBlend=mode=>foundationModes.has(mode);


const native = {
  "Normal":["normal","source-over"],
  "Multiply":["multiply","multiply"], "Screen":["screen","screen"],
  "Overlay":["overlay","overlay"], "Darken":["darken","darken"],
  "Lighten":["lighten","lighten"],
  "Color dodge":["color-dodge","color-dodge"],
  "Color burn":["color-burn","color-burn"],
  "Hard light":["hard-light","hard-light"],
  "Soft light":["soft-light","soft-light"],
  "Difference":["difference","difference"],
  "Exclusion":["exclusion","exclusion"],
  "Hue":["hue","hue"], "Saturation":["saturation","saturation"],
  "Color":["color","color"], "Luminosity":["luminosity","luminosity"],
  "Add":["plus-lighter","lighter"],
  "Linear dodge":["plus-lighter","lighter"]
};
const special = {
  "Color add":{ cssBlend:"screen",canvasBlend:"screen",filter:"saturate(1.75) brightness(1.17)" },
  "Subtract":{ cssBlend:"difference",canvasBlend:"difference",filter:"brightness(.66) contrast(1.5)" },
  "Divide":{ cssBlend:"screen",canvasBlend:"screen",filter:"brightness(1.65) contrast(1.3)" },
  "Linear burn":{ cssBlend:"multiply",canvasBlend:"multiply",filter:"brightness(.63) contrast(1.25)" },
  "Negate":{ cssBlend:"exclusion",canvasBlend:"exclusion",whiteInk:true },
  "Negative":{ cssBlend:"difference",canvasBlend:"difference",whiteInk:true },
  "Negative blink":{ cssBlend:"difference",canvasBlend:"difference",whiteInk:true,animation:"negative-blink" },
  "Darker color":{ cssBlend:"darken",canvasBlend:"darken",filter:"contrast(1.45)" },
  "Lighter color":{ cssBlend:"lighten",canvasBlend:"lighten",filter:"brightness(1.25)" },
  "Vivid light":{ cssBlend:"color-dodge",canvasBlend:"color-dodge",filter:"contrast(1.5) saturate(1.65)",
    passes:[{cssBlend:"color-burn",canvasBlend:"color-burn",alpha:.42,filter:"brightness(.78)"}] },
  "Pin light":{ cssBlend:"lighten",canvasBlend:"lighten",filter:"contrast(1.15)",
    passes:[{cssBlend:"darken",canvasBlend:"darken",alpha:.45}] },
  "Linear light":{ cssBlend:"overlay",canvasBlend:"overlay",filter:"brightness(1.3) contrast(1.25)",
    passes:[{cssBlend:"screen",canvasBlend:"screen",alpha:.33}] },
  "Hard mix":{ cssBlend:"difference",canvasBlend:"difference",filter:"contrast(3.5) saturate(2.2)" },
  "Hard mix posterized":{ cssBlend:"overlay",canvasBlend:"overlay",filter:"contrast(6) saturate(4)" },
  "Reflect":{ cssBlend:"color-dodge",canvasBlend:"color-dodge",filter:"brightness(1.5) contrast(1.6)" },
  "Glow":{ cssBlend:"screen",canvasBlend:"screen",filter:"brightness(1.35) saturate(1.4)",
    passes:[{cssBlend:"screen",canvasBlend:"screen",alpha:.55,filter:"blur(3px)"}] },
  "Phoenix":{ cssBlend:"difference",canvasBlend:"difference",filter:"hue-rotate(24deg)",
    passes:[{cssBlend:"exclusion",canvasBlend:"exclusion",alpha:.48,filter:"saturate(1.6)"}] },
  "Prism bleed":{ cssBlend:"screen",canvasBlend:"screen",filter:"saturate(1.7)",animation:"prism-bleed",
    passes:[{cssBlend:"screen",canvasBlend:"screen",alpha:.48,offsetX:-7,tint:"#ff33bd"},
      {cssBlend:"screen",canvasBlend:"screen",alpha:.48,offsetX:7,tint:"#38f5ff"}] },
  "Ghost burn":{ cssBlend:"color-burn",canvasBlend:"color-burn",filter:"contrast(1.3)",
    passes:[{cssBlend:"screen",canvasBlend:"screen",alpha:.52,offsetX:5,offsetY:4,tint:"#d5a2ff"}] },
  "Acid smear":{ cssBlend:"overlay",canvasBlend:"overlay",filter:"saturate(2.3) contrast(1.4)",animation:"acid-smear",
    passes:[{cssBlend:"difference",canvasBlend:"difference",alpha:.36,offsetX:-5,tint:"#beff36"}] },
  "Void leak":{ cssBlend:"difference",canvasBlend:"difference",filter:"brightness(.77)",
    passes:[{cssBlend:"multiply",canvasBlend:"multiply",alpha:.6,offsetY:8,filter:"blur(2px)"}] },
  "Strobe XOR":{ cssBlend:"difference",canvasBlend:"difference",whiteInk:true,animation:"strobe-xor" },
  "Spectral swap":{ cssBlend:"hue",canvasBlend:"hue",filter:"hue-rotate(100deg)",animation:"spectral-swap" },
  "Solarize":{ cssBlend:"exclusion",canvasBlend:"exclusion",filter:"contrast(2.1) invert(.4)" },
  "Chromatic teeth":{ cssBlend:"difference",canvasBlend:"difference",filter:"saturate(2)",
    passes:[{cssBlend:"screen",canvasBlend:"screen",alpha:.44,offsetX:-8,tint:"#00ffb7"},
      {cssBlend:"screen",canvasBlend:"screen",alpha:.44,offsetX:8,tint:"#ff215e"}] },
  "Afterimage ink":{ cssBlend:"screen",canvasBlend:"screen",animation:"afterimage-ink",
    passes:[{cssBlend:"exclusion",canvasBlend:"exclusion",alpha:.44,offsetX:-9,offsetY:5,tint:"#9e6bff"},
      {cssBlend:"screen",canvasBlend:"screen",alpha:.37,offsetX:8,offsetY:-4,tint:"#86ffdc"}] }
};
const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,Number.isFinite(+value)?+value:min));
export function getLetteringBlendRecipe(mode="Normal",strength=100) {
  const selected=letteringBlendModes.includes(mode)?mode:"Normal";
  const mix=clamp(strength,0,100)/100;
  const both=native[selected];
  if(both)return {
    mode:selected,strength:mix,cssBlend:both[0],canvasBlend:both[1],
    filter:"none",whiteInk:false,animation:null,passes:[],exact:true,
    foundation:isFoundationBlend(selected)
  };
  return {
    mode:selected,strength:mix,filter:"none",whiteInk:false,animation:null,passes:[],
    exact:false,foundation:isFoundationBlend(selected),...special[selected]
  };
}
export function letteringBlendPulse(animation,seconds) {
  const t=Math.max(0,Number(seconds)||0);
  if(animation==="negative-blink")return Math.floor(t*2.5)%2===0?1:0.06;
  if(animation==="strobe-xor")return Math.floor(t*4)%2===0?1:0.12;
  if(animation==="afterimage-ink")return .7+.3*Math.sin(t*3.7);
  return 1;
}
