import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, List, Result, Segmented, Space, Statistic, Tag, Typography } from 'antd'
import SubjectGate from '../components/SubjectGate.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import { loadHistory } from '../utils/storage.js'
import { formatDuration, gradeExam, materializeItem } from '../utils/exam.js'

export default function ExamResultPage() {
  return <SubjectGate>{(subject) => <ResultView subject={subject} />}</SubjectGate>
}

const STATUS_TAG = {
  correct: <Tag color="green">Đúng</Tag>,
  wrong: <Tag color="red">Sai</Tag>,
  blank: <Tag>Chưa làm</Tag>,
}

function ResultView({ subject }) {
  const { entryId } = useParams()
  const [filter, setFilter] = useState('all')
  const entry = loadHistory(subject.id).find((e) => e.id === entryId)
  const byId = useMemo(() => new Map(subject.questions.map((q) => [q.id, q])), [subject])

  // Chấm lại từ dữ liệu đã lưu (id câu + thứ tự đáp án + lựa chọn)
  const graded = useMemo(() => {
    if (!entry) return null
    const answers = Object.fromEntries(entry.items.map((it) => [it.id, it.selected]))
    return gradeExam(entry.items, byId, answers)
  }, [entry, byId])

  if (!entry) {
    return <Result status="404" title="Không tìm thấy bài thi" extra={<Link to={`/subject/${subject.id}/history`}><Button>Về lịch sử thi</Button></Link>} />
  }

  const statusById = Object.fromEntries(graded.results.map((r) => [r.id, r.status]))
  const rows = entry.items
    .filter((it) => byId.has(it.id))
    .filter((it) => filter === 'all' || (filter === 'wrong' ? statusById[it.id] === 'wrong' : statusById[it.id] === 'blank'))
  const wrongN = graded.results.filter((r) => r.status === 'wrong').length

  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>Kết quả thi thử</Typography.Title>
      <Typography.Paragraph type="secondary">
        <Link to={`/subject/${subject.id}`}>{subject.name}</Link> · {new Date(entry.date).toLocaleString('vi-VN')}
      </Typography.Paragraph>

      <Card>
        <Space size="large" wrap>
          <Statistic title="Điểm (thang 10)" value={entry.score} suffix="/ 10" valueStyle={{ color: entry.score >= 5 ? '#389e0d' : '#cf1322' }} />
          <Statistic title="Số câu đúng" value={`${entry.correct} / ${entry.total}`} />
          <Statistic title="Thời gian làm" value={formatDuration(entry.seconds)} />
        </Space>
        <div style={{ marginTop: 12 }}>
          <Space wrap>
            <Link to={`/subject/${subject.id}/exam`}><Button type="primary">Thi lại (đề mới)</Button></Link>
            <Link to={`/subject/${subject.id}/wrong`}><Button>Ôn câu sai</Button></Link>
            <Link to={`/subject/${subject.id}/history`}><Button type="link">Lịch sử thi</Button></Link>
          </Space>
        </div>
      </Card>

      <Segmented
        block
        style={{ margin: '16px 0' }}
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: `Tất cả (${graded.total})` },
          { value: 'wrong', label: `Câu sai (${wrongN})` },
          { value: 'blank', label: `Chưa làm (${graded.blank})` },
        ]}
      />

      <List
        dataSource={rows}
        locale={{ emptyText: 'Không có câu nào trong mục này.' }}
        pagination={{ pageSize: 10, size: 'small', showSizeChanger: false, hideOnSinglePage: true }}
        renderItem={(it) => {
          const q = materializeItem(it, byId)
          return (
            <Card key={it.id} size="small" style={{ marginBottom: 12 }}>
              <Space wrap style={{ marginBottom: 8 }}>
                <Typography.Text type="secondary">Câu {entry.items.indexOf(it) + 1}</Typography.Text>
                {STATUS_TAG[statusById[it.id]]}
                {it.fromWrong && <Tag color="volcano">Câu sai cũ được hỏi lại</Tag>}
              </Space>
              <QuestionCard subjectId={subject.id} question={q} selected={it.selected} answered />
            </Card>
          )
        }}
      />
    </>
  )
}
