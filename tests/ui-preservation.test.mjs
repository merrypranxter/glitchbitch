import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges} from "../src/data.js";
import {sections,findControls,sectionMeta,sectionActive} from "../src/ui-index.js";
import {photonSpecies} from "../src/photon-zoo.js";
import {letteringBlendModes} from "../src/lettering-blends.js";
import {letteringMotionPaths} from "../src/lettering-motion.js";
import {textChoreographies} from "../src/text-choreographies.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const inspector=read("components/Inspectors.jsx");
const controls=read("components/Controls.jsx");
const textUI=read("components/TextInspector.jsx");
const colors=read("components/ColorLab.jsx");
const app=read("main.jsx");
const exp=read("components/ExportDialog.jsx");

test("Claude UI preserves every old numeric art/text parameter",()=>{
 const names=`afterimage backdropAmount backdropDensity backdropDepth backdropGlow backdropHue
  backdropMotion backdropVariation bioAmount bioFeed bioKill bioSpeed bioVeins blend block
  brightness broadcast colorAmount colorOffset colorRepeat colorSpeed complexity compositionAmount compositionColorShift compositionFeather
  compositionMotion compositionScale compositionVariation datamosh dither filmAmount
  filmThickness foilMotion foilRelief fractalZoom freezeGeometry freezeColor glitch glitter grain
  hyperbolicFold juliaMix letteringAmount letteringBlendStrength letteringCurve
  letteringGradientAngle letteringLineSpacing letteringMotion letteringMotionMix
  letteringMotionSpeed letteringMotionStagger letteringRotation letteringScale
  letteringStretchX letteringStretchY letteringTracking letteringWarp letteringX
  letteringY lightMotion memoryDecay memoryDrift microAmount microDensity microHue
  microMotion microRelief microScale microVariation mirror misregister motionAmount
  motionRate opalAmount phosphor photonAmount photonDensity photonHue photonMotion
  photonRelief photonScale photonVariation pixel prismAmount quasiDensity radius riso
  rotation saturation scale scan speed split stereoAmount stereoDepth stereoGlow stereoMorph
  stereoParallax stereoQuality stereoWiggle strength substanceAmount substanceEdge
  substanceHue substanceMotion substanceRelief substanceScale substanceVariation
  symmetry tunnelAperture tunnelDepth tunnelPulse tunnelRidges tunnelTwist
  tunnelVariation vignette warp wiggleAmount wiggleDepth wiggleLayers wiggleSpeed
  windowCascade`.split(/\s+/).filter(Boolean);
 const all=inspector+"\n"+colors+"\n"+textUI;
 for(const name of names){
  if(["freezeGeometry","freezeColor","mirror"].includes(name))
   assert.equal(typeof initial[name],"boolean",name+" has a boolean default");
  else assert.ok(Object.hasOwn(numericRanges,name),name+" has a numeric range");
  assert.ok(all.includes('name="'+name+'"'),name+" remains editable");
 }
 for(const k of ["bloom","posterize","invert"]){
  assert.ok(Object.hasOwn(initial,k));
  assert.match(inspector,new RegExp('\\["'+k+'","', "i"),k+" pill still exists");
 }
});
test("Optical Zoo stays alive, opt-in and manually hideable",()=>{
 assert.equal(photonSpecies.length,8);
 for(const k of ["photonAmount","photonScale","photonMotion","photonDensity",
   "photonRelief","photonHue","photonVariation"])
   assert.ok(inspector.includes('name="'+k+'"'),k);
 for(const marker of ["photon: <>","Spawn selected sculpture","New creature, keep art",
    "Reseed","Hide photons"])
   assert.ok(inspector.includes(marker),marker);
 assert.equal(sectionActive(sectionMeta("photon"),initial),false);
 assert.equal(sectionActive(sectionMeta("photon"),{...initial,photonAmount:77}),true);
});
test("Exactly one text editor still offers all accumulated rich text features",()=>{
 assert.equal((textUI.match(/className="text-input"/g)||[]).length,1);
 for(const marker of ["toggleTextFormat","setTextInk","setTextRainbow",
   "clearTextInk","letteringFormats","rebaseTextFormats",
   "letteringTracking","letteringLineSpacing","textChoreographies",
   "letteringMotionGroups","letteringBlendGroups","letteringMotionPath2"])
   assert.ok(textUI.includes(marker),marker);
 assert.equal(letteringBlendModes.length,44);
 assert.equal(letteringMotionPaths.length,34);
 assert.equal(textChoreographies.length,24);
 assert.match(inspector,/export \{ TextInspector \} from "\.\/TextInspector"/);
});
test("Find and sections still navigate through math, art, text and color",()=>{
 assert.equal(new Set(sections.map(s=>s.id)).size,sections.length);
 assert.equal(findControls("photon")[0].id,"photon");
 assert.equal(findControls("outline")[0].id,"text-color");
 assert.equal(findControls("scanlines")[0].id,"analog");
 assert.equal(findControls("gradient")[0].pane,"Color");
 assert.match(app,/<FindControl onPick=\{pickControl\}/);
 assert.match(app,/requestReveal\(\{ id: hit\.id, pane: hit\.pane \}\)/);
 assert.match(controls,/export function useReveal/);
});
test("Export proof and repaired JSX remain intact across UI redesign",()=>{
 assert.match(exp,/See flattened export proof/);
 assert.match(exp,/\{error&&<p className="field-error" role="alert">\{error\}<\/p>\}/);
 const composer=read("text-compositor.js");
 assert.match(composer,/letteringExportGlowLayers/);
 assert.match(composer,/const echoX=/);
 const renderer=read("renderer.js");
 assert.match(renderer,/livingPhotonZoo\(col,uv,p,v\)/);
});
