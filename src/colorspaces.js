// colorspaces.js — perceptual color spaces for generative art.
// All "lin" values are LINEAR sRGB in [0,1] (D65). Use srgbToLin / linToSrgb at the edges.
// Every space exposes  X.fromLin([r,g,b]) -> coords   and   X.toLin(coords) -> [r,g,b]
// Hue angles are in DEGREES unless stated. Out-of-gamut results are NOT clamped (see gamutMap).

// ---------- helpers ----------
const cbrt = Math.cbrt;
const spow = (x, p) => Math.sign(x) * Math.pow(Math.abs(x), p); // sign-preserving power
const mul = (m, v) => [
  m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2],
  m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2],
  m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]];
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const toPolar = ([L, a, b]) => { const C = Math.hypot(a, b); let h = Math.atan2(b, a) * R2D; if (h < 0) h += 360; return [L, C, C < 1e-9 ? NaN : h]; };
const fromPolar = ([L, C, h]) => { if (Number.isNaN(h)) return [L, 0, 0]; return [L, C * Math.cos(h * D2R), C * Math.sin(h * D2R)]; };
export function inv3(m) {
  const [a,b,c] = m[0], [d,e,f] = m[1], [g,h,i] = m[2];
  const A = e*i - f*h, B = -(d*i - f*g), C = d*h - e*g, det = a*A + b*B + c*C;
  return [[A/det, -(b*i - c*h)/det, (b*f - c*e)/det],
          [B/det, (a*i - c*g)/det, -(a*f - c*d)/det],
          [C/det, -(a*h - b*g)/det, (a*e - b*d)/det]];
}

// ---------- sRGB transfer (IEC 61966-2-1, as in CSS Color 4) ----------
export const srgbToLin = c => c.map(x => { const a = Math.abs(x); return a <= 0.04045 ? x / 12.92 : Math.sign(x) * Math.pow((a + 0.055) / 1.055, 2.4); });
export const linToSrgb = c => c.map(x => { const a = Math.abs(x); return a <= 0.0031308 ? x * 12.92 : Math.sign(x) * (1.055 * Math.pow(a, 1 / 2.4) - 0.055); });

// ---------- linear sRGB <-> XYZ (D65, Y of white = 1) — CSS Color 4 values ----------
export const M_SRGB_XYZ = [
  [0.41239079926595934, 0.357584339383878,   0.1804807884018343],
  [0.21263900587151027, 0.715168678767756,   0.07219231536073371],
  [0.01933081871559182, 0.11919477979462598, 0.9505321522496607]];
export const M_XYZ_SRGB = [
  [ 3.2409699419045226,  -1.537383177570094,   -0.4986107602930034],
  [-0.9692436362808796,   1.8759675015077202,   0.04155505740717559],
  [ 0.05563007969699366, -0.20397695888897652,  1.0569715142428786]];
export const linToXyz = v => mul(M_SRGB_XYZ, v);
export const xyzToLin = v => mul(M_XYZ_SRGB, v);
export const D65 = [0.3127 / 0.3290, 1, (1 - 0.3127 - 0.3290) / 0.3290]; // 0.95046, 1, 1.08906

// ================= OKLAB / OKLCH (Ottosson 2020) =================
export const Oklab = {
  fromLin([r, g, b]) {
    const l = cbrt(0.4122214708*r + 0.5363325363*g + 0.0514459929*b);
    const m = cbrt(0.2119034982*r + 0.6806995451*g + 0.1073969566*b);
    const s = cbrt(0.0883024619*r + 0.2817188376*g + 0.6299787005*b);
    return [0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
            1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
            0.0259040371*l + 0.7827717662*m - 0.8086757660*s];
  },
  toLin([L, a, b]) {
    const l = (L + 0.3963377774*a + 0.2158037573*b) ** 3;
    const m = (L - 0.1055613458*a - 0.0638541728*b) ** 3;
    const s = (L - 0.0894841775*a - 1.2914855480*b) ** 3;
    return [ 4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
            -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
            -0.0041960863*l - 0.7034186147*m + 1.7076147010*s];
  }
};
export const Oklch = { fromLin: v => toPolar(Oklab.fromLin(v)), toLin: v => Oklab.toLin(fromPolar(v)) };

// ================= OKHSV / OKHSL (Ottosson 2021) — direct port of reference code =================
const toe = x => { const k1 = 0.206, k2 = 0.03, k3 = (1 + k1) / (1 + k2); return 0.5 * (k3*x - k1 + Math.sqrt((k3*x - k1)**2 + 4*k2*k3*x)); };
const toeInv = x => { const k1 = 0.206, k2 = 0.03, k3 = (1 + k1) / (1 + k2); return (x*x + k1*x) / (k3 * (x + k2)); };
function maxSaturation(a, b) { // max S=C/L for hue (a,b normalized) inside sRGB
  let k0, k1, k2, k3, k4, wl, wm, ws;
  if (-1.88170328*a - 0.80936493*b > 1) { k0=1.19086277; k1=1.76576728; k2=0.59662641; k3=0.75515197; k4=0.56771245; wl=4.0767416621; wm=-3.3077115913; ws=0.2309699292; }
  else if (1.81444104*a - 1.19445276*b > 1) { k0=0.73956515; k1=-0.45954404; k2=0.08285427; k3=0.12541070; k4=0.14503204; wl=-1.2684380046; wm=2.6097574011; ws=-0.3413193965; }
  else { k0=1.35733652; k1=-0.00915799; k2=-1.15130210; k3=-0.50559606; k4=0.00692167; wl=-0.0041960863; wm=-0.7034186147; ws=1.7076147010; }
  let S = k0 + k1*a + k2*b + k3*a*a + k4*a*b;
  const kl = 0.3963377774*a + 0.2158037573*b, km = -0.1055613458*a - 0.0638541728*b, ks = -0.0894841775*a - 1.2914855480*b;
  const l_ = 1 + S*kl, m_ = 1 + S*km, s_ = 1 + S*ks;
  const l = l_**3, m = m_**3, s = s_**3;
  const ldS = 3*kl*l_*l_, mdS = 3*km*m_*m_, sdS = 3*ks*s_*s_;
  const ldS2 = 6*kl*kl*l_, mdS2 = 6*km*km*m_, sdS2 = 6*ks*ks*s_;
  const f = wl*l + wm*m + ws*s, f1 = wl*ldS + wm*mdS + ws*sdS, f2 = wl*ldS2 + wm*mdS2 + ws*sdS2;
  return S - f*f1 / (f1*f1 - 0.5*f*f2); // one Halley step
}
function findCusp(a, b) {
  const S = maxSaturation(a, b);
  const rgb = Oklab.toLin([1, S*a, S*b]);
  const L = cbrt(1 / Math.max(rgb[0], rgb[1], rgb[2]));
  return [L, L*S];
}
function gamutIntersection(a, b, L1, C1, L0, cusp) { // ray (L0,0)->(L1,C1), returns t
  const [cL, cC] = cusp; let t;
  if ((L1 - L0)*cC - (cL - L0)*C1 <= 0) t = cC*L0 / (C1*cL + cC*(L0 - L1));
  else {
    t = cC*(L0 - 1) / (C1*(cL - 1) + cC*(L0 - L1));
    const dL = L1 - L0, dC = C1;
    const kl = 0.3963377774*a + 0.2158037573*b, km = -0.1055613458*a - 0.0638541728*b, ks = -0.0894841775*a - 1.2914855480*b;
    const ldt = dL + dC*kl, mdt = dL + dC*km, sdt = dL + dC*ks;
    const L = L0*(1 - t) + t*L1, C = t*C1;
    const l_ = L + C*kl, m_ = L + C*km, s_ = L + C*ks;
    const l = l_**3, m = m_**3, s = s_**3;
    const l1 = 3*ldt*l_*l_, m1 = 3*mdt*m_*m_, s1 = 3*sdt*s_*s_;
    const l2 = 6*ldt*ldt*l_, m2 = 6*mdt*mdt*m_, s2 = 6*sdt*sdt*s_;
    const step = (w0, w1, w2) => { const f = w0*l + w1*m + w2*s - 1, f1 = w0*l1 + w1*m1 + w2*s1, f2 = w0*l2 + w1*m2 + w2*s2; const u = f1 / (f1*f1 - 0.5*f*f2); return u >= 0 ? -f*u : Infinity; };
    t += Math.min(step(4.0767416621, -3.3077115913, 0.2309699292), step(-1.2684380046, 2.6097574011, -0.3413193965), step(-0.0041960863, -0.7034186147, 1.7076147010));
  }
  return t;
}
const toST = ([L, C]) => [C / L, C / (1 - L)];
function stMid(a, b) {
  const S = 0.11516993 + 1 / (7.44778970 + 4.15901240*b + a*(-2.19557347 + 1.75198401*b + a*(-2.13704948 - 10.02301043*b + a*(-4.24894561 + 5.38770819*b + 4.69891013*a))));
  const T = 0.11239642 + 1 / (1.61320320 - 0.68124379*b + a*(0.40370612 + 0.90148123*b + a*(-0.27087943 + 0.61223990*b + a*(0.00299215 - 0.45399568*b - 0.14661872*a))));
  return [S, T];
}
function getCs(L, a, b) {
  const cusp = findCusp(a, b);
  const Cmax = gamutIntersection(a, b, L, 1, L, cusp);
  const [Smax, Tmax] = toST(cusp);
  const k = Cmax / Math.min(L*Smax, (1 - L)*Tmax);
  const [Sm, Tm] = stMid(a, b);
  let Ca = L*Sm, Cb = (1 - L)*Tm;
  const Cmid = 0.9*k*Math.sqrt(Math.sqrt(1 / (1/Ca**4 + 1/Cb**4)));
  Ca = L*0.4; Cb = (1 - L)*0.8;
  const C0 = Math.sqrt(1 / (1/Ca**2 + 1/Cb**2));
  return [C0, Cmid, Cmax];
}
// Okhsl/Okhsv coords: [h in 0..360, s 0..1, l|v 0..1]. Input/output linear sRGB.
export const Okhsl = {
  toLin([h, s, l]) {
    if (l >= 1) return [1, 1, 1]; if (l <= 0) return [0, 0, 0];
    if (Number.isNaN(h) || s <= 0) { const y = toeInv(l)**3; return [y, y, y]; }
    const a = Math.cos(h*D2R), b = Math.sin(h*D2R), L = toeInv(l);
    const [C0, Cmid, Cmax] = getCs(L, a, b), mid = 0.8, midInv = 1.25;
    let C;
    if (s < mid) { const t = midInv*s, k1 = mid*C0, k2 = 1 - k1/Cmid; C = t*k1 / (1 - k2*t); }
    else { const t = (s - mid)/(1 - mid), k0 = Cmid, k1 = (1 - mid)*Cmid*Cmid*midInv*midInv/C0, k2 = 1 - k1/(Cmax - Cmid); C = k0 + t*k1/(1 - k2*t); }
    return Oklab.toLin([L, C*a, C*b]);
  },
  fromLin(rgb) {
    const [L, A, B] = Oklab.fromLin(rgb), C = Math.hypot(A, B);
    if (C < 1e-7) return [NaN, 0, toe(L)];
    const a = A/C, b = B/C; let h = Math.atan2(B, A)*R2D; if (h < 0) h += 360;
    const [C0, Cmid, Cmax] = getCs(L, a, b), mid = 0.8, midInv = 1.25;
    let s;
    if (C < Cmid) { const k1 = mid*C0, k2 = 1 - k1/Cmid, t = C/(k1 + k2*C); s = t*mid; }
    else { const k0 = Cmid, k1 = (1 - mid)*Cmid*Cmid*midInv*midInv/C0, k2 = 1 - k1/(Cmax - Cmid), t = (C - k0)/(k1 + k2*(C - k0)); s = mid + (1 - mid)*t; }
    return [h, s, toe(L)];
  }
};
export const Okhsv = {
  toLin([h, s, v]) {
    if (v <= 0) return [0, 0, 0];
    if (Number.isNaN(h) || s <= 0) { const y = toeInv(v)**3; return [y, y, y]; }
    const a = Math.cos(h*D2R), b = Math.sin(h*D2R);
    const [Smax, Tmax] = toST(findCusp(a, b)), S0 = 0.5, k = 1 - S0/Smax;
    const Lv = 1 - s*S0/(S0 + Tmax - Tmax*k*s), Cv = s*Tmax*S0/(S0 + Tmax - Tmax*k*s);
    let L = v*Lv, C = v*Cv;
    const Lvt = toeInv(Lv), Cvt = Cv*Lvt/Lv;
    const Lnew = toeInv(L); C = L > 0 ? C*Lnew/L : 0; L = Lnew;
    const sc = Oklab.toLin([Lvt, a*Cvt, b*Cvt]);
    const scaleL = cbrt(1 / Math.max(sc[0], sc[1], sc[2], 0));
    return Oklab.toLin([L*scaleL, C*scaleL*a, C*scaleL*b]);
  },
  fromLin(rgb) {
    let [L, A, B] = Oklab.fromLin(rgb); let C = Math.hypot(A, B);
    if (L <= 1e-9) return [NaN, 0, 0];
    if (C < 1e-7) return [NaN, 0, toe(L)];
    const a = A/C, b = B/C; let h = Math.atan2(B, A)*R2D; if (h < 0) h += 360;
    const [Smax, Tmax] = toST(findCusp(a, b)), S0 = 0.5, k = 1 - S0/Smax;
    const t = Tmax/(C + L*Tmax), Lv = t*L, Cv = t*C;
    const Lvt = toeInv(Lv), Cvt = Cv*Lvt/Lv;
    const sc = Oklab.toLin([Lvt, a*Cvt, b*Cvt]);
    const scaleL = cbrt(1 / Math.max(sc[0], sc[1], sc[2], 0));
    L /= scaleL; C /= scaleL; C = C*toe(L)/L; L = toe(L);
    return [h, (S0 + Tmax)*Cv/(Tmax*S0 + Tmax*k*Cv), L/Lv];
  }
};

// ================= CIELAB / CIELUV (CIE 1976), D65 white =================
const EPS = 216/24389, KAP = 24389/27;
export const Lab = {
  white: D65,
  fromLin(rgb) {
    const xyz = linToXyz(rgb), w = this.white;
    const f = t => t > EPS ? cbrt(t) : (KAP*t + 16)/116;
    const fx = f(xyz[0]/w[0]), fy = f(xyz[1]/w[1]), fz = f(xyz[2]/w[2]);
    return [116*fy - 16, 500*(fx - fy), 200*(fy - fz)];
  },
  toLin([L, a, b]) {
    const w = this.white, fy = (L + 16)/116, fx = a/500 + fy, fz = fy - b/200;
    const finv = f => f**3 > EPS ? f**3 : (116*f - 16)/KAP;
    const y = L > KAP*EPS ? fy**3 : L/KAP;
    return xyzToLin([finv(fx)*w[0], y*w[1], finv(fz)*w[2]]);
  }
};
export const LCHab = { fromLin: v => toPolar(Lab.fromLin(v)), toLin: v => Lab.toLin(fromPolar(v)) };
const uvp = ([X, Y, Z]) => { const d = X + 15*Y + 3*Z; return d === 0 ? [0, 0] : [4*X/d, 9*Y/d]; };
const [UN, VN] = uvp(D65);
export const Luv = {
  fromLin(rgb) {
    const xyz = linToXyz(rgb), y = xyz[1];
    const L = y > EPS ? 116*cbrt(y) - 16 : KAP*y;
    if (L <= 0) return [0, 0, 0];
    const [u, v] = uvp(xyz);
    return [L, 13*L*(u - UN), 13*L*(v - VN)];
  },
  toLin([L, u, v]) {
    if (L <= 0) return [0, 0, 0];
    const up = u/(13*L) + UN, vp = v/(13*L) + VN;
    const Y = L > 8 ? ((L + 16)/116)**3 : L/KAP;
    return xyzToLin([Y*9*up/(4*vp), Y, Y*(12 - 3*up - 20*vp)/(4*vp)]);
  }
};
export const LCHuv = { fromLin: v => toPolar(Luv.fromLin(v)), toLin: v => Luv.toLin(fromPolar(v)) };

// ================= HSLuv / HPLuv (Boronine, hsluv.org) =================
// Note: reference uses its own D65 u'n v' n (0.19783000664283, 0.46831999493879); we use the
// same CSS matrix for both, so differences vs. hsluv-js are ~1e-4.
function luvBounds(L) {
  const sub1 = (L + 16)**3 / 1560896, sub2 = sub1 > EPS ? sub1 : L/KAP, out = [];
  for (const [m1, m2, m3] of M_XYZ_SRGB) for (const t of [0, 1]) {
    const top1 = (284517*m1 - 94839*m3)*sub2;
    const top2 = (838422*m3 + 769860*m2 + 731718*m1)*L*sub2 - 769860*t*L;
    const bot = (632260*m3 - 126452*m2)*sub2 + 126452*t;
    out.push([top1/bot, top2/bot]); // slope, intercept
  }
  return out;
}
const maxChromaLH = (L, h) => { const hr = h*D2R; let m = Infinity; for (const [s, i] of luvBounds(L)) { const len = i/(Math.sin(hr) - s*Math.cos(hr)); if (len >= 0) m = Math.min(m, len); } return m; };
const maxSafeChromaL = L => { let m = Infinity; for (const [s, i] of luvBounds(L)) m = Math.min(m, Math.abs(i)/Math.sqrt(s*s + 1)); return m; };
const mkLuvHsl = (maxFn) => ({ // coords [h 0..360, s 0..100, l 0..100]
  toLin([h, s, l]) {
    if (l > 99.9999999) return [1, 1, 1]; if (l < 1e-8) return [0, 0, 0];
    return LCHuv.toLin([l, maxFn(l, h)/100*s, h]);
  },
  fromLin(rgb) {
    const [L, C, h] = LCHuv.fromLin(rgb);
    if (L > 99.9999999 || L < 1e-8 || Number.isNaN(h)) return [h, 0, L];
    return [h, C/maxFn(L, h)*100, L];
  }
});
export const HSLuv = mkLuvHsl(maxChromaLH);
export const HPLuv = mkLuvHsl((L) => maxSafeChromaL(L)); // pastel-only; s>100 leaves gamut

// ================= IPT (Ebner & Fairchild 1998) =================
const M_XYZ_LMS_IPT = [[0.4002, 0.7075, -0.0807], [-0.2280, 1.1500, 0.0612], [0, 0, 0.9184]];
const M_LMS_IPT = [[0.4000, 0.4000, 0.2000], [4.4550, -4.8510, 0.3960], [0.8056, 0.3572, -1.1628]];
const M_IPT_LMS = inv3(M_LMS_IPT), M_LMS_XYZ_IPT = inv3(M_XYZ_LMS_IPT);
export const IPT = {
  fromLin(rgb) { const lms = mul(M_XYZ_LMS_IPT, linToXyz(rgb)).map(x => spow(x, 0.43)); return mul(M_LMS_IPT, lms); },
  toLin(ipt) { const lms = mul(M_IPT_LMS, ipt).map(x => spow(x, 1/0.43)); return xyzToLin(mul(M_LMS_XYZ_IPT, lms)); },
  // NOTE: the paper uses D65 XYZ with Y=1 (strictly a D65-normalized XYZ, Xn≈0.9505, Zn≈1.089)
};

// ================= PQ (SMPTE ST 2084 / BT.2100) =================
const PQ = { m1: 2610/16384, m2: 2523/4096*128, c1: 3424/4096, c2: 2413/4096*32, c3: 2392/4096*32 };
const pqEnc = (Y, m2 = PQ.m2) => { const y = Math.pow(Math.max(Y, 0), PQ.m1); return Math.pow((PQ.c1 + PQ.c2*y)/(1 + PQ.c3*y), m2); };
const pqDec = (E, m2 = PQ.m2) => { const e = Math.pow(Math.max(E, 0), 1/m2); return Math.pow(Math.max(e - PQ.c1, 0)/(PQ.c2 - PQ.c3*e), 1/PQ.m1); };

// ================= ICtCp (Dolby; ITU-R BT.2100, PQ variant) =================
// sdrWhite: luminance in cd/m² that linear sRGB 1.0 maps to (CSS HDR uses 203; some code uses 100).
const M_SRGB_2020 = [[0.6274039, 0.3292830, 0.0433131], [0.0690973, 0.9195404, 0.0113623], [0.0163914, 0.0880133, 0.8955953]];
const M_2020_LMS = [[1688, 2146, 262], [683, 2951, 462], [99, 309, 3688]].map(r => r.map(x => x/4096));
const M_LMS_ICTCP = [[0.5, 0.5, 0], [6610, -13613, 7003].map(x => x/4096), [17933, -17390, -543].map(x => x/4096)];
const M_ICTCP_LMS = inv3(M_LMS_ICTCP), M_LMS_2020 = inv3(M_2020_LMS), M_2020_SRGB = inv3(M_SRGB_2020);
export const ICtCp = {
  sdrWhite: 203,
  fromLin(rgb) { const lms = mul(M_2020_LMS, mul(M_SRGB_2020, rgb)).map(x => pqEnc(x*this.sdrWhite/10000)); return mul(M_LMS_ICTCP, lms); },
  toLin(v) { const lms = mul(M_ICTCP_LMS, v).map(x => pqDec(x)*10000/this.sdrWhite); return mul(M_2020_SRGB, mul(M_LMS_2020, lms)); }
};

// ================= JzAzBz / JzCzhz (Safdar et al. 2017) =================
const JZ = { b: 1.15, g: 0.66, d: -0.56, d0: 1.6295499532821566e-11, p: 1.7*2523/32 };
const M_XYZ_LMS_JZ = [[0.41478972, 0.579999, 0.0146480], [-0.2015100, 1.120649, 0.0531008], [-0.0166008, 0.264800, 0.6684799]];
const M_LMS_IAB_JZ = [[0.5, 0.5, 0], [3.524000, -4.066708, 0.542708], [0.199076, 1.096799, -1.295875]];
const M_IAB_LMS_JZ = inv3(M_LMS_IAB_JZ), M_LMS_XYZ_JZ = inv3(M_XYZ_LMS_JZ);
export const Jzazbz = {
  sdrWhite: 203, // absolute luminance of sRGB white, cd/m² (colorjs uses 203)
  fromLin(rgb) {
    const [X, Y, Z] = linToXyz(rgb).map(v => v*this.sdrWhite);
    const Xp = JZ.b*X - (JZ.b - 1)*Z, Yp = JZ.g*Y - (JZ.g - 1)*X;
    const lms = mul(M_XYZ_LMS_JZ, [Xp, Yp, Z]).map(v => pqEnc(v/10000, JZ.p));
    const [Iz, az, bz] = mul(M_LMS_IAB_JZ, lms);
    return [(1 + JZ.d)*Iz/(1 + JZ.d*Iz) - JZ.d0, az, bz];
  },
  toLin([Jz, az, bz]) {
    const J = Jz + JZ.d0, Iz = J/(1 + JZ.d - JZ.d*J);
    const [Xp, Yp, Z] = mul(M_LMS_XYZ_JZ, mul(M_IAB_LMS_JZ, [Iz, az, bz]).map(v => pqDec(v, JZ.p)*10000));
    const X = (Xp + (JZ.b - 1)*Z)/JZ.b, Y = (Yp + (JZ.g - 1)*X)/JZ.g;
    return xyzToLin([X, Y, Z].map(v => v/this.sdrWhite));
  }
};
export const JzCzhz = { fromLin: v => toPolar(Jzazbz.fromLin(v)), toLin: v => Jzazbz.toLin(fromPolar(v)) };

// ================= CAM16 / CAM16-UCS (Li et al. 2017), Material-style formulation =================
const M16 = [[0.401288, 0.650173, -0.051461], [-0.250268, 1.204414, 0.045854], [-0.002079, 0.048952, 0.953127]];
const M16i = inv3(M16);
const yFromLstar = L => (L > 8 ? ((L + 16)/116)**3 : L/KAP) * 100;
export function viewingConditions({ white = D65.map(x => x*100), LA = 200/Math.PI*yFromLstar(50)/100, Yb = yFromLstar(50), F = 1.0, c = 0.69, Nc = 1.0, discount = false } = {}) {
  const rgbW = mul(M16, white);
  let D = discount ? 1 : F*(1 - (1/3.6)*Math.exp((-LA - 42)/92)); D = Math.min(1, Math.max(0, D));
  const Drgb = rgbW.map(x => D*white[1]/x + 1 - D);
  const k = 1/(5*LA + 1), k4 = k**4, FL = k4*LA + 0.1*(1 - k4)**2*cbrt(5*LA);
  const n = Yb/white[1], z = 1.48 + Math.sqrt(n), Nbb = 0.725/Math.pow(n, 0.2);
  const adapt = x => { const p = Math.pow(FL*Math.abs(x)/100, 0.42); return Math.sign(x)*400*p/(p + 27.13); };
  const rgbAW = rgbW.map((x, i) => adapt(x*Drgb[i]));
  const Aw = (2*rgbAW[0] + rgbAW[1] + 0.05*rgbAW[2])*Nbb;
  return { Drgb, FL, FL4: Math.pow(FL, 0.25), n, z, Nbb, Ncb: Nbb, c, Nc, Aw, adapt };
}
export const VC_DEFAULT = viewingConditions(); // same as Material Color Utilities' DEFAULT
export const CAM16 = { // coords [J, C, h]; also returns M via fromLinFull
  fromLinFull(rgb, vc = VC_DEFAULT) {
    const xyz = linToXyz(rgb).map(v => v*100);
    const [Ra, Ga, Ba] = mul(M16, xyz).map((x, i) => vc.adapt(x*vc.Drgb[i]));
    const a = Ra - 12*Ga/11 + Ba/11, b = (Ra + Ga - 2*Ba)/9;
    let h = Math.atan2(b, a)*R2D; if (h < 0) h += 360;
    const A = (2*Ra + Ga + 0.05*Ba)*vc.Nbb;
    const J = 100*Math.pow(Math.max(A, 0)/vc.Aw, vc.c*vc.z);
    const eHue = 0.25*(Math.cos(h*D2R + 2) + 3.8);
    const t = 50000/13*eHue*vc.Nc*vc.Ncb*Math.hypot(a, b)/(Ra + Ga + 1.05*Ba + 0.305);
    const C = Math.pow(t, 0.9)*Math.sqrt(J/100)*Math.pow(1.64 - Math.pow(0.29, vc.n), 0.73);
    return { J, C, h, M: C*vc.FL4 };
  },
  fromLin(rgb, vc) { const r = this.fromLinFull(rgb, vc); return [r.J, r.C, r.h]; },
  toLin([J, C, h], vc = VC_DEFAULT) {
    if (J <= 0) return [0, 0, 0];
    if (Number.isNaN(h)) { h = 0; C = 0; }
    const alpha = C/Math.sqrt(J/100);
    const t = Math.pow(alpha/Math.pow(1.64 - Math.pow(0.29, vc.n), 0.73), 1/0.9);
    const hr = h*D2R, eHue = 0.25*(Math.cos(hr + 2) + 3.8);
    const ac = vc.Aw*Math.pow(J/100, 1/(vc.c*vc.z));
    const p1 = eHue*50000/13*vc.Nc*vc.Ncb, p2 = ac/vc.Nbb;
    const hs = Math.sin(hr), hc = Math.cos(hr);
    const gamma = 23*(p2 + 0.305)*t/(23*p1 + 11*t*hc + 108*t*hs);
    const a = gamma*hc, b = gamma*hs;
    const Ra = (460*p2 + 451*a + 288*b)/1403, Ga = (460*p2 - 891*a - 261*b)/1403, Ba = (460*p2 - 220*a - 6300*b)/1403;
    const unadapt = x => { const ax = Math.abs(x); const base = Math.max(0, 27.13*ax/(400 - ax)); return Math.sign(x)*100/vc.FL*Math.pow(base, 1/0.42); };
    const rgbC = [Ra, Ga, Ba].map((x, i) => unadapt(x)/vc.Drgb[i]);
    return xyzToLin(mul(M16i, rgbC).map(v => v/100));
  }
};
export const CAM16UCS = { // coords [J', a', b']
  fromLin(rgb, vc = VC_DEFAULT) { const { J, M, h } = CAM16.fromLinFull(rgb, vc); const Jp = 1.7*J/(1 + 0.007*J), Mp = Math.log1p(0.0228*M)/0.0228; return [Jp, Mp*Math.cos(h*D2R), Mp*Math.sin(h*D2R)]; },
  toLin([Jp, ap, bp], vc = VC_DEFAULT) { const Mp = Math.hypot(ap, bp), h = Math.atan2(bp, ap)*R2D; const J = Jp/(1.7 - 0.007*Jp), M = Math.expm1(0.0228*Mp)/0.0228; return CAM16.toLin([J, M/vc.FL4, (h + 360) % 360], vc); }
};

// ================= HCT (Google Material): CAM16 hue+chroma, CIELAB L* tone =================
const lstarFromLin = rgb => { const y = linToXyz(rgb)[1]; return y > EPS ? 116*cbrt(y) - 16 : KAP*y; };
const inGamut = (rgb, e = 1e-4) => rgb.every(x => x >= -e && x <= 1 + e);
function camAtTone(h, C, T) { // solve J so that L*(result)=T (secant), C,h fixed
  const Ytarget = yFromLstar(T)/100;
  let J = T, rgb; // L* ~ J as a starting guess
  for (let i = 0; i < 8; i++) {
    rgb = CAM16.toLin([J, C, h]);
    const Y = linToXyz(rgb)[1];
    if (Math.abs(Y - Ytarget) < 2e-6) break;
    J *= Math.pow(Ytarget/Math.max(Y, 1e-9), 0.5); // J ~ Y^0.5-ish near-linear update
    J = Math.min(Math.max(J, 1e-4), 100);
  }
  return rgb;
}
export const HCT = { // coords [h 0..360, c ~0..150, t 0..100]
  fromLin(rgb) { const { C, h } = CAM16.fromLinFull(rgb); return [h, C, lstarFromLin(rgb)]; },
  toLin([h, c, t]) {
    if (t <= 0.0001) return [0, 0, 0]; if (t >= 99.9999) return [1, 1, 1];
    if (Number.isNaN(h) || c < 1e-4) { const y = yFromLstar(t)/100; return [y, y, y]; }
    let rgb = camAtTone(h, c, t); if (inGamut(rgb)) return rgb;
    let lo = 0, hi = c; // Material semantics: reduce chroma until in sRGB
    for (let i = 0; i < 18; i++) { const mid = (lo + hi)/2, r = camAtTone(h, mid, t); if (inGamut(r)) { lo = mid; rgb = r; } else hi = mid; }
    return lo === 0 ? camAtTone(h, 0, t) : rgb;
  }
};

// ================= DIN99 (DIN 6176) on top of D65 Lab =================
export const DIN99 = {
  fromLin(rgb) { const [L, a, b] = Lab.fromLin(rgb), c = Math.cos(16*D2R), s = Math.sin(16*D2R);
    const e = a*c + b*s, f = 0.7*(b*c - a*s), G = Math.hypot(e, f), k = G === 0 ? 0 : Math.log1p(0.045*G)/(0.045*G);
    return [105.509*Math.log1p(0.0158*L), e*k, f*k]; },
  toLin([L99, a99, b99]) { const c = Math.cos(16*D2R), s = Math.sin(16*D2R), C99 = Math.hypot(a99, b99), G = Math.expm1(0.045*C99)/0.045;
    const k = C99 === 0 ? 0 : G/C99, e = a99*k, f = b99*k/0.7;
    return Lab.toLin([Math.expm1(L99/105.509)/0.0158, e*c - f*s, e*s + f*c]); }
};

// ================= Retro / "wrong" models =================
const M_YIQ = [[0.299, 0.587, 0.114], [0.595716, -0.274453, -0.321263], [0.211456, -0.522591, 0.311135]], M_YIQ_INV = inv3(M_YIQ);
export const YIQ = { // FCC NTSC 1953 (applied to gamma-encoded sRGB here, as in NTSC practice)
  fromLin(rgb) { const [r, g, b] = linToSrgb(rgb); return [0.299*r + 0.587*g + 0.114*b, 0.595716*r - 0.274453*g - 0.321263*b, 0.211456*r - 0.522591*g + 0.311135*b]; },
  toLin(yiq) { return srgbToLin(mul(M_YIQ_INV, yiq)); }
};

// ================= Gamut mapping (CSS Color 4 binary search w/ local MINDE, OkLCh) =================
const clip01 = v => v.map(x => Math.min(1, Math.max(0, x)));
const dEOK = (p, q) => { const A = Oklab.fromLin(p), B = Oklab.fromLin(q); return Math.hypot(A[0]-B[0], A[1]-B[1], A[2]-B[2]); };
export function gamutMap(rgb, { JND = 0.02, eps = 1e-4 } = {}) {
  if (rgb.some(Number.isNaN)) return [0, 0, 0];
  if (inGamut(rgb, 0)) return rgb;
  const [L, C0, h] = Oklch.fromLin(rgb);
  if (L >= 1) return [1, 1, 1]; if (L <= 0) return [0, 0, 0];
  let cur = rgb, clipped = clip01(cur);
  if (dEOK(clipped, cur) < JND) return clipped;
  let lo = 0, hi = C0, loIn = true;
  while (hi - lo > eps) {
    const C = (lo + hi)/2; cur = Oklch.toLin([L, C, h]);
    if (loIn && inGamut(cur, 0)) { lo = C; continue; }
    clipped = clip01(cur); const E = dEOK(clipped, cur);
    if (E < JND) { if (JND - E < eps) return clipped; loIn = false; lo = C; } else hi = C;
  }
  return clip01(cur);
}

export const SPACES = { Oklab, Oklch, Okhsl, Okhsv, Lab, LCHab, Luv, LCHuv, HSLuv, HPLuv, IPT, ICtCp, Jzazbz, JzCzhz, CAM16, CAM16UCS, HCT, DIN99, YIQ };