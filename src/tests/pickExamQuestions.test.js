import { describe, expect, it } from 'vitest'
import { pickExamQuestions } from '../utils/pickExamQuestions.js'
import { makeQuestions, seededRng } from './helpers.js'

const questions = makeQuestions(100)
// 20 câu sai: q1..q20, câu qN sai N lần (q20 sai nhiều nhất)
const wrongList = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [`q${i + 1}`, { wrongCount: i + 1, streak: 0, lastSeen: 1000 }]),
)

const pick = (opts = {}) =>
  pickExamQuestions({ questions, wrongList, questionCount: 60, wrongTarget: 12, rng: seededRng(1), ...opts })

describe('pickExamQuestions', () => {
  it('ra đủ số câu, không trùng câu nào', () => {
    const exam = pick()
    expect(exam).toHaveLength(60)
    expect(new Set(exam.map((e) => e.id)).size).toBe(60)
  })

  it('lấy đúng N câu từ danh sách sai và gắn nhãn fromWrong', () => {
    const exam = pick()
    const fromWrong = exam.filter((e) => e.fromWrong)
    expect(fromWrong).toHaveLength(12)
    expect(fromWrong.every((e) => e.id in wrongList)).toBe(true)
  })

  it('ưu tiên các câu sai nhiều lần nhất', () => {
    const ids = pick().filter((e) => e.fromWrong).map((e) => e.id)
    // 12 câu sai nhiều nhất là q9..q20
    for (let n = 9; n <= 20; n++) expect(ids).toContain(`q${n}`)
  })

  it('cùng số lần sai thì ưu tiên câu lâu chưa gặp lại', () => {
    const list = {
      a: { wrongCount: 2, streak: 0, lastSeen: 500 }, // lâu chưa gặp
      b: { wrongCount: 2, streak: 0, lastSeen: 900 },
      c: { wrongCount: 2, streak: 0, lastSeen: 700 },
    }
    const qs = makeQuestions(30).map((q, i) => (i < 3 ? { ...q, id: 'abc'[i] } : q))
    const exam = pickExamQuestions({ questions: qs, wrongList: list, questionCount: 10, wrongTarget: 2, rng: seededRng(3) })
    const ids = exam.filter((e) => e.fromWrong).map((e) => e.id).sort()
    expect(ids).toEqual(['a', 'c'])
  })

  it('danh sách sai ít hơn N thì lấy hết', () => {
    const small = { q5: { wrongCount: 3, streak: 0, lastSeen: 1 }, q6: { wrongCount: 1, streak: 0, lastSeen: 1 } }
    const exam = pickExamQuestions({ questions, wrongList: small, questionCount: 60, wrongTarget: 12, rng: seededRng(2) })
    expect(exam.filter((e) => e.fromWrong).map((e) => e.id).sort()).toEqual(['q5', 'q6'])
    expect(exam).toHaveLength(60)
  })

  it('không có danh sách sai thì toàn câu mới, vẫn đủ số câu', () => {
    const exam = pick({ wrongList: {} })
    expect(exam).toHaveLength(60)
    expect(exam.some((e) => e.fromWrong)).toBe(false)
  })

  it('bỏ qua câu trong danh sách sai mà đã bị xóa khỏi đề', () => {
    const exam = pick({ wrongList: { ...wrongList, daXoa: { wrongCount: 99, streak: 0, lastSeen: 1 } } })
    expect(exam.map((e) => e.id)).not.toContain('daXoa')
  })

  it('ưu tiên câu chưa từng xuất hiện trong các đề trước', () => {
    // q21..q100 (80 câu) chưa gặp; q1..q20 đã gặp. Danh sách sai rỗng => phải lấy toàn câu chưa gặp
    const seen = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`q${i + 1}`, 5]))
    const exam = pick({ wrongList: {}, seen })
    expect(exam.every((e) => Number(e.id.slice(1)) > 20)).toBe(true)
  })

  it('hết câu chưa gặp thì lấy câu lâu chưa gặp nhất', () => {
    const qs = makeQuestions(10)
    const seen = Object.fromEntries(qs.map((q, i) => [q.id, (i + 1) * 100])) // q1 cũ nhất ... q10 mới nhất
    const exam = pickExamQuestions({ questions: qs, wrongList: {}, seen, questionCount: 4, rng: seededRng(4) })
    expect(exam.map((e) => e.id).sort()).toEqual(['q1', 'q2', 'q3', 'q4'])
  })

  it('môn ít câu hơn số câu thi thì lấy hết', () => {
    const qs = makeQuestions(8)
    const exam = pickExamQuestions({ questions: qs, wrongList: {}, questionCount: 60, rng: seededRng(5) })
    expect(exam).toHaveLength(8)
  })

  it('đề nhỏ: câu sai không chiếm quá nửa đề', () => {
    const exam = pick({ questionCount: 10 })
    expect(exam.filter((e) => e.fromWrong).length).toBeLessThanOrEqual(5)
  })

  it('mỗi lần ra một đề khác nhau (thứ tự và tập câu)', () => {
    const a = pick({ rng: seededRng(10) }).map((e) => e.id)
    const b = pick({ rng: seededRng(11) }).map((e) => e.id)
    expect(a).not.toEqual(b)
  })

  it('order là hoán vị hợp lệ của các đáp án', () => {
    for (const e of pick()) expect([...e.order].sort()).toEqual([0, 1, 2, 3])
  })

  it('đáp án "Tất cả phương án trên" luôn ở cuối sau khi xáo', () => {
    const qs = makeQuestions(5).map((q) => ({
      ...q,
      options: [...q.options.slice(0, 3), { text: 'Tất cả phương án trên', correct: false, explain: 'x' }],
    }))
    const exam = pickExamQuestions({ questions: qs, wrongList: {}, questionCount: 5, rng: seededRng(7) })
    for (const e of exam) expect(e.order[3]).toBe(3)
  })
})
