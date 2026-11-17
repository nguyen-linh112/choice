import { describe, expect, it } from 'vitest'
import { findQuestionCard } from '../utils/ocrRunner.js'

// Tạo ảnh RGBA w x h: vùng [x0,x1) x [y0,y1) trắng, còn lại tối
function makeImage(w, h, box) {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inside = box && x >= box.x0 && x < box.x1 && y >= box.y0 && y < box.y1
      const v = box ? (inside ? 255 : 20) : 255
      const i = (y * w + x) * 4
      data[i] = data[i + 1] = data[i + 2] = v
      data[i + 3] = 255
    }
  }
  return data
}

describe('findQuestionCard', () => {
  it('tìm được thẻ trắng nằm bên trái ảnh tối', () => {
    const box = { x0: 0, x1: 300, y0: 10, y1: 150 }
    const r = findQuestionCard(makeImage(480, 300, box), 480, 300)
    expect(r).toEqual({ x0: 0, x1: 300, y0: 10, y1: 150 })
  })

  it('ảnh trắng hoàn toàn thì không cắt', () => {
    expect(findQuestionCard(makeImage(200, 100, null), 200, 100)).toBeNull()
  })

  it('ảnh tối hoàn toàn thì không tìm thấy thẻ', () => {
    const data = makeImage(200, 100, { x0: 0, x1: 0, y0: 0, y1: 0 })
    expect(findQuestionCard(data, 200, 100)).toBeNull()
  })
})
