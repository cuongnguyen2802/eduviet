import { sanitizeHtml } from "@/lib/sanitize";

/**
 * Render nội dung từ RichTextEditor (HTML) hoặc dữ liệu cũ dạng text thuần (trước khi có trình soạn thảo).
 * Heuristic: nếu không chứa thẻ HTML nào thì coi là text thuần, tự ngắt đoạn theo dòng trống.
 */
export function RichContent({ html, className }: { html: string; className?: string }) {
  const isPlainText = !/<[a-z][\s\S]*>/i.test(html);

  if (isPlainText) {
    const paragraphs = html.split(/\n\s*\n/).filter(Boolean);
    return (
      <div className={className}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    );
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}
