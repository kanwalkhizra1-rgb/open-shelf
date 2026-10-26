import { useEffect, useRef } from "react";
import { useSaved } from "../context/SavedContext";
import { SUBJECT_COLORS, STATUS_OPTIONS, TIME_LABELS } from "../utils/subjects";
import Icon from "./Icon";
import LevelMeter from "./LevelMeter";

// Uses the native <dialog> element: focus is trapped, Escape closes it, and
// focus returns to the button that opened it.
export default function ResourceDialog({ resource, onClose }) {
  const ref = useRef(null);
  const { saved, toggle, setStatus } = useSaved();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (resource && !dialog.open) dialog.showModal();
    if (!resource && dialog.open) dialog.close();
  }, [resource]);

  const entry = resource ? saved[resource.id] : null;

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      {resource && (
        <div className="dialog-body" style={{ "--spine": SUBJECT_COLORS[resource.subject] }}>
          <div className="dialog-head">
            <div>
              <p className="card-subject">{resource.subject}</p>
              <h2 id="dialog-title">{resource.title}</h2>
              <p className="card-provider">{resource.provider}</p>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close details">
              <Icon name="close" />
            </button>
          </div>

          <p className="dialog-desc">{resource.description}</p>

          <dl className="facts">
            <div>
              <dt>Level</dt>
              <dd><LevelMeter level={resource.level} /></dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{resource.type}</dd>
            </div>
            <div>
              <dt>Time commitment</dt>
              <dd>{TIME_LABELS[resource.time]}</dd>
            </div>
            <div>
              <dt>Cost</dt>
              <dd>{resource.cost}</dd>
            </div>
          </dl>

          <ul className="tags" aria-label="Topics">
            {resource.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className="dialog-actions">
            <a className="btn btn-primary" href={resource.url} target="_blank" rel="noopener noreferrer">
              Open resource
              <Icon name="external" size={16} />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <button
              type="button"
              className={entry ? "btn btn-save is-saved" : "btn btn-save"}
              aria-pressed={Boolean(entry)}
              onClick={() => toggle(resource)}
            >
              <Icon name="bookmark" size={16} filled={Boolean(entry)} />
              {entry ? "Saved to my list" : "Save to my list"}
            </button>
            {entry && (
              <label className="status-select">
                <span>Progress</span>
                <select value={entry.status} onChange={(e) => setStatus(resource.id, e.target.value)}>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
