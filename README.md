# Open Shelf: Online Learning Resource Catalogue

Open Shelf helps people find free and freemium learning resources. It supports **UN SDG 4: Quality Education**.

The project started as a front-end catalogue and now includes authentication, roles, and a small backend.

## Features

### For everyone (after login)
- Search across title, topic tags, provider and description
- Filter by subject, level, format, cost and time commitment
- Live facet counts
- Removable filter chips, sorting, and “show more” paging
- Resource details dialog
- **My list**: save resources, set progress (To do / In progress / Done), stored in the browser
- Search and filters are kept in the URL (shareable / bookmarkable)

### Authentication
- Full login page (dark theme)
- Register new account
- Forgot password UI (demo flow)
- Session kept in `localStorage`

### Roles
| Role   | Access |
|--------|--------|
| **Admin** | Browse, My List, **Add Resource**, **Delete Resource** |
| **User**  | Browse, search, filter, My List only |

- Admin login: `admin@openshelf.com` / `admin123`
- Anyone can register; new accounts are normal users

## Tech

- **Frontend:** React 18, Vite, plain CSS
- **Backend:** Express, JWT auth, bcrypt
- **Tooling:** Vitest, concurrently, nodemon

## Run the project

One command starts both frontend and backend:

```bash
npm install
npm run dev

Frontend: http://localhost:5173
Backend:  http://localhost:5000

Other scripts:
npm run server     # backend only
npm run frontend   # frontend only
npm test           # unit tests for search/filter logic
npm run build      # production build

Project structure
src/
  components/          LoginPage, ResourceCard, FilterPanel, ...
  context/             AuthContext, SavedContext
  data/resources.js    Catalogue data (also mirrored on server)
  hooks/               useUrlFilters, useDebouncedValue
  utils/               filterResources (unit tested)
  App.jsx              Auth gate + dashboard
server/
  index.js             Express API (auth, resources)
  data/                users.js, resources.js

  Accessibility
  Skip link, landmarks, logical heading order
Native <dialog> for details
Live regions for result count and save actions
Colour is never the only signal
Visible focus, large touch targets, prefers-reduced-motion respected

Current limitations
Users and resources are stored in memory (reset when the server restarts)
Saved lists are per browser (localStorage)
Forgot-password is UI-only (no real email yet)
Level, time and cost values are approximate

