import { useEffect, useMemo, useRef, useState } from "react";
import { resources } from "./data/resources";
import { useUrlFilters } from "./hooks/useUrlFilters";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useSaved } from "./context/SavedContext";
import {
  FACET_FIELDS,
  countActiveFilters,
  filterResources,
  getFacetCounts,
  hasAnyFilter,
} from "./utils/filterResources";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import ActiveFilters from "./components/ActiveFilters";
import ResourceCard from "./components/ResourceCard";
import ResourceDialog from "./components/ResourceDialog";
import SavedView from "./components/SavedView";
import Icon from "./components/Icon";

const PAGE_SIZE = 12;

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="6" height="20" rx="1" fill="#FFD84D" />
      <rect x="13" y="6" width="6" height="20" rx="1" fill="#fff" />
      <rect x="22" y="10" width="6" height="16" rx="1" fill="#fff" />
    </svg>
  );
}

export default function App() {
  const { filters, setQuery, setSort, toggleOption, clearFacets, clearAll } = useUrlFilters();
  const { saved, toggle, message } = useSaved();

  // The search box updates instantly; the filters update after a short pause.
  const [text, setText] = useState(filters.q);
  const debouncedText = useDebouncedValue(text, 200);
  useEffect(() => setQuery(debouncedText), [debouncedText, setQuery]);

  const [view, setView] = useState(() => (window.location.hash === "#my-list" ? "saved" : "browse"));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const savedHeadingRef = useRef(null);
  const browseHeadingRef = useRef(null);
  const firstRender = useRef(true);

  const results = useMemo(() => filterResources(resources, filters), [filters]);
  const counts = useMemo(() => {
    const out = {};
    for (const key of Object.keys(FACET_FIELDS)) out[key] = getFacetCounts(resources, filters, key);
    return out;
  }, [filters]);

  const activeCount = countActiveFilters(filters);
  const savedCount = Object.keys(saved).length;

  // Back to the first page whenever the result set changes.
  useEffect(() => setVisible(PAGE_SIZE), [filters]);

  // Keep the view in the URL hash and move focus to the new heading for keyboard and screen reader users.
  useEffect(() => {
    const hash = view === "saved" ? "#my-list" : "";
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search + hash);
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    (view === "saved" ? savedHeadingRef : browseHeadingRef).current?.focus();
  }, [view]);

  const handleClearAll = () => {
    setText("");
    clearAll();
  };

  const shown = results.slice(0, visible);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to results
      </a>

      <header className="site-header">
        <div className="wrap header-inner">
          <div className="brand">
            <Logo />
            <div>
              <p className="brand-name">Open Shelf</p>
              <p className="brand-tag">Free learning resources, filtered to fit you</p>
            </div>
          </div>
          <nav aria-label="Main">
            <ul className="tabs">
              <li>
                <button
                  type="button"
                  className="tab"
                  aria-current={view === "browse" ? "page" : undefined}
                  onClick={() => setView("browse")}
                >
                  Browse
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="tab"
                  aria-current={view === "saved" ? "page" : undefined}
                  onClick={() => setView("saved")}
                >
                  My list
                  <span className="count-badge" aria-label={`${savedCount} saved`}>
                    {savedCount}
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        {view === "browse" && (
          <div className="wrap">
            <SearchBar value={text} onChange={setText} />
          </div>
        )}
      </header>

      <main id="main" className="wrap">
        {view === "saved" ? (
          <SavedView
            resources={resources}
            onOpen={setSelected}
            onBrowse={() => setView("browse")}
            headingRef={savedHeadingRef}
          />
        ) : (
          <div className="layout">
            <aside className="sidebar">
              <button
                type="button"
                className="btn btn-quiet filters-toggle"
                aria-expanded={filtersOpen}
                aria-controls="filter-panel"
                onClick={() => setFiltersOpen((o) => !o)}
              >
                <Icon name="filter" size={16} />
                Filters{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
              <div id="filter-panel" className={filtersOpen ? "filter-wrap open" : "filter-wrap"}>
                <FilterPanel
                  filters={filters}
                  counts={counts}
                  onToggle={toggleOption}
                  onClear={clearFacets}
                  activeCount={activeCount}
                />
              </div>
            </aside>

            <section aria-labelledby="results-heading" className="results">
              <div className="results-bar">
                <h2 id="results-heading" tabIndex={-1} ref={browseHeadingRef}>
                  Resources
                </h2>
                <p role="status" className="result-count">
                  {results.length} {results.length === 1 ? "resource matches" : "resources match"}
                </p>
                <label className="sort">
                  <span>Sort by</span>
                  <select value={filters.sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="relevance">Best match</option>
                    <option value="title">Title A to Z</option>
                    <option value="level">Easiest first</option>
                    <option value="time">Shortest first</option>
                  </select>
                </label>
              </div>

              <ActiveFilters filters={filters} onRemove={toggleOption} />

              {results.length === 0 ? (
                <div className="empty">
                  <p className="empty-title">No resources match these filters</p>
                  <p>
                    {filters.q.trim()
                      ? `Nothing found for “${filters.q.trim()}” with the current filters. Try a shorter search or remove a filter.`
                      : "Try removing a filter to see more."}
                  </p>
                  {hasAnyFilter(filters) && (
                    <button type="button" className="btn btn-primary" onClick={handleClearAll}>
                      Clear search and filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <ul className="grid">
                    {shown.map((r) => (
                      <ResourceCard
                        key={r.id}
                        resource={r}
                        isSaved={Boolean(saved[r.id])}
                        onToggleSave={toggle}
                        onOpen={setSelected}
                      />
                    ))}
                  </ul>
                  {visible < results.length && (
                    <div className="more">
                      <button type="button" className="btn btn-quiet" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                        Show more ({results.length - visible} left)
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="wrap site-footer">
        <p>
          Open Shelf supports UN Sustainable Development Goal 4, quality education, by making free learning easier to
          find. Time and level are approximate. Check each provider for current details.
        </p>
      </footer>

      <ResourceDialog resource={selected} onClose={() => setSelected(null)} />

      <p className="visually-hidden" role="status" aria-live="polite">
        {message}
      </p>
    </>
  );
}
