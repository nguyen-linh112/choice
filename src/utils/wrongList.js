// Danh sách câu sai của 1 môn. Dạng: { [questionId]: { wrongCount, streak, lastSeen } }
//   wrongCount: số lần sai;  streak: số lần ĐÚNG LIÊN TIẾP gần nhất trong thi thử;  lastSeen: mốc thời gian gặp gần nhất
// Chỉ kết quả THI THỬ mới cập nhật danh sách này (ôn câu sai chỉ để xem lại, không tính).

export const STREAK_TO_LEAVE = 3 // đúng 3 lần liên tiếp mới được ra khỏi danh sách

// results: [{ id, correct }] của 1 bài thi (bỏ trống tính là sai). Trả về danh sách MỚI, không sửa danh sách cũ.
export function updateWrongList(list, results, now = Date.now()) {
  const next = { ...list }
  for (const { id, correct } of results) {
    const cur = next[id]
    if (!correct) {
      // Sai hoặc bỏ trống: thêm vào (hoặc tăng số lần sai) và đưa chuỗi đúng về 0
      next[id] = { wrongCount: (cur?.wrongCount || 0) + 1, streak: 0, lastSeen: now }
    } else if (cur) {
      // Đang trong danh sách mà làm đúng: tăng chuỗi; đủ 3 lần liên tiếp thì ra khỏi danh sách
      const streak = cur.streak + 1
      if (streak >= STREAK_TO_LEAVE) delete next[id]
      else next[id] = { ...cur, streak, lastSeen: now }
    }
    // Đúng mà không nằm trong danh sách: không làm gì
  }
  return next
}

// Bỏ thủ công 1 câu khỏi danh sách
export function removeFromWrongList(list, id) {
  const next = { ...list }
  delete next[id]
  return next
}

// Ưu tiên: sai nhiều lần nhất trước; bằng nhau thì câu lâu chưa gặp lại (lastSeen nhỏ hơn) trước
export function compareWrongPriority(list) {
  return (a, b) => list[b].wrongCount - list[a].wrongCount || (list[a].lastSeen || 0) - (list[b].lastSeen || 0)
}

export const sortedWrongIds = (list) => Object.keys(list).sort(compareWrongPriority(list))
