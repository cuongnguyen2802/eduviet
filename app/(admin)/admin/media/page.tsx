import { MediaLibraryManager } from "@/components/admin/media-library-manager";

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Thư viện ảnh</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Kéo thả ảnh vào đây để tải lên. Ảnh trong thư viện có thể chèn trực tiếp vào trình soạn thảo nội dung
        (bài blog, mô tả khóa học...).
      </p>
      <MediaLibraryManager />
    </div>
  );
}
