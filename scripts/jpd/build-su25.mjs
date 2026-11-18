// Thêm 2 đề SU25 vào môn nhóm JPD326: public/data/jpd326.json (giữ nguyên đề SU24 và phần giải thích đã có).
//   node scripts/jpd/build-su25.mjs
// Dữ liệu thô đọc từ video: scripts/jpd/raw/*.json; giải thích: scripts/jpd/explain-*.json
import fs from 'node:fs'
import path from 'node:path'
import { validateGroup } from '../../src/utils/validateSubject.js'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
const readParts = (names) => names.flatMap((n) => readJson(`raw/${n}.json`)).sort((a, b) => a.n - b.n)

const REF_NOTE = 'Đáp án tham khảo: lấy theo bình luận trên FUOverflow (có đối chiếu ngữ pháp), chưa phải đáp án chính thức. Nếu thấy lệch thì tự kiểm tra lại.'

function buildQuestions(prefix, raws, explainFile) {
  const explain = explainFile ? readJson(explainFile) : {}
  return raws.map((q) => {
    const correct = q.pick.split('').map((l) => 'ABCDEF'.indexOf(l))
    const ex = explain[String(q.n)]
    if (!ex || ex.length !== q.options.length) { console.error(`Thiếu/sai số giải thích ở ${prefix} câu ${q.n}`); process.exit(1) }
    return {
      id: `${prefix}-${String(q.n).padStart(2, '0')}`,
      question: q.question,
      options: q.options.map((text, i) => ({ text, correct: correct.includes(i), explain: ex[i] })),
      note: q.note ? `${q.note} ${REF_NOTE}` : REF_NOTE,
    }
  })
}

const SETS = [
  {
    id: 'su25-h1-me2',
    name: 'Đề SU25 - H1 - ME2',
    choice: { prefix: 'jpd326-su25me2-c', parts: ['h1me2-part1', 'h1me2-part2', 'h1me2-part3', 'h1me2-part4'], explain: 'explain-me2-choice.json', exam: { questionCount: 36, durationMinutes: 45 } },
    reading: { prefix: 'jpd326-su25me2-r', parts: ['h1me2-reading'], explain: 'explain-me2-reading.json', exam: { questionCount: 3, durationMinutes: 20 } },
  },
  {
    id: 'su25-fe',
    name: 'Đề SU25 - FE',
    choice: { prefix: 'jpd326-su25fe-c', parts: ['fe-part1', 'fe-part2', 'fe-part3', 'fe-part4', 'fe-part5', 'fe-part6'], explain: 'explain-fe-choice.json', exam: { questionCount: 40, durationMinutes: 45 } },
    reading: { prefix: 'jpd326-su25fe-r', parts: ['fe-reading'], explain: 'explain-fe-reading.json', exam: { questionCount: 3, durationMinutes: 20 } },
  },
]

const target = path.join(dir, '../../public/data/jpd326.json')
const group = JSON.parse(fs.readFileSync(target, 'utf8'))

for (const def of SETS) {
  const sections = {}
  for (const key of ['choice', 'reading']) {
    const s = def[key]
    const raws = readParts(s.parts)
    const ns = raws.map((q) => q.n)
    if (new Set(ns).size !== ns.length) { console.error(`Trùng số câu ở ${def.id}/${key}`); process.exit(1) }
    const questions = buildQuestions(s.prefix, raws, s.explain)
    sections[key] = { exam: { ...s.exam, questionCount: questions.length }, questions }
    console.log(`${def.id}/${key}: ${questions.length} câu (số câu: ${ns[0]}–${ns[ns.length - 1]})`)
  }
  sections.listening = { questions: [] }
  const i = group.sets.findIndex((x) => x.id === def.id)
  const set = { id: def.id, name: def.name, sections }
  if (i >= 0) group.sets[i] = set
  else group.sets.push(set)
}

const problems = validateGroup(group)
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
fs.writeFileSync(target, JSON.stringify(group, null, 2) + '\n')
console.log('Đã ghi jpd326.json. Các đề:', group.sets.map((s) => s.id).join(', '))
