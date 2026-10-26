import { describe, it, expect } from "vitest";
import {
  EMPTY_FILTERS,
  filterResources,
  getFacetCounts,
  countActiveFilters,
  parseFilters,
  serializeFilters,
  tokenize,
} from "./filterResources";

const sample = [
  { id: "a", title: "Python Basics", provider: "Alpha", subject: "Programming", level: 1, type: "Course", cost: "Free", time: "short", tags: ["python", "intro"], description: "Start coding." },
  { id: "b", title: "Advanced Python", provider: "Beta", subject: "Programming", level: 3, type: "Reading", cost: "Free", time: "long", tags: ["python"], description: "Deep dive into the language." },
  { id: "c", title: "Calculus Notes", provider: "Gamma", subject: "Mathematics", level: 2, type: "Reading", cost: "Freemium", time: "medium", tags: ["calculus"], description: "Worked examples with python snippets." },
];

const f = (overrides) => ({ ...EMPTY_FILTERS, ...overrides });

describe("tokenize", () => {
  it("lowercases and splits on whitespace", () => {
    expect(tokenize("  Python   Basics ")).toEqual(["python", "basics"]);
  });
});

describe("filterResources", () => {
  it("returns everything for empty filters, sorted by title", () => {
    expect(filterResources(sample, f({})).map((r) => r.id)).toEqual(["a", "b", "c"].sort((x, y) => sample.find(r => r.id === x).title.localeCompare(sample.find(r => r.id === y).title)));
  });

  it("requires every search word to match (AND)", () => {
    expect(filterResources(sample, f({ q: "python basics" })).map((r) => r.id)).toEqual(["a"]);
  });

  it("ranks title matches above description matches", () => {
    const ids = filterResources(sample, f({ q: "python" })).map((r) => r.id);
    expect(ids.indexOf("c")).toBe(ids.length - 1);
  });

  it("combines groups with AND and options within a group with OR", () => {
    const result = filterResources(sample, f({ subjects: ["Programming", "Mathematics"], levels: [1, 2] }));
    expect(result.map((r) => r.id).sort()).toEqual(["a", "c"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterResources(sample, f({ q: "zzzz" }))).toEqual([]);
  });

  it("sorts by level, easiest first", () => {
    expect(filterResources(sample, f({ sort: "level" })).map((r) => r.level)).toEqual([1, 2, 3]);
  });
});

describe("getFacetCounts", () => {
  it("ignores the group's own selection so counts show what adding an option would give", () => {
    const filters = f({ subjects: ["Programming"] });
    const counts = getFacetCounts(sample, filters, "subjects");
    expect(counts).toEqual({ Programming: 2, Mathematics: 1 });
  });

  it("respects other groups and the search text", () => {
    const filters = f({ q: "python", levels: [1] });
    expect(getFacetCounts(sample, filters, "subjects")).toEqual({ Programming: 1 });
  });
});

describe("URL state", () => {
  it("round-trips filters", () => {
    const filters = f({ q: "css grid", subjects: ["Web development"], levels: [1, 2], sort: "time" });
    const parsed = parseFilters(serializeFilters(filters));
    expect(parsed).toEqual(filters);
  });

  it("ignores invalid sort and level values", () => {
    const parsed = parseFilters("?sort=nonsense&level=1|9|x");
    expect(parsed.sort).toBe("relevance");
    expect(parsed.levels).toEqual([1]);
  });

  it("serialises empty filters to an empty string", () => {
    expect(serializeFilters(EMPTY_FILTERS)).toBe("");
  });
});

describe("countActiveFilters", () => {
  it("counts selected options across groups but not the search text", () => {
    expect(countActiveFilters(f({ q: "x", subjects: ["a", "b"], costs: ["Free"] }))).toBe(3);
  });
});
