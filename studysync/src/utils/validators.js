import { SUBJECT_COLOR_VALUES } from '../constants/colors.js'

/**
 * Validate subject data.
 * @param {object} data - { name, color, description }
 * @param {Array}  existingSubjects
 * @param {string|null} editingId - exclude from uniqueness check
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateSubject(data, existingSubjects = [], editingId = null) {
  const errors = {}
  const name = (data.name || '').trim()

  if (!name) {
    errors.name = 'Subject name is required.'
  } else if (name.length < 2) {
    errors.name = 'Subject name must be at least 2 characters.'
  } else if (name.length > 50) {
    errors.name = 'Subject name must be 50 characters or fewer.'
  } else {
    const duplicate = existingSubjects.some(
      s => s.name.toLowerCase() === name.toLowerCase() && s.id !== editingId
    )
    if (duplicate) {
      errors.name = 'A subject with this name already exists.'
    }
  }

  if (!data.color) {
    errors.color = 'Please select a color.'
  } else if (!SUBJECT_COLOR_VALUES.includes(data.color)) {
    errors.color = 'Please select a valid color from the palette.'
  }

  if (data.description && data.description.length > 200) {
    errors.description = 'Description must be 200 characters or fewer.'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

/**
 * Validate assignment data.
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateAssignment(data) {
  const errors = {}
  const title = (data.title || '').trim()

  if (!title) {
    errors.title = 'Title is required.'
  } else if (title.length < 2) {
    errors.title = 'Title must be at least 2 characters.'
  } else if (title.length > 100) {
    errors.title = 'Title must be 100 characters or fewer.'
  }

  if (!data.subjectId) {
    errors.subjectId = 'Please select a subject.'
  }

  if (!data.dueDate) {
    errors.dueDate = 'Due date is required.'
  } else {
    const d = new Date(data.dueDate)
    if (isNaN(d.getTime())) {
      errors.dueDate = 'Please enter a valid date.'
    }
  }

  const validPriorities = ['low', 'medium', 'high']
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.priority = 'Please select a priority.'
  }

  const validStatuses = ['todo', 'in-progress', 'done']
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.status = 'Please select a status.'
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = 'Notes must be 500 characters or fewer.'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

/**
 * Validate study session data.
 * @param {object} data
 * @param {Array}  existingSessions
 * @param {string|null} editingId
 * @returns {{ valid: boolean, errors: object, warnings: object }}
 */
export function validateSession(data, existingSessions = [], editingId = null) {
  const errors = {}
  const warnings = {}

  if (!data.subjectId) {
    errors.subjectId = 'Please select a subject.'
  }

  if (!data.date) {
    errors.date = 'Date is required.'
  } else {
    const d = new Date(data.date)
    if (isNaN(d.getTime())) {
      errors.date = 'Please enter a valid date.'
    }
  }

  const timeRegex = /^\d{2}:\d{2}$/
  if (!data.startTime) {
    errors.startTime = 'Start time is required.'
  } else if (!timeRegex.test(data.startTime)) {
    errors.startTime = 'Start time must be in HH:MM format.'
  }

  if (!data.endTime) {
    errors.endTime = 'End time is required.'
  } else if (!timeRegex.test(data.endTime)) {
    errors.endTime = 'End time must be in HH:MM format.'
  } else if (data.startTime && data.endTime <= data.startTime) {
    errors.endTime = 'End time must be after start time.'
  }

  if (data.notes && data.notes.length > 300) {
    errors.notes = 'Notes must be 300 characters or fewer.'
  }

  return { valid: Object.keys(errors).length === 0, errors, warnings }
}

/**
 * Check if a subject name is a duplicate in the given list.
 * @param {string} name
 * @param {Array} subjects
 * @param {string|null} excludeId
 */
export function isSubjectNameDuplicate(name, subjects, excludeId = null) {
  const lower = name.toLowerCase()
  return subjects.some(
    s => s.name.toLowerCase() === lower && s.id !== excludeId
  )
}
