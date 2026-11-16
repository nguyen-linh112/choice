import { Link, useParams } from 'react-router-dom'
import { Button, Result, Spin } from 'antd'
import { useSubjects } from '../hooks/useSubjects.jsx'

// Tìm môn theo :subjectId trên địa chỉ rồi gọi children(subject).
// Lo luôn 2 trường hợp: đang tải, và không tìm thấy môn.
export default function SubjectGate({ children }) {
  const { subjectId } = useParams()
  const { subjects, loading } = useSubjects()
  const subject = subjects.find((s) => s.id === subjectId)

  if (loading) return <Spin style={{ display: 'block', marginTop: 48 }} />
  if (!subject) {
    return <Result status="404" title="Không tìm thấy môn học" extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />
  }
  return children(subject)
}
