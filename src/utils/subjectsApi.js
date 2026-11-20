// Nạp danh sách môn từ 2 nguồn:
//  1) public/data/  (Cách 1 thêm môn: chép file JSON + thêm 1 dòng vào index.json)  -> source: 'static'
//  2) IndexedDB      (Cách 2 và 3: môn người dùng tự thêm trong web)                  -> source: 'user'
import { isGroupSubject, sectionSubjectId, validateGroup, validateSubject } from './validateSubject.js'
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

// Môn dạng nhóm (nhiều đề, mỗi đề nhiều mục) -> { group, subjects }.
//  - subjects: các "môn con" ẩn (hidden), mỗi mục có câu hỏi là 1 môn con; dùng lại toàn bộ trang Ôn tập / Thi thử / Câu sai
//    nên tiến độ của từng mục tách riêng.
//  - group: thông tin để trang chủ vẽ danh sách đề và các mục.
export function expandGroup(data, source) {
  const subjects = []
  const sets = data.sets.map((set) => ({
    id: set.id,
    name: set.name,
    sections: data.sections.map((sec) => {
      if (sec.type === 'writing') {
        const items = set.sections?.[sec.key]?.items || []
        return { key: sec.key, label: sec.label, subjectId: null, count: items.length, writing: true, items }
      }
      const questions = set.sections?.[sec.key]?.questions || []
      if (questions.length === 0) return { key: sec.key, label: sec.label, subjectId: null, count: 0 }
      const id = sectionSubjectId(data.id, set.id, sec.key)
      const exam = set.sections[sec.key].exam || { questionCount: Math.min(questions.length, 60), durationMinutes: 30 }
      subjects.push(normalizeSubject({
        id,
        name: `${data.name} · ${set.name} · ${sec.label}`,
        exam,
        questions,
        hidden: true,
        groupId: data.id,
        setId: set.id,
        sectionKey: sec.key,
      }, source))
      return { key: sec.key, label: sec.label, subjectId: id, count: questions.length }
    }),
  }))
  return { group: { id: data.id, name: data.name, source, sets }, subjects }
}

export function writingPath(groupId, setId, key) {
  return `/writing/${groupId}/${setId}/${key}`
}

// Trả về { subjects: [môn hợp lệ], groups: [môn nhóm], errors: [{ name, messages }] }
export async function loadAllSubjects() {
  const errors = []
  const subjects = []
  const groups = []

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
      else addIfValid(r.data, r.name, 'static', subjects, errors, groups)
    }
  } catch (e) {
    errors.push({ name: 'index.json', messages: [e.message] })
  }

  // --- môn người dùng tự thêm ---
  try {
    for (const data of await getAllUserSubjects()) addIfValid(data, data?.name || data?.id, 'user', subjects, errors, groups)
  } catch (e) {
    errors.push({ name: 'Đề đã thêm (IndexedDB)', messages: [e.message] })
  }

  return { subjects, groups, errors }
}

function addIfValid(data, name, source, subjects, errors, groups) {
  if (isGroupSubject(data)) {
    const gp = validateGroup(data)
    if (gp.length) return errors.push({ name, messages: gp })
    if (groups.some((g) => g.id === data.id) || subjects.some((s) => s.id === data.id)) {
      return errors.push({ name, messages: [`Mã môn "${data.id}" bị trùng với một môn khác, môn này bị bỏ qua.`] })
    }
    const { group, subjects: subs } = expandGroup(data, source)
    groups.push(group)
    subjects.push(...subs)
    return undefined
  }
  const problems = validateSubject(data)
  if (problems.length) errors.push({ name, messages: problems })
  else if (subjects.some((s) => s.id === data.id)) errors.push({ name, messages: [`Mã môn "${data.id}" bị trùng với một môn khác, môn này bị bỏ qua.`] })
  else subjects.push(normalizeSubject(data, source))
}
