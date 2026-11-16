import { Link } from 'react-router-dom'
import { Button, Empty, List, Tag, Typography } from 'antd'
import SubjectGate from '../components/SubjectGate.jsx'
import { loadHistory } from '../utils/storage.js'
import { formatDuration } from '../utils/exam.js'

export default function HistoryPage() {
  return <SubjectGate>{(subject) => <HistoryView subject={subject} />}</SubjectGate>
}

function HistoryView({ subject }) {
  const history = [...loadHistory(subject.id)].reverse() // mới nhất lên đầu

  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>Lịch sử thi</Typography.Title>
      <Typography.Paragraph type="secondary">
        <Link to={`/subject/${subject.id}`}>{subject.name}</Link>
      </Typography.Paragraph>

      {history.length === 0 ? (
        <Empty description="Bạn chưa thi lần nào.">
          <Link to={`/subject/${subject.id}/exam`}><Button type="primary">Thi thử ngay</Button></Link>
        </Empty>
      ) : (
        <List
          bordered
          dataSource={history}
          renderItem={(e) => (
            <List.Item
              actions={[<Link key="v" to={`/subject/${subject.id}/history/${e.id}`}><Button size="small">Xem lại</Button></Link>]}
            >
              <List.Item.Meta
                title={new Date(e.date).toLocaleString('vi-VN')}
                description={`${e.correct}/${e.total} câu đúng · ${formatDuration(e.seconds)}`}
              />
              <Tag color={e.score >= 5 ? 'green' : 'red'} style={{ fontSize: 16 }}>{e.score}/10</Tag>
            </List.Item>
          )}
        />
      )}
    </>
  )
}
