// Kiểm tra cuối: node scripts/verify.mjs
// 1) "correct" không đổi so với bản gốc  2) không còn explain rỗng  3) quét lỗi chính tả/chữ cái A-E
// 4) liệt kê câu có note  5) liệt kê câu có phương án kiểu "tất cả phương án" (rủi ro khi xáo trộn)
import fs from 'node:fs'
const read = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'))
const cur = read('../public/data/mln122.json')
const org = read('./mln122.original.json')

let problems = 0
const orgById = new Map(org.questions.map((q) => [q.id, q]))
for (const q of cur.questions) {
  const o = orgById.get(q.id)
  if (!o) continue // câu mới thêm (mln122-464)
  if (o.options.length !== q.options.length) { console.log('LỆCH SỐ ĐÁP ÁN', q.id); problems++ }
  o.options.forEach((op, i) => {
    if (op.correct !== q.options[i].correct) { console.log('ĐỔI correct!', q.id, i); problems++ }
  })
}
let empty = 0, written = 0
for (const q of cur.questions) {
  if (q.options.filter((o) => o.correct).length < 1) { console.log('KHÔNG CÓ ĐÁP ÁN ĐÚNG', q.id); problems++ }
  for (const o of q.options) {
    if (!o.explain || !o.explain.trim()) { empty++; console.log('EXPLAIN RỖNG', q.id) } else written++
    if (!o.text || !o.text.trim()) { console.log('TEXT RỖNG', q.id); problems++ }
  }
}

// Từ hay bị lỗi scan (không dấu / sai dấu thường gặp)
const typo = /\b(đấy mạnh|thữ|tiên tệ|thế kỳ|thế ký|tư bàn|Đàng Cộng|nên kinh tế|nèn|hàng hoá|vẽ kinh|phúc tạp|lao đông|đông nhất|thị trưởng|tố chức|xuất khấu|nhập khấu|thặng du|thăng dư|giá cà|ảnh hướng|khái niêm|độc quyên|điêu kiện)\b/gi
const letterRef = /(đáp án|phương án|ý|câu|lựa chọn)\s+[A-E]\b/
const hits = []
for (const q of cur.questions) {
  const texts = [q.question, ...q.options.map((o) => o.text), ...q.options.map((o) => o.explain || ''), q.note || '']
  for (const t of texts) {
    const m = t.match(typo)
    if (m) hits.push(`${q.id}: ${m[0]}  <- ${t.slice(0, 70)}`)
    if (letterRef.test(t)) hits.push(`${q.id}: NHẮC CHỮ CÁI <- ${t.slice(0, 70)}`)
    if (/\|\s*$|^\|/.test(t)) hits.push(`${q.id}: KÝ TỰ | <- ${t.slice(0, 70)}`)
  }
}
console.log('--- Quét chính tả ---'); hits.forEach((h) => console.log(h)); console.log('Số nghi vấn:', hits.length)

const notes = cur.questions.filter((q) => q.note)
console.log('--- Câu có note:', notes.length); console.log(notes.map((q) => q.id.slice(-3)).join(', '))
const allOpt = cur.questions.filter((q) => q.options.some((o) => /^(tất cả|các phương án|cả hai|các đáp án)/i.test(o.text.trim())))
console.log('--- Câu có phương án kiểu "tất cả phương án...":', allOpt.length); console.log(allOpt.map((q) => q.id.slice(-3)).join(', '))
const multi = cur.questions.filter((q) => q.options.filter((o) => o.correct).length > 1)
console.log('--- Câu nhiều đáp án:', multi.length)
console.log(`Tổng câu: ${cur.questions.length} | giải thích đã có: ${written} | còn rỗng: ${empty} | lỗi nghiêm trọng: ${problems}`)
