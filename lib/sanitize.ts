import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h2",
  "h3",
  "h4",
  "img",
  "code",
  "pre",
];

/**
 * Làm sạch HTML do người dùng (giảng viên/admin) nhập qua trình soạn thảo trước khi render bằng
 * dangerouslySetInnerHTML — bắt buộc dù tác giả là tài khoản đã xác thực, để chống XSS nếu tài khoản
 * bị chiếm quyền hoặc trình soạn thảo bị qua mặt.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "src", "alt", "target", "rel"],
  });
}

/** Bỏ hết thẻ HTML, chỉ giữ lại text thuần — dùng cho meta description / excerpt. */
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }).trim();
}
