import { describe, expect, it } from 'vitest'
import { mergeDuplicates, normalizeRawText, parseRawExam, slugify } from '../utils/parseRawExam.js'
import { pageToText } from '../utils/pdfText.js'

const parse = (text) => parseRawExam(text, { idPrefix: 't' })
const correctTexts = (q) => q.options.filter((o) => o.correct).map((o) => o.text)

describe('parseRawExam - kiểu 1: dòng lặp lại nguyên văn đáp án đúng', () => {
  const text = `
Ai là tác giả của câu nói trên?
A. C. Mác
B. Ph. Ăngghen
C. V. I. Lênin
D. Hồ Chí Minh
C. V. I. Lênin

Công thức chung của tư bản là:
A. H-T-H
B. T-H-T
C. T-H-T'
C. T-H-T'
`
  it('tách đúng câu hỏi, đáp án và đáp án đúng', () => {
    const { questions, rejected } = parse(text)
    expect(rejected).toHaveLength(0)
    expect(questions).toHaveLength(2)
    expect(questions[0].question).toBe('Ai là tác giả của câu nói trên?')
    expect(questions[0].options.map((o) => o.text)).toEqual(['C. Mác', 'Ph. Ăngghen', 'V. I. Lênin', 'Hồ Chí Minh'])
    expect(correctTexts(questions[0])).toEqual(['V. I. Lênin'])
    expect(questions[1].options).toHaveLength(3) // câu 3 đáp án
    expect(correctTexts(questions[1])).toEqual(["T-H-T'"])
  })

  it('"A. C. Mác" không bị tách nhầm thành 2 đáp án', () => {
    const { questions } = parse(text)
    expect(questions[0].options[0].text).toBe('C. Mác')
    expect(questions[0].options).toHaveLength(4)
  })

  it('câu nhiều đáp án: các dòng đáp án liên tiếp', () => {
    const multi = `
Hãy chỉ ra vai trò tích cực của chủ nghĩa tư bản (chọn 3 đáp án)
A. Thúc đẩy lực lượng sản xuất
B. Mở rộng thị trường thuộc địa
C. Chuyển sản xuất nhỏ thành sản xuất lớn
D. Thực hiện xã hội hóa sản xuất
A. Thúc đẩy lực lượng sản xuất
C. Chuyển sản xuất nhỏ thành sản xuất lớn
D. Thực hiện xã hội hóa sản xuất
`
    const { questions } = parse(multi)
    expect(questions).toHaveLength(1)
    expect(correctTexts(questions[0])).toHaveLength(3)
    expect(questions[0].uncertain).toBe(false)
  })

  it('đáp án đúng dài, bị ngắt dòng và lệch 1-2 chữ so với đáp án gốc (lỗi scan)', () => {
    const wrapped = `
Sự phát triển các hình thái giá trị gồm
A. Hình thái ngẫu nhiên
B. Hình thái ngẫu nhiên; hình thái mở rộng (đây đủ);
hình thái chung; hình thái tiền tệ
C. Hình thái chung
B. Hình thái ngẫu nhiên; hình thái mở
rộng (đầy đủ); hình thái chung; hình thái tiền tệ

Câu tiếp theo là gì?
A. Một
B. Hai
B. Hai
`
    const { questions } = parse(wrapped)
    expect(questions).toHaveLength(2)
    expect(questions[0].options).toHaveLength(3)
    expect(questions[0].options[1].correct).toBe(true)
    expect(questions[1].question).toBe('Câu tiếp theo là gì?')
  })
})

describe('parseRawExam - kiểu 2: chỉ ghi chữ cái', () => {
  it('một chữ cái, nhiều chữ cái, và câu 5 đáp án', () => {
    const text = `
Câu một là gì?
A. Một
B. Hai
C. Ba
D. Bốn
C
Câu hai chọn hai đáp án đúng
A. Alpha
B. Beta
C. Gamma
D. Delta
E. Epsilon
A C
Câu ba?
A. Có
B. Không
B
`
    const { questions } = parse(text)
    expect(questions).toHaveLength(3)
    expect(correctTexts(questions[0])).toEqual(['Ba'])
    expect(questions[1].options).toHaveLength(5)
    expect(correctTexts(questions[1])).toEqual(['Alpha', 'Gamma'])
    expect(correctTexts(questions[2])).toEqual(['Không'])
  })
})

describe('parseRawExam - định dạng lộn xộn', () => {
  it('câu hỏi và đáp án bị ngắt nhiều dòng được nối lại', () => {
    const text = `
Việc đẩy mạnh ứng dụng khoa học-
công nghệ ở nước ta hiện nay phải
gắn liền với yếu tố nào?
A. Phát triển kinh tế tri
thức
B. Phát triển công nghiệp nặng
B
`
    const { questions } = parse(text)
    expect(questions[0].question).toBe('Việc đẩy mạnh ứng dụng khoa học- công nghệ ở nước ta hiện nay phải gắn liền với yếu tố nào?')
    expect(questions[0].options[0].text).toBe('Phát triển kinh tế tri thức')
  })

  it('các đáp án trên cùng 1 dòng', () => {
    const { questions } = parse('Năm nào?\nA. 2007 B. 2006 C. 2005 D. 2008\nA')
    expect(questions[0].options.map((o) => o.text)).toEqual(['2007', '2006', '2005', '2008'])
    expect(correctTexts(questions[0])).toEqual(['2007'])
  })

  it('đổi chữ cái Cyrillic giống Latin (В, С, А) về Latin', () => {
    // В (Cyrillic) trông như B, С như C, А như A
    const { questions } = parse('Câu hỏi?\nА. Một\nВ. Hai\nС. Ba\nС')
    expect(questions[0].options.map((o) => o.text)).toEqual(['Một', 'Hai', 'Ba'])
    expect(correctTexts(questions[0])).toEqual(['Ba'])
    expect(normalizeRawText('ВС')).toBe('BC')
  })

  it('chấp nhận nhãn chữ thường a. b. c.', () => {
    const { questions } = parse('Mệnh đề nào đúng?\na. Một\nb. Hai\nc. Ba\nc. Ba')
    expect(questions[0].options).toHaveLength(3)
    expect(correctTexts(questions[0])).toEqual(['Ba'])
  })

  it('bỏ rác của mỗi trang (ngày giờ, link, số trang, tiêu đề Quizlet kể cả khi bị tách chữ)', () => {
    const text = `
11/1/26, 2:07 PM Thẻ ghi nhớ: MLN122 | Quizlet
Câu một?
A. Một
B. Hai
B
https://quizlet.com/vn/1111056039/mln122-flash-cards/?funnelUUID=3
12/159
T h ẻ g h i n h ớ : M L N 1 2 2 | Q u i z l e t
Câu hai?
A. Có
B. Không
A
`
    const { questions, rejected } = parse(text)
    expect(questions).toHaveLength(2)
    expect(rejected).toHaveLength(0)
    expect(questions[0].options[1].text).toBe('Hai')
  })

  it('gán id theo thứ tự', () => {
    const { questions } = parse('Một?\nA. a\nB. b\nA\nHai?\nA. a\nB. b\nB')
    expect(questions.map((q) => q.id)).toEqual(['t-001', 't-002'])
  })
})

describe('parseRawExam - thẻ lỗi không bị bỏ qua âm thầm', () => {
  it('thiếu dòng đáp án: giữ lại và đánh dấu uncertain', () => {
    const { questions } = parse('Câu không có đáp án?\nA. Một\nB. Hai\n\nCâu sau?\nA. Có\nB. Không\nB')
    expect(questions).toHaveLength(2)
    expect(questions[0].uncertain).toBe(true)
    expect(questions[0].issues.join()).toMatch(/Không tìm thấy đáp án đúng/)
    expect(questions[1].uncertain).toBe(false)
  })

  it('đáp án bị cắt cụt bằng "..." được đánh dấu', () => {
    const { questions } = parse('Quan điểm nào?\nA. Một\nB. Đảng, hiến pháp, các chủ trương của...\nC. Ba\nC')
    expect(questions[0].uncertain).toBe(true)
    expect(questions[0].issues.join()).toMatch(/cắt cụt/)
  })

  it('thẻ đảo mặt (dòng đáp án nằm giữa câu hỏi và đáp án) được đánh dấu nhưng vẫn lấy được đáp án', () => {
    const { questions } = parse('Để làm rõ vai trò, tư bản chia thành?\nB. Tư bản bất biến và khả biến\n\nA. Độc quyền và nhà nước\nB. Tư bản bất biến và khả biến\nC. Cố định và lưu động')
    expect(questions).toHaveLength(1)
    expect(questions[0].uncertain).toBe(true)
    expect(correctTexts(questions[0])).toEqual(['Tư bản bất biến và khả biến'])
  })

  it('mất nhãn một đáp án (B) thì chèn đáp án trống và đánh dấu', () => {
    const { questions } = parse('Quan điểm nào?\nA. Một\nC. Đáp án ba\nD. Đáp án bốn\nD')
    expect(questions[0].options.map((o) => o.text)).toEqual(['Một', '', 'Đáp án ba', 'Đáp án bốn'])
    expect(questions[0].uncertain).toBe(true)
  })

  it('đề ghi "chọn 3" nhưng chỉ tìm được 2 đáp án đúng thì cảnh báo', () => {
    const { questions } = parse('Chọn 3 phương án đúng\nA. a\nB. b\nC. c\nD. d\nA B')
    expect(questions[0].uncertain).toBe(true)
    expect(questions[0].issues.join()).toMatch(/chọn 3/)
  })

  it('khối văn bản không có đáp án (tiêu đề) được đưa vào rejected, không mất', () => {
    const { questions, rejected } = parse('Tiêu đề của file\n\nCâu một?\nA. a\nB. b\nA')
    expect(questions).toHaveLength(1)
    expect(rejected).toHaveLength(1)
    expect(rejected[0].raw).toBe('Tiêu đề của file')
  })

  it('thẻ chỉ có 1 đáp án thì đưa vào rejected', () => {
    const { questions, rejected } = parse('Câu hỏi?\nA. Chỉ một đáp án\n\nCâu hai?\nA. a\nB. b\nA')
    expect(questions).toHaveLength(1)
    expect(rejected).toHaveLength(1)
  })
})

describe('mergeDuplicates / slugify', () => {
  it('gộp câu cùng câu hỏi và cùng đáp án', () => {
    const { questions } = parse('Câu một?\nA. a\nB. b\nA\nCâu một?\nA. a\nB. b\nA\nCâu hai?\nA. a\nB. b\nB')
    const merged = mergeDuplicates(questions)
    expect(merged.questions).toHaveLength(2)
    expect(merged.removed).toBe(1)
  })

  it('cùng câu hỏi nhưng khác đáp án thì giữ cả hai', () => {
    const { questions } = parse('Câu một?\nA. a\nB. b\nA\nCâu một?\nA. a\nB. khác\nA')
    expect(mergeDuplicates(questions).questions).toHaveLength(2)
  })

  it('tạo mã môn từ tên', () => {
    expect(slugify('MLN122 - Kinh tế chính trị Mác-Lênin')).toBe('mln122-kinh-te-chinh-tri-mac-lenin')
    expect(slugify('Đề số 1')).toBe('de-so-1')
  })
})

describe('pageToText (PDF 2 cột kiểu Quizlet)', () => {
  const item = (x, y, str) => ({ str, transform: [1, 0, 0, 1, x, y] })

  it('ghép cột trái (câu hỏi + đáp án) với cột phải (đáp án đúng) theo từng thẻ', () => {
    const items = [
      item(52, 732, 'Câu một?'), item(52, 712, 'A. Một'), item(52, 693, 'B. Hai'), item(277, 732, 'B. Hai'),
      item(52, 640, 'Câu hai?'), item(52, 621, 'A. Có'), item(52, 602, 'B. Không'), item(277, 640, 'A. Có'),
      item(52, 550, 'Câu ba?'), item(52, 531, 'A. X'), item(52, 512, 'B. Y'), item(277, 550, 'B. Y'),
    ]
    const { questions } = parse(pageToText(items, 612))
    expect(questions).toHaveLength(3)
    expect(correctTexts(questions[0])).toEqual(['Hai'])
    expect(correctTexts(questions[1])).toEqual(['Có'])
    expect(correctTexts(questions[2])).toEqual(['Y'])
  })

  it('thẻ bị đảo mặt (cột trái là đáp án, cột phải là câu hỏi) vẫn ra đúng thứ tự', () => {
    const items = [
      item(52, 732, 'Câu một?'), item(52, 712, 'A. Một'), item(52, 693, 'B. Hai'), item(277, 732, 'B. Hai'),
      item(52, 640, 'A. Đáp án đúng của câu hai'),
      item(277, 640, 'Câu hai?'), item(277, 621, 'A. Đáp án đúng của câu hai'), item(277, 602, 'B. Sai'),
      item(52, 550, 'Câu ba?'), item(52, 531, 'A. X'), item(52, 512, 'B. Y'), item(277, 550, 'A. X'),
    ]
    const { questions } = parse(pageToText(items, 612))
    expect(questions).toHaveLength(3)
    expect(questions[1].question).toBe('Câu hai?')
    expect(correctTexts(questions[1])).toEqual(['Đáp án đúng của câu hai'])
    expect(questions[1].uncertain).toBe(false)
  })
})
