import { useMemo, useState } from 'react'
import { Alert, Button, Card, Checkbox, Collapse, Form, Input, InputNumber, Pagination, Popconfirm, Segmented, Space, Tag, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useSaveSubject } from '../../hooks/useSaveSubject.jsx'
import { optionLabel } from '../../utils/stats.js'
import { slugify } from '../../utils/parseRawExam.js'

const PAGE_SIZE = 10
let keyCounter = 0
const newKey = () => `k${++keyCounter}`

// Màn hình XEM TRƯỚC sau khi tách đề thô: sửa câu hỏi, đáp án, tick đáp án đúng, xóa câu lỗi rồi mới lưu.
// Câu tách không chắc chắn (uncertain) tô vàng kèm lý do.
export default function ImportReview({ initialQuestions, rejected, removedDuplicates, defaultName, onBack }) {
  const { save, modalHolder } = useSaveSubject()
  const [questions, setQuestions] = useState(() => initialQuestions.map((q) => ({ ...q, key: newKey() })))
  const [rejectedLeft, setRejectedLeft] = useState(rejected)
  const [name, setName] = useState(defaultName || '')
  const [id, setId] = useState(slugify(defaultName || ''))
  const [idTouched, setIdTouched] = useState(false)
  const [questionCount, setQuestionCount] = useState(60)
  const [duration, setDuration] = useState(90)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [problems, setProblems] = useState([])

  const uncertainCount = questions.filter((q) => q.uncertain).length
  const shown = useMemo(() => (filter === 'uncertain' ? questions.filter((q) => q.uncertain) : questions), [questions, filter])
  const pageItems = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const patch = (key, p) => setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...p } : q)))
  const remove = (key) => setQuestions((qs) => qs.filter((q) => q.key !== key))

  const patchOption = (key, i, p) =>
    setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, options: q.options.map((o, j) => (j === i ? { ...o, ...p } : o)) } : q)))
  const addOption = (key) =>
    setQuestions((qs) => qs.map((q) => (q.key === key && q.options.length < 6 ? { ...q, options: [...q.options, { text: '', correct: false, explain: '' }] } : q)))
  const removeOption = (key, i) =>
    setQuestions((qs) => qs.map((q) => (q.key === key && q.options.length > 2 ? { ...q, options: q.options.filter((_, j) => j !== i) } : q)))

  const addManual = (question = '') =>
    setQuestions((qs) => [
      ...qs,
      { key: newKey(), id: '', question, options: [{ text: '', correct: false, explain: '' }, { text: '', correct: false, explain: '' }], uncertain: true, issues: ['Câu thêm thủ công, hãy nhập đầy đủ'] },
    ])

  const onName = (v) => {
    setName(v)
    if (!idTouched) setId(slugify(v))
  }

  const doSave = async () => {
    // đánh số lại id cho gọn: <mã môn>-001, -002...
    const subject = {
      id: id.trim(),
      name: name.trim(),
      exam: { questionCount: Math.min(questionCount, questions.length) || 1, durationMinutes: duration },
      questions: questions.map((q, i) => {
        const out = {
          id: `${id.trim()}-${String(i + 1).padStart(3, '0')}`,
          question: q.question.trim(),
          options: q.options.map((o) => ({ text: o.text.trim(), correct: !!o.correct, explain: o.explain || '' })),
        }
        if (q.note) out.note = q.note
        return out
      }),
    }
    const res = await save(subject)
    if (!res.ok && res.problems) setProblems(res.problems)
    else setProblems([])
  }

  return (
    <div>
      {modalHolder}
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message={`Đã tách được ${questions.length} câu${removedDuplicates ? `, đã gộp ${removedDuplicates} câu trùng` : ''}.`}
        description={`${uncertainCount} câu tô vàng là câu tách không chắc chắn, hãy xem lại. ${rejectedLeft.length} khối văn bản không tách được (xem phía dưới).`}
      />

      <Card title="Thông tin môn" size="small" style={{ marginBottom: 12 }}>
        <Form layout="vertical">
          <Form.Item label="Tên môn" required>
            <Input value={name} onChange={(e) => onName(e.target.value)} placeholder="Ví dụ: MLN131 - Chủ nghĩa xã hội khoa học" />
          </Form.Item>
          <Form.Item label="Mã môn (không dấu, dùng để lưu tiến độ riêng)" required>
            <Input value={id} onChange={(e) => { setIdTouched(true); setId(e.target.value) }} />
          </Form.Item>
          <Space size="large" wrap>
            <Form.Item label="Số câu mỗi đề thi">
              <InputNumber min={1} max={Math.max(1, questions.length)} value={questionCount} onChange={(v) => v && setQuestionCount(v)} />
            </Form.Item>
            <Form.Item label="Thời gian thi (phút)">
              <InputNumber min={1} max={600} value={duration} onChange={(v) => v && setDuration(v)} />
            </Form.Item>
          </Space>
        </Form>
      </Card>

      {rejectedLeft.length > 0 && (
        <Collapse
          style={{ marginBottom: 12 }}
          items={[{
            key: 'rej',
            label: `Khối văn bản không tách được (${rejectedLeft.length})`,
            children: rejectedLeft.map((r, i) => (
              <Card key={i} size="small" style={{ marginBottom: 8 }}>
                <Typography.Text type="secondary">{r.reason}</Typography.Text>
                <pre style={{ whiteSpace: 'pre-wrap', margin: '4px 0' }}>{r.raw}</pre>
                <Space>
                  <Button size="small" onClick={() => { addManual(r.raw); setRejectedLeft((l) => l.filter((_, j) => j !== i)) }}>
                    Tạo câu từ khối này để sửa tay
                  </Button>
                  <Button size="small" onClick={() => setRejectedLeft((l) => l.filter((_, j) => j !== i))}>Bỏ qua</Button>
                </Space>
              </Card>
            )),
          }]}
        />
      )}

      <Segmented
        block
        style={{ marginBottom: 12 }}
        value={filter}
        onChange={(v) => { setFilter(v); setPage(1) }}
        options={[
          { value: 'all', label: `Tất cả (${questions.length})` },
          { value: 'uncertain', label: `Cần xem lại (${uncertainCount})` },
        ]}
      />

      {pageItems.map((q) => (
        <QuestionEditor
          key={q.key}
          q={q}
          number={questions.indexOf(q) + 1}
          onPatch={(p) => patch(q.key, p)}
          onPatchOption={(i, p) => patchOption(q.key, i, p)}
          onAddOption={() => addOption(q.key)}
          onRemoveOption={(i) => removeOption(q.key, i)}
          onRemove={() => remove(q.key)}
        />
      ))}
      {shown.length === 0 && <Alert type="success" showIcon message="Không còn câu nào cần xem lại." />}

      <Space style={{ marginBottom: 16 }} wrap>
        {shown.length > PAGE_SIZE && <Pagination size="small" current={page} pageSize={PAGE_SIZE} total={shown.length} onChange={(p) => { setPage(p); window.scrollTo({ top: 0 }) }} showSizeChanger={false} />}
        <Button icon={<PlusOutlined />} onClick={() => addManual()}>Thêm câu thủ công</Button>
      </Space>

      {problems.length > 0 && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 12 }}
          message={`Chưa lưu được, còn ${problems.length} lỗi`}
          description={<ul style={{ margin: 0, paddingLeft: 18 }}>{problems.slice(0, 20).map((p, i) => <li key={i}>{p}</li>)}</ul>}
        />
      )}

      <Space wrap>
        <Popconfirm
          disabled={uncertainCount === 0}
          title={`Còn ${uncertainCount} câu chưa kiểm tra`}
          description="Vẫn lưu môn với các câu này?"
          okText="Vẫn lưu"
          cancelText="Xem lại"
          onConfirm={doSave}
        >
          <Button type="primary" size="large" onClick={uncertainCount === 0 ? doSave : undefined} disabled={!name.trim() || !id.trim() || questions.length === 0}>
            Lưu môn ({questions.length} câu)
          </Button>
        </Popconfirm>
        <Button onClick={onBack}>Quay lại</Button>
      </Space>
    </div>
  )
}

function QuestionEditor({ q, number, onPatch, onPatchOption, onAddOption, onRemoveOption, onRemove }) {
  return (
    <Card
      size="small"
      style={{ marginBottom: 12, background: q.uncertain ? 'var(--warn-bg)' : undefined, borderColor: q.uncertain ? 'var(--warn-border)' : undefined }}
      title={<span>Câu {number}</span>}
      extra={
        <Space>
          {q.uncertain && <Button size="small" onClick={() => onPatch({ uncertain: false, issues: [] })}>Đã kiểm tra</Button>}
          <Popconfirm title="Xóa câu này?" okText="Xóa" cancelText="Hủy" onConfirm={onRemove}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      }
    >
      {q.uncertain && q.issues.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {q.issues.map((m, i) => <Tag key={i} color="gold" style={{ whiteSpace: 'normal', marginBottom: 4 }}>{m}</Tag>)}
        </div>
      )}
      <Input.TextArea autoSize={{ minRows: 2 }} value={q.question} onChange={(e) => onPatch({ question: e.target.value })} placeholder="Nội dung câu hỏi" />
      <div style={{ marginTop: 8 }}>
        {q.options.map((o, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
            <Checkbox checked={o.correct} onChange={(e) => onPatchOption(i, { correct: e.target.checked })} style={{ marginTop: 4 }} />
            <span style={{ fontWeight: 600, marginTop: 4 }}>{optionLabel(i)}.</span>
            <Input.TextArea autoSize value={o.text} onChange={(e) => onPatchOption(i, { text: e.target.value })} status={o.text.trim() ? '' : 'error'} />
            <Button size="small" type="text" danger icon={<DeleteOutlined />} disabled={q.options.length <= 2} onClick={() => onRemoveOption(i)} />
          </div>
        ))}
        <Button size="small" icon={<PlusOutlined />} disabled={q.options.length >= 6} onClick={onAddOption}>Thêm đáp án</Button>
        <Typography.Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>Tick ô vuông là đáp án đúng ({q.options.filter((o) => o.correct).length} đáp án đúng)</Typography.Text>
      </div>
    </Card>
  )
}
