import { LEVEL_LABELS, TIME_LABELS } from "../utils/subjects";
import Icon from "./Icon";

const LABEL = {
  levels: (v) => LEVEL_LABELS[v],
  times: (v) => TIME_LABELS[v],
};

export default function ActiveFilters({ filters, onRemove }) {
  const chips = [];
  for (const key of ["subjects", "levels", "types", "costs", "times"]) {
    for (const value of filters[key]) {
      chips.push({ key, value, label: LABEL[key] ? LABEL[key](value) : value });
    }
  }
  if (chips.length === 0) return null;
  return (
    <ul className="chips" aria-label="Active filters">
      {chips.map((c) => (
        <li key={`${c.key}-${c.value}`}>
          <button type="button" className="chip" onClick={() => onRemove(c.key, c.value)}>
            {c.label}
            <span className="visually-hidden"> – remove filter</span>
            <Icon name="close" size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}
