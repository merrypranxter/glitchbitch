// Preview-only zoom & pan for the artwork stage.
//
// Mental model: the artwork "surface" is a photo lying centered on a table
// (the stage). Zooming scales the photo around a finger/cursor; panning
// slides it. Nothing here touches the recipe, exports, or touch-source math:
// it is a CSS transform on the preview, so PNG/MP4/GIF output is unchanged.
//
// All coordinates are CSS pixels measured from the CENTER of the stage.
// A view is { zoom, x, y }: the surface is drawn at translate(x, y) scale(zoom)
// with transform-origin at its own center (which sits at the stage center).

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 8;
export const FIT_VIEW = Object.freeze({ zoom: 1, x: 0, y: 0 });

// Friendly stops for the +/− buttons, so taps land on round numbers.
export const ZOOM_STOPS = [0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];

const finite = (n, fallback) => (Number.isFinite(n) ? n : fallback);

export function clampZoom(zoom) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, finite(zoom, 1)));
}

/**
 * Keep the picture on the table. When the scaled surface is larger than the
 * stage on an axis, its edges may slide up to the stage edges (no empty
 * gutter pulled into view). When it is smaller, it stays centered.
 * bounds = { stageW, stageH, surfaceW, surfaceH }
 */
export function clampView(view, bounds) {
  const zoom = clampZoom(view?.zoom);
  if (!bounds) return { zoom, x: 0, y: 0 };
  const maxX = Math.max(0, (bounds.surfaceW * zoom - bounds.stageW) / 2);
  const maxY = Math.max(0, (bounds.surfaceH * zoom - bounds.stageH) / 2);
  const x = Math.max(-maxX, Math.min(maxX, finite(view?.x, 0)));
  const y = Math.max(-maxY, Math.min(maxY, finite(view?.y, 0)));
  // Normalise -0 so equality checks and snapshots stay boring.
  return { zoom, x: x || 0, y: y || 0 };
}

/**
 * Zoom to `nextZoom` while keeping the artwork pixel under `focal` (stage-
 * center coordinates) exactly under it — like pinching a photo on a phone.
 */
export function zoomAt(view, nextZoom, focal = { x: 0, y: 0 }, bounds) {
  const from = clampZoom(view?.zoom);
  const zoom = clampZoom(nextZoom);
  const fx = finite(focal?.x, 0), fy = finite(focal?.y, 0);
  const k = zoom / from;
  const next = {
    zoom,
    x: fx - (fx - finite(view?.x, 0)) * k,
    y: fy - (fy - finite(view?.y, 0)) * k,
  };
  return clampView(next, bounds);
}

/**
 * Two-finger pinch: scale by how far the fingers spread AND slide with their
 * midpoint, computed from the gesture's starting view in one step (so edge
 * clamping mid-gesture never makes the picture drift away from the fingers).
 */
export function pinchView(startView, startMid, startDist, mid, dist, bounds) {
  const from = clampZoom(startView?.zoom);
  const zoom = clampZoom(from * (Math.max(1, finite(dist, 1)) / Math.max(1, finite(startDist, 1))));
  const k = zoom / from;
  return clampView({
    zoom,
    x: finite(mid?.x, 0) - (finite(startMid?.x, 0) - finite(startView?.x, 0)) * k,
    y: finite(mid?.y, 0) - (finite(startMid?.y, 0) - finite(startView?.y, 0)) * k,
  }, bounds);
}

export function panBy(view, dx, dy, bounds) {
  return clampView(
    { zoom: view?.zoom, x: finite(view?.x, 0) + finite(dx, 0), y: finite(view?.y, 0) + finite(dy, 0) },
    bounds,
  );
}

/** Next friendly stop up (dir > 0) or down (dir < 0) from the current zoom. */
export function stepZoom(zoom, dir) {
  const z = clampZoom(zoom);
  if (dir > 0) return ZOOM_STOPS.find((s) => s > z + 1e-3) ?? MAX_ZOOM;
  return [...ZOOM_STOPS].reverse().find((s) => s < z - 1e-3) ?? MIN_ZOOM;
}

export function isFit(view) {
  return Math.abs(clampZoom(view?.zoom) - 1) < 1e-3 &&
    Math.abs(finite(view?.x, 0)) < 0.5 && Math.abs(finite(view?.y, 0)) < 0.5;
}

export function zoomLabel(zoom) {
  return `${Math.round(clampZoom(zoom) * 100)}%`;
}

/**
 * How much sharper the preview backing store should render while zoomed.
 * Zoomed-in pixels would otherwise be stretched and blurry. The renderer's
 * own pixel budget (Eco/Balanced/Sharp) still caps the real cost, so this
 * never asks the GPU for more than the chosen quality allows.
 */
export function renderScaleForZoom(zoom) {
  return Math.min(4, Math.max(1, clampZoom(zoom)));
}
