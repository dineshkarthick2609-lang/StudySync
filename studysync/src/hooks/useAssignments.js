import { useAppContext } from '../context/AppContext.jsx'

export function useAssignments() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useAppContext()
  return { assignments, addAssignment, updateAssignment, deleteAssignment }
}
