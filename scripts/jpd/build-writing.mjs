// Thêm mục "Viết" vào môn nhóm JPD326: node scripts/jpd/build-writing.mjs
import fs from 'node:fs'
import path from 'node:path'
import { validateGroup } from '../../src/utils/validateSubject.js'
import { WRITING_SU25, WRITING_W1, WRITING_W3 } from './writing-data.mjs'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const target = path.join(dir, '../../public/data/jpd326.json')
const group = JSON.parse(fs.readFileSync(target, 'utf8'))

if (!group.sections.some((s) => s.key === 'writing')) group.sections.push({ key: 'writing', label: 'Viết', type: 'writing' })

const put = (id, name, items) => {
  let set = group.sets.find((s) => s.id === id)
  if (!set) { set = { id, name, sections: {} }; group.sets.push(set) }
  set.sections.writing = { items }
}
put('su25-fe', 'Đề SU25 - FE', WRITING_SU25)
put('viet-a', 'Đề Viết A (file paper (w), chưa rõ thuộc đề nào)', WRITING_W1)
put('viet-b', 'Đề Viết B (file paper(w3), chưa rõ thuộc đề nào)', WRITING_W3)

const problems = validateGroup(group)
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
fs.writeFileSync(target, JSON.stringify(group, null, 2) + '\n')
console.log('OK', group.sets.map((s) => `${s.id}:${s.sections.writing?.items.length ?? 0}`).join(' '))
