import { Collapse } from 'antd'

// Phần phụ của câu, chỉ hiện SAU khi đã trả lời (để khỏi lộ đáp án):
//  - script: lời thoại của bài nghe (thường là phiên âm tự động nên có ghi chú kèm theo)
//  - translation: bản dịch tiếng Việt của cả bài đọc, để đối chiếu
export default function ScriptPanel({ script, note, translation }) {
  const items = []
  if (script) {
    items.push({
      key: 'script',
      label: 'Xem lời thoại của bài nghe',
      children: (
        <div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{script}</div>
          {note && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>{note}</div>}
        </div>
      ),
    })
  }
  if (translation) {
    items.push({
      key: 'translation',
      label: 'Xem bản dịch cả bài đọc',
      children: <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{translation}</div>,
    })
  }
  if (items.length === 0) return null
  return <Collapse size="small" style={{ marginTop: 8 }} items={items} />
}
