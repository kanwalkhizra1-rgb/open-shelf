import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_FILTERS,
  FACET_FIELDS,
  parseFilters,
  serializeFilters,
} from "../utils/filterResources";

// Holds the filter state and mirrors it into the address bar (?q=...&subject=...),
// so any search can be bookmarked or shared. Uses replaceState so the back
// button is not filled with one entry per keystroke.
export function useUrlFilters() {
  const [filters, setFilters] = useState(() => parseFilters(window.location.search));

  useEffect(() => {
    const next = serializeFilters(filters) + window.location.hash;
    const current = window.location.search + window.location.hash;
    if (next !== current) {
      window.history.replaceState(null, "", next || window.location.pathname);
    }
  }, [filters]);

  const setQuery = useCallback((q) => setFilters((f) => (f.q === q ? f : { ...f, q })), []);
  const setSort = useCallback((sort) => setFilters((f) => ({ ...f, sort })), []);

  const toggleOption = useCallback((key, value) => {
    setFilters((f) => {
      const has = f[key].includes(value);
      return { ...f, [key]: has ? f[key].filter((v) => v !== value) : [...f[key], value] };
    });
  }, []);

  const clearFacets = useCallback(() => {
    setFilters((f) => {
      const next = { ...f };
      for (const key of Object.keys(FACET_FIELDS)) next[key] = [];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setFilters({ ...EMPTY_FILTERS }), []);

  return { filters, setQuery, setSort, toggleOption, clearFacets, clearAll };
}
