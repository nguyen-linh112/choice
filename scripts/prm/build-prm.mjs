// Tạo 2 môn nhóm PRM392 (Android) và PRM393 (Flutter): node scripts/prm/build-prm.mjs
// Dữ liệu thô: scripts/prm/raw/*.mjs (đọc từ video), giải thích: scripts/prm/explain/*.mjs.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateGroup } from '../../src/utils/validateSubject.js'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const load = (p) => import(pathToFileURL(path.join(dir, p)).href)
const OUT = path.join(dir, '../../public/data')

const REF_NOTE = 'Đáp án tham khảo: lấy theo bình luận trên FUOverflow, có đối chiếu lại bằng kiến thức; chưa phải đáp án chính thức. Nếu thấy lệch thì tự kiểm tra lại.'
const LETTERS = 'ABCDEF'

const GROUPS = [
  {
    id: 'prm392',
    name: 'PRM392 - Lập trình Android',
    file: 'prm392.json',
    sets: [
      { id: 'sp26-re', name: 'Đề SP26 - RE (thi lại)', src: 'prm392-sp26-re', prefix: 'prm392-sp26re' },
      { id: 'fa23-fe', name: 'Đề FA23 - FE', src: 'prm392-fa23-fe', prefix: 'prm392-fa23fe' },
      { id: 'fa23-re', name: 'Đề FA23 - RE (thi lại)', src: 'prm392-fa23-re', prefix: 'prm392-fa23re' },
    ],
  },
  {
    id: 'prm393',
    name: 'PRM393 - Lập trình Flutter',
    file: 'prm393.json',
    sets: [{ id: 'su26-fe', name: 'Đề SU26 - FE', src: 'prm393-su26-fe', prefix: 'prm393-su26fe' }],
  },
]

const SKIP_PREFIX = /^(Đúng|Sai|Ý này đúng|Đây là|Phần này)/

function buildQuestions(def, raw, ex) {
  const neg = ex.NEG || {}
  return raw.CHOICE.map((row, idx) => {
    const n = idx + 1
    const [, text, options, pick, , note] = row
    const correct = Array.isArray(pick) ? pick : [LETTERS.indexOf(pick)]
    if (correct.some((c) => c < 0 || c >= options.length)) throw new Error(`${def.prefix}-${n}: đáp án sai`)
    const e = ex.E[n]
    if (!e) throw new Error(`${def.prefix}-${n}: thiếu giải thích`)
    const isNeg = Object.prototype.hasOwnProperty.call(neg, n)
    const [okPre, noPre] = (isNeg && neg[n]) || (isNeg ? ['Đây là ý sai cần chọn. ', 'Ý này đúng nên không chọn. '] : ['Đúng. ', 'Sai. '])
    const opts = options.map((t, i) => {
      const raw1 = e[LETTERS[i]]
      if (!raw1 || raw1.length < 8) throw new Error(`${def.prefix}-${n}: thiếu giải thích đáp án ${LETTERS[i]}`)
      const isCorrect = correct.includes(i)
      let explain = raw1
      if (!SKIP_PREFIX.test(raw1)) explain = (isCorrect ? okPre : noPre) + raw1
      else if (/^Đúng/.test(raw1) && !isCorrect) throw new Error(`${def.prefix}-${n} ${LETTERS[i]}: giải thích ghi Đúng nhưng đáp án sai`)
      else if (/^Sai/.test(raw1) && isCorrect) throw new Error(`${def.prefix}-${n} ${LETTERS[i]}: giải thích ghi Sai nhưng là đáp án đúng`)
      if (/(phương án|đáp án|ý|câu)\s+[ABCDEF]\b/.test(explain)) throw new Error(`${def.prefix}-${n} ${LETTERS[i]}: nhắc chữ cái đáp án`)
      return { text: t, correct: isCorrect, explain }
    })
    for (const k of Object.keys(e)) if (LETTERS.indexOf(k) >= options.length) throw new Error(`${def.prefix}-${n}: thừa giải thích ${k}`)
    const q = {
      id: `${def.prefix}-${String(n).padStart(2, '0')}`,
      question: text,
      options: opts,
      note: note ? `${note} ${REF_NOTE}` : REF_NOTE,
    }
    if (options.some((o) => /others?\b|^\d+(,\d+)+$/i.test(o.trim()))) q.fixedOrder = true
    return q
  })
}

for (const g of GROUPS) {
  const sets = []
  for (const def of g.sets) {
    const raw = await load(`raw/${def.src}.mjs`)
    const ex = await load(`explain/${def.src}.mjs`)
    const questions = buildQuestions(def, raw, ex)
    const missing = Object.keys(ex.E).filter((k) => Number(k) > questions.length)
    if (missing.length) throw new Error(`${def.src}: giải thích thừa cho câu ${missing.join(',')}`)
    sets.push({ id: def.id, name: def.name, sections: { choice: { exam: { questionCount: Math.min(60, questions.length), durationMinutes: 60 }, questions } } })
    console.log(`${def.id}: ${questions.length} câu`)
  }
  const group = { id: g.id, name: g.name, sections: [{ key: 'choice', label: 'Trắc nghiệm' }], sets }
  const problems = validateGroup(group)
  if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
  fs.writeFileSync(path.join(OUT, g.file), JSON.stringify(group, null, 2) + '\n')
}

// Đăng ký vào index.json
const indexPath = path.join(OUT, 'index.json')
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
for (const g of GROUPS) if (!index.some((x) => x.id === g.id)) index.push({ id: g.id, name: g.name, file: g.file })
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n')
console.log('OK')
