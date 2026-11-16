import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Empty, Popconfirm, Progress, Result, Segmented, Space, Spin, Tag, Typography } from 'antd'
import { useSubjects } from '../hooks/useSubjects.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { filterBySet, restoreIndex, shuffleDeck } from '../utils/deck.js'
import { computeSubjectStats } from '../utils/stats.js'
import QuestionCard from '../components/QuestionCard.jsx'

const EMPTY_ANSWER = { selected: [], answered: false }

const SET_NAMES = { all: 'Tất cả', known: 'Đã thuộc', unknown: 'Chưa thuộc' }
const EMPTY_TEXT = {
  all: 'Môn này chưa có câu hỏi nào.',
  known: 'Bạn chưa đánh dấu câu nào là "Đã thuộc". Hãy ôn ở bộ "Tất cả" và bấm "Thuộc bài", các câu đó sẽ hiện ở đây.',
  unknown: 'Bạn chưa có câu nào ở mục "Chưa thuộc". Khi bấm "Chưa thuộc" ở bộ "Tất cả", các câu đó sẽ hiện ở đây.',
}

// Bọc ngoài: tìm môn theo id trên địa chỉ. Dùng key để đổi môn là tạo lại toàn bộ state.
export default function StudyPage() {
  const { subjectId } = useParams()
  const { subjects, loading } = useSubjects()
  const subject = subjects.find((s) => s.id === subjectId)

  if (loading) return <Spin style={{ display: 'block', marginTop: 48 }} />
  if (!subject) {
    return <Result status="404" title="Không tìm thấy môn học" extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />
  }
  return <StudyView key={subject.id} subject={subject} />
}

function StudyView({ subject }) {
  const { progress, setStatus, setLast, reset } = useProgress(subject.id)

  // view = bộ thẻ đang ôn. deck được "đóng băng" khi vào bộ: đổi trạng thái 1 câu
  // (vd Đã thuộc -> Chưa thuộc) không làm câu đó biến mất giữa chừng.
  const [view, setView] = useState(() => {
    const deck = filterBySet(subject.questions, progress.status, 'all')
    return { set: 'all', shuffled: false, deck, index: restoreIndex(deck, progress.last.all) }
  })
  const [answer, setAnswer] = useState(EMPTY_ANSWER)

  const { deck, index, set } = view
  const question = deck[index] // undefined khi đã ôn hết bộ
  const stats = computeSubjectStats(subject, progress, {}, [])

  // ---- điều hướng ----
  const goTo = (i) => {
    const next = Math.max(0, Math.min(i, deck.length)) // deck.length = màn hình "đã hết bộ"
    setView((v) => ({ ...v, index: next }))
    setAnswer(EMPTY_ANSWER)
    setLast(set, deck[next]?.id ?? null)
  }

  const changeSet = (newSet) => {
    const newDeck = filterBySet(subject.questions, progress.status, newSet)
    setView({ set: newSet, shuffled: false, deck: newDeck, index: restoreIndex(newDeck, progress.last[newSet]) })
    setAnswer(EMPTY_ANSWER)
  }

  const shuffleNow = () => {
    const newDeck = shuffleDeck(deck)
    setView({ set, shuffled: true, deck: newDeck, index: 0 })
    setAnswer(EMPTY_ANSWER)
    setLast(set, newDeck[0]?.id ?? null)
  }

  const backToOriginalOrder = () => {
    const newDeck = filterBySet(subject.questions, progress.status, set)
    setView({ set, shuffled: false, deck: newDeck, index: 0 })
    setAnswer(EMPTY_ANSWER)
    setLast(set, newDeck[0]?.id ?? null)
  }

  const resetAll = () => {
    reset()
    setView({ set: 'all', shuffled: false, deck: subject.questions, index: 0 })
    setAnswer(EMPTY_ANSWER)
  }

  // ---- trả lời ----
  const isMulti = question ? question.options.filter((o) => o.correct).length > 1 : false

  const onToggle = (i) => {
    if (answer.answered) return
    if (!isMulti) return setAnswer({ selected: [i], answered: true }) // 1 đáp án: bấm là khóa luôn
    setAnswer((a) => ({
      ...a,
      selected: a.selected.includes(i) ? a.selected.filter((x) => x !== i) : [...a.selected, i],
    }))
  }

  // Bấm "Thuộc bài"/"Chưa thuộc": ghi trạng thái rồi tự sang thẻ kế tiếp
  const rate = (status) => {
    setStatus(question.id, status)
    goTo(index + 1)
  }

  const finished = deck.length > 0 && index >= deck.length

  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>
        Ôn tập
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        <Link to={`/subject/${subject.id}`}>{subject.name}</Link>
      </Typography.Paragraph>

      {/* 3 bộ: Tất cả / Đã thuộc / Chưa thuộc. Vào bộ nào thì ôn lại đúng các câu của bộ đó. */}
      <Segmented
        block
        value={set}
        onChange={changeSet}
        options={[
          { value: 'all', label: `${SET_NAMES.all} (${stats.total})` },
          { value: 'known', label: `${SET_NAMES.known} (${stats.known})` },
          { value: 'unknown', label: `${SET_NAMES.unknown} (${stats.unknown})` },
        ]}
        style={{ marginBottom: 16 }}
      />

      {deck.length === 0 ? (
        <Card>
          <Empty description={EMPTY_TEXT[set]} />
        </Card>
      ) : finished ? (
        <Card>
          <Result
            status="success"
            title={`Bạn đã ôn hết bộ "${SET_NAMES[set]}"`}
            subTitle={`${deck.length} câu. Đã thuộc: ${stats.known} · Chưa thuộc: ${stats.unknown}`}
            extra={[
              <Button key="again" type="primary" onClick={() => goTo(0)}>Ôn lại từ đầu</Button>,
              set !== 'unknown' && stats.unknown > 0 && (
                <Button key="unk" onClick={() => changeSet('unknown')}>Ôn các câu chưa thuộc</Button>
              ),
            ]}
          />
        </Card>
      ) : (
        <>
          <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Typography.Text strong>
              {index + 1} / {deck.length}
            </Typography.Text>
            {progress.status[question.id] === 'known' && <Tag color="green">Đã thuộc</Tag>}
            {progress.status[question.id] === 'unknown' && <Tag color="orange">Chưa thuộc</Tag>}
          </Space>
          <Progress percent={Math.round((index / deck.length) * 100)} showInfo={false} size="small" />

          <Card style={{ marginTop: 8 }}>
            <QuestionCard
              subjectId={subject.id}
              question={question}
              selected={answer.selected}
              answered={answer.answered}
              onToggle={onToggle}
              onCheck={() => setAnswer((a) => ({ ...a, answered: true }))}
              onReveal={() => setAnswer((a) => ({ ...a, answered: true }))}
            />

            {answer.answered && (
              <Space wrap style={{ marginTop: 16 }}>
                <Button type="primary" size="large" style={{ background: '#52c41a' }} onClick={() => rate('known')}>
                  Thuộc bài
                </Button>
                <Button danger size="large" onClick={() => rate('unknown')}>
                  Chưa thuộc
                </Button>
              </Space>
            )}
          </Card>

          <Space wrap style={{ marginTop: 12 }}>
            <Button disabled={index === 0} onClick={() => goTo(index - 1)}>Trước</Button>
            <Button onClick={() => goTo(index + 1)}>Sau</Button>
            <Button onClick={shuffleNow}>Xáo trộn</Button>
            {view.shuffled && <Button type="link" onClick={backToOriginalOrder}>Về thứ tự gốc</Button>}
          </Space>
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <Popconfirm
          title="Đặt lại tiến độ?"
          description="Toàn bộ trạng thái Đã thuộc / Chưa thuộc của môn này sẽ bị xóa."
          okText="Đặt lại"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          onConfirm={resetAll}
        >
          <Button danger type="text">Đặt lại tiến độ</Button>
        </Popconfirm>
      </div>
    </>
  )
}
