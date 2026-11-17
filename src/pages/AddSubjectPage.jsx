import { useState } from 'react'
import { Tabs, Typography } from 'antd'
import JsonImport from '../components/import/JsonImport.jsx'
import RawImport from '../components/import/RawImport.jsx'
import ImageImport from '../components/import/ImageImport.jsx'

export default function AddSubjectPage() {
  const [tab, setTab] = useState('json')
  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>Thêm môn</Typography.Title>
      <Typography.Paragraph type="secondary">
        Môn thêm ở đây được lưu trong trình duyệt của bạn (IndexedDB).
        Muốn thêm bằng cách chép file vào thư mục project thì xem README.
      </Typography.Paragraph>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: 'json', label: 'Tải file JSON', children: <JsonImport /> },
          { key: 'raw', label: 'Dán đề thô / PDF / TXT', children: <RawImport /> },
          { key: 'image', label: 'Dán ảnh (OCR)', children: <ImageImport active={tab === 'image'} /> },
        ]}
      />
    </>
  )
}
