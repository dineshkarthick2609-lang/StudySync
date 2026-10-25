/**
 * Return the Monday and Sunday of the week containing `date`.
 * Monday has getDay() === 1, Sunday === 0.
 */
export function getWeekBounds(date) {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun … 6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { monday, sunday }
}

/**
 * Format duration in minutes as "Xh Ym" or "Ym".
 */
export function formatDuration(minutes) {
  if (minutes < 0) minutes = 0
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

/**
 * Return true if the assignment is overdue:
 * due date is in the past AND status is not 'done'.
 */
export function isOverdue(assignment) {
  if (!assignment) return false
  if (assignment.status === 'done') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(assignment.dueDate)
  due.setHours(0, 0, 0, 0)
  return due < today
}

/**
 * Format a YYYY-MM-DD date string to a human-readable form.
 * Returns "—" on invalid input.
 */
export function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

/**
 * Return 'morning', 'afternoon', or 'evening' based on current hour.
 */
export function getTimeOfDay(hour) {
  const h = hour !== undefined ? hour : new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

/**
 * Check whether two study sessions overlap.
 * Two sessions overlap if they are on the same date and their time ranges intersect.
 * Adjacent sessions (a.endTime === b.startTime) do NOT overlap.
 */
export function sessionsOverlap(a, b) {
  if (a.date !== b.date) return false
  return a.startTime < b.endTime && b.startTime < a.endTime
}

/**
 * Filter sessions to those whose date falls within [monday, sunday] (YYYY-MM-DD strings).
 */
export function filterSessionsByWeek(sessions, monday, sunday) {
  const monStr = monday.toISOString().slice(0, 10)
  const sunStr = sunday.toISOString().slice(0, 10)
  return sessions.filter(s => s.date >= monStr && s.date <= sunStr)
}
