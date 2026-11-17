/**
 * GLITCHBITCH lettering trajectories. Sparklebae-inspired phase-closed math;
 * no frame history, no cumulative drift, deterministic export coordinates.
 */
export const letteringMotionGroups = [
 {label:"Whole-word / spatial paths",paths:[
  "Classic drift","Still","Orbit","Ellipse","Figure eight","Infinity loop",
  "Pendulum","Swing","Ricochet","Zigzag","Slalom","Heartbeat",
  "Spin clockwise","Spin counterclockwise","Breathing",
  "Rubber bounce","Slide side to side","Float","Corkscrew"
 ]},
 {label:"Independent letter choreography",paths:[
  "Letter wave","Letter bounce","Letter float","Letter wiggle",
  "Letter pulse","Letter rubber","Letter sway","Letter spin clockwise",
  "Letter spin counterclockwise","Letter drift","Letter fade",
  "Letter twinkle","Letter typewriter","Letter corkscrew","Letter flutter"
 ]}
];
export const letteringMotionPaths=letteringMotionGroups.flatMap(g=>g.paths);
const TAU=Math.PI*2;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number.isFinite(Number(v))?Number(v):min));
const sin=Math.sin,cos=Math.cos;
export function letteringMotionIsPerLetter(path) { return (path||"").startsWith("Letter "); }
export function letteringMotionPhase(timeSeconds,speed=1,direction="Forward"){
 const cycles=Math.max(1,Math.min(4,Math.round(Number(speed)||1)));
 const dir=direction==="Reverse"?-1:1;
 const revolutions=(Number(timeSeconds)||0)*cycles/4*dir;
 return ((revolutions%1)+1)%1;
}
export function letteringMotionAt(layer,seconds,width=430,height=430,index=-1,total=1,em=72) {
 const path=letteringMotionPaths.includes(layer.letteringMotionPath)
   ? layer.letteringMotionPath:"Classic drift";
 const intensity=clamp(layer.letteringMotion,0,100)/100;
 const zero={dx:0,dy:0,rotation:0,scaleX:1,scaleY:1,alpha:1};
 if(path==="Still"||intensity<.001)return zero;
 // Whole-word and individual-glyph choreography are separate transform levels.
 if(letteringMotionIsPerLetter(path) && index<0)return zero;
 if(!letteringMotionIsPerLetter(path) && index>=0)return zero;
 const stagger=clamp(layer.letteringMotionStagger??10,0,100)/100*.35;
 const speed=clamp(layer.letteringMotionSpeed??1,1,4);
 const dir=layer.letteringMotionDirection==="Reverse"?-1:1;
 // Index offsets follow Sparklebae's phase system but do not change closure.
 const phase=letteringMotionPhase(seconds,speed,layer.letteringMotionDirection);
 const ip=index>=0?index:0;
 const phaseOffset=letteringMotionIsPerLetter(path)?-dir*ip*stagger:0;
 const t=TAU*(phase+phaseOffset);
 const t2=t*2;
 const unit=letteringMotionIsPerLetter(path)?em:Math.min(width,height);
 const amp=unit*intensity;
 const sq=Math.sign(sin(t))*Math.pow(Math.abs(sin(t)),.45);
 switch(path) {
 case "Classic drift":
   return {dx:amp*.09*sin(t),dy:amp*.052*cos(t),rotation:11*intensity*sin(t),scaleX:1,scaleY:1,alpha:1};
 case "Orbit":return {...zero,dx:amp*.24*cos(t),dy:amp*.24*sin(t)};
 case "Ellipse":return {...zero,dx:amp*.31*cos(t),dy:amp*.13*sin(t)};
 case "Figure eight":return {...zero,dx:amp*.30*sin(t),dy:amp*.16*sin(t2)};
 case "Infinity loop":return {...zero,dx:amp*.32*sin(t),dy:amp*.18*sin(t2),rotation:14*intensity*sin(t)};
 case "Pendulum":return {...zero,dx:amp*.29*sin(t),dy:amp*.07*(1-cos(t)),rotation:17*intensity*sin(t)};
 case "Swing":return {...zero,dx:amp*.18*sin(t),dy:amp*.09*sin(t2),rotation:29*intensity*sin(t)};
 case "Ricochet":return {...zero,dx:amp*.27*sq,dy:amp*.16*Math.sign(cos(t))*Math.pow(Math.abs(cos(t)),.45)};
 case "Zigzag":return {...zero,dx:amp*.26*(2/Math.PI)*Math.asin(sin(t)),dy:amp*.13*(2/Math.PI)*Math.asin(cos(t*2))};
 case "Slalom":return {...zero,dx:amp*.28*sin(t),dy:amp*.11*sin(t*3),rotation:9*intensity*cos(t)};
 case "Heartbeat":return {...zero,scaleX:1+intensity*.21*Math.pow(Math.max(0,sin(t)),5),scaleY:1+intensity*.25*Math.pow(Math.max(0,sin(t)),5)};
 case "Spin clockwise":
 case "Spin counterclockwise":return {...zero,rotation:(path==="Spin clockwise"?1:-1)*360*phase};
 case "Breathing":return {...zero,scaleX:1+intensity*.26*sin(t),scaleY:1+intensity*.26*sin(t)};
 case "Rubber bounce": {
   const lift=Math.abs(sin(t));
   const contact=Math.max(0,1-5*lift);
   return {...zero,dy:-amp*.30*lift,scaleX:1+contact*.24*intensity,scaleY:1-contact*.28*intensity};
 }
 case "Slide side to side":return {...zero,dx:amp*.40*sin(t)};
 case "Float":return {...zero,dx:amp*.16*cos(t),dy:amp*.21*sin(t),rotation:5*intensity*sin(t)};
 case "Corkscrew":return {...zero,dx:amp*.24*cos(t),dy:amp*.17*sin(t),rotation:27*intensity*sin(t)};
 case "Letter wave":return {...zero,dy:amp*.53*sin(t)};
 case "Letter bounce":{
   const lift=Math.abs(sin(t)),contact=Math.max(0,1-5*lift);
   return {...zero,dy:-amp*.55*lift,scaleX:1+contact*.24*intensity,scaleY:1-contact*.31*intensity};
 }
 case "Letter float":return {...zero,dx:amp*.24*cos(t),dy:amp*.42*sin(t),rotation:7*intensity*sin(t)};
 case "Letter wiggle":return {...zero,dx:amp*.15*sin(t2),dy:amp*.12*cos(t),rotation:25*intensity*sin(t)};
 case "Letter pulse":return {...zero,scaleX:1+.35*intensity*sin(t),scaleY:1+.35*intensity*sin(t)};
 case "Letter rubber":return {...zero,dy:-amp*.18*sin(t),scaleX:1-.27*intensity*sin(t),scaleY:1+.42*intensity*sin(t)};
 case "Letter sway":return {...zero,dx:amp*.16*sin(t),rotation:32*intensity*sin(t)};
 case "Letter spin clockwise":
 case "Letter spin counterclockwise":return {...zero,rotation:(path==="Letter spin clockwise"?1:-1)*360*phase};
 case "Letter drift":return {...zero,dx:amp*.33*cos(t),dy:amp*.24*sin(t)};
 case "Letter fade":return {...zero,alpha:1-intensity*(.5+.5*sin(t))};
 case "Letter twinkle":return {...zero,alpha:1-intensity*Math.pow(.5+.5*sin(t+ip*1.618),6)};
 case "Letter typewriter":return {...zero,alpha:1-intensity*(.5+.5*Math.cos(t)),dy:amp*.13*sin(t)};
 case "Letter corkscrew":return {...zero,dx:amp*.3*cos(t),dy:amp*.27*sin(t),rotation:45*intensity*sin(t)};
 case "Letter flutter":return {...zero,dy:amp*.23*sin(t),rotation:24*intensity*sin(t2),scaleX:1+.2*intensity*cos(t)};
 default:return zero;
 }
}
/**
 * Continuous *letter* deformation: no clipped rows or scissors-shredded
 * slices. Every glyph curves, shears and breathes independently with phase.
 */
export function letteringMotionCombinedAt(layer,seconds,width=430,height=430,index=-1,total=1,em=72){
 const first=letteringMotionAt(layer,seconds,width,height,index,total,em);
 const secondPath=layer.letteringMotionPath2||"None";
 const mix=clamp(layer.letteringMotionMix??65,0,100)/100;
 if(secondPath==="None"||!letteringMotionPaths.includes(secondPath)||mix<.001)return first;
 const second=letteringMotionAt({...layer,letteringMotionPath:secondPath},
   seconds,width,height,index,total,em);
 return {
  dx:first.dx+second.dx*mix,dy:first.dy+second.dy*mix,
  rotation:first.rotation+second.rotation*mix,
  scaleX:first.scaleX*(1+(second.scaleX-1)*mix),
  scaleY:first.scaleY*(1+(second.scaleY-1)*mix),
  alpha:first.alpha*(1-(1-second.alpha)*mix)
 };
}
export function letteringMotionNeedsGlyphs(layer) {
 return letteringMotionIsPerLetter(layer.letteringMotionPath) ||
   letteringMotionIsPerLetter(layer.letteringMotionPath2);
}
export function letteringLiquidAt(layer,seconds,index,total,em=72){
 const amount=clamp(layer.letteringWarp,0,100)/100;
 if(amount<.001)return {dx:0,dy:0,rotation:0,skewX:0,scaleX:1,scaleY:1};
 const speed=clamp(layer.letteringMotionSpeed??1,1,4);
 const dir=layer.letteringMotionDirection==="Reverse"?-1:1;
 const phase=letteringMotionPhase(seconds,speed,layer.letteringMotionDirection);
 const i=Math.max(0,index),p=TAU*phase;
 const t=p+i*.61*dir;
 const w=sin(t),q=cos(p*2-i*.39);
 return {
   dx:em*.16*amount*w,
   dy:em*.18*amount*q,
   rotation:10*amount*sin(p+i*.43),
   skewX:18*amount*q,
   scaleX:1+.16*amount*w,
   scaleY:1+.12*amount*cos(t+.9)
 };
}
export function letteringMotionCss(t) {
 const dx=Number(t.dx)||0,dy=Number(t.dy)||0;
 const angle=Number(t.rotation)||0,skew=Number(t.skewX)||0;
 const sx=Number(t.scaleX??1),sy=Number(t.scaleY??1);
 return `translate3d(${dx.toFixed(3)}px,${dy.toFixed(3)}px,0) rotate(${angle.toFixed(3)}deg) skewX(${skew.toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
}
export function letteringComposeGlyph(motion,liquid){
 return {
  dx:(motion.dx||0)+(liquid.dx||0),dy:(motion.dy||0)+(liquid.dy||0),
  rotation:(motion.rotation||0)+(liquid.rotation||0),
  skewX:liquid.skewX||0,
  scaleX:(motion.scaleX??1)*(liquid.scaleX??1),
  scaleY:(motion.scaleY??1)*(liquid.scaleY??1),
  alpha:motion.alpha??1
 };
}
