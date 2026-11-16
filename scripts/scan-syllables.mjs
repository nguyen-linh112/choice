// Quét lỗi chính tả còn sót: lấy từ vựng (âm tiết) từ phần giải thích đã được rà soát,
// rồi liệt kê các âm tiết trong câu hỏi/đáp án KHÔNG có trong từ vựng đó.
import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync(new URL('../public/data/mln122.json', import.meta.url), 'utf8'))
const split = (s) => s.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)
const vocab = new Map()
for (const q of d.questions) for (const o of q.options) for (const w of split(o.explain || '')) vocab.set(w, (vocab.get(w) || 0) + 1)
const seen = new Map()
for (const q of d.questions) {
  const parts = [q.question, ...q.options.map((o) => o.text)]
  for (const p of parts) for (const w of split(p)) {
    if (!vocab.has(w) && w.length > 1) {
      if (!seen.has(w)) seen.set(w, new Set())
      seen.get(w).add(q.id.slice(-3))
    }
  }
}
for (const [w, ids] of [...seen].sort()) console.log(w.padEnd(12), [...ids].slice(0, 6).join(','))
console.log('Tổng âm tiết lạ:', seen.size)
