// Kiểm tra cấu trúc 1 môn (đúng như Phần 1). Hàm thuần: nhận object, trả về MẢNG LỖI (rỗng = hợp lệ).
// Không ném lỗi, để web báo rõ câu nào sai mà không bị sập.

const isText = (v) => typeof v === 'string' && v.trim().length > 0
const isPositiveInt = (v) => Number.isInteger(v) && v > 0

export function validateSubject(subject) {
  const errors = []
  if (!subject || typeof subject !== 'object') return ['File không phải một đối tượng JSON hợp lệ.']

  if (!isText(subject.id)) errors.push('Thiếu "id" của môn.')
  if (!isText(subject.name)) errors.push('Thiếu "name" của môn.')

  // "exam" không bắt buộc, nhưng nếu có thì phải là số nguyên dương
  if (subject.exam !== undefined) {
    const { questionCount, durationMinutes } = subject.exam || {}
    if (!isPositiveInt(questionCount)) errors.push('"exam.questionCount" phải là số nguyên dương.')
    if (!isPositiveInt(durationMinutes)) errors.push('"exam.durationMinutes" phải là số nguyên dương.')
  }

  if (!Array.isArray(subject.questions) || subject.questions.length === 0) {
    errors.push('"questions" phải là mảng có ít nhất 1 câu.')
    return errors
  }

  const seenIds = new Set()
  subject.questions.forEach((q, index) => {
    const label = `Câu thứ ${index + 1}${q && q.id ? ` (${q.id})` : ''}`
    if (!q || typeof q !== 'object') return errors.push(`${label}: không phải đối tượng.`)

    if (!isText(q.id)) errors.push(`${label}: thiếu "id".`)
    else if (seenIds.has(q.id)) errors.push(`${label}: "id" bị trùng.`)
    else seenIds.add(q.id)

    if (!isText(q.question)) errors.push(`${label}: thiếu nội dung "question".`)

    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
      errors.push(`${label}: cần từ 2 đến 6 đáp án.`)
      return
    }
    q.options.forEach((o, i) => {
      if (!o || !isText(o.text)) errors.push(`${label}: đáp án thứ ${i + 1} thiếu "text".`)
      if (typeof o?.correct !== 'boolean') errors.push(`${label}: đáp án thứ ${i + 1} thiếu "correct" (true/false).`)
    })
    if (!q.options.some((o) => o && o.correct === true)) errors.push(`${label}: chưa có đáp án đúng nào.`)
  })

  return errors
}

// ---- Môn dạng NHÓM: 1 môn có nhiều đề, mỗi đề chia thành các mục (vd Nghe / Trắc nghiệm / Đọc) ----
// { id, name, sections: [{ key, label }], sets: [{ id, name, sections: { [key]: { exam?, questions: [] } } }] }
// Mục có 0 câu là hợp lệ (chưa có đề), web hiển thị "chưa có đề".
export const isGroupSubject = (data) => !!data && typeof data === 'object' && Array.isArray(data.sets)

// Mục dạng "Viết" (type: 'writing'): không chấm đúng/sai, mỗi mục con là 1 đề bài tự luận có đáp án mẫu + giải thích.
// { id, question, answer, explain, part?, translation? }
export const isWritingSection = (group, key) => group?.sections?.find((s) => s?.key === key)?.type === 'writing'

export function validateWritingItems(items) {
  if (items === undefined || (Array.isArray(items) && items.length === 0)) return []
  if (!Array.isArray(items)) return ['"items" phải là mảng các bài viết.']
  const errors = []
  const seen = new Set()
  items.forEach((it, i) => {
    const label = `Bài viết thứ ${i + 1}${it?.id ? ` (${it.id})` : ''}`
    if (!isText(it?.id)) errors.push(`${label}: thiếu "id".`)
    else if (seen.has(it.id)) errors.push(`${label}: "id" bị trùng.`)
    else seen.add(it.id)
    if (!isText(it?.question)) errors.push(`${label}: thiếu đề bài "question".`)
    if (!isText(it?.answer)) errors.push(`${label}: thiếu đáp án mẫu "answer".`)
    if (!isText(it?.explain)) errors.push(`${label}: thiếu phần giải thích "explain".`)
  })
  return errors
}

export function validateGroup(group) {
  const errors = []
  if (!isText(group?.id)) errors.push('Thiếu "id" của môn.')
  if (!isText(group?.name)) errors.push('Thiếu "name" của môn.')
  if (!Array.isArray(group?.sections) || group.sections.length === 0) {
    errors.push('"sections" phải là mảng các mục, mỗi mục có "key" và "label".')
    return errors
  }
  const keys = new Set()
  group.sections.forEach((s, i) => {
    if (!isText(s?.key)) errors.push(`Mục thứ ${i + 1}: thiếu "key".`)
    else if (keys.has(s.key)) errors.push(`Mục "${s.key}" bị trùng.`)
    else keys.add(s.key)
    if (!isText(s?.label)) errors.push(`Mục thứ ${i + 1}: thiếu "label".`)
  })
  if (group.sets.length === 0) errors.push('"sets" phải có ít nhất 1 đề.')
  const setIds = new Set()
  group.sets.forEach((set, i) => {
    const label = `Đề thứ ${i + 1}${set?.id ? ` (${set.id})` : ''}`
    if (!isText(set?.id)) errors.push(`${label}: thiếu "id".`)
    else if (setIds.has(set.id)) errors.push(`${label}: "id" bị trùng.`)
    else setIds.add(set.id)
    if (!isText(set?.name)) errors.push(`${label}: thiếu "name".`)
    for (const [key, sec] of Object.entries(set?.sections || {})) {
      if (!keys.has(key)) { errors.push(`${label}: mục "${key}" không có trong "sections" của môn.`); continue }
      if (isWritingSection(group, key)) {
        validateWritingItems(sec?.items).forEach((m) => errors.push(`${label} / ${key}: ${m}`))
        continue
      }
      if (!sec?.questions?.length) continue
      const probe = { id: `${group.id}-${set.id}-${key}`, name: `${group.name} ${set.name} ${key}`, exam: sec.exam, questions: sec.questions }
      validateSubject(probe).forEach((m) => errors.push(`${label} / ${key}: ${m}`))
    }
  })
  return errors
}

// Id của môn con (1 mục của 1 đề). Mỗi môn con có tiến độ, câu sai, lịch sử thi riêng.
export const sectionSubjectId = (groupId, setId, key) => `${groupId}--${setId}--${key}`
