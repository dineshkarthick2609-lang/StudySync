# StudySync – Requirements Specification

## 1. Project Overview

StudySync is a client-side web application that helps college students manage subjects, assignments, study sessions, and academic progress. All data is persisted in the browser's `localStorage`. There is no backend, no external authentication service, and no database.

---

## 2. Functional Requirements

### 2.1 Authentication (UI Gate)

| ID | Requirement |
|----|-------------|
| AUTH-01 | The application SHALL display a Login page as the entry point. |
| AUTH-02 | The Login page SHALL include fields for username and password, and a "Login" button. |
| AUTH-03 | The Login page SHALL include a link to a Signup page. |
| AUTH-04 | The Signup page SHALL include fields for name, username, and password, and a "Create Account" button. |
| AUTH-05 | On signup, the application SHALL store the user record (name, username, hashed-free plain object) in `localStorage` under the key `studysync_users`. |
| AUTH-06 | On login, the application SHALL validate the username/password pair against `studysync_users`. If matched, it SHALL write a session object `{ username, name, loggedInAt }` to `localStorage` under `studysync_session`. |
| AUTH-07 | On login failure, the application SHALL display an inline error message: "Invalid username or password." |
| AUTH-08 | If a `studysync_session` key exists on app load, the application SHALL redirect directly to the Dashboard. |
| AUTH-09 | A "Logout" control SHALL clear `studysync_session` from `localStorage` and redirect to the Login page. |
| AUTH-10 | Username SHALL be unique. Attempting to register a duplicate username SHALL display: "Username already taken." |
| AUTH-11 | Password SHALL be at least 6 characters. Violation SHALL display: "Password must be at least 6 characters." |
| AUTH-12 | All auth fields are required. Empty submission SHALL display: "All fields are required." |

### 2.2 Subjects

| ID | Requirement |
|----|-------------|
| SUB-01 | An authenticated user SHALL be able to create a subject with: name (required, 2–50 chars), color (required, chosen from a predefined palette of 10 colors), and optional description (max 200 chars). |
| SUB-02 | Each subject SHALL have a system-generated UUID as its `id`. |
| SUB-03 | A user SHALL be able to edit any field of an existing subject. |
| SUB-04 | A user SHALL be able to delete a subject. Deleting a subject SHALL also delete all assignments and study sessions linked to that subject. |
| SUB-05 | Subject names SHALL be unique per user (case-insensitive). Duplicate names SHALL display: "A subject with this name already exists." |
| SUB-06 | Subjects SHALL be displayed as neumorphic cards, sorted alphabetically by name. |
| SUB-07 | The predefined color palette SHALL consist of exactly 10 colors: Soft Blue `#6c9bcf`, Soft Purple `#9b8ec4`, Soft Green `#6db88b`, Soft Red `#e07c7c`, Soft Orange `#e0a87c`, Soft Yellow `#d4c56a`, Soft Teal `#6bbfbf`, Soft Pink `#d88fa8`, Soft Indigo `#7a85c9`, Soft Slate `#8a9bb5`. |
| SUB-08 | Each subject card SHALL display: name, color indicator, description (truncated at 80 chars), and count of total / completed assignments. |

### 2.3 Assignments

| ID | Requirement |
|----|-------------|
| ASN-01 | A user SHALL be able to create an assignment with: title (required, 2–100 chars), subject (required, selected from existing subjects), due date (required, valid calendar date), priority (required: Low / Medium / High), status (default: To-do), and optional notes (max 500 chars). |
| ASN-02 | Each assignment SHALL have a system-generated UUID as its `id`. |
| ASN-03 | Status values SHALL be: `todo`, `in-progress`, `done`. |
| ASN-04 | Priority values SHALL be: `low`, `medium`, `high`. |
| ASN-05 | A user SHALL be able to edit any field of an existing assignment. |
| ASN-06 | A user SHALL be able to delete an assignment. |
| ASN-07 | The Assignments page SHALL support combined AND filters: by subject (single select), by status (multi-select), and by priority (multi-select). |
| ASN-08 | Assignments SHALL be sorted by due date ascending by default. |
| ASN-09 | Overdue assignments (due date < today AND status ≠ `done`) SHALL be visually highlighted. |
| ASN-10 | The due date field SHALL not permit dates before today when creating a new assignment. Editing an existing assignment MAY retain a past due date. |

### 2.4 Study Planner

| ID | Requirement |
|----|-------------|
| STU-01 | A user SHALL be able to create a study session with: subject (required), date (required), start time (required, HH:MM 24h), end time (required, HH:MM 24h), and optional notes (max 300 chars). |
| STU-02 | Each session SHALL have a system-generated UUID. |
| STU-03 | End time SHALL be strictly after start time on the same date. Violation SHALL display: "End time must be after start time." |
| STU-04 | A user SHALL be able to edit or delete any study session. |
| STU-05 | Overlapping sessions (same date, time ranges intersect) SHALL display a warning: "This session overlaps with an existing session for [subject name]." The user SHALL still be allowed to save (soft warning, not a hard block). |
| STU-06 | The Study Planner page SHALL display sessions grouped by week (Monday–Sunday). |
| STU-07 | The current week SHALL be displayed by default; the user SHALL be able to navigate to previous and next weeks. |
| STU-08 | Total study duration per day SHALL be displayed in hours and minutes. |
| STU-09 | Session duration SHALL be calculated as `endTime − startTime` in minutes. |

### 2.5 Progress

| ID | Requirement |
|----|-------------|
| PRG-01 | The Progress page SHALL display one card per subject. |
| PRG-02 | Each subject card SHALL show: total assignments, completed assignments, completion percentage (integer, rounded down), and a visual progress bar. |
| PRG-03 | Completion percentage = `floor((completedCount / totalCount) * 100)`. If `totalCount === 0`, percentage = 0. |
| PRG-04 | Each subject card SHALL also show: total study sessions logged, and total study hours logged (sum of session durations, displayed as Xh Ym). |
| PRG-05 | A subject with 100% completion SHALL display a visual "complete" badge. |

### 2.6 Dashboard

| ID | Requirement |
|----|-------------|
| DSH-01 | The Dashboard SHALL display a greeting: "Good [morning/afternoon/evening], [name]." based on current hour. |
| DSH-02 | A "Due This Week" section SHALL list assignments due within the current Monday–Sunday week, sorted by due date. |
| DSH-03 | A "Today's Sessions" section SHALL list study sessions scheduled for today. |
| DSH-04 | Quick stats SHALL display: total subjects, total pending assignments (status ≠ `done`), total study hours this week. |
| DSH-05 | A "Quick Add Assignment" button SHALL open the assignment creation form. |
| DSH-06 | Overdue items SHALL be highlighted on the Dashboard. |

---

## 3. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | All user data SHALL persist in `localStorage` and survive page refresh. |
| NFR-02 | The application SHALL be fully functional without an internet connection after initial load. |
| NFR-03 | Page transitions and interactions SHALL feel immediate (< 100ms perceived latency). |
| NFR-04 | The UI SHALL implement the neumorphism design language consistently: background `#e0e5ec`, extruded shadows for cards/buttons, inset shadows for inputs. |
| NFR-05 | The application SHALL be responsive and usable on screen widths from 375px to 1440px. |
| NFR-06 | All interactive elements SHALL have visible focus states for keyboard accessibility. |
| NFR-07 | The application SHALL not crash or produce blank screens on corrupted or missing `localStorage` data; it SHALL fall back to empty default state. |
| NFR-08 | The codebase SHALL achieve ≥ 80% statement coverage across unit, integration, component, and property-based tests. |

---

## 4. Property-Based Testing Requirements

Property-based tests (PBT) SHALL use **Vitest** as the test runner and **fast-check** as the property testing library.

### 4.1 Subject Validation

| PBT-SUB-01 | For any string of length 2–50 and any color from the predefined palette, `validateSubject()` SHALL return valid. |
| PBT-SUB-02 | For any string with length < 2 or > 50, `validateSubject()` SHALL return invalid with a name error. |
| PBT-SUB-03 | For any color value NOT in the predefined palette, `validateSubject()` SHALL return invalid with a color error. |
| PBT-SUB-04 | Subject uniqueness check SHALL be order-independent: checking `[A, B]` for duplicate B SHALL equal checking `[B, A]` for duplicate B. |

### 4.2 Assignment–Subject Relationships & Filters

| PBT-ASN-01 | For any list of assignments and any combination of subject/status/priority filters, the filter result SHALL be a subset of the original list. |
| PBT-ASN-02 | For any filter combination, applying the same filters twice SHALL produce the same result (idempotent). |
| PBT-ASN-03 | Filtering with no filters active SHALL return the full list. |
| PBT-ASN-04 | For any assignment in the filtered result, ALL active filter conditions SHALL hold (AND semantics). |

### 4.3 Study Session Time Validation & Overlap Detection

| PBT-STU-01 | For any start time and end time where `end > start` on the same date, `validateSession()` SHALL return valid. |
| PBT-STU-02 | For any start time and end time where `end ≤ start`, `validateSession()` SHALL return invalid. |
| PBT-STU-03 | Overlap detection SHALL be commutative: if session A overlaps B, then B overlaps A. |
| PBT-STU-04 | A session that ends exactly when another starts (adjacent, non-overlapping) SHALL NOT be detected as overlapping. |
| PBT-STU-05 | For any set of non-overlapping sessions, adding a session that fits entirely within a gap SHALL not trigger overlap. |

### 4.4 Progress Calculations

| PBT-PRG-01 | For any `completedCount` in `[0, totalCount]` and any `totalCount ≥ 0`, `calcProgress()` SHALL return a value in `[0, 100]`. |
| PBT-PRG-02 | `calcProgress(n, n)` SHALL always equal `100` for any `n > 0`. |
| PBT-PRG-03 | `calcProgress(0, n)` SHALL always equal `0` for any `n ≥ 0`. |
| PBT-PRG-04 | For any list of sessions, `calcTotalStudyMinutes()` SHALL equal the sum of `(endTime − startTime)` for each session and SHALL always be ≥ 0. |

### 4.5 Weekly Calculations & Session Filtering

| PBT-WK-01 | For any date, `getWeekBounds(date)` SHALL return a Monday–Sunday range that contains `date`. |
| PBT-WK-02 | For any date `d`, `getWeekBounds(d).monday` SHALL have `dayOfWeek === 1` and `.sunday` SHALL have `dayOfWeek === 0`. |
| PBT-WK-03 | Filtering sessions by a week range SHALL return only sessions whose date falls within `[monday, sunday]` inclusive. |
| PBT-WK-04 | The union of all weekly buckets for a contiguous date range SHALL contain every session exactly once. |

### 4.6 LocalStorage Serialization Round-Trips

| PBT-LS-01 | For any valid subjects array, `serialize(deserialize(serialize(data)))` SHALL deep-equal `serialize(data)`. |
| PBT-LS-02 | Deserializing a corrupted or missing localStorage key SHALL return the defined empty default (not throw). |
| PBT-LS-03 | For any valid assignment, serializing and deserializing SHALL preserve all field types (date strings remain strings, booleans remain booleans). |
| PBT-LS-04 | For any integer number of subjects (0–100) with random valid data, the total byte size of the serialized store SHALL be calculable and SHALL not cause a write failure under the 5 MB localStorage limit in tests. |
