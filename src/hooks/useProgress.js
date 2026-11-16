// Tiến độ ôn tập của 1 môn: giữ trong state và tự lưu vào localStorage mỗi khi thay đổi.
import { useCallback, useEffect, useRef, useState } from 'react'
import { loadProgress, saveProgress } from '../utils/storage.js'

export function useProgress(subjectId) {
  const [progress, setProgress] = useState(() => loadProgress(subjectId))
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false // lần đầu vừa đọc xong, không cần ghi lại
      return
    }
    saveProgress(subjectId, progress)
  }, [subjectId, progress])

  // Đánh dấu 1 câu là 'known' (đã thuộc) hoặc 'unknown' (chưa thuộc)
  const setStatus = useCallback((questionId, status) => {
    setProgress((p) => ({ ...p, status: { ...p.status, [questionId]: status } }))
  }, [])

  // Nhớ câu đang học dở của bộ 'all' | 'known' | 'unknown' (null = đã học hết, lần sau bắt đầu lại)
  const setLast = useCallback((set, questionId) => {
    setProgress((p) => ({ ...p, last: { ...p.last, [set]: questionId } }))
  }, [])

  const reset = useCallback(() => setProgress({ status: {}, last: {} }), [])

  return { progress, setStatus, setLast, reset }
}
