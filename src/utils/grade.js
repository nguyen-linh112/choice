// Chấm 1 câu. selected = mảng chỉ số đáp án người dùng đã chọn.
// Câu nhiều đáp án đúng: CHỈ đúng khi chọn đúng và đủ (thiếu hoặc thừa đều sai).
export function gradeQuestion(question, selected) {
  const correct = question.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0)
  const chosen = [...new Set(selected)]
  return chosen.length === correct.length && correct.every((i) => chosen.includes(i))
}

export const countCorrect = (question) => question.options.filter((o) => o.correct).length
