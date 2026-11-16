// IndexedDB: nơi lưu các MÔN người dùng tự thêm (file JSON tải lên, đề dán vào, PDF...).
// Mỗi môn là 1 bản ghi trong kho "subjects", khóa là id môn. Tiến độ học thì nằm ở localStorage (storage.js).
const DB_NAME = 'studyexam'
const STORE = 'subjects'

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('Trình duyệt không hỗ trợ IndexedDB.'))
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('Không mở được IndexedDB.'))
  })
}

// Chạy 1 giao dịch và đợi nó hoàn tất (resolve khi transaction complete, không phải khi request xong)
async function run(mode, work) {
  const db = await openDb()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode)
      let result
      Promise.resolve(work(tx.objectStore(STORE))).then((r) => (result = r)).catch(reject)
      tx.oncomplete = () => resolve(result)
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error || new Error('Giao dịch IndexedDB bị hủy.'))
    })
  } finally {
    db.close()
  }
}

const wrap = (req) => new Promise((resolve, reject) => {
  req.onsuccess = () => resolve(req.result)
  req.onerror = () => reject(req.error)
})

export const getAllUserSubjects = () => run('readonly', (s) => wrap(s.getAll()))
export const putUserSubject = (subject) => run('readwrite', (s) => wrap(s.put(subject)))
export const deleteUserSubject = (id) => run('readwrite', (s) => wrap(s.delete(id)))

// Dùng khi khôi phục từ file sao lưu: thay toàn bộ môn đã thêm bằng danh sách trong file
export const replaceAllUserSubjects = (list) =>
  run('readwrite', async (s) => {
    s.clear()
    list.forEach((subject) => s.put(subject))
  })
