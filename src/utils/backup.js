// Sao lưu / khôi phục toàn bộ dữ liệu (tiến độ, danh sách sai, lịch sử, giải thích đã sửa, đề đã thêm...)
// vì dữ liệu chỉ nằm trong trình duyệt. Phần này chỉ xử lý dữ liệu thuần; việc đọc/ghi localStorage và IndexedDB
// nằm ở storage.js và db.js.

export const BACKUP_APP = 'studyexam'
export const BACKUP_VERSION = 1
export const STORAGE_PREFIX = 'studyexam:v1:'

// localEntries: { [key]: chuỗi } chỉ gồm các khóa của app này
export function buildBackup({ localEntries, userSubjects, now = Date.now() }) {
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    createdAt: new Date(now).toISOString(),
    local: localEntries,
    subjects: userSubjects,
  }
}

// Kiểm tra nội dung file khôi phục. Trả về { ok: true, backup } hoặc { ok: false, error }
export function parseBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'File không phải JSON hợp lệ.' }
  }
  if (!data || data.app !== BACKUP_APP) return { ok: false, error: 'Đây không phải file sao lưu của web này.' }
  if (typeof data.version !== 'number' || data.version > BACKUP_VERSION) return { ok: false, error: 'File sao lưu có phiên bản mới hơn, web này chưa đọc được.' }
  if (!data.local || typeof data.local !== 'object' || Array.isArray(data.local)) return { ok: false, error: 'File sao lưu thiếu phần dữ liệu học.' }
  if (!Array.isArray(data.subjects)) return { ok: false, error: 'File sao lưu thiếu danh sách đề đã thêm.' }
  // chỉ nhận khóa của app, giá trị phải là chuỗi (an toàn khi ghi vào localStorage)
  for (const [k, v] of Object.entries(data.local)) {
    if (!k.startsWith(STORAGE_PREFIX) || typeof v !== 'string') return { ok: false, error: `Dữ liệu không hợp lệ ở khóa "${k}".` }
  }
  return { ok: true, backup: data }
}

// Tóm tắt để hiện cho người dùng trước khi khôi phục
export function summarizeBackup(backup) {
  const subjectIds = new Set(Object.keys(backup.local).map((k) => k.slice(STORAGE_PREFIX.length).split(':')[0]))
  return {
    createdAt: backup.createdAt,
    subjectsWithData: subjectIds.size,
    userSubjects: backup.subjects.length,
    keys: Object.keys(backup.local).length,
  }
}
