# Ôn thi trắc nghiệm

Web ôn thi trắc nghiệm dùng được cho nhiều môn / nhiều đề. React + Vite + Ant Design + React Router (JavaScript), không có backend.
Mọi dữ liệu học nằm trong trình duyệt của bạn: tiến độ ở `localStorage`, các đề bạn tự thêm ở `IndexedDB`.

## Cách chạy

```bash
npm install
npm run dev      # mở địa chỉ in ra (thường là http://localhost:5173)
npm test         # chạy test (Vitest)
npm run build    # build bản chạy thật vào thư mục dist/
```

Phải chạy qua `npm run dev` (hoặc host thư mục `dist/`). Mở thẳng file HTML sẽ không đọc được dữ liệu trong `public/data/`.

## Các chức năng

- **Ôn tập:** từng thẻ một, chọn xong hiện giải thích mọi đáp án, đánh dấu Thuộc bài / Chưa thuộc, ba bộ Tất cả / Đã thuộc / Chưa thuộc, xáo trộn, lưu vị trí.
- **Thi thử:** đồng hồ đếm ngược, bảng số câu, tự lưu bài làm (tải lại trang không mất), nộp bài, chấm điểm thang 10, lịch sử thi.
- **Câu sai:** câu sai hoặc bỏ trống trong thi thử vào danh sách sai; phải đúng 3 lần liên tiếp mới ra khỏi danh sách. Mỗi đề thi có khoảng 20% câu lấy từ danh sách sai.
- **Sửa giải thích:** nút "Sửa" / "Thêm" ở mọi nơi hiện giải thích; bản sửa lưu riêng và có nút "Khôi phục bản gốc".
- **Sao lưu / Khôi phục:** xuất toàn bộ dữ liệu ra 1 file và nạp lại (nút ở trang chủ).

## Ba cách thêm môn mới

### Cách 1. Thả file vào project (không cần sửa code)

1. Chép file JSON của môn vào `public/data/` (ví dụ `public/data/mln131.json`).
2. Thêm 1 dòng vào `public/data/index.json`:

```json
[
  { "id": "mln122", "name": "MLN122 - Kinh tế chính trị Mác-Lênin", "file": "mln122.json" },
  { "id": "mln131", "name": "MLN131 - Chủ nghĩa xã hội khoa học", "file": "mln131.json" }
]
```

3. Tải lại trang. Nếu file sai cấu trúc, trang chủ báo rõ lỗi từng câu và các môn khác vẫn dùng bình thường.

### Cách 2. Tải file JSON ngay trong web

Trang chủ → **Thêm môn** → tab **Tải file JSON** → chọn file đúng cấu trúc → **Lưu môn**.
Web kiểm tra và báo rõ câu nào sai (thiếu đáp án đúng, thiếu `text`...). Môn được lưu vào IndexedDB.

### Cách 3. Dán đề thô hoặc chọn file PDF / TXT

Trang chủ → **Thêm môn** → tab **Dán đề thô / PDF / TXT**:

1. Dán văn bản (hoặc chọn file PDF / TXT, PDF được đọc bằng pdf.js ngay trong trình duyệt).
2. Bấm **Tách câu hỏi**.
3. Ở màn hình **xem trước**: sửa câu hỏi, sửa đáp án, tick đáp án đúng, xóa câu lỗi. Câu tách không chắc chắn tô **vàng** kèm lý do. Các khối văn bản không tách được được liệt kê riêng (không bị bỏ qua âm thầm).
4. Nhập tên môn, số câu thi, thời gian thi rồi **Lưu môn**.

Bộ tách hiểu được:

- Đáp án đúng ghi theo 2 kiểu: dòng lặp lại nguyên văn đáp án (`C. V. I. Lênin`; nhiều đáp án đúng thì nhiều dòng liên tiếp) hoặc chỉ ghi chữ cái (`C`, `A B C`).
- Câu có 2 đến 6 đáp án (A đến F, cả chữ thường a. b. c.); các đáp án nằm trên cùng 1 dòng (`A. 2007 B. 2006`); câu hỏi/đáp án bị ngắt dòng.
- Rác của mỗi trang (ngày giờ, link, số trang, tiêu đề Quizlet); chữ cái Cyrillic trông giống Latin.
- PDF Quizlet in 2 cột (cột trái: câu hỏi + đáp án, cột phải: đáp án đúng), kể cả thẻ bị đảo mặt.

Bộ tách không sửa lỗi chính tả do scan và không viết giải thích. Xem phần dưới.

### Giải thích cho đề thêm bằng cách 2 và 3

Web **không gọi AI**. Câu chưa có giải thích vẫn học và thi bình thường, phần giải thích hiện "Chưa có giải thích" kèm nút **Thêm**.
Để nhờ AI viết giải thích: vào môn → **Cài đặt môn** → **Giải thích nhờ AI bên ngoài**:

1. Chọn đợt (mặc định 50 câu mỗi đợt) → **Sao chép prompt** → dán vào AI bất kỳ.
2. Dán kết quả JSON AI trả về vào ô **Nhập giải thích** → **Nhập giải thích**. Câu nào sai định dạng được báo lỗi riêng, các câu hợp lệ vẫn được nhập.

## Cấu trúc file JSON của một môn

```json
{
  "id": "mln122",
  "name": "MLN122 - Kinh tế chính trị Mác-Lênin",
  "exam": { "questionCount": 60, "durationMinutes": 90 },
  "questions": [
    {
      "id": "mln122-001",
      "question": "Nội dung câu hỏi",
      "note": "(không bắt buộc) ghi chú, ví dụ: nghi ngờ đáp án",
      "options": [
        { "text": "Nội dung đáp án", "correct": true,  "explain": "Vì sao đúng" },
        { "text": "Nội dung đáp án", "correct": false, "explain": "Vì sao sai" }
      ]
    }
  ]
}
```

Quy tắc:

- Mỗi câu có từ 2 đến 6 đáp án (không mặc định 4). Cần ít nhất 1 đáp án `correct: true`.
- Câu có nhiều đáp án đúng hiện dạng checkbox, ghi "Chọn N đáp án", và chỉ tính đúng khi chọn đúng **và đủ**.
- `text` không chứa nhãn "A.", "B."; web tự gắn nhãn khi hiển thị.
- `explain` viết theo **nội dung**, không nhắc chữ cái A/B/C/D (vì thứ tự đáp án bị xáo trộn). Để trống `""` nếu chưa có.
- `exam` không bắt buộc (mặc định 60 câu / 90 phút) và sửa được trong **Cài đặt môn**.
- Đáp án kiểu "Tất cả phương án trên" luôn được giữ ở cuối khi xáo trộn.
- `id` câu phải khác nhau trong cùng một môn. Tiến độ học luôn tách riêng theo `id` môn.

## Thi thử chọn câu như thế nào

Mỗi đề: lấy N câu từ danh sách sai (mặc định 12, chỉnh được từ 10 đến 20; ưu tiên câu sai nhiều lần nhất, rồi câu lâu chưa gặp lại), phần còn lại random từ các câu khác và ưu tiên câu chưa từng xuất hiện trong các đề trước, rồi xáo thứ tự câu và đáp án. Với đề nhỏ, câu sai không chiếm quá một nửa đề.

## Cấu trúc thư mục

```text
public/data/        index.json + file JSON các môn (cách 1)
scripts/            công cụ chạy bằng Node, dùng khi chuẩn bị dữ liệu MLN122 (không nằm trong web)
src/pages/          các trang: trang chủ, môn, ôn tập, thi thử, kết quả, câu sai, cài đặt, thêm môn, sao lưu
src/components/     thẻ câu hỏi, giải thích (có nút sửa), đồng hồ, bảng số câu, màn hình xem trước...
src/hooks/          nạp danh sách môn, lưu tiến độ, kho giải thích đã sửa
src/utils/          các hàm thuần (xáo trộn, chọn câu thi, chấm điểm, danh sách sai, tách đề thô, ...)
src/tests/          test Vitest
```

## Lưu ý

- Dữ liệu chỉ nằm trong trình duyệt. Xóa dữ liệu duyệt web (hoặc đổi máy) là mất, hãy dùng **Sao lưu** định kỳ.
- Mỗi môn có khóa lưu riêng theo `id` môn, nên thêm môn mới không ảnh hưởng tiến độ của môn khác.

## Đưa lên GitHub Pages (để xem trên điện thoại)

Repo đã có sẵn workflow `.github/workflows/deploy.yml`: mỗi lần đẩy code lên nhánh `main` sẽ tự chạy test, build và đăng web.

1. Tạo repo trên GitHub, đẩy code lên nhánh `main`.
2. Vào repo → **Settings → Pages → Build and deployment → Source** chọn **GitHub Actions**.
3. Đợi tab **Actions** chạy xong (khoảng 1-2 phút). Địa chỉ web: `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

Dữ liệu học nằm trong trình duyệt của từng thiết bị, nên điện thoại và máy tính có tiến độ riêng. Muốn chuyển, dùng **Sao lưu** rồi **Khôi phục** (nút ở trang chủ).
