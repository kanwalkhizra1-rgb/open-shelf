import Icon from "./Icon";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search" role="search">
      <label htmlFor="search-input" className="search-label">
        Search resources
      </label>
      <div className="search-field">
        <Icon name="search" size={20} />
        <input
          id="search-input"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by topic, e.g. python"
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button type="button" className="icon-btn" onClick={() => onChange("")} aria-label="Clear search">
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
