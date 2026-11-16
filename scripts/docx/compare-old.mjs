// Đối chiếu đáp án bộ RE với mln122.json và mln122-exam.json (theo nội dung câu hỏi / đáp án).
//   node scripts/docx/compare-old.mjs [mln122-re.json]
import fs from 'node:fs'
import path from 'node:path'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const load = (f) => JSON.parse(fs.readFileSync(path.join(dir, '../../public/data', f), 'utf8')).questions
const SUBJ = process.argv[2] || 'mln122-re.json'
const re = load(SUBJ)
const olds = ['mln122.json', 'mln122-exam.json', 'mln122-re.json', 'mln122-sp26.json'].filter((f) => f !== SUBJ && fs.existsSync(path.join(dir, '../../public/data', f))).flatMap(load)
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
const tri = (s) => { const t = norm(s); const set = new Set(); for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3)); return set }
const sim = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1) }
const oldTri = olds.map((q) => tri(q.question))
const oldOpt = olds.map((q) => q.options.map((o) => norm(o.text)))

const rows = []
for (const q of re) {
  const t = tri(q.question)
  const cands = oldTri.map((o, i) => [sim(t, o), i]).filter(([s]) => s >= 0.6).sort((a, b) => b[0] - a[0])
  if (!cands.length) { rows.push({ id: q.id, status: 'moi' }); continue }
  for (const [s, i] of cands.slice(0, 3)) {
    const o = olds[i]
    const mapIdx = q.options.map((op) => { const nt = norm(op.text); return oldOpt[i].findIndex((ot) => ot === nt || (nt.length > 6 && (ot.startsWith(nt.slice(0, 12)) || nt.startsWith(ot.slice(0, 12))))) })
    const newC = q.options.map((x, k) => (x.correct ? k : -1)).filter((k) => k >= 0)
    const oldC = o.options.map((x, k) => (x.correct ? k : -1)).filter((k) => k >= 0)
    const mapped = newC.map((k) => mapIdx[k])
    const unmatched = mapIdx.filter((k) => k < 0).length
    const same = mapped.length === oldC.length && mapped.every((k) => oldC.includes(k))
    rows.push({ id: q.id, old: o.id, sim: s.toFixed(2), status: same ? 'khop' : unmatched ? 'khong-chac' : 'LECH', re: newC.map((k) => q.options[k].text.slice(0, 50)), cu: oldC.map((k) => o.options[k].text.slice(0, 50)) })
  }
}
const c = (s) => rows.filter((r) => r.status === s).length
console.log(`khớp ${c('khop')}, LỆCH ${c('LECH')}, không chắc ${c('khong-chac')}, câu mới ${c('moi')}`)
rows.filter((r) => r.status === 'LECH' || r.status === 'khong-chac').forEach((r) => console.log(r.status, r.id, '~', r.old, `(${r.sim})`, '| RE:', r.re.join(' ; '), '| cũ:', r.cu.join(' ; ')))
