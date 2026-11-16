// Dùng: node scripts/show.mjs <từ> <đến>   (số thứ tự 1-based, gồm cả hai đầu)
// In gọn câu hỏi + đáp án (dấu * = đáp án đúng) để rà chính tả và viết giải thích.
import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync(new URL('../public/data/mln122.json', import.meta.url)))
const [a, b] = [Number(process.argv[2]), Number(process.argv[3])]
d.questions.slice(a - 1, b).forEach((q) => {
  console.log(`#${q.id.slice(-3)} ${q.question}${q.note ? `  [NOTE: ${q.note}]` : ''}`)
  q.options.forEach((o, i) => console.log(`  ${i}${o.correct ? '*' : ' '} ${o.text}`))
})
