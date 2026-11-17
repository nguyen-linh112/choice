// Biến văn bản OCR (đọc từ ảnh chụp câu hỏi trắc nghiệm) thành danh sách câu hỏi để XEM TRƯỚC.
// Không đoán bừa: câu nào thiếu đáp án đúng / thiếu đáp án đều được đánh dấu uncertain kèm lý do.
//
// Hình dạng 1 ảnh thường gặp (vd ảnh chụp từ FUOverflow):
//   MULTIPLE CHOICE
//   <câu hỏi, có thể nhiều dòng>
//   A. ...  B. ...  C. ...  D. ...
//   <phần bình luận bên cạnh, có thể có dòng chỉ ghi đáp án như "c" hoặc "AB">

const LABELS = 'ABCDEF'

// Dòng "rác" của giao diện web cần bỏ khỏi câu hỏi
const NOISE = [
  /multiple\s*choice/i,
  /fuo\s*verflow/i,
  /^fuo$/i,
  /^(báo cáo|like|bình luận|thông tin|đánh giá|theo dõi|hiện bình luận trước\.*)$/i,
  /^viết bình luận/i,
]

// Nhãn đáp án hay bị OCR đọc sai (vd "B." thành "8.", "C." thành "G." hoặc "©", "D." thành "0.")
const VARIANTS = { A: 'AÁÀÂÄ4', B: 'B8ßĐÐ', C: 'CGĆ©€(', D: 'D0OÐQ', E: 'E', F: 'F' }
const reCache = {}
// Dòng bắt đầu bằng nhãn `label` (cho phép đọc sai ký tự, dấu chấm tùy chọn) -> phần chữ sau nhãn, hoặc null
function matchLabel(line, label, { needPunct = false } = {}) {
  const key = `${label}${needPunct}`
  if (!reCache[key]) {
    const punct = needPunct ? String.raw`[.):\]]` : String.raw`[.):,;\]]?`
    reCache[key] = new RegExp(String.raw`^\(?[${VARIANTS[label]}]` + punct + String.raw`\s+(\S.*)$`)
  }
  const m = line.match(reCache[key])
  return m ? m[1] : null
}
// Dòng chỉ ghi đáp án: "c", "AB", "A, C", "Đáp án: B"
const VOTE_RE = /^(?:đáp án|dap an|answer|ans)?\s*[:\-]?\s*([A-Fa-f](?:\s*[,&]?\s*[A-Fa-f]){0,3})\s*[.]?$/i
// "Câu 12.", "Question 3:", "12)" ở đầu câu hỏi
const NUMBERING_RE = /^(?:câu|question|q)?\s*\d{1,3}\s*[.):\-]\s*/i

const clean = (s) => s.replace(/\s+/g, ' ').trim()

function isNoise(line) {
  return NOISE.some((re) => re.test(line))
}

// Đọc văn bản OCR của MỘT ảnh -> { questions, rejected }
export function parseOcrText(text, name = '') {
  const lines = String(text || '').replace(/\r/g, '').split('\n').map((l) => l.trim())
  const questions = []
  const rejected = []

  let pending = [] // dòng của câu hỏi đang gom (chưa gặp đáp án A)
  let cur = null // câu đang gom đáp án: { q, opts: [text], closed }
  const votes = []
  let sawBlankAfterOptions = false

  const finish = () => {
    if (!cur) return
    questions.push(cur)
    cur = null
    pending = []
    sawBlankAfterOptions = false
  }

  const hasNextB = (from) => {
    for (let k = from + 1; k < Math.min(lines.length, from + 9); k++) if (lines[k] && matchLabel(lines[k], 'B') !== null) return true
    return false
  }

  for (let li = 0; li < lines.length; li++) {
    const raw = lines[li]
    if (!raw) {
      if (cur) sawBlankAfterOptions = true
      continue
    }
    if (isNoise(raw)) continue

    if (!cur) {
      // bắt đầu câu mới: cần nhãn A và phía sau thấy nhãn B (tránh nhầm với chữ "A. Smith" trong câu hỏi)
      const a = matchLabel(raw, 'A')
      if (a !== null && hasNextB(li)) {
        cur = { q: pending, opts: [a] }
        pending = []
        sawBlankAfterOptions = false
        continue
      }
    } else {
      const expected = LABELS[cur.opts.length]
      const next = expected ? matchLabel(raw, expected) : null
      if (next !== null) {
        cur.opts.push(next)
        sawBlankAfterOptions = false
        continue
      }
      const again = cur.opts.length >= 2 ? matchLabel(raw, 'A', { needPunct: true }) : null
      if (again !== null && hasNextB(li)) {
        finish()
        cur = { q: [], opts: [again] }
        continue
      }
    }

    // Dòng chỉ chứa đáp án trong phần bình luận
    const v = raw.match(VOTE_RE)
    if (v && raw.length <= 14 && (cur ? cur.opts.length >= 2 : questions.length > 0)) {
      const set = [...new Set(v[1].toUpperCase().replace(/[^A-F]/g, '').split(''))].sort().join('')
      if (set) {
        votes.push(set)
        continue
      }
    }

    if (cur) {
      if (!sawBlankAfterOptions) {
        // nối tiếp đáp án cuối (đáp án dài bị OCR xuống dòng)
        cur.opts[cur.opts.length - 1] = clean(`${cur.opts[cur.opts.length - 1]} ${raw}`)
      } else {
        // sau khoảng trống: nếu đã đủ 2 đáp án thì đây là bình luận hoặc câu kế tiếp
        finish()
        pending = [raw]
      }
    } else {
      pending.push(raw)
    }
  }
  finish()

  if (questions.length === 0) {
    rejected.push({ reason: `Không tách được câu hỏi từ ảnh${name ? ` "${name}"` : ''} (không thấy các đáp án A., B., ...)`, raw: String(text || '').trim() })
    return { questions, rejected }
  }

  // Phiếu bầu đáp án chỉ áp dụng khi ảnh có đúng 1 câu
  const tally = new Map()
  for (const v of votes) tally.set(v, (tally.get(v) || 0) + 1)
  const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1])
  const best = ranked.length && (ranked.length === 1 || ranked[0][1] > ranked[1][1]) ? ranked[0] : null

  const out = questions.map((c) => {
    const issues = []
    let question = clean(c.q.join(' ')).replace(NUMBERING_RE, '')
    if (!question) issues.push('Thiếu nội dung câu hỏi, hãy nhập lại')
    const options = c.opts.map((t) => ({ text: clean(t), correct: false, explain: '' }))
    if (options.length < 2) issues.push('Chỉ tách được dưới 2 đáp án')
    if (options.some((o) => !o.text)) issues.push('Có đáp án bị trống')

    let uncertain = true
    if (questions.length === 1 && best) {
      const picked = best[0].split('').map((l) => LABELS.indexOf(l))
      if (picked.every((i) => i < options.length)) {
        picked.forEach((i) => { options[i].correct = true })
        const unanimous = ranked.length === 1 && best[1] >= 2
        issues.push(`Đáp án đúng được suy ra từ ${votes.length} bình luận trong ảnh (${best[0].split('').join(', ')}), hãy kiểm tra lại`)
        uncertain = !unanimous
        if (unanimous) issues.length = 0
      }
    }
    if (!options.some((o) => o.correct)) issues.push('Ảnh không cho biết đáp án đúng, hãy tick đáp án đúng')
    const want = question.match(/chọn\s+(\d+|hai|ba|bốn)\s+(?:đáp án|phương án|ý)/i)
    if (want && options.filter((o) => o.correct).length === 0) issues.push(`Đề ghi "${want[0]}", hãy tick đủ đáp án`)

    const q = { question, options, uncertain: uncertain || issues.length > 0, issues }
    if (name) q.source = name
    return q
  })
  return { questions: out, rejected }
}

// Gộp kết quả của nhiều ảnh theo thứ tự ảnh
export function parseOcrImages(items) {
  const questions = []
  const rejected = []
  for (const it of items) {
    const r = parseOcrText(it.text, it.name)
    questions.push(...r.questions)
    rejected.push(...r.rejected)
  }
  return { questions, rejected }
}
