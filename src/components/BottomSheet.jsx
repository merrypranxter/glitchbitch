import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * A phone "drawer" that slides up from the bottom. Uses a native <dialog>
 * so Escape, focus trapping and screen readers behave, but it does NOT pause
 * the artwork: a light backdrop keeps the art visible while you change the
 * seed, ratio or quality and watch it update live behind the sheet.
 */
export default function BottomSheet({ title, subtitle, onClose, children, className = "" }) {
  const ref = useRef(null),
    headingId = React.useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal?.();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={"sheet " + className}
      aria-labelledby={headingId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Tap the dimmed area above the sheet to dismiss it.
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="sheet-body">
        <div className="sheet-grabber" aria-hidden="true" />
        <div className="sheet-heading">
          <div>
            <h2 id={headingId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="sheet-scroll">{children}</div>
      </div>
    </dialog>
  );
}
