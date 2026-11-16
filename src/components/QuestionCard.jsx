import { Alert, Button, Checkbox, Radio, Space, Tag, Typography } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { optionLabel } from '../utils/stats.js'
import { countCorrect, gradeQuestion } from '../utils/grade.js'
import ExplanationPanel from './ExplanationPanel.jsx'
import QuestionNote from './QuestionNote.jsx'

// Thẻ làm 1 câu. Dùng ở 3 nơi:
//  - Ôn tập: selected = mảng chỉ số đáp án đang chọn; answered = đã khóa và hiện đáp án chưa.
//    Câu 1 đáp án đúng: bấm là khóa luôn (cha xử lý). Câu nhiều đáp án: chọn xong bấm "Kiểm tra".
//  - Thi thử (examMode): luôn đổi được đáp án, KHÔNG hiện đúng sai và KHÔNG hiện giải thích.
//  - Xem lại kết quả: truyền answered=true và selected = lựa chọn đã lưu (onToggle không dùng).
export default function QuestionCard({ subjectId, question, selected, answered, onToggle, onCheck, onReveal, examMode = false }) {
  const correctCount = countCorrect(question)
  const isMulti = correctCount > 1
  const Control = isMulti ? Checkbox : Radio
  const reveal = answered && !examMode // có hiện đúng/sai + giải thích không
  const isRight = reveal && gradeQuestion(question, selected)
  const interactive = examMode || !answered

  return (
    <div>
      <Typography.Paragraph strong style={{ fontSize: 16 }}>
        {question.question}
      </Typography.Paragraph>

      {isMulti && (
        <Tag color="purple" style={{ marginBottom: 8 }}>
          Chọn {correctCount} đáp án
        </Tag>
      )}

      {question.options.map((o, i) => {
        const picked = selected.includes(i)
        // Quy tắc tô màu sau khi trả lời: đáp án đúng => xanh; đáp án mình chọn mà sai => đỏ
        let state = ''
        if (reveal) state = o.correct ? 'correct' : picked ? 'wrong' : ''
        else if (picked) state = 'selected'

        return (
          <div
            key={i}
            className={`option-row ${interactive ? 'clickable' : ''} ${state}`}
            onClick={() => interactive && onToggle && onToggle(i)}
          >
            <Control checked={picked} style={{ pointerEvents: 'none' }} />
            <div style={{ flex: 1 }}>
              <div>
                <span className="option-label">{optionLabel(i)}.</span> {o.text}
              </div>
              {reveal && <ExplanationPanel subjectId={subjectId} questionId={question.id} option={o} />}
            </div>
            {reveal && o.correct && <CheckCircleFilled style={{ color: '#52c41a' }} />}
            {reveal && !o.correct && picked && <CloseCircleFilled style={{ color: '#ff4d4f' }} />}
          </div>
        )
      })}

      {!answered && !examMode && (
        <Space wrap style={{ marginTop: 4 }}>
          {isMulti && (
            <Button type="primary" disabled={selected.length === 0} onClick={onCheck}>
              Kiểm tra
            </Button>
          )}
          <Button type="link" onClick={onReveal}>
            Xem đáp án
          </Button>
        </Space>
      )}

      {reveal && (
        <Alert
          style={{ marginTop: 8 }}
          type={isRight ? 'success' : 'error'}
          showIcon
          message={isRight ? 'Chính xác!' : selected.length === 0 ? 'Đáp án đúng được tô xanh.' : 'Chưa đúng. Đáp án đúng được tô xanh.'}
        />
      )}

      {reveal && <QuestionNote subjectId={subjectId} question={question} />}
    </div>
  )
}
