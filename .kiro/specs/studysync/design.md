# StudySync – Technical Design Specification

## 1. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + Vite | Fast dev server, HMR, small bundle |
| Language | JavaScript (ES2022) | No type overhead for a personal project |
| Styling | Tailwind CSS v3 + custom CSS variables | Utility-first + neumorphic shadow tokens |
| Routing | React Router v6 | Declarative routes, nested layouts |
| State / Storage | React Context + `localStorage` | No external state lib needed at this scale |
| Icons | Lucide React | Lightweight, consistent SVG icons |
| Testing | Vitest + React Testing Library + fast-check | Unit, component, integration, PBT |
| Build | Vite | Bundler and dev server |

---

## 2. Project Structure

```
studysync/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/           # Button, Input, Card, Modal, Badge, ProgressBar
│   │   ├── layout/           # AppLayout, Sidebar, TopBar
│   │   ├── auth/             # LoginForm, SignupForm
│   │   ├── subjects/         # SubjectCard, SubjectForm, SubjectList
│   │   ├── assignments/      # AssignmentCard, AssignmentForm, AssignmentFilters, AssignmentList
│   │   ├── planner/          # SessionCard, SessionForm, WeekView, WeekNavigation
│   │   ├── progress/         # ProgressCard, ProgressStats
│   │   └── dashboard/        # GreetingBanner, DueThisWeek, TodaysSessions, QuickStats
│   ├── context/
│   │   └── AppContext.jsx     # Global state provider
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useSubjects.js
│   │   ├── useAssignments.js
│   │   └── useSessions.js
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── SubjectsPage.jsx
│   │   ├── AssignmentsPage.jsx
│   │   ├── PlannerPage.jsx
│   │   └── ProgressPage.jsx
│   ├── utils/
│   │   ├── storage.js         # read/write localStorage helpers
│   │   ├── validators.js      # validateSubject, validateAssignment, validateSession
│   │   ├── dateUtils.js       # getWeekBounds, formatDuration, isOverdue
│   │   └── progressUtils.js   # calcProgress, calcTotalStudyMinutes
│   ├── constants/
│   │   └── colors.js          # SUBJECT_COLORS palette (10 entries)
│   ├── styles/
│   │   ├── index.css          # Tailwind directives + CSS variables
│   │   └── neumorphism.css    # Shared shadow/card utility classes
│   ├── App.jsx
│   └── main.jsx
├── tests/
│   ├── unit/
│   │   ├── validators.test.js
│   │   ├── dateUtils.test.js
│   │   └── progressUtils.test.js
│   ├── pbt/
│   │   ├── subjects.pbt.test.js
│   │   ├── assignments.pbt.test.js
│   │   ├── sessions.pbt.test.js
│   │   ├── progress.pbt.test.js
│   │   ├── weekly.pbt.test.js
│   │   └── storage.pbt.test.js
│   ├── component/
│   │   ├── SubjectForm.test.jsx
│   │   ├── AssignmentForm.test.jsx
│   │   ├── AssignmentFilters.test.jsx
│   │   └── ProgressCard.test.jsx
│   └── integration/
│       ├── subjectCRUD.test.jsx
│       ├── assignmentCRUD.test.jsx
│       └── sessionCRUD.test.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 3. Data Models

All data is stored as JSON in `localStorage`. Keys are namespaced with the username to support multiple users on the same browser.

### localStorage Keys

| Key | Type | Description |
|---|---|---|
| `studysync_users` | `User[]` | All registered users |
| `studysync_session` | `Session` | Active login session |
| `studysync_[username]_subjects` | `Subject[]` | Subjects for a user |
| `studysync_[username]_assignments` | `Assignment[]` | Assignments for a user |
| `studysync_[username]_sessions` | `StudySession[]` | Study sessions for a user |

### User

```js
{
  id: string,           // UUID
  name: string,         // Display name
  username: string,     // Unique, case-sensitive login key
  password: string,     // Plain string (no backend, no hash required)
  createdAt: string     // ISO 8601 date string
}
```

### Session (Auth)

```js
{
  username: string,
  name: string,
  loggedInAt: string    // ISO 8601
}
```

### Subject

```js
{
  id: string,           // UUID
  name: string,         // 2–50 chars, unique per user (case-insensitive)
  color: string,        // One of the 10 hex values from SUBJECT_COLORS
  description: string,  // Optional, max 200 chars
  createdAt: string     // ISO 8601
}
```

### Assignment

```js
{
  id: string,           // UUID
  title: string,        // 2–100 chars
  subjectId: string,    // FK → Subject.id
  dueDate: string,      // ISO 8601 date (YYYY-MM-DD)
  priority: 'low' | 'medium' | 'high',
  status: 'todo' | 'in-progress' | 'done',
  notes: string,        // Optional, max 500 chars
  createdAt: string     // ISO 8601
}
```

### StudySession

```js
{
  id: string,           // UUID
  subjectId: string,    // FK → Subject.id
  date: string,         // ISO 8601 date (YYYY-MM-DD)
  startTime: string,    // HH:MM (24h)
  endTime: string,      // HH:MM (24h), > startTime
  notes: string,        // Optional, max 300 chars
  createdAt: string     // ISO 8601
}
```

---

## 4. Application Architecture

### 4.1 Routing

```
/                   → redirect to /dashboard (if session) or /login
/login              → AuthPage (login tab)
/signup             → AuthPage (signup tab)
/dashboard          → DashboardPage  [protected]
/subjects           → SubjectsPage   [protected]
/assignments        → AssignmentsPage [protected]
/planner            → PlannerPage    [protected]
/progress           → ProgressPage   [protected]
```

A `ProtectedRoute` component wraps all authenticated routes. It reads `studysync_session` from `localStorage`; if absent, it redirects to `/login`.

### 4.2 State Management

`AppContext` provides a single React Context with the following shape:

```js
{
  user,              // current session user object
  subjects,          // Subject[]
  assignments,       // Assignment[]
  sessions,          // StudySession[]
  addSubject,        // (data) => void
  updateSubject,     // (id, data) => void
  deleteSubject,     // (id) => void — cascades to assignments + sessions
  addAssignment,     // (data) => void
  updateAssignment,  // (id, data) => void
  deleteAssignment,  // (id) => void
  addSession,        // (data) => void
  updateSession,     // (id, data) => void
  deleteSession,     // (id) => void
  logout             // () => void
}
```

Every mutation writes through to `localStorage` immediately after updating React state via `useReducer`.

### 4.3 Storage Layer

`src/utils/storage.js` exports:

```js
readStore(key, defaultValue)   // JSON.parse with try/catch; returns defaultValue on error
writeStore(key, value)         // JSON.stringify + localStorage.setItem
clearStore(key)                // localStorage.removeItem
```

All reads are wrapped in `try/catch`. Any parse failure returns the `defaultValue` (empty array or null), satisfying NFR-07.

---

## 5. UI Design System — Neumorphism

### 5.1 Design Tokens (CSS Variables)

```css
:root {
  --neu-bg:         #e0e5ec;
  --neu-text:       #4a4f5e;
  --neu-text-light: #8a9bb5;
  --neu-accent:     #6c9bcf;
  --neu-accent-alt: #9b8ec4;
  --neu-success:    #6db88b;
  --neu-danger:     #e07c7c;
  --neu-warning:    #e0a87c;

  /* Extruded (raised) card */
  --shadow-raised:
    6px 6px 12px #b8bec7,
    -6px -6px 12px #ffffff;

  /* Inset (pressed) — inputs, active buttons */
  --shadow-inset:
    inset 4px 4px 8px #b8bec7,
    inset -4px -4px 8px #ffffff;

  /* Subtle raised — small elements */
  --shadow-raised-sm:
    3px 3px 6px #b8bec7,
    -3px -3px 6px #ffffff;
}
```

### 5.2 Component Classes

| Class | Shadow | Use |
|---|---|---|
| `.neu-card` | `--shadow-raised` | Subject cards, assignment cards, progress cards |
| `.neu-card-sm` | `--shadow-raised-sm` | Small info pills |
| `.neu-input` | `--shadow-inset` | All `<input>` and `<textarea>` elements |
| `.neu-btn` | `--shadow-raised-sm` | Default buttons |
| `.neu-btn:active` | `--shadow-inset` | Pressed state |
| `.neu-btn-accent` | `--shadow-raised-sm` + accent bg | Primary CTA buttons |
| `.neu-sidebar` | right edge raised shadow | Sidebar panel |

### 5.3 Typography

- Font: `Inter`, fallback `system-ui`
- Headings: `font-semibold`, `text-[--neu-text]`
- Body: `font-normal`, `text-[--neu-text]`
- Muted: `text-[--neu-text-light]`
- No harsh borders. Separation achieved via shadow depth.

### 5.4 Layout

- Sidebar: fixed left, 240px wide, hidden on mobile (hamburger menu)
- Main content: `ml-60` on desktop, full width on mobile
- Max content width: 1200px, centered
- Responsive breakpoints: `sm` 640px, `md` 768px, `lg` 1024px

---

## 6. Key UI Flows

### 6.1 Auth Flow

```
/login
  ├─ Valid credentials → write session → navigate /dashboard
  ├─ Invalid credentials → inline error below form
  └─ "Create account" link → /signup

/signup
  ├─ Valid → write user + session → navigate /dashboard
  ├─ Duplicate username → inline error
  ├─ Short password → inline error
  └─ Empty fields → inline error
```

### 6.2 Delete with Cascade

When a Subject is deleted:
1. Filter assignments where `subjectId === deletedId` and remove them.
2. Filter study sessions where `subjectId === deletedId` and remove them.
3. Write all three updated arrays to `localStorage`.
4. Update React state in a single dispatch to avoid intermediate renders.

### 6.3 Assignment Filters (AND Logic)

```
filteredAssignments = assignments
  .filter(a => !subjectFilter || a.subjectId === subjectFilter)
  .filter(a => statusFilter.length === 0 || statusFilter.includes(a.status))
  .filter(a => priorityFilter.length === 0 || priorityFilter.includes(a.priority))
  .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
```

### 6.4 Week Calculation

```js
// getWeekBounds(date: Date): { monday: Date, sunday: Date }
// Uses ISO week: Monday = day 1, Sunday = day 0 (mapped to 7 for arithmetic)
function getWeekBounds(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}
```

### 6.5 Overlap Detection

```js
// Two sessions overlap if their time ranges intersect on the same date
function sessionsOverlap(a, b) {
  if (a.date !== b.date) return false;
  return a.startTime < b.endTime && b.startTime < a.endTime;
}
```

Adjacent sessions (`a.endTime === b.startTime`) do NOT overlap because `a.endTime < b.endTime` is false when equal.

---

## 7. Validation Logic

### 7.1 `validateSubject(data, existingSubjects, editingId?)`

```
name:        required, trimmed length 2–50
color:       required, must be one of SUBJECT_COLORS map keys
description: optional, max 200 chars
uniqueness:  name (case-insensitive) must not exist in existingSubjects
             (exclude editingId when editing)
```

Returns `{ valid: boolean, errors: { name?, color?, description? } }`.

### 7.2 `validateAssignment(data)`

```
title:    required, trimmed length 2–100
subjectId: required, non-empty string
dueDate:  required, valid ISO date string
priority: required, one of ['low','medium','high']
status:   required, one of ['todo','in-progress','done']
notes:    optional, max 500 chars
```

### 7.3 `validateSession(data, existingSessions, editingId?)`

```
subjectId: required
date:      required, valid ISO date
startTime: required, HH:MM format
endTime:   required, HH:MM format, must be > startTime
notes:     optional, max 300 chars
overlap:   check against existingSessions (excluding editingId); soft warning only
```

---

## 8. Property-Based Testing Strategy

### 8.1 Tooling

- **Test runner:** Vitest
- **PBT library:** fast-check (`fc`)
- **Location:** `tests/pbt/`
- **Co-location:** PBT files named `*.pbt.test.js` to distinguish from unit tests

### 8.2 Arbitraries (Generators)

| Arbitrary | fast-check expression |
|---|---|
| Valid subject name | `fc.string({ minLength: 2, maxLength: 50 })` |
| Invalid short name | `fc.string({ maxLength: 1 })` |
| Invalid long name | `fc.string({ minLength: 51, maxLength: 200 })` |
| Palette color | `fc.constantFrom(...SUBJECT_COLORS)` |
| Non-palette color | `fc.hexaString({ minLength: 7, maxLength: 7 }).filter(s => !SUBJECT_COLORS.includes(s))` |
| Valid HH:MM time | `fc.tuple(fc.integer({min:0,max:23}), fc.integer({min:0,max:59})).map(([h,m]) => \`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}\`)` |
| Valid ISO date | `fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).map(d => d.toISOString().slice(0,10))` |
| Priority value | `fc.constantFrom('low','medium','high')` |
| Status value | `fc.constantFrom('todo','in-progress','done')` |
| Valid assignment | `fc.record({ title: validName, subjectId: fc.uuid(), dueDate: validISODate, priority: priorityArb, status: statusArb, notes: fc.string({maxLength:500}) })` |
| Valid session | `fc.record({ subjectId: fc.uuid(), date: validISODate, startTime: validTime, endTime: validTime }).filter(s => s.startTime < s.endTime)` |

### 8.3 Properties by Module

#### `tests/pbt/subjects.pbt.test.js`

```
Property 1: validateSubject with valid name + palette color → always valid
Property 2: validateSubject with name.length < 2 → always invalid (name error)
Property 3: validateSubject with name.length > 50 → always invalid (name error)
Property 4: validateSubject with non-palette color → always invalid (color error)
Property 5: uniqueness check is order-independent
```

#### `tests/pbt/assignments.pbt.test.js`

```
Property 1: filterAssignments result is always a subset of input
Property 2: filterAssignments is idempotent (applying twice = applying once)
Property 3: no filters → result equals full list
Property 4: every item in filtered result satisfies all active filter conditions
```

#### `tests/pbt/sessions.pbt.test.js`

```
Property 1: end > start → session valid
Property 2: end ≤ start → session invalid
Property 3: overlap is commutative (A overlaps B ↔ B overlaps A)
Property 4: adjacent sessions (end == start) do not overlap
Property 5: non-overlapping session inserted in a gap → no overlap detected
```

#### `tests/pbt/progress.pbt.test.js`

```
Property 1: calcProgress always in [0, 100]
Property 2: calcProgress(n, n) === 100 for n > 0
Property 3: calcProgress(0, n) === 0 for any n
Property 4: calcTotalStudyMinutes ≥ 0 for any sessions list
Property 5: calcTotalStudyMinutes equals manual sum
```

#### `tests/pbt/weekly.pbt.test.js`

```
Property 1: getWeekBounds(d).monday.getDay() === 1
Property 2: getWeekBounds(d).sunday.getDay() === 0
Property 3: date d is within [monday, sunday]
Property 4: filterSessionsByWeek returns only sessions within that range
Property 5: partition sessions by week → each session appears in exactly one bucket
```

#### `tests/pbt/storage.pbt.test.js`

```
Property 1: serialize ∘ deserialize ∘ serialize is identity
Property 2: deserializing corrupted JSON returns default (no throw)
Property 3: field types preserved after round-trip (string stays string, etc.)
Property 4: N subjects (0–100) can be serialized within ~5 MB
```

### 8.4 PBT Execution Configuration

```js
// vite.config.js test section
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './tests/setup.js',
  coverage: {
    provider: 'v8',
    threshold: { statements: 80, branches: 80, functions: 80, lines: 80 }
  }
}
```

fast-check runs with `numRuns: 200` by default. Seed is fixed in CI via `fc.configureGlobal({ seed: 42 })` in `tests/setup.js` for reproducibility.

---

## 9. Component Design

### 9.1 Shared Components

| Component | Props | Notes |
|---|---|---|
| `Button` | `variant`, `size`, `onClick`, `disabled`, `children` | variants: `primary`, `secondary`, `danger` |
| `Input` | `label`, `type`, `value`, `onChange`, `error`, `placeholder` | Wraps label + error message |
| `Textarea` | `label`, `value`, `onChange`, `error`, `maxLength` | Shows char count |
| `Select` | `label`, `options`, `value`, `onChange`, `error` | Options: `[{ value, label }]` |
| `Modal` | `isOpen`, `onClose`, `title`, `children` | Trap focus, close on Escape |
| `Card` | `className`, `children` | Applies `.neu-card` |
| `Badge` | `color`, `label` | Colored pill |
| `ProgressBar` | `value` (0–100), `color` | Neumorphic inset track |
| `ColorPicker` | `value`, `onChange` | Grid of 10 color swatches |

### 9.2 Page-Level Components

Each page is a thin composition of feature components. Pages own no business logic — they pass data and callbacks from context to feature components.

---

## 10. Error Handling & Edge Cases

| Scenario | Handling |
|---|---|
| `localStorage` read failure | `readStore` catches JSON.parse error, returns default value |
| `localStorage` write failure (quota exceeded) | Caught in `writeStore`, user sees toast: "Storage full. Please clear some data." |
| Deleting a subject with assignments | Cascade delete in single dispatch (SUB-04) |
| Navigating to protected route without session | `ProtectedRoute` redirects to `/login` |
| Empty subjects list on Assignments/Planner pages | Show empty-state prompt: "Add a subject first." |
| Concurrent tab writes | Last write wins (acceptable for single-user personal tool) |
| Date parsing failure | `dateUtils` returns `null`; components show "—" as fallback |
