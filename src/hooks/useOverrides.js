// Kho nhỏ (store) giữ bản giải thích do người dùng sửa, cho mọi component dùng chung và tự cập nhật khi có thay đổi.
// Dùng useSyncExternalStore: component nào đọc giải thích sẽ vẽ lại ngay khi 1 giải thích được lưu,
// kể cả các thẻ đã được "đóng băng" trong bộ ôn tập (không cần nạp lại trang).
import { useCallback, useSyncExternalStore } from 'react'
import { loadOverrides, saveOverrides } from '../utils/storage.js'
import { clearQuestionOverride, setExplainOverride, setNoteOverride } from '../utils/overrides.js'

const cache = new Map() // subjectId -> map
const listeners = new Set()

const get = (subjectId) => {
  if (!cache.has(subjectId)) cache.set(subjectId, loadOverrides(subjectId))
  return cache.get(subjectId)
}

function set(subjectId, next) {
  cache.set(subjectId, next)
  saveOverrides(subjectId, next)
  listeners.forEach((l) => l())
}

const subscribe = (cb) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// Gọi sau khi khôi phục từ sao lưu: bỏ bộ nhớ đệm để đọc lại từ localStorage
export function resetOverridesCache() {
  cache.clear()
  listeners.forEach((l) => l())
}

export function useOverrides(subjectId) {
  const map = useSyncExternalStore(subscribe, () => get(subjectId))

  const saveExplain = useCallback((qid, optionIdx, text, baseText) => set(subjectId, setExplainOverride(get(subjectId), qid, optionIdx, text, baseText)), [subjectId])
  const saveNote = useCallback((qid, note, baseNote) => set(subjectId, setNoteOverride(get(subjectId), qid, note, baseNote)), [subjectId])
  const restoreQuestion = useCallback((qid) => set(subjectId, clearQuestionOverride(get(subjectId), qid)), [subjectId])
  // nhập hàng loạt từ kết quả AI: updates = { [qid]: [text, ...] } theo thứ tự đáp án GỐC
  const saveMany = useCallback((updates, subject) => {
    let next = get(subjectId)
    for (const q of subject.questions) {
      const arr = updates[q.id]
      if (!arr) continue
      q.options.forEach((o, i) => {
        next = setExplainOverride(next, q.id, o.idx ?? i, arr[i], o.explain || '')
      })
    }
    set(subjectId, next)
  }, [subjectId])

  return { map, saveExplain, saveNote, restoreQuestion, saveMany }
}
