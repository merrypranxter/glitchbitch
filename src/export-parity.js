// A dedicated parity error prevents codec fallback from turning an inaccurate
// frame into a falsely successful downloadable video.
export function artworkParityError(stage,cause){
  const reason=String(cause?.message||"GPU resource or shader support failure")
    .replace(/\s+/g," ").slice(0,240);
  // A GLSL syntax error is not a GPU memory issue. Reducing bitrate or
  // resolution cannot fix forbidden identifiers such as 'resource'/'active'.
  const sourceSyntaxError=/reserved word|syntax error|undeclared identifier|unexpected token/i
    .test(reason);
  const guidance=sourceSyntaxError
    ? "Shader code failed to compile. Resolution and bitrate cannot fix a "+
      "shader syntax error; update the app code and retry. "
    : "Try a smaller export resolution or reduce demanding effects intentionally. ";
  const err=new Error(
    "Export stopped rather than remove your special effects: "+stage+". "+
    "Your art and settings are unchanged. "+guidance+"GPU detail: "+reason
  );
  err.name="ArtworkParityError";
  return err;
}
export function isArtworkParityError(error){
  return error?.name==="ArtworkParityError";
}
