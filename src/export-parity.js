// A dedicated parity error prevents codec fallback from turning an inaccurate
// frame into a falsely successful downloadable video.
export function artworkParityError(stage,cause){
  const reason=String(cause?.message||"GPU resource or shader support failure")
    .replace(/\s+/g," ").slice(0,240);
  const err=new Error(
    "Export stopped rather than remove your special effects: "+stage+". "+
    "Your art and settings are unchanged. Try a smaller export resolution "+
    "or reduce the demanding effects intentionally. GPU detail: "+reason
  );
  err.name="ArtworkParityError";
  return err;
}
export function isArtworkParityError(error){
  return error?.name==="ArtworkParityError";
}
