// Lưu 1 môn người dùng tự thêm vào IndexedDB: kiểm tra cấu trúc, xử lý trùng mã, rồi nạp lại danh sách môn.
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSubjects } from './useSubjects.jsx'
import { validateSubject } from '../utils/validateSubject.js'
import { putUserSubject } from '../utils/db.js'
import { toExportableSubject } from '../utils/overrides.js'

export function useSaveSubject() {
  const { subjects, reload } = useSubjects()
  const navigate = useNavigate()
  const [modal, modalHolder] = Modal.useModal()

  // Trả về { ok: true } hoặc { ok: false, problems: [...] } hoặc { ok: false, cancelled: true }
  const save = async (draft) => {
    const subject = toExportableSubject(draft)
    const problems = validateSubject(subject)
    if (problems.length) return { ok: false, problems }

    const existing = subjects.find((s) => s.id === subject.id)
    if (existing?.source === 'static') {
      return { ok: false, problems: [`Mã môn "${subject.id}" trùng với môn có sẵn trong thư mục public/data. Hãy đổi mã môn.`] }
    }
    if (existing?.source === 'user') {
      const confirmed = await new Promise((resolve) =>
        modal.confirm({
          title: 'Mã môn đã tồn tại',
          content: `Đã có môn "${existing.name}" dùng mã "${subject.id}". Ghi đè sẽ thay nội dung môn đó (tiến độ học vẫn được giữ). Bạn muốn ghi đè?`,
          okText: 'Ghi đè',
          cancelText: 'Đổi mã môn',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        }),
      )
      if (!confirmed) return { ok: false, cancelled: true }
    }

    try {
      await putUserSubject(subject)
    } catch (e) {
      return { ok: false, problems: [`Không lưu được vào IndexedDB: ${e.message}`] }
    }
    await reload()
    navigate(`/subject/${subject.id}`)
    return { ok: true }
  }

  return { save, modalHolder }
}
