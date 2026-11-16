// Tách đề thô (văn bản dán vào hoặc text đọc từ PDF/TXT) thành danh sách câu hỏi trắc nghiệm.
// Hàm thuần, không đụng tới trình duyệt. Xử lý được:
//  - rác mỗi trang (dòng ngày giờ, link, số trang, phần tiêu đề Quizlet)
//  - 2 kiểu ghi đáp án: (a) dòng lặp lại nguyên văn đáp án đúng, "C. V. I. Lênin" (nhiều đáp án = nhiều dòng liên tiếp)
//                       (b) chỉ ghi chữ cái, "C" hoặc "A B C"
//  - câu hỏi/đáp án bị ngắt thành nhiều dòng; câu có 2 đến 6 đáp án (A-F)
//  - nhiều đáp án trên cùng 1 dòng "A. 2007 B. 2006 C. 2005"; chữ cái Cyrillic trông giống Latin
//  - thẻ lỗi (đảo mặt, thiếu đáp án, bị cắt "...") => KHÔNG bỏ qua âm thầm: đánh dấu uncertain hoặc đưa vào rejected

const LABELS = 'ABCDEF'

// Chữ Cyrillic có hình dạng giống chữ Latin (hay lẫn vào bản scan). Tiếng Việt không dùng Cyrillic nên đổi toàn bộ là an toàn.
const CYRILLIC_TO_LATIN = {
  А: 'A', В: 'B', С: 'C', Е: 'E', Н: 'H', К: 'K', М: 'M', О: 'O', Р: 'P', Т: 'T', Х: 'X', І: 'I', Ѕ: 'S',
  а: 'a', е: 'e', о: 'o', р: 'p', с: 'c', х: 'x', у: 'y', і: 'i', ѕ: 's',
}

export function normalizeRawText(text) {
  return text
    .normalize('NFC')
    .replace(/[Ѐ-ӿ]/g, (ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .replace(/[   ​﻿]/g, ' ')
    .replace(/\t/g, ' ')
}

// Dòng rác: bỏ hẳn. Một số PDF tách từng chữ ("T h ẻ g h i n h ớ") nên các mẫu được kiểm tra trên
// dòng đã bỏ hết khoảng trắng (vì vậy các mẫu viết không có dấu cách).
const NOISE = [
  /thẻghinhớ:.*quizlet/i,
  /quizlet\.com/i,
  /fb\.com\//i,
  /^https?:/i,
  /^\d{1,2}\/\d{1,2}\/\d{2,4},?\d{1,2}:\d{2}([AP]M)?/i, // "11/1/26, 2:07 PM ..."
  /^\d{1,4}\/\d{1,4}$/, // số trang "12/159"
  /thuậtngữtronghọcphần/i,
  /^(ghépthẻ|khốihộp|thêmvàolịch|chođiểmđánhgiá|nắmvữngnộidung)/i,
  /ngườihọctrong\d+ngàyqua/i,
  /đánhgiáđầutiên|chơivuinhộn|đáquýmới/i,
  /[0-9a-f]{4,}-[0-9a-f]{4}-[0-9a-f]{4}-/i, // đoạn mã trong đường link bị ngắt dòng
]
const isNoise = (line) => {
  const squeezed = line.replace(/\s+/g, '')
  return NOISE.some((re) => re.test(squeezed))
}

// So khớp mờ: bỏ hết ký tự không phải chữ/số nên không bị lệch vì xuống dòng, dấu cách, dấu câu
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
const clean = (s) => s.replace(/\s+/g, ' ').trim()

// Độ giống nhau của 2 chuỗi theo cặp ký tự (hệ số Dice, 0..1). Dùng vì bản scan hay lệch 1-2 chữ
// giữa phần đáp án và phần lặp lại đáp án đúng (vd "đây đủ" / "đầy đủ").
function dice(a, b) {
  if (a === b) return 1
  if (a.length < 2 || b.length < 2) return 0
  const grams = new Map()
  for (let i = 0; i < a.length - 1; i++) grams.set(a.slice(i, i + 2), (grams.get(a.slice(i, i + 2)) || 0) + 1)
  let hit = 0
  for (let i = 0; i < b.length - 1; i++) {
    const g = b.slice(i, i + 2)
    const n = grams.get(g)
    if (n > 0) {
      hit++
      grams.set(g, n - 1)
    }
  }
  return (2 * hit) / (a.length + b.length - 2)
}

// t (đã norm) có khớp phần đầu của full (đã norm), hoặc ngược lại, không? Chuỗi ngắn (<4 ký tự) phải khớp tuyệt đối.
function prefixMatch(t, full) {
  if (!t || !full) return false
  const n = Math.min(t.length, full.length)
  if (n < 4) return full.startsWith(t) || t.startsWith(full)
  return dice(t.slice(0, n), full.slice(0, n)) >= 0.8
}

// Nhãn đáp án A-F (chấp nhận cả chữ thường a-f, vì có đề ghi "a. ... b. ..."), luôn đổi về chữ hoa
const labelMatch = (line) => {
  const m = line.match(/^([A-Fa-f])[.)]\s*(.*)$/)
  return m ? { letter: m[1].toUpperCase(), rest: m[2] } : null
}
const isLettersOnly = (line) => /^[A-F](?:\s*[,;&]?\s*[A-F])*$/.test(line) && /^[A-F\s,;&]+$/.test(line)
const lettersOf = (line) => [...line].filter((c) => LABELS.includes(c))

// "A. 2007 B. 2006 C. 2005" trên 1 dòng => [{letter,text}...]. Chỉ nhận nhãn ĐÚNG THỨ TỰ nên
// "A. C. Mác" không bị tách nhầm thành 2 đáp án.
function splitInline(line, expectedLetter) {
  if (!line.toUpperCase().startsWith(expectedLetter)) return null
  const re = /(?:^|\s)([A-Fa-f])[.)]\s*/g
  const marks = []
  let next = LABELS.indexOf(expectedLetter)
  let m
  while ((m = re.exec(line))) {
    if (m[1].toUpperCase() === LABELS[next]) {
      marks.push({ letter: m[1].toUpperCase(), start: m.index, textStart: m.index + m[0].length })
      next++
    }
  }
  if (marks.length < 2 || marks[0].start !== 0) return null
  return marks.map((mk, i) => ({
    letter: mk.letter,
    text: line.slice(mk.textStart, i + 1 < marks.length ? marks[i + 1].start : undefined).trim(),
  }))
}

const newCard = () => ({
  q: [], // các dòng câu hỏi
  opts: [], // [{letter, lines[]}]
  answers: [], // [{letter?, lines[]}]  kiểu (a)
  letters: [], // kiểu (b)
  strays: [], // dòng đáp án nằm lệch vị trí (thẻ đảo mặt)
  missingLabels: [], // các nhãn bị mất (vd đáp án B mất chữ "B.")
  state: 'Q',
  blankAfterQ: false,
})

export function parseRawExam(rawText, { idPrefix = 'q' } = {}) {
  const lines = normalizeRawText(rawText).split(/\r?\n/)
  const questions = []
  const rejected = []
  let card = newCard()

  const optText = (o) => clean(o.lines.join(' '))
  const rawOf = (c) => [...c.strays, ...c.q, ...c.opts.map((o) => `${o.letter}. ${optText(o)}`), ...c.answers.map((a) => a.lines.join(' '))].join('\n')

  // Khớp 1 dòng với đáp án nào trong thẻ (so theo nội dung, không theo chữ cái)
  const findOptByText = (text) => {
    const t = norm(text)
    if (!t) return -1
    return card.opts.findIndex((o) => prefixMatch(t, norm(optText(o))))
  }

  function finalize() {
    const c = card
    card = newCard()
    if (c.q.length === 0 && c.opts.length === 0 && c.strays.length === 0) return
    if (c.opts.length < 2) {
      rejected.push({ raw: rawOf(c), reason: 'Không tách được các đáp án A, B, C...' })
      return
    }
    const issues = []
    const options = c.opts.map((o) => ({ text: optText(o), correct: false, explain: '' }))

    // --- xác định đáp án đúng ---
    const mark = (i) => {
      if (i >= 0 && i < options.length) options[i].correct = true
    }
    for (const l of c.letters) mark(LABELS.indexOf(l))
    for (const a of c.answers) {
      const text = clean(a.lines.join(' '))
      let idx = a.letter ? LABELS.indexOf(a.letter) : -1
      if (idx < 0 || idx >= options.length) idx = findOptByText(text)
      mark(idx)
    }
    // thẻ đảo mặt: dòng đáp án nằm trước câu hỏi
    if (c.strays.length) {
      issues.push('Dòng đáp án đúng nằm sai vị trí (thẻ có vẻ bị đảo mặt), hãy kiểm tra lại')
      for (const s of c.strays) {
        const lm = labelMatch(s)
        if (lm) mark(LABELS.indexOf(lm.letter))
        else if (isLettersOnly(s)) lettersOf(s).forEach((l) => mark(LABELS.indexOf(l)))
      }
    }

    const correctN = options.filter((o) => o.correct).length
    if (correctN === 0) issues.push('Không tìm thấy đáp án đúng, hãy tick đáp án đúng')
    if (c.q.length === 0) issues.push('Thiếu nội dung câu hỏi')
    if (c.missingLabels.length) {
      issues.push(`Đáp án ${c.missingLabels.join(', ')} bị mất nhãn, nội dung có thể đã dính sang đáp án khác, hãy nhập lại`)
    } else if (options.some((o) => !o.text)) issues.push('Có đáp án bị trống')
    if (options.some((o) => /(\.\.\.|…)\s*$/.test(o.text))) issues.push('Có đáp án bị cắt cụt bằng "..."')
    const question = clean(c.q.join(' '))
    const want = question.match(/chọn\s+(\d+)\s+(?:phương án|đáp án|ý)/i)
    if (want && correctN > 0 && Number(want[1]) !== correctN) {
      issues.push(`Đề ghi chọn ${want[1]} đáp án nhưng tìm thấy ${correctN} đáp án đúng`)
    }
    if (options.length > 5 && c.opts.some((o) => optText(o).length > 400)) issues.push('Có đáp án rất dài, có thể bị dính sang câu khác')

    questions.push({ question, options, uncertain: issues.length > 0, issues })
  }

  const startQuestionState = (line) => {
    // Dòng đáp án đúng lọt vào giữa phần câu hỏi (thẻ đảo mặt / lệch cột). Nhãn B-F không thể là đáp án đầu tiên
    // nên chắc chắn không phải phần đáp án; nhãn A thì không phân biệt được nên để cho nhánh đáp án xử lý.
    const lm = labelMatch(line)
    if ((lm && lm.letter !== 'A') || isLettersOnly(line)) {
      card.strays.push(line)
      return true
    }
    return false
  }

  function addOption(letter, text) {
    card.opts.push({ letter, lines: text ? [text] : [] })
  }

  function process(line) {
    // ---------- đang đọc câu hỏi ----------
    if (card.state === 'Q') {
      if (card.blankAfterQ) {
        // Có dòng trống ngay sau câu hỏi: nếu dòng kế tiếp không phải đáp án A thì khối trước là khối mồ côi
        card.blankAfterQ = false
        const lm = labelMatch(line)
        if (!(lm && lm.letter === 'A') && card.q.length > 0) {
          rejected.push({ raw: rawOf(card), reason: 'Khối văn bản không có đáp án (có thể là tiêu đề hoặc rác)' })
          card = newCard()
        }
      }
      const lm = labelMatch(line)
      if (lm && lm.letter === 'A') {
        card.state = 'O'
        const inline = splitInline(line, 'A')
        if (inline) inline.forEach((s) => addOption(s.letter, s.text))
        else addOption('A', lm.rest)
        return
      }
      if (startQuestionState(line)) return
      card.q.push(line)
      return
    }

    // ---------- đang đọc các đáp án ----------
    if (card.state === 'O') {
      const expected = LABELS[card.opts.length]
      const lm = labelMatch(line)
      // Có dòng trống sau 1 đáp án duy nhất: nếu dòng kế không phải đáp án tiếp theo thì thẻ này lỗi, chốt lại rồi đọc thẻ mới
      if (card.blankInO) {
        card.blankInO = false
        if (!(lm && lm.letter === expected)) {
          finalize()
          process(line)
          return
        }
      }
      if (expected && lm && lm.letter === expected) {
        const inline = splitInline(line, expected)
        if (inline) inline.forEach((s) => addOption(s.letter, s.text))
        else addOption(expected, lm.rest)
        return
      }
      // nhãn bị mất: đang chờ B mà gặp C (đáp án B mất chữ "B.") => thêm 1 đáp án trống cho B và để người dùng sửa
      if (expected && lm && LABELS.indexOf(lm.letter) === LABELS.indexOf(expected) + 1 && lm.rest.length >= 3) {
        card.missingLabels.push(expected)
        addOption(expected, '')
        addOption(lm.letter, lm.rest)
        return
      }
      // chỉ ghi chữ cái: "C" hoặc "A B C"
      if (isLettersOnly(line) && card.opts.length >= 2) {
        card.state = 'A'
        card.letters.push(...lettersOf(line))
        return
      }
      // dòng lặp lại nguyên văn đáp án đúng: "C. V. I. Lênin" (nhãn phải thuộc đáp án đã có VÀ nội dung phải khớp)
      if (lm && card.opts.length >= 2) {
        const i = LABELS.indexOf(lm.letter)
        if (i < card.opts.length && matchesOption(card.opts[i], lm.rest)) {
          card.state = 'A'
          card.answers.push({ letter: lm.letter, lines: [lm.rest] })
          return
        }
      }
      // dòng lặp lại đáp án nhưng không có nhãn
      if (card.opts.length >= 2 && findOptByText(line) >= 0 && norm(line).length >= 6 && lastOptLooksComplete(line)) {
        card.state = 'A'
        card.answers.push({ lines: [line] })
        return
      }
      // còn lại: dòng nối tiếp của đáp án cuối
      card.opts[card.opts.length - 1].lines.push(line)
      return
    }

    // ---------- đang đọc dòng đáp án đúng ----------
    if (card.state === 'A') {
      if (isLettersOnly(line)) {
        card.letters.push(...lettersOf(line))
        return
      }
      const lm = labelMatch(line)
      if (lm) {
        const i = LABELS.indexOf(lm.letter)
        if (i < card.opts.length && matchesOption(card.opts[i], lm.rest)) {
          card.answers.push({ letter: lm.letter, lines: [lm.rest] })
          return
        }
      }
      // dòng nối tiếp của đáp án đang dở (đáp án dài bị ngắt dòng)
      const last = card.answers[card.answers.length - 1]
      if (last && continuesAnswer(last, line)) {
        last.lines.push(line)
        return
      }
      // không phải đáp án nữa => thẻ này kết thúc, dòng này là đầu thẻ mới
      finalize()
      process(line)
    }
  }

  // đáp án lặp lại (rest) có khớp phần đầu của đáp án gốc không
  function matchesOption(opt, rest) {
    const t = norm(rest)
    if (!t) return true // chỉ có nhãn "C." thì tin nhãn
    return prefixMatch(t, norm(optText(opt)))
  }

  // đáp án lặp lại chưa đủ dài so với đáp án gốc và dòng mới nối đúng phần còn thiếu
  function continuesAnswer(ans, line) {
    const acc = norm(ans.lines.join(' '))
    const add = norm(line)
    const target = ans.letter
      ? norm(optText(card.opts[LABELS.indexOf(ans.letter)] || { lines: [] }))
      : (card.opts.map((o) => norm(optText(o))).find((ot) => prefixMatch(acc, ot)) ?? '')
    const missing = target.length - acc.length
    // còn thiếu ít nhất vài ký tự, dòng mới không dài hơn phần thiếu quá nhiều, và nối vào vẫn khớp đầu đáp án gốc
    return missing >= 1 && add.length <= missing + 4 && prefixMatch(acc + add, target)
  }

  // Khi chưa có nhãn, chỉ coi là dòng đáp án lặp lại nếu nó khớp TRỌN một đáp án đã có (tránh nhầm với dòng nối tiếp)
  function lastOptLooksComplete(line) {
    const t = norm(line)
    return card.opts.some((o) => norm(optText(o)) === t)
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (isNoise(line)) continue
    if (line === '') {
      // dòng trống: coi như hết thẻ nếu đã có đủ đáp án; nếu đang ở câu hỏi thì nhớ lại để xét dòng kế tiếp
      if ((card.state === 'O' || card.state === 'A') && card.opts.length >= 2) finalize()
      else if (card.state === 'O') card.blankInO = true
      else if (card.state === 'Q' && card.q.length > 0) card.blankAfterQ = true
      continue
    }
    process(line)
  }
  finalize()

  // gắn id theo thứ tự
  const pad = String(questions.length).length < 3 ? 3 : String(questions.length).length
  const withIds = questions.map((q, i) => ({ id: `${idPrefix}-${String(i + 1).padStart(pad, '0')}`, ...q }))
  return { questions: withIds, rejected }
}

// Gộp các câu trùng (cùng câu hỏi và cùng bộ đáp án). Giữ câu xuất hiện đầu tiên.
export function mergeDuplicates(questions) {
  const seen = new Map()
  const kept = []
  for (const q of questions) {
    const key = norm(q.question) + '|' + q.options.map((o) => norm(o.text)).sort().join('|')
    if (seen.has(key)) {
      // nếu bản trước chưa có đáp án đúng mà bản này có thì lấy đáp án của bản này
      const first = seen.get(key)
      if (!first.options.some((o) => o.correct) && q.options.some((o) => o.correct)) {
        first.options.forEach((o) => {
          o.correct = q.options.some((p) => norm(p.text) === norm(o.text) && p.correct)
        })
      }
      continue
    }
    seen.set(key, q)
    kept.push(q)
  }
  return { questions: kept, removed: questions.length - kept.length }
}

// Tạo mã môn từ tên: "MLN122 - Kinh tế" => "mln122-kinh-te"
export function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
