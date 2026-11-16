import { describe, expect, it } from 'vitest'
import { removeFromWrongList, sortedWrongIds, updateWrongList } from '../utils/wrongList.js'

describe('updateWrongList', () => {
  it('câu sai lần đầu được thêm vào với số lần sai 1, chuỗi đúng 0', () => {
    const next = updateWrongList({}, [{ id: 'a', correct: false }], 100)
    expect(next.a).toEqual({ wrongCount: 1, streak: 0, lastSeen: 100 })
  })

  it('câu sai thêm lần nữa thì tăng số lần sai và đưa chuỗi đúng về 0', () => {
    const list = { a: { wrongCount: 2, streak: 2, lastSeen: 1 } }
    const next = updateWrongList(list, [{ id: 'a', correct: false }], 200)
    expect(next.a).toEqual({ wrongCount: 3, streak: 0, lastSeen: 200 })
  })

  it('câu đang trong danh sách mà làm đúng thì tăng chuỗi đúng', () => {
    const list = { a: { wrongCount: 4, streak: 0, lastSeen: 1 } }
    const next = updateWrongList(list, [{ id: 'a', correct: true }], 300)
    expect(next.a).toEqual({ wrongCount: 4, streak: 1, lastSeen: 300 })
  })

  it('đúng đủ 3 lần liên tiếp thì ra khỏi danh sách', () => {
    let list = { a: { wrongCount: 4, streak: 0, lastSeen: 1 } }
    list = updateWrongList(list, [{ id: 'a', correct: true }])
    list = updateWrongList(list, [{ id: 'a', correct: true }])
    expect(list.a.streak).toBe(2) // 2 lần chưa đủ
    list = updateWrongList(list, [{ id: 'a', correct: true }])
    expect(list.a).toBeUndefined()
  })

  it('đang đúng 2 lần mà sai một lần thì phải làm lại từ đầu 3 lần', () => {
    let list = { a: { wrongCount: 1, streak: 2, lastSeen: 1 } }
    list = updateWrongList(list, [{ id: 'a', correct: false }])
    expect(list.a.streak).toBe(0)
    list = updateWrongList(list, [{ id: 'a', correct: true }])
    list = updateWrongList(list, [{ id: 'a', correct: true }])
    expect(list.a).toBeDefined() // mới 2 lần liên tiếp
  })

  it('câu đúng mà không nằm trong danh sách thì không thêm vào', () => {
    expect(updateWrongList({}, [{ id: 'x', correct: true }])).toEqual({})
  })

  it('xử lý nhiều câu một lúc và không sửa danh sách cũ', () => {
    const list = { a: { wrongCount: 1, streak: 0, lastSeen: 1 } }
    const next = updateWrongList(list, [
      { id: 'a', correct: true },
      { id: 'b', correct: false }, // bỏ trống cũng được truyền vào dưới dạng sai
    ])
    expect(Object.keys(next).sort()).toEqual(['a', 'b'])
    expect(list.a.streak).toBe(0) // bản gốc không đổi
  })
})

describe('removeFromWrongList / sortedWrongIds', () => {
  it('bỏ thủ công 1 câu', () => {
    const list = { a: { wrongCount: 1, streak: 0, lastSeen: 1 }, b: { wrongCount: 1, streak: 0, lastSeen: 1 } }
    expect(Object.keys(removeFromWrongList(list, 'a'))).toEqual(['b'])
    expect(Object.keys(list)).toHaveLength(2)
  })

  it('sắp theo số lần sai giảm dần, bằng nhau thì câu lâu chưa gặp trước', () => {
    const list = {
      a: { wrongCount: 1, streak: 0, lastSeen: 10 },
      b: { wrongCount: 3, streak: 0, lastSeen: 50 },
      c: { wrongCount: 3, streak: 0, lastSeen: 20 },
    }
    expect(sortedWrongIds(list)).toEqual(['c', 'b', 'a'])
  })
})
