import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Empty, Popconfirm, Progress, Space, Tag, Typography } from 'antd'
import SubjectGate from '../components/SubjectGate.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import { loadWrongList, saveWrongList } from '../utils/storage.js'
import { removeFromWrongList, sortedWrongIds, STREAK_TO_LEAVE } from '../utils/wrongList.js'
import { shuffleDeck } from '../utils/deck.js'
import { countCorrect } from '../utils/grade.js'

export default function WrongPage() {
  return <SubjectGate>{(subject) => <WrongView key={subject.id} subject={subject} />}</SubjectGate>
}

const EMPTY_ANSWER = { selected: [], answered: false }

// Ôn lại nhanh toàn bộ câu sai theo kiểu thẻ. Trả lời đúng ở đây KHÔNG tính vào "3 lần liên tiếp"
// (chỉ thi thử mới tính), vì đây chỉ là xem lại.
function WrongView({ subject }) {
  const byId = useMemo(() => new Map(subject.questions.map((q) => [q.id, q])), [subject])
  const [list, setList] = useState(() => loadWrongList(subject.id))
  // Bộ thẻ sắp theo số lần sai giảm dần. Giữ trong state để xáo trộn được và để xóa 1 câu không làm nhảy thẻ.
  const [deck, setDeck] = useState(() => sortedWrongIds(list).filter((id) => byId.has(id)).map((id) => byId.get(id)))
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState(EMPTY_ANSWER)

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
  const info = list[question.id]
  const isMulti = countCorrect(question) > 1

  const go = (n) => {
    setIndex(Math.max(0, Math.min(n, deck.length - 1)))
    setAnswer(EMPTY_ANSWER)
  }

  const onToggle = (n) => {
    if (answer.answered) return
    if (!isMulti) return setAnswer({ selected: [n], answered: true })
    setAnswer((a) => ({ ...a, selected: a.selected.includes(n) ? a.selected.filter((x) => x !== n) : [...a.selected, n] }))
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
        <Link to={`/subject/${subject.id}`}>{subject.name}</Link> · Chỉ để xem lại, trả lời ở đây không tính vào {STREAK_TO_LEAVE} lần đúng liên tiếp.
      </Typography.Paragraph>

      <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
        <Typography.Text strong>{i + 1} / {deck.length}</Typography.Text>
        <Tag color="red">Sai {info.wrongCount} lần · Đúng liên tiếp {info.streak}/{STREAK_TO_LEAVE}</Tag>
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
          onCheck={() => setAnswer((a) => ({ ...a, answered: true }))}
          onReveal={() => setAnswer((a) => ({ ...a, answered: true }))}
        />
      </Card>

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
