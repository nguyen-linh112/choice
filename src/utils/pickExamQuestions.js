// Chọn câu cho 1 đề thi thử.
//  1. Lấy tối đa wrongTarget câu từ danh sách sai (ưu tiên sai nhiều nhất, rồi câu lâu chưa gặp).
//  2. Phần còn lại lấy từ các câu khác, ưu tiên câu CHƯA TỪNG xuất hiện trong các đề trước.
//  3. Xáo thứ tự câu và thứ tự đáp án. Mỗi lần gọi ra đề khác nhau.
// Trả về [{ id, fromWrong, order }]: order = thứ tự đáp án đã xáo (mảng chỉ số gốc).
import { shuffle } from './shuffle.js'
import { shuffleOptionOrder } from './deck.js'
import { compareWrongPriority } from './wrongList.js'

export function pickExamQuestions({
  questions,
  wrongList = {},
  seen = {}, // { [questionId]: mốc thời gian lần gần nhất xuất hiện trong đề thi }
  questionCount,
  wrongTarget = 12,
  maxWrongRatio = 0.5, // đề nhỏ (vd 10 câu) thì câu sai không được chiếm quá nửa, để vẫn có kiến thức mới
  rng = Math.random,
}) {
  const total = Math.min(questionCount, questions.length)
  const byId = new Map(questions.map((q) => [q.id, q]))

  // --- Phần 1: câu từ danh sách sai ---
  // Xáo trước rồi mới sắp theo ưu tiên: các câu bằng điểm nhau sẽ được chọn ngẫu nhiên (sort ổn định).
  const wrongIds = shuffle(
    Object.keys(wrongList).filter((id) => byId.has(id)), // bỏ câu đã bị xóa khỏi đề
    rng,
  ).sort(compareWrongPriority(wrongList))
  const wrongN = Math.min(wrongTarget, wrongIds.length, Math.floor(total * maxWrongRatio))
  const pickedWrong = wrongIds.slice(0, wrongN)

  // --- Phần 2: các câu còn lại ---
  const taken = new Set(pickedWrong)
  const others = questions.filter((q) => !taken.has(q.id))
  const unseen = shuffle(others.filter((q) => !(q.id in seen)), rng)
  // Hết câu chưa gặp thì lấy câu lâu chưa gặp nhất (xáo trước để các câu bằng nhau chọn ngẫu nhiên)
  const seenOld = shuffle(others.filter((q) => q.id in seen), rng).sort((a, b) => seen[a.id] - seen[b.id])
  const pickedOthers = [...unseen, ...seenOld].slice(0, total - pickedWrong.length)

  const chosen = [
    ...pickedWrong.map((id) => ({ q: byId.get(id), fromWrong: true })),
    ...pickedOthers.map((q) => ({ q, fromWrong: false })),
  ]
  return shuffle(chosen, rng).map(({ q, fromWrong }) => ({
    id: q.id,
    fromWrong,
    order: shuffleOptionOrder(q.options, rng, q.fixedOrder),
  }))
}
