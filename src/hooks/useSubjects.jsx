// Context chia sẻ danh sách môn cho mọi trang (nạp 1 lần khi mở web).
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { loadAllSubjects } from '../utils/subjectsApi.js'

const SubjectsContext = createContext(null)

export function SubjectsProvider({ children }) {
  const [state, setState] = useState({ subjects: [], errors: [], loading: true })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    try {
      const { subjects, errors } = await loadAllSubjects()
      setState({ subjects, errors, loading: false })
    } catch (e) {
      setState({ subjects: [], errors: [{ name: 'index.json', messages: [e.message] }], loading: false })
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return <SubjectsContext.Provider value={{ ...state, reload }}>{children}</SubjectsContext.Provider>
}

export function useSubjects() {
  const ctx = useContext(SubjectsContext)
  if (!ctx) throw new Error('useSubjects phải nằm trong <SubjectsProvider>')
  return ctx
}
