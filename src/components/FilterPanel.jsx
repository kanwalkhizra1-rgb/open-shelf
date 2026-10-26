import { COSTS, LEVELS, SUBJECTS, TIMES, TYPES } from "../data/resources";
import { SUBJECT_COLORS } from "../utils/subjects";

function Group({ legend, groupKey, options, selected, counts, onToggle, showSwatch }) {
  return (
    <fieldset className="facet">
      <legend>{legend}</legend>
      <ul>
        {options.map(({ value, label }) => {
          const count = counts[value] || 0;
          const checked = selected.includes(value);
          const id = `f-${groupKey}-${String(value).replace(/\W+/g, "-")}`;
          return (
            <li key={String(value)} className={count === 0 && !checked ? "dim" : ""}>
              <input id={id} type="checkbox" checked={checked} onChange={() => onToggle(groupKey, value)} />
              <label htmlFor={id}>
                {showSwatch && (
                  <span className="swatch" style={{ background: SUBJECT_COLORS[value] }} aria-hidden="true" />
                )}
                <span className="facet-name">{label}</span>
                <span className="facet-count" aria-label={`${count} results`}>
                  {count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

const asOptions = (list) => list.map((v) => ({ value: v, label: v }));

export default function FilterPanel({ filters, counts, onToggle, onClear, activeCount }) {
  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Filters">
      <div className="filters-head">
        <h2>Filters</h2>
        <button type="button" className="link-btn" onClick={onClear} disabled={activeCount === 0}>
          Clear filters
        </button>
      </div>
      <Group legend="Subject" groupKey="subjects" options={asOptions(SUBJECTS)} selected={filters.subjects} counts={counts.subjects} onToggle={onToggle} showSwatch />
      <Group legend="Level" groupKey="levels" options={LEVELS} selected={filters.levels} counts={counts.levels} onToggle={onToggle} />
      <Group legend="Format" groupKey="types" options={asOptions(TYPES)} selected={filters.types} counts={counts.types} onToggle={onToggle} />
      <Group legend="Cost" groupKey="costs" options={asOptions(COSTS)} selected={filters.costs} counts={counts.costs} onToggle={onToggle} />
      <Group legend="Time commitment" groupKey="times" options={TIMES} selected={filters.times} counts={counts.times} onToggle={onToggle} />
    </form>
  );
}
