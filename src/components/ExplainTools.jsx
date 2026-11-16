import { useMemo, useState } from 'react'
import { Alert, Button, Card, Input, InputNumber, Select, Space, Typography, message } from 'antd'
import { useOverrides } from '../hooks/useOverrides.js'
import { buildExplainPrompt, chunk, findMissingExplanations, parseExplainResponse } from '../utils/explainPrompt.js'
import { copyText, downloadText } from '../utils/download.js'

// Giải thích nhờ AI bên ngoài (web không gọi AI): xuất prompt + dữ liệu, rồi dán kết quả JSON trả về.
export default function ExplainTools({ subject }) {
  const [messageApi, holder] = message.useMessage()
  const { map, saveMany } = useOverrides(subject.id)
  const [batchSize, setBatchSize] = useState(50)
  const [batchNo, setBatchNo] = useState(0)
  const [pasted, setPasted] = useState('')
  const [errors, setErrors] = useState([])

  const missing = useMemo(() => findMissingExplanations(subject, map), [subject, map])
  const batches = useMemo(() => chunk(missing, batchSize), [missing, batchSize])
  const current = batches[Math.min(batchNo, batches.length - 1)] || []
  const prompt = useMemo(() => (current.length ? buildExplainPrompt(subject.name, current) : ''), [subject, current])
  const byId = useMemo(() => new Map(subject.questions.map((q) => [q.id, q])), [subject])

  const copy = async () => {
    const ok = await copyText(prompt)
    if (ok) messageApi.success('Đã sao chép prompt. Hãy dán vào AI bạn dùng.')
    else messageApi.error('Không sao chép được, hãy bôi đen và copy thủ công.')
  }

  const doImport = () => {
    const { updates, errors: errs } = parseExplainResponse(pasted, byId)
    const n = Object.keys(updates).length
    if (n > 0) saveMany(updates, subject)
    setErrors(errs)
    if (n > 0) {
      messageApi.success(`Đã nhập giải thích cho ${n} câu.`)
      if (errs.length === 0) setPasted('')
    } else messageApi.error('Không nhập được câu nào.')
  }

  return (
    <Card title="Giải thích nhờ AI bên ngoài" size="small">
      {holder}
      <Typography.Paragraph>
        Hiện có <b>{missing.length}</b> câu chưa có đủ giải thích. Web không gọi AI: bạn sao chép đoạn prompt bên dưới, dán vào AI bất kỳ,
        rồi dán kết quả JSON trả về vào ô "Nhập giải thích".
      </Typography.Paragraph>

      {missing.length === 0 ? (
        <Alert type="success" showIcon message="Môn này đã có giải thích cho mọi đáp án." />
      ) : (
        <>
          <Space wrap style={{ marginBottom: 8 }}>
            <span>Số câu mỗi đợt:</span>
            <InputNumber min={5} max={200} value={batchSize} onChange={(v) => { if (v) { setBatchSize(v); setBatchNo(0) } }} />
            <span>Đợt:</span>
            <Select
              style={{ width: 160 }}
              value={Math.min(batchNo, batches.length - 1)}
              onChange={setBatchNo}
              options={batches.map((b, i) => ({ value: i, label: `Đợt ${i + 1}/${batches.length} (${b.length} câu)` }))}
            />
          </Space>
          <Input.TextArea readOnly rows={6} value={prompt} />
          <Space style={{ marginTop: 8 }} wrap>
            <Button type="primary" onClick={copy}>Sao chép prompt</Button>
            <Button onClick={() => downloadText(`${subject.id}-prompt-dot-${Math.min(batchNo, batches.length - 1) + 1}.txt`, prompt, 'text/plain')}>Tải về .txt</Button>
          </Space>
        </>
      )}

      <Typography.Title level={5} style={{ marginTop: 20 }}>Nhập giải thích</Typography.Title>
      <Input.TextArea rows={5} value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder='Dán kết quả JSON AI trả về, ví dụ: {"q-001": ["giải thích đáp án 1", "giải thích đáp án 2"]}' />
      <Button style={{ marginTop: 8 }} type="primary" disabled={!pasted.trim()} onClick={doImport}>Nhập giải thích</Button>
      {errors.length > 0 && (
        <Alert
          style={{ marginTop: 8 }}
          type="warning"
          showIcon
          message={`${errors.length} lỗi (các câu hợp lệ vẫn được nhập)`}
          description={<ul style={{ margin: 0, paddingLeft: 18 }}>{errors.slice(0, 15).map((e, i) => <li key={i}>{e}</li>)}</ul>}
        />
      )}
    </Card>
  )
}
