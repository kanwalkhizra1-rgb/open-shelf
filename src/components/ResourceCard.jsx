import { SUBJECT_COLORS, TIME_LABELS } from "../utils/subjects";
import Icon from "./Icon";
import LevelMeter from "./LevelMeter";

export default function ResourceCard({ resource, isSaved, onToggleSave, onOpen }) {
  const { title, provider, subject, type, cost, time, description, level } = resource;
  return (
    <li className="card" style={{ "--spine": SUBJECT_COLORS[subject] }}>
      <p className="card-subject">{subject}</p>
      <h3>
        <button type="button" className="card-title" onClick={() => onOpen(resource)}>
          {title}
        </button>
      </h3>
      <p className="card-provider">{provider}</p>
      <p className="card-desc">{description}</p>
      <ul className="meta" aria-label="Details">
        <li>
          <LevelMeter level={level} />
        </li>
        <li>{type}</li>
        <li>{TIME_LABELS[time]}</li>
        <li className={cost === "Free" ? "cost free" : "cost"}>{cost}</li>
      </ul>
      <div className="card-actions">
        <button type="button" className="btn btn-quiet" onClick={() => onOpen(resource)}>
          View details
          <span className="visually-hidden"> for {title}</span>
        </button>
        <button
          type="button"
          className={isSaved ? "btn btn-save is-saved" : "btn btn-save"}
          aria-pressed={isSaved}
          onClick={() => onToggleSave(resource)}
        >
          <Icon name="bookmark" size={16} filled={isSaved} />
          {isSaved ? "Saved" : "Save"}
          <span className="visually-hidden"> {title}</span>
        </button>
      </div>
    </li>
  );
}
