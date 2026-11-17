import { describe, expect, it } from 'vitest'
import { parseOcrImages, parseOcrText } from '../utils/ocrQuestions.js'

describe('parseOcrText', () => {
  it('tách 1 câu kiểu ảnh FUOverflow, bỏ chữ rác, lấy đáp án từ bình luận', () => {
    const text = [
      'MULTIPLE CHOICE',
      'Tiền tệ có mấy chức năng?',
      'A. Ba chức năng',
      'B. Năm chức năng',
      'C. Sáu chức năng',
      'D. Bảy chức năng',
      '',
      'FUOVERFLOW.COM',
      'phunne123 51',
      'b',
      'Báo cáo Like',
    ].join('\n')
    const { questions, rejected } = parseOcrText(text, 'a.png')
    expect(rejected).toHaveLength(0)
    expect(questions).toHaveLength(1)
    const q = questions[0]
    expect(q.question).toBe('Tiền tệ có mấy chức năng?')
    expect(q.options.map((o) => o.text)).toEqual(['Ba chức năng', 'Năm chức năng', 'Sáu chức năng', 'Bảy chức năng'])
    expect(q.options.map((o) => o.correct)).toEqual([false, true, false, false])
    expect(q.uncertain).toBe(true) // có bình luận gợi ý nhưng vẫn nhắc kiểm tra
  })

  it('2 bình luận cùng đáp án thì không đánh dấu nghi ngờ', () => {
    const text = 'Câu hỏi?\nA. x\nB. y\n\nu1\nb\nu2\nB'
    const { questions } = parseOcrText(text)
    expect(questions[0].options.map((o) => o.correct)).toEqual([false, true])
    expect(questions[0].uncertain).toBe(false)
  })

  it('đáp án nhiều dòng được nối lại, câu hỏi nhiều dòng được gộp', () => {
    const text = ['Câu 3. Nhận định nào', 'sau đây là đúng?', 'A. Xã hội phát triển', 'thì hàng hoá phong phú', 'B. Xã hội kém phát triển'].join('\n')
    const { questions } = parseOcrText(text)
    expect(questions[0].question).toBe('Nhận định nào sau đây là đúng?')
    expect(questions[0].options[0].text).toBe('Xã hội phát triển thì hàng hoá phong phú')
    expect(questions[0].options).toHaveLength(2)
  })

  it('không có đáp án đúng thì báo cần tick', () => {
    const { questions } = parseOcrText('Hỏi gì đó?\nA. một\nB. hai\nC. ba')
    expect(questions[0].uncertain).toBe(true)
    expect(questions[0].issues.join(' ')).toMatch(/tick đáp án đúng/)
  })

  it('đáp án có nhiều chữ như "AC" cho câu chọn nhiều', () => {
    const text = 'Chọn hai đáp án.\nA. a1\nB. b1\nC. c1\nD. d1\n\nuser\nAC\nuser2\nac'
    const { questions } = parseOcrText(text)
    expect(questions[0].options.map((o) => o.correct)).toEqual([true, false, true, false])
    expect(questions[0].uncertain).toBe(false)
  })

  it('1 ảnh có nhiều câu: tách đúng từng câu, không áp phiếu bầu', () => {
    const text = ['Câu một?', 'A. a', 'B. b', '', 'Câu hai?', 'A. c', 'B. d', 'C. e'].join('\n')
    const { questions } = parseOcrText(text)
    expect(questions).toHaveLength(2)
    expect(questions[1].question).toBe('Câu hai?')
    expect(questions[1].options).toHaveLength(3)
  })

  it('ảnh không có đáp án thì đưa vào rejected', () => {
    const { questions, rejected } = parseOcrText('chỉ là một đoạn chữ bình thường', 'x.png')
    expect(questions).toHaveLength(0)
    expect(rejected[0].reason).toMatch(/x\.png/)
  })

  it('câu hỏi có số thứ tự đầu dòng thì bỏ số', () => {
    const { questions } = parseOcrText('12. Hai cộng hai bằng mấy?\nA. 3\nB. 4')
    expect(questions[0].question).toBe('Hai cộng hai bằng mấy?')
  })
})

describe('parseOcrImages', () => {
  it('gộp theo thứ tự ảnh', () => {
    const r = parseOcrImages([
      { name: '1', text: 'Q1?\nA. a\nB. b' },
      { name: '2', text: 'rác' },
      { name: '3', text: 'Q3?\nA. a\nB. b' },
    ])
    expect(r.questions.map((q) => q.question)).toEqual(['Q1?', 'Q3?'])
    expect(r.rejected).toHaveLength(1)
  })
})

describe('parseOcrText - OCR đọc sai nhãn đáp án', () => {
  it('nhận B. đọc thành 8., C. thành G. và D. thành 0.', () => {
    const text = ['Câu hỏi?', 'Á Chức năng thực tiễn', '8. Chức năng nhận thức', 'G. Chức năng tư tưởng', '0. Chức năng phương pháp'].join('\n')
    const { questions } = parseOcrText(text)
    expect(questions).toHaveLength(1)
    expect(questions[0].options.map((o) => o.text)).toEqual(['Chức năng thực tiễn', 'Chức năng nhận thức', 'Chức năng tư tưởng', 'Chức năng phương pháp'])
  })

  it('không nhầm "A. Smith" trong câu hỏi khi không có đáp án B', () => {
    const { questions, rejected } = parseOcrText('A. Smith là ai trong lịch sử?\nmột nhà kinh tế')
    expect(questions).toHaveLength(0)
    expect(rejected).toHaveLength(1)
  })
})
