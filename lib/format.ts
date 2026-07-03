const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export function formatVND(amount: number | string) {
  return vndFormatter.format(Number(amount));
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Định dạng tổng thời lượng dạng "Xh Ym" (hoặc chỉ "Ym" nếu dưới 1 giờ) — dùng cho tổng thời lượng khóa học/chương. */
export function formatTotalDuration(totalSeconds: number) {
  const totalMinutes = Math.round(totalSeconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} phút`;
  return m === 0 ? `${h} giờ` : `${h} giờ ${m} phút`;
}
