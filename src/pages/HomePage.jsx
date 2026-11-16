import { Link } from 'react-router-dom'
import { Alert, Button, Col, Empty, Row, Space, Spin, Typography } from 'antd'
import { useSubjects } from '../hooks/useSubjects.jsx'
import SubjectCard from '../components/SubjectCard.jsx'

export default function HomePage() {
  const { subjects, errors, loading } = useSubjects()

  if (loading) return <Spin style={{ display: 'block', marginTop: 48 }} />

  return (
    <>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }} wrap>
        <Typography.Title level={3} style={{ margin: 0 }}>Các môn học</Typography.Title>
        <Space wrap>
          <Link to="/add"><Button type="primary">Thêm môn</Button></Link>
          <Link to="/backup"><Button>Sao lưu / Khôi phục</Button></Link>
        </Space>
      </Space>

      {/* Môn nào lỗi cấu trúc thì báo rõ lỗi, các môn khác vẫn dùng bình thường */}
      {errors.map((err) => (
        <Alert
          key={err.name}
          type="error"
          showIcon
          style={{ marginBottom: 12 }}
          message={`Không nạp được môn "${err.name}"`}
          description={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {err.messages.slice(0, 8).map((m, i) => (
                <li key={i}>{m}</li>
              ))}
              {err.messages.length > 8 && <li>... và {err.messages.length - 8} lỗi khác</li>}
            </ul>
          }
        />
      ))}

      {subjects.length === 0 ? (
        <Empty description="Chưa có môn nào. Hãy thêm file vào public/data/ và index.json." />
      ) : (
        <Row gutter={[16, 16]}>
          {subjects.map((s) => (
            <Col key={s.id} xs={24} md={12}>
              <SubjectCard subject={s} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
