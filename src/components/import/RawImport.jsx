import { useState } from 'react'
import { Alert, Button, Card, Checkbox, Input, Progress, Space, Typography, Upload } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import ImportReview from './ImportReview.jsx'
import { mergeDuplicates, parseRawExam } from '../../utils/parseRawExam.js'
import { extractPdfText } from '../../utils/pdfText.js'
import { readFileBuffer, readFileText } from '../../utils/download.js'

// Cách 3: dán đề thô hoặc chọn file PDF/TXT -> tách câu -> màn hình XEM TRƯỚC để sửa -> lưu.
export default function RawImport() {
  const [text, setText] = useState('')
  const [defaultName, setDefaultName] = useState('')
  const [progress, setProgress] = useState(null) // { done, total } khi đang đọc PDF
  const [error, setError] = useState('')
  const [dedupe, setDedupe] = useState(true)
  const [parsed, setParsed] = useState(null) // { questions, rejected, removed }

  const onFile = async (file) => {
    setError('')
    setParsed(null)
    setDefaultName(file.name.replace(/\.[^.]+$/, ''))
    try {
      if (/\.pdf$/i.test(file.name)) {
        const buffer = await readFileBuffer(file)
        setText(await extractPdfText(buffer, (done, total) => setProgress({ done, total })))
      } else {
        setText(await readFileText(file))
      }
    } catch (e) {
      setError(`Không đọc được file: ${e.message}`)
    } finally {
      setProgress(null)
    }
    return false
  }

  const doParse = () => {
    setError('')
    const result = parseRawExam(text, { idPrefix: 'q' })
    const { questions, removed } = dedupe ? mergeDuplicates(result.questions) : { questions: result.questions, removed: 0 }
    if (questions.length === 0 && result.rejected.length === 0) {
      setError('Không tách được câu hỏi nào. Hãy kiểm tra lại nội dung (mỗi câu cần các đáp án A. B. C. ... và dòng đáp án đúng).')
      return
    }
    setParsed({ questions, rejected: result.rejected, removed })
  }

  if (parsed) {
    return (
      <ImportReview
        initialQuestions={parsed.questions}
        rejected={parsed.rejected}
        removedDuplicates={parsed.removed}
        defaultName={defaultName}
        onBack={() => setParsed(null)}
      />
    )
  }

  return (
    <Card>
      <Typography.Paragraph type="secondary">
        Dán văn bản đề vào ô bên dưới, hoặc chọn file PDF / TXT. Web tự tách câu hỏi, đáp án và đáp án đúng,
        rồi cho bạn xem lại và sửa trước khi lưu. Hỗ trợ cả kiểu đáp án lặp lại nguyên văn lẫn kiểu chỉ ghi chữ cái (C hoặc A B C).
      </Typography.Paragraph>

      <Upload accept=".pdf,.txt,text/plain,application/pdf" maxCount={1} showUploadList={false} beforeUpload={onFile}>
        <Button icon={<FileTextOutlined />}>Chọn file PDF / TXT</Button>
      </Upload>
      {progress && (
        <div style={{ marginTop: 8 }}>
          <Typography.Text type="secondary">Đang đọc PDF: trang {progress.done} / {progress.total}</Typography.Text>
          <Progress percent={Math.round((progress.done / progress.total) * 100)} size="small" />
        </div>
      )}

      <Input.TextArea
        style={{ marginTop: 12 }}
        rows={12}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'Ví dụ:\nCông thức chung của tư bản là:\nA. H-T-H\nB. T-H-T\nC. T-H-T\'\nC'}
      />

      <Space style={{ marginTop: 12 }} wrap>
        <Button type="primary" disabled={!text.trim() || !!progress} onClick={doParse}>Tách câu hỏi</Button>
        <Checkbox checked={dedupe} onChange={(e) => setDedupe(e.target.checked)}>Gộp các câu trùng nhau</Checkbox>
      </Space>

      {error && <Alert style={{ marginTop: 12 }} type="error" showIcon message={error} />}
    </Card>
  )
}
