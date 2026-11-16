// Cấu hình đề thi của 1 môn: lấy từ "exam" trong file môn, người dùng ghi đè được trong Cài đặt môn.
export const DEFAULT_WRONG_COUNT = 12 // ~20% của đề 60 câu
export const WRONG_COUNT_RANGE = [10, 20]

export function getExamConfig(subject, settings = {}) {
  const total = subject.questions.length
  const exam = subject.exam || {}
  const [minWrong, maxWrong] = WRONG_COUNT_RANGE
  return {
    questionCount: Math.min(settings.questionCount || exam.questionCount || 60, total),
    durationMinutes: settings.durationMinutes || exam.durationMinutes || 90,
    wrongCount: Math.min(maxWrong, Math.max(minWrong, settings.wrongCount || DEFAULT_WRONG_COUNT)),
  }
}
