import { Button, Space, Typography } from 'antd'

// Bảng số câu để nhảy nhanh. Màu: xanh đặc = đã làm, cam = đánh dấu xem lại, trắng = chưa làm,
// viền đậm = câu đang xem.
export default function QuestionNavigator({ items, answers, flagged, current, onGo }) {
  return (
    <div>
      <Space size={[6, 6]} wrap>
        {items.map((item, i) => {
          const done = (answers[item.id] || []).length > 0
          const isFlagged = flagged.includes(item.id)
          let style = {}
          if (isFlagged) style = { background: '#fa8c16', borderColor: '#fa8c16', color: '#fff' }
          else if (done) style = { background: '#1677ff', borderColor: '#1677ff', color: '#fff' }
          if (i === current) style = { ...style, boxShadow: '0 0 0 2px var(--ring)' }
          return (
            <Button key={item.id} size="small" style={{ width: 38, ...style }} onClick={() => onGo(i)}>
              {i + 1}
            </Button>
          )
        })}
      </Space>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 6, marginBottom: 0 }}>
        Xanh: đã làm · Cam: đánh dấu xem lại · Trắng: chưa làm
      </Typography.Paragraph>
    </div>
  )
}
