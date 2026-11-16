import { useEffect, useState } from 'react'
import { Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { formatDuration } from '../utils/exam.js'

// Đồng hồ đếm ngược. Tính từ mốc bắt đầu tuyệt đối (startedAt) chứ không đếm lùi trong state,
// nên tải lại trang hay tab bị ngủ vẫn ra đúng thời gian còn lại.
export default function CountdownTimer({ startedAt, durationSeconds, onExpire }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const remaining = Math.max(0, durationSeconds - Math.floor((now - startedAt) / 1000))

  useEffect(() => {
    if (remaining === 0) onExpire()
  }, [remaining, onExpire])

  return (
    <Tag icon={<ClockCircleOutlined />} color={remaining <= 300 ? 'red' : 'blue'} style={{ fontSize: 18, padding: '4px 10px' }}>
      {formatDuration(remaining)}
    </Tag>
  )
}
