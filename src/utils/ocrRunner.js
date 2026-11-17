// Chạy OCR (nhận dạng chữ) NGAY TRONG TRÌNH DUYỆT bằng tesseract.js. Ảnh không bị gửi đi đâu.
// Lần quét đầu tiên tải thư viện + dữ liệu ngôn ngữ từ internet (vài MB), các lần sau trình duyệt tự nhớ.
// tesseract.js được import động để không làm nặng trang chính.

export const OCR_LANGS = [
  { value: 'vie', label: 'Tiếng Việt' },
  { value: 'eng', label: 'Tiếng Anh' },
  { value: 'vie+eng', label: 'Việt + Anh' },
]

const WHITE = 228 // điểm sáng coi là "nền trắng" của thẻ câu hỏi

// Tìm khung chữ nhật lớn màu trắng (thẻ câu hỏi) trong ảnh chụp màn hình web. Trả về null nếu cả ảnh gần như trắng.
export function findQuestionCard(data, w, h) {
  const colWhite = new Float32Array(w)
  const rowWhite = new Float32Array(h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      if (lum > WHITE) { colWhite[x]++; rowWhite[y]++ }
    }
  }
  const cols = []
  for (let x = 0; x < w; x++) if (colWhite[x] / h > 0.2) cols.push(x)
  if (cols.length < w * 0.2) return null
  const x0 = cols[0]
  const x1 = cols[cols.length - 1]
  const rows = []
  for (let y = 0; y < h; y++) {
    let n = 0
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4
      if (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2] > WHITE) n++
    }
    if (n / (x1 - x0 + 1) > 0.3) rows.push(y)
  }
  if (rows.length < h * 0.1) return null
  const box = { x0, x1: x1 + 1, y0: rows[0], y1: rows[rows.length - 1] + 1 }
  const covers = (box.x1 - box.x0) / w > 0.92 && (box.y1 - box.y0) / h > 0.92
  return covers ? null : box
}

function drawScaled(bitmap, sx, sy, sw, sh, { invert = false, targetWidth = 1900, maxScale = 4 } = {}) {
  const scale = Math.max(1, Math.min(maxScale, targetWidth / sw))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(sw * scale)
  canvas.height = Math.round(sh * scale)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = invert ? '#000' : '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.imageSmoothingQuality = 'high'
  ctx.filter = `${invert ? 'invert(1) ' : ''}grayscale(1) contrast(1.15)`
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
  return canvas
}

// Ảnh chụp màn hình web thường có thẻ câu hỏi (nền trắng, chữ nhỏ) + khung bình luận (nền tối) bên cạnh.
// Tách riêng 2 vùng để đọc: thẻ câu hỏi -> main; khung bên cạnh (đảo màu) -> side (chứa đáp án người dùng gợi ý).
async function prepareImage(file, { withSide }) {
  const bitmap = await createImageBitmap(file)
  const probeW = Math.min(480, bitmap.width)
  const probeH = Math.max(1, Math.round((bitmap.height * probeW) / bitmap.width))
  const probe = document.createElement('canvas')
  probe.width = probeW
  probe.height = probeH
  const pctx = probe.getContext('2d', { willReadFrequently: true })
  pctx.drawImage(bitmap, 0, 0, probeW, probeH)
  const box = findQuestionCard(pctx.getImageData(0, 0, probeW, probeH).data, probeW, probeH)

  let main
  let side = null
  if (!box) {
    main = drawScaled(bitmap, 0, 0, bitmap.width, bitmap.height)
  } else {
    const k = bitmap.width / probeW
    const pad = 4
    const sx = Math.max(0, Math.floor((box.x0 - pad) * k))
    const sy = Math.max(0, Math.floor((box.y0 - pad) * k))
    const sw = Math.min(bitmap.width - sx, Math.ceil((box.x1 - box.x0 + pad * 2) * k))
    const sh = Math.min(bitmap.height - sy, Math.ceil((box.y1 - box.y0 + pad * 2) * k))
    main = drawScaled(bitmap, sx, sy, sw, sh)
    const sideX = sx + sw
    if (withSide && bitmap.width - sideX > bitmap.width * 0.15) {
      side = drawScaled(bitmap, sideX, 0, bitmap.width - sideX, bitmap.height, { invert: true, targetWidth: 1200, maxScale: 3 })
    }
  }
  bitmap.close?.()
  return { main, side }
}

// Quét lần lượt các ảnh. onProgress({ index, total, percent, status }).
// shouldStop() trả true thì dừng sớm (nút Dừng). Trả về [{ name, text }] của các ảnh đã quét.
export async function ocrImages(files, lang, { onProgress, shouldStop, withSide = true } = {}) {
  const { createWorker } = await import('tesseract.js')
  let current = { index: 0, total: files.length }
  const worker = await createWorker(lang, 1, {
    logger: (m) => {
      const percent = typeof m.progress === 'number' ? Math.round(m.progress * 100) : 0
      onProgress?.({ ...current, percent, status: m.status })
    },
  })
  const results = []
  try {
    for (let i = 0; i < files.length; i++) {
      if (shouldStop?.()) break
      current = { index: i, total: files.length }
      onProgress?.({ ...current, percent: 0, status: 'preparing' })
      const { main, side } = await prepareImage(files[i].file, { withSide })
      const a = await worker.recognize(main)
      let text = a.data.text || ''
      if (side) {
        const b = await worker.recognize(side)
        text += `\n\n${b.data.text || ''}`
      }
      results.push({ name: files[i].name, text })
    }
  } finally {
    await worker.terminate()
  }
  return results
}
