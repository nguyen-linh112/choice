import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Checkbox, Progress, Segmented, Space, Typography, Upload } from 'antd'
import { DeleteOutlined, PictureOutlined } from '@ant-design/icons'
import ImportReview from './ImportReview.jsx'
import { mergeDuplicates } from '../../utils/parseRawExam.js'
import { parseOcrImages } from '../../utils/ocrQuestions.js'
import { OCR_LANGS, ocrImages } from '../../utils/ocrRunner.js'

let idCounter = 0

const STATUS_TEXT = {
  preparing: 'Đang chuẩn bị ảnh',
  'loading tesseract core': 'Đang tải bộ đọc chữ (lần đầu hơi lâu)',
  'initializing tesseract': 'Đang khởi động bộ đọc chữ',
  'loading language traineddata': 'Đang tải dữ liệu ngôn ngữ (lần đầu hơi lâu)',
  'initializing api': 'Đang khởi động bộ đọc chữ',
  'recognizing text': 'Đang đọc chữ',
}

// Cách 4: dán / kéo thả / chọn nhiều ảnh -> OCR -> tách câu -> màn hình XEM TRƯỚC để sửa -> lưu.
export default function ImageImport({ active = true }) {
  const [items, setItems] = useState([]) // { id, name, file, url }
  const [lang, setLang] = useState('vie')
  const [dedupe, setDedupe] = useState(true)
  const [withSide, setWithSide] = useState(true)
  const [progress, setProgress] = useState(null) // { index, total, percent, status }
  const [error, setError] = useState('')
  const [parsed, setParsed] = useState(null)
  const stopRef = useRef(false)
  const itemsRef = useRef(items)
  itemsRef.current = items

  const addFiles = useCallback((files) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'))
    if (imgs.length === 0) return
    setItems((cur) => [
      ...cur,
      ...imgs.map((file) => ({
        id: ++idCounter,
        file,
        name: file.name && file.name !== 'image.png' ? file.name : `Ảnh dán ${idCounter}`,
        url: URL.createObjectURL(file),
      })),
    ])
  }, [])

  // Dán ảnh từ clipboard (Ctrl+V) khi đang ở tab này
  useEffect(() => {
    if (!active) return undefined
    const onPaste = (e) => {
      const files = [...(e.clipboardData?.files || [])].filter((f) => f.type.startsWith('image/'))
      if (files.length === 0) return
      e.preventDefault()
      addFiles(files)
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [active, addFiles])

  // Giải phóng bộ nhớ ảnh khi rời trang
  useEffect(() => () => itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url)), [])

  const remove = (id) =>
    setItems((cur) => {
      const it = cur.find((x) => x.id === id)
      if (it) URL.revokeObjectURL(it.url)
      return cur.filter((x) => x.id !== id)
    })

  const scan = async () => {
    setError('')
    stopRef.current = false
    setProgress({ index: 0, total: items.length, percent: 0, status: 'preparing' })
    try {
      const texts = await ocrImages(items, lang, {
        onProgress: setProgress,
        shouldStop: () => stopRef.current,
        withSide,
      })
      if (texts.length === 0) return
      const result = parseOcrImages(texts)
      const { questions, removed } = dedupe ? mergeDuplicates(result.questions) : { questions: result.questions, removed: 0 }
      if (questions.length === 0 && result.rejected.length === 0) {
        setError('Không đọc được câu hỏi nào từ các ảnh.')
        return
      }
      setParsed({ questions, rejected: result.rejected, removed })
    } catch (e) {
      setError(`Không quét được ảnh: ${e.message || e}. Kiểm tra kết nối mạng (lần đầu cần tải dữ liệu ngôn ngữ) rồi thử lại.`)
    } finally {
      setProgress(null)
    }
  }

  if (parsed) {
    return (
      <ImportReview
        initialQuestions={parsed.questions}
        rejected={parsed.rejected}
        removedDuplicates={parsed.removed}
        defaultName="Đề từ ảnh"
        onBack={() => setParsed(null)}
      />
    )
  }

  const scanning = !!progress
  const overall = progress ? Math.round(((progress.index + progress.percent / 100) / progress.total) * 100) : 0

  return (
    <Card>
      <Typography.Paragraph type="secondary">
        Bấm vào ô bên dưới rồi nhấn <b>Ctrl+V</b> để dán ảnh (dán được nhiều lần), hoặc kéo thả / chọn nhiều ảnh.
        Web đọc chữ trong ảnh (OCR) ngay trên máy bạn, tách câu hỏi và đáp án, rồi cho bạn xem lại, tick đáp án đúng và sửa
        lỗi trước khi lưu. OCR có thể đọc sai dấu tiếng Việt, nhất là khi chữ trong ảnh quá nhỏ hoặc mờ (hãy phóng to
        trang trước khi chụp để chữ rõ hơn), nên bước xem lại là bắt buộc.
      </Typography.Paragraph>

      <Upload.Dragger
        accept="image/*"
        multiple
        showUploadList={false}
        disabled={scanning}
        beforeUpload={(file, list) => {
          if (file === list[0]) addFiles(list)
          return false
        }}
      >
        <p className="ant-upload-drag-icon"><PictureOutlined /></p>
        <p className="ant-upload-text">Dán (Ctrl+V), kéo thả hoặc bấm để chọn ảnh</p>
        <p className="ant-upload-hint">Mỗi ảnh nên chứa 1 hoặc vài câu hỏi cùng các đáp án A. B. C. D.</p>
      </Upload.Dragger>

      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {items.map((it, i) => (
            <div key={it.id} style={{ position: 'relative', width: 110 }} title={it.name}>
              <img src={it.url} alt={it.name} style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--opt-border)' }} />
              <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>{i + 1}</div>
              {!scanning && (
                <Button
                  size="small"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                  aria-label={`Xóa ảnh ${i + 1}`}
                  style={{ position: 'absolute', top: 2, right: 2 }}
                  onClick={() => remove(it.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <Space style={{ marginTop: 16 }} wrap>
        <Typography.Text>Ngôn ngữ trong ảnh:</Typography.Text>
        <Segmented value={lang} onChange={setLang} options={OCR_LANGS} disabled={scanning} />
        <Checkbox checked={dedupe} onChange={(e) => setDedupe(e.target.checked)}>Gộp các câu trùng nhau</Checkbox>
        <Checkbox checked={withSide} disabled={scanning} onChange={(e) => setWithSide(e.target.checked)}>
          Đọc cả bình luận bên cạnh để gợi ý đáp án (chậm hơn)
        </Checkbox>
      </Space>

      <div style={{ marginTop: 12 }}>
        <Space wrap>
          <Button type="primary" disabled={items.length === 0 || scanning} onClick={scan}>
            Quét {items.length > 0 ? `${items.length} ảnh` : 'ảnh'}
          </Button>
          {items.length > 0 && !scanning && <Button onClick={() => { items.forEach((it) => URL.revokeObjectURL(it.url)); setItems([]) }}>Xóa hết ảnh</Button>}
          {scanning && <Button onClick={() => { stopRef.current = true }}>Dừng</Button>}
        </Space>
      </div>

      {progress && (
        <div style={{ marginTop: 12 }}>
          <Typography.Text type="secondary">
            Ảnh {Math.min(progress.index + 1, progress.total)} / {progress.total} · {STATUS_TEXT[progress.status] || progress.status}
          </Typography.Text>
          <Progress percent={overall} size="small" />
        </div>
      )}

      {error && <Alert style={{ marginTop: 12 }} type="error" showIcon message={error} />}
    </Card>
  )
}
