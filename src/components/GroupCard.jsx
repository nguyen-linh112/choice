import { Link } from 'react-router-dom'
import { Button, Card, Space, Tag, Typography } from 'antd'

// Thẻ của môn có nhiều đề: mỗi đề liệt kê các mục (Nghe / Trắc nghiệm / Đọc...), bấm vào mục để ôn / thi.
export default function GroupCard({ group }) {
  return (
    <Card title={group.name} size="small">
      {group.sets.map((set) => (
        <div key={set.id} style={{ marginBottom: 12 }}>
          <Typography.Text strong>{set.name}</Typography.Text>
          <div style={{ marginTop: 6 }}>
            <Space wrap>
              {set.sections.map((sec) =>
                sec.subjectId ? (
                  <Link key={sec.key} to={`/subject/${sec.subjectId}`}>
                    <Button type="primary" ghost>{sec.label} ({sec.count} câu)</Button>
                  </Link>
                ) : (
                  <Button key={sec.key} disabled>{sec.label} <Tag style={{ marginLeft: 4, marginRight: 0 }}>chưa có đề</Tag></Button>
                ),
              )}
            </Space>
          </div>
        </div>
      ))}
    </Card>
  )
}
