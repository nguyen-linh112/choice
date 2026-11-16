// Đọc PDF thành văn bản cho bộ tách đề thô.
// File Quizlet in ra có 2 CỘT: trái = câu hỏi + các đáp án, phải = đáp án đúng. Nếu đọc theo thứ tự thường
// thì 2 cột trộn vào nhau, nên ta phải tách cột rồi ghép lại theo từng thẻ: (cột trái) rồi (cột phải).
//
// pageToText là hàm thuần (nhận danh sách item của pdf.js), extractPdfText là phần gọi pdf.js trong trình duyệt.

const median = (arr) => {
  const a = [...arr].sort((x, y) => x - y)
  return a.length ? a[Math.floor(a.length / 2)] : 0
}

// Gom các item cùng một hàng (cùng y) thành dòng
function toLines(rows) {
  const sorted = [...rows].sort((a, b) => b.y - a.y || a.x - b.x)
  const lines = []
  for (const r of sorted) {
    const last = lines[lines.length - 1]
    if (last && Math.abs(last.y - r.y) <= 2.5) last.items.push(r)
    else lines.push({ y: r.y, items: [r] })
  }
  return lines.map((l) => ({
    y: l.y,
    text: l.items.sort((a, b) => a.x - b.x).map((i) => i.str.trim()).filter(Boolean).join(' ').replace(/\s+/g, ' '),
  }))
}

// Tìm hoành độ bắt đầu cột phải (nếu trang có 2 cột); null nếu chỉ có 1 cột
function detectRightColumn(rows, pageWidth) {
  const candidates = rows.filter((r) => r.x > pageWidth * 0.38 && r.x < pageWidth * 0.75)
  if (candidates.length < 3) return null
  const counts = new Map()
  for (const r of candidates) {
    const k = Math.round(r.x / 4) * 4
    counts.set(k, (counts.get(k) || 0) + 1)
  }
  const [mode, n] = [...counts].sort((a, b) => b[1] - a[1])[0]
  // cột phải phải có nhiều dòng bắt đầu đúng 1 vị trí x, và có cả cột trái ở bên trái
  const leftExists = rows.some((r) => r.x < pageWidth * 0.3)
  return n >= 3 && leftExists ? mode - 8 : null
}

// Chia các dòng thành khối (thẻ) khi khoảng cách giữa 2 dòng lớn hơn bình thường
function toBlocks(lines) {
  if (lines.length === 0) return []
  const gaps = lines.slice(1).map((l, i) => lines[i].y - l.y).filter((g) => g > 0)
  const limit = Math.max(1.6 * median(gaps), 24)
  const blocks = [{ top: lines[0].y, lines: [lines[0]] }]
  for (let i = 1; i < lines.length; i++) {
    if (lines[i - 1].y - lines[i].y > limit) blocks.push({ top: lines[i].y, lines: [lines[i]] })
    else blocks[blocks.length - 1].lines.push(lines[i])
  }
  return blocks
}

export function pageToText(items, pageWidth = 612) {
  const rows = items
    .filter((it) => it.str && it.str.trim())
    .map((it) => ({ x: it.transform[4], y: it.transform[5], str: it.str }))
  if (rows.length === 0) return ''

  const split = detectRightColumn(rows, pageWidth)
  if (split === null) {
    return toBlocks(toLines(rows)).map((b) => b.lines.map((l) => l.text).join('\n')).join('\n\n')
  }

  const left = toLines(rows.filter((r) => r.x < split))
  const right = toLines(rows.filter((r) => r.x >= split))
  const blocks = toBlocks(left).map((b) => ({ ...b, right: [] }))
  if (blocks.length === 0) return right.map((l) => l.text).join('\n')

  // Mỗi dòng cột phải thuộc về thẻ có đỉnh gần nhất ở phía trên nó (các thẻ cùng một hàng bắt đầu cùng độ cao)
  for (const line of right) {
    let k = -1
    for (let i = 0; i < blocks.length; i++) if (blocks[i].top >= line.y - 3) k = i
    blocks[Math.max(0, k)].right.push(line)
  }
  // Thẻ thường: cột trái là câu hỏi + đáp án, cột phải là đáp án đúng. Có thẻ Quizlet bị ĐẢO MẶT (cột trái
  // là đáp án đúng, cột phải là câu hỏi). Nhận ra bằng cách: cột trái bắt đầu bằng nhãn "A." / "C"... còn cột phải thì không.
  const looksLikeAnswer = (l) => l && /^[A-Fa-f](?:[.)]\s|$)/.test(l.text)
  return blocks
    .map((b) => {
      const flipped = b.right.length > 0 && looksLikeAnswer(b.lines[0]) && !looksLikeAnswer(b.right[0])
      const ordered = flipped ? [...b.right, ...b.lines] : [...b.lines, ...b.right]
      return ordered.map((l) => l.text).join('\n')
    })
    .join('\n\n')
}

// Đọc cả file PDF (ArrayBuffer) trong trình duyệt. pdf.js được nạp khi cần để web mở nhanh hơn.
export async function extractPdfText(arrayBuffer, onProgress) {
  const pdfjs = await import('pdfjs-dist')
  const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
  pdfjs.GlobalWorkerOptions.workerSrc = worker

  const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
  const pages = []
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n)
    const { width } = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    pages.push(pageToText(content.items, width))
    if (onProgress) onProgress(n, pdf.numPages)
  }
  // Nối các trang bằng 1 dòng xuống (không chèn dòng trống) để thẻ bị ngắt qua trang vẫn được nối liền
  return pages.join('\n')
}
