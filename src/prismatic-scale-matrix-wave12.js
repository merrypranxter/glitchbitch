// Wave 12 — Shader Vault Prismatic Scale Matrix.
// Grounded in prismatic_scale_matrix_20260625_145149.js:
// stacked shingle-scale geometry, raised domes, cell identity, normal
// lighting and angle-responsive iridescence. All shaders use the same
// Glitchbitch preview/PNG/GIF/MP4 render path; no Three.js/FBO needed.
export const psModes=["Diamondback Prisms","Opaline Shield Plates","Electric Eel Scutes","Koi Cathedral Scales","Serrated Alien Leaf"];
export const psControls=["psAmount","psScale","psOverlap","psLift","psMotion","psFilm","psDiffraction","psHue","psWarp","psVariation","psSheen","psEdge","psDomain"];
export const psPresets=[
  {
    "name": "Iridescent Koi Armor",
    "psMode": "Koi Cathedral Scales",
    "psAmount": 84,
    "psScale": 62,
    "psOverlap": 68,
    "psLift": 76,
    "psMotion": 49,
    "psFilm": 92,
    "psDiffraction": 82,
    "psHue": 52,
    "psWarp": 37,
    "psVariation": 55,
    "psSheen": 87,
    "psEdge": 74,
    "psDomain": 59
  },
  {
    "name": "UV Diamondback",
    "psMode": "Diamondback Prisms",
    "psAmount": 96,
    "psScale": 79,
    "psOverlap": 84,
    "psLift": 93,
    "psMotion": 63,
    "psFilm": 98,
    "psDiffraction": 86,
    "psHue": 78,
    "psWarp": 58,
    "psVariation": 73,
    "psSheen": 97,
    "psEdge": 87,
    "psDomain": 82
  },
  {
    "name": "Opaline Shield Sutures",
    "psMode": "Opaline Shield Plates",
    "psAmount": 89,
    "psScale": 58,
    "psOverlap": 74,
    "psLift": 83,
    "psMotion": 30,
    "psFilm": 95,
    "psDiffraction": 78,
    "psHue": 22,
    "psWarp": 49,
    "psVariation": 40,
    "psSheen": 93,
    "psEdge": 82,
    "psDomain": 45
  },
  {
    "name": "Slick Electric Eel",
    "psMode": "Electric Eel Scutes",
    "psAmount": 92,
    "psScale": 83,
    "psOverlap": 51,
    "psLift": 95,
    "psMotion": 79,
    "psFilm": 91,
    "psDiffraction": 100,
    "psHue": 68,
    "psWarp": 65,
    "psVariation": 81,
    "psSheen": 100,
    "psEdge": 55,
    "psDomain": 92
  },
  {
    "name": "Xenobotanical Scalpel",
    "psMode": "Serrated Alien Leaf",
    "psAmount": 99,
    "psScale": 69,
    "psOverlap": 93,
    "psLift": 88,
    "psMotion": 55,
    "psFilm": 100,
    "psDiffraction": 95,
    "psHue": 36,
    "psWarp": 84,
    "psVariation": 89,
    "psSheen": 98,
    "psEdge": 95,
    "psDomain": 78
  },
  {
    "name": "Gentle Pearly Fishskin",
    "psMode": "Koi Cathedral Scales",
    "psAmount": 42,
    "psScale": 40,
    "psOverlap": 42,
    "psLift": 44,
    "psMotion": 26,
    "psFilm": 67,
    "psDiffraction": 39,
    "psHue": 20,
    "psWarp": 16,
    "psVariation": 35,
    "psSheen": 58,
    "psEdge": 29,
    "psDomain": 24
  }
];
export function applyPsPreset(state,name) {
  const p=psPresets.find(x=>x.name===name);
  if(!p)return state;
  const {name:_label,...settings}=p;
  return {...state,...settings};
}
function unit(random){
  const v=Number(random());
  return Number.isFinite(v)?Math.max(0,Math.min(1-Number.EPSILON,v)):0;
}
export function shufflePs(state,random=Math.random){
  const result={...state,psMode:psModes[Math.floor(unit(random)*psModes.length)]};
  for(const key of psControls)
    result[key]=key==="psAmount"?40+unit(random)*60:unit(random)*100;
  return result;
}
export function hidePs(state){return {...state,psAmount:0};}
export const psGLSL="// Vault Wave 12. Independent physical-style shingle-scale tessellation.\n// All exposed controls normalize to [0,1] through the existing uniforms.\nuniform int psMode;\nuniform float psAmount,psScale,psOverlap,psLift,psMotion,psFilm;\nuniform float psDiffraction,psHue,psWarp,psVariation,psSheen,psEdge,psDomain;\n\nstruct PsTile {\n  float height;\n  float depth;\n  float identity;\n  float cover;\n  vec2 local;\n};\n// Five true geometric packing laws, not just one recolored texture.\nfloat psDistance(vec2 local){\n  if(psMode==0) // Diamondback faceted chevrons\n    return (abs(local.x)+abs(local.y))*.93;\n  if(psMode==1) // Hexagonal shields\n    return max(abs(local.x)*.86+abs(local.y)*.5,abs(local.y))*1.12;\n  if(psMode==2) // Elongated eel / armored leaf\n    return length(local*vec2(.61,1.58));\n  if(psMode==3){ // Fish-scale fan with delicate scalloped perimeter\n    float a=atan(local.y,local.x);\n    return length(local*vec2(1.05,1.2))-.075*cos(a*6.0);\n  }\n  // Serrated alien leaf plates\n  float spine=abs(local.x)+abs(local.y)*.76;\n  return spine*.84-.10*cos(atan(local.y,local.x)*8.0);\n}\nPsTile psFind(vec2 q){\n  PsTile best;\n  best.height=-1.0;\n  best.depth=-1000.0;\n  best.identity=0.0;\n  best.cover=0.0;\n  best.local=vec2(0.0);\n  vec2 grid=floor(q);\n  for(int j=-1;j<=1;j++){\n    for(int i=-1;i<=1;i++){\n      vec2 cell=grid+vec2(float(i),float(j));\n      float stagger=mod(cell.y,2.0)*.5;\n      vec2 center=cell+vec2(.5+stagger,.5);\n      vec2 local=q-center;\n      float d=psDistance(local);\n      float h=1.0-d*(1.35+.6*psOverlap);\n      // Genuine overlapping shingle layering, not a tiled 2D fill.\n      float z=h-local.y*(.55+1.2*psOverlap);\n      if(h>-.13 && z>best.depth){\n        best.depth=z;\n        best.height=h;\n        best.local=local;\n        best.cover=smoothstep(-.13,.02,h);\n        best.identity=fract(sin(dot(cell,vec2(12.9898,78.233)))*43758.5453);\n      }\n    }\n  }\n  return best;\n}\nvec3 psDress(vec3 col,vec2 uv,vec2 sceneP,float sceneValue){\n  float aspect=res.x/max(1.0,res.y);\n  float pixelsPerCell=max(10.0,res.y/22.0);\n  float gridRate=min(7.0+psScale*32.0,pixelsPerCell);\n  vec2 q=(uv-.5)*vec2(aspect,1.0)*gridRate;\n  float clock=time*(.035+.32*psMotion);\n  float identity=psVariation*6.2831853+seed*.003+seedHigh*.07;\n  float envelope=exp(-q.x*q.x/(gridRate*gridRate)*6.0);\n  q.x*=mix(1.0,.59,psWarp*envelope);\n  q+=vec2(sin(sceneP.y*1.7+clock*.4+identity),\n          cos(sceneP.x*1.7-clock*.3+identity))*.23*psWarp;\n  q.y-=clock*.75;\n  PsTile tile=psFind(q);\n  float coverage=tile.cover;\n  float h=max(0.0,tile.height);\n  vec2 l=tile.local;\n  // One analytic relief normal per fragment, not 3 more 3x3 scans.\n  vec3 N=normalize(vec3(-l.x*(.7+2.3*psLift),\n                           -l.y*(.6+2.5*psLift),\n                           .72-.26*psLift));\n  vec3 L=normalize(vec3(-.48+.22*sin(clock*.3),\n                          .32+.24*cos(clock*.2),.85));\n  vec3 H=normalize(L+vec3(0.0,0.0,1.0));\n  float diffuse=max(0.0,dot(N,L));\n  float specular=pow(max(dot(N,H),0.0),11.0+69.0*psSheen);\n  float grazing=pow(clamp(1.0-max(0.0,N.z),0.0,1.0),2.0);\n  float rim=1.0-smoothstep(-.03,.30,tile.height);\n  vec2 z=l*3.0;\n  vec2 z2=vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y);\n  float domainPhase=atan(z2.y+.27,z2.x-.2)/\n                    6.2831853+sin(length(z2)*3.4)*.07;\n  float phase=psHue+tile.identity*.58+colorTime*.015+\n              sceneValue*.017+psDomain*domainPhase*.48;\n  float filmPath=(.15+h)*(4.0+psFilm*13.0);\n  vec3 interference=.5+.5*cos(filmPath*vec3(1.00,1.32,1.68)+\n                               vec3(.0,1.9,3.4));\n  vec3 base=palette(phase);\n  vec3 opal=palette(phase+dot(interference,vec3(.28,.33,.39))*.35+\n                    grazing*.34);\n  float grooveFreq=min(15.0+psDiffraction*70.0,\n                       max(5.0,res.y/(max(6.0,gridRate)*2.8)));\n  float grating=pow(.5+.5*sin((l.x*.866+l.y*.5)*grooveFreq+\n                      clock*.5),6.0);\n  vec3 diffraction=palette(phase+.43+grating*.19);\n  vec3 surface=base*(.25+.72*diffuse)+\n               opal*(.18+grazing*.66+specular*.79)*\n                 psFilm*(.35+.65*psLift)+\n               diffraction*grating*psDiffraction*(.28+.55*psSheen);\n  surface+=opal*specular*psSheen*.75;\n  // Rim channels and gaps separate physical plates in both directions.\n  surface*=1.0-rim*psEdge*.69;\n  surface+=opal*rim*psEdge*psFilm*.35;\n  // Source artwork is still visible through the material skin.\n  vec3 coated=mix(col*.44+surface*.6,surface,.20+.48*psLift);\n  return mix(col,coated,clamp(psAmount*coverage,0.0,1.0));\n}";
