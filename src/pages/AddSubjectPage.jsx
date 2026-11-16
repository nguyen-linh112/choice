import { Link } from 'react-router-dom'
import { Tabs, Typography } from 'antd'
import JsonImport from '../components/import/JsonImport.jsx'
import RawImport from '../components/import/RawImport.jsx'

export default function AddSubjectPage() {
  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>Thêm môn</Typography.Title>
      <Typography.Paragraph type="secondary">
        <Link to="/">Về trang chủ</Link> · Môn thêm ở đây được lưu trong trình duyệt của bạn (IndexedDB).
        Muốn thêm bằng cách chép file vào thư mục project thì xem README.
      </Typography.Paragraph>
      <Tabs
        items={[
          { key: 'json', label: 'Tải file JSON', children: <JsonImport /> },
          { key: 'raw', label: 'Dán đề thô / PDF / TXT', children: <RawImport /> },
        ]}
      />
    </>
  )
}
