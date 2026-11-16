// Tính số liệu hiển thị trên thẻ môn. Hàm thuần, không đụng tới localStorage.

// progress.status chỉ nhớ id câu; câu đã bị xóa khỏi đề (id không còn) thì không được tính.
export function computeSubjectStats(subject, progress, wrongList, history) {
  const total = subject.questions.length
  let known = 0
  let unknown = 0
  for (const q of subject.questions) {
    const s = progress.status?.[q.id]
    if (s === 'known') known++
    else if (s === 'unknown') unknown++
  }
  const validIds = new Set(subject.questions.map((q) => q.id))
  const wrongCount = Object.keys(wrongList || {}).filter((id) => validIds.has(id)).length
  const lastExam = history && history.length ? history[history.length - 1] : null

  return {
    total,
    known,
    unknown,
    unseen: total - known - unknown,
    wrongCount,
    lastScore: lastExam ? lastExam.score : null,
  }
}

// Nhãn đáp án A, B, C... do web tự gắn (dữ liệu không chứa nhãn)
export const optionLabel = (index) => String.fromCharCode(65 + index)
