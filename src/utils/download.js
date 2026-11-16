// Tiện ích trình duyệt: tải file xuống, sao chép vào clipboard, đọc file người dùng chọn.

export function downloadText(filename, text, mime = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // trình duyệt chặn clipboard (vd mở từ file hoặc http): dùng cách cũ
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

export const readFileText = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error('Không đọc được file.'))
    r.readAsText(file, 'utf-8')
  })

export const readFileBuffer = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(new Error('Không đọc được file.'))
    r.readAsArrayBuffer(file)
  })

export const todayStamp = () => new Date().toISOString().slice(0, 10).replace(/-/g, '')
