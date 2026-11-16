import { useState } from 'react'
import { Alert, Button, Input, Popconfirm, Space, Tag } from 'antd'
import { useOverrides } from '../hooks/useOverrides.js'
import { effectiveNote, hasOverride } from '../utils/overrides.js'

// Phần ghi chú của câu (vd "nghi ngờ đáp án") + nhãn "Đã chỉnh sửa" + nút khôi phục bản gốc cả câu.
export default function QuestionNote({ subjectId, question }) {
  const { map, saveNote, restoreQuestion } = useOverrides(subjectId)
  const note = effectiveNote(map, question.id, question.note)
  const edited = hasOverride(map, question.id)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEdit = () => {
    setDraft(note)
    setEditing(true)
  }
  const save = () => {
    saveNote(question.id, draft.trim(), question.note || '')
    setEditing(false)
  }

  return (
    <div style={{ marginTop: 8 }}>
      {editing ? (
        <div>
          <Input.TextArea autoSize={{ minRows: 2 }} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ghi chú cho câu này (vd: nghi ngờ đáp án, cần xem lại giáo trình)" />
          <Space style={{ marginTop: 4 }}>
            <Button size="small" type="primary" onClick={save}>Lưu</Button>
            <Button size="small" onClick={() => setEditing(false)}>Hủy</Button>
          </Space>
        </div>
      ) : (
        <>
          {note && <Alert type="warning" showIcon message={`Ghi chú: ${note}`} />}
          <Space size={4} wrap style={{ marginTop: 4 }}>
            <Button type="link" size="small" style={{ padding: 0 }} onClick={startEdit}>
              {note ? 'Sửa ghi chú' : 'Thêm ghi chú'}
            </Button>
            {edited && <Tag color="gold">Đã chỉnh sửa</Tag>}
            {edited && (
              <Popconfirm title="Khôi phục bản gốc?" description="Mọi giải thích và ghi chú bạn đã sửa của câu này sẽ bị bỏ." okText="Khôi phục" cancelText="Hủy" onConfirm={() => restoreQuestion(question.id)}>
                <Button type="link" size="small" danger style={{ padding: 0 }}>Khôi phục bản gốc</Button>
              </Popconfirm>
            )}
          </Space>
        </>
      )}
    </div>
  )
}
