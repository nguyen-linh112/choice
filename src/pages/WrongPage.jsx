import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Card, Empty, Popconfirm, Progress, Space, Tag, Typography } from 'antd'
import SubjectGate from '../components/SubjectGate.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import { loadWrongList, saveWrongList } from '../utils/storage.js'
import { removeFromWrongList, sortedWrongIds, STREAK_TO_LEAVE, updateWrongList } from '../utils/wrongList.js'
import { shuffleDeck } from '../utils/deck.js'
import { countCorrect, gradeQuestion } from '../utils/grade.js'

export default function WrongPage() {
  return <SubjectGate>{(subject) => <WrongView key={subject.id} subject={subject} />}</SubjectGate>
}

const EMPTY_ANSWER = { selected: [], answered: false }

// Ôn lại nhanh toàn bộ câu sai theo kiểu thẻ. Trả lời ở đây CÓ tính vào "3 lần đúng liên tiếp" (giống thi thử):
// đúng thì chuỗi +1 (đủ 3 thì ra khỏi danh sách), sai thì chuỗi về 0 và số lần sai +1.
// Mỗi câu chỉ tính lần trả lời đầu tiên trong 1 lượt ôn (bấm Trước/Sau quay lại làm lại thì không tính thêm).
// Bấm "Xem đáp án" mà không chọn gì thì không tính.
function WrongView({ subject }) {
  const byId = useMemo(() => new Map(subject.questions.map((q) => [q.id, q])), [subject])
  const [list, setList] = useState(() => loadWrongList(subject.id))
  // Bộ thẻ sắp theo số lần sai giảm dần. Giữ trong state để xáo trộn được và để xóa 1 câu không làm nhảy thẻ.
  const [deck, setDeck] = useState(() => sortedWrongIds(list).filter((id) => byId.has(id)).map((id) => byId.get(id)))
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState(EMPTY_ANSWER)
  const [counted, setCounted] = useState({}) // { [id]: { correct, left, info } } câu đã tính trong lượt này

  if (deck.length === 0) {
    return (
      <>
        <Typography.Title level={3}>Ôn câu sai</Typography.Title>
        <Card>
          <Empty description="Bạn chưa có câu sai nào. Hãy làm một bài thi thử, các câu sai hoặc bỏ trống sẽ hiện ở đây.">
            <Space>
              <Link to={`/subject/${subject.id}/exam`}><Button type="primary">Thi thử</Button></Link>
              <Link to={`/subject/${subject.id}`}><Button>Về môn học</Button></Link>
            </Space>
          </Empty>
        </Card>
      </>
    )
  }

  const i = Math.min(index, deck.length - 1)
  const question = deck[i]
  const done = counted[question.id] // đã tính lần trả lời đầu của câu này
  const info = list[question.id] || done?.info
  const isMulti = countCorrect(question) > 1

  const go = (n) => {
    setIndex(Math.max(0, Math.min(n, deck.length - 1)))
    setAnswer(EMPTY_ANSWER)
  }

  // Ghi kết quả 1 lần trả lời vào danh sách câu sai (chỉ lần đầu của mỗi câu trong lượt ôn)
  const record = (selected) => {
    if (counted[question.id] || selected.length === 0) return
    const correct = gradeQuestion(question, selected)
    const next = updateWrongList(list, [{ id: question.id, correct }])
    const left = !next[question.id]
    setCounted((c) => ({ ...c, [question.id]: { correct, left, info: next[question.id] || { ...list[question.id], streak: STREAK_TO_LEAVE } } }))
    setList(next)
    saveWrongList(subject.id, next)
  }

  const onToggle = (n) => {
    if (answer.answered) return
    if (!isMulti) {
      setAnswer({ selected: [n], answered: true })
      record([n])
      return
    }
    setAnswer((a) => ({ ...a, selected: a.selected.includes(n) ? a.selected.filter((x) => x !== n) : [...a.selected, n] }))
  }

  const onCheck = () => {
    setAnswer((a) => ({ ...a, answered: true }))
    record(answer.selected)
  }

  const shuffleNow = () => {
    setDeck(shuffleDeck(deck))
    setIndex(0)
    setAnswer(EMPTY_ANSWER)
  }

  // Bỏ thủ công 1 câu khỏi danh sách
  const removeCurrent = () => {
    const next = removeFromWrongList(list, question.id)
    setList(next)
    saveWrongList(subject.id, next)
    setDeck(deck.filter((q) => q.id !== question.id))
    setAnswer(EMPTY_ANSWER)
  }

  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>Ôn câu sai</Typography.Title>
      <Typography.Paragraph type="secondary">
        <Link to={`/subject/${subject.id}`}>{subject.name}</Link> · Trả lời đúng {STREAK_TO_LEAVE} lần liên tiếp thì câu được bỏ khỏi danh sách; trả lời sai thì phải đếm lại từ đầu.
      </Typography.Paragraph>

      <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
        <Typography.Text strong>{i + 1} / {deck.length}</Typography.Text>
        <Tag color={done?.left ? 'green' : 'red'}>Sai {info.wrongCount} lần · Đúng liên tiếp {info.streak}/{STREAK_TO_LEAVE}</Tag>
      </Space>
      <Progress percent={Math.round((i / deck.length) * 100)} showInfo={false} size="small" />

      <Card style={{ marginTop: 8 }}>
        <QuestionCard
          key={question.id}
          subjectId={subject.id}
          question={question}
          selected={answer.selected}
          answered={answer.answered}
          onToggle={onToggle}
          onCheck={onCheck}
          onReveal={() => setAnswer((a) => ({ ...a, answered: true }))}
        />
      </Card>

      {done?.left && (
        <Alert style={{ marginTop: 8 }} type="success" showIcon message={`Đúng ${STREAK_TO_LEAVE} lần liên tiếp rồi, câu này đã được bỏ khỏi danh sách câu sai.`} />
      )}

      <Space wrap style={{ marginTop: 12 }}>
        <Button disabled={i === 0} onClick={() => go(i - 1)}>Trước</Button>
        <Button disabled={i === deck.length - 1} onClick={() => go(i + 1)}>Sau</Button>
        <Button onClick={shuffleNow}>Xáo trộn</Button>
        <Popconfirm title="Bỏ câu này khỏi danh sách câu sai?" okText="Bỏ khỏi danh sách" cancelText="Hủy" onConfirm={removeCurrent}>
          <Button danger>Bỏ khỏi danh sách</Button>
        </Popconfirm>
      </Space>
    </>
  )
}
