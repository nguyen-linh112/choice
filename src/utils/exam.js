// Các hàm thuần cho bài thi thử: dựng lại câu theo thứ tự đã xáo, chấm điểm, tính thời gian.
import { applyOptionOrder } from './deck.js'
import { gradeQuestion } from './grade.js'

// Điểm thang 10 = số câu đúng / tổng số câu x 10, làm tròn 2 chữ số (không có điểm từng phần)
export const computeScore = (correct, total) => (total > 0 ? Math.round((correct / total) * 10 * 100) / 100 : 0)

// item = { id, order, fromWrong } -> câu hỏi với đáp án đã sắp theo order (null nếu câu đã bị xóa khỏi đề)
export function materializeItem(item, questionsById) {
  const q = questionsById.get(item.id)
  return q ? applyOptionOrder(q, item.order) : null
}

// Chấm cả bài. answers: { [questionId]: [chỉ số đáp án đã chọn (theo thứ tự đã xáo)] }
export function gradeExam(items, questionsById, answers) {
  const results = []
  for (const item of items) {
    const q = materializeItem(item, questionsById)
    if (!q) continue
    const selected = answers[item.id] || []
    const status = selected.length === 0 ? 'blank' : gradeQuestion(q, selected) ? 'correct' : 'wrong'
    results.push({ id: item.id, fromWrong: item.fromWrong, status })
  }
  const correct = results.filter((r) => r.status === 'correct').length
  return {
    results,
    correct,
    blank: results.filter((r) => r.status === 'blank').length,
    total: results.length,
    score: computeScore(correct, results.length),
  }
}

// Thời gian còn lại tính từ mốc bắt đầu tuyệt đối => tải lại trang không làm đồng hồ chạy lại từ đầu
export const remainingSeconds = (session, now = Date.now()) =>
  Math.max(0, session.durationSeconds - Math.floor((now - session.startedAt) / 1000))

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`
}
