import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { readStore, writeStore, clearStore } from '../utils/storage.js'

const AppContext = createContext(null)

function buildKeys(username) {
  return {
    subjects: `studysync_${username}_subjects`,
    assignments: `studysync_${username}_assignments`,
    sessions: `studysync_${username}_sessions`,
  }
}

const initialState = {
  subjects: [],
  assignments: [],
  sessions: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload }

    // Subjects
    case 'ADD_SUBJECT':
      return { ...state, subjects: [...state.subjects, action.payload] }
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.data } : s
        ),
      }
    case 'DELETE_SUBJECT': {
      const id = action.payload
      return {
        ...state,
        subjects: state.subjects.filter(s => s.id !== id),
        assignments: state.assignments.filter(a => a.subjectId !== id),
        sessions: state.sessions.filter(s => s.subjectId !== id),
      }
    }

    // Assignments
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] }
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.data } : a
        ),
      }
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(a => a.id !== action.payload),
      }

    // Sessions
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] }
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.data } : s
        ),
      }
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
      }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loaded, setLoaded] = useState(false)

  // Load session and data on mount
  useEffect(() => {
    const session = readStore('studysync_session', null)
    if (session) {
      setUser(session)
      const keys = buildKeys(session.username)
      dispatch({
        type: 'LOAD',
        payload: {
          subjects: readStore(keys.subjects, []),
          assignments: readStore(keys.assignments, []),
          sessions: readStore(keys.sessions, []),
        },
      })
    }
    setLoaded(true)
  }, [])

  // Persist to localStorage whenever state changes (after initial load)
  useEffect(() => {
    if (!loaded || !user) return
    const keys = buildKeys(user.username)
    const ok1 = writeStore(keys.subjects, state.subjects)
    const ok2 = writeStore(keys.assignments, state.assignments)
    const ok3 = writeStore(keys.sessions, state.sessions)
    if (!ok1 || !ok2 || !ok3) {
      setToast('Storage full. Please clear some data.')
    }
  }, [state, user, loaded])

  function addSubject(data) {
    dispatch({
      type: 'ADD_SUBJECT',
      payload: { ...data, id: uuidv4(), createdAt: new Date().toISOString() },
    })
  }

  function updateSubject(id, data) {
    dispatch({ type: 'UPDATE_SUBJECT', payload: { id, data } })
  }

  function deleteSubject(id) {
    dispatch({ type: 'DELETE_SUBJECT', payload: id })
  }

  function addAssignment(data) {
    dispatch({
      type: 'ADD_ASSIGNMENT',
      payload: { ...data, id: uuidv4(), createdAt: new Date().toISOString() },
    })
  }

  function updateAssignment(id, data) {
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { id, data } })
  }

  function deleteAssignment(id) {
    dispatch({ type: 'DELETE_ASSIGNMENT', payload: id })
  }

  function addSession(data) {
    dispatch({
      type: 'ADD_SESSION',
      payload: { ...data, id: uuidv4(), createdAt: new Date().toISOString() },
    })
  }

  function updateSession(id, data) {
    dispatch({ type: 'UPDATE_SESSION', payload: { id, data } })
  }

  function deleteSession(id) {
    dispatch({ type: 'DELETE_SESSION', payload: id })
  }

  function logout() {
    clearStore('studysync_session')
    setUser(null)
    dispatch({ type: 'LOAD', payload: initialState })
  }

  const value = {
    user,
    subjects: state.subjects,
    assignments: state.assignments,
    sessions: state.sessions,
    addSubject,
    updateSubject,
    deleteSubject,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addSession,
    updateSession,
    deleteSession,
    logout,
    toast,
    clearToast: () => setToast(''),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider')
  return ctx
}

export default AppContext
