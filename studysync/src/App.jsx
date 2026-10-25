import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SubjectsPage from './pages/SubjectsPage.jsx'
import AssignmentsPage from './pages/AssignmentsPage.jsx'
import PlannerPage from './pages/PlannerPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import Toast from './components/common/Toast.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { readStore } from './utils/storage.js'

function ProtectedRoute({ children }) {
  const session = readStore('studysync_session', null)
  if (!session) {
    return <Navigate to="/login" replace />
  }
  return children
}

function ToastBridge() {
  const { toast, clearToast } = useAppContext()
  return <Toast message={toast} onClose={clearToast} />
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<AuthPage defaultTab="login" />} />
        <Route path="/signup" element={<AuthPage defaultTab="signup" />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>
      </Routes>
      <ToastBridge />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}
