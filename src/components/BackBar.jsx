import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

// Nơi nút "Quay lại" đưa về, theo đường dẫn hiện tại:
//  - mọi trang con của môn  -> trang môn (/subject/:id)
//  - trang môn, Thêm môn, Sao lưu -> trang chủ
//  - trang chủ: không có nút
export function backTarget(pathname) {
  if (matchPath('/subject/:subjectId', pathname)) return { to: '/', label: 'Về trang chủ' }
  const sub = matchPath('/subject/:subjectId/*', pathname)
  if (sub) return { to: `/subject/${sub.params.subjectId}`, label: 'Quay lại môn học' }
  if (matchPath('/writing/:groupId/:setId/:key', pathname)) return { to: '/', label: 'Về trang chủ' }
  if (pathname === '/add' || pathname === '/backup') return { to: '/', label: 'Về trang chủ' }
  return null
}

export default function BackBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const target = backTarget(pathname)
  if (!target) return null
  return (
    <Button type="text" icon={<ArrowLeftOutlined />} style={{ marginBottom: 8, paddingLeft: 4 }} onClick={() => navigate(target.to)}>
      {target.label}
    </Button>
  )
}
