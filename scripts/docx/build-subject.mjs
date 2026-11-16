// Tạo public/data/mln122-re.json từ các phần đã đọc từ ảnh (re-part*.json), đối chiếu với bộ cũ.
//   node scripts/docx/build-subject.mjs
import fs from 'node:fs'
import path from 'node:path'
import { validateSubject } from '../../src/utils/validateSubject.js'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const list = fs.readdirSync(dir).filter((f) => /^re-part\d+\.json$/.test(f)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
  .sort((a, b) => a.n - b.n)

const ns = list.map((q) => q.n)
const missing = Array.from({ length: 60 }, (_, i) => i + 1).filter((n) => !ns.includes(n))
console.log(`Đọc được ${list.length} câu | thiếu số: ${missing.join(',')}`)

// Ghi chú thêm theo câu (đối chiếu với bộ cũ)
const EXTRA_NOTE = {
  22: 'Đáp án (AB) khớp câu mln122-180 của bộ cũ, nhưng khác câu mln122-377 (cũng cùng nội dung, bộ cũ chọn ý xóa nhòa c và v cùng ý "sự hình thành của giá trị thặng dư và chi phí sản xuất tư bản chủ nghĩa"). Hai câu cũ mâu thuẫn nhau nên nên đối chiếu lại giáo trình.',
  37: 'Bộ MLN122 cũ (câu mln122-073) chọn "Thể chế nhà nước, thể chế tư bản tư nhân", nhưng bình luận trong ảnh nêu rõ đáp án là thể chế công và thể chế tư (phân loại theo cấu trúc tổ chức tham gia xã hội).',
}

const questions = list.map((q) => {
  const correct = q.pick.split('').map((l) => 'ABCDEF'.indexOf(l))
  const notes = []
  if (q.note) notes.push(q.note)
  if (EXTRA_NOTE[q.n]) notes.push(EXTRA_NOTE[q.n])
  const out = {
    id: `mln122-re-${String(q.n).padStart(3, '0')}`,
    question: q.question,
    options: q.options.map((text, i) => ({ text, correct: correct.includes(i), explain: '' })),
  }
  if (notes.length) out.note = notes.join(' ')
  return out
})

const target = path.join(dir, '../../public/data/mln122-re.json')
// Giữ lại phần giải thích đã viết (nếu có)
if (fs.existsSync(target)) {
  const prev = JSON.parse(fs.readFileSync(target, 'utf8'))
  const byId = new Map(prev.questions.map((q) => [q.id, q]))
  for (const q of questions) {
    const p = byId.get(q.id)
    if (p && p.options.length === q.options.length) q.options.forEach((o, i) => { o.explain = p.options[i].explain || '' })
  }
}
const subject = {
  id: 'mln122-re',
  name: 'MLN122 - Đề thi lại SU26 (RE)',
  exam: { questionCount: questions.length, durationMinutes: 90 },
  questions,
}
const problems = validateSubject(subject)
if (problems.length) { console.error('Lỗi cấu trúc:\n' + problems.join('\n')); process.exit(1) }
fs.writeFileSync(target, JSON.stringify(subject, null, 2) + '\n')
const multi = questions.filter((q) => q.options.filter((o) => o.correct).length > 1).length
console.log(`Đã tạo ${questions.length} câu, nhiều đáp án: ${multi}, có note: ${questions.filter((q) => q.note).length}`)
