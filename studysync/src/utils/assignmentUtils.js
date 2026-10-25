/**
 * Filter assignments using AND logic across subject, status, and priority filters.
 * @param {Array} assignments
 * @param {object} filters - { subjectId, statuses: [], priorities: [] }
 */
export function filterAssignments(assignments, filters = {}) {
  const { subjectId, statuses = [], priorities = [] } = filters

  return assignments
    .filter(a => !subjectId || a.subjectId === subjectId)
    .filter(a => statuses.length === 0 || statuses.includes(a.status))
    .filter(a => priorities.length === 0 || priorities.includes(a.priority))
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
}

/**
 * Check whether a single assignment satisfies all active filters.
 */
export function satisfiesAllFilters(assignment, filters = {}) {
  const { subjectId, statuses = [], priorities = [] } = filters
  if (subjectId && assignment.subjectId !== subjectId) return false
  if (statuses.length > 0 && !statuses.includes(assignment.status)) return false
  if (priorities.length > 0 && !priorities.includes(assignment.priority)) return false
  return true
}
