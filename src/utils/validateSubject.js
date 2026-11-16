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
