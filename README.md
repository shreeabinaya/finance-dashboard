# FinTrack — Finance Dashboard

A production-grade personal finance dashboard built with React, featuring Role-Based Access Control (RBAC), advanced filtering, data persistence, analytics charts, and a polished dark/light UI.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

> **Requirements:** Node.js 18+ and npm 9+

---

## Feature Overview

### Role-Based Access Control (RBAC)
- **Admin** — Full access: add, edit, delete transactions; export data
- **Viewer** — Read-only: browse, filter, and view all data; no mutations allowed
- Role is switchable via the top bar pill toggle; UI re-renders reactively
- A persistent warning banner appears in Viewer mode with a one-click role upgrade

### Transactions
- Full CRUD (Create, Read, Update, Delete) for Admin
- Paginated table (10 per page) with sortable columns (date, description, category, amount)
- Advanced filter panel: search by keyword, filter by category / month / type / amount range
- Filter count badge shows active filters at a glance
- Confirmation modal for destructive deletes
- Export filtered data as **CSV** or **JSON**

### Insights
- 6 auto-computed smart cards: top category, MoM change, savings rate, avg spend, largest expense, latest income
- Contextual advice text (e.g. "Your savings rate is below 20%…")
- Visual category breakdown with animated progress bars and percentage labels

### Analytics (Charts)
- **Bar chart** — Monthly income vs expenses side-by-side
- **Donut chart** — Spending distribution by category
- **Line chart** — Net savings trend over time
- **Cumulative bar** — Running income vs expense totals
- All charts re-render on dark mode toggle with correct contrast colours

### Overview
- 4 KPI stat cards: Net Balance, Total Income, Total Expenses, Savings Rate
- Monthly summary table with inline progress bars for savings rate
- Quick fact cards for top category, avg monthly spend, MoM delta

---

## Architecture & Technical Decisions

### State Management — `useReducer` + Context API
Rather than Redux or Zustand (overkill for this scope), I used a single `useReducer` inside a Context provider. This gives:
- Predictable, action-driven state transitions (like Redux) with zero boilerplate
- A single source of truth for: `transactions`, `role`, `filters`, `sortBy/Dir`, `activeTab`, `darkMode`, `notification`
- Easy testability — the reducer is a pure function

```
AppContext
  ├── state (single object)
  ├── dispatch (action → new state)
  ├── notify() (toast helper with auto-dismiss)
  └── getFilteredSorted() (memoised derived data)
```

### Data Persistence — `localStorage`
State is serialised to `localStorage` on every change. On mount, the saved snapshot is merged with defaults. This means transactions, role, and dark mode survive page refreshes — no backend needed.

### Component Architecture

```
src/
├── components/
│   ├── ui/          # Reusable primitives: Button, Badge, Card, Modal, StatCard…
│   ├── Sidebar      # Navigation + dark mode toggle
│   ├── TopBar       # Role switcher, RBAC banner, toast notifications
│   └── TxForm       # Add/Edit transaction modal with validation
├── context/
│   └── AppContext   # Global state (useReducer + localStorage)
├── data/
│   └── mockData     # 30 seed transactions across 10 categories
├── pages/
│   ├── Overview     # KPI cards + monthly summary table
│   ├── Transactions # Advanced table with filters, sort, pagination, CRUD
│   ├── Insights     # Smart insight cards + category breakdown bars
│   └── Charts       # 4 Chart.js visualisations
└── utils/
    └── helpers      # Pure functions: metrics, insights, export, formatting
```

### CSS Strategy — CSS Modules + Custom Properties
- **CSS Modules** for component-scoped styles (zero class name collisions)
- **CSS Custom Properties** (variables) for theming — swapping `data-theme="dark"` on `<html>` instantly re-themes every component
- No CSS-in-JS runtime overhead; no Tailwind class explosion
- Consistent design tokens: spacing, radius, shadow, colour

### Mock API Simulation
The `TxForm` simulates a 450ms API call (with a spinner) before committing the action — demonstrating how real async flows would work without a backend.

---

## RBAC Behaviour Table

| Action             | Admin | Viewer |
|--------------------|-------|--------|
| View transactions  | ✓     | ✓      |
| Filter & search    | ✓     | ✓      |
| Export CSV/JSON    | ✓     | ✓      |
| Add transaction    | ✓     | ✗      |
| Edit transaction   | ✓     | ✗      |
| Delete transaction | ✓     | ✗      |
| "+ New" button     | shown | hidden |
| Edit/Del buttons   | shown | hidden |
| Warning banner     | ✗     | shown  |

---

## Optional Enhancements Implemented

| Feature                  | Status |
|--------------------------|--------|
| Dark mode                | ✅ Full theme with CSS variables |
| Data persistence         | ✅ localStorage auto-save |
| Mock API integration     | ✅ Simulated async with spinner |
| Animations & transitions | ✅ Staggered fade-slide on all cards |
| Export CSV               | ✅ Filtered data |
| Export JSON              | ✅ Filtered data |
| Advanced filtering       | ✅ 6-field filter panel with active count |
| Sorting                  | ✅ 4 columns, asc/desc toggle |
| Pagination               | ✅ 10 per page with page nav |

---

## Design Decisions

- **Font:** DM Sans (body) + DM Mono (amounts) — distinct, readable, professional
- **Colour system:** 9-token semantic palette (base, surface, elevated, border, accent, green, red, amber) — works in both light and dark mode without any colour hardcoding
- **Sidebar navigation** with active pip indicator and smooth tab transitions
- **Toast notifications** for all user actions (add, edit, delete, role switch)
- **Responsive:** sidebar collapses to hamburger menu on mobile; all grids use `auto-fit minmax` 
- **Empty states:** every list handles zero-data gracefully with icon + copy + action button
- **Accessibility:** keyboard-accessible modals (Escape to close), focus states, semantic HTML

---

## Assumptions Made

1. Data is seeded with 30 realistic transactions across Jan–Mar 2025; April has partial data
2. "Month" filter uses ISO year-month prefix matching (e.g. `2025-03`)
3. Amounts are signed: negative = expense, positive = income — the form UI enforces this via the type toggle
4. No authentication layer — role switching is purely demonstrative as specified
5. Charts use Chart.js 4 (UMD) registered globally for simplicity

---

## Running Tests (Future)

The pure utility functions in `src/utils/helpers.js` and the reducer in `AppContext.jsx` are designed to be unit-tested with Vitest + React Testing Library:

```bash
npm install -D vitest @testing-library/react
npx vitest
```

---

*Built with React 18, Vite 5, Chart.js 4, and CSS Modules.*
