# Open Shelf: Online Learning Resource Catalogue

Front-end artefact which supports **UN SDG 4: Quality Education** by making free learning resources easier to find.

## What it does
- Search across title, topic tags, provider and description (every word must match; title matches rank highest)
- Filter by subject, level, format, cost and time commitment; options within a group combine with OR, groups combine with AND
- Live facet counts that show how many results each option would give
- Removable filter chips, sort options, "show more" paging
- Details dialog for each resource
- "My list": save resources, set progress (To do / In progress / Done), see a progress bar; stored in localStorage
- Search and filters are kept in the URL, so a search can be bookmarked or shared

## Tech
React 18, Vite, plain CSS (design tokens in `:root`), Vitest. No back end: the catalogue is a static data file (`src/data/resources.js`).

## Run it
```bash
npm install
npm run dev      # development server
npm test         # unit tests for the search/filter logic
npm run build    # production build in dist/
```

## Structure
```
src/
  data/resources.js          catalogue data and option lists
  utils/filterResources.js   pure search, filter, sort, facet-count and URL functions (unit tested)
  hooks/                     useUrlFilters, useDebouncedValue
  context/SavedContext.jsx   useReducer store for "My list", persisted to localStorage
  components/                SearchBar, FilterPanel, ActiveFilters, ResourceCard, ResourceDialog, SavedView, ...
  App.jsx                    page composition and state wiring
```

## Accessibility decisions
- Skip link, landmarks and a logical heading order
- Native `<dialog>` for details (focus trap, Escape to close, focus returns to the opener)
- Result count announced through a polite live region; save/remove actions announced too
- Colour is never the only signal: subject and level are always written out
- Visible keyboard focus, 44px touch targets, `prefers-reduced-motion` respected

## Limitations
- Level, time and cost values are approximate and hand-curated. Check each provider for current details.
- No back end or accounts, so saved lists are per browser.
- Ratings and user reviews are out of scope for a front-end-only build.
