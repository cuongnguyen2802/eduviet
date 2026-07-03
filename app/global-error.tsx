"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi">
      <body>
        <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "sans-serif", textAlign: "center", padding: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Ứng dụng gặp sự cố nghiêm trọng</h1>
          <p style={{ color: "#666", maxWidth: 400 }}>Vui lòng thử tải lại trang.</p>
          <button
            onClick={reset}
            style={{ padding: "8px 16px", borderRadius: 6, background: "#ea580c", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
