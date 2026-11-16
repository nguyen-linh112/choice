// Kiểm tra bộ tách đề thô trên 1 file PDF thật, ngoài trình duyệt:
//   node scripts/check-pdf-parser.mjs đường-dẫn-file.pdf [public/data/mon-da-lam-sach.json]
// In ra: số thẻ tách được, số câu cần xem lại, các khối không tách được. Nếu truyền thêm file JSON đã làm sạch
// của cùng đề, so sánh đáp án đúng để biết bộ tách đúng bao nhiêu phần trăm.
import fs from 'node:fs'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { pageToText } from '../src/utils/pdfText.js'
import { mergeDuplicates, parseRawExam } from '../src/utils/parseRawExam.js'

const [pdfPath, refPath] = process.argv.slice(2)
if (!pdfPath) {
  console.log('Cách dùng: node scripts/check-pdf-parser.mjs file.pdf [tham-chieu.json]')
  process.exit(1)
}

const pdf = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(pdfPath)), useSystemFonts: true }).promise
const pages = []
for (let n = 1; n <= pdf.numPages; n++) {
  const page = await pdf.getPage(n)
  const { width } = page.getViewport({ scale: 1 })
  pages.push(pageToText((await page.getTextContent()).items, width))
}
const { questions, rejected } = parseRawExam(pages.join('\n'), { idPrefix: 'q' })
const merged = mergeDuplicates(questions)
console.log(`Tách được ${questions.length} thẻ, sau khi gộp trùng còn ${merged.questions.length}. Khối không tách được: ${rejected.length}.`)
console.log(`Câu cần xem lại: ${questions.filter((q) => q.uncertain).length}`)
questions.filter((q) => q.uncertain).forEach((q) => console.log(`  ${q.id} | ${q.question.slice(0, 60)} | ${q.issues.join('; ')}`))
rejected.forEach((r) => console.log(`  [không tách được] ${r.raw.slice(0, 80).replace(/\n/g, ' / ')}`))

if (refPath) {
  const ref = JSON.parse(fs.readFileSync(refPath, 'utf8')).questions
  const tri = (s) => {
    const t = s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
    const set = new Set()
    for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3))
    return set
  }
  const sim = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1) }
  const refTri = ref.map((r) => tri(r.question + ' ' + r.options.map((o) => o.text).join(' ')))
  let compared = 0, agree = 0
  for (const q of merged.questions) {
    const t = tri(q.question + ' ' + q.options.map((o) => o.text).join(' '))
    let best = -1, bs = 0
    refTri.forEach((r, i) => { const s = sim(t, r); if (s > bs) { bs = s; best = i } })
    if (bs < 0.55) continue
    compared++
    if (q.options.map((o) => o.correct).join() === ref[best].options.map((o) => o.correct).join()) agree++
  }
  console.log(`So với file tham chiếu: so sánh ${compared} câu, trùng đáp án đúng ${agree}.`)
}
