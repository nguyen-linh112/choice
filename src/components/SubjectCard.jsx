import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Space, Tag, Typography } from 'antd'
import { loadHistory, loadProgress, loadWrongList } from '../utils/storage.js'
import { computeSubjectStats } from '../utils/stats.js'

// Thẻ 1 môn trên trang chủ: tên, tổng số câu, số câu theo trạng thái, câu sai, điểm lần thi gần nhất
export default function SubjectCard({ subject }) {
  const stats = useMemo(
    () => computeSubjectStats(subject, loadProgress(subject.id), loadWrongList(subject.id), loadHistory(subject.id)),
    [subject],
  )

  return (
    <Card
      title={<span>{subject.name}{subject.source === 'user' && <Tag style={{ marginLeft: 8 }}>Tự thêm</Tag>}</span>}
      extra={
        <Link to={`/subject/${subject.id}`}>
          <Button type="primary">Vào học</Button>
        </Link>
      }
    >
      <Typography.Paragraph>Tổng số: <b>{stats.total}</b> câu</Typography.Paragraph>
      <Space size={[4, 8]} wrap>
        <Tag color="green">Đã thuộc: {stats.known}</Tag>
        <Tag color="orange">Chưa thuộc: {stats.unknown}</Tag>
        <Tag>Chưa học: {stats.unseen}</Tag>
        <Tag color="red">Đang sai: {stats.wrongCount}</Tag>
        <Tag color="blue">Thi gần nhất: {stats.lastScore === null ? 'chưa thi' : `${stats.lastScore}/10`}</Tag>
      </Space>
    </Card>
  )
}
