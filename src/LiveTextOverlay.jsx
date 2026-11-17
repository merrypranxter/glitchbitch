import React from "react";
import { getRetroFont } from "./retro-fonts.js";

/**
 * HTML typography overlay. Independent of both WebGL and Canvas2D paint loops,
 * so typing must be immediately visible whenever React receives the state.
 * PNG/GIF/MP4 retain the matching Canvas2D compositor in export.js.
 */
export default function LiveTextOverlay({ state, width, height }) {
  const layers = [
    { ...state, text: state.lettering, visible: true },
    ...(state.letteringLayers || []).slice(0, 2)
  ];
  const minEdge = Math.max(1, Math.min(width || 1, height || 1));
  return (
    <div className="live-type-root" aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
      {layers.map((layer, index) => {
        const text = typeof layer.text === "string" ? layer.text : "";
        if (!text.trim() || layer.visible === false) return null;
        const opacity = Math.max(0, Math.min(1, Number(layer.letteringAmount ?? 46) / 100));
        if (opacity <= 0) return null;
        const font = getRetroFont(layer.letteringFont);
        const zoom = Math.max(0, Math.min(1, Number(layer.letteringScale ?? 48) / 100));
        const size = Math.max(13, Math.min(minEdge * 0.24, 132) * (0.63 + 0.34 * zoom));
        const x = Math.max(0, Math.min(100, Number(layer.letteringX ?? 50)));
        const y = Math.max(0, Math.min(100, Number(layer.letteringY ?? 50)));
        const rotation = Number(layer.letteringRotation ?? 0);
        const sx = Math.max(0.25, Number(layer.letteringStretchX ?? 100) / 100);
        const sy = Math.max(0.25, Number(layer.letteringStretchY ?? 100) / 100);
        const motion = Math.max(0, Number(layer.letteringMotion || 0) / 100);
        const fill = /^#[0-9a-f]{6}$/i.test(layer.letteringFill || "")
          ? layer.letteringFill : "#ffffff";
        const stops = Array.isArray(layer.letteringGradient)
          ? layer.letteringGradient.filter(c => /^#[0-9a-f]{6}$/i.test(c)) : [];
        const gradient = layer.letteringFillMode === "Radial gradient"
          ? `radial-gradient(circle, ${stops.join(", ")})`
          : `linear-gradient(${90 + Number(layer.letteringGradientAngle || 0)}deg, ${stops.join(", ")})`;
        const useGradient = layer.letteringFillMode !== "Solid" && stops.length >= 2;
        const shared = {
          whiteSpace: "pre-wrap", overflowWrap: "anywhere", textAlign: "center",
          fontFamily: font.family, fontWeight: font.weight,
          fontSize: size, lineHeight: 1.18, letterSpacing: 0,
          width: "100%", display: "block"
        };
        const strokes = (layer.letteringStrokes || [])
          .filter(s => s?.enabled && Number(s.width) > 0)
          .slice(0, 5);
        let cumulative = 0;
        const rings = strokes.map((ring, i) => {
          cumulative += Number(ring.width);
          return { ...ring, total: cumulative, key: i };
        }).reverse();
        return (
          <div key={layer.id || index} className="live-type-layer"
            style={{
              position: "absolute", zIndex: index + 1,
              left: `${x}%`, top: `${100 - y}%`, width: "70%",
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${sx}, ${sy})`,
              transformOrigin: "center center", opacity,
              pointerEvents: "none", userSelect: "none", WebkitUserSelect: "none"
            }}>
            <div style={{
              position: "relative", width: "100%",
              animation: motion > 0.01 ? `live-type-drift ${(4 / (0.45 + motion)).toFixed(2)}s ease-in-out infinite alternate` : "none"
            }}>
              {rings.map(ring => (
                <span key={ring.key} style={{
                  ...shared, position: "absolute", inset: 0,
                  color: ring.color || "#000000",
                  WebkitTextFillColor: ring.color || "#000000",
                  WebkitTextStroke: `${2 * ring.total}px ${ring.color || "#000000"}`
                }}>{text}</span>
              ))}
              <span style={{
                ...shared, position: "relative",
                color: useGradient ? "transparent" : fill,
                WebkitTextFillColor: useGradient ? "transparent" : fill,
                backgroundImage: useGradient ? gradient : "none",
                backgroundClip: useGradient ? "text" : "border-box",
                WebkitBackgroundClip: useGradient ? "text" : "border-box"
              }}>{text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
