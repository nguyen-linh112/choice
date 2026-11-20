// Thêm 5 đề thi lại / giữa kỳ vào môn nhóm JPD326: node scripts/jpd/build-more-exams.mjs
// Dữ liệu thô: scripts/jpd/raw/*.mjs (đọc từ video), giải thích: scripts/jpd/explain/*.mjs.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateGroup } from '../../src/utils/validateSubject.js'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const load = (p) => import(pathToFileURL(path.join(dir, p)).href)

const PROMPT = {
  fill: 'Chọn đáp án thích hợp trong A, B, C, D để điền vào ngoặc cho câu sau:',
  blank: 'Chọn đáp án đúng trong A, B, C, D để điền vào chỗ trống:',
  read: 'Các từ trong ngoặc 【 】 dưới đây có cách đọc tương ứng như thế nào? Hãy chọn đáp án đúng trong A, B, C, D:',
  kanji: 'Các từ trong ngoặc 【 】 dưới đây có chữ Hán tương ứng như thế nào? Hãy chọn đáp án đúng trong A, B, C, D:',
  hira: 'Các từ Hiragana trong ngoặc có chữ Hán tương ứng như thế nào trong câu? Hãy chọn đáp án đúng trong A, B, C, D:',
  emo: 'Chọn đáp án đúng miêu tả cảm xúc, tâm trạng khi gặp tình huống sau:',
  syn: 'Chọn đáp án gần nghĩa với từ sau:',
  vocab: '〔語彙〕正しい答えを一つえらびなさい：',
  gram: '〔文法〕正しい答えを一つえらびなさい：',
  star: '〔文法★〕★のところに一番いいものを入れなさい：',
  kanjiW: '〔漢字〕言葉の正しい漢字をえらびなさい：',
  kanjiR: '〔漢字〕漢字の正しい読み方をえらびなさい：',
}
const READ_HEAD = '次の文章を読んで、後の問いに対する答えとして最もよいものを、A・B・C・Dから一つ選んでください。'
const REF_NOTE = 'Đáp án tham khảo: lấy theo bình luận trên FUOverflow, có đối chiếu lại bằng ngữ pháp; chưa phải đáp án chính thức. Nếu thấy lệch thì tự kiểm tra lại.'

const EXAMS = [
  { id: 'su24-r-fe', name: 'Đề SU24 - R - FE (thi lại)', file: 'su24r-fe', prefix: 'jpd326-su24rfe', exam: { choice: [44, 45], reading: [2, 15] } },
  { id: 'su24-me', name: 'Đề SU24 - ME', file: 'su24me', prefix: 'jpd326-su24me', exam: { choice: [37, 45], reading: [3, 15] } },
  { id: 'sp24-rre', name: 'Đề SP24 - RRE (thi lại)', file: 'sp24rre', prefix: 'jpd326-sp24rre', exam: { choice: [44, 45], reading: [4, 20] } },
  { id: 'sp24-me', name: 'Đề SP24 - ME (diễn đàn chỉ có 25 câu)', file: 'sp24me', prefix: 'jpd326-sp24me', exam: { choice: [25, 30], reading: [3, 15] } },
  { id: 'su23-2ndfe-r', name: 'Đề SU23 - 2ndFE - R (thi lại)', file: 'su23fe2r', prefix: 'jpd326-su23fe2r', exam: { choice: [44, 45], reading: [3, 20] } },
]

function mk(prefix, kind, n, text, options, pick, votes, note, explain) {
  const idx = 'ABCD'.indexOf(pick)
  if (idx < 0 || options.length !== 4) throw new Error(`${prefix}-${n}: đáp án/đề sai`)
  if (!Array.isArray(explain) || explain.length !== 4 || explain.some((e) => !e || e.length < 10)) throw new Error(`${prefix}-${n}: thiếu giải thích`)
  for (const e of explain) if (/(phương án|đáp án|ý|câu)\s+[ABCD]\b/.test(e)) throw new Error(`${prefix}-${n}: giải thích nhắc chữ cái đáp án: ${e.slice(0, 40)}`)
  return {
    id: `${prefix}-${String(n).padStart(2, '0')}`,
    question: text,
    options: options.map((t, i) => ({ text: t, correct: i === idx, explain: explain[i] })),
    note: note ? `${note} ${REF_NOTE}` : REF_NOTE,
  }
}

const target = path.join(dir, '../../public/data/jpd326.json')
const group = JSON.parse(fs.readFileSync(target, 'utf8'))

for (const def of EXAMS) {
  const raw = await load(`raw/${def.file}.mjs`)
  const ex = await load(`explain/${def.file}.mjs`)
  const choice = raw.CHOICE.map(([n, kind, text, options, pick, votes, note]) =>
    mk(`${def.prefix}-c`, kind, n, `${PROMPT[kind]}\n${text}`, options, pick, votes, note, ex.CHOICE[n]))
  const reading = raw.READING.questions.map(([n, q, options, pick, votes, note]) =>
    mk(`${def.prefix}-r`, 'read', n, `${READ_HEAD}\n\n${raw.READING.passage}\n\n${n}) ${q}`, options, pick, votes, note, ex.READING[n]))
  for (const q of reading) q.translation = ex.READING.translation
  const nums = raw.CHOICE.map((r) => r[0])
  if (new Set(nums).size !== nums.length) throw new Error(`${def.id}: trùng số câu`)
  const set = {
    id: def.id,
    name: def.name,
    sections: {
      listening: { questions: [] },
      choice: { exam: { questionCount: choice.length, durationMinutes: def.exam.choice[1] }, questions: choice },
      reading: { exam: { questionCount: reading.length, durationMinutes: def.exam.reading[1] }, questions: reading },
    },
  }
  const i = group.sets.findIndex((s) => s.id === def.id)
  if (i >= 0) group.sets[i] = set
  else group.sets.push(set)
  console.log(`${def.id}: trắc nghiệm ${choice.length}, đọc ${reading.length}`)
}

// Giữ mục Viết ở cuối danh sách đề (các đề Viết A/B) cho gọn
const rank = (s) => (s.id.startsWith('viet-') ? 1 : 0)
group.sets.sort((a, b) => rank(a) - rank(b))

const problems = validateGroup(group)
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
fs.writeFileSync(target, JSON.stringify(group, null, 2) + '\n')
console.log('Đã ghi jpd326.json. Các đề:', group.sets.map((s) => s.id).join(', '))
