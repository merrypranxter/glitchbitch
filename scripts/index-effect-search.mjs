import fs from 'node:fs';
const source=fs.readFileSync('src/components/Inspectors.jsx','utf8');
const start=source.indexOf('  const body = {', source.indexOf('export function EffectsInspector'));
const end=source.indexOf('\n  };', start);
const body=source.slice(start,end);
const boundaries=[...body.matchAll(/^    (?:"([\w-]+)"|([\w-]+)): <>/gm)].map(m=>({id:m[1]||m[2],at:m.index}));
const terms={};
const normalize=s=>s.replace(/\s+/g,' ').trim();
function cleanText(s){
 let out='',braces=0,quote=null;
 for(let i=0;i<s.length;i++){
   const c=s[i];
   if(braces){if(quote){if(c==='\\')i++;else if(c===quote)quote=null;}else if(c==='"'||c==="'"||c==='`')quote=c;else if(c==='{')braces++;else if(c==='}')braces--;continue;}
   if(c==='{'){braces=1;continue;}
   if(c==='<'){while(i<s.length&&s[i]!=='>')i++;continue;}
   out+=c;
 }
 return normalize(out);
}
for(let i=0;i<boundaries.length;i++){
 const {id,at}=boundaries[i];
 const text=body.slice(at,boundaries[i+1]?.at ?? body.length);
 terms[id]??=new Set();
 const stack=[];
 const tokens=/<\/?[A-Za-z][\w.]*/g;
 for(let match;match=tokens.exec(text);){
   let cursor=tokens.lastIndex,braces=0,quote=null;
   for(;cursor<text.length;cursor++){
     const c=text[cursor];
     if(quote){if(c==='\\')cursor++;else if(c===quote)quote=null;continue;}
     if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
     if(c==='{')braces++;else if(c==='}')braces--;
     if(c==='>'&&braces===0)break;
   }
   const tag=text.slice(match.index,cursor+1);
   tokens.lastIndex=cursor+1;
   if(tag.startsWith('</details')){stack.pop();continue;}
   if(tag.startsWith('<details')){
      const key=tag.match(/data-effect-detail="([^"]+)"/)?.[1];
      stack.push(key||stack.at(-1)||id);
      terms[stack.at(-1)]??=new Set();
   }
   const owner=stack.at(-1)||id;
   terms[owner]??=new Set();
   const add=value=>{if(value)terms[owner].add(normalize(value));};
   if(/^<(Parameter|Select|Toggle|Range|Switch|Segmented|Pill|Reseed|input|button|label)\b/.test(tag)){
      for(const [,label] of tag.matchAll(/\blabel="([^"]+)"/g))add(label);
      for(const [,name] of tag.matchAll(/\bname="([^"]+)"/g))add(name);
      for(const [,name] of tag.matchAll(/\b(?:value|checked)=\{s\.([a-zA-Z]\w*)/g))add(name);
   }
   if(/^<(button|summary|label)\b/.test(tag)&&!tag.endsWith('/>')){
     const type=tag.match(/^<(\w+)/)[1];
     const closing=text.indexOf(`</${type}>`,cursor+1);
     if(closing>=0)add(cleanText(text.slice(cursor+1,closing)));
   }
 }
}
terms['fx-toggles']=new Set(['Bloom','Posterize','Invert','bloom','posterize','invert']);
const result=Object.fromEntries(Object.entries(terms).map(([id,set])=>[id,[...set].filter(Boolean)]));
const output='// Every Effects control label and bound field, indexed at its deepest laboratory.\n// UI-only search vocabulary: no artwork values or renderer behavior live here.\n// Regenerate with npm run index:effects (guarded by effect-search-terms tests).\nexport const effectSearchTerms = '+JSON.stringify(result,null,2)+';\n';
fs.writeFileSync('src/effect-search-terms.js',output);
console.log(`${Object.keys(result).length} destinations; ${Object.values(result).flat().length} search terms`);
