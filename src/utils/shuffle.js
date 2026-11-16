// Fisher-Yates: xáo trộn đều, trả về MẢNG MỚI (không sửa mảng gốc).
// rng truyền vào được để kiểm tra bằng test (mặc định Math.random).
export function shuffle(array, rng = Math.random) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)) // chọn vị trí ngẫu nhiên từ 0..i
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
