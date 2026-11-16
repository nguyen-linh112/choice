// Điền giải thích cho mln122-exam từ các câu GIỐNG HỆT (cùng câu hỏi, cùng đáp án, cùng đáp án đúng) ở mln122.json và mln122-re.json.
//   node scripts/docx/fill-exam-from-existing.mjs [--write]
import fs from 'node:fs'
import path from 'node:path'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const SUBJ = process.argv.find((a) => a.endsWith('.json') && !a.includes('/')) || 'mln122-exam.json'
const file = path.join(dir, '../../public/data/' + SUBJ)
const exam = JSON.parse(fs.readFileSync(file, 'utf8'))
const load = (f) => JSON.parse(fs.readFileSync(path.join(dir, '../../public/data', f), 'utf8')).questions
const sources = [...load('mln122-re.json'), ...load('mln122-exam.json'), ...load('mln122.json')].filter((q) => !(SUBJ === 'mln122-exam.json' && false)).filter((q) => q.options.every((o) => o.explain))
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
const tri = (s) => { const t = norm(s); const set = new Set(); for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3)); return set }
const sim = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1) }
const srcTri = sources.map((q) => tri(q.question))

let filled = 0
const left = []
for (const q of exam.questions) {
  if (q.options.every((o) => o.explain)) continue
  const t = tri(q.question)
  let done = false
  const order = srcTri.map((s, i) => [sim(t, s), i]).filter(([s]) => s >= 0.8).sort((a, b) => b[0] - a[0])
  for (const [, i] of order) {
    const src = sources[i]
    const map = q.options.map((o) => src.options.findIndex((x) => norm(x.text) === norm(o.text)))
    if (map.some((k) => k < 0) || new Set(map).size !== map.length) continue
    // đáp án đúng phải khớp
    if (q.options.some((o, k) => o.correct !== src.options[map[k]].correct)) continue
    // số đáp án nguồn phải bằng (tránh nguồn có thêm lựa chọn khác)
    if (src.options.length !== q.options.length) continue
    q.options.forEach((o, k) => { o.explain = src.options[map[k]].explain })
    filled++; done = true; break
  }
  if (!done) left.push(q.id)
}
console.log(`Đã điền ${filled} câu, còn lại ${left.length} câu chưa có giải thích`)
fs.writeFileSync(path.join(dir, 'exam-left.json'), JSON.stringify(left, null, 1))
if (process.argv.includes('--write')) {
  fs.writeFileSync(file, JSON.stringify(exam, null, 2) + '\n')
  console.log('Đã ghi mln122-exam.json')
}
