import { Collapse } from 'antd'

// Lời thoại của bài nghe, chỉ hiện SAU khi đã trả lời (để khỏi lộ đáp án). Thường là phiên âm tự động nên ghi chú rõ.
export default function ScriptPanel({ script, note }) {
  if (!script) return null
  return (
    <Collapse
      size="small"
      style={{ marginTop: 8 }}
      items={[{
        key: 'script',
        label: 'Xem lời thoại của bài nghe',
        children: (
          <div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{script}</div>
            {note && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>{note}</div>}
          </div>
        ),
      }]}
    />
  )
}
