import { useRef, useState } from 'react'
import { Segmented, Space, Typography } from 'antd'
import { SoundOutlined } from '@ant-design/icons'

// Địa chỉ file audio: đường dẫn tương đối trong thư mục public (vd "data/audio/jpd326/su24/q05.mp3")
export const audioUrl = (path) => (/^(https?:)?\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path}`)

// Trình phát audio cho câu nghe: nút phát/tạm dừng/tua có sẵn của trình duyệt + chọn tốc độ.
export default function AudioPlayer({ src, label }) {
  const ref = useRef(null)
  const [rate, setRate] = useState(1)

  const changeRate = (v) => {
    setRate(v)
    if (ref.current) ref.current.playbackRate = v
  }

  return (
    <div style={{ marginBottom: 12, padding: '8px 12px', border: '1px solid var(--opt-border)', borderRadius: 8 }}>
      <Space size={8} style={{ marginBottom: 6 }} wrap>
        <SoundOutlined />
        <Typography.Text strong>{label || 'Bài nghe'}</Typography.Text>
      </Space>
      <audio ref={ref} controls preload="metadata" src={audioUrl(src)} style={{ width: '100%' }} onLoadedMetadata={() => { if (ref.current) ref.current.playbackRate = rate }} />
      <Space size={8} style={{ marginTop: 6 }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>Tốc độ</Typography.Text>
        <Segmented size="small" value={rate} onChange={changeRate} options={[{ value: 0.75, label: '0.75x' }, { value: 1, label: '1x' }, { value: 1.25, label: '1.25x' }]} />
      </Space>
    </div>
  )
}
