// Pure, editable palette actions shared by the Color tab and Surprise Me.
// No network, browser API, or external dependency: safe for iPhone + offline exports.
const pickIndex = (n, random=Math.random) =>
  Math.min(n-1,Math.max(0,Math.floor(random()*n)));

const sameColors = (a,b) => a.length===b.length &&
  a.every((color,i)=>color.toLowerCase()===b[i].toLowerCase());

export function pickDifferentPalette(paletteList,currentColors,random=Math.random){
  const candidates=paletteList.map((palette,index)=>({...palette,index}))
    .filter(p=>Array.isArray(p.colors) && p.colors.length>=2 &&
      !sameColors(p.colors,currentColors));
  if(!candidates.length)return null;
  const picked=candidates[pickIndex(candidates.length,random)];
  return {index:picked.index,colors:[...picked.colors],name:picked.name};
}

export function shuffleColorStops(colors,random=Math.random){
  const next=[...colors];
  for(let i=next.length-1;i>0;i--){
    const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
    [next[i],next[j]]=[next[j],next[i]];
  }
  // A degenerate random source should still visibly change the stop order
  // whenever two different colors exist. Never mutate the original array.
  if(sameColors(next,colors)){
    const j=next.findIndex(c=>c.toLowerCase()!==next[0].toLowerCase());
    if(j>0)[next[0],next[j]]=[next[j],next[0]];
  }
  return next;
}

export const reverseColorStops = colors => [...colors].reverse();

const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
function hslToHex(h,s,l){
  h=((h%360)+360)%360;
  const S=clamp(s,0,100)/100,L=clamp(l,0,100)/100;
  const c=(1-Math.abs(2*L-1))*S;
  const x=c*(1-Math.abs(((h/60)%2)-1));
  const m=L-c/2;
  const [r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:
    h<180?[0,c,x]:h<240?[0,x,c]:
    h<300?[x,0,c]:[c,0,x];
  return "#"+[r,g,b].map(n=>
    Math.round(clamp((n+m)*255,0,255)).toString(16).padStart(2,"0")
  ).join("");
}
const colorArchitectures=[
  [0,26,61,172,205,278,327,354],  // Acid analogue colliding with complement
  [0,151,185,332,28,238,280,67],  // Split complementary electricity
  [0,119,239,38,164,284,72,196],  // Triadic fireworks
  [0,69,177,249,319,29,214,115],  // Four-way spectral pigments
  [0,24,48,76,191,213,239,284],  // Warm-to-cool optical clash
  [0,175,345,196,20,315,141,269] // Alien candy glass
];

export function generateRandomPalette(random=Math.random){
  const n=4+pickIndex(5,random);
  const base=random()*360;
  const architecture=colorArchitectures[pickIndex(colorArchitectures.length,random)];
  const tilt=(random()-.5)*34;
  return Array.from({length:n},(_,i)=>{
    const hue=base+architecture[i]+tilt+(random()-.5)*16;
    const saturation=78+random()*22;
    // A deliberate dark anchor / light accent makes the bright stops glow.
    const light=i===0?25+random()*16:
      i===n-1?70+random()*12:43+random()*25;
    return hslToHex(hue,saturation,light);
  });
}
