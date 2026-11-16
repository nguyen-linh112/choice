// Bộ sinh số ngẫu nhiên có "hạt giống" (mulberry32) để test cho kết quả lặp lại được.
export function seededRng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Tạo n câu giả: q1..qn, mỗi câu 4 đáp án, đáp án đầu đúng
export function makeQuestions(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: `q${i + 1}`,
    question: `Câu ${i + 1}`,
    options: [
      { text: 'Đúng', correct: true, explain: 'x' },
      { text: 'Sai 1', correct: false, explain: 'x' },
      { text: 'Sai 2', correct: false, explain: 'x' },
      { text: 'Sai 3', correct: false, explain: 'x' },
    ],
  }))
}
