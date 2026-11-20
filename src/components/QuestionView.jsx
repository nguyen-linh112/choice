import { Checkbox, Radio, Tag, Typography } from 'antd'
import { optionLabel } from '../utils/stats.js'
import ExplanationPanel from './ExplanationPanel.jsx'
import QuestionNote from './QuestionNote.jsx'
import AudioPlayer from './AudioPlayer.jsx'
import ScriptPanel from './ScriptPanel.jsx'

// Hiển thị 1 câu hỏi ở chế độ XEM (chưa tương tác): đáp án đúng tô xanh, kèm giải thích (sửa được).
// Câu nhiều đáp án đúng => checkbox + nhãn "Chọn N đáp án"; câu 1 đáp án => radio.
export default function QuestionView({ subjectId, question, index }) {
  const correctCount = question.options.filter((o) => o.correct).length
  const isMulti = correctCount > 1
  const Control = isMulti ? Checkbox : Radio

  return (
    <div>
      {question.audio && <AudioPlayer key={question.audio} src={question.audio} label={question.audioLabel} />}
      <Typography.Paragraph strong style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}>
        {index !== undefined && <span>Câu {index + 1}. </span>}
        {question.question}
      </Typography.Paragraph>

      {isMulti && (
        <Tag color="purple" style={{ marginBottom: 8 }}>
          Chọn {correctCount} đáp án
        </Tag>
      )}

      {question.options.map((o, i) => (
        <div key={i} className={`option-row ${o.correct ? 'correct' : ''}`}>
          <Control checked={o.correct} disabled />
          <div style={{ flex: 1 }}>
            <div>
              <span className="option-label">{optionLabel(i)}.</span> {o.text}
            </div>
            <ExplanationPanel subjectId={subjectId} questionId={question.id} option={o} />
          </div>
        </div>
      ))}

      <ScriptPanel script={question.script} note={question.scriptNote} translation={question.translation} />
      <QuestionNote subjectId={subjectId} question={question} />
    </div>
  )
}
