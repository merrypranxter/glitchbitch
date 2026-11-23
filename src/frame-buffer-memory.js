// Frame transport for exact PNG/GIF/MP4 capture.
// WebGL readPixels writes bottom-to-top rows. ImageData is top-to-bottom.
// A Uint8Array VIEW over the existing ImageData pixels avoids allocating
// a second full-resolution RGBA frame (7–19 MiB at common export sizes).
export function webglReadbackView(imageData) {
  const pixels=imageData?.data;
  if(!(pixels instanceof Uint8ClampedArray))
    throw Error("Expected an ImageData RGBA pixel array.");
  return new Uint8Array(pixels.buffer,pixels.byteOffset,pixels.byteLength);
}
export function flipRgbaRowsInPlace(pixels,width,height,rowBuffer){
  if(!Number.isInteger(width)||width<1||!Number.isInteger(height)||height<1)
    throw Error("Invalid RGBA frame dimensions.");
  const stride=width*4;
  if(!(pixels instanceof Uint8Array) || pixels.byteLength!==stride*height)
    throw Error("RGBA buffer size does not match frame dimensions.");
  if(!(rowBuffer instanceof Uint8Array) || rowBuffer.byteLength!==stride)
    throw Error("Reusable RGBA row buffer has the wrong size.");
  for(let top=0,bottom=height-1;top<bottom;top++,bottom--){
    const topStart=top*stride,bottomStart=bottom*stride;
    rowBuffer.set(pixels.subarray(topStart,topStart+stride));
    pixels.copyWithin(topStart,bottomStart,bottomStart+stride);
    pixels.set(rowBuffer,bottomStart);
  }
  return pixels;
}
