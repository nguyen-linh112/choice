import { describe, expect, it } from 'vitest'
import { computeScore, formatDuration, gradeExam, materializeItem, remainingSeconds } from '../utils/exam.js'
import { gradeQuestion } from '../utils/grade.js'
import { shuffleOptionOrder } from '../utils/deck.js'
import { shuffle } from '../utils/shuffle.js'
import { makeQuestions, seededRng } from './helpers.js'

const multi = { options: [{ correct: true }, { correct: false }, { correct: true }] }

describe('gradeQuestion (câu nhiều đáp án)', () => {
  it('chỉ đúng khi chọn đúng và đủ', () => {
    expect(gradeQuestion(multi, [0, 2])).toBe(true)
    expect(gradeQuestion(multi, [2, 0])).toBe(true)
    expect(gradeQuestion(multi, [0])).toBe(false) // thiếu
    expect(gradeQuestion(multi, [0, 1, 2])).toBe(false) // thừa
    expect(gradeQuestion(multi, [])).toBe(false)
  })
})

describe('gradeExam', () => {
  const qs = makeQuestions(4)
  const byId = new Map(qs.map((q) => [q.id, q]))
  const items = qs.map((q) => ({ id: q.id, fromWrong: false, order: [0, 1, 2, 3] }))

  it('phân loại đúng / sai / chưa làm và tính điểm thang 10', () => {
    const g = gradeExam(items, byId, { q1: [0], q2: [1], q3: [] /* q4 không có */ })
    expect(g.results.map((r) => r.status)).toEqual(['correct', 'wrong', 'blank', 'blank'])
    expect(g.correct).toBe(1)
    expect(g.blank).toBe(2)
    expect(g.score).toBe(2.5)
  })

  it('chấm theo thứ tự đáp án đã xáo (chỉ số hiển thị, không phải chỉ số gốc)', () => {
    // order [2,0,1,3]: đáp án đúng (gốc số 0) đang hiển thị ở vị trí 1
    const shuffled = [{ id: 'q1', fromWrong: false, order: [2, 0, 1, 3] }]
    expect(gradeExam(shuffled, byId, { q1: [1] }).correct).toBe(1)
    expect(gradeExam(shuffled, byId, { q1: [0] }).correct).toBe(0)
  })

  it('bỏ qua câu đã bị xóa khỏi đề', () => {
    const g = gradeExam([...items, { id: 'daXoa', order: [0] }], byId, {})
    expect(g.total).toBe(4)
  })
})

describe('computeScore / thời gian', () => {
  it('làm tròn 2 chữ số', () => {
    expect(computeScore(1, 3)).toBe(3.33)
    expect(computeScore(60, 60)).toBe(10)
    expect(computeScore(0, 0)).toBe(0)
  })

  it('thời gian còn lại tính từ mốc bắt đầu, không âm', () => {
    const s = { startedAt: 1000, durationSeconds: 90 * 60 }
    expect(remainingSeconds(s, 1000)).toBe(5400)
    expect(remainingSeconds(s, 1000 + 60 * 1000)).toBe(5340)
    expect(remainingSeconds(s, 1000 + 99999 * 1000)).toBe(0)
  })

  it('định dạng thời gian', () => {
    expect(formatDuration(65)).toBe('01:05')
    expect(formatDuration(3725)).toBe('1:02:05')
  })
})

describe('xáo trộn', () => {
  it('shuffle giữ nguyên các phần tử và không sửa mảng gốc', () => {
    const a = [1, 2, 3, 4, 5]
    const s = shuffle(a, seededRng(9))
    expect([...s].sort()).toEqual(a)
    expect(a).toEqual([1, 2, 3, 4, 5])
  })

  it('materializeItem sắp đáp án theo order và trả null nếu câu đã bị xóa', () => {
    const q = makeQuestions(1)[0]
    const byId = new Map([[q.id, q]])
    const m = materializeItem({ id: 'q1', order: [3, 2, 1, 0] }, byId)
    expect(m.options.map((o) => o.text)).toEqual(['Sai 3', 'Sai 2', 'Sai 1', 'Đúng'])
    expect(materializeItem({ id: 'x', order: [0] }, byId)).toBeNull()
  })

  it('shuffleOptionOrder là hoán vị hợp lệ', () => {
    const q = makeQuestions(1)[0]
    expect([...shuffleOptionOrder(q.options, seededRng(1))].sort()).toEqual([0, 1, 2, 3])
  })
})
