import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import GreetingBanner from '../components/dashboard/GreetingBanner.jsx'
import QuickStats from '../components/dashboard/QuickStats.jsx'
import DueThisWeek from '../components/dashboard/DueThisWeek.jsx'
import TodaysSessions from '../components/dashboard/TodaysSessions.jsx'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import AssignmentForm from '../components/assignments/AssignmentForm.jsx'
import { useAppContext } from '../context/AppContext.jsx'

export default function DashboardPage() {
  const { subjects, addAssignment } = useAppContext()
  const [modalOpen, setModalOpen] = useState(false)

  function handleQuickAdd() {
    setModalOpen(true)
  }

  function handleSuccess(data) {
    addAssignment(data)
    setModalOpen(false)
  }

  return (
    <div>
      <GreetingBanner />
      <QuickStats />

      <div className="flex justify-end mb-4">
        <Button
          variant="primary"
          onClick={handleQuickAdd}
          disabled={subjects.length === 0}
        >
          <Plus size={16} /> Quick Add Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DueThisWeek />
        <TodaysSessions />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Quick Add Assignment"
      >
        <AssignmentForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  )
}
