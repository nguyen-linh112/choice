// Thêm câu "lao động phức tạp" bị dính vào câu mln122-093 khi tách từ PDF (đã đối chiếu PDF gốc).
import fs from 'node:fs'
const file = new URL('../public/data/mln122.json', import.meta.url)
const d = JSON.parse(fs.readFileSync(file, 'utf8'))
if (!d.questions.some((q) => q.id === 'mln122-464')) {
  d.questions.push({
    id: 'mln122-464',
    question: 'Mệnh đề nào sau đây là ý không đúng về lao động phức tạp?',
    note: 'Thẻ này bị dính vào câu mln122-093 khi tách từ PDF nên được tách riêng thành câu mới. Đáp án (ý c) lấy theo PDF gốc.',
    options: [
      { text: 'Trong cùng một thời gian lao động, lao động phức tạp tạo ra nhiều giá trị hơn lao động giản đơn', correct: false, explain: 'Ý này đúng nên không chọn vì lao động phức tạp là lao động giản đơn được nhân bội lên nên tạo ra nhiều giá trị hơn trong cùng một thời gian.' },
      { text: 'Lao động phức tạp là lao động giản đơn nhân bội lên', correct: false, explain: 'Ý này đúng nên không chọn vì khi trao đổi, một giờ lao động phức tạp được quy đổi thành nhiều giờ lao động giản đơn.' },
      { text: 'Lao động phức tạp là lao động trí tuệ của người lao động có trình độ cao', correct: true, explain: 'Đây là ý sai cần chọn vì lao động phức tạp được xác định là lao động phải trải qua đào tạo, huấn luyện; nó không đồng nhất với lao động trí tuệ (có thể là lao động chân tay có tay nghề cao).' },
      { text: 'Lao động phức tạp là lao động trải qua đào tạo, huấn luyện', correct: false, explain: 'Ý này đúng nên không chọn vì đây chính là đặc điểm xác định lao động phức tạp so với lao động giản đơn.' },
    ],
  })
  fs.writeFileSync(file, JSON.stringify(d, null, 2) + '\n')
  console.log('Đã thêm mln122-464')
}
