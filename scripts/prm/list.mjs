import { pathToFileURL } from 'node:url'
import path from 'node:path'
const f = process.argv[2]
const m = await import(pathToFileURL(path.resolve(f)).href)
m.CHOICE.forEach((q, i) => {
  const multi = Array.isArray(q[3][0]) ? '' : ''
  const isArr = typeof q[3] === 'string'
  const text = q[1]; const opts = q[2]; const pick = q[3]
  console.log(`${i + 1}. ${text.replace(/\n/g, ' ⏎ ').slice(0, 130)}`)
  opts.forEach((o, k) => console.log(`   ${'ABCDE'[k]}${(Array.isArray(pick) ? pick.includes(k) : 'ABCDE'.indexOf(pick) === k) ? '*' : ' '} ${o.replace(/\n/g, ' ⏎ ').slice(0, 95)}`))
})
