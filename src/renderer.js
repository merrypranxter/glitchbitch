import { appearanceGLSL } from "./appearance.js";
import {structuralOpticsModes} from "./structural-thread-optics.js";
import { artworkParityError } from "./export-parity.js";
import { geometryGLSL } from "./geometry.js";
import {createSchlierenPass} from "./schlieren-pass.js";
import {hexagramGLSL} from "./hexagram-terraces.js";
import {polesModes,polesGLSL} from "./complex-poles.js";
import {qdModes,qdOrders,qdGLSL} from "./quasicrystal-dissolution.js";
import {velvetModes,crochetModes,velvetGLSL,crochetGLSL} from "./living-textiles-wave5.js";
import {breedModes,breedActive,breedGLSL} from "./crossbreed-lab.js";
import {g2Modes,g2GLSL} from "./g2-torsion-membranes.js";
import {spxModes,spxGLSL} from "./subpixel-moire-wave11.js";
import {psModes,psGLSL} from "./prismatic-scale-matrix-wave12.js";
import {kdModes,kdGLSL} from "./kleinian-dither-wave13.js";
import {vcModes,vcGLSL} from "./curlwave-witchcraft-wave14.js";
import { motionGLSL } from "./motion.js";
import { feedbackVertex, feedbackFragment, feedbackDisplayFragment } from "./feedback.js";
import { createBiology, BIO_SIZE } from "./biology.js";
import { bioGLSL } from "./bio-shader.js";
import { stereoGLSL } from "./stereo.js";
import { wiggleGLSL } from "./wiggle.js";
import { materialGLSL } from "./materials.js";
import {alchemyModes,alchemyGLSL,specializeAlchemyGLSL} from "./chromatic-alchemy.js";
import {injuryModes,injuryGLSL,specializeInjuryGLSL} from "./print-spectrum-injury.js";
import { kineticGLSL, glyphCanvas } from "./kinetic-type.js";
import {paintLettering} from "./text-compositor.js";
import {normalTextBlendState} from "./text-blend-proof.js";
import {semanticGravityGLSL,semanticGravityModes,hasSemanticLettering} from "./semantic-gravity.js";
import { ensureRetroFontLoaded, retroFontReady, retroFontRevision } from "./retro-fonts.js";
import { compositionGLSL } from "./composition.js";
import { backdropGLSL, backdropModes, specializeBackdropGLSL } from "./backdrops.js";
import { microGLSL, microModes, specializeMicroGLSL } from "./microstructure.js";
import { substanceGLSL, substanceModes, specializeSubstanceGLSL } from "./substance.js";
import { photonGLSL, photonSpecies, specializePhotonGeometry } from "./photon-zoo.js";
import { filamentGLSL, filamentSpecies, filamentMaterials, fiberConstructionModes, microloomModes, textilePhysicsModes, textileChromaModes, textileEcologyModes, textileArchitectureModes, textileDimensionModes, textileMetaModes, textileEngravingModes, textileAlchemyModes, filamentStitchModes, filamentSculptModes, filamentAdornmentModes, jewelryPlacementModes, jewelryKineticModes, jewelryFinishModes, jewelryInteriorModes, jewelryColonyModes, filamentMorphModes, filamentContagionModes, filamentNeuralModes, filamentPlasticModes, filamentScarModes, filamentRegenModes, specializeFilamentGeometry, specializeFilamentStitchMotion, specializeFilamentSculptMotion, specializeFilamentMaterials, specializeFilamentAdornments, specializeFilamentMorphMaterials, specializeFilamentContagion, specializeFilamentNeural, specializeFilamentPlasticity, specializeFilamentScars, specializeFilamentRegeneration } from "./filament-forge.js";
import { underlayGLSL, underlayModes, specializeUnderlayGLSL } from "./living-underlay.js";
import { tunnelGLSL } from "./tunnels.js";
import { strangeFieldsGLSL } from "./strange-fields.js";
import { atmosphereGLSL, atmosphereModes, specializeAtmosphereVariant } from "./mutant-atmospheres.js";
import { colonyLifeModes } from "./colony-lifecycle.js";
import { colonyAnatomyModes, colonyPoreModes } from "./colony-anatomy.js";
import { colonyCortexModes, colonyCortexGLSL } from "./colony-cortex.js";
import { sporeModes, sporeDynastyGLSL, daughterSite } from "./spore-dynasties.js";
import { substrateModes, substrateGLSL, substrateEnabled } from "./substrate-alchemy.js";
import { symbiosisModes, symbiosisGLSL, symbiosisActive } from "./symbiosis-lab.js";
import { geneGLSL, geneEnabled, packGeneMarker } from "./colony-genetics.js";
import {selectionModes,selectionGLSL,selectionActive} from "./selection-chamber.js";
import {apocalypseModes,apocalypseGLSL,apocalypseActive} from "./apocalypse-clock.js";
import {MAX_FOSSILS,fossilGLSL,fossilEnabled,packedFossil} from "./fossil-record.js";
import {MAX_SUCCESSION,successionGLSL,successionEnabled,packedSuccession} from "./ecological-succession.js";
import {MAX_FOOD_WEB_LINKS,foodWebModes,foodWebGLSL,foodWebActive,foodWebLinks} from "./living-food-web.js";
import { atmosphereHabitats, atmosphereSecondHabitats, atmosphereBlendModes,
  habitatGLSL, atmosphereHybridGLSL } from "./atmosphere-habitats.js";

const vertex = `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
#define PI 3.14159265359
#define TAU 6.28318530718
uniform vec2 res;
uniform float time,colorTime,seed,seedHigh,complexity,scale,warp,split,scan,grain,glitch,rotation,symmetry,blend,block,pixel,vignette;
uniform float saturation,contrast,brightness,colorOffset,colorRepeat,colorAmount;
uniform int engine,secondaryEngine,blendMode,count,colorCount,colorMode;
uniform bool bloom,posterize,mirror,invert;
uniform vec3 colors[12];uniform vec4 marks[32];uniform vec2 markShape[32];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed+seedHigh*7.83)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+3.4;a*=.5;}return v;}
mat2 rotate(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
vec3 palette(float t){float q=fract(t)*float(colorCount);int a=int(floor(q));vec3 c=colors[0],d=colors[0];for(int i=0;i<12;i++){if(i==a)c=colors[i];if(i==a+1)d=colors[i];}if(a==colorCount-1)d=colors[0];return mix(c,d,smoothstep(0.,1.,fract(q)));}
uniform float topperShrapnel,topperDensity,topperScale,topperMotion,topperHue,topperShape,topperBlend;
vec3 transmissionShrapnel(vec3 col,vec2 uv){
 if(topperShrapnel<.001)return col;
 float gridSize=mix(5.,24.,topperScale);
 vec2 q=uv*gridSize*vec2(max(res.x/res.y,.4),1.);
 vec2 cell=floor(q), local=fract(q)-.5;
 float h=hash(cell+vec2(19.,71.));
 if(h>mix(.035,.48,topperDensity))return col;
 float t=time*topperMotion*.65;
 local-=.10*vec2(sin(t+h*TAU),cos(t*.73+h*TAU));
 float kind=floor(min(topperShape,.999)*4.);
 vec2 dims=vec2(.12+.22*hash(cell+31.),.025+.065*hash(cell+53.));
 if(kind>1.5)local=rotate((h-.5)*2.4)*local;
 if(kind>2.5)dims=vec2(.055,.22);
 float sd=max(abs(local.x)-dims.x,abs(local.y)-dims.y);
 float mask=1.-smoothstep(-.012,.012,sd);
 if(kind>.5&&kind<1.5)mask*=smoothstep(.12,.24,fract(local.x*13.+h+t*.3));
 float phase=h+topperHue+.14*sin(t+h*TAU)+local.x*1.8;
 vec3 ink=palette(phase);
 if(topperBlend>.5)ink=mix(ink,abs(col-ink),smoothstep(.5,1.,topperBlend));
 else ink=mix(ink,col*ink*1.6,topperBlend*2.);
 return mix(col,ink,mask*topperShrapnel);
}

uniform float topperJewel,topperJewelDensity,topperJewelScale,topperJewelMotion,topperJewelDetail,topperJewelHue,topperJewelForm,topperJewelBlend;
vec3 phospheneJewels(vec3 col,vec2 uv){
 if(topperJewel<.001)return col;
 vec2 q=uv*mix(4.,18.,topperJewelScale)*vec2(max(res.x/res.y,.4),1.);
 vec2 cell=floor(q), z=fract(q)-.5;
 float h=hash(cell+vec2(81.,27.));
 if(h>mix(.035,.38,topperJewelDensity))return col;
 float t=time*topperJewelMotion*.35;
 z-=.07*vec2(sin(t+h*TAU),cos(t*.8+h*TAU));
 float rad=length(z)/mix(.18,.34,hash(cell+72.));
 if(rad>1.05)return col;
 float a=atan(z.y,z.x+.00001), rho=log(max(rad,.035));
 float n=mix(5.,18.,topperJewelDetail);
 float form=floor(min(topperJewelForm,.999)*4.);
 float ring=sin(rad*n*PI-t+h*TAU);
 float spiral=sin(rho*n*.6+a*3.-t);
 float web=sin(a*6.+rho*2.+t*.3);
 float f=ring;
 if(form>.5)f=spiral;
 if(form>1.5)f=ring*web;
 if(form>2.5)f=sin(rho*n*.5+t)*cos(a*5.-t*.3);
 float line=smoothstep(.12,.85,abs(f));
 float rim=1.-smoothstep(.015,.055,abs(rad-.88));
 float mask=(1.-smoothstep(.82,1.,rad))*smoothstep(.025,.12,rad);
 vec3 ink=palette(h+topperJewelHue+rho*.16+a/TAU+.13*f+t*.05);
 ink=mix(ink,1.-clamp(col,0.,1.),topperJewelBlend*.65);
 return mix(col,ink,topperJewel*max(mask*line*.85,rim*.55));
}

uniform float topperIsland,topperIslandDensity,topperIslandScale,topperIslandMotion,topperIslandForm,topperIslandMapping,topperIslandHue,topperIslandFeather;
vec3 falseColorIslands(vec3 col,vec2 uv){
 if(topperIsland<.001)return col;
 vec2 q=uv*mix(3.,14.,topperIslandScale)*vec2(max(res.x/res.y,.4),1.);
 vec2 cell=floor(q), z=fract(q)-.5;
 float h=hash(cell+vec2(127.,39.));
 if(h>mix(.035,.55,topperIslandDensity))return col;
 float t=time*topperIslandMotion*.28;
 z-=.06*vec2(sin(t+h*TAU),cos(t+h*TAU));
 z=rotate(h*PI)*z;
 float radius=mix(.19,.36,hash(cell+91.));
 float form=floor(min(topperIslandForm,.999)*4.);
 float dist=length(z);
 if(form>.5)dist=max(abs(z.x),abs(z.y)*1.5);
 if(form>1.5)dist=abs(z.x)+abs(z.y);
 if(form>2.5)dist=length(z)*(1.+.16*sin(atan(z.y,z.x+.00001)*5.+t));
 float mask=1.-smoothstep(radius-mix(.005,.12,topperIslandFeather),radius,dist);
 vec3 base=clamp(col,0.,1.);
 float lum=dot(base,vec3(.2126,.7152,.0722));
 float mode=floor(min(topperIslandMapping,.999)*5.);
 float phase=topperIslandHue+h*.35+.07*sin(t+h*TAU);
 vec3 ink=palette(lum+phase);
 if(mode>.5)ink=.5+.5*cos(TAU*(lum*.85+phase+vec3(0.,.33,.67)));
 if(mode>1.5)ink=palette((base.r-base.g)*.5+(base.b-lum)*.6+phase);
 if(mode>2.5)ink=palette(floor(lum*7.)/7.+phase);
 if(mode>3.5)ink=mix(1.-base,base.brg,.5+.5*sin(TAU*phase));
 return mix(col,ink,mask*topperIsland);
}

uniform float topperVoronoi,topperVoronoiDensity,topperVoronoiScale,topperVoronoiMotion,topperVoronoiGap,topperVoronoiTexture,topperVoronoiHue,topperVoronoiBlend;
vec3 voronoiConfetti(vec3 col,vec2 uv){
 if(topperVoronoi<.001)return col;
 vec2 q=uv*mix(7.,32.,topperVoronoiScale)*vec2(max(res.x/res.y,.4),1.);
 vec2 g=floor(q), f=fract(q), winner=vec2(0.), local=vec2(0.);
 float first=100., second=100., t=time*topperVoronoiMotion*.32;
 for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){
 vec2 o=vec2(float(x),float(y)), id=g+o;
 vec2 h=vec2(hash(id+113.),hash(id+271.));
 vec2 delta=o+.5+.29*sin(h*TAU+t)-f;
 float dist=dot(delta,delta);
 if(dist<first){second=first;first=dist;winner=id;local=delta;}else second=min(second,dist);
 }}
 float h=hash(winner+493.);
 if(h>mix(.025,.42,topperVoronoiDensity))return col;
 float edge=sqrt(second)-sqrt(first);
 float gap=mix(.025,.24,topperVoronoiGap);
 float mask=smoothstep(gap,gap+.045,edge);
 float mode=floor(min(topperVoronoiTexture,.999)*4.);
 float pattern=1.;
 if(mode>.5)pattern=.35+.65*smoothstep(.2,.6,sin((local.x+local.y)*48.+t));
 if(mode>1.5)pattern=.3+.7*smoothstep(.15,.65,sin(length(local)*65.-t));
 if(mode>2.5)pattern=.3+.7*step(.45,hash(floor(local*18.)+winner));
 vec3 ink=palette(h+topperVoronoiHue+.15*sin(t+h*TAU)+edge*.35);
 ink=mix(ink,abs(clamp(col,0.,1.)-ink),topperVoronoiBlend);
 return mix(col,ink,mask*pattern*topperVoronoi);
}

uniform float topperTape,topperTapeDensity,topperTapeScale,topperTapeMotion,topperTapeWidth,topperTapeDispersion,topperTapeHue,topperTapePalette;
// Asymmetric Gaussian CIE matching approximation, adapted from Chroma Soup.
float tapeLobe(float l,float a,float m,float sl,float sr){
 float x=(l-m)/(l<m?sl:sr);return a*exp(-.5*x*x);
}
vec3 tapeSpectrum(float l){
 float x=tapeLobe(l,1.056,599.8,37.9,31.)+tapeLobe(l,.362,442.,16.,26.7)-tapeLobe(l,.065,501.1,20.4,26.2);
 float y=tapeLobe(l,.821,568.8,46.9,40.5)+tapeLobe(l,.286,530.9,16.3,31.1);
 float z=tapeLobe(l,1.217,437.,11.8,36.)+tapeLobe(l,.681,459.,26.,13.8);
 vec3 rgb=vec3(3.2406*x-1.5372*y-.4986*z,-.9689*x+1.8758*y+.0415*z,.0557*x-.204*y+1.057*z);
 rgb-=min(0.,min(rgb.r,min(rgb.g,rgb.b)));
 return pow(clamp(rgb/max(.00001,max(rgb.r,max(rgb.g,rgb.b))),0.,1.),vec3(.6));
}
vec3 spectralTape(vec3 col,vec2 uv){
 if(topperTape<.001)return col;
 vec2 q=uv*mix(3.,15.,topperTapeScale)*vec2(max(res.x/res.y,.4),1.);
 vec2 cell=floor(q), p=fract(q)-.5;
 float h=hash(cell+vec2(167.,59.));
 if(h>mix(.035,.4,topperTapeDensity))return col;
 float t=time*topperTapeMotion*.3;
 p=rotate((h-.5)*PI+.12*sin(t+h*TAU))*p;
 float w=mix(.025,.13,topperTapeWidth);
 float dist=max(abs(p.x)-.34,abs(p.y)-w);
 float mask=1.-smoothstep(-.008,.012,dist);
 if(mask<.001)return col;
 float phase=h+topperTapeHue+p.x*mix(.6,4.,topperTapeDispersion)+.2*sin(p.y*35.+t+h*TAU);
 float wave=400.+300.*(.5+.5*sin(TAU*phase));
 vec3 ink=mix(tapeSpectrum(wave),palette(phase),topperTapePalette);
 float grooves=.75+.25*sin(p.x*140.+p.y*65.);
 float rim=1.-smoothstep(.005,.025,abs(abs(p.y)-w));
 ink=ink*grooves+rim*.25;
 return mix(col,mix(col*ink*1.4,ink,.65),mask*topperTape);
}

${geometryGLSL}
${motionGLSL}
${bioGLSL}
/* WIGGLE_MODULE */
/* STEREO_MODULE */
/* TUNNEL_MODULE */
/* STRANGE_FIELDS_MODULE */
/* HEXAGRAM_MODULE */
/* POLES_MODULE */
/* QUASI_DECAY_MODULE */
/* VELVET_MODULE */
/* CROCHET_MODULE */
/* CROSSBREED_MODULE */
/* G2_MODULE */
/* SPX_MODULE */
/* PS_MODULE */
/* KD_MODULE */
/* VC_MODULE */
float field(vec2 p,int kind){float t=time*.3,f=0.;
if(kind==0){for(int i=0;i<5;i++){float n=float(i)+1.;p+=warp*.32*vec2(sin(p.y*n+t/n),cos(p.x*n-t/n));f+=sin(p.x*n+cos(p.y*n+t))/n;}f=f*.25+length(p)*.12;}
else if(kind==1){f=sin(length(p-vec2(sin(t),cos(t)))*12.)*sin(length(p+vec2(cos(t*.7),sin(t*.8)))*13.);f=f*.4+length(p)*.15;}
else if(kind==2){vec2 z=p*.5;for(int i=0;i<7;i++){z=abs(z)/clamp(dot(z,z),.2,2.)-vec2(.8+warp*.5,.65+sin(t)*.12);}f=length(z)*.25+.1*sin(atan(z.y,z.x)*2.+length(z)*2.3);}
else if(kind==3){f=sin(p.x*(12.+complexity*20.)+t)*sin((p.x*cos(.4+t*.04)+p.y*sin(.4+t*.04))*20.)*.4+sin(length(p)*10.-t)*.2;}
else if(kind==4){vec2 b=floor(p*(8.+complexity*30.));f=hash(b+floor(t*3.))*.7+sin(b.x*.2+b.y*.3+t)*.3;}
else if(kind==5){f=seamlessTunnel(p);}
else if(kind==6){vec2 q=vec2(fbm(p+t*.14),fbm(p+vec2(4.3,7.1)-t*.12));vec2 r=vec2(fbm(p+q*4.*warp+vec2(1.7,9.2)+t*.13),fbm(p+q*4.*warp+vec2(8.3,2.8)-t*.11));f=fbm(p+r*(2.+warp*4.));}
else if(kind==7){vec2 z=p*(1.2+complexity*1.8),g=floor(z),q=fract(z);float first=8.,second=8.;for(int j=-1;j<=1;j++){for(int i=-1;i<=1;i++){vec2 o=vec2(float(i),float(j));vec2 h=vec2(hash(g+o),hash(g+o+19.));vec2 point=.5+.42*sin(TAU*h+t*(.3+warp));float d=length(o+point-q);if(d<first){second=first;first=d;}else second=min(second,d);}}f=(second-first)*.65+first*.35;}
else if(kind==8){float r=length(p),a=atan(p.y,p.x);float petals=3.+floor(complexity*9.);f=sin(r*(5.+warp*8.)-t)*.18+cos(a*petals+t*.7)*exp(-r*.23)*.2+sin(r*3.+a*2.+t)*.16;}
else if(kind==9){vec2 flow=p+warp*vec2(sin(p.y*.8+t*.4),cos(p.x*.6-t*.3));f=fbm(flow*.8+vec2(t*.12,-t*.08));f+=sin(p.x*.5+p.y*.3+t*.15)*.14;}
else if(kind==10){vec2 z=p+warp*.3*vec2(sin(p.y*3.+t),cos(p.x*3.-t));float x=sin(z.x*(8.+complexity*15.)+t),y=sin(z.y*(8.+complexity*15.)-t);f=mix(x*.17+y*.17,abs(x)-abs(y),.22)+step(0.,x*y)*.09;}
else if(kind==11){float a=atan(p.y,p.x),r=length(p);float n=3.+floor(complexity*7.);float wedge=cos(floor(.5+a/(TAU/n))*(TAU/n)-a)*r;f=sin(wedge*(5.+warp*9.)-t)*.18+sin(r*7.+t)*.12+floor(r*2.5)*.07;}
else if(kind==12){f=hyperbolicCRT(p);}
else if(kind==13){f=candyFractalPortal(p);}
else if(kind==14){f=fivefoldDiffraction(p);}
else if(kind==15){f=biologicalField(p);}
else if(kind==16){f=.18*sin(length(p)*3.+time*.47)+.12*cos(atan(p.y,p.x)*5.-time*.22);}
else if(kind==17 || kind==18 || kind==19){f=strangeField(p,kind);}
else {f=0.;}
return f;}
float composed(vec2 p){float a=field(p,engine);if(blend<.001)return a;float b=field(rotate(.43)*p+vec2(.37,-.21),secondaryEngine);float c=b;if(blendMode==1)c=a*b*2.;if(blendMode==2)c=abs(a-b);return mix(a,c,blend);}
float phaseOf(float value,vec2 uv,float source){float bands=(2.+complexity*5.)*pow(2.,(colorRepeat-.5)*2.);float phase=value*bands+seed*.001+seedHigh*.017+colorTime*.04+colorOffset;
if(colorAmount>.0){float t=colorTime/12.;vec2 s=(uv-.5)*3.;float voice=0.;if(colorMode==0){voice=t+.55*s.x+.22*s.y+.2*sin(TAU*(t+s.y))+.1*sin(TAU*(2.*t+s.x));}else if(colorMode==1){voice=t+.25*s.x+.15*s.y+.24*sin(TAU*(t+.19*s.x+.17*s.y))+.12*sin(TAU*(2.*t+.38*s.x+.17*s.y)+1.7)+.07*sin(TAU*(3.*t+.57*s.x+.17*s.y)+3.4);}else{
  float angle=atan(s.y,s.x),radial=length(s);
  voice=t+.27*sin(angle*2.+radial*3.1-t*TAU)+.22*cos(angle*3.-radial*2.2+t*.6);
}phase+=colorAmount*voice;}
phase+=source;if(posterize)phase=floor(phase*7.)/7.;return phase;}
/* COMPOSITION_MODULE */
/* BACKDROP_MODULE */
/* MICRO_MODULE */
/* SUBSTANCE_MODULE */
/* PHOTON_MODULE */
/* UNDERLAY_MODULE */
/* SEMANTIC_GRAVITY_MODULE */
/* FILAMENT_MODULE */
/* MATERIAL_MODULE */
/* ATMOSPHERE_MODULE */
/* SYMBIOSIS_MODULE */
/* APOCALYPSE_MODULE */
/* FOSSIL_MODULE */
/* SUCCESSION_MODULE */
/* FOOD_WEB_MODULE */
/* SUBSTRATE_MODULE */
/* HABITAT_MODULE */
/* LETTERING_MODULE */
/* ALCHEMY_MODULE */
/* INJURY_MODULE */
${appearanceGLSL}
void main(){vec2 uv=gl_FragCoord.xy/res;vec2 aspect=vec2(res.x/res.y,1.);vec2 sampleUV=uv;
if(pixel>.001){float cells=mix(600.,24.,pow(pixel,.65));sampleUV=(floor(uv*vec2(cells*aspect.x,cells))+.5)/vec2(cells*aspect.x,cells);}
vec2 p=(sampleUV-.5)*aspect*(2.+scale*5.);p=rotate(rotation)*p;
p=animateCoordinates(p);
if(mirror)p.x=abs(p.x);if(symmetry>1.5){float wedge=TAU/floor(symmetry);float angle=mod(atan(p.y,p.x)+wedge*.5,wedge)-wedge*.5;p=length(p)*vec2(cos(angle),sin(angle));}
// Continuous analog signal drift. Neighboring bands blend smoothly, with no horizontal UV jumps.
float bandPos=uv.y*25.+time*.17;
float bandId=floor(bandPos);
float bandFade=smoothstep(0.,1.,fract(bandPos));
float v0=hash(vec2(bandId,floor(time*1.6)+4.));
float v1=hash(vec2(bandId+1.,floor(time*1.6)+4.));
float w0=(v0-.5)*smoothstep(.72,.92,v0);
float w1=(v1-.5)*smoothstep(.72,.92,v1);
float drift=mix(w0,w1,bandFade);
float tear=clamp(abs(drift)*glitch*2.5,0.,1.);
p.x+=drift*glitch*.72;
float blocks=step(1.-block*.32,hash(floor(uv*vec2(17.,24.))+floor(time*2.)));p+=blocks*block*vec2(hash(floor(uv*16.))-.5,hash(floor(uv*14.)+2.)-.5)*2.;
float source=0.;for(int i=0;i<32;i++){if(i<count){vec2 d=(uv-marks[i].xy)*aspect;float radius=max(markShape[i].x,.05);float influence=exp(-dot(d,d)/(radius*radius));float force=marks[i].z*influence;float a=markShape[i].y;vec2 local=rotate(a)*d;
if(marks[i].w<.5)p+=rotate(a)*vec2(sin(local.y*15.+time),cos(local.x*15.-time))*force;
else if(marks[i].w<1.5)p+=vec2(-d.y,d.x)*force*8.;else if(marks[i].w<2.5)p+=d*force*8.;else source+=force*(.5+.5*sin(2.*atan(d.y,d.x)+colorTime*.5+a));}}
/* WIGGLE_POST */
/* HEXAGRAM_PRE */
/* POLES_PRE */
/* QUASI_DECAY_PRE */
/* VELVET_PRE */
/* CROCHET_PRE */
/* CROSSBREED_PRE */
/* G2_PRE */
/* VC_PRE */
float v=composed(p);/* HEXAGRAM_VALUE */vec3 col=palette(phaseOf(v,uv,source));float edge=pow(.5+.5*sin(v*(2.+complexity*5.)*TAU),18.);col*=.72+edge*.5;if(bloom)col+=edge*col*.24;
/* BACKDROP_POST */
/* HEXAGRAM_POST */
/* COMPOSITION_POST */
/* STEREO_POST */
/* MATERIAL_POST */
/* SUBSTANCE_POST */
/* MICRO_POST */
/* PHOTON_POST */
/* UNDERLAY_POST */
/* FILAMENT_POST */
/* SUBSTRATE_POST */
/* SUCCESSION_POST */
/* FOSSIL_POST */
/* APOCALYPSE_POST */
/* ATMOSPHERE_POST */
/* ATMOSPHERE_B_POST */
/* FOOD_WEB_POST */
/* POLES_POST */
/* QUASI_DECAY_POST */
/* VELVET_POST */
/* CROCHET_POST */
/* CROSSBREED_POST */
/* G2_POST */
/* PS_POST */
/* KD_POST */
/* VC_POST */
col=animateLight(col,uv,v);
col=stainWithBiology(col,uv,p);
/* LETTERING_POST */
if(split>.001){col.r=mix(col.r,palette(phaseOf(composed(p+vec2(split*.09,0.)),uv,source)).r,split);col.b=mix(col.b,palette(phaseOf(composed(p-vec2(split*.09,0.)),uv,source)).b,split);}
col*=1.-scan*(.5+.5*sin(uv.y*900.))*.55;col+=(hash(floor(uv*1000.)+fract(time))-.5)*grain*.3;col=mix(col,col.brg,tear*.65);col=mix(col,col.gbr,blocks*block*.6);
float luma=dot(col,vec3(.2126,.7152,.0722));col=mix(vec3(luma),col,saturation*2.);col=(col-.5)*(.5+contrast)+.5;col*=.5+brightness;col*=1.-vignette*smoothstep(.15,.8,length((uv-.5)*aspect));if(invert)col=1.-col;
/* ALCHEMY_POST */
/* INJURY_POST */
/* SPX_POST */
col=applyAppearance(col,uv);
col=transmissionShrapnel(col,uv);
col=falseColorIslands(col,uv);
col=voronoiConfetti(col,uv);
col=spectralTape(col,uv);
col=phospheneJewels(col,uv);
gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;

export function createRenderer(canvas, {exactEffects=false} = {}) {
  const options = {
    preserveDrawingBuffer: true,
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  };
  const gl2 = canvas.getContext("webgl2", options),
    gl = gl2 || canvas.getContext("webgl", options);
  if (!gl)
    throw Error(
      "WebGL is unavailable. Enable hardware acceleration to use the studio.",
    );
  const programs = new Map();
  let active, fence = null, memory = null, memoryShader = null, memoryDisabled = false;
  let stereoUnavailable = false, materialUnavailable = false,
    strangeUnavailable = false, atmosphereUnavailable = false,
    atmosphereBUnavailable = false, habitatUnavailable = false,
    typeShaderUnavailable = false, compositionUnavailable = false,
    backdropUnavailable = false, microUnavailable = false,
    substanceUnavailable = false, wiggleUnavailable = false,
    photonUnavailable = false, filamentUnavailable = false,
    filamentHybridUnavailable = false, filamentMaterialUnavailable = false,
    filamentStitchUnavailable = false, filamentSculptUnavailable = false,
    filamentAdornmentUnavailable = false, filamentMorphUnavailable = false,
    filamentContagionUnavailable = false, filamentNeuralUnavailable = false,
    filamentPlasticUnavailable = false, filamentScarUnavailable = false,
    filamentRegenUnavailable = false, semanticGravityUnavailable = false,
    underlayUnavailable = false, alchemyUnavailable = false,
    injuryUnavailable = false, hexagramUnavailable = false, polesUnavailable = false,
    qdUnavailable = false, velvetUnavailable = false, crochetUnavailable = false,
    breedUnavailable = false, g2Unavailable = false, spxUnavailable = false,
    psUnavailable = false, kdUnavailable = false, vcUnavailable = false,
    fossilUnavailable = false,
    successionUnavailable = false, foodWebUnavailable = false;
  function compatibleShaderState(s){
    const source = stereoUnavailable ? safe2DSelection(s) : s;
    if(!vcUnavailable && !kdUnavailable && !psUnavailable && !spxUnavailable && !g2Unavailable && !breedUnavailable && !velvetUnavailable && !crochetUnavailable && !qdUnavailable && !polesUnavailable && !hexagramUnavailable && !injuryUnavailable && !alchemyUnavailable &&
       !materialUnavailable && !typeShaderUnavailable &&
       !compositionUnavailable && !backdropUnavailable &&
       !microUnavailable && !substanceUnavailable && !wiggleUnavailable &&
       !photonUnavailable && !filamentUnavailable && !filamentHybridUnavailable &&
       !filamentMaterialUnavailable && !filamentStitchUnavailable &&
       !filamentSculptUnavailable && !filamentAdornmentUnavailable && !filamentMorphUnavailable &&
       !filamentContagionUnavailable && !filamentNeuralUnavailable && !filamentPlasticUnavailable && !filamentScarUnavailable &&
       !filamentRegenUnavailable && !semanticGravityUnavailable && !underlayUnavailable &&
       !strangeUnavailable && !fossilUnavailable && !successionUnavailable && !foodWebUnavailable && !atmosphereUnavailable &&
       !atmosphereBUnavailable && !habitatUnavailable)return source;
    return {
      ...source,

      ...(hexagramUnavailable ? {hexagramAmount:0}:{}),
      ...(polesUnavailable ? {polesAmount:0}:{}),
      ...(qdUnavailable ? {qdAmount:0}:{}),
      ...(velvetUnavailable ? {vldAmount:0}:{}),
      ...(crochetUnavailable ? {hcrAmount:0}:{}),
      ...(breedUnavailable ? {breedAmount:0}:{}),
      ...(g2Unavailable ? {g2Amount:0}:{}),
      ...(spxUnavailable ? {spxAmount:0}:{}),
      ...(psUnavailable ? {psAmount:0}:{}),
      ...(kdUnavailable ? {kdAmount:0}:{}),
      ...(vcUnavailable ? {vcAmount:0}:{}),
      ...(injuryUnavailable ? {injuryAmount:0}:{}),
      ...(alchemyUnavailable ? {alchemyAmount:0}:{}),
      ...(materialUnavailable ? {filmAmount:0,opalAmount:0,prismAmount:0,foilRelief:0}:{}),
      ...(typeShaderUnavailable ? {letteringAmount:0}:{}),
      ...(compositionUnavailable ? {compositionAmount:0}:{}),
      ...(backdropUnavailable ? {backdropAmount:0}:{}),
      ...(microUnavailable ? {microAmount:0}:{}),
      ...(substanceUnavailable ? {substanceAmount:0}:{}),
      ...(photonUnavailable ? {photonAmount:0}:{}),
      ...(filamentUnavailable ? {filamentAmount:0}:{}),
      ...(semanticGravityUnavailable ? {semanticGravityMode:"Off",semanticGravityAmount:0}:{}),
      ...(filamentHybridUnavailable ? {filamentCrossbreed:0}:{}),
      ...(filamentStitchUnavailable ? {filamentStitchAmount:0}:{}),
      ...(filamentAdornmentUnavailable ? {filamentAdornmentAmount:0}:{}),
      ...(filamentMorphUnavailable ? {filamentMorphAmount:0}:{}),
      ...(filamentContagionUnavailable ? {filamentContagionAmount:0}:{}),
      ...(filamentNeuralUnavailable ? {filamentNeuralAmount:0}:{}),
      ...(filamentPlasticUnavailable ? {filamentPlasticAmount:0}:{}),
      ...(filamentScarUnavailable ? {filamentScarAmount:0}:{}),
      ...(filamentRegenUnavailable ? {filamentRegenAmount:0}:{}),
      ...(filamentSculptUnavailable ? {filamentSculptAmount:0}:{}),
      ...(underlayUnavailable ? {underlayAmount:0}:{}),
      ...(fossilUnavailable ? {fossilAmount:0}:{}),
      ...(successionUnavailable ? {successionAmount:0}:{}),
      ...(foodWebUnavailable ? {foodWebAmount:0}:{}),
      ...(atmosphereUnavailable ? {atmoAmount:0}:{}),
      ...(atmosphereBUnavailable ? {atmoBAmount:0}:{}),
      ...(habitatUnavailable ? {atmoMaskMode:"Everywhere",atmoBMaskMode:"Everywhere"}:{}),
      ...(strangeUnavailable ? {
        engine: source.engine>=17 && source.engine<=19 ? 0 : source.engine,
        secondaryEngine: source.secondaryEngine>=17 && source.secondaryEngine<=19 ? 1 : source.secondaryEngine
      }:{}),
      ...(filamentMaterialUnavailable ? {filamentMaterial:"Original thread",filamentSecondMaterial:"Original thread",
        filamentNap:0,filamentBeads:0}:{}),
      ...(wiggleUnavailable ? {wiggleAmount:0}:{})
    };
  }
  let typeTexture=null, typeKey="", typeUnavailable=false;
  const extraTypeTextures=[null,null],extraTypeKeys=["",""];
  const pendingFontLoads=new Set(), failedFontLoads=new Set();
  function releaseLettering(){
    for(let i=0;i<2;i++){
      if(extraTypeTextures[i])gl.deleteTexture(extraTypeTextures[i]);
      extraTypeTextures[i]=null;extraTypeKeys[i]="";
    }
    if(typeTexture)gl.deleteTexture(typeTexture);
    typeTexture=null;typeKey="";
  }
  function updateLettering(s,width,height){
    if(typeUnavailable || !s.letteringAmount || !s.lettering.trim())return false;
    const fontId=s.letteringFont||"original";
    if(!retroFontReady(fontId) && !pendingFontLoads.has(fontId) && !failedFontLoads.has(fontId)){
      pendingFontLoads.add(fontId);
      ensureRetroFontLoaded(fontId).then(
        ()=>{pendingFontLoads.delete(fontId);typeKey="";},
        err=>{failedFontLoads.add(fontId);pendingFontLoads.delete(fontId);
          console.warn("Typeface unavailable: displaying a fallback.",err);}
      );
    }
    try{
      if(!typeTexture) {
        typeTexture=gl.createTexture();
        if(!typeTexture)throw Error("Could not allocate a lettering texture.");
        gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,typeTexture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      }
      const aspect=width/Math.max(1,height);
      const key=s.lettering+"|"+aspect.toFixed(4)+"|"+fontId+"|"+retroFontRevision()+"|"+JSON.stringify([s.letteringFillMode,s.letteringFill,s.letteringGradient,s.letteringGradientAngle,s.letteringStrokes]);
      if(key!==typeKey){
        const glyphs=glyphCanvas(s.lettering,aspect,fontId,s);
        gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,typeTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,glyphs);}
        finally{gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);}
        typeKey=key;
      }
      gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,typeTexture);
      gl.activeTexture(gl.TEXTURE0);return true;
    }catch(error){
      typeUnavailable=true;releaseLettering();gl.activeTexture(gl.TEXTURE0);
      console.warn("Kinetic lettering unavailable, original artwork preserved.",error);
      return false;
    }
  }
  function updateExtraLettering(s,width,height){
    const layers=s.letteringLayers||[];
    for(let i=0;i<2;i++){
      const layer=layers[i];
      if(!layer||!layer.visible||!layer.text.trim())continue;
      const fontId=layer.letteringFont||"original";
      if(!retroFontReady(fontId)&&!pendingFontLoads.has(fontId)&&!failedFontLoads.has(fontId)){
        pendingFontLoads.add(fontId);
        ensureRetroFontLoaded(fontId).then(()=>{pendingFontLoads.delete(fontId);extraTypeKeys[i]="";},
          err=>{pendingFontLoads.delete(fontId);failedFontLoads.add(fontId);console.warn("Extra text font unavailable",err);});
      }
      try{
        if(!extraTypeTextures[i]){
          extraTypeTextures[i]=gl.createTexture();
          gl.activeTexture(gl.TEXTURE4+i);gl.bindTexture(gl.TEXTURE_2D,extraTypeTextures[i]);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        }
        const aspect=width/Math.max(1,height);
        const key=JSON.stringify([layer,aspect.toFixed(4),retroFontRevision()]);
        gl.activeTexture(gl.TEXTURE4+i);gl.bindTexture(gl.TEXTURE_2D,extraTypeTextures[i]);
        if(key!==extraTypeKeys[i]){
          const glyphs=glyphCanvas(layer.text,aspect,fontId,layer);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
          try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,glyphs);}
          finally{gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);}
          extraTypeKeys[i]=key;
        }
      }catch(e){console.warn("Extra text layer skipped",e);extraTypeKeys[i]="";}
    }
    gl.activeTexture(gl.TEXTURE0);
  }

  // Paint actual author text from the EXPORT compositor into one reusable,
  // bounded alpha texture. Preview and strict export share this exact path.
  let semanticGlyphCanvas=null,semanticGlyphContext=null,semanticGlyphTexture=null;
  function releaseSemanticGlyph(){
    if(semanticGlyphTexture)gl.deleteTexture(semanticGlyphTexture);
    semanticGlyphTexture=null;
    if(semanticGlyphCanvas)semanticGlyphCanvas.width=semanticGlyphCanvas.height=1;
    semanticGlyphCanvas=null;semanticGlyphContext=null;
  }
  function uploadSemanticGlyph(state,timeline,width,height){
    if(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)<7)
      throw Error("Semantic Gravity requires seven fragment texture units.");
    if(!semanticGlyphCanvas){
      semanticGlyphCanvas=document.createElement("canvas");
      semanticGlyphContext=semanticGlyphCanvas.getContext("2d",{alpha:true});
      if(!semanticGlyphContext)throw Error("Cannot create semantic glyph canvas.");
    }
    // One fixed-cost mask for any preview/export resolution. Aspect preserved.
    const ratio=512/Math.max(width,height);
    const maskW=Math.max(32,Math.round(width*ratio));
    const maskH=Math.max(32,Math.round(height*ratio));
    if(semanticGlyphCanvas.width!==maskW || semanticGlyphCanvas.height!==maskH){
      semanticGlyphCanvas.width=maskW;semanticGlyphCanvas.height=maskH;
    }
    // For glyph *geometry*, normalize the compositing blend to Normal.
    // This still uses the same REAL words, fonts, outline, positions, rich
    // glyph layout, motion and material, but ensures switching Screen/Multiply/
    // Difference changes only the final text overlay, never the thread field.
    // Without this, an export A/B text-blend check can accidentally compare
    // two different underlying textile geometries.
    const glyphLayoutState=normalTextBlendState(state);
    paintLettering(semanticGlyphContext,glyphLayoutState,timeline,maskW,maskH,true);
    if(!semanticGlyphTexture){
      semanticGlyphTexture=gl.createTexture();
      if(!semanticGlyphTexture)throw Error("Cannot allocate semantic glyph texture.");
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D,semanticGlyphTexture);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    }
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D,semanticGlyphTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    try{
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,
        semanticGlyphCanvas);
    }finally{
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      gl.activeTexture(gl.TEXTURE0);
    }
    const uploadError=gl.getError();
    if(uploadError!==gl.NO_ERROR)
      throw Error("Semantic glyph texture upload failed (WebGL "+uploadError+").");
  }
  // Text is composited AFTER the artwork and feedback passes. The main art
  // shader never depends on typography, so an unsupported font effect cannot
  // disable the canvas or silently swallow all words.
  let textOverlayProgram=null, textOverlayFailed=false;
  function overlayText(s,timeline,width,height){
    const layers=[{
      text:s.lettering,visible:true,letteringAmount:s.letteringAmount,
      letteringX:s.letteringX,letteringY:s.letteringY,
      letteringRotation:s.letteringRotation,letteringScale:s.letteringScale,
      letteringStretchX:s.letteringStretchX,letteringStretchY:s.letteringStretchY,
      letteringCurve:s.letteringCurve,letteringWarp:s.letteringWarp,
      letteringMotion:s.letteringMotion
    },...(s.letteringLayers||[]).slice(0,2)];
    if(!layers.some(l=>l.visible!==false&&l.text?.trim()&&l.letteringAmount>0))return;
    if(textOverlayFailed)return;
    try{
      if(!textOverlayProgram){
        const vs=gl2
          ? "#version 300 es\nin vec2 position;void main(){gl_Position=vec4(position,0.,1.);}"
          : "attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}";
        const fs=(gl2?"#version 300 es\n":"")+`precision mediump float;
          ${gl2?"out vec4 fragColor;":""}
          uniform sampler2D ink;
          uniform vec2 resolution,pivot,stretch;
          uniform float angle,zoom,curve,warp,motion,time,opacity;
          void main(){
            vec2 uv=gl_FragCoord.xy/resolution;
            vec2 q=uv-pivot;
            float a=-angle*0.01745329252;
            q=mat2(cos(a),-sin(a),sin(a),cos(a))*q;
            q/=max(stretch,vec2(.25));
            q/=mix(.63,.97,zoom);
            q.x-=curve*.18*(q.y*q.y-.065);
            q+=.5;
            float t=time*(.22+motion*.95);
            q+=motion*.009*vec2(sin(q.y*8.+t*.61),cos(q.x*7.-t*.48));
            q+=warp*.009*vec2(sin(q.y*13.+t*.81),cos(q.x*11.-t*.67));
            vec2 inside=step(vec2(0.),q)*step(q,vec2(1.));
            vec4 c=${gl2?"texture":"texture2D"}(ink,clamp(q,0.,1.));
            c.a*=inside.x*inside.y*opacity;
            ${gl2?"fragColor":"gl_FragColor"}=c;
          }`;
        const v=compile(gl.VERTEX_SHADER,vs),f=compile(gl.FRAGMENT_SHADER,fs);
        const program=gl.createProgram();
        try{
          gl.attachShader(program,v);gl.attachShader(program,f);
          gl.bindAttribLocation(program,0,"position");
          gl.linkProgram(program);
          if(!gl.getProgramParameter(program,gl.LINK_STATUS))
            throw Error(gl.getProgramInfoLog(program));
          textOverlayProgram=program;
        }finally{gl.deleteShader(v);gl.deleteShader(f);if(!textOverlayProgram)gl.deleteProgram(program);}
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.viewport(0,0,width,height);
      gl.useProgram(textOverlayProgram);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      const u=(name)=>gl.getUniformLocation(textOverlayProgram,name);
      gl.uniform2f(u("resolution"),width,height);
      gl.uniform1f(u("time"),timeline.time);
      for(let i=0;i<layers.length;i++){
        const l=layers[i],texture=i===0?typeTexture:extraTypeTextures[i-1];
        const ready=i===0?!!typeKey:!!extraTypeKeys[i-1];
        if(!l||l.visible===false||!l.text?.trim()||!l.letteringAmount||!texture||!ready)continue;
        const unit=i===0?3:3+i;
        gl.activeTexture(gl.TEXTURE0+unit);
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.uniform1i(u("ink"),unit);
        gl.uniform2f(u("pivot"),(l.letteringX??50)/100,(l.letteringY??50)/100);
        gl.uniform2f(u("stretch"),(l.letteringStretchX??100)/100,(l.letteringStretchY??100)/100);
        gl.uniform1f(u("angle"),l.letteringRotation??0);
        gl.uniform1f(u("zoom"),(l.letteringScale??48)/100);
        gl.uniform1f(u("curve"),(l.letteringCurve??0)/100);
        gl.uniform1f(u("warp"),(l.letteringWarp??0)/100);
        gl.uniform1f(u("motion"),(l.letteringMotion??0)/100);
        gl.uniform1f(u("opacity"),(l.letteringAmount??0)/100);
        gl.drawArrays(gl.TRIANGLES,0,6);
      }
    }catch(e){
      textOverlayFailed=true;
      console.warn("Independent text overlay unavailable; artwork remains safe.",e);
    }finally{
      gl.disable(gl.BLEND);
      gl.activeTexture(gl.TEXTURE0);
    }
  }
  // Do not let an unsupported high-cost 3D shader blank out existing artwork.
  const safe2DSelection = (s) => ({
    ...s,
    engine: s.engine === 16 ? 6 : s.engine,
    secondaryEngine: s.secondaryEngine === 16 ? 6 : s.secondaryEngine,
    stereoAmount: 0,
  });
  let memoryIdentity = "", lastMemoryTime = -Infinity, lastMemoryColorTime = -Infinity;
  let biology = null, biologySeed = null, biologyTexture = null;
  let biologyLastTime = null, biologyFraction = 0, biologyDisabled = false;
  let biologyFeed = 44, biologyKill = 42;
  const emptyBioTexture = gl.createTexture();
  if (!emptyBioTexture) throw Error("Cannot allocate the fallback biology texture.");
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, emptyBioTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 255]));
  gl.activeTexture(gl.TEXTURE0);
  function releaseBiology() {
    if (biologyTexture) gl.deleteTexture(biologyTexture);
    biologyTexture = null;
    biology = null;
    biologySeed = null;
    biologyLastTime = null;
    biologyFraction = 0;
  }
  function updateBiology(s, timeline) {
    const needed = s.engine === 15 || (s.blend > 0 && s.secondaryEngine === 15) || s.bioAmount > 0;
    if (!needed || biologyDisabled) return false;
    try {
      if (!biology || biologySeed !== s.seed) {
        releaseBiology();
        biology = createBiology(s.seed);
        biologySeed = s.seed;
        biologyFeed = s.bioFeed;
        biologyKill = s.bioKill;
        biology.advance(48, biologyFeed, biologyKill);
        biologyLastTime = timeline.time;
        biologyTexture = gl.createTexture();
        if (!biologyTexture) throw Error("Biological texture allocation failed.");
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, biologyTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, BIO_SIZE, BIO_SIZE, 0,
          gl.RGBA, gl.UNSIGNED_BYTE, biology.pixels());
      } else {
        const elapsed = biologyLastTime === null ? 0 : timeline.time - biologyLastTime;
        biologyFeed = s.bioFeed;
        biologyKill = s.bioKill;
        if (elapsed < -.0001) {
          biology.reset();
          biology.advance(48, s.bioFeed, s.bioKill);
          biologyFraction = 0;
        } else if (elapsed > 0) {
          const desired = elapsed * (9 + s.bioSpeed * .23) + biologyFraction;
          const steps = Math.min(9, Math.floor(desired));
          // Bounded catch-up: large seeks never freeze an iPhone for hundreds of steps.
          biologyFraction = elapsed > 2 ? 0 : desired - Math.floor(desired);
          if (steps) biology.advance(steps, s.bioFeed, s.bioKill);
        }
        biologyLastTime = timeline.time;
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, biologyTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, BIO_SIZE, BIO_SIZE,
          gl.RGBA, gl.UNSIGNED_BYTE, biology.pixels());
      }
      gl.activeTexture(gl.TEXTURE0);
      return true;
    } catch (error) {
      // The biology engine must never take the original art down with it.
      biologyDisabled = true;
      releaseBiology();
      gl.activeTexture(gl.TEXTURE0);
      if(exactEffects)throw artworkParityError("Biological growth failed",error);
      console.warn("Biology simulation disabled; original art preserved.", error);
      return false;
    }
  }
  function releaseMemory() {
    if (memory) {
      gl.deleteTexture(memory.scene);
      for (const texture of memory.history) gl.deleteTexture(texture);
      gl.deleteFramebuffer(memory.fbo);
      gl.deleteFramebuffer(memory.outputFbo);
      memory = null;
    }
    memoryIdentity = "";
    lastMemoryTime = lastMemoryColorTime = -Infinity;
  }
  function createMemoryTexture(w, h) {
    const tex = gl.createTexture();
    if (!tex) throw Error("GPU texture allocation failed.");
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return tex;
  }
  // Lazy: old recipes don't allocate a lens shader or an extra texture.
  let schlieren=null,schlierenUnavailable=false;
  function glassPass(){
    if(!schlieren)schlieren=createSchlierenPass({
      gl,gl2,vertex,compile,createTexture:createMemoryTexture,assertGl:assertMemoryGl
    });
    return schlieren;
  }
  function memoryProgram() {
    if (memoryShader) return memoryShader;
    const vs = gl2 ? "#version 300 es\n" +
      feedbackVertex.replace("attribute vec2", "in vec2").replace("varying vec2", "out vec2") : feedbackVertex;
    const fragmentSource = (raw) => gl2 ? "#version 300 es\n" +
      raw.replace("precision highp float;", "precision highp float;\nout vec4 fragColor;")
        .replace("varying vec2", "in vec2").replaceAll("texture2D(", "texture(")
        .replaceAll("gl_FragColor", "fragColor") : raw;
    // A separate fullscreen presentation shader avoids default-framebuffer
    // copyTexSubImage2D: that copy is rejected by some iOS WebGL backbuffers.
    const link = (source) => {
      let vert, frag, program;
      try {
        vert = compile(gl.VERTEX_SHADER, vs);
        frag = compile(gl.FRAGMENT_SHADER, fragmentSource(source));
        program = gl.createProgram();
        if(!program)throw Error("Frame-memory shader program allocation failed.");
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.bindAttribLocation(program, 0, "position");
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw Error(gl.getProgramInfoLog(program) || "Frame-memory shader link failed.");
        return program;
      } catch(e) {
        if(program)gl.deleteProgram(program);
        throw e;
      } finally {
        if(vert)gl.deleteShader(vert);
        if(frag)gl.deleteShader(frag);
      }
    };
    let program, displayProgram;
    try{
      program=link(feedbackFragment);
      displayProgram=link(feedbackDisplayFragment);
      memoryShader={program,displayProgram,uniforms:new Map(),displayUniforms:new Map()};
      return memoryShader;
    } catch(e){
      if(program)gl.deleteProgram(program);
      if(displayProgram)gl.deleteProgram(displayProgram);
      throw e;
    }
  }
  function assertMemoryGl(label){
    const error=gl.getError();
    if(error!==gl.NO_ERROR)
      throw Error(label+" (WebGL 0x"+error.toString(16)+")");
  }
  function prepareMemory(w, h) {
    const shader = memoryProgram();
    if (memory && memory.width === w && memory.height === h) return { shader, memory };
    releaseMemory();
    let scene, first, second, fbo, outputFbo;
    try {
      gl.activeTexture(gl.TEXTURE0);
      scene=createMemoryTexture(w,h);
      first=createMemoryTexture(w,h);
      second=createMemoryTexture(w,h);
      fbo=gl.createFramebuffer();
      outputFbo=gl.createFramebuffer();
      if(!fbo||!outputFbo)throw Error("Frame-memory FBO allocation failed.");
      gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,scene,0);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
        throw Error("Current-scene frame-memory buffer incomplete.");
      gl.bindFramebuffer(gl.FRAMEBUFFER,outputFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,second,0);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
        throw Error("Ping-pong history framebuffer incomplete.");
      assertMemoryGl("Frame-memory texture or FBO initialization failed");
      memory={scene,history:[first,second],fbo,outputFbo,width:w,height:h,
        readIndex:0,valid:false};
      return {shader,memory};
    } catch(e){
      if(scene)gl.deleteTexture(scene);
      if(first)gl.deleteTexture(first);
      if(second)gl.deleteTexture(second);
      if(fbo)gl.deleteFramebuffer(fbo);
      if(outputFbo)gl.deleteFramebuffer(outputFbo);
      throw e;
    } finally {
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,null);
    }
  }
  function compositeFeedback(s,timeline,w,h,withSchlieren=false) {
    const shader=memoryShader;
    const uniform=(name)=>{
      if(!shader.uniforms.has(name))
        shader.uniforms.set(name,gl.getUniformLocation(shader.program,name));
      return shader.uniforms.get(name);
    };
    const displayUniform=(name)=>{
      if(!shader.displayUniforms.has(name))
        shader.displayUniforms.set(name,gl.getUniformLocation(shader.displayProgram,name));
      return shader.displayUniforms.get(name);
    };
    const readIndex=memory.readIndex;
    const writeIndex=1-readIndex;
    try{
      // Render feedback into a texture attached to our own FBO, while
      // reading the OTHER history texture. Never read/write the same texture.
      gl.bindFramebuffer(gl.FRAMEBUFFER,memory.outputFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,memory.history[writeIndex],0);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
        throw Error("History target framebuffer incomplete.");
      gl.viewport(0,0,w,h);
      gl.useProgram(shader.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,memory.scene);
      gl.uniform1i(uniform("sceneTex"),0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D,memory.history[readIndex]);
      gl.uniform1i(uniform("historyTex"),1);
      gl.uniform2f(uniform("resolution"),w,h);
      gl.uniform1f(uniform("time"),timeline.time+timeline.colorTime*.17);
      gl.uniform1f(uniform("seed"),s.seed);
      for(const k of ["afterimage","datamosh","memoryDrift","memoryDecay"])
        gl.uniform1f(uniform(k),s[k]/100);
      gl.uniform1f(uniform("hasMemory"),memory.valid?1:0);
      gl.drawArrays(gl.TRIANGLES,0,6);
      assertMemoryGl("GPU history composite draw failed");
      // Sample the ACTUAL finished frame-memory texture. Do not add another
      // full-resolution FBO, and never sample the texture being written.
      if(withSchlieren){
        try{
          glassPass().present(memory.history[writeIndex],s,timeline,w,h);
        }catch(error){
          if(exactEffects)throw artworkParityError(
            "Schlieren glass could not present the complete artwork",error);
          schlierenUnavailable=true;
          console.warn("Schlieren unavailable; keeping complete frame-memory art.",error);
        }
      }
      if(!withSchlieren || schlierenUnavailable){
        // Existing legacy memory presentation remains unchanged.
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.viewport(0,0,w,h);
        gl.useProgram(shader.displayProgram);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D,null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,memory.history[writeIndex]);
        gl.uniform1i(displayUniform("outputTex"),0);
        gl.drawArrays(gl.TRIANGLES,0,6);
        assertMemoryGl("GPU history presentation draw failed");
      }
      memory.readIndex=writeIndex;
      memory.valid=true;
    } finally {
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D,null);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,null);
    }
  }
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw Error(error);
    }
    return shader;
  }
  function programFor(s) {
    const blended = s.blend > 0,
      withStereo = s.engine === 16 || (blended && s.secondaryEngine === 16) || s.stereoAmount > 0,
      withWiggle = s.wiggleAmount > 0,
      withMaterial = s.filmAmount>0 || s.opalAmount>0 || s.prismAmount>0 || s.foilRelief>0,
      withAlchemy = s.alchemyAmount>0,
      withInjury = s.injuryAmount>0,
      withHexagram = s.hexagramAmount>0,
      withPoles = s.polesAmount>0,
      withQd = s.qdAmount>0,
      withVelvet = s.vldAmount>0,
      withCrochet = s.hcrAmount>0,
      withBreed = breedActive(s),
      withG2 = s.g2Amount>0,
      withSpx = s.spxAmount>0,
      withPs = s.psAmount>0,
      withKd = s.kdAmount>0,
      withVc = s.vcAmount>0,
      withLettering = false, // Lettering is a separate, fail-safe GPU compositing pass.
      withComposition = blended && s.compositionAmount>0,
      withBackdrop = s.backdropAmount>0,
      withMicro = s.microAmount>0,
      withSubstance = s.substanceAmount>0,
      withPhoton = s.photonAmount>0,
      withUnderlay = s.underlayAmount>0,
      withFilament = s.filamentAmount>0,
      withHybrid = withFilament && s.filamentCrossbreed>0,
      withSemantic = withFilament && hasSemanticLettering(s),
      withOpticsA = withFilament && s.filamentOpticsAmount>0 && s.filamentOpticsMode!=="Off",
      withOpticsB = withHybrid && s.filamentSecondOpticsAmount>0 && s.filamentSecondOpticsMode!=="Off",
      withOptics = withOpticsA || withOpticsB,
      withStitch = withFilament && s.filamentStitchAmount>0,
      withSculpt = withFilament && s.filamentSculptAmount>0,
      withAdornment = withFilament && s.filamentAdornmentAmount>0 && (
        s.filamentAdornmentMode!=="Bare threads" ||
        withHybrid && s.filamentSecondAdornmentMode!=="Bare threads"
      ),
      withMorph = withFilament && s.filamentMorphAmount>0 &&
        s.filamentMorphMode!=="Off" && (
          s.filamentMorphTarget!==s.filamentMaterial ||
          withHybrid && s.filamentSecondMorphTarget!==s.filamentSecondMaterial
        ),
      withContagion = withMorph && s.filamentContagionAmount>0 &&
        s.filamentContagionMode!=="Off",
      withNeural = withFilament && s.filamentNeuralAmount>0 &&
        s.filamentNeuralMode!=="Off",
      withPlastic = withNeural && s.filamentPlasticAmount>0 &&
        s.filamentPlasticMode!=="Off",
      withScars = withNeural && s.filamentScarAmount>0 &&
        s.filamentScarMode!=="Off",
      withRegen = withScars && s.filamentRegenAmount>0 &&
        s.filamentRegenMode!=="Off",
      withTextileArchitecture = withFilament && s.filamentArchitecture!=="Bare architecture" && s.filamentArchitectureAmount>0,
      withTextileDimension = withTextileArchitecture && s.filamentDimMode!=="Static architecture" && s.filamentDimAmount>0 && s.filamentDimTarget!==s.filamentArchitecture,
      withTextileMeta = withTextileArchitecture && s.filamentMeta!=="Natural scaffold" && s.filamentMetaAmount>0,
      withTextileEngraving = withTextileArchitecture && s.filamentEngraveMode!=="Unengraved" && s.filamentEngraveAmount>0,
      withTextileAlchemy = withTextileMeta && s.filamentAlchMode!=="Stable material" && s.filamentAlchAmount>0 && s.filamentAlchTarget!==s.filamentMeta,
      withTextileEcology = withFilament && s.filamentEcology!=="Clean fibers" && s.filamentEcologyAmount>0,
      withTextileChroma = withFilament && s.filamentChroma!=="Original pigment" && s.filamentChromaAmount>0,
      withTextilePhysics = withFilament && s.filamentPhysics!=="Stable threads" && s.filamentPhysicsAmount>0,
      withMicroloom = withFilament && s.filamentMicroloom!=="Plain strand interior" && s.filamentMicroloomAmount>0,
      withConstruction = withFilament && s.filamentConstruction!=="Original strand" && s.filamentConstructionAmount>0,
      withFiberDetail = withFilament && (
        withMorph || s.filamentMaterial!=="Original thread" ||
        withHybrid && s.filamentSecondMaterial!=="Original thread" ||
        s.filamentNap>0 || s.filamentBeads>0
      ),
      withTunnel = s.engine===5 || (blended && s.secondaryEngine===5),
      withAtmosphere = s.atmoAmount>0,
      withAtmosphereB = s.atmoBAmount>0,
      withSubstrate = substrateEnabled(s),
      withApocalypse = apocalypseActive(s),
      withFossil = fossilEnabled(s),
      withSuccession = successionEnabled(s),
      withFoodWeb = foodWebActive(s),
      withSymbiosis = symbiosisActive(s),
      withGene = geneEnabled(s),
      withSelection = selectionActive(s),
      withHabitat = (withAtmosphere && s.atmoMaskMode!=="Everywhere") ||
        (withAtmosphereB && s.atmoBMaskMode!=="Everywhere"),
      withSpore = s.sporeAmount>0 && s.sporeMode!=="Dormant" && (
        (withAtmosphere && s.atmoMaskMode==="Painted colonies") ||
        (withAtmosphereB && s.atmoBMaskMode==="Painted colonies")
      ),
      withCortex = s.colonyCortexAmount>0 && (
        (withAtmosphere && s.atmoMaskMode==="Painted colonies") ||
        (withAtmosphereB && s.atmoBMaskMode==="Painted colonies")
      ),
      withStrange = (s.engine>=17 && s.engine<=19) ||
        (blended && s.secondaryEngine>=17 && s.secondaryEngine<=19),
      key = `${s.engine}/${blended ? s.secondaryEngine : "off"}/${s.split > 0.1}/${withStereo ? "stereo" : "flat"}/${withMaterial ? "foil" : "plain"}/${withLettering ? "letters" : "unlettered"}/${withComposition ? "territories" : "full"}/${withBackdrop ? "backdrop"+backdropModes.indexOf(s.backdropMode) : "unbacked"}/${withMicro ? "micro"+microModes.indexOf(s.microMode) : "untextured"}/${withSubstance ? "substance"+substanceModes.indexOf(s.substanceMode) : "bare"}/${withPhoton ? `photon${photonSpecies.indexOf(s.photonSpecies)}` : "unlit"}/${withUnderlay ? `underlay${underlayModes.indexOf(s.underlayMode)}` : "bare-ground"}/${withFilament ? `filament${filamentSpecies.indexOf(s.filamentSpecies)}` : "unstitched"}/${withHybrid ? `hybrid${filamentSpecies.indexOf(s.filamentSecondSpecies)}` : "single"}/${withFilament ? `fiber${filamentMaterials.indexOf(s.filamentMaterial)}` : "barefiber"}/${withHybrid ? `fiber2${filamentMaterials.indexOf(s.filamentSecondMaterial)}` : "singlefiber"}/${withFiberDetail ? "fiber-detail" : "classic-fiber"}/${withConstruction?"construction"+fiberConstructionModes.indexOf(s.filamentConstruction):"single-strand"}/${withMicroloom?"microloom"+microloomModes.indexOf(s.filamentMicroloom):"plain-interior"}/${withTextilePhysics?"textile-physics"+textilePhysicsModes.indexOf(s.filamentPhysics):"stable-yarn"}/${withTextileChroma?"textile-chroma"+textileChromaModes.indexOf(s.filamentChroma):"original-pigment"}/${withTextileArchitecture?"textile-architecture"+textileArchitectureModes.indexOf(s.filamentArchitecture):"bare-architecture"}/${withTextileDimension?"textile-dim"+textileDimensionModes.indexOf(s.filamentDimMode)+"x"+textileArchitectureModes.indexOf(s.filamentDimTarget):"static-architecture"}/${withTextileMeta?"textile-meta"+textileMetaModes.indexOf(s.filamentMeta):"natural-scaffold"}/${withTextileEngraving?"engraving"+textileEngravingModes.indexOf(s.filamentEngraveMode):"unengraved"}/${withTextileAlchemy?"textile-alchemy"+textileAlchemyModes.indexOf(s.filamentAlchMode)+"x"+textileMetaModes.indexOf(s.filamentAlchTarget):"stable-material"}/${withTextileEcology?"textile-ecology"+textileEcologyModes.indexOf(s.filamentEcology):"clean-fibers"}/${withStitch ? "sewing"+filamentStitchModes.indexOf(s.filamentStitchMode) : "still-loom"}/${withSculpt ? "relief"+filamentSculptModes.indexOf(s.filamentSculptMode) : "flat-thread"}/${withAdornment ? "trinket"+filamentAdornmentModes.indexOf(s.filamentAdornmentMode)+(withHybrid?"x"+filamentAdornmentModes.indexOf(s.filamentSecondAdornmentMode):"")+"c"+Math.max(0,jewelryColonyModes.indexOf(s.filamentAdornmentColony)) : "bare-trinkets"}/${withMorph?"morph"+filamentMaterials.indexOf(s.filamentMorphTarget)+(withHybrid?"x"+filamentMaterials.indexOf(s.filamentSecondMorphTarget):""):"no-morph"}/${withContagion?"contagion"+filamentContagionModes.indexOf(s.filamentContagionMode):"no-contagion"}/${withNeural?"neural"+filamentNeuralModes.indexOf(s.filamentNeuralMode):"no-neural"}/${withPlastic?"plastic"+filamentPlasticModes.indexOf(s.filamentPlasticMode):"no-plastic"}/${withScars?"scars"+filamentScarModes.indexOf(s.filamentScarMode):"no-scars"}/${withRegen?"regen"+filamentRegenModes.indexOf(s.filamentRegenMode):"no-regen"}/${withAtmosphere ? `atmo${atmosphereModes.indexOf(s.atmoMode)}` : "no-atmo"}/${withAtmosphereB ? `atmoB${atmosphereModes.indexOf(s.atmoBMode)}blend${atmosphereBlendModes.indexOf(s.atmoBBlendMode)}` : "no-atmoB"}/${withHabitat ? `habA${atmosphereHabitats.indexOf(s.atmoMaskMode)}habB${atmosphereSecondHabitats.indexOf(s.atmoBMaskMode)}` : "no-habitat"}/${withCortex ? "cortex" : "no-cortex"}/${withSpore ? "spores" : "no-spores"}/${withSubstrate ? "substrate" : "no-substrate"}/${withSymbiosis ? "symbiosis" : "no-symbiosis"}/${withGene ? "bloodlines" : "no-bloodlines"}/${withSelection ? "survival" : "no-survival"}/${withApocalypse ? "apocalypse" : "no-apocalypse"}/${withFossil ? "fossils" : "no-fossils"}/${withSuccession ? "succession" : "no-succession"}/${withFoodWeb ? "food-web" : "no-food-web"}/${withWiggle ? "wiggle" : "still"}/${withAlchemy ? "alchemy"+alchemyModes.indexOf(s.alchemyMode) : "no-alchemy"}/${withInjury ? "injury"+injuryModes.indexOf(s.injuryMode) : "no-injury"}/${withOptics ? "struct-opt"+(withOpticsA?structuralOpticsModes.indexOf(s.filamentOpticsMode):0)+"x"+(withOpticsB?structuralOpticsModes.indexOf(s.filamentSecondOpticsMode):0):"bare-optics"}/${withSemantic?"semantic-glyph":"no-semantic-glyph"}/${withHexagram?"hexagram":"no-hexagram"}/${withPoles?"complex-poles":"no-complex-poles"}/${withQd?"quasi-dissolve":"no-quasi-dissolve"}/${withVelvet?"velvet":"no-velvet"}/${withCrochet?"crochet":"no-crochet"}/${withBreed?"crossbreed":"no-crossbreed"}/${withG2?"g2-torsion":"no-g2"}/${withSpx?"subpixel-"+spxModes.indexOf(s.spxMode):"no-subpixel"}/${withPs?"prism-scales-"+psModes.indexOf(s.psMode):"no-prism-scales"}/${withKd?"klein-dither-"+kdModes.indexOf(s.kdMode):"no-klein-dither"}/${withVc?"curlwave-"+vcModes.indexOf(s.vcMode):"no-curlwave"}`;
    if (programs.has(key)) {
      const cached = programs.get(key);
      programs.delete(key);
      programs.set(key, cached);
      return cached;
    }
    // Compile only the selected fields. Literal engine IDs let the driver eliminate
    // unused branches before GPU code generation; the equations are unchanged.
    let source = fragment.replace(
      "uniform int engine,secondaryEngine,blendMode,count,colorCount,colorMode;",
      `uniform int blendMode,count,colorCount,colorMode;\n#define engine ${s.engine}\n#define secondaryEngine ${s.secondaryEngine}`,
    );
    if (!blended)
      source = source.replace("if(blend<.001)return a;", "return a;");
    // The offspring reuses existing parent shader diagnostics and never
    // evaluates an extra parent field or raymarch to cross them.
    source=source.replace("/* VC_MODULE */",withVc ? vcGLSL : "");
    source=source.replace("/* VC_PRE */",withVc
      ? "p+=vcWarpPoint(p);" : "");
    source=source.replace("/* VC_POST */",withVc
      ? "col=vcDress(col,uv,p,v);" : "");
    source=source.replace("/* KD_MODULE */",withKd ? kdGLSL : "");
    source=source.replace("/* KD_POST */",withKd
      ? "col=kdDress(col,uv,p,v);" : "");
    source=source.replace("/* PS_MODULE */",withPs ? psGLSL : "");
    source=source.replace("/* PS_POST */",withPs
      ? "col=psDress(col,uv,p,v);" : "");
    source=source.replace("/* SPX_MODULE */",withSpx ? spxGLSL : "");
    source=source.replace("/* SPX_POST */",withSpx
      ? "col=spxInterference(uv,p,v,col);" : "");
    source=source.replace("/* G2_MODULE */",withG2 ? g2GLSL : "");
    source=source.replace("/* G2_PRE */",withG2
      ? "vec4 g2Data=g2Membrane(p);" : "");
    source=source.replace("/* G2_POST */",withG2
      ? "col=g2Dress(col,g2Data,p);" : "");
    source=source.replace("/* CROSSBREED_MODULE */",withBreed ? breedGLSL : "");
    source=source.replace("/* CROSSBREED_PRE */",withBreed
      ? "vec4 breedTissue="+(withVelvet?"velvetData":"vec4(0.0)")+
        ";vec4 breedData=breedInterlock(p,breedTissue,"+
        (withHexagram?"hexagramData":"vec4(0.0)")+","+
        (withPoles?"polesData":"vec4(0.0)")+","+
        (withQd?"qdData":"vec4(0.0)")+","+
        (withCrochet?"crochetDelta":"vec2(0.0)")+
        ");"+(withVelvet?"velvetData=breedTissue;":"") : "");
    source=source.replace("/* CROSSBREED_POST */",withBreed
      ? "col=breedDress(col,breedData,p);" : "");
    source=source.replace("/* VELVET_MODULE */",withVelvet ? velvetGLSL : "");
    source=source.replace("/* VELVET_PRE */",withVelvet
      ? "vec4 velvetData=vldPrepare(p);" : "");
    source=source.replace("/* VELVET_POST */",withVelvet
      ? "col=vldDress(col,p,uv,velvetData);" : "");
    source=source.replace("/* CROCHET_MODULE */",withCrochet ? crochetGLSL : "");
    source=source.replace("/* CROCHET_PRE */",withCrochet
      ? "vec2 crochetDelta=hcrRuffle(p)-p;crochetDelta/=1.0+length(crochetDelta);p+=crochetDelta*hcrAmount*hcrRuffles*.12;" : "");
    source=source.replace("/* CROCHET_POST */",withCrochet
      ? "col=hcrDress(col,uv,p);" : "");
    source=source.replace("/* QUASI_DECAY_MODULE */",withQd ? qdGLSL : "");
    source=source.replace("/* QUASI_DECAY_PRE */",withQd
      ? "vec4 qdData=qdInterfere(p);" : "");
    source=source.replace("/* QUASI_DECAY_POST */",withQd
      ? "col=qdDress(col,qdData);" : "");
    source=source.replace("/* POLES_MODULE */",withPoles ? polesGLSL : "");
    source=source.replace("/* POLES_PRE */",withPoles
      ? "vec4 polesData=vec4(0.);p=pzWarpPoint(p,polesData);" : "");
    source=source.replace("/* POLES_POST */",withPoles
      ? "col=pzDressColor(col,polesData);" : "");
    source=source.replace("/* HEXAGRAM_MODULE */",withHexagram ? hexagramGLSL : "");
    source=source.replace("/* HEXAGRAM_PRE */",withHexagram
      ? "vec4 hexagramData=hexagramTerraceField(p);p=hexagramTerraceWarp(p,hexagramData);" : "");
    source=source.replace("/* HEXAGRAM_VALUE */",withHexagram
      ? "v+=hexagramAmount*(hexagramData.z-.5)*.28;" : "");
    source=source.replace("/* HEXAGRAM_POST */",withHexagram
      ? "col=hexagramTerraceColor(col,hexagramData);" : "");
    source = source.replace("/* STRANGE_FIELDS_MODULE */",withStrange ? strangeFieldsGLSL :
      "float strangeField(vec2 p,int kind){return 0.;}");
    source = source.replace("/* WIGGLE_MODULE */", withWiggle ? wiggleGLSL : "");
    source = source.replace("/* WIGGLE_POST */", withWiggle ? "p=wiggleCoordinates(p);" : "");
    source = source.replace("/* STEREO_MODULE */", withStereo ? stereoGLSL : "");
    source = source.replace("/* TUNNEL_MODULE */", withTunnel ? tunnelGLSL :
      "float seamlessTunnel(vec2 p){return 0.;}");
    source = source.replace("/* STEREO_POST */", withStereo
      ? `vec4 ghost=ghostTrace(p,uv);
         float ghostOpacity=engine==16 ? max(.83,stereoAmount) :
           (secondaryEngine==16 && blend>.001 ? max(stereoAmount,blend*.78) : stereoAmount);
         ${withComposition ? "if(engine!=16 && secondaryEngine==16) ghostOpacity*=territoryMask(uv)*compositionAmount;" : ""}
         col=mix(col,ghost.rgb,clamp(ghostOpacity*(.52+.48*ghost.a),0.,1.));`
      : "");
    const materialSource=withSubstance
      ? specializeSubstanceGLSL(
          substanceGLSL.replace("uniform int substanceMode;",
            "#define substanceMode "+Math.max(0,substanceModes.indexOf(s.substanceMode))),
          substanceModes.indexOf(s.substanceMode))
      : "";
    source=source.replace("/* SUBSTANCE_MODULE */",materialSource);
    source=source.replace("/* SUBSTANCE_POST */",
      withSubstance?"col=livingSubstance(col,uv,p,v);":"");
    // Extract only the selected optical geometry before shader compilation.
    // Full Surprise may choose from 26; an active canvas still compiles just 1.
    const specializedPhoton = withPhoton
      ? specializePhotonGeometry(photonGLSL.replace("uniform int photonSpecies;",
          "#define photonSpecies "+Math.max(0,photonSpecies.indexOf(s.photonSpecies))),
          photonSpecies.indexOf(s.photonSpecies))
      : "";
    source=source.replace("/* PHOTON_MODULE */",specializedPhoton);
    source=source.replace("/* PHOTON_POST */",withPhoton?"col=livingPhotonZoo(col,uv,p,v);":"");
    // Textile ground is independent from filament visibility. Inject it
    // directly behind the stitches and specialize to the selected pattern.
    const selectedUnderlay = withUnderlay
      ? specializeUnderlayGLSL(
          underlayGLSL.replace("uniform int underlayMode;",
            "#define underlayMode "+Math.max(0,underlayModes.indexOf(s.underlayMode))),
          underlayModes.indexOf(s.underlayMode))
      : "";
    source=source.replace("/* UNDERLAY_MODULE */",selectedUnderlay);
    source=source.replace("/* UNDERLAY_POST */",
      withUnderlay?"col=livingTextileUnderlay(col,uv,v);":"");
    // Do not compile the second geometry at all for old or single-parent art.
    const rawFilament=withFilament
      ? (withHybrid ? "#define FILAMENT_HYBRID 1\n" : "") +
        (withTextileEngraving ? "#define FILAMENT_ARCH_ENGRAVING 1\n" : "") +
        (withTextileAlchemy ? "#define FILAMENT_ARCH_ALCHEMY 1\n" : "") +
        (withTextileMeta ? "#define FILAMENT_ARCH_META 1\n" : "") +
        (withTextileDimension ? "#define FILAMENT_ARCH_DIMENSION 1\n" : "") +
        (withTextileArchitecture ? "#define FILAMENT_ARCHITECTURE 1\n" : "") +
        (withTextileEcology ? "#define FILAMENT_SURFACE_ECOLOGY 1\n" : "") +
        (withTextileChroma ? "#define FILAMENT_CHROMA 1\n" : "") +
        (withTextilePhysics ? "#define FILAMENT_PHYSICS 1\n" : "") +
        (withMicroloom ? "#define FILAMENT_MICROLOOM 1\n" : "") +
        (withConstruction ? "#define FILAMENT_CONSTRUCTION 1\n" : "") +
        (withFiberDetail ? "#define FILAMENT_FIBER_DETAIL 1\n" : "") +
        (withOptics ? "#define FILAMENT_STRUCTURAL_OPTICS 1\n" : "") +
        (withSemantic ? "#define FILAMENT_SEMANTIC_GRAVITY 1\n" : "") +
        (withStitch ? "#define FILAMENT_STITCHING 1\n" : "") +
        (withSculpt ? "#define FILAMENT_SCULPT 1\n" : "") +
        (withAdornment ? "#define FILAMENT_ADORNMENT 1\n" : "") +
        (withMorph ? "#define FILAMENT_METAMORPH 1\n" : "") +
        (withContagion ? "#define FILAMENT_CONTAGION 1\n" : "") +
        (withNeural ? "#define FILAMENT_NEURAL 1\n" : "") +
        (withPlastic ? "#define FILAMENT_PLASTICITY 1\n" : "") +
        (withScars ? "#define FILAMENT_GHOST_SCARS 1\n" : "") +
        (withRegen ? "#define FILAMENT_REGENERATION 1\n" : "") +
        filamentGLSL.replace("uniform int filamentSpecies;",
          "#define filamentSpecies "+Math.max(0,filamentSpecies.indexOf(s.filamentSpecies)))
          .replace("uniform int filamentSecondSpecies;",
            "#define filamentSecondSpecies "+Math.max(0,filamentSpecies.indexOf(s.filamentSecondSpecies)))
          .replace("uniform int filamentMaterial;",
            "#define filamentMaterial "+Math.max(0,filamentMaterials.indexOf(s.filamentMaterial)))
          .replace("uniform int filamentStitchMode;",
            "#define filamentStitchMode "+Math.max(0,filamentStitchModes.indexOf(s.filamentStitchMode)))
          .replace("uniform int filamentSculptMode;",
            "#define filamentSculptMode "+Math.max(0,filamentSculptModes.indexOf(s.filamentSculptMode)))
          .replace("uniform int filamentOpticsMode,filamentSecondOpticsMode;",
            "#define filamentOpticsMode "+Math.max(0,structuralOpticsModes.indexOf(s.filamentOpticsMode))+"\n"+
            "#define filamentSecondOpticsMode "+Math.max(0,structuralOpticsModes.indexOf(s.filamentSecondOpticsMode)))
          .replace("uniform int filamentEngraveMode;",
            "#define filamentEngraveMode "+Math.max(0,textileEngravingModes.indexOf(s.filamentEngraveMode)))
          .replace("uniform int filamentAlchMode;",
            "#define filamentAlchMode "+Math.max(0,textileAlchemyModes.indexOf(s.filamentAlchMode)))
          .replace("uniform int filamentAlchTarget;",
            "#define filamentAlchTarget "+Math.max(0,textileMetaModes.indexOf(s.filamentAlchTarget)))
          .replace("uniform int filamentMeta;",
            "#define filamentMeta "+Math.max(0,textileMetaModes.indexOf(s.filamentMeta)))
          .replace("uniform int filamentDimMode;",
            "#define filamentDimMode "+Math.max(0,textileDimensionModes.indexOf(s.filamentDimMode)))
          .replace("uniform int filamentDimTarget;",
            "#define filamentDimTarget "+Math.max(0,textileArchitectureModes.indexOf(s.filamentDimTarget)))
          .replace("uniform int filamentArchitecture;",
            "#define filamentArchitecture "+Math.max(0,textileArchitectureModes.indexOf(s.filamentArchitecture)))
          .replace("uniform int filamentEcology;",
            "#define filamentEcology "+Math.max(0,textileEcologyModes.indexOf(s.filamentEcology)))
          .replace("uniform int filamentChroma;",
            "#define filamentChroma "+Math.max(0,textileChromaModes.indexOf(s.filamentChroma)))
          .replace("uniform int filamentPhysics;",
            "#define filamentPhysics "+Math.max(0,textilePhysicsModes.indexOf(s.filamentPhysics)))
          .replace("uniform int filamentMicroloom;",
            "#define filamentMicroloom "+Math.max(0,microloomModes.indexOf(s.filamentMicroloom)))
          .replace("uniform int filamentConstruction;",
            "#define filamentConstruction "+Math.max(0,fiberConstructionModes.indexOf(s.filamentConstruction)))
          .replace("uniform int filamentSecondMaterial;",
            "#define filamentSecondMaterial "+Math.max(0,filamentMaterials.indexOf(s.filamentSecondMaterial)))
          .replace("uniform int filamentAdornmentMode,filamentSecondAdornmentMode;",
            "#define filamentAdornmentMode "+Math.max(0,filamentAdornmentModes.indexOf(s.filamentAdornmentMode))+"\n"+
            "#define filamentSecondAdornmentMode "+Math.max(0,filamentAdornmentModes.indexOf(s.filamentSecondAdornmentMode)))
          .replace("uniform int filamentAdornmentColony;",
            "#define filamentAdornmentColony "+Math.max(0,jewelryColonyModes.indexOf(s.filamentAdornmentColony)))
          .replace("uniform int filamentContagionMode;",
            "#define filamentContagionMode "+Math.max(0,filamentContagionModes.indexOf(s.filamentContagionMode)))
          .replace("uniform int filamentNeuralMode;",
            "#define filamentNeuralMode "+Math.max(0,filamentNeuralModes.indexOf(s.filamentNeuralMode)))
          .replace("uniform int filamentPlasticMode;",
            "#define filamentPlasticMode "+Math.max(0,filamentPlasticModes.indexOf(s.filamentPlasticMode)))
          .replace("uniform int filamentScarMode;",
            "#define filamentScarMode "+Math.max(0,filamentScarModes.indexOf(s.filamentScarMode)))
          .replace("uniform int filamentRegenMode;",
            "#define filamentRegenMode "+Math.max(0,filamentRegenModes.indexOf(s.filamentRegenMode)))
          .replace("uniform int filamentMorphTarget,filamentSecondMorphTarget;",
            "#define filamentMorphTarget "+Math.max(0,filamentMaterials.indexOf(s.filamentMorphTarget))+"\n"+
            "#define filamentSecondMorphTarget "+Math.max(0,filamentMaterials.indexOf(s.filamentSecondMorphTarget)))
      : "";
    const selectedFilament=withFilament
      ? specializeFilamentRegeneration(
          specializeFilamentScars(
          specializeFilamentPlasticity(
          specializeFilamentNeural(
          specializeFilamentContagion(
          specializeFilamentMorphMaterials(
          specializeFilamentAdornments(
          specializeFilamentMaterials(
          specializeFilamentSculptMotion(
            specializeFilamentStitchMotion(
              specializeFilamentGeometry(rawFilament,
                filamentSpecies.indexOf(s.filamentSpecies),
                withHybrid?filamentSpecies.indexOf(s.filamentSecondSpecies):null),
              withStitch?filamentStitchModes.indexOf(s.filamentStitchMode):null),
            withSculpt?filamentSculptModes.indexOf(s.filamentSculptMode):null),
          withFiberDetail?filamentMaterials.indexOf(s.filamentMaterial):null,
          withFiberDetail&&withHybrid?filamentMaterials.indexOf(s.filamentSecondMaterial):null),
          withAdornment?filamentAdornmentModes.indexOf(s.filamentAdornmentMode):null,
          withAdornment&&withHybrid?filamentAdornmentModes.indexOf(s.filamentSecondAdornmentMode):null,
          withAdornment?Math.max(0,jewelryColonyModes.indexOf(s.filamentAdornmentColony)):0),
          withMorph?filamentMaterials.indexOf(s.filamentMorphTarget):null,
          withMorph&&withHybrid?filamentMaterials.indexOf(s.filamentSecondMorphTarget):null),
          withContagion?filamentContagionModes.indexOf(s.filamentContagionMode):null),
          withNeural?filamentNeuralModes.indexOf(s.filamentNeuralMode):null),
          withPlastic?filamentPlasticModes.indexOf(s.filamentPlasticMode):null),
          withScars?filamentScarModes.indexOf(s.filamentScarMode):null),
          withRegen?filamentRegenModes.indexOf(s.filamentRegenMode):null)
      : "";
    source=source.replace("/* SEMANTIC_GRAVITY_MODULE */",
      withSemantic?semanticGravityGLSL:"");
    source=source.replace("/* FILAMENT_MODULE */",selectedFilament);
    source=source.replace("/* FILAMENT_POST */",
      withFilament?"col=livingFilamentForge(col,uv,p,v);":"");
    const chosenAtmosphere = withAtmosphere
      ? atmosphereGLSL.replace("/* ATMOSPHERE_VARIANT */",
          "#define ATMO_MODE "+Math.max(0,atmosphereModes.indexOf(s.atmoMode)))
      : "";
    const chosenAtmosphereB=withAtmosphereB
      ? specializeAtmosphereVariant(s.atmoBMode,true) : "";
    // The second shader is a separately named function with its own normalized
    // uniforms. Macro reset prevents the second variant from changing parent A.
    source=source.replace("/* ATMOSPHERE_MODULE */",chosenAtmosphere+
      (withAtmosphereB ? (withAtmosphere ? "\n#undef ATMO_MODE\n" : "")+
        chosenAtmosphereB : ""));
    source=source.replace("/* SYMBIOSIS_MODULE */",withSymbiosis?symbiosisGLSL:"");
    source=source.replace("/* APOCALYPSE_MODULE */",
      withApocalypse?apocalypseGLSL:"");
    source=source.replace("/* FOSSIL_MODULE */",
      withFossil?fossilGLSL:"");
    source=source.replace("/* SUCCESSION_MODULE */",
      withSuccession?successionGLSL:"");
    source=source.replace("/* FOOD_WEB_MODULE */",
      withFoodWeb?foodWebGLSL:"");
    source=source.replace("/* SUBSTRATE_MODULE */",
      withSubstrate
        ? substrateGLSL
          .replace("/* APOCALYPSE_RESOURCE */n",
            withApocalypse?"apocalypseResource(uv,n)":"n")
          .replace("/* FOSSIL_RESOURCE */",
            withFossil?"fossilResource(uv,":"")
          .replace("/* FOSSIL_RESOURCE_END */",withFossil?")":"")
          .replace("/* SUCCESSION_RESOURCE */",
            withSuccession?"successionResource(uv,":"")
          .replace("/* SUCCESSION_RESOURCE_END */",withSuccession?")":"")
        : "");
    source=source.replace("/* SUBSTRATE_POST */",
      withSubstrate?"col=shadeSubstrate(col,uv);":"");
    source=source.replace("/* SUCCESSION_POST */",
      withSuccession?"col=shadeSuccession(col,uv);":"");
    source=source.replace("/* FOOD_WEB_POST */",
      withFoodWeb?"col=shadeFoodWeb(col,uv);":"");
    source=source.replace("/* FOSSIL_POST */",
      withFossil?"col=shadeFossilRelics(col,uv);":"");
    source=source.replace("/* APOCALYPSE_POST */",
      withApocalypse?"col=shadeApocalypse(col,uv);":"");
    // Inline cortex ONLY for active planted material; old habitat shaders
    // have no new sampling code or material math to compile on mobile GPUs.
    const cortexSample=withCortex
      ? `if(colonyCortexAmount>.001){
          vec2 cortexCell=delta/max(r,.0001);
          float cortexRadial=distanceToSeed/max(edge,.0001);
          vec3 tissue=colonyCortexSample(cortexCell,angle,cortexRadial,index,parent);
          if(parent<.5)colonyCortexFieldA=max(colonyCortexFieldA,tissue*disk);
          else colonyCortexFieldB=max(colonyCortexFieldB,tissue*disk);
        }`
      : "";
    const sporeSample=withSpore
      ? `if(sporeAmount>.001 &&
           index<float(habitatStampCount)*sporeFertility){
           vec2 baby=sporeSample(uv,stamp,index,parent,aspect.x);
           inside=max(inside,baby.x);
           if(parent<.5)sporeFlightA=max(sporeFlightA,baby.y);
           else sporeFlightB=max(sporeFlightB,baby.y);
         }`
      : "";
    const substrateEdge=withSubstrate
      ? "float preference=mix(1.-substrateNutrient,substrateNutrient,"+
        "parent<.5?substrateAffinityA:substrateAffinityB);"+
        "edge*=mix(1.,.57+preference*.96,substratePressure*substrateAmount);"
      : "";
    const geneEdge=withGene
      ? "edge*=geneEdgeFactor(stamp.w,angle,t,index);"
      : "";
    const geneSample=withGene
      ? `if(geneCarrier(stamp.w)>.5&&disk>.001){
          float g=geneAllele(stamp.w);
          if(parent<.5){
            if(disk>genomeSignalA.x)genomeSignalA=vec2(disk,g);
          }else{
            if(disk>genomeSignalB.x)genomeSignalB=vec2(disk,g);
          }
        }`
      : "";
    const selectionEdge=withSelection
      ? `if(geneCarrier(stamp.w)>.5){
          float fitness=adaptiveFitness(
            geneAllele(stamp.w),substrateNutrient,parent);
          edge*=mix(1.,.56+.74*fitness,selectionPressure);
        }`
      : "";
    const selectionSample=withSelection
      ? `if(geneCarrier(stamp.w)>.5&&disk>.001){
          float localFitness=adaptiveFitness(
            geneAllele(stamp.w),substrateNutrient,parent);
          if(parent<.5)
            selectionFieldA=max(selectionFieldA,localFitness*disk);
          else
            selectionFieldB=max(selectionFieldB,localFitness*disk);
        }`
      : "";
    const masks=withHabitat
      ? habitatGLSL
          .replace("/* ATMO_MASK_A */",
            String(Math.max(0,atmosphereHabitats.indexOf(s.atmoMaskMode))))
          .replace("/* ATMO_MASK_B */",
            String(Math.max(0,atmosphereSecondHabitats.indexOf(s.atmoBMaskMode))))
          .replace("/* CORTEX_MODULE */",withCortex ? colonyCortexGLSL : "")
          .replace("/* CORTEX_SAMPLE */",cortexSample)
          .replace("/* SPORE_MODULE */",withSpore ? sporeDynastyGLSL : "")
          .replace("/* SPORE_SAMPLE */",sporeSample)
          .replace("/* SUBSTRATE_GATE */",withSubstrate?"*1.24":"")
          .replace("/* SUBSTRATE_EDGE */",substrateEdge)
          .replace("/* GENE_MODULE */",withGene ? geneGLSL : "")
          .replace("/* GENE_GATE */",withGene?"*1.34":"")
          .replace("/* GENE_EDGE */",geneEdge)
          .replace("/* GENE_SAMPLE */",geneSample)
          .replace("/* SELECTION_MODULE */",withSelection ? selectionGLSL : "")
          .replace("/* SELECTION_EDGE */",selectionEdge)
          .replace("/* SELECTION_SAMPLE */",selectionSample)
      : "";
    const hybrid=withAtmosphereB
      ? "#define ATM_BLEND_B "+Math.max(0,atmosphereBlendModes.indexOf(s.atmoBBlendMode))+
        "\n"+atmosphereHybridGLSL : "";
    source=source.replace("/* HABITAT_MODULE */",masks+"\n"+hybrid);
    const maskedA=withAtmosphere && s.atmoMaskMode!=="Everywhere";
    const maskedB=withAtmosphereB && s.atmoBMaskMode!=="Everywhere";
    const rivalry=maskedA && maskedB &&
      s.atmoMaskMode==="Painted colonies" &&
      s.atmoBMaskMode==="Painted colonies";
    // Evaluate each mask once per pixel; the same masks govern color and
    // front-lighting. No extra texture pass or unstable frame-history buffer.
    const maskPrelude=withHabitat
      ? "float atmoAMask="+(maskedA?"atmosphereMaskForA(uv)":"1.")+";"+
        "float atmoBMask="+(maskedB?"atmosphereMaskForB(uv)":"1.")+";"+
        (withSymbiosis
          ? "float symbioticAMask=atmoAMask;float symbioticBMask=atmoBMask;"
          : "")+
        (rivalry ? `if(colonyLifeMode==4 && colonyLifeAmount>.001 && colonyCompetition>.001){
            float pressure=.22*sin(time*(.19+colonyLifeSpeed*1.37)+uv.x*4.8-uv.y*3.7);
            float aWins=smoothstep(-.2,.2,atmoAMask-atmoBMask+pressure);
            float conflict=colonyCompetition*colonyLifeAmount;
            atmoAMask*=mix(1.,aWins,conflict);
            atmoBMask*=mix(1.,1.-aWins,conflict);
          }` : "")
      : "";
    const glowA=maskedA
      ? "col+=palette(atmoHue+colorTime*.009)*"+
        "(4.*atmoAMask*(1.-atmoAMask))*("+
        (s.atmoMaskMode==="Painted colonies"
          ? "colonyFrontGlow*.72+colonyAnatomyRim*colonyAnatomyAmount*.65"
          : "colonyFrontGlow*.72")+");"
      : "";
    const glowB=maskedB
      ? "col+=palette(atmoBHue+.28+colorTime*.009)*"+
        "(4.*atmoBMask*(1.-atmoBMask))*("+
        (s.atmoBMaskMode==="Painted colonies"
          ? "colonyFrontGlow*.72+colonyAnatomyRim*colonyAnatomyAmount*.65"
          : "colonyFrontGlow*.72")+");"
      : "";
    source=source.replace("/* ATMOSPHERE_POST */",
      maskPrelude+(withAtmosphere
        ? (maskedA
          ? "vec3 atmoParent=livingMutantAtmosphere(col,uv,p,v);"+
            "col=mix(col,atmoParent,atmoAMask);"+glowA+
            (withCortex && s.atmoMaskMode==="Painted colonies"
              ? "col=tintColonyCortex(col,atmoAMask,colonyCortexFieldA,atmoHue);"
              : "")+
            (withSpore && s.atmoMaskMode==="Painted colonies"
              ? "col=tintSporeCloud(col,sporeFlightA,atmoHue);"
              : "")+
            (withGene && s.atmoMaskMode==="Painted colonies"
              ? "col=tintColonyGenome(col,atmoAMask,genomeSignalA,atmoHue);"
              : "")+
            (withSelection && s.atmoMaskMode==="Painted colonies"
              ? "col=tintAdaptiveSurvival(col,atmoAMask,selectionFieldA,atmoHue);"
              : "")
          : "col=livingMutantAtmosphere(col,uv,p,v);")
        : ""));
    source=source.replace("/* ATMOSPHERE_B_POST */",
      withAtmosphereB ? ("vec3 atmoChild=livingMutantAtmosphereB(col,uv,p,v);"+
        "vec3 atmoResult=crossbreedAtmospheres(col,atmoChild,uv,v);"+
        (maskedB
          ? "col=mix(col,atmoResult,atmoBMask);"+glowB+
            (withCortex && s.atmoBMaskMode==="Painted colonies"
              ? "col=tintColonyCortex(col,atmoBMask,colonyCortexFieldB,atmoBHue);"
              : "")+
            (withSpore && s.atmoBMaskMode==="Painted colonies"
              ? "col=tintSporeCloud(col,sporeFlightB,atmoBHue);"
              : "")+
            (withGene && s.atmoBMaskMode==="Painted colonies"
              ? "col=tintColonyGenome(col,atmoBMask,genomeSignalB,atmoBHue);"
              : "")+
            (withSelection && s.atmoBMaskMode==="Painted colonies"
              ? "col=tintAdaptiveSurvival(col,atmoBMask,selectionFieldB,atmoBHue);"
              : "")
          : "col=atmoResult;")+
        (withSymbiosis
          ? "col=livingSymbiosis(col,uv,symbioticAMask,symbioticBMask);"
          : "")) : "");
    const textureSource=withMicro
      ? specializeMicroGLSL(
          microGLSL.replace("uniform int microMode;",
            "#define microMode "+Math.max(0,microModes.indexOf(s.microMode))),
          microModes.indexOf(s.microMode))
      : "";
    source=source.replace("/* MICRO_MODULE */",textureSource);
    source=source.replace("/* MICRO_POST */",withMicro?"col=movingMicrostructure(col,p,uv,v);":"");
    // The selected atmospheric branch is the only one sent to mobile GPUs.
    // The program cache key includes the chosen backdrop index.
    const selectedBackdrop = withBackdrop
      ? specializeBackdropGLSL(
          backdropGLSL.replace("uniform int backdropMode;",
            "#define backdropMode "+Math.max(0,backdropModes.indexOf(s.backdropMode))),
          backdropModes.indexOf(s.backdropMode))
      : "";
    source=source.replace("/* BACKDROP_MODULE */",selectedBackdrop);
    source=source.replace("/* BACKDROP_POST */",withBackdrop?"col=livingBackdrop(col,uv,v);":"");
    source=source.replace("/* COMPOSITION_MODULE */",withComposition?compositionGLSL:"");
    source=source.replace("/* COMPOSITION_POST */",
      withComposition?"col=territoryComposite(col,p,uv,source);":"");
    if(withComposition)source=source.replace("float v=composed(p);","float v=field(p,engine);");
    source=source.replace("/* MATERIAL_MODULE */",withMaterial?materialGLSL:"");
    source=source.replace("/* MATERIAL_POST */",withMaterial?"col=prismaticTape(col,uv,p,v);":"");
    // Shader mode specialization is the only color engine sent to the GPU.
    // Off => shader code entirely absent, so legacy art remains pixel-identical.
    const opticalColor=withAlchemy
      ?specializeAlchemyGLSL(
          alchemyGLSL.replace("uniform int alchemyMode;",
            "#define alchemyMode "+Math.max(0,alchemyModes.indexOf(s.alchemyMode))),
          alchemyModes.indexOf(s.alchemyMode))
      :"";
    source=source.replace("/* ALCHEMY_MODULE */",opticalColor);
    source=source.replace("/* ALCHEMY_POST */",
      withAlchemy?"col=livingColorAlchemy(col,uv,p,v);":"");
    // Filter to the selected print law only; no extra post-processing pass.
    const printSource=withInjury
      ?specializeInjuryGLSL(
          injuryGLSL.replace("uniform int injuryMode;",
            "#define injuryMode "+Math.max(0,injuryModes.indexOf(s.injuryMode))),
          injuryModes.indexOf(s.injuryMode))
      :"";
    source=source.replace("/* INJURY_MODULE */",printSource);
    source=source.replace("/* INJURY_POST */",
      withInjury?"col=livingPrintInjury(col,uv,p,v);":"");
    source=source.replace("/* LETTERING_MODULE */",withLettering?kineticGLSL:"");
    source=source.replace("/* LETTERING_POST */",withLettering?"col=drawKineticLetters(col,uv);":"");
    if (s.split <= 0.1) source = source.replace("if(split>.001)", "if(false)");
    const vs = gl2
      ? "#version 300 es\n" + vertex.replace("attribute vec2", "in vec2")
      : vertex;
    const fs = gl2
      ? "#version 300 es\n" +
        source
          .replace(
            "precision highp float;",
            "precision highp float;\nout vec4 fragColor;",
          )
          .replaceAll("gl_FragColor", "fragColor")
          .replaceAll("texture2D(", "texture(")
      : source;
    let vertexShader, fragmentShader, program;
    try {
      vertexShader = compile(gl.VERTEX_SHADER, vs);
      fragmentShader = compile(gl.FRAGMENT_SHADER, fs);
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.bindAttribLocation(program, 0, "position");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
      gl.detachShader(program, vertexShader);
      gl.detachShader(program, fragmentShader);
    } catch (e) {
      if (program) gl.deleteProgram(program);
      throw e;
    } finally {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
    }
    const descriptor = { program, locations: new Map(), paletteKey: "" };
    programs.set(key, descriptor);
    if (programs.size > 6) {
      const oldest = programs.keys().next().value;
      gl.deleteProgram(programs.get(oldest).program);
      programs.delete(oldest);
    }
    return descriptor;
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const loc = (key) => {
    if (!active.locations.has(key))
      active.locations.set(key, gl.getUniformLocation(active.program, key));
    return active.locations.get(key);
  };
  const colorBuffer = new Float32Array(36),
    marksBuffer = new Float32Array(128),
    shapeBuffer = new Float32Array(64),
    habitatBuffer = new Float32Array(64), // 16 planted habitat seeds, 4 floats per stamp
    fossilBuffer = new Float32Array(32), // 8 historical impressions, 4 floats each; reused
    successionBuffer = new Float32Array(MAX_SUCCESSION*4), // six aged soil deposits
    foodWebBuffer = new Float32Array(MAX_FOOD_WEB_LINKS*4), // six living nutrient conduits
    sporeLandingBuffer = new Float32Array(32); // CPU-selected daughter UV; identical preview/export
  const maxSize = Math.min(
    gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    gl.getParameter(gl.MAX_TEXTURE_SIZE),
    4096,
  );
  return {
    maxSize,
    // WebGL1 has no fenceSync, so readiness cannot certify GPU completion.
    // Never advertise submission timing as a GPU benchmark on WebGL1.
    backend:gl2?"webgl2-fence":"webgl1-no-fence",
    // A failed optional shader is never silently presented as the complete
    // artwork. This describes what the preview actually omitted, so export
    // parity failures are visible before the user spends minutes encoding.
    fallbackNotice(state) {
      if(!state)return "";
      const missing=[];
      if(vcUnavailable && state.vcAmount>0)
        missing.push("Curlwave Witchcraft");
      if(kdUnavailable && state.kdAmount>0)
        missing.push("Kleinian Dither Cathedral");
      if(psUnavailable && state.psAmount>0)
        missing.push("Prismatic Scale Matrix");
      if(spxUnavailable && state.spxAmount>0)
        missing.push("Subpixel Moiré");
      if(g2Unavailable && state.g2Amount>0)
        missing.push("G2 Torsion Membranes");
      if(breedUnavailable && breedActive(state))
        missing.push("Crossbreed Lab");
      if(crochetUnavailable && state.hcrAmount>0)
        missing.push("Hyperbolic Crochet");
      if(velvetUnavailable && state.vldAmount>0)
        missing.push("Living Velvet");
      if(qdUnavailable && state.qdAmount>0)
        missing.push("Quasicrystal Dissolution");
      if(polesUnavailable && state.polesAmount>0)
        missing.push("Complex Poles");
      if(hexagramUnavailable && state.hexagramAmount>0)
        missing.push("Hexagram Terraces");
      if(schlierenUnavailable && state.schlierenAmount>0)
        missing.push("Schlieren Glass");
      if(injuryUnavailable && state.injuryAmount>0)
        missing.push("Print & Spectrum Injury");
      if(alchemyUnavailable && state.alchemyAmount>0)
        missing.push("Color Sorcery");
      return missing.join(", ");
    },
    readFrame(target) {
      if(exactEffects && gl.isContextLost())
        throw artworkParityError("GPU context lost during readback");
      if(exactEffects && gl.getError()!==gl.NO_ERROR)
        throw artworkParityError("GPU error before readback");
      gl.readPixels(
        0,0,canvas.width,canvas.height,
        gl.RGBA,gl.UNSIGNED_BYTE,target,
      );
      if(exactEffects && gl.getError()!==gl.NO_ERROR)
        throw artworkParityError("GPU could not read back the finished effects");
    },
    ready() {
      if (gl.isContextLost()) {
        if(exactEffects)throw artworkParityError("GPU context lost before capture");
        return false;
      }
      if (!fence) {
        if(exactEffects && gl.getError()!==gl.NO_ERROR)
          throw artworkParityError("GPU reported a failed frame draw");
        return true;
      }
      const status = gl.clientWaitSync(fence, 0, 0);
      if (status === gl.TIMEOUT_EXPIRED) return false;
      if(exactEffects && status===gl.WAIT_FAILED)
        throw artworkParityError("GPU frame fence failed");
      gl.deleteSync(fence);
      fence = null;
      if(exactEffects && gl.getError()!==gl.NO_ERROR)
        throw artworkParityError("GPU reported a failed completed frame");
      return true;
    },
    draw(s, timeline, width = canvas.width, height = canvas.height) {
      if (gl.isContextLost()) return false;
      width = Math.max(1, Math.round(width));
      height = Math.max(1, Math.round(height));
      if (width > maxSize || height > maxSize)
        throw Error(
          `This device supports exports up to ${maxSize}px per side.`,
        );
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      // Progressive shader fallback: the newest optional effects are disabled
      // one at a time if the driver cannot compile them. Legacy fields stay visible.
      let lastCompileError = null;
      // Keep the exact state used by the successfully compiled shader.
      // programFor() has its own withGene local; draw() cannot access it.
      let compiledState=s;
      for(let attempt=0;attempt<18;attempt++){
        const candidate=compatibleShaderState(s);
        try {
          active=programFor(candidate);
          compiledState=candidate;
          lastCompileError=null;
          break;
        }catch(e){
          lastCompileError=e;
          // Preview may downgrade gracefully; exported art must NEVER be downgraded.
          if(exactEffects)throw artworkParityError("Full-effect shader failed to compile",e);
          if(candidate.vcAmount>0 && !vcUnavailable){
            vcUnavailable=true;
            console.warn("Curlwave Witchcraft shader is too expensive for this GPU; preserving earlier art.",e);
          }else if(candidate.kdAmount>0 && !kdUnavailable){
            kdUnavailable=true;
            console.warn("Kleinian Dither Cathedral exceeds this GPU; preserving other shader layers.",e);
          }else if(candidate.psAmount>0 && !psUnavailable){
            psUnavailable=true;
            console.warn("Prismatic Scale Matrix exceeds this GPU; preserving all older art.",e);
          }else if(candidate.spxAmount>0 && !spxUnavailable){
            spxUnavailable=true;
            console.warn("Subpixel Moiré shader unavailable here; preserving all other art.",e);
          }else if(candidate.g2Amount>0 && !g2Unavailable){
            g2Unavailable=true;
            console.warn("G2-inspired torsion membrane exceeds this GPU; preserving every older effect.",e);
          }else if(breedActive(candidate) && !breedUnavailable){
            breedUnavailable=true;
            console.warn("Crossbreed Lab exceeded this graphics driver; keeping parent art and color intact.",e);
          }else if(candidate.hcrAmount>0 && !crochetUnavailable){
            crochetUnavailable=true;
            console.warn("Hyperbolic Crochet was too expensive for this graphics driver; keeping other art visible.",e);
          }else if(candidate.vldAmount>0 && !velvetUnavailable){
            velvetUnavailable=true;
            console.warn("Living Velvet Damask could not compile on this GPU; keeping other art visible.",e);
          }else if(candidate.qdAmount>0 && !qdUnavailable){
            qdUnavailable=true;
            console.warn("Order → Dissolution Quasicrystal exceeded this GPU; preserving the previous artwork and effects.",e);
          }else if(candidate.polesAmount>0 && !polesUnavailable){
            polesUnavailable=true;
            console.warn("Complex Poles & Zeros exceeded this GPU; showing existing geometry without the optional warp.",e);
          }else if(candidate.hexagramAmount>0 && !hexagramUnavailable){
            hexagramUnavailable=true;
            console.warn("Hexagram Terraces exceeded this GPU; keeping the previous artwork and effects.",e);
          }else if(candidate.injuryAmount>0 && !injuryUnavailable){
            injuryUnavailable=true;
            console.warn("Print & Spectrum Injury unsupported by this GPU; keeping every earlier layer and Color Sorcery.",e);
          }else if(candidate.alchemyAmount>0 && !alchemyUnavailable){
            alchemyUnavailable=true;
            console.warn("Color Sorcery exceeded this GPU; preserving the original artwork and every other layer.",e);
          }else if(foodWebActive(candidate)&&!foodWebUnavailable){
            foodWebUnavailable=true;
            console.warn("Food web filaments exceed this GPU; preserving painted colonies, soil and other effects.",e);
          }else if(successionEnabled(candidate)&&!successionUnavailable){
            successionUnavailable=true;
            console.warn("Succession strata too costly for this GPU; preserving mineral substrate and colonies.",e);
          }else if(fossilEnabled(candidate)&&!fossilUnavailable){
            fossilUnavailable=true;
            console.warn("Historical fossil material too expensive for this GPU; preserving living colonies and baseline mineral art.",e);
          }else if((candidate.atmoAmount>0||candidate.atmoBAmount>0) &&
            (candidate.atmoMaskMode!=="Everywhere"||candidate.atmoBMaskMode!=="Everywhere") &&
            !habitatUnavailable){
            habitatUnavailable=true;
            console.warn("Atmospheric habitat mask too expensive for this GPU; preserving both full-canvas parents.",e);
          }else if(candidate.atmoBAmount>0){
            atmosphereBUnavailable=true;
            console.warn("Second atmosphere shader unsupported by this GPU; keeping primary atmosphere and art.",e);
          }else if(candidate.atmoAmount>0){
            atmosphereUnavailable=true;
            console.warn("Mutant Atmosphere unsupported by this GPU; protecting the original artwork.",e);
          }else if(candidate.underlayAmount>0){
            underlayUnavailable=true;
            console.warn("Living textile underlay unsupported by this GPU; preserving the original artwork and filaments.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentNeuralAmount>0 &&
            candidate.filamentScarAmount>0 && candidate.filamentRegenAmount>0 &&
            candidate.filamentRegenMode!=="Off" && !filamentRegenUnavailable){
            filamentRegenUnavailable=true;
            console.warn("Optional daughter-thread geometry exceeded this preview GPU; preserving the existing scarred weave.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentNeuralAmount>0 &&
            candidate.filamentScarAmount>0 && candidate.filamentScarMode!=="Off" &&
            !filamentScarUnavailable){
            filamentScarUnavailable=true;
            console.warn("Optional Ghost Scars exceeded this preview GPU; keeping the original Neural Loom and fabric intact.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentNeuralAmount>0 &&
            candidate.filamentPlasticAmount>0 && candidate.filamentPlasticMode!=="Off" &&
            !filamentPlasticUnavailable){
            filamentPlasticUnavailable=true;
            console.warn("Optional Synaptic Plasticity exceeds preview GPU budget; keeping the original nervous system and fabric.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentNeuralAmount>0 &&
            candidate.filamentNeuralMode!=="Off" && !filamentNeuralUnavailable){
            filamentNeuralUnavailable=true;
            console.warn("Neural Loom exceeded this preview GPU's shader budget; keeping original fabric and all other effects.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentMorphAmount>0 &&
            candidate.filamentContagionAmount>0 && candidate.filamentContagionMode!=="Off" &&
            !filamentContagionUnavailable){
            filamentContagionUnavailable=true;
            console.warn("Thread transmission over budget: keeping base material transformations intact.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentMorphAmount>0 &&
            candidate.filamentMorphMode!=="Off" && !filamentMorphUnavailable){
            filamentMorphUnavailable=true;
            console.warn("Living thread material metamorphosis unsupported by this GPU; keeping the original dressed fibers.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentAdornmentAmount>0 && !filamentAdornmentUnavailable){
            filamentAdornmentUnavailable=true;
            console.warn("Thread jewelry exceeded this GPU; keeping dressed and animated bare threads.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentSculptAmount>0){
            filamentSculptUnavailable=true;
            console.warn("Sculpted thread shading unsupported; preserving woven geometry, materials and stitching.",e);
          }else if(hasSemanticLettering(candidate) && !semanticGravityUnavailable){
            semanticGravityUnavailable=true;
            console.warn("Semantic Gravity exceeded this preview GPU; preserving other fibers.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentStitchAmount>0){
            filamentStitchUnavailable=true;
            console.warn("Animated stitches unsupported by this GPU; keeping the lace and materials.",e);
          }else if(candidate.filamentAmount>0 &&
            (candidate.filamentMaterial!=="Original thread" ||
             candidate.filamentCrossbreed>0 && candidate.filamentSecondMaterial!=="Original thread" ||
             candidate.filamentNap>0 || candidate.filamentBeads>0)){
            filamentMaterialUnavailable=true;
            console.warn("Detailed fiber shader unsupported; retaining classic filament geometry.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentCrossbreed>0){
            filamentHybridUnavailable=true;
            console.warn("Filament hybrid too demanding for this GPU; retaining the primary threads.",e);
          }else if(candidate.filamentAmount>0){
            filamentUnavailable=true;
            console.warn("Filament Forge unsupported by this GPU; original artwork remains intact.",e);
          }else if(candidate.photonAmount>0){
            photonUnavailable=true;
            console.warn("Photon Zoo shader unsupported by this GPU; protecting the original artwork.",e);
          }else if(candidate.wiggleAmount>0){
            wiggleUnavailable=true;
            console.warn("Wiggle stereoscopy unsupported; preserving the original artwork.",e);
          }else if(candidate.letteringAmount>0 && candidate.lettering.trim()){
            typeShaderUnavailable=true;
            console.warn("Kinetic lettering shader unavailable, preserving original art.",e);
          }else if(candidate.substanceAmount>0){
            substanceUnavailable=true;
            console.warn("Sample-vault substance shader unsupported; preserving the original artwork.",e);
          }else if(candidate.microAmount>0){
            microUnavailable=true;
            console.warn("Living microtexture unsupported; continuing with the original artwork.",e);
          }else if(candidate.backdropAmount>0){
            backdropUnavailable=true;
            console.warn("Living backdrop unsupported; keeping the original artwork.",e);
          }else if(candidate.compositionAmount>0 && candidate.blend>0){
            compositionUnavailable=true;
            console.warn("Spatial composition unsupported; using the original full-canvas blend.",e);
          }else if(candidate.filmAmount>0 || candidate.opalAmount>0 ||
            candidate.prismAmount>0 || candidate.foilRelief>0){
            materialUnavailable=true;
            console.warn("Prismatic material shader unavailable, preserving original art.",e);
          }else if((candidate.engine>=17 && candidate.engine<=19) ||
            (candidate.blend>0 && candidate.secondaryEngine>=17 && candidate.secondaryEngine<=19)){
            strangeUnavailable=true;
            console.warn("Shader-vault mathematical mutant unsupported by this GPU; showing safe original engine.",e);
          }else if(candidate.engine===16 ||
             (candidate.blend>0 && candidate.secondaryEngine===16) ||
             candidate.stereoAmount>0){
            stereoUnavailable=true;
            console.warn("3D shader unsupported on this device: showing 2D fallback, no artwork lost.",e);
          }else{ throw e; }
        }
      }
      if(lastCompileError)throw lastCompileError;
      const hasBiology = updateBiology(s, timeline);
      // Visible words composite outside WebGL. Only Semantic Gravity
      // opt-in uploads their glyph mask to the geometric thread shader.
      const hasLettering = false;
      const hasMemoryEffects = (s.afterimage > 0 || s.datamosh > 0) && !memoryDisabled;
      let drawWithMemory = false;
      let drawWithSchlieren = s.schlierenAmount>0 && !schlierenUnavailable;
      if (hasMemoryEffects) {
        try {
          prepareMemory(width, height);
          const identity = [s.seed, s.engine, s.secondaryEngine, s.ratio, s.colors.join(":")].join("/");
          if (memoryIdentity !== identity ||
              timeline.time < lastMemoryTime - .0001 ||
              timeline.colorTime < lastMemoryColorTime - .0001) memory.valid = false;
          memoryIdentity = identity;
          drawWithMemory = true;
        } catch (e) {
          // A device with inadequate texture/FBO support must retain the original artwork.
          memoryDisabled = true;
          releaseMemory();
          if(exactEffects)throw artworkParityError("Frame-memory effects could not initialize",e);
          console.warn("Frame-memory effects disabled; using original art renderer.", e);
        }
      } else if (memory) {
        memory.valid = false;
      }
      // If feedback exists, it already owns a full-effects texture.
      // Otherwise a single extra RGBA8 texture captures the main scene.
      if(drawWithSchlieren && !drawWithMemory){
        try{glassPass().prepareBuffer(width,height);}
        catch(error){
          if(exactEffects)throw artworkParityError(
            "Schlieren source texture failed to initialize",error);
          schlierenUnavailable=true;
          drawWithSchlieren=false;
          console.warn("Schlieren unavailable; keeping original artwork.",error);
        }
      }
      if((!drawWithSchlieren || drawWithMemory) && schlieren)
        schlieren.releaseBuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER,drawWithMemory ? memory.fbo :
        drawWithSchlieren ? glassPass().prepareBuffer(width,height).framebuffer : null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(active.program);
      gl.uniform2f(loc("res"), width, height);
      if(hasSemanticLettering(compiledState)){
        try{
          uploadSemanticGlyph(compiledState,timeline,width,height);
          gl.uniform1i(loc("semanticGlyphTex"),6);
        }catch(error){
          if(exactEffects)throw artworkParityError(
            "Text-to-thread glyph mask could not be uploaded",error);
          semanticGravityUnavailable=true;
          console.warn("Semantic lettering mask failed; preview will retry without it.",error);
          return false;
        }
      }
      gl.uniform1i(loc("breedMode"),
        Math.max(0,breedModes.indexOf(compiledState.breedMode)));
      gl.uniform1i(loc("velvetMode"),
        Math.max(0,velvetModes.indexOf(compiledState.velvetMode)));
      gl.uniform1i(loc("crochetMode"),
        Math.max(0,crochetModes.indexOf(compiledState.crochetMode)));
      gl.uniform1i(loc("qdMode"),
        Math.max(0,qdModes.indexOf(compiledState.qdMode)));
      gl.uniform1i(loc("qdOrder"),
        5+2*Math.max(0,qdOrders.indexOf(compiledState.qdOrder)));
      gl.uniform1i(loc("polesMode"),
        Math.max(0,polesModes.indexOf(compiledState.polesMode)));
      gl.uniform1i(loc("semanticGravityMode"),
        Math.max(0,semanticGravityModes.indexOf(compiledState.semanticGravityMode)));
      gl.uniform1f(loc("time"), timeline.time);
      gl.uniform1f(loc("colorTime"), timeline.colorTime);
      gl.uniform1f(loc("seed"), s.seed % 1000000);
      gl.uniform1f(loc("seedHigh"), Math.floor(s.seed / 1000000));
      for (const k of [
        "complexity",
        "scale",
        "warp",
        "split",
        "scan",
        "grain",
        "glitch",
        "blend",
        "block",
        "pixel",
        "vignette",
        "phosphor",
        "dither",
        "riso",
        "windowCascade",
        "glitter",
        "broadcast",
        "topperIsland","topperIslandDensity","topperIslandScale","topperIslandMotion","topperIslandForm","topperIslandMapping","topperIslandHue","topperIslandFeather",
        "topperVoronoi","topperVoronoiDensity","topperVoronoiScale","topperVoronoiMotion","topperVoronoiGap","topperVoronoiTexture","topperVoronoiHue","topperVoronoiBlend",
        "topperTape","topperTapeDensity","topperTapeScale","topperTapeMotion","topperTapeWidth","topperTapeDispersion","topperTapeHue","topperTapePalette",
        "topperJewel","topperJewelDensity","topperJewelScale","topperJewelMotion","topperJewelDetail","topperJewelHue","topperJewelForm","topperJewelBlend",
        "topperShrapnel","topperDensity","topperScale","topperMotion","topperHue","topperShape","topperBlend",
        "misregister",
        "saturation",
        "contrast",
        "brightness",
        "colorOffset",
        "colorRepeat",
        "colorAmount",
        "hyperbolicFold",
        "fractalZoom",
        "juliaMix",
        "quasiDensity",
        "hexagramAmount","hexagramScale","hexagramWarp","hexagramMotion",
        "hexagramRelief","hexagramBorder","hexagramHue","hexagramCoupling",
        "hexagramVariation","hexagramThreshold",
        "polesAmount","polesScale","polesWarp","polesOrbit","polesMotion",
        "polesSoftness","polesZeroPull","polesFiligree","polesGlow",
        "polesHue","polesVariation",
        "qdAmount","qdDissolve","qdAuto","qdRate","qdDensity","qdTear",
        "qdPixel","qdWarp","qdFiligree","qdHue","qdVariation","qdEdge",
        "vldAmount","vldScale","vldGrowth","vldRelief","vldNap",
        "vldGloss","vldHue","vldVariation","vldDensity",
        "hcrAmount","hcrScale","hcrRuffles","hcrDepth","hcrLace",
        "hcrMotion","hcrYarn","hcrIridescence","hcrQuality","hcrHue",
        "breedAmount","breedCoupling","breedWarp","breedFiligree","breedGlow",
        "breedMotion","breedHue","breedTension","breedVariation","breedResonance",
        "g2Amount","g2Scale","g2Warp","g2Motion","g2Torsion","g2Fracture",
        "g2Veins","g2Sheen","g2Hue","g2Variation","g2Dispersion",
        "spxAmount","spxDensity","spxMismatch","spxAngle","spxDrift",
        "spxCurvature","spxFlicker","spxCross","spxRelief","spxHue",
        "spxBleed","spxVariation",
        "psAmount","psScale","psOverlap","psLift","psMotion","psFilm",
        "psDiffraction","psHue","psWarp","psVariation","psSheen",
        "psEdge","psDomain",
        "kdAmount","kdScale","kdLayers","kdInversion","kdSpin",
        "kdParallax","kdDither","kdChroma","kdHue","kdInk",
        "kdGlow","kdWarp","kdVariation",
        "vcAmount","vcScale","vcSpeed","vcAdvection","vcCrest",
        "vcFilm","vcDust","vcGlow","vcHue","vcDepth",
        "vcTurbulence","vcVariation","vcStrands",
        "motionAmount",
        "motionRate",
        "lightMotion",
        "bioAmount",
        "bioVeins",
        "wiggleAmount", "wiggleDepth", "wiggleSpeed", "wiggleLayers",
        "stereoAmount",
        "stereoDepth",
        "stereoParallax",
        "stereoMorph",
        "stereoGlow",
        "stereoWiggle",
        "stereoQuality",
        "filmAmount", "filmThickness", "opalAmount", "prismAmount",
        "foilRelief", "foilMotion",
        "alchemyAmount","alchemyScale","alchemyMotion","alchemySeparation",
        "alchemySoftness","alchemyWhite","alchemyVariation",
        "injuryAmount","injuryScale","injuryMotion","injurySeparation",
        "injuryGrain","injuryGlow","injuryVariation", "letteringAmount", "letteringScale",
        "letteringWarp", "letteringMotion",
        "compositionAmount","compositionScale","compositionFeather",
        "compositionMotion","compositionColorShift","compositionVariation",
        "backdropAmount","backdropDepth","backdropDensity","backdropMotion",
        "backdropGlow","backdropHue","backdropVariation",
        "microAmount","microScale","microMotion","microRelief",
        "microDensity","microHue","microVariation",
        "filamentAmount","filamentScale","filamentMotion","filamentDensity",
        "filamentWidth","filamentRelief","filamentHue","filamentVariation",
        "filamentFeralCorruption","filamentFeralMigration","filamentFeralOrder",
        "filamentFeralKnots","filamentFeralMutation",
        "filamentQuasiSpacing","filamentQuasiPhason","filamentQuasiDrift",
        "filamentQuasiRelief","filamentQuasiElevation","filamentQuasiOrnament",
        "semanticGravityAmount","semanticGravityRadius","semanticGravityFalloff",
        "semanticGravitySwirl","semanticGravityPulse","semanticGravityVariation",
        "filamentCrossbreed","filamentInterlace","filamentTwist","filamentPhase",
        "filamentNap","filamentLuster","filamentBeads","filamentBeadSize","filamentSecondHue","filamentConstructionAmount","filamentConstructionPitch","filamentConstructionGap","filamentConstructionMotion","filamentConstructionRelief","filamentMicroloomAmount","filamentMicroloomScale","filamentMicroloomDepth","filamentMicroloomOpenwork","filamentMicroloomMotion","filamentMicroloomColor","filamentPhysicsAmount","filamentPhysicsScale","filamentPhysicsReach","filamentPhysicsSpeed","filamentPhysicsRepair","filamentPhysicsGlow","filamentChromaAmount","filamentChromaScale","filamentChromaSpread","filamentChromaSpeed","filamentChromaContrast","filamentChromaExchange","filamentEcologyAmount","filamentEcologyScale","filamentEcologyCoverage","filamentEcologySpeed","filamentEcologyRelief","filamentEcologyHue","filamentArchitectureAmount","filamentArchitectureScale","filamentArchitectureReach","filamentArchitectureOpenwork","filamentArchitectureSpeed","filamentArchitectureHue","filamentDimAmount","filamentDimProgress","filamentDimSpeed","filamentDimWarp","filamentDimFusion","filamentMetaAmount","filamentMetaFrequency","filamentMetaThickness","filamentMetaDispersion","filamentMetaMotion","filamentMetaPolish","filamentEngraveAmount","filamentEngraveScale","filamentEngraveDepth","filamentEngraveWidth","filamentEngraveMotion","filamentEngraveHue","filamentAlchAmount","filamentAlchProgress","filamentAlchSpeed","filamentAlchScale","filamentAlchGlow",
        "filamentOpticsAmount","filamentOpticsThickness","filamentOpticsDispersion",
        "filamentOpticsAnisotropy","filamentOpticsCurvature","filamentOpticsPearl","filamentOpticsPhase",
        "filamentSecondOpticsAmount","filamentSecondOpticsThickness","filamentSecondOpticsDispersion",
        "filamentSecondOpticsAnisotropy","filamentSecondOpticsCurvature",
        "filamentSecondOpticsPearl","filamentSecondOpticsPhase",
        "filamentStitchAmount","filamentStitchSpeed",
        "filamentStitchLength","filamentStitchGlow",
        "filamentChladniOrder","filamentChladniResonance","filamentChladniDensity",
        "filamentChladniPhase","filamentChladniDetune",
        "filamentRetroLead","filamentRetroEcho","filamentRetroParadox",
        "filamentRetroKnots","filamentRetroReversal","filamentRetroCoherence",
        "filamentAdornmentAmount","filamentAdornmentSpacing","filamentAdornmentSize",
        "filamentAdornmentMotion","filamentAdornmentGlow","filamentAdornmentPopulation","filamentAdornmentRhythm","filamentAdornmentFinishAmount","filamentAdornmentFilm","filamentAdornmentFacet","filamentAdornmentPolish","filamentAdornmentInteriorAmount","filamentAdornmentInteriorDensity","filamentAdornmentInteriorOpenwork","filamentAdornmentInteriorDrift","filamentAdornmentDiversity","filamentAdornmentSizeVariance","filamentAdornmentFinishVariance","filamentAdornmentAnatomyVariance",
        "filamentMorphAmount","filamentMorphScale","filamentMorphSpeed",
        "filamentMorphSharpness","filamentMorphGlow",
        "filamentContagionAmount","filamentContagionReach","filamentContagionSpeed",
        "filamentContagionLag","filamentContagionGlow",
        "filamentNeuralAmount","filamentNeuralSpeed","filamentNeuralCoupling",
        "filamentNeuralThreshold","filamentNeuralGlow",
        "filamentPlasticAmount","filamentPlasticRate","filamentPlasticInhibition",
        "filamentPlasticRetention","filamentPlasticGlow",
        "filamentScarAmount","filamentScarDensity","filamentScarPersistence",
        "filamentScarRoughness","filamentScarGlow",
        "filamentRegenAmount","filamentRegenBranches","filamentRegenSpeed",
        "filamentRegenHealing","filamentRegenGlow",
        "filamentSculptAmount","filamentSculptDepth","filamentSculptLight",
        "filamentSculptShadow","filamentSculptPuff",
        "underlayAmount","underlayScale","underlayDensity","underlayMotion",
        "underlayRelief","underlayHue","underlayContrast","underlayVariation",
        "photonAmount","photonScale","photonMotion","photonDensity",
        "photonRelief","photonHue","photonVariation",
        "substanceAmount","substanceScale","substanceMotion",
        "substanceRelief","substanceEdge","substanceHue","substanceVariation",
        "atmoAmount","atmoScale","atmoDensity","atmoMotion",
        "atmoGlow","atmoHue","atmoVariation",
        "atmoBAmount","atmoBScale","atmoBDensity","atmoBMotion",
        "atmoBGlow","atmoBHue","atmoBVariation",
        "atmoMaskScale","atmoMaskFeather","atmoMaskMotion","atmoMaskVariation",
        "colonyLifeAmount","colonyLifeSpeed","colonyFrontGlow","colonyCompetition",
        "colonyAnatomyAmount","colonyAnatomyDetail","colonyAnatomyMotion",
        "colonyAnatomyPores","colonyAnatomyRim","colonyPoreDensity","colonyPoreSize",
        "colonyCortexAmount","colonyCortexDetail",
        "colonyCortexMotion","colonyCortexRelief",
        "sporeAmount","sporeSpeed","sporeReach","sporeFertility","sporeGlow",
        "substrateAmount","substrateScale","substrateMotion","substratePressure",
        "substrateAffinityA","substrateAffinityB","substrateGlow","substrateHue",
        "symbiosisAmount","symbiosisDetail","symbiosisMotion",
        "symbiosisGlow","symbiosisDominance",
        "geneAmount","geneGlow",
        "selectionPressure","selectionGlow",
        "apocalypseAmount","apocalypseScale","apocalypseMotion",
        "apocalypsePressure","apocalypseGlow","apocalypseHue",
        "fossilAmount","fossilDepth","fossilMotion",
        "fossilGlow","fossilHue",
        "successionAmount","successionDepth","successionSpread",
        "successionMotion","successionGlow","successionHue",
        "foodWebAmount","foodWebPulse","foodWebWidth","foodWebGlow","foodWebHue",
        "tunnelTwist","tunnelDepth","tunnelRidges","tunnelPulse",
        "tunnelAperture","tunnelVariation",
      ])
        gl.uniform1f(loc(k), s[k] / 100);
      gl.uniform1f(loc("alchemyPalette"), s.alchemyPalette ? 1 : 0);
      gl.uniform1f(loc("injuryPalette"), s.injuryPalette ? 1 : 0);
      gl.uniform1f(loc("rotation"), (s.rotation * Math.PI) / 180);
      gl.uniform1f(loc("symmetry"), s.symmetry);
      for (const k of ["bloom", "posterize", "mirror", "invert"])
        gl.uniform1i(loc(k), s[k] ? 1 : 0);
      gl.uniform1i(
        loc("blendMode"),
        ["Mix", "Multiply", "Difference"].indexOf(s.blendMode),
      );
      gl.uniform1i(
        loc("colorMode"),
        ["Traveling wave", "Color canon", "Phase vortex"].indexOf(s.colorMode),
      );
      gl.uniform1i(loc("colorCount"), s.colors.length);
      // No framebuffer readbacks and no per-frame allocations. The same
      // normalized stamp geometry is used by preview and export renders.
      const geneMarkersEnabled=geneEnabled(compiledState);
      const planted=s.habitatStamps||[];
      const plantedCount=Math.min(16,planted.length);
      habitatBuffer.fill(0);
      for(let i=0;i<plantedCount;i++){
        const m=planted[i],j=i*4;
        habitatBuffer[j]=m.x;
        habitatBuffer[j+1]=m.y;
        habitatBuffer[j+2]=m.radius;
        habitatBuffer[j+3]=packGeneMarker(m,geneMarkersEnabled);
      }
      gl.uniform1i(loc("colonyLifeMode"),colonyLifeModes.indexOf(s.colonyLifeMode));
      gl.uniform1i(loc("colonyShapeA"),colonyAnatomyModes.indexOf(s.colonyShapeA));
      gl.uniform1i(loc("colonyShapeB"),colonyAnatomyModes.indexOf(s.colonyShapeB));
      gl.uniform1i(loc("colonyPoreMode"),Math.max(0,colonyPoreModes.indexOf(s.colonyPoreMode)));
      gl.uniform1i(loc("colonyCortexA"),colonyCortexModes.indexOf(s.colonyCortexA));
      gl.uniform1i(loc("colonyCortexB"),colonyCortexModes.indexOf(s.colonyCortexB));
      gl.uniform1i(loc("sporeMode"),sporeModes.indexOf(s.sporeMode));
      gl.uniform1i(loc("g2Mode"),g2Modes.indexOf(s.g2Mode));
      gl.uniform1i(loc("spxMode"),spxModes.indexOf(s.spxMode));
      gl.uniform1i(loc("psMode"),psModes.indexOf(s.psMode));
      gl.uniform1i(loc("kdMode"),kdModes.indexOf(s.kdMode));
      gl.uniform1i(loc("vcMode"),vcModes.indexOf(s.vcMode));
      gl.uniform1i(loc("substrateMode"),substrateModes.indexOf(s.substrateMode));
      gl.uniform1i(loc("symbiosisMode"),symbiosisModes.indexOf(s.symbiosisMode));
      gl.uniform1i(loc("selectionMode"),selectionModes.indexOf(s.selectionMode));
      gl.uniform1i(loc("apocalypseMode"),apocalypseModes.indexOf(s.apocalypseMode));
      gl.uniform1f(loc("apocalypseEpoch"),s.apocalypseEpoch);
      gl.uniform1f(loc("successionEpoch"),s.successionEpoch);
      if(foodWebActive(compiledState)){
        const connections=foodWebLinks(compiledState);
        const count=Math.min(MAX_FOOD_WEB_LINKS,connections.length);
        foodWebBuffer.fill(0);
        for(let i=0;i<count;i++){
          const pair=connections[i],j=i*4;
          const a=compiledState.habitatStamps[pair.i];
          const b=compiledState.habitatStamps[pair.j];
          foodWebBuffer[j]=a.x;foodWebBuffer[j+1]=a.y;
          foodWebBuffer[j+2]=b.x;foodWebBuffer[j+3]=b.y;
        }
        gl.uniform1i(loc("foodWebCount"),count);
        gl.uniform1i(loc("foodWebMode"),foodWebModes.indexOf(s.foodWebMode));
        gl.uniform4fv(loc("foodWebPairs[0]"),foodWebBuffer);
      }
      if(fossilEnabled(compiledState)){
        const relics=compiledState.fossilRecords||[];
        const count=Math.min(MAX_FOSSILS,relics.length);
        fossilBuffer.fill(0);
        for(let i=0;i<count;i++){
          const m=relics[i],j=i*4;
          fossilBuffer[j]=m.x;
          fossilBuffer[j+1]=m.y;
          fossilBuffer[j+2]=m.radius;
          fossilBuffer[j+3]=packedFossil(m);
        }
        gl.uniform1i(loc("fossilCount"),count);
        gl.uniform1i(loc("fossilMode"),[
          "Dormant","Ancestral compost","Toxic reliquary",
          "Opal reliquary","Ghost mycelium","Stratigraphic mirror"
        ].indexOf(s.fossilMode));
        gl.uniform1f(loc("fossilEpoch"),s.apocalypseEpoch);
        gl.uniform4fv(loc("fossilStamps[0]"),fossilBuffer);
      }
      if(successionEnabled(compiledState)){
        const traces=compiledState.successionRecords||[];
        const count=Math.min(MAX_SUCCESSION,traces.length);
        successionBuffer.fill(0);
        for(let i=0;i<count;i++){
          const mark=traces[i],j=i*4;
          successionBuffer[j]=mark.x;
          successionBuffer[j+1]=mark.y;
          successionBuffer[j+2]=mark.radius;
          successionBuffer[j+3]=packedSuccession(mark);
        }
        gl.uniform1i(loc("successionCount"),count);
        gl.uniform4fv(loc("successionStamps[0]"),successionBuffer);
      }
      gl.uniform1f(loc("sporeGeneration"),s.sporeGeneration);
      gl.uniform1i(loc("habitatStampCount"),plantedCount);
      gl.uniform4fv(loc("habitatStamps[0]"),habitatBuffer);
      if(s.sporeAmount>0&&s.sporeMode!=="Dormant"){
        sporeLandingBuffer.fill(0);
        for(let i=0;i<plantedCount;i++){
          // CPU evolution uses the saved ecology, not a device-dependent
          // graphical fallback. Preview and persisted offspring must agree.
          const landing=daughterSite(s,i);
          if(!landing)continue;
          sporeLandingBuffer[i*2]=landing.x;
          sporeLandingBuffer[i*2+1]=landing.y;
        }
        gl.uniform2fv(loc("daughterLandings[0]"),sporeLandingBuffer);
      }
      gl.uniform1i(loc("tunnelMode"), [
        "Infinite spiral","Conch cathedral","Braided wormhole",
        "Moiré throat","Living iris","Liquid vortex"
      ].indexOf(s.tunnelMode));
      gl.uniform1i(loc("microMode"), microModes.indexOf(s.microMode));
      gl.uniform1i(loc("photonSpecies"), photonSpecies.indexOf(s.photonSpecies));
      gl.uniform1i(loc("filamentSpecies"), filamentSpecies.indexOf(s.filamentSpecies));
      gl.uniform1i(loc("filamentSecondSpecies"), filamentSpecies.indexOf(s.filamentSecondSpecies));
      gl.uniform1i(loc("filamentMaterial"), filamentMaterials.indexOf(s.filamentMaterial));
      gl.uniform1i(loc("filamentSecondMaterial"), filamentMaterials.indexOf(s.filamentSecondMaterial));
      gl.uniform1i(loc("filamentStitchMode"), filamentStitchModes.indexOf(s.filamentStitchMode));
      gl.uniform1i(loc("filamentAdornmentMode"), filamentAdornmentModes.indexOf(s.filamentAdornmentMode));
      gl.uniform1i(loc("filamentSecondAdornmentMode"), filamentAdornmentModes.indexOf(s.filamentSecondAdornmentMode));
      gl.uniform1i(loc("filamentAdornmentPlacement"),Math.max(0,jewelryPlacementModes.indexOf(s.filamentAdornmentPlacement)));
      gl.uniform1i(loc("filamentAdornmentKinetics"),Math.max(0,jewelryKineticModes.indexOf(s.filamentAdornmentKinetics)));
      gl.uniform1i(loc("filamentAdornmentFinish"),Math.max(0,jewelryFinishModes.indexOf(s.filamentAdornmentFinish)));
      gl.uniform1i(loc("filamentAdornmentInterior"),Math.max(0,jewelryInteriorModes.indexOf(s.filamentAdornmentInterior)));
      gl.uniform1i(loc("filamentAdornmentColony"),Math.max(0,jewelryColonyModes.indexOf(s.filamentAdornmentColony)));
      gl.uniform1i(loc("filamentMorphMode"), filamentMorphModes.indexOf(s.filamentMorphMode));
      gl.uniform1i(loc("filamentContagionMode"), filamentContagionModes.indexOf(s.filamentContagionMode));
      gl.uniform1i(loc("filamentNeuralMode"), filamentNeuralModes.indexOf(s.filamentNeuralMode));
      gl.uniform1i(loc("filamentPlasticMode"), filamentPlasticModes.indexOf(s.filamentPlasticMode));
      gl.uniform1i(loc("filamentScarMode"), filamentScarModes.indexOf(s.filamentScarMode));
      gl.uniform1i(loc("filamentRegenMode"), filamentRegenModes.indexOf(s.filamentRegenMode));
      gl.uniform1i(loc("filamentMorphTarget"), filamentMaterials.indexOf(s.filamentMorphTarget));
      gl.uniform1i(loc("filamentSecondMorphTarget"), filamentMaterials.indexOf(s.filamentSecondMorphTarget));
      gl.uniform1i(loc("filamentSculptMode"), filamentSculptModes.indexOf(s.filamentSculptMode));
      gl.uniform1i(loc("underlayMode"), underlayModes.indexOf(s.underlayMode));
      gl.uniform1i(loc("substanceMode"), substanceModes.indexOf(s.substanceMode));
      gl.uniform1i(loc("backdropMode"), backdropModes.indexOf(s.backdropMode));
      gl.uniform1i(loc("compositionMode"), [
        "Iris portals","Braided ribbons","Cell colonies","Patchwork",
        "Orbital archipelagos","Woven windows"].indexOf(s.compositionMode));
      gl.uniform1f(loc("letteringX"),s.letteringX/100);
      gl.uniform1f(loc("letteringY"),s.letteringY/100);
      gl.uniform1f(loc("letteringRotation"),s.letteringRotation);
      gl.uniform1f(loc("letteringStretchX"),s.letteringStretchX/100);
      gl.uniform1f(loc("letteringStretchY"),s.letteringStretchY/100);
      gl.uniform1f(loc("letteringCurve"),s.letteringCurve/100);
      gl.uniform1i(loc("letteringStyle"), ["Neon bling","RGB split","Chrome foil","Void stencil","Custom ink","Holographic","Electric glow","Liquid candy","Ghost echo","Chromatic shimmer","Heatwave","Glitter ink","Prism pulse","Soft shadow"].indexOf(s.letteringStyle));
      gl.uniform1i(loc("letteringAvailable"), hasLettering ? 1 : 0);
      gl.uniform1i(loc("letteringTex"), 3);
      // Additional lettering layers are also composited outside WebGL.
      const extras=s.letteringLayers||[];
      gl.uniform1i(loc("letteringExtraCount"),extras.length);
      for(let i=0;i<2;i++){
        const layer=extras[i];
        const available=!!(layer&&layer.visible&&layer.text.trim()&&extraTypeTextures[i]&&extraTypeKeys[i]);
        gl.uniform1f(loc("letteringExtraVisible["+i+"]"),available?1:0);
        gl.uniform4f(loc("letteringExtraTransform["+i+"]"),
          (layer?.letteringX??50)/100,(layer?.letteringY??50)/100,
          layer?.letteringRotation??0,(layer?.letteringScale??48)/100);
        gl.uniform4f(loc("letteringExtraShape["+i+"]"),
          (layer?.letteringStretchX??100)/100,(layer?.letteringStretchY??100)/100,
          (layer?.letteringCurve??0)/100,(layer?.letteringAmount??0)/100);
        gl.uniform2f(loc("letteringExtraFX["+i+"]"),
          (layer?.letteringWarp??0)/100,(layer?.letteringMotion??0)/100);
        gl.uniform1i(loc("letteringExtraStyle["+i+"]"),
          ["Neon bling","RGB split","Chrome foil","Void stencil","Custom ink",
           "Holographic","Electric glow","Liquid candy","Ghost echo",
           "Chromatic shimmer","Heatwave","Glitter ink","Prism pulse","Soft shadow"].indexOf(layer?.letteringStyle));
        gl.activeTexture(gl.TEXTURE4+i);
        gl.bindTexture(gl.TEXTURE_2D,extraTypeTextures[i]);
        gl.uniform1i(loc(i===0?"letteringTexExtra0":"letteringTexExtra1"),4+i);
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(loc("wiggleMode"), ["Flipbook", "Smooth orbit", "Hold left", "Hold right"].indexOf(s.wiggleMode));
      gl.uniform1i(loc("stereoShape"), ["Gyroid Cathedral", "Metaball Choir", "Opal Knot",
        "Crystal Lattice", "Ribbon Wormhole"].indexOf(s.stereoShape));
      gl.uniform1i(loc("motionMode"), ["Liquid flow", "Breathing", "Orbital", "Traveling waves", "Internal turbulence"].indexOf(s.motionMode));
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, hasBiology ? biologyTexture : emptyBioTexture);
      gl.uniform1i(loc("bioTex"), 2);
      gl.uniform1i(loc("bioAvailable"), hasBiology ? 1 : 0);
      gl.activeTexture(gl.TEXTURE0);
      const key = s.colors.join("");
      if (key !== active.paletteKey) {
        active.paletteKey = key;
        for (let i = 0; i < 12; i++)
          for (let j = 0; j < 3; j++)
            colorBuffer[i * 3 + j] =
              parseInt(
                s.colors[i % s.colors.length].slice(1 + j * 2, 3 + j * 2),
                16,
              ) / 255;
        gl.uniform3fv(loc("colors[0]"), colorBuffer);
      }
      marksBuffer.fill(0);
      shapeBuffer.fill(0);
      s.marks.forEach((m, i) => {
        marksBuffer.set([m.x, m.y, m.power, m.mode], i * 4);
        shapeBuffer.set([m.radius, m.angle], i * 2);
      });
      gl.uniform4fv(loc("marks[0]"), marksBuffer);
      gl.uniform2fv(loc("markShape[0]"), shapeBuffer);
      gl.uniform1i(loc("count"), s.marks.length);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (drawWithMemory) {
        try {
          // Diagnose an offscreen *scene* render error separately from the
          // feedback and presentation draws; never blame the history copy.
          assertMemoryGl("GPU source scene draw failed");
          compositeFeedback(s, timeline, width, height, drawWithSchlieren);
          lastMemoryTime = timeline.time;
          lastMemoryColorTime = timeline.colorTime;
        } catch (e) {
          // Export cannot replace the feedback result with an unrelated original frame.
          if(exactEffects)throw artworkParityError("Frame-memory composite failed",e);
          // Preview may still show the underlying art.
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, width, height);
          gl.useProgram(active.program);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          memoryDisabled = true;
          releaseMemory();
          console.warn("GPU frame-memory pass failed; using original renderer.", e);
        }
      }
      if(!drawWithMemory && drawWithSchlieren){
        try{
          assertMemoryGl("Schlieren scene draw failed");
          glassPass().present(
            glassPass().prepareBuffer(width,height).texture,s,timeline,width,height);
        }catch(error){
          if(exactEffects)throw artworkParityError(
            "Schlieren glass failed to refract the full artwork",error);
          schlierenUnavailable=true;
          schlieren?.releaseBuffer();
          console.warn("Schlieren failed; presenting original intact pixels.",error);
          gl.bindFramebuffer(gl.FRAMEBUFFER,null);
          gl.viewport(0,0,width,height);
          gl.useProgram(active.program);
          gl.drawArrays(gl.TRIANGLES,0,6);
        }
      }
      // Text is painted in the independent Canvas2D compositing layer, not WebGL.
      // This keeps Safari and AI Studio shader quirks from swallowing user's words.
      if (gl2) {
        if (fence) gl.deleteSync(fence);
        fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
      }
      return true;
    },
    resetBiology() {
      if (biology) {
        biology.reset();
        biology.advance(48, biologyFeed, biologyKill);
        biologyLastTime = null;
        biologyFraction = 0;
      }
    },
    resetFeedback() {
      if (memory) memory.valid = false;
      memoryIdentity = "";
      lastMemoryTime = lastMemoryColorTime = -Infinity;
    },
    destroy(release = false) {
      if (fence) gl.deleteSync(fence);
      releaseMemory();
      schlieren?.destroy();
      schlieren=null;
      releaseBiology();
      releaseLettering();
      releaseSemanticGlyph();
      if(textOverlayProgram)gl.deleteProgram(textOverlayProgram);
      gl.deleteTexture(emptyBioTexture);
      if (memoryShader){
        gl.deleteProgram(memoryShader.program);
        gl.deleteProgram(memoryShader.displayProgram);
      }
      memoryShader = null;
      programs.forEach((p) => gl.deleteProgram(p.program));
      programs.clear();
      gl.deleteBuffer(buffer);
      if (release) gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
export function previewDimensions(
  width,
  height,
  quality = "Balanced",
  autoScale = 1,
) {
  const budget =
    { Eco: 320000, Balanced: 800000, Sharp: 1800000, Auto: 800000 }[quality] ||
    800000;
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2),
    factor =
      Math.min(dpr, Math.sqrt(budget / Math.max(1, width * height))) *
      (quality === "Auto" ? autoScale : 1);
  return {
    width: Math.max(1, Math.round(width * factor)),
    height: Math.max(1, Math.round(height * factor)),
  };
}
