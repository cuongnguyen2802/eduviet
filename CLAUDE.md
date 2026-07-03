# CLAUDE.md — [Tên dự án] (Nền tảng học trực tuyến kiểu Unica.vn)

> File này cung cấp context cho Claude Code khi làm việc trên dự án. Đọc kỹ trước khi code.

## 1. Tổng quan dự án

Xây dựng một **marketplace khóa học video online** dành cho thị trường Việt Nam, mô hình tương tự Unica.vn: giảng viên đăng khóa học (video bài giảng), học viên mua trọn đời (hoặc theo gói membership), học theo tiến độ riêng, tương tác qua phần hỏi đáp/thảo luận.

**3 nhóm người dùng chính:**
- **Học viên (Student)** — tìm, mua, học khóa học, theo dõi tiến độ, nhận chứng chỉ.
- **Giảng viên (Instructor)** — tạo/quản lý khóa học, upload video, xem doanh thu, trả lời học viên.
- **Admin** — duyệt khóa học, quản lý người dùng, danh mục, coupon, báo cáo doanh thu, chia sẻ hoa hồng affiliate.

**Mô hình kinh doanh:**
- Bán khóa học theo hình thức mua 1 lần, học trọn đời (giống Unica).
- Có thể mở rộng gói Membership (subscription) trả theo tháng/năm để học không giới hạn.
- Chương trình Affiliate/Coupon cho marketer.
- Gói doanh nghiệp (B2B) — đào tạo nội bộ, theo dõi tiến độ nhân viên (giai đoạn sau).

## 2. Tech stack (bắt buộc theo, đồng bộ với các dự án khác)

- **Framework:** Next.js 14 (App Router), TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **Auth:** Supabase Auth (email/password + Google OAuth), phân quyền theo role (student/instructor/admin)
- **Video storage/streaming:**
  - **Phase 1 (demo/MVP):** YouTube (chế độ **Unlisted**), nhúng qua YouTube IFrame Player API. Không tốn chi phí hạ tầng, phát mượt (adaptive streaming có sẵn), phù hợp demo khách hàng — không tối ưu chống crack link, chưa bảo vệ nội dung khỏi rò rỉ.
  - **Phase 2 (production thật, có doanh thu):** chuyển sang Mux hoặc Cloudflare Stream (signed URL/token hết hạn, chống tải video tốt hơn) khi cần bảo vệ nội dung khóa học trả phí.
- **Thanh toán:** VNPay và MoMo (nội địa, bắt buộc cho thị trường VN) + Stripe (nếu mở rộng học viên quốc tế)
- **File/hình ảnh:** Supabase Storage hoặc Cloudflare Images
- **Deploy:** Vercel (frontend/API), Supabase Cloud (DB), Mux/Cloudflare (video)
- **Khác:** Resend hoặc SendGrid (email), React Query hoặc SWR (data fetching client), Zod (validate), React Hook Form

## 3. Tính năng cốt lõi (MVP)

### 3.1 Học viên
- Đăng ký/đăng nhập (email, Google)
- Trang chủ: khóa học nổi bật, theo danh mục, khuyến mãi
- Tìm kiếm & lọc khóa học (danh mục, giá, cấp độ, đánh giá, giảng viên)
- Trang chi tiết khóa học: mô tả, mục tiêu, chương trình học (curriculum), preview 1-2 video miễn phí, đánh giá học viên, thông tin giảng viên
- Giỏ hàng + áp mã giảm giá (coupon)
- Thanh toán qua VNPay/MoMo, nhận email xác nhận
- Trang "Khóa học của tôi": danh sách khóa học đã mua, % tiến độ
- Trình phát video: đánh dấu bài đã học, tiếp tục từ vị trí đang xem, tốc độ phát, ghi chú
- Hỏi đáp (Q&A) trong từng bài học — học viên hỏi, giảng viên/trợ giảng trả lời
- Đánh giá & review khóa học sau khi học
- Chứng chỉ hoàn thành (PDF, tự động generate khi học xong 100%)
- Wishlist (lưu khóa học yêu thích)

### 3.2 Giảng viên
- Đăng ký làm giảng viên (form + admin duyệt)
- Dashboard: danh sách khóa học, doanh thu, số học viên, đánh giá trung bình
- Tạo/sửa khóa học: tiêu đề, mô tả, ảnh cover, giá, danh mục, cấp độ
- Quản lý curriculum: chương (section) → bài học (lesson: video/tài liệu/quiz)
- Upload video bài giảng (qua Mux/Cloudflare)
- Trả lời câu hỏi học viên
- Xem báo cáo doanh thu, lịch sử rút tiền

### 3.3 Admin
- Duyệt khóa học trước khi public
- Quản lý danh mục, tag
- Quản lý người dùng (khóa/mở tài khoản, đổi role)
- Quản lý coupon, chương trình khuyến mãi
- Quản lý affiliate: tạo link, theo dõi hoa hồng, duyệt chi trả
- Dashboard doanh thu tổng: theo tháng, theo khóa học, theo giảng viên
- Cấu hình % chia sẻ doanh thu với giảng viên

## 4. Tính năng mở rộng (Phase 2+)

- Gói Membership/Subscription (học không giới hạn số khóa học theo tháng)
- App mobile (React Native hoặc PWA)
- Live class / webinar (Zoom integration hoặc tự build qua LiveKit)
- Nhóm thảo luận riêng theo khóa học (giống group Facebook/Zalo mà Unica dùng ngoài platform)
- Gói doanh nghiệp: admin doanh nghiệp gán khóa học cho nhân viên, xem báo cáo tiến độ
- Gợi ý khóa học theo AI (dựa lịch sử học/xem)
- Đa ngôn ngữ (VI/EN)

## 5. Data model chính (Prisma — phác thảo)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  role          Role     @default(STUDENT)
  avatarUrl     String?
  createdAt     DateTime @default(now())
  courses       Course[]        @relation("InstructorCourses")
  enrollments   Enrollment[]
  reviews       Review[]
  questions     Question[]
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

model Course {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  description   String
  price         Decimal
  discountPrice Decimal?
  coverImageUrl String?
  level         String   // beginner/intermediate/advanced
  status        CourseStatus @default(DRAFT)
  instructorId  String
  instructor    User     @relation("InstructorCourses", fields: [instructorId], references: [id])
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])
  sections      Section[]
  enrollments   Enrollment[]
  reviews       Review[]
  createdAt     DateTime @default(now())
}

enum CourseStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  REJECTED
}

model Section {
  id        String   @id @default(cuid())
  title     String
  order     Int
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])
  lessons   Lesson[]
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  order       Int
  type        LessonType @default(VIDEO)
  youtubeVideoId String? // ID video YouTube (Unlisted), vd: "dQw4w9WgXcQ" — Phase 1
  videoAssetId String? // ID video trên Mux/Cloudflare Stream — dùng khi chuyển Phase 2
  durationSec Int?
  isPreview   Boolean  @default(false)
  sectionId   String
  section     Section  @relation(fields: [sectionId], references: [id])
  progress    LessonProgress[]
}

enum LessonType {
  VIDEO
  DOCUMENT
  QUIZ
}

model Enrollment {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  courseId     String
  course       Course   @relation(fields: [courseId], references: [id])
  progressPct  Int      @default(0)
  completedAt  DateTime?
  purchasedAt  DateTime @default(now())
  @@unique([userId, courseId])
}

model LessonProgress {
  id          String   @id @default(cuid())
  enrollmentId String
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  completed   Boolean  @default(false)
  lastPositionSec Int  @default(0)
}

model Category {
  id      String   @id @default(cuid())
  name    String
  slug    String   @unique
  courses Course[]
}

model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5
  comment   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])
  createdAt DateTime @default(now())
}

model Question {
  id        String   @id @default(cuid())
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  lessonId  String
  createdAt DateTime @default(now())
  answers   Answer[]
}

model Answer {
  id         String   @id @default(cuid())
  content    String
  questionId String
  question   Question @relation(fields: [questionId], references: [id])
  userId     String
  createdAt  DateTime @default(now())
}

model Coupon {
  id           String   @id @default(cuid())
  code         String   @unique
  discountPct  Int
  expiresAt    DateTime?
  maxUses      Int?
  usedCount    Int      @default(0)
}

model Order {
  id          String   @id @default(cuid())
  userId      String
  totalAmount Decimal
  status      OrderStatus @default(PENDING)
  paymentMethod String // VNPAY, MOMO, STRIPE
  paymentRef  String?
  createdAt   DateTime @default(now())
  items       OrderItem[]
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model OrderItem {
  id       String  @id @default(cuid())
  orderId  String
  order    Order   @relation(fields: [orderId], references: [id])
  courseId String
  price    Decimal
}
```

## 6. Cấu trúc thư mục (Next.js App Router)

```
/app
  /(marketing)/page.tsx              # trang chủ
  /(marketing)/courses/page.tsx      # danh sách khóa học
  /(marketing)/courses/[slug]/page.tsx  # chi tiết khóa học
  /(auth)/login, /register
  /(student)/dashboard               # khóa học của tôi
  /(student)/learn/[courseId]/[lessonId]/page.tsx  # trình phát học
  /(instructor)/instructor/dashboard
  /(instructor)/instructor/courses/[id]/edit
  /(admin)/admin/...
  /api/checkout, /api/webhooks/vnpay, /api/webhooks/momo
/components
  /ui        # shadcn components
  /course    # CourseCard, CourseCurriculum, VideoPlayer...
  /dashboard
/lib
  /prisma.ts
  /supabase.ts
  /payments  # vnpay.ts, momo.ts
/prisma/schema.prisma
```

## 7. Quy tắc code

- Ưu tiên Server Components; chỉ dùng `"use client"` khi cần state/interactivity (video player, form, giỏ hàng).
- Validate input bằng Zod ở cả client (React Hook Form) và server (API route/Server Action).
- Toàn bộ thao tác ghi dữ liệu (mua khóa học, cập nhật tiến độ) đi qua Server Action hoặc API route, không gọi Prisma trực tiếp từ client.
- Giá tiền lưu dạng `Decimal`, hiển thị định dạng VNĐ (`Intl.NumberFormat('vi-VN')`).
- Webhook thanh toán (VNPay/MoMo) phải verify chữ ký trước khi cập nhật `Order.status`.
- **Video (Phase 1 — YouTube Unlisted):**
  - Nhúng bằng YouTube IFrame Player API (`youtubeVideoId`), không dùng thẻ `<iframe src="youtube.com/embed/...">` tĩnh — cần API để bắt sự kiện `onStateChange`/`getCurrentTime()` tính tiến độ xem, lưu vào `LessonProgress`.
  - Bật **domain restriction** trên YouTube Studio để chỉ cho phép nhúng từ domain của app, hạn chế bị nhúng lại ở nơi khác.
  - Đây là phương án tạm cho demo/MVP — không đảm bảo chống tải/chia sẻ video, không dùng khi đã có khóa học thu phí thật với số lượng học viên lớn.
  - Video: khi chuyển sang Phase 2 (Mux/Cloudflare), không bao giờ trả trực tiếp URL gốc cho client — luôn dùng signed URL / playback token có thời hạn ngắn.

## 8. Roadmap đề xuất

1. **Phase 1 (MVP/Demo):** Auth, CRUD khóa học, curriculum, video player YouTube Unlisted (qua IFrame API), mua khóa học qua VNPay/MoMo, dashboard học viên đơn giản.
2. **Phase 2:** Dashboard giảng viên đầy đủ, Q&A, review, coupon, chứng chỉ.
3. **Phase 3:** Affiliate, admin panel đầy đủ, báo cáo doanh thu.
4. **Phase 4:** Membership/subscription, gói doanh nghiệp, mobile app.

## 9. Ghi chú

- Đây là file spec khởi tạo — cập nhật liên tục khi có quyết định kỹ trọng (đổi tech stack, đổi data model...).
- Nếu file này phình to, tách theo pattern đã dùng ở các dự án khác: `docs/features.md`, `docs/data-model.md`, `docs/payments.md`, chỉ giữ tổng quan + link ở CLAUDE.md gốc.
