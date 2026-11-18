import { describe, expect, it } from 'vitest'
import { isGroupSubject, sectionSubjectId, validateGroup } from '../utils/validateSubject.js'
import { expandGroup } from '../utils/subjectsApi.js'

const q = (id) => ({ id, question: 'Q?', options: [{ text: 'a', correct: true }, { text: 'b', correct: false }] })
const group = () => ({
  id: 'jp',
  name: 'JP',
  sections: [{ key: 'listening', label: 'Nghe' }, { key: 'choice', label: 'Trắc nghiệm' }],
  sets: [{ id: 's1', name: 'Đề 1', sections: { listening: { questions: [q('l1'), q('l2')] }, choice: { questions: [] } } }],
})

describe('môn nhóm (nhiều đề, nhiều mục)', () => {
  it('nhận ra môn nhóm và chấp nhận mục rỗng', () => {
    expect(isGroupSubject(group())).toBe(true)
    expect(isGroupSubject({ id: 'x', questions: [] })).toBe(false)
    expect(validateGroup(group())).toEqual([])
  })

  it('báo lỗi mục không khai báo, đề trùng id, câu hỏi sai cấu trúc', () => {
    const g = group()
    g.sets[0].sections.reading = { questions: [q('r1')] }
    expect(validateGroup(g).join(' ')).toMatch(/reading/)
    const dup = group()
    dup.sets.push({ id: 's1', name: 'Trùng', sections: {} })
    expect(validateGroup(dup).join(' ')).toMatch(/trùng/)
    const bad = group()
    bad.sets[0].sections.listening.questions[0].options[0].correct = false
    expect(validateGroup(bad).join(' ')).toMatch(/chưa có đáp án đúng/)
  })

  it('expandGroup tạo môn con ẩn cho mục có câu, mục rỗng thì không', () => {
    const { group: info, subjects } = expandGroup(group(), 'static')
    expect(subjects).toHaveLength(1)
    expect(subjects[0].id).toBe(sectionSubjectId('jp', 's1', 'listening'))
    expect(subjects[0].hidden).toBe(true)
    expect(subjects[0].questions[0].options[0].idx).toBe(0)
    const sec = info.sets[0].sections
    expect(sec[0]).toMatchObject({ key: 'listening', count: 2, subjectId: 'jp--s1--listening' })
    expect(sec[1]).toMatchObject({ key: 'choice', count: 0, subjectId: null })
  })
})
