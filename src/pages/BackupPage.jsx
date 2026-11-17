import { useState } from 'react'
import { Alert, Button, Card, Descriptions, Popconfirm, Space, Typography, Upload, message } from 'antd'
import { useSubjects } from '../hooks/useSubjects.jsx'
import { resetOverridesCache } from '../hooks/useOverrides.js'
import { buildBackup, parseBackup, summarizeBackup } from '../utils/backup.js'
import { dumpLocalEntries, restoreLocalEntries } from '../utils/storage.js'
import { getAllUserSubjects, replaceAllUserSubjects } from '../utils/db.js'
import { downloadText, readFileText, todayStamp } from '../utils/download.js'

// Dữ liệu chỉ nằm trong trình duyệt nên cần sao lưu ra file để phòng khi xóa dữ liệu duyệt web hoặc đổi máy.
export default function BackupPage() {
  const { reload } = useSubjects()
  const [messageApi, holder] = message.useMessage()
  const [pending, setPending] = useState(null) // { fileName, backup, summary }
  const [error, setError] = useState('')

  const doBackup = async () => {
    try {
      const backup = buildBackup({ localEntries: dumpLocalEntries(), userSubjects: await getAllUserSubjects() })
      downloadText(`studyexam-backup-${todayStamp()}.json`, JSON.stringify(backup))
      messageApi.success('Đã tạo file sao lưu.')
    } catch (e) {
      setError(`Không sao lưu được: ${e.message}`)
    }
  }

  const onFile = async (file) => {
    setError('')
    const res = parseBackup(await readFileText(file))
    if (!res.ok) {
      setPending(null)
      setError(res.error)
    } else setPending({ fileName: file.name, backup: res.backup, summary: summarizeBackup(res.backup) })
    return false
  }

  const doRestore = async () => {
    try {
      restoreLocalEntries(pending.backup.local)
      await replaceAllUserSubjects(pending.backup.subjects)
      resetOverridesCache()
      await reload()
      setPending(null)
      messageApi.success('Đã khôi phục dữ liệu.')
    } catch (e) {
      setError(`Không khôi phục được: ${e.message}`)
    }
  }

  return (
    <>
      {holder}
      <Typography.Title level={3}>Sao lưu và khôi phục</Typography.Title>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Card title="Sao lưu toàn bộ" size="small">
          <Typography.Paragraph>
            Xuất 1 file gồm tiến độ học, danh sách câu sai, lịch sử thi, giải thích đã sửa, cài đặt và các đề đã thêm.
          </Typography.Paragraph>
          <Button type="primary" onClick={doBackup}>Tải file sao lưu</Button>
        </Card>

        <Card title="Khôi phục từ file" size="small">
          <Alert type="warning" showIcon style={{ marginBottom: 12 }} message="Khôi phục sẽ THAY THẾ toàn bộ dữ liệu hiện tại bằng dữ liệu trong file." />
          <Upload accept=".json,application/json" maxCount={1} showUploadList={false} beforeUpload={onFile}>
            <Button>Chọn file sao lưu</Button>
          </Upload>
          {pending && (
            <div style={{ marginTop: 12 }}>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="File">{pending.fileName}</Descriptions.Item>
                <Descriptions.Item label="Tạo lúc">{new Date(pending.summary.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
                <Descriptions.Item label="Số môn có dữ liệu học">{pending.summary.subjectsWithData}</Descriptions.Item>
                <Descriptions.Item label="Số đề đã thêm">{pending.summary.userSubjects}</Descriptions.Item>
              </Descriptions>
              <Popconfirm title="Thay thế toàn bộ dữ liệu hiện tại?" okText="Khôi phục" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={doRestore}>
                <Button danger style={{ marginTop: 12 }}>Khôi phục dữ liệu này</Button>
              </Popconfirm>
            </div>
          )}
        </Card>

        {error && <Alert type="error" showIcon message={error} />}
      </Space>
    </>
  )
}
