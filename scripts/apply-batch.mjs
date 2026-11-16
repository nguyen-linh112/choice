// Dùng: node scripts/apply-batch.mjs <batch.json> [tên-file-môn, mặc định mln122.json]
//   vd: node scripts/apply-batch.mjs scripts/batches/re-01.json mln122-re.json
// Khoá câu: phần đuôi của id sau dấu '-' (vd "061", hoặc "c1-001" với mln122-exam).
// Mỗi batch: { "061": { q?: "câu hỏi đã sửa", t?: { "0": "text đã sửa" }, e?: ["giải thích đáp án 0", ...], note?: "..." } }
// Script KHÔNG bao giờ đụng tới trường "correct".
import fs from 'node:fs'
const file = new URL('../public/data/' + (process.argv[3] || 'mln122.json'), import.meta.url)
const data = JSON.parse(fs.readFileSync(file, 'utf8'))
const findQ = (key) => data.questions.find((q) => q.id === key || q.id.endsWith('-' + key))
const batch = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const bad = /(đáp án|phương án|ý|câu|lựa chọn)\s+[A-E]\b|^\s*[A-E][.)]\s/
let nE = 0, nFix = 0
for (const [id, p] of Object.entries(batch)) {
  const q = findQ(id)
  if (!q) { console.error('Không có câu', id); process.exit(1) }
  if (p.q) { q.question = p.q; nFix++ }
  for (const [i, t] of Object.entries(p.t || {})) { q.options[i].text = t; nFix++ }
  if (p.e) {
    if (p.e.length !== q.options.length) { console.error('Sai số giải thích ở', id, p.e.length, 'vs', q.options.length); process.exit(1) }
    p.e.forEach((e, i) => {
      if (!e || !e.trim()) { console.error('Giải thích rỗng ở', id, i); process.exit(1) }
      if (bad.test(e)) console.warn('Có thể nhắc chữ cái ở', id, i, e)
      q.options[i].explain = e.trim()
    })
    nE++
  }
  if (p.note) q.note = p.note
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
console.log(`OK ${process.argv[2]}: ${Object.keys(batch).length} câu, ${nE} câu có giải thích mới, ${nFix} chỗ sửa chính tả`)
