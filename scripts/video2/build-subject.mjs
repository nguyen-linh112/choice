// Tạo public/data/mln122-sp26.json từ các phần đọc từ video SP26 C1FE (a-part*.json).
//   node scripts/video2/build-subject.mjs
import fs from 'node:fs'
import path from 'node:path'
import { validateSubject } from '../../src/utils/validateSubject.js'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const list = fs.readdirSync(dir).filter((f) => /^a-part\d+\.json$/.test(f)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
  .sort((a, b) => a.n - b.n)
const ns = list.map((q) => q.n)
console.log(`Đọc ${list.length} câu | thiếu: ${Array.from({ length: 60 }, (_, i) => i + 1).filter((n) => !ns.includes(n)).join(',')}`)

const target = path.join(dir, '../../public/data/mln122-sp26.json')
const prev = fs.existsSync(target) ? new Map(JSON.parse(fs.readFileSync(target, 'utf8')).questions.map((q) => [q.id, q])) : new Map()
const questions = list.map((q) => {
  const correct = q.pick.split('').map((l) => 'ABCDEF'.indexOf(l))
  const out = {
    id: `mln122-sp26-${String(q.n).padStart(3, '0')}`,
    question: q.question,
    options: q.options.map((text, i) => ({ text, correct: correct.includes(i), explain: '' })),
  }
  const p = prev.get(out.id)
  if (p && p.options.length === out.options.length) out.options.forEach((o, i) => { o.explain = p.options[i].explain || '' })
  if (q.note) out.note = q.note
  return out
})
const subject = { id: 'mln122-sp26', name: 'MLN122 - Đề FE SP26 (C1)', exam: { questionCount: questions.length, durationMinutes: 90 }, questions }
const problems = validateSubject(subject)
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
fs.writeFileSync(target, JSON.stringify(subject, null, 2) + '\n')
console.log(`Đã tạo ${questions.length} câu, nhiều đáp án: ${questions.filter((q) => q.options.filter((o) => o.correct).length > 1).length}, có note: ${questions.filter((q) => q.note).length}`)
