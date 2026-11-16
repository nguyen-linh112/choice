// Tạo public/data/mln122-exam.json từ các phần đã đọc từ video (c1-part*.json, c2-part*.json).
//   node scripts/video/build-subject.mjs
import fs from 'node:fs'
import path from 'node:path'
import { validateSubject } from '../../src/utils/validateSubject.js'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const readParts = (prefix) =>
  fs.readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith('.json')).sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => a.n - b.n)

// Câu bị loại: đề lỗi trong video (câu hỏi và phương án không khớp nhau)
const EXCLUDE = { c1: [25], c2: [] }

// Câu mà bộ MLN122 cũ ghi đáp án khác với đa số bình luận trong video
const CONFLICT = {
  'c1-1': 'Bộ MLN122 cũ (câu mln122-367) chọn "Chủ nghĩa tư bản" nhưng đa số bình luận trong video chọn "Chủ nghĩa trọng thương"; giáo trình cũng nêu chủ nghĩa trọng thương là hệ thống lý luận đầu tiên.',
  'c1-39': 'Bộ MLN122 cũ (câu mln122-184) chọn "có nhiều yếu tố thị trường", trái với nghĩa của câu; đa số bình luận trong video chọn "Hệ thống thể chế chưa đầy đủ".',
  'c2-3': 'Bộ MLN122 cũ (câu mln122-367) chọn "Chủ nghĩa tư bản" nhưng đa số bình luận trong video chọn "Chủ nghĩa trọng thương".',
}

const questions = []
for (const exam of ['c1', 'c2']) {
  for (const q of readParts(`${exam}-part`)) {
    if (EXCLUDE[exam].includes(q.n)) continue
    const correct = q.pick.split('').map((l) => 'ABCDEF'.indexOf(l))
    const notes = []
    if (q.note) notes.push(q.note)
    const conflict = CONFLICT[`${exam}-${q.n}`]
    if (conflict) notes.push(conflict)
    const out = {
      id: `mln122-exam-${exam}-${String(q.n).padStart(3, '0')}`,
      question: q.question,
      options: q.options.map((text, i) => ({ text, correct: correct.includes(i), explain: '' })),
    }
    if (notes.length) out.note = notes.join(' ')
    questions.push(out)
  }
}

const subject = {
  id: 'mln122-exam',
  name: 'MLN122-exam - Đề thi thử FE (C1 + C2)',
  exam: { questionCount: 60, durationMinutes: 90 },
  questions,
}
const problems = validateSubject(subject)
if (problems.length) {
  console.error('Lỗi cấu trúc:\n' + problems.join('\n'))
  process.exit(1)
}
const target = path.join(dir, '../../public/data/mln122-exam.json')
if (fs.existsSync(target) && !process.argv.includes('--force') && fs.readFileSync(target, 'utf8').includes('"explain": "') && /"explain": "[^"]/.test(fs.readFileSync(target, 'utf8'))) {
  console.error('mln122-exam.json đã có giải thích; chạy lại sẽ xoá chúng. Thêm --force nếu thật sự muốn tạo lại.')
  process.exit(1)
}
fs.writeFileSync(target, JSON.stringify(subject, null, 2) + '\n')
const multi = questions.filter((q) => q.options.filter((o) => o.correct).length > 1).length
console.log(`Đã tạo ${questions.length} câu (C1: ${questions.filter((q) => q.id.includes('-c1-')).length}, C2: ${questions.filter((q) => q.id.includes('-c2-')).length}), nhiều đáp án: ${multi}, có note: ${questions.filter((q) => q.note).length}`)
