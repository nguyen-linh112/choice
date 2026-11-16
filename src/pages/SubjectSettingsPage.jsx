import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Form, InputNumber, Popconfirm, Slider, Space, Tooltip, Typography, message } from 'antd'
import SubjectGate from '../components/SubjectGate.jsx'
import ExplainTools from '../components/ExplainTools.jsx'
import { useSubjects } from '../hooks/useSubjects.jsx'
import { resetOverridesCache } from '../hooks/useOverrides.js'
import { clearSubjectData, loadOverrides, loadSettings, saveSettings } from '../utils/storage.js'
import { deleteUserSubject } from '../utils/db.js'
import { DEFAULT_WRONG_COUNT, WRONG_COUNT_RANGE, getExamConfig } from '../utils/examConfig.js'
import { mergeSubjectWithOverrides, toExportableSubject } from '../utils/overrides.js'
import { downloadText } from '../utils/download.js'

export default function SubjectSettingsPage() {
  return <SubjectGate>{(subject) => <SettingsView key={subject.id} subject={subject} />}</SubjectGate>
}

function SettingsView({ subject }) {
  const navigate = useNavigate()
  const { reload } = useSubjects()
  const [messageApi, holder] = message.useMessage()
  // Giá trị đang hiển thị = cài đặt của người dùng, chưa có thì lấy mặc định từ "exam" của môn
  const [values, setValues] = useState(() => getExamConfig(subject, loadSettings(subject.id)))
  const total = subject.questions.length
  const defaults = getExamConfig(subject, {})
  const isUser = subject.source === 'user'

  const save = () => {
    saveSettings(subject.id, values)
    messageApi.success('Đã lưu cài đặt.')
  }

  const restore = () => {
    saveSettings(subject.id, {})
    setValues(defaults)
    messageApi.info('Đã khôi phục mặc định.')
  }

  // Xuất 1 môn ra JSON đúng cấu trúc Phần 1, đã gộp cả giải thích tôi tự sửa
  const exportSubject = () => {
    const merged = mergeSubjectWithOverrides(subject, loadOverrides(subject.id))
    downloadText(`${subject.id}.json`, JSON.stringify(toExportableSubject(merged), null, 2) + '\n')
  }

  const removeSubject = async () => {
    await deleteUserSubject(subject.id)
    clearSubjectData(subject.id) // xóa luôn tiến độ, câu sai, lịch sử, giải thích đã sửa của môn
    resetOverridesCache()
    await reload()
    navigate('/')
  }

  return (
    <>
      {holder}
      <Typography.Title level={3} style={{ marginBottom: 4 }}>Cài đặt môn</Typography.Title>
      <Typography.Paragraph type="secondary">
        <Link to={`/subject/${subject.id}`}>{subject.name}</Link>
      </Typography.Paragraph>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Card title="Đề thi" size="small">
          <Form layout="vertical">
            <Form.Item label={`Số câu mỗi đề thi (tối đa ${total})`}>
              <InputNumber min={1} max={total} value={values.questionCount} onChange={(v) => v && setValues({ ...values, questionCount: v })} />
            </Form.Item>
            <Form.Item label="Thời gian thi (phút)">
              <InputNumber min={1} max={600} value={values.durationMinutes} onChange={(v) => v && setValues({ ...values, durationMinutes: v })} />
            </Form.Item>
            <Form.Item label={`Số câu sai được hỏi lại trong mỗi đề (${WRONG_COUNT_RANGE[0]} - ${WRONG_COUNT_RANGE[1]}, mặc định ${DEFAULT_WRONG_COUNT})`}>
              <Slider min={WRONG_COUNT_RANGE[0]} max={WRONG_COUNT_RANGE[1]} value={values.wrongCount} onChange={(v) => setValues({ ...values, wrongCount: v })} />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={save}>Lưu</Button>
              <Button onClick={restore}>Khôi phục mặc định</Button>
            </Space>
          </Form>
        </Card>

        <ExplainTools subject={subject} />

        <Card title="Dữ liệu môn" size="small">
          <Space wrap>
            <Button onClick={exportSubject}>Xuất môn ra file JSON</Button>
            <Tooltip title={isUser ? '' : 'Môn này nằm trong thư mục public/data của project. Muốn gỡ, hãy xóa file và dòng trong index.json.'}>
              <span>
                <Popconfirm
                  disabled={!isUser}
                  title="Xóa môn này?"
                  description="Xóa luôn tiến độ, câu sai, lịch sử thi và giải thích đã sửa của môn. Không thể hoàn tác."
                  okText="Xóa môn"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  onConfirm={removeSubject}
                >
                  <Button danger disabled={!isUser}>Xóa môn</Button>
                </Popconfirm>
              </span>
            </Tooltip>
          </Space>
          <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
            File xuất ra gồm cả giải thích bạn đã sửa; có thể chép vào public/data/ hoặc tải lại bằng "Thêm môn".
          </Typography.Paragraph>
        </Card>
      </Space>
    </>
  )
}
