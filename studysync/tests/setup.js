import '@testing-library/jest-dom'
import * as fc from 'fast-check'

fc.configureGlobal({ seed: 42, numRuns: 200 })
