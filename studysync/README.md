# StudySync

A neumorphic academic planner — manage subjects, assignments, study sessions, and track your progress.

All data is stored in your browser's `localStorage`. No backend, no account syncing.

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test:run

# Build for production
npm run build

# Coverage report
npm run coverage
```

## Stack

- **React 18** + **Vite**
- **Tailwind CSS** + custom neumorphic CSS variables
- **React Router v6** for client-side routing
- **React Context** + `localStorage` for state
- **Vitest** + **React Testing Library** + **fast-check** for testing

## Features

- 🔐 Local authentication (signup / login)
- 📚 Subject management with color coding
- 📋 Assignment tracking with priority, status, and due dates
- 📅 Weekly study planner with overlap detection
- 📊 Progress tracking per subject
- 🏠 Dashboard with greeting, due-this-week, and today's sessions

## Testing

| Suite | Files | Count |
|---|---|---|
| Unit | `tests/unit/` | 3 files |
| Component | `tests/component/` | 4 files |
| Integration | `tests/integration/` | 3 files |
| Property-based | `tests/pbt/` | 6 files × 200 runs |
