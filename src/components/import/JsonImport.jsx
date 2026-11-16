import { useState } from 'react'
import { Alert, Button, Card, Descriptions, Space, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useSaveSubject } from '../../hooks/useSaveSubject.jsx'
import { validateSubject } from '../../utils/validateSubject.js'
import { readFileText } from '../../utils/download.js'

// Cách 2: tải file JSON đúng cấu trúc (Phần 1) lên, kiểm tra rồi lưu vào IndexedDB.
export default function JsonImport() {
  const { save, modalHolder } = useSaveSubject()
  const [state, setState] = useState(null) // { fileName, data, problems }
  const [saveProblems, setSaveProblems] = useState([])

  const onFile = async (file) => {
    setSaveProblems([])
    try {
      const data = JSON.parse(await readFileText(file))
      setState({ fileName: file.name, data, problems: validateSubject(data) })
    } catch (e) {
      setState({ fileName: file.name, data: null, problems: [`Không đọc được JSON: ${e.message}`] })
    }
    return false // không upload lên server, chỉ đọc tại trình duyệt
  }

  const doSave = async () => {
    const res = await save(state.data)
    if (!res.ok && res.problems) setSaveProblems(res.problems)
  }

  return (
    <Card>
      {modalHolder}
      <Upload.Dragger accept=".json,application/json" maxCount={1} showUploadList={false} beforeUpload={onFile}>
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p>Bấm hoặc kéo thả file JSON của môn vào đây</p>
        <p style={{ color: '#8c8c8c' }}>File cần đúng cấu trúc: id, name, exam, questions (xem README)</p>
      </Upload.Dragger>

      {state && state.problems.length > 0 && (
        <Alert
          style={{ marginTop: 12 }}
          type="error"
          showIcon
          message={`File "${state.fileName}" có ${state.problems.length} lỗi, chưa thể lưu`}
          description={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {state.problems.slice(0, 30).map((p, i) => <li key={i}>{p}</li>)}
              {state.problems.length > 30 && <li>... và {state.problems.length - 30} lỗi khác</li>}
            </ul>
          }
        />
      )}

      {state && state.problems.length === 0 && (
        <div style={{ marginTop: 12 }}>
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Tên môn">{state.data.name}</Descriptions.Item>
            <Descriptions.Item label="Mã môn">{state.data.id}</Descriptions.Item>
            <Descriptions.Item label="Số câu">{state.data.questions.length}</Descriptions.Item>
            <Descriptions.Item label="Câu chưa có giải thích">
              {state.data.questions.filter((q) => q.options.some((o) => !o.explain)).length}
            </Descriptions.Item>
          </Descriptions>
          <Space style={{ marginTop: 12 }}>
            <Button type="primary" onClick={doSave}>Lưu môn</Button>
          </Space>
        </div>
      )}

      {saveProblems.length > 0 && (
        <Alert style={{ marginTop: 12 }} type="error" showIcon message={saveProblems.join(' ')} />
      )}
    </Card>
  )
}
