import { useSaved } from "../context/SavedContext";
import { SUBJECT_COLORS, STATUS_OPTIONS } from "../utils/subjects";
import LevelMeter from "./LevelMeter";

export default function SavedView({ resources, onOpen, onBrowse, headingRef }) {
  const { saved, setStatus, remove, clear } = useSaved();
  const items = resources
    .filter((r) => saved[r.id])
    .sort((a, b) => saved[b.id].savedAt - saved[a.id].savedAt);

  const done = items.filter((r) => saved[r.id].status === "done").length;
  const percent = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <section aria-labelledby="saved-heading" className="saved">
      <h2 id="saved-heading" tabIndex={-1} ref={headingRef}>
        My list
      </h2>

      {items.length === 0 ? (
        <div className="empty">
          <p className="empty-title">Nothing saved yet</p>
          <p>Use Save on any resource to build a study list, then track your progress here.</p>
          <button type="button" className="btn btn-primary" onClick={onBrowse}>
            Browse resources
          </button>
        </div>
      ) : (
        <>
          <div className="progress">
            <p>
              {done} of {items.length} finished
            </p>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Finished resources"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <button type="button" className="link-btn" onClick={clear}>
              Remove all
            </button>
          </div>

          <ul className="saved-list">
            {items.map((r) => (
              <li key={r.id} className="saved-item" style={{ "--spine": SUBJECT_COLORS[r.subject] }}>
                <div className="saved-main">
                  <h3>
                    <button type="button" className="card-title" onClick={() => onOpen(r)}>
                      {r.title}
                    </button>
                  </h3>
                  <p className="card-provider">
                    {r.provider}, {r.subject}
                  </p>
                  <LevelMeter level={r.level} />
                </div>
                <div className="saved-controls">
                  <label className="status-select">
                    <span>Progress<span className="visually-hidden"> for {r.title}</span></span>
                    <select value={saved[r.id].status} onChange={(e) => setStatus(r.id, e.target.value)}>
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" className="btn btn-quiet" onClick={() => remove(r)}>
                    Remove<span className="visually-hidden"> {r.title}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
