import { useAppContext } from '../context/AppContext.jsx'

export function useSubjects() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppContext()
  return { subjects, addSubject, updateSubject, deleteSubject }
}
