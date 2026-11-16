import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

// Trang giữ chỗ cho chức năng chưa làm
export default function ComingSoonPage({ title, step }) {
  const navigate = useNavigate()
  return (
    <Result
      status="info"
      title={title}
      subTitle={step ? `Chức năng này sẽ được làm ở ${step}.` : 'Địa chỉ này không tồn tại.'}
      extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
    />
  )
}
