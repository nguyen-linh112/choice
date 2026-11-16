// Bản giải thích / ghi chú do người dùng tự sửa. Lưu RIÊNG, ghi đè lên bản gốc khi hiển thị.
// Dạng của 1 môn: { [questionId]: { explain: { [chỉ số đáp án GỐC]: "text" }, note: "text" } }
// (chỉ số gốc = thứ tự trong file môn, không đổi khi xáo trộn đáp án). Các hàm đều thuần và trả bản mới.

const prune = (map, qid) => {
  const e = map[qid]
  if (e && Object.keys(e.explain || {}).length === 0 && e.note === undefined) {
    const next = { ...map }
    delete next[qid]
    return next
  }
  return map
}

// Đặt giải thích cho 1 đáp án. Nếu giống hệt bản gốc thì bỏ phần ghi đè (không có gì để "khôi phục").
export function setExplainOverride(map, qid, optionIdx, text, baseText = '') {
  const cur = map[qid] || {}
  const explain = { ...(cur.explain || {}) }
  if (text === baseText) delete explain[optionIdx]
  else explain[optionIdx] = text
  const next = { ...map, [qid]: { ...cur, explain } }
  return prune(next, qid)
}

export function setNoteOverride(map, qid, note, baseNote = '') {
  const cur = map[qid] || {}
  const next = { ...map, [qid]: { ...cur } }
  if ((note || '') === (baseNote || '')) delete next[qid].note
  else next[qid].note = note
  return prune(next, qid)
}

// "Khôi phục bản gốc" cho cả câu
export function clearQuestionOverride(map, qid) {
  const next = { ...map }
  delete next[qid]
  return next
}

export const hasOverride = (map, qid) => !!map[qid]

// Giá trị đang hiển thị: có ghi đè thì dùng ghi đè (kể cả rỗng), không thì dùng bản gốc
export const effectiveExplain = (map, qid, optionIdx, base) => {
  const v = map[qid]?.explain?.[optionIdx]
  return v !== undefined ? v : base || ''
}
export const effectiveNote = (map, qid, base) => {
  const v = map[qid]?.note
  return v !== undefined ? v : base || ''
}

// Gộp ghi đè vào môn để xuất file / kiểm tra thiếu giải thích. Cần option.idx (chỉ số gốc) hoặc dùng thứ tự trong mảng.
export function mergeSubjectWithOverrides(subject, map) {
  return {
    ...subject,
    questions: subject.questions.map((q) => {
      const note = effectiveNote(map, q.id, q.note)
      const merged = {
        ...q,
        options: q.options.map((o, i) => ({ ...o, explain: effectiveExplain(map, q.id, o.idx ?? i, o.explain) })),
      }
      if (note) merged.note = note
      else delete merged.note
      return merged
    }),
  }
}

// Bỏ các trường chỉ dùng nội bộ (idx, source) trước khi xuất ra file JSON đúng cấu trúc Phần 1
export function toExportableSubject(subject) {
  const { source, ...rest } = subject
  return {
    ...rest,
    questions: subject.questions.map((q) => ({
      ...q,
      options: q.options.map(({ idx, ...o }) => o),
    })),
  }
}
