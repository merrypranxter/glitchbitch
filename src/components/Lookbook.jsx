import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Modal from "./Modal";
import { looks, paletteName } from "../data";
import { createRenderer } from "../renderer";
export default function Lookbook({ onClose, onApply }) {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(looks.map((look) => look.family || "Original"))];
  const [thumbs, setThumbs] = useState({}),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true,
      renderer,
      job;
    const canvas = document.createElement("canvas");
    let i = 0;
    try {
      renderer = createRenderer(canvas);
    } catch (e) {
      setError(e.message);
      return;
    }
    function draw() {
      if (!active || i >= looks.length) return;
      const n = i++;
      try {
        const current = looks[n].state;
        if (current.afterimage > 0 || current.datamosh > 0) {
          renderer.resetFeedback();
          // Render temporal history for an honest thumbnail, not a blank first frame.
          for (let step = 0; step < 6; step++)
            renderer.draw(current, { time: 3.7 + step * .06, colorTime: 3.7 + step * .06 }, 240, 160);
        } else {
          renderer.draw(current, { time: 4, colorTime: 4 }, 240, 160);
        }
        const data = canvas.toDataURL("image/jpeg", 0.85);
        if (active) setThumbs((old) => ({ ...old, [n]: data }));
        job = setTimeout(draw, 30);
      } catch (e) {
        setError(e.message);
      }
    }
    job = setTimeout(draw, 40);
    return () => {
      active = false;
      clearTimeout(job);
      renderer?.destroy(true);
    };
  }, []);
  return (
    <Modal
      wide
      title="Start somewhere strange."
      subtitle={`${looks.length} starting points. Every setting is still yours to change.`}
      onClose={onClose}
    >
      <div className="look-families" role="group" aria-label="Filter looks by visual family">
        {categories.map((family) => (
          <button
            type="button"
            key={family}
            className={category === family ? "selected" : ""}
            aria-pressed={category === family}
            onClick={() => setCategory(family)}
          >
            {family}
          </button>
        ))}
      </div>
      <div className="look-grid">
        {looks.map((look, i) => ({ look, i })).filter(({ look }) => category === "All" || (look.family || "Original") === category).map(({ look, i }) => (
          <button
            className="look"
            key={look.name}
            onClick={() => onApply(look)}
          >
            <div className="look-image">
              {thumbs[i] ? (
                <img src={thumbs[i]} alt={`${look.name} generative artwork`} />
              ) : (
                <div className="look-loading">
                  {error ? "Preview unavailable" : "Growing a little chaos…"}
                </div>
              )}
              <span>
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div className="look-title">
              {look.name}
              <ArrowUpRight size={16} />
            </div>
            <p>{look.note}</p>
            <small>{look.family || "Original"} · {paletteName(look.state)}</small>
          </button>
        ))}
      </div>
      <div className="modal-footnote">
        Applying a look is undoable. Your touch sources and current aspect ratio
        are preserved.
      </div>
    </Modal>
  );
}
