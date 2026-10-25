import { useAppContext } from '../context/AppContext.jsx'

export function useSessions() {
  const { sessions, addSession, updateSession, deleteSession } = useAppContext()
  return { sessions, addSession, updateSession, deleteSession }
}
