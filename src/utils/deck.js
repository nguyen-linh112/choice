// Các hàm thuần để dựng "bộ thẻ" khi ôn tập / ra đề thi.
import { shuffle } from './shuffle.js'

// Đáp án kiểu "Tất cả các phương án trên", "Các phương án đều đúng"... có nghĩa phụ thuộc VỊ TRÍ
// (đứng cuối) nên khi xáo trộn phải giữ ở cuối, nếu không sẽ sai nghĩa.
const ALL_OF_ABOVE = /^(tất cả|các phương án|các đáp án|cả hai|cả ba)/i
export const isAllOfAboveOption = (option) => ALL_OF_ABOVE.test(option.text.trim())

// Thứ tự xáo của các đáp án, dạng mảng chỉ số gốc. VD [2,0,1,3] nghĩa là đáp án hiển thị thứ nhất
// là đáp án gốc số 2... Lưu mảng này (thay vì cả câu) giúp khôi phục đúng đề thi khi tải lại trang.
export function shuffleOptionOrder(options, rng = Math.random) {
  const idx = options.map((_, i) => i)
  const normal = idx.filter((i) => !isAllOfAboveOption(options[i]))
  const pinned = idx.filter((i) => isAllOfAboveOption(options[i]))
  return [...shuffle(normal, rng), ...pinned]
}

// Sắp lại đáp án của 1 câu theo thứ tự đã cho
export const applyOptionOrder = (question, order) => ({ ...question, options: order.map((i) => question.options[i]) })

// Xáo thứ tự đáp án trong 1 câu, giữ nguyên các đáp án "tất cả..." ở cuối
export const shuffleOptions = (question, rng = Math.random) =>
  applyOptionOrder(question, shuffleOptionOrder(question.options, rng))

// Xáo thứ tự câu + thứ tự đáp án trong từng câu
export function shuffleDeck(questions, rng = Math.random) {
  return shuffle(questions, rng).map((q) => shuffleOptions(q, rng))
}

// Lọc câu theo bộ: 'all' | 'known' | 'unknown'. Câu chưa từng đánh dấu chỉ thuộc bộ 'all'.
export function filterBySet(questions, status, set) {
  if (set === 'all') return questions
  return questions.filter((q) => status[q.id] === set)
}

// Tìm vị trí câu đã học dở trong bộ (theo id câu). Không thấy thì về đầu.
export function restoreIndex(deck, questionId) {
  const i = deck.findIndex((q) => q.id === questionId)
  return i >= 0 ? i : 0
}
