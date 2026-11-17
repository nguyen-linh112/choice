import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'studyexam:v1:theme'
const ThemeContext = createContext({ mode: 'light', toggle: () => {} })

// Đọc chế độ đã lưu; chưa có thì theo cài đặt sáng/tối của thiết bị.
export function readInitialMode() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* trình duyệt chặn localStorage: bỏ qua */ }
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readInitialMode)

  // data-theme trên <html> để CSS đổi biến màu
  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem(KEY, next) } catch { /* bỏ qua */ }
      return next
    })
  }, [])

  const value = useMemo(() => ({ mode, toggle }), [mode, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
