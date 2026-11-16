// Nạp danh sách môn từ 2 nguồn:
//  1) public/data/  (Cách 1 thêm môn: chép file JSON + thêm 1 dòng vào index.json)  -> source: 'static'
//  2) IndexedDB      (Cách 2 và 3: môn người dùng tự thêm trong web)                  -> source: 'user'
import { validateSubject } from './validateSubject.js'
import { getAllUserSubjects } from './db.js'

const dataUrl = (file) => `${import.meta.env.BASE_URL}data/${file}`

async function fetchJson(file) {
  const res = await fetch(dataUrl(file))
  if (!res.ok) throw new Error(`Không tải được ${file} (mã ${res.status})`)
  return res.json()
}

// Gắn chỉ số GỐC (idx) cho từng đáp án. Khi xáo trộn đáp án, idx vẫn đi theo đáp án nên
// phần "sửa giải thích" luôn biết mình đang sửa đáp án nào của file gốc.
export function normalizeSubject(subject, source) {
  return {
    ...subject,
    source,
    questions: subject.questions.map((q) => ({ ...q, options: q.options.map((o, i) => ({ ...o, idx: i })) })),
  }
}

// Trả về { subjects: [môn hợp lệ], errors: [{ name, messages }] }
export async function loadAllSubjects() {
  const errors = []
  const subjects = []

  // --- môn có sẵn trong thư mục data ---
  try {
    const index = await fetchJson('index.json')
    const results = await Promise.all(
      index.map(async (item) => {
        try {
          return { name: item.name || item.id, data: await fetchJson(item.file) }
        } catch (e) {
          return { name: item.name || item.id, failed: e.message }
        }
      }),
    )
    for (const r of results) {
      if (r.failed) errors.push({ name: r.name, messages: [r.failed] })
      else addIfValid(r.data, r.name, 'static', subjects, errors)
    }
  } catch (e) {
    errors.push({ name: 'index.json', messages: [e.message] })
  }

  // --- môn người dùng tự thêm ---
  try {
    for (const data of await getAllUserSubjects()) addIfValid(data, data?.name || data?.id, 'user', subjects, errors)
  } catch (e) {
    errors.push({ name: 'Đề đã thêm (IndexedDB)', messages: [e.message] })
  }

  return { subjects, errors }
}

function addIfValid(data, name, source, subjects, errors) {
  const problems = validateSubject(data)
  if (problems.length) errors.push({ name, messages: problems })
  else if (subjects.some((s) => s.id === data.id)) errors.push({ name, messages: [`Mã môn "${data.id}" bị trùng với một môn khác, môn này bị bỏ qua.`] })
  else subjects.push(normalizeSubject(data, source))
}
