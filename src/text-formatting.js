/**
 * Lightweight, explicit UTF-16 indexed rich-text ranges. The author still
 * owns an ordinary editable textarea; formatting never rewrites their words.
 * Ranges are compact, serializable, normalized and safe on old recipes.
 */
export const textFormatTools = [
  {key:"bold",label:"Bold",symbol:"B"},
  {key:"italic",label:"Italic",symbol:"I"},
  {key:"underline",label:"Underline",symbol:"U"},
  {key:"strike",label:"Strikethrough",symbol:"S"},
  {key:"caps",label:"ALL CAPS",symbol:"AA"}
];
export const textFormatKeys=textFormatTools.map(t=>t.key);
const empty=()=>({bold:false,italic:false,underline:false,strike:false,caps:false});
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(n))?Number(n):min));
const equal=(a,b)=>textFormatKeys.every(k=>Boolean(a[k])===Boolean(b[k]));
export const hasTextFormat=style=>textFormatKeys.some(k=>style?.[k]);
export function textStyleAt(formats,index){
  const out=empty();
  for(const item of Array.isArray(formats)?formats:[]){
    if(index>=item.start && index<item.end){
      for(const key of textFormatKeys)if(item[key])out[key]=true;
    }
  }
  return out;
}
export function normalizeTextFormats(text,formats){
  const size=String(text||"").length;
  const entries=Array.from({length:size},(_,i)=>textStyleAt(formats,i));
  return packTextStyles(entries);
}
export function packTextStyles(styles){
  const result=[];
  for(let i=0;i<styles.length;){
    const style=styles[i]||empty(),start=i;
    while(i<styles.length && equal(style,styles[i]||empty()))i++;
    if(hasTextFormat(style))result.push({start,end:i,
      ...Object.fromEntries(textFormatKeys.filter(k=>style[k]).map(k=>[k,true]))});
  }
  return result;
}
export function wordSelection(text,start,end){
  const s=String(text||""),n=s.length;
  let a=clamp(start,0,n),b=clamp(end,0,n);
  if(a>b)[a,b]=[b,a];
  if(a!==b)return {start:a,end:b};
  // With an empty selection, target the complete word under/adjacent to caret.
  // Whitespace-only positions can choose the neighboring word; never format
  // newlines or the entire message by accident.
  if(!n)return {start:a,end:a};
  let i=Math.min(a,n-1);
  if(/\s/u.test(s[i])&&i>0&&!/\s/u.test(s[i-1]))i--;
  else if(/\s/u.test(s[i])){
    while(i<n && /\s/u.test(s[i]))i++;
    if(i>=n)return {start:a,end:a};
  }
  let j=i;
  while(i>0&&!/\s/u.test(s[i-1]))i--;
  while(j<n&&!/\s/u.test(s[j]))j++;
  return {start:i,end:j};
}
export function toggleTextFormat(text,formats,selectionStart,selectionEnd,key){
  if(!textFormatKeys.includes(key))return normalizeTextFormats(text,formats);
  const textValue=String(text||"");
  const {start,end}=wordSelection(textValue,selectionStart,selectionEnd);
  if(end<=start)return normalizeTextFormats(textValue,formats);
  const styles=Array.from({length:textValue.length},(_,i)=>textStyleAt(formats,i));
  const positions=[];
  for(let i=start;i<end;i++)if(!/\s/u.test(textValue[i]))positions.push(i);
  if(!positions.length)return packTextStyles(styles);
  const shouldEnable=!positions.every(i=>Boolean(styles[i][key]));
  for(const i of positions)styles[i][key]=shouldEnable;
  return packTextStyles(styles);
}
export function rebaseTextFormats(oldText,newText,formats){
  const oldValue=String(oldText||""),fresh=String(newText||"");
  const oldLen=oldValue.length,newLen=fresh.length;
  let prefix=0;
  while(prefix<oldLen&&prefix<newLen&&oldValue[prefix]===fresh[prefix])prefix++;
  let suffix=0;
  while(suffix<oldLen-prefix&&suffix<newLen-prefix &&
    oldValue[oldLen-1-suffix]===fresh[newLen-1-suffix])suffix++;
  const prior=Array.from({length:oldLen},(_,i)=>textStyleAt(formats,i));
  const insertion=newLen-prefix-suffix;
  // A replacement inherits the style of the selected word, not the
  // surrounding punctuation. Newly typed unformatted words stay unformatted.
  const basis=prior[Math.min(prefix,Math.max(0,oldLen-1))]||empty();
  const expanded=[
    ...prior.slice(0,prefix),
    ...Array.from({length:insertion},()=>({...basis})),
    ...prior.slice(oldLen-suffix)
  ];
  return packTextStyles(expanded);
}
export function textFormattingSegments(text,formats){
  const value=String(text||"");
  const out=[];
  for(const char of value){
    const start=out.reduce((n,x)=>n+x.raw.length,0);
    const style=textStyleAt(formats,start);
    const display=style.caps?char.toUpperCase():char;
    const previous=out[out.length-1];
    if(previous&&equal(previous.style,style)){
      previous.raw+=char;previous.display+=display;previous.end+=char.length;
    }else out.push({start,end:start+char.length,raw:char,display,style});
  }
  return out;
}
export function formatCharStyle(style={}){
 return {
   fontWeight:style.bold?900:undefined,
   fontStyle:style.italic?"italic":undefined,
   textDecorationLine:[style.underline?"underline":null,
     style.strike?"line-through":null].filter(Boolean).join(" ")||"none",
   textDecorationThickness:style.underline||style.strike?"auto":undefined
 };
}
