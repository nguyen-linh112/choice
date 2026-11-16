// Thống nhất kiểu đặt dấu (hoá/hóa, luỹ/lũy...) trong toàn bộ file để tìm kiếm và so khớp không bị lệch.
import fs from 'node:fs'
const file = new URL('../public/data/mln122.json', import.meta.url)
const map = [[/hóá/g, 'hóa'], [/hoá/g, 'hóa'], [/Hoá/g, 'Hóa'], [/hoà/g, 'hòa'], [/luỹ/g, 'lũy'], [/thuỳ/g, 'thủy'], [/uỷ/g, 'ủy'], [/Uỷ/g, 'Ủy']]
const fix = (s) => map.reduce((acc, [re, to]) => acc.replace(re, to), s)
const d = JSON.parse(fs.readFileSync(file, 'utf8'))
let n = 0
const f = (s) => { const t = fix(s); if (t !== s) n++; return t }
for (const q of d.questions) {
  q.question = f(q.question)
  if (q.note) q.note = f(q.note)
  for (const o of q.options) { o.text = f(o.text); o.explain = f(o.explain || '') }
}
fs.writeFileSync(file, JSON.stringify(d, null, 2) + '\n')
console.log('Đã chuẩn hóa', n, 'chuỗi')
