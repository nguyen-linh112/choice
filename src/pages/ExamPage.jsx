import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Popconfirm, Space, Tag, Typography } from 'antd'
import SubjectGate from '../components/SubjectGate.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import QuestionNavigator from '../components/QuestionNavigator.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import { pickExamQuestions } from '../utils/pickExamQuestions.js'
import { getExamConfig } from '../utils/examConfig.js'
import { gradeExam, materializeItem, remainingSeconds } from '../utils/exam.js'
import { countCorrect } from '../utils/grade.js'
import { updateWrongList } from '../utils/wrongList.js'
import {
  clearExamSession, loadExamSession, loadHistory, loadSeen, loadSettings, loadWrongList,
  saveExamSession, saveHistory, saveSeen, saveWrongList,
} from '../utils/storage.js'

export default function ExamPage() {
  return <SubjectGate>{(subject) => <ExamView key={subject.id} subject={subject} />}</SubjectGate>
}

// Đọc bài thi dở từ localStorage; bỏ các câu đã bị xóa khỏi đề. Hết câu thì coi như không có.
function restoreSession(subject, byId) {
  const s = loadExamSession(subject.id)
  if (!s) return null
  const items = s.items.filter((it) => byId.has(it.id))
  if (items.length === 0) {
    clearExamSession(subject.id)
    return null
  }
  return { ...s, items, current: Math.min(s.current || 0, items.length - 1) }
}

function ExamView({ subject }) {
  const navigate = useNavigate()
  const byId = useMemo(() => new Map(subject.questions.map((q) => [q.id, q])), [subject])
  const config = getExamConfig(subject, loadSettings(subject.id))
  const [session, setSession] = useState(() => restoreSession(subject, byId))

  // Dùng ref để hàm nộp bài (gọi từ đồng hồ) luôn thấy bài làm mới nhất
  const sessionRef = useRef(session)
  sessionRef.current = session
  const submittedRef = useRef(false)

  // Tự lưu bài đang làm: tải lại trang vẫn khôi phục được bài làm và vị trí.
  // Phải bỏ qua sau khi đã nộp, nếu không bài dở bị ghi lại và lần mở sau lại bị nộp thêm một lần nữa.
  useEffect(() => {
    if (session && !submittedRef.current) saveExamSession(subject.id, session)
  }, [subject.id, session])

  const submit = useCallback(() => {
    const s = sessionRef.current
    if (!s || submittedRef.current) return
    submittedRef.current = true // chặn nộp 2 lần (hết giờ + bấm nộp cùng lúc)

    const now = Date.now()
    const graded = gradeExam(s.items, byId, s.answers)
    const entry = {
      id: String(now),
      date: now,
      score: graded.score,
      correct: graded.correct,
      total: graded.total,
      seconds: Math.min(s.durationSeconds, Math.max(0, Math.round((now - s.startedAt) / 1000))),
      items: s.items.map((it) => ({ ...it, selected: s.answers[it.id] || [] })),
    }
    saveHistory(subject.id, [...loadHistory(subject.id), entry])

    // Cập nhật danh sách câu sai: sai hoặc bỏ trống = sai; đúng thì tăng chuỗi đúng liên tiếp
    const results = graded.results.map((r) => ({ id: r.id, correct: r.status === 'correct' }))
    saveWrongList(subject.id, updateWrongList(loadWrongList(subject.id), results, now))

    // Ghi nhớ các câu đã xuất hiện để lần sau ưu tiên câu chưa gặp
    const seen = { ...loadSeen(subject.id) }
    s.items.forEach((it) => (seen[it.id] = now))
    saveSeen(subject.id, seen)

    clearExamSession(subject.id)
    navigate(`/subject/${subject.id}/history/${entry.id}`, { replace: true })
  }, [byId, navigate, subject.id])

  // Mở lại trang mà bài thi đã quá giờ => tự nộp
  useEffect(() => {
    if (session && remainingSeconds(session) <= 0) submit()
  }, [session, submit])

  const start = () => {
    const items = pickExamQuestions({
      questions: subject.questions,
      wrongList: loadWrongList(subject.id),
      seen: loadSeen(subject.id),
      questionCount: config.questionCount,
      wrongTarget: config.wrongCount,
    })
    setSession({ startedAt: Date.now(), durationSeconds: config.durationMinutes * 60, items, answers: {}, flagged: [], current: 0 })
  }

  // ---------- màn hình bắt đầu ----------
  if (!session) {
    const wrongCount = Object.keys(loadWrongList(subject.id)).filter((id) => byId.has(id)).length
    return (
      <>
        <Typography.Title level={3} style={{ marginBottom: 4 }}>Thi thử</Typography.Title>
        <Typography.Paragraph type="secondary">
          <Link to={`/subject/${subject.id}`}>{subject.name}</Link>
        </Typography.Paragraph>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Text>
              Đề gồm <b>{config.questionCount}</b> câu, thời gian <b>{config.durationMinutes}</b> phút.
            </Typography.Text>
            <Typography.Text type="secondary">
              Khoảng {Math.min(config.wrongCount, wrongCount, Math.floor(config.questionCount / 2))} câu lấy từ danh sách câu sai của bạn
              (hiện có {wrongCount} câu), phần còn lại là câu mới. Trong lúc làm sẽ không hiện đúng sai và không hiện giải thích.
            </Typography.Text>
            <Space wrap>
              <Button type="primary" size="large" onClick={start}>Bắt đầu thi</Button>
              <Link to={`/subject/${subject.id}/settings`}><Button>Đổi số câu / thời gian</Button></Link>
            </Space>
          </Space>
        </Card>
      </>
    )
  }

  // ---------- màn hình đang làm bài ----------
  const { items, answers, flagged, current } = session
  const item = items[current]
  const question = materializeItem(item, byId)
  const selected = answers[item.id] || []
  const isMulti = countCorrect(question) > 1
  const unanswered = items.filter((it) => (answers[it.id] || []).length === 0).length

  const update = (patch) => setSession((s) => ({ ...s, ...patch }))

  const toggle = (i) => {
    setSession((s) => {
      const cur = s.answers[item.id] || []
      // Câu nhiều đáp án: bật/tắt từng đáp án. Câu 1 đáp án: chọn lại là đổi sang đáp án mới.
      const next = isMulti ? (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]) : [i]
      return { ...s, answers: { ...s.answers, [item.id]: next } }
    })
  }

  const toggleFlag = () =>
    update({ flagged: flagged.includes(item.id) ? flagged.filter((id) => id !== item.id) : [...flagged, item.id] })

  return (
    <>
      <Space style={{ width: '100%', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, background: 'var(--page-bg)', padding: '8px 0' }} wrap>
        <CountdownTimer startedAt={session.startedAt} durationSeconds={session.durationSeconds} onExpire={submit} />
        <Popconfirm
          title="Nộp bài?"
          description={unanswered > 0 ? `Bạn còn ${unanswered} câu chưa làm.` : 'Bạn đã làm hết các câu.'}
          okText="Nộp bài"
          cancelText="Làm tiếp"
          onConfirm={submit}
        >
          <Button type="primary" danger>Nộp bài</Button>
        </Popconfirm>
      </Space>

      <Card size="small" style={{ marginBottom: 12 }}>
        <QuestionNavigator items={items} answers={answers} flagged={flagged} current={current} onGo={(i) => update({ current: i })} />
      </Card>

      <Card>
        <Typography.Text type="secondary">Câu {current + 1} / {items.length}</Typography.Text>
        {flagged.includes(item.id) && <Tag color="orange" style={{ marginLeft: 8 }}>Đánh dấu xem lại</Tag>}
        <div style={{ marginTop: 8 }}>
          <QuestionCard key={item.id} subjectId={subject.id} question={question} selected={selected} answered={false} examMode onToggle={toggle} />
        </div>
      </Card>

      <Space wrap style={{ marginTop: 12 }}>
        <Button disabled={current === 0} onClick={() => update({ current: current - 1 })}>Trước</Button>
        <Button disabled={current === items.length - 1} onClick={() => update({ current: current + 1 })}>Sau</Button>
        <Button onClick={toggleFlag}>{flagged.includes(item.id) ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'}</Button>
      </Space>

      <Alert style={{ marginTop: 16 }} type="info" showIcon message="Bài làm được lưu tự động. Tải lại trang vẫn giữ nguyên bài làm và thời gian còn lại." />
    </>
  )
}
