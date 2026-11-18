/**
 * Build a comparison against the exact same artwork with ordinary text.
 * Keep original words, fonts, color, stroke, geometry, palette and motion.
 * Only the compositing mode changes, including optional extra text layers.
 */
export function normalTextBlendState(state) {
  return {...state,letteringBlendMode:"Normal",letteringBlendStrength:100,
    letteringLayers:(state.letteringLayers||[]).map(layer=>({
      ...layer,letteringBlendMode:"Normal",letteringBlendStrength:100
    }))
  };
}
