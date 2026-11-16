import { describe, expect, it } from 'vitest'
import {
  clearQuestionOverride, effectiveExplain, effectiveNote, mergeSubjectWithOverrides,
  setExplainOverride, setNoteOverride, toExportableSubject,
} from '../utils/overrides.js'
import { buildExplainPrompt, chunk, findMissingExplanations, parseExplainResponse } from '../utils/explainPrompt.js'
import { buildBackup, parseBackup, summarizeBackup } from '../utils/backup.js'
import { validateSubject } from '../utils/validateSubject.js'
import { makeQuestions } from './helpers.js'

describe('overrides (tự sửa giải thích)', () => {
  it('ghi đè giải thích và khôi phục về bản gốc', () => {
    let m = setExplainOverride({}, 'q1', 0, 'bản mới', 'bản gốc')
    expect(effectiveExplain(m, 'q1', 0, 'bản gốc')).toBe('bản mới')
    expect(effectiveExplain(m, 'q1', 1, 'gốc 1')).toBe('gốc 1') // đáp án khác không bị ảnh hưởng
    m = clearQuestionOverride(m, 'q1')
    expect(effectiveExplain(m, 'q1', 0, 'bản gốc')).toBe('bản gốc')
    expect(m).toEqual({})
  })

  it('sửa về đúng bản gốc thì không còn đánh dấu đã chỉnh sửa', () => {
    let m = setExplainOverride({}, 'q1', 0, 'khác', 'gốc')
    m = setExplainOverride(m, 'q1', 0, 'gốc', 'gốc')
    expect(m).toEqual({})
  })

  it('cho phép xóa trắng giải thích (ghi đè bằng rỗng)', () => {
    const m = setExplainOverride({}, 'q1', 0, '', 'gốc')
    expect(effectiveExplain(m, 'q1', 0, 'gốc')).toBe('')
  })

  it('ghi chú của câu', () => {
    let m = setNoteOverride({}, 'q1', 'ghi chú mới', '')
    expect(effectiveNote(m, 'q1', '')).toBe('ghi chú mới')
    m = setNoteOverride(m, 'q1', '', '')
    expect(m).toEqual({})
  })

  it('gộp vào môn để xuất file, bỏ trường nội bộ', () => {
    const subject = { id: 's', name: 'S', source: 'static', questions: makeQuestions(2).map((q) => ({ ...q, options: q.options.map((o, i) => ({ ...o, idx: i })) })) }
    const m = setExplainOverride({}, 'q1', 2, 'đã sửa', 'x')
    const out = toExportableSubject(mergeSubjectWithOverrides(subject, m))
    expect(out.questions[0].options[2].explain).toBe('đã sửa')
    expect(out.questions[1].options[2].explain).toBe('x')
    expect(out.source).toBeUndefined()
    expect(out.questions[0].options[0].idx).toBeUndefined()
    expect(validateSubject(out)).toEqual([]) // vẫn đúng cấu trúc Phần 1
  })
})

describe('explainPrompt', () => {
  const qs = makeQuestions(3).map((q, i) => (i === 0 ? q : { ...q, options: q.options.map((o) => ({ ...o, explain: '' })) }))
  const subject = { id: 's', name: 'Môn thử', questions: qs }

  it('tìm câu thiếu giải thích, tính cả phần đã tự sửa', () => {
    expect(findMissingExplanations(subject).map((q) => q.id)).toEqual(['q2', 'q3'])
    let m = {}
    for (let i = 0; i < 4; i++) m = setExplainOverride(m, 'q2', i, 'đã viết', '')
    expect(findMissingExplanations(subject, m).map((q) => q.id)).toEqual(['q3'])
  })

  it('chia đợt', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('prompt chứa quy tắc không nhắc chữ cái và dữ liệu câu hỏi', () => {
    const p = buildExplainPrompt('Môn thử', qs.slice(1))
    expect(p).toMatch(/không nhắc tới chữ cái/i)
    expect(p).toContain('"id": "q2"')
    expect(p).not.toContain('"id": "q1"')
  })

  const byId = new Map(qs.map((q) => [q.id, q]))
  it('đọc kết quả JSON, kể cả có rào ```json', () => {
    const text = 'Đây là kết quả:\n```json\n{"q2": ["a","b","c","d"], "q3": ["a","b","c","d"]}\n```'
    const { updates, errors } = parseExplainResponse(text, byId)
    expect(errors).toEqual([])
    expect(Object.keys(updates)).toEqual(['q2', 'q3'])
  })

  it('báo lỗi từng câu (sai số lượng, id lạ, rỗng) nhưng vẫn nhận các câu hợp lệ', () => {
    const { updates, errors } = parseExplainResponse('{"q2": ["a","b"], "q3": ["a","b","c","d"], "zzz": ["x"], "q1": ["a","","c","d"]}', byId)
    expect(Object.keys(updates)).toEqual(['q3'])
    expect(errors).toHaveLength(3)
    expect(errors.join('\n')).toMatch(/q2: có 2 giải thích nhưng câu có 4 đáp án/)
  })

  it('nhận dạng mảng [{id, explain}] và báo JSON hỏng', () => {
    expect(parseExplainResponse('[{"id":"q2","explain":["a","b","c","d"]}]', byId).updates.q2).toHaveLength(4)
    expect(parseExplainResponse('{"q2": [', byId).errors[0]).toMatch(/JSON/)
    expect(parseExplainResponse('không có gì', byId).errors).toHaveLength(1)
  })
})

describe('backup', () => {
  const local = { 'studyexam:v1:mln122:progress': '{"status":{}}', 'studyexam:v1:mln122:wrong': '{}' }

  it('xuất rồi đọc lại đúng nội dung', () => {
    const backup = buildBackup({ localEntries: local, userSubjects: [{ id: 'x' }], now: 0 })
    const res = parseBackup(JSON.stringify(backup))
    expect(res.ok).toBe(true)
    expect(res.backup.local).toEqual(local)
    expect(summarizeBackup(res.backup)).toMatchObject({ subjectsWithData: 1, userSubjects: 1, keys: 2 })
  })

  it('từ chối file không phải sao lưu, JSON hỏng, khóa lạ', () => {
    expect(parseBackup('{{').ok).toBe(false)
    expect(parseBackup('{"app":"khac"}').ok).toBe(false)
    expect(parseBackup(JSON.stringify({ app: 'studyexam', version: 1, local: { evil: 'x' }, subjects: [] })).ok).toBe(false)
    expect(parseBackup(JSON.stringify({ app: 'studyexam', version: 99, local: {}, subjects: [] })).ok).toBe(false)
  })
})

describe('validateSubject', () => {
  const ok = () => ({ id: 's', name: 'S', questions: makeQuestions(2) })

  it('môn đúng cấu trúc thì không có lỗi', () => {
    expect(validateSubject(ok())).toEqual([])
  })

  it('báo rõ câu nào sai: thiếu đáp án đúng, thiếu text, số đáp án', () => {
    const s = ok()
    s.questions[0].options.forEach((o) => (o.correct = false))
    s.questions[1].options[1].text = ''
    s.questions[1].options = s.questions[1].options.slice(0, 1)
    const errors = validateSubject(s).join('\n')
    expect(errors).toMatch(/Câu thứ 1 \(q1\): chưa có đáp án đúng/)
    expect(errors).toMatch(/Câu thứ 2 \(q2\): cần từ 2 đến 6 đáp án/)
  })

  it('id trùng và thiếu trường', () => {
    const s = ok()
    s.questions[1].id = 'q1'
    expect(validateSubject(s).join()).toMatch(/bị trùng/)
    expect(validateSubject({}).length).toBeGreaterThan(0)
    expect(validateSubject(null)[0]).toMatch(/JSON/)
  })
})
