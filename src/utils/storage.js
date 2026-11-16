// Đọc/ghi localStorage. MỌI dữ liệu tiến độ đều gắn với id môn => tách riêng từng môn.
// Bọc try/catch vì localStorage có thể bị chặn (chế độ riêng tư) hoặc đầy.

const PREFIX = 'studyexam:v1'
const key = (subjectId, name) => `${PREFIX}:${subjectId}:${name}`

function read(k, fallback) {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(k, value) {
  try {
    localStorage.setItem(k, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Tiến độ ôn tập:
//   status: { [questionId]: 'known' | 'unknown' }
//   last:   { all, known, unknown } = id câu đang học dở của từng bộ (lưu theo id để không lệch khi bộ thay đổi)
export const loadProgress = (subjectId) => {
  const p = read(key(subjectId, 'progress'), null)
  return { status: p?.status || {}, last: p?.last || {} }
}
export const saveProgress = (subjectId, progress) => write(key(subjectId, 'progress'), progress)

// Danh sách câu sai: { [questionId]: { wrongCount, streak, lastSeen } }  (làm ở Bước 3)
export const loadWrongList = (subjectId) => read(key(subjectId, 'wrong'), {})
export const saveWrongList = (subjectId, list) => write(key(subjectId, 'wrong'), list)

// Lịch sử thi: [{ id, date, score, correct, total, seconds, items: [{ id, order, fromWrong, selected }] }]
// (cũ -> mới). Chỉ lưu id câu + thứ tự đáp án + lựa chọn, nội dung câu lấy lại từ đề khi xem.
export const loadHistory = (subjectId) => read(key(subjectId, 'history'), [])
export const saveHistory = (subjectId, history) => write(key(subjectId, 'history'), history)

// Cài đặt riêng của môn: { questionCount, durationMinutes, wrongCount }
export const loadSettings = (subjectId) => read(key(subjectId, 'settings'), {})
export const saveSettings = (subjectId, settings) => write(key(subjectId, 'settings'), settings)

// Các câu đã từng xuất hiện trong đề thi: { [questionId]: mốc thời gian }
export const loadSeen = (subjectId) => read(key(subjectId, 'seen'), {})
export const saveSeen = (subjectId, seen) => write(key(subjectId, 'seen'), seen)

// Giải thích / ghi chú do người dùng tự sửa (xem overrides.js)
export const loadOverrides = (subjectId) => read(key(subjectId, 'overrides'), {})
export const saveOverrides = (subjectId, map) => write(key(subjectId, 'overrides'), map)

// Xóa MỌI dữ liệu học của 1 môn (khi xóa môn)
export function clearSubjectData(subjectId) {
  try {
    const prefix = `${PREFIX}:${subjectId}:`
    Object.keys(localStorage).filter((k) => k.startsWith(prefix)).forEach((k) => localStorage.removeItem(k))
  } catch {
    /* bỏ qua */
  }
}

// Sao lưu / khôi phục: lấy và ghi lại TOÀN BỘ khóa của app trong localStorage
export function dumpLocalEntries() {
  const entries = {}
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith(`${PREFIX}:`)) entries[k] = localStorage.getItem(k)
  } catch {
    /* bỏ qua */
  }
  return entries
}

export function restoreLocalEntries(entries) {
  // xóa dữ liệu cũ của app rồi ghi dữ liệu trong file (khôi phục = thay thế hoàn toàn)
  Object.keys(dumpLocalEntries()).forEach((k) => localStorage.removeItem(k))
  Object.entries(entries).forEach(([k, v]) => localStorage.setItem(k, v))
}

// Bài thi đang làm dở (để khôi phục khi tải lại trang):
// { startedAt, durationSeconds, items: [{ id, order, fromWrong }], answers, flagged, current }
export const loadExamSession = (subjectId) => read(key(subjectId, 'examSession'), null)
export const saveExamSession = (subjectId, session) => write(key(subjectId, 'examSession'), session)
export function clearExamSession(subjectId) {
  try {
    localStorage.removeItem(key(subjectId, 'examSession'))
  } catch {
    /* bỏ qua */
  }
}
