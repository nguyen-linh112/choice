import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Button, Card, Divider, Input, Result, Space, Spin, Tag, Typography } from 'antd'
import { useSubjects } from '../hooks/useSubjects.jsx'

// Phần Viết: không chấm điểm. Mỗi bài có ô để mình tự điền, bấm "Xem đáp án mẫu" mới hiện đáp án + giải thích cấu trúc.
// Bài viết của mình lưu trong trình duyệt (localStorage), không gửi đi đâu.
const draftKey = (groupId, setId, itemId) => `writing:${groupId}:${setId}:${itemId}`

function readDraft(key) {
  try { return localStorage.getItem(key) || '' } catch { return '' }
}
function writeDraft(key, value) {
  try {
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  } catch { /* trình duyệt chặn lưu thì thôi, vẫn dùng bình thường */ }
}

function WritingItem({ groupId, setId, item, index }) {
  const key = draftKey(groupId, setId, item.id)
  const [text, setText] = useState(() => readDraft(key))
  const [show, setShow] = useState(false)
  const isEssay = item.kind === 'essay'

  return (
    <Card size="small" style={{ marginBottom: 12 }} title={<span>{item.part && <Tag color="blue">{item.part}</Tag>} Bài {index + 1}</span>}>
      <Typography.Paragraph strong style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{item.question}</Typography.Paragraph>
      {item.hint && <Typography.Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap' }}>{item.hint}</Typography.Paragraph>}
      <Input.TextArea
        value={text}
        rows={isEssay ? 8 : 2}
        placeholder="Gõ bài làm của bạn ở đây (tự lưu trong trình duyệt)"
        onChange={(e) => { setText(e.target.value); writeDraft(key, e.target.value) }}
      />
      {isEssay && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Đã viết {text.replace(/\s/g, '').length} chữ</div>}
      <Space style={{ marginTop: 8 }}>
        <Button type={show ? 'default' : 'primary'} onClick={() => setShow((v) => !v)}>{show ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu và giải thích'}</Button>
        {text && <Button onClick={() => { setText(''); writeDraft(key, '') }}>Xóa bài làm</Button>}
      </Space>
      {show && (
        <div style={{ marginTop: 12 }}>
          <Alert type="info" showIcon message="Đáp án mẫu do AI soạn dựa trên kiến thức ngữ pháp (đề Viết không có đáp án chính thức). Cách viết khác đúng ngữ pháp vẫn có thể được chấp nhận." style={{ marginBottom: 8 }} />
          <Typography.Text strong>Đáp án mẫu</Typography.Text>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, padding: '8px 12px', margin: '4px 0 12px', borderLeft: '3px solid #52c41a', background: 'rgba(82,196,26,0.08)' }}>{item.answer}</div>
          <Typography.Text strong>Giải thích và cấu trúc dùng</Typography.Text>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginTop: 4 }}>{item.explain}</div>
          {item.translation && (
            <>
              <Divider style={{ margin: '12px 0' }} />
              <Typography.Text strong>Bản dịch tiếng Việt</Typography.Text>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginTop: 4 }}>{item.translation}</div>
            </>
          )}
        </div>
      )}
    </Card>
  )
}

export default function WritingPage() {
  const { groupId, setId, key } = useParams()
  const { groups, loading } = useSubjects()
  if (loading) return <Spin style={{ display: 'block', marginTop: 48 }} />
  const group = groups.find((g) => g.id === groupId)
  const set = group?.sets.find((s) => s.id === setId)
  const sec = set?.sections.find((s) => s.key === key && s.writing)
  if (!sec || sec.items.length === 0) {
    return <Result status="404" title="Không tìm thấy bài viết" extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />
  }
  return (
    <>
      <Typography.Title level={3}>{group.name} · {set.name} · {sec.label}</Typography.Title>
      <Typography.Paragraph type="secondary">
        Tự viết trước rồi mới bấm xem đáp án mẫu. Phần này không chấm điểm.
      </Typography.Paragraph>
      {sec.items.map((item, i) => (
        <WritingItem key={item.id} groupId={groupId} setId={setId} item={item} index={i} />
      ))}
    </>
  )
}
