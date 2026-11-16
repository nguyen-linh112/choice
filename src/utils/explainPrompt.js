// Công cụ "giải thích nhờ AI bên ngoài": web KHÔNG gọi AI. Web tạo sẵn một đoạn prompt + dữ liệu để người dùng dán
// vào AI bất kỳ, rồi dán kết quả JSON trả về vào lại.
import { effectiveExplain } from './overrides.js'

// Các câu có ít nhất 1 đáp án chưa có giải thích (đã tính cả phần người dùng tự sửa)
export function findMissingExplanations(subject, overridesMap = {}) {
  return subject.questions.filter((q) =>
    q.options.some((o, i) => !effectiveExplain(overridesMap, q.id, o.idx ?? i, o.explain).trim()),
  )
}

// Chia thành các đợt (mặc định 50 câu) để không vượt giới hạn độ dài của AI
export function chunk(list, size) {
  const out = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

export function buildExplainPrompt(subjectName, questions) {
  const data = questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options.map((o) => ({ text: o.text, correct: o.correct })),
  }))
  return `Bạn là giảng viên môn "${subjectName}". Hãy viết lời giải thích cho TỪNG đáp án của các câu trắc nghiệm bên dưới.

Quy tắc:
- Mỗi đáp án viết 1-2 câu tiếng Việt dễ hiểu.
- Đáp án đúng (correct = true): giải thích vì sao đúng. Đáp án sai (correct = false): giải thích vì sao sai, hoặc nó thực ra nói về khái niệm nào khác.
- Nếu câu hỏi dạng "chọn ý SAI / không đúng": ở ý được chọn ghi "Đây là ý sai cần chọn vì...", ở các ý còn lại ghi "Ý này đúng nên không chọn vì...".
- TUYỆT ĐỐI không nhắc tới chữ cái A/B/C/D (thứ tự đáp án sẽ bị xáo trộn). Hãy viết theo NỘI DUNG đáp án.
- Không viết kiểu "vì đây là đáp án đúng".
- Không đổi đáp án đúng/sai đã cho.

Định dạng trả về: CHỈ MỘT đối tượng JSON, không thêm chữ nào khác. Khóa là "id" của câu, giá trị là MẢNG các giải thích theo ĐÚNG THỨ TỰ và ĐÚNG SỐ LƯỢNG đáp án của câu đó. Ví dụ:
{"q-001": ["giải thích đáp án thứ nhất", "giải thích đáp án thứ hai", "..."]}

Dữ liệu (${questions.length} câu):
${JSON.stringify(data, null, 1)}`
}

// Đọc kết quả AI trả về. Chấp nhận có rào ```json ... ```, chấp nhận 2 dạng:
//   { "id": ["...", ...] }   hoặc   [ { "id": "...", "explain": ["...", ...] } ]
// Trả về { updates: { [id]: [text,...] }, errors: [chuỗi mô tả] }. Câu hợp lệ vẫn được nhận dù câu khác lỗi.
export function parseExplainResponse(text, questionsById) {
  const errors = []
  const stripped = text.replace(/```(?:json)?/gi, '')
  const start = Math.min(...['{', '['].map((c) => (stripped.indexOf(c) === -1 ? Infinity : stripped.indexOf(c))))
  const end = Math.max(stripped.lastIndexOf('}'), stripped.lastIndexOf(']'))
  if (!Number.isFinite(start) || end <= start) return { updates: {}, errors: ['Không tìm thấy dữ liệu JSON trong nội dung đã dán.'] }

  let data
  try {
    data = JSON.parse(stripped.slice(start, end + 1))
  } catch (e) {
    return { updates: {}, errors: [`JSON không hợp lệ: ${e.message}`] }
  }

  // đưa về dạng { id: mảng }
  let entries
  if (Array.isArray(data)) {
    entries = data.filter((x) => x && x.id).map((x) => [x.id, x.explain ?? x.explanations ?? x.options])
  } else {
    entries = Object.entries(data)
  }

  const updates = {}
  for (const [id, raw] of entries) {
    const q = questionsById.get(id)
    if (!q) {
      errors.push(`${id}: không có câu này trong môn.`)
      continue
    }
    // cho phép mỗi phần tử là chuỗi hoặc { explain: "..." }
    const arr = Array.isArray(raw) ? raw.map((x) => (typeof x === 'string' ? x : x?.explain)) : null
    if (!arr) errors.push(`${id}: giá trị phải là mảng các giải thích.`)
    else if (arr.length !== q.options.length) errors.push(`${id}: có ${arr.length} giải thích nhưng câu có ${q.options.length} đáp án.`)
    else if (arr.some((s) => typeof s !== 'string' || !s.trim())) errors.push(`${id}: có giải thích bị trống hoặc sai kiểu.`)
    else updates[id] = arr.map((s) => s.trim())
  }
  if (entries.length === 0) errors.push('Không có câu nào trong dữ liệu đã dán.')
  return { updates, errors }
}
