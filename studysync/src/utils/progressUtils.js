import { formatDuration } from './dateUtils.js'

/**
 * Calculate completion percentage (floor).
 * Returns 0 if totalCount is 0.
 */
export function calcProgress(completedCount, totalCount) {
  if (totalCount === 0) return 0
  return Math.floor((completedCount / totalCount) * 100)
}

/**
 * Calculate total study minutes from an array of study sessions.
 * Each session has startTime and endTime in "HH:MM" format.
 */
export function calcTotalStudyMinutes(sessions) {
  return sessions.reduce((sum, s) => {
    const [sh, sm] = s.startTime.split(':').map(Number)
    const [eh, em] = s.endTime.split(':').map(Number)
    const diff = (eh * 60 + em) - (sh * 60 + sm)
    return sum + (diff > 0 ? diff : 0)
  }, 0)
}

/**
 * Format study minutes as "Xh Ym".
 */
export function formatStudyDuration(minutes) {
  return formatDuration(minutes)
}
