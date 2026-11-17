/**
 * Bounded CPU Gray–Scott reaction-diffusion field.
 * Small fixed grid; no dependencies, WebGL2 requirement or per-frame allocations.
 * Two chemicals (U and V), wrapped 9-point Laplacian, deterministic seed.
 * Inspired by myspace_glitch/02-vhs-crt-subpixels/vhs-coral.js.
 */
export const BIO_SIZE = 96;
const clamp01 = (n) => Math.max(0, Math.min(1, n));
const hashSeed = (n) => ((n >>> 0) || 1);
export function createBiology(seed, size = BIO_SIZE) {
  if (!Number.isInteger(size) || size < 16 || size > 256) throw Error("Invalid biology grid size.");
  const length = size * size;
  let u = new Float32Array(length), v = new Float32Array(length);
  let uNext = new Float32Array(length), vNext = new Float32Array(length);
  const rgba = new Uint8Array(length * 4);
  let rng = hashSeed(seed), generation = 0;
  const random = () => {
    rng ^= rng << 13; rng ^= rng >>> 17; rng ^= rng << 5;
    return (rng >>> 0) / 4294967296;
  };
  function reset() {
    rng = hashSeed(seed); generation = 0;
    u.fill(1); v.fill(0);
    // Living seed colonies, including off-center shapes and widely separated spores.
    // No external noise; the same saved seed rebuilds the same organism.
    for (let n = 0; n < 25; n++) {
      const cx = Math.floor(random() * size), cy = Math.floor(random() * size);
      const radius = (1.9 + random() * 3.8) * size / BIO_SIZE;
      for (let dy = -7; dy <= 7; dy++)
        for (let dx = -7; dx <= 7; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const x = (cx + dx + size) % size, y = (cy + dy + size) % size;
          const i = y * size + x;
          u[i] = .25 + random() * .12;
          v[i] = .65 + random() * .28;
        }
    }
  }
  function step(feed = 44, kill = 42) {
    // Gray–Scott regime spanning spots, coral and broken labyrinths.
    const F = .021 + feed * .00040;
    const K = .046 + kill * .00025;
    const dt = .9;
    for (let y = 0; y < size; y++) {
      const ym = (y + size - 1) % size, yp = (y + 1) % size;
      for (let x = 0; x < size; x++) {
        const xm = (x + size - 1) % size, xp = (x + 1) % size;
        const i = y * size + x;
        const L = y * size + xm, R = y * size + xp;
        const T = ym * size + x, B = yp * size + x;
        const TL = ym * size + xm, TR = ym * size + xp;
        const BL = yp * size + xm, BR = yp * size + xp;
        const a = u[i], b = v[i];
        const lapU = -a + .2 * (u[L] + u[R] + u[T] + u[B]) +
          .05 * (u[TL] + u[TR] + u[BL] + u[BR]);
        const lapV = -b + .2 * (v[L] + v[R] + v[T] + v[B]) +
          .05 * (v[TL] + v[TR] + v[BL] + v[BR]);
        const reaction = a * b * b;
        uNext[i] = clamp01(a + dt * (.9 * lapU - reaction + F * (1 - a)));
        vNext[i] = clamp01(b + dt * (.48 * lapV + reaction - (F + K) * b));
      }
    }
    [u, uNext] = [uNext, u];
    [v, vNext] = [vNext, v];
    generation++;
  }
  function advance(steps, feed = 44, kill = 42) {
    const n = Math.max(0, Math.min(300, Math.floor(steps)));
    for (let i = 0; i < n; i++) step(feed, kill);
  }
  function pixels() {
    for (let i = 0; i < length; i++) {
      const j = i * 4;
      rgba[j] = Math.round(255 * (1 - u[i]));
      rgba[j + 1] = Math.round(255 * clamp01(v[i] * 2.8));
      rgba[j + 2] = Math.round(255 * clamp01((u[i] - v[i]) * .7));
      rgba[j + 3] = 255;
    }
    return rgba;
  }
  reset();
  return { reset, advance, pixels, get generation() { return generation; }, size };
}
