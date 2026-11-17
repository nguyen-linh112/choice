import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Divider, List, Result, Space, Spin, Statistic, Typography } from 'antd'
import { useSubjects } from '../hooks/useSubjects.jsx'
import { getExamConfig } from '../utils/examConfig.js'
import { loadExamSession, loadHistory, loadProgress, loadSettings, loadWrongList } from '../utils/storage.js'
import { computeSubjectStats } from '../utils/stats.js'
import QuestionView from '../components/QuestionView.jsx'

export default function SubjectPage() {
  const { subjectId } = useParams()
  const { subjects, loading } = useSubjects()
  const [page, setPage] = useState(1)

  const subject = subjects.find((s) => s.id === subjectId)
  const stats = useMemo(
    () => (subject ? computeSubjectStats(subject, loadProgress(subject.id), loadWrongList(subject.id), loadHistory(subject.id)) : null),
    [subject],
  )

  if (loading) return <Spin style={{ display: 'block', marginTop: 48 }} />
  if (!subject) {
    return <Result status="404" title="Không tìm thấy môn học" extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />
  }

  const exam = getExamConfig(subject, loadSettings(subject.id))
  const hasOngoingExam = !!loadExamSession(subject.id)
  const base = `/subject/${subject.id}`

  return (
    <>
      <Typography.Title level={3}>{subject.name}</Typography.Title>

      <Card>
        <Space size="large" wrap>
          <Statistic title="Tổng số câu" value={stats.total} />
          <Statistic title="Đề thi" value={`${exam.questionCount} câu / ${exam.durationMinutes} phút`} />
        </Space>

        <Divider />

        <Space wrap>
          <Link to={`${base}/study`}><Button type="primary" size="large">Ôn tập</Button></Link>
          <Link to={`${base}/exam`}><Button size="large">{hasOngoingExam ? 'Tiếp tục thi (đang làm dở)' : 'Thi thử'}</Button></Link>
          <Link to={`${base}/wrong`}><Button size="large" danger>Ôn câu sai ({stats.wrongCount})</Button></Link>
        </Space>
        <div style={{ marginTop: 12 }}>
          <Space wrap>
            <Link to={`${base}/history`}><Button type="link">Lịch sử thi</Button></Link>
            <Link to={`${base}/settings`}><Button type="link">Cài đặt môn</Button></Link>
          </Space>
        </div>
      </Card>

      <Typography.Title level={4} style={{ marginTop: 24 }}>Xem dữ liệu đề</Typography.Title>
      <Typography.Paragraph type="secondary">
        Danh sách câu hỏi để kiểm tra dữ liệu: đáp án đúng tô xanh, nhãn A/B/C do web tự gắn.
      </Typography.Paragraph>
      <List
        bordered
        dataSource={subject.questions}
        pagination={{ pageSize: 10, current: page, onChange: (p) => { setPage(p); window.scrollTo({ top: 0 }) }, showSizeChanger: false, size: 'small' }}
        renderItem={(q) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <QuestionView subjectId={subject.id} question={q} index={subject.questions.indexOf(q)} />
            </div>
          </List.Item>
        )}
      />
    </>
  )
}
