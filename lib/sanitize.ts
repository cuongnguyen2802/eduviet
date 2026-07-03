import sanitizeHtmlLib from "sanitize-html";

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
 *
 * Dùng "sanitize-html" (thuần CJS, không phụ thuộc jsdom) thay vì isomorphic-dompurify — package đó
 * kéo theo jsdom -> html-encoding-sniffer, bản mới của html-encoding-sniffer require() một package
 * ESM-only (@exodus/bytes) nên crash với ERR_REQUIRE_ESM trên môi trường serverless của Vercel dù
 * chạy bình thường ở local dev/build.
 */
export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
  });
}

/** Bỏ hết thẻ HTML, chỉ giữ lại text thuần — dùng cho meta description / excerpt. */
export function stripHtml(html: string): string {
  return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
