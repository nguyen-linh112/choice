// Gộp các phần đã đọc từ video (c1-part*.json, c2-part*.json), đối chiếu với bộ MLN122 cũ và báo cáo.
//   node scripts/video/merge-video.mjs
import fs from 'node:fs'
import path from 'node:path'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const readParts = (prefix) =>
  fs.readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith('.json')).sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => a.n - b.n)

const exams = { c1: readParts('c1-part'), c2: readParts('c2-part') }
for (const [k, list] of Object.entries(exams)) {
  const ns = list.map((q) => q.n)
  const dup = ns.filter((n, i) => ns.indexOf(n) !== i)
  const missing = Array.from({ length: 60 }, (_, i) => i + 1).filter((n) => !ns.includes(n))
  console.log(`${k}: ${list.length} câu | thiếu: ${missing.join(',') || 'không'} | trùng số: ${dup.join(',') || 'không'}`)
  for (const q of list) {
    const letters = q.pick.split('')
    if (q.options.length < 2 || letters.some((l) => 'ABCDEF'.indexOf(l) < 0 || 'ABCDEF'.indexOf(l) >= q.options.length)) console.log('  LỖI cấu trúc', k, q.n)
    if (q.options.some((o) => !o.trim())) console.log('  Đáp án trống', k, q.n)
  }
}

// ---- đối chiếu với bộ cũ ----
const old = JSON.parse(fs.readFileSync(path.join(dir, '../../public/data/mln122.json'), 'utf8')).questions
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
const tri = (s) => { const t = norm(s); const set = new Set(); for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3)); return set }
const sim = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1) }
const oldTri = old.map((q) => tri(q.question))
const oldOptNorm = old.map((q) => q.options.map((o) => norm(o.text)))

const report = []
for (const [k, list] of Object.entries(exams)) {
  for (const q of list) {
    const t = tri(q.question)
    let best = -1, bs = 0
    oldTri.forEach((o, i) => { const s = sim(t, o); if (s > bs) { bs = s; best = i } })
    if (bs < 0.6) { report.push({ k, n: q.n, status: 'moi', pick: q.pick }); continue }
    const o = old[best]
    // so khớp từng đáp án theo nội dung
    const mapIdx = q.options.map((txt) => {
      const nt = norm(txt)
      return oldOptNorm[best].findIndex((ot) => ot === nt || (nt.length > 6 && (ot.startsWith(nt.slice(0, 12)) || nt.startsWith(ot.slice(0, 12)))))
    })
    const newCorrect = q.pick.split('').map((l) => 'ABCDEF'.indexOf(l))
    const oldCorrect = o.options.map((x, i) => (x.correct ? i : -1)).filter((i) => i >= 0)
    const mapped = newCorrect.map((i) => mapIdx[i])
    const unmatched = mapIdx.filter((i) => i < 0).length
    const same = mapped.length === oldCorrect.length && mapped.every((i) => oldCorrect.includes(i))
    report.push({ k, n: q.n, status: same ? 'khop' : unmatched ? 'khong-chac' : 'LECH', sim: bs.toFixed(2), old: o.id, oldCorrect: oldCorrect.map((i) => o.options[i].text.slice(0, 40)), newCorrect: newCorrect.map((i) => q.options[i].slice(0, 40)) })
  }
}
const count = (s) => report.filter((r) => r.status === s).length
console.log(`\nĐối chiếu với bộ cũ: khớp ${count('khop')}, LỆCH ${count('LECH')}, không chắc (đáp án khác chữ) ${count('khong-chac')}, câu mới ${count('moi')}`)
report.filter((r) => r.status === 'LECH' || r.status === 'khong-chac').forEach((r) => console.log(r.status, r.k, 'Q' + r.n, '~', r.old, '| video:', r.newCorrect.join(' ; '), '| cũ:', r.oldCorrect.join(' ; ')))
fs.writeFileSync(path.join(dir, 'compare-report.json'), JSON.stringify(report, null, 1))
