// Pure functions for searching, filtering, sorting and counting resources.
// Keeping this logic outside React makes it easy to unit test.

export const EMPTY_FILTERS = {
  q: "",
  subjects: [],
  levels: [],
  types: [],
  costs: [],
  times: [],
  sort: "relevance",
};

// Maps each filter key to the resource field it checks.
export const FACET_FIELDS = {
  subjects: "subject",
  levels: "level",
  types: "type",
  costs: "cost",
  times: "time",
};

const TIME_ORDER = { short: 1, medium: 2, long: 3 };

export function tokenize(query) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

// Every search word must appear somewhere (AND logic). Matches in the title
// are worth more than matches in tags, provider or description.
export function scoreResource(resource, tokens) {
  if (tokens.length === 0) return 1;
  const title = resource.title.toLowerCase();
  const provider = resource.provider.toLowerCase();
  const tags = resource.tags.join(" ").toLowerCase();
  const description = resource.description.toLowerCase();
  const subject = resource.subject.toLowerCase();

  let total = 0;
  for (const token of tokens) {
    let best = 0;
    if (title.includes(token)) best = Math.max(best, 4);
    if (tags.includes(token)) best = Math.max(best, 3);
    if (provider.includes(token)) best = Math.max(best, 2);
    if (subject.includes(token)) best = Math.max(best, 2);
    if (description.includes(token)) best = Math.max(best, 1);
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

function passesFacets(resource, filters, skipKey) {
  for (const [key, field] of Object.entries(FACET_FIELDS)) {
    if (key === skipKey) continue;
    const selected = filters[key];
    if (selected.length > 0 && !selected.includes(resource[field])) return false;
  }
  return true;
}

function sortResults(scored, sort) {
  const list = [...scored];
  const byTitle = (a, b) => a.resource.title.localeCompare(b.resource.title);
  switch (sort) {
    case "title":
      return list.sort(byTitle);
    case "level":
      return list.sort((a, b) => a.resource.level - b.resource.level || byTitle(a, b));
    case "time":
      return list.sort(
        (a, b) => TIME_ORDER[a.resource.time] - TIME_ORDER[b.resource.time] || byTitle(a, b)
      );
    default:
      return list.sort((a, b) => b.score - a.score || byTitle(a, b));
  }
}

export function filterResources(resources, filters) {
  const tokens = tokenize(filters.q);
  const scored = [];
  for (const resource of resources) {
    if (!passesFacets(resource, filters)) continue;
    const score = scoreResource(resource, tokens);
    if (score > 0) scored.push({ resource, score });
  }
  return sortResults(scored, filters.sort).map((s) => s.resource);
}

// Counts for one facet group, ignoring that group's own selection, so users can
// see how many results they would get by adding another option to the group.
export function getFacetCounts(resources, filters, key) {
  const field = FACET_FIELDS[key];
  const tokens = tokenize(filters.q);
  const counts = {};
  for (const resource of resources) {
    if (!passesFacets(resource, filters, key)) continue;
    if (scoreResource(resource, tokens) === 0) continue;
    counts[resource[field]] = (counts[resource[field]] || 0) + 1;
  }
  return counts;
}

export function countActiveFilters(filters) {
  return Object.keys(FACET_FIELDS).reduce((sum, key) => sum + filters[key].length, 0);
}

export function hasAnyFilter(filters) {
  return filters.q.trim() !== "" || countActiveFilters(filters) > 0;
}

// ---- URL <-> filters, so a search can be bookmarked or shared ----

const LIST_PARAMS = {
  subjects: "subject",
  levels: "level",
  types: "type",
  costs: "cost",
  times: "time",
};

const VALID_SORTS = ["relevance", "title", "level", "time"];

export function parseFilters(search) {
  const params = new URLSearchParams(search);
  const filters = { ...EMPTY_FILTERS };
  filters.q = params.get("q") || "";
  for (const [key, param] of Object.entries(LIST_PARAMS)) {
    const raw = params.get(param);
    let values = raw ? raw.split("|").filter(Boolean) : [];
    if (key === "levels") values = values.map(Number).filter((n) => [1, 2, 3].includes(n));
    filters[key] = values;
  }
  const sort = params.get("sort");
  filters.sort = VALID_SORTS.includes(sort) ? sort : "relevance";
  return filters;
}

export function serializeFilters(filters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  for (const [key, param] of Object.entries(LIST_PARAMS)) {
    if (filters[key].length) params.set(param, filters[key].join("|"));
  }
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  const text = params.toString();
  return text ? `?${text}` : "";
}
