import { useState } from 'react'
import { Button, Input, Space, Tag } from 'antd'
import { useOverrides } from '../hooks/useOverrides.js'
import { effectiveExplain } from '../utils/overrides.js'

// Giải thích của 1 đáp án + nút Sửa. Bản tự sửa được lưu riêng (ghi đè bản gốc khi hiển thị).
// option.idx = chỉ số GỐC của đáp án trong file môn (không đổi dù đáp án bị xáo trộn).
export default function ExplanationPanel({ subjectId, questionId, option }) {
  const { map, saveExplain } = useOverrides(subjectId)
  const base = option.explain || ''
  const text = effectiveExplain(map, questionId, option.idx, base)
  const edited = map[questionId]?.explain?.[option.idx] !== undefined
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const stop = (e) => e.stopPropagation()
  const startEdit = () => {
    setDraft(text)
    setEditing(true)
  }
  const save = () => {
    saveExplain(questionId, option.idx, draft.trim(), base)
    setEditing(false)
  }

  if (editing) {
    return (
      <div onClick={stop} style={{ marginTop: 4 }}>
        <Input.TextArea autoSize={{ minRows: 2 }} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Viết giải thích theo nội dung đáp án (không nhắc chữ cái A/B/C/D)" />
        <Space wrap style={{ marginTop: 4 }}>
          <Button size="small" type="primary" onClick={save}>Lưu</Button>
          <Button size="small" onClick={() => setEditing(false)}>Hủy</Button>
          {edited && (
            <Button size="small" danger onClick={() => { saveExplain(questionId, option.idx, base, base); setEditing(false) }}>
              Khôi phục bản gốc
            </Button>
          )}
        </Space>
      </div>
    )
  }

  return (
    <div className="explain" onClick={stop}>
      {text ? text : <i>Chưa có giải thích</i>}{' '}
      {edited && <Tag style={{ fontSize: 11 }}>đã sửa</Tag>}
      <Button type="link" size="small" style={{ padding: 0, height: 'auto' }} onClick={startEdit}>
        {text ? 'Sửa' : 'Thêm'}
      </Button>
    </div>
  )
}
