import React, { useEffect, useRef, useState } from "react";
import { Search, CornerDownLeft, X } from "lucide-react";
import { findControls } from "../ui-index";

const suggestions = ["scanlines", "gradient", "outline", "kaleidoscope", "background", "blend mode", "palette", "3d"];

/** Ctrl/Cmd+K or "/" — type what you want, jump straight to it. */
export default function FindControl({ onPick, onClose }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef(null);
  const results = findControls(query);
  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => setCursor(0), [query]);
  function key(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      onPick(results[cursor]);
    }
  }
  return (
    <div className="find-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="find-dialog" role="dialog" aria-modal="true" aria-label="Find a control">
        <div className="find-input">
          <Search size={16} />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={key}
            placeholder="Find a control… try “scanlines” or “outline”"
            aria-label="Find a control"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="find-results"
            aria-activedescendant={results[cursor] ? `find-${results[cursor].id}` : undefined}
          />
          <button type="button" className="icon-button" onClick={onClose} title="Close (Esc)">
            <X size={15} />
          </button>
        </div>
        {query.trim() === "" ? (
          <div className="find-suggest">
            <span>Try</span>
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => setQuery(s)}>{s}</button>
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="find-empty">Nothing called “{query}”. Try a simpler word.</p>
        ) : (
          <ul id="find-results" role="listbox" className="find-results">
            {results.map((r, i) => (
              <li key={r.kind + r.id} id={`find-${r.id}`} role="option" aria-selected={i === cursor}>
                <button
                  type="button"
                  className={i === cursor ? "active" : ""}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => onPick(r)}
                >
                  <span className="find-where">{r.kind === "action" ? "Action" : r.tab}</span>
                  <span className="find-title">
                    {r.title}
                    {r.matched && r.matched.toLowerCase() !== r.title.toLowerCase() && (
                      <small>{r.matched}</small>
                    )}
                  </span>
                  {i === cursor && <CornerDownLeft size={13} />}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="find-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>Enter</kbd> jump</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
