import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { validateSubject, isSubjectNameDuplicate } from '../../src/utils/validators.js'
import { SUBJECT_COLOR_VALUES, SUBJECT_COLORS } from '../../src/constants/colors.js'

describe('PBT – Subject Validation', () => {
  // PBT-SUB-01: valid name + palette color → always valid
  it('valid name (2-50 chars) + palette color → always valid', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.constantFrom(...SUBJECT_COLOR_VALUES),
        (name, color) => {
          // Ensure name has at least 2 non-whitespace chars after trim
          const trimmed = name.trim()
          if (trimmed.length < 2 || trimmed.length > 50) return true // skip edge case
          const result = validateSubject({ name: trimmed, color }, [])
          return result.valid === true
        }
      )
    )
  })

  // PBT-SUB-02: name length < 2 → always invalid
  it('name shorter than 2 chars → always invalid', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 1 }),
        fc.constantFrom(...SUBJECT_COLOR_VALUES),
        (name, color) => {
          const result = validateSubject({ name, color }, [])
          // single char or empty → invalid name
          if (name.trim().length < 2) {
            return result.valid === false
          }
          return true
        }
      )
    )
  })

  // PBT-SUB-03: name length > 50 → always invalid
  it('name longer than 50 chars → always invalid', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 51, maxLength: 200 }),
        fc.constantFrom(...SUBJECT_COLOR_VALUES),
        (name, color) => {
          const result = validateSubject({ name, color }, [])
          return result.valid === false
        }
      )
    )
  })

  // PBT-SUB-04: non-palette color → always invalid
  it('non-palette color → always invalid', () => {
    const paletteSet = new Set(SUBJECT_COLOR_VALUES)
    fc.assert(
      fc.property(
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => '#' + h).filter(h => !paletteSet.has(h)),
        (name, color) => {
          const trimmed = name.trim()
          if (trimmed.length < 2 || trimmed.length > 50) return true
          const result = validateSubject({ name: trimmed, color }, [])
          return result.valid === false
        }
      )
    )
  })

  // PBT-SUB-05: uniqueness check is order-independent
  it('uniqueness check is order-independent', () => {
    const subjectArb = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 2, maxLength: 50 }).map(s => s.trim()).filter(s => s.length >= 2),
      color: fc.constantFrom(...SUBJECT_COLOR_VALUES),
    })

    fc.assert(
      fc.property(
        fc.array(subjectArb, { minLength: 1, maxLength: 10 }),
        fc.string({ minLength: 2, maxLength: 50 }).map(s => s.trim()).filter(s => s.length >= 2),
        (subjects, name) => {
          const r1 = isSubjectNameDuplicate(name, subjects)
          const r2 = isSubjectNameDuplicate(name, [...subjects].reverse())
          return r1 === r2
        }
      )
    )
  })
})
