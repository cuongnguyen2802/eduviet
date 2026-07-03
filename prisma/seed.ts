import { PrismaClient, Role, CourseStatus, CourseLevel, LessonType } from "@prisma/client";

const prisma = new PrismaClient();

const YT = "dQw4w9WgXcQ";

async function main() {
  // ── Danh mục (2 cấp: danh mục cha dùng cho mega menu, danh mục con gán vào khóa học) ──
  const categoryTree = [
    {
      name: "Kinh doanh & Khởi nghiệp",
      slug: "kinh-doanh-khoi-nghiep",
      icon: "Briefcase",
      children: [
        { name: "Quản trị kinh doanh", slug: "quan-tri-kinh-doanh" },
        { name: "Khởi nghiệp", slug: "khoi-nghiep" },
      ],
    },
    {
      name: "Marketing",
      slug: "marketing",
      icon: "TrendingUp",
      children: [
        { name: "Marketing số", slug: "marketing-so" },
        { name: "SEO & Content", slug: "seo-content" },
      ],
    },
    {
      name: "Thiết kế",
      slug: "thiet-ke",
      icon: "Palette",
      children: [
        { name: "Thiết kế đồ họa", slug: "thiet-ke-do-hoa" },
        { name: "UI/UX", slug: "ui-ux" },
      ],
    },
    {
      name: "Công nghệ thông tin",
      slug: "cong-nghe-thong-tin",
      icon: "Monitor",
      children: [
        { name: "Lập trình web", slug: "lap-trinh-web" },
        { name: "Tin học văn phòng", slug: "tin-hoc-van-phong" },
      ],
    },
    {
      name: "Ngoại ngữ",
      slug: "ngoai-ngu",
      icon: "Languages",
      children: [
        { name: "Tiếng Anh", slug: "tieng-anh" },
        { name: "Tiếng Nhật", slug: "tieng-nhat" },
      ],
    },
  ];

  const categories: { id: string; slug: string }[] = [];
  for (const top of categoryTree) {
    const parent = await prisma.category.upsert({
      where: { slug: top.slug },
      update: { icon: top.icon, parentId: null },
      create: { name: top.name, slug: top.slug, icon: top.icon },
    });
    categories.push(parent);

    for (const child of top.children) {
      const created = await prisma.category.upsert({
        where: { slug: child.slug },
        update: { parentId: parent.id },
        create: { name: child.name, slug: child.slug, parentId: parent.id },
      });
      categories.push(created);
    }
  }
  const catBy = (slug: string) => categories.find((c) => c.slug === slug)!;

  // ── Người dùng mẫu (dữ liệu, KHÔNG đăng nhập được vì không có Supabase Auth thật) ──
  const instructor = await prisma.user.upsert({
    where: { email: "giangvien@example.com" },
    update: {},
    create: {
      authId: "seed-instructor-auth-id",
      email: "giangvien@example.com",
      name: "Nguyễn Văn A",
      role: Role.INSTRUCTOR,
      bio: "Giảng viên với 10 năm kinh nghiệm trong lĩnh vực Marketing số và thiết kế.",
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "hocvien@example.com" },
    update: {},
    create: {
      authId: "seed-student-auth-id",
      email: "hocvien@example.com",
      name: "Trần Thị B",
      role: Role.STUDENT,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "hocvien2@example.com" },
    update: {},
    create: {
      authId: "seed-student2-auth-id",
      email: "hocvien2@example.com",
      name: "Lê Văn C",
      role: Role.STUDENT,
    },
  });

  // ── 5 giảng viên bổ sung, mỗi người một chuyên môn riêng ──────
  const instructor2 = await prisma.user.upsert({
    where: { email: "giangvien2@example.com" },
    update: {},
    create: {
      authId: "seed-instructor2-auth-id",
      email: "giangvien2@example.com",
      name: "Phạm Thị Hương",
      role: Role.INSTRUCTOR,
      bio: "UI/UX Designer với 8 năm kinh nghiệm thiết kế sản phẩm số cho các công ty công nghệ tại Việt Nam.",
    },
  });

  const instructor3 = await prisma.user.upsert({
    where: { email: "giangvien3@example.com" },
    update: {},
    create: {
      authId: "seed-instructor3-auth-id",
      email: "giangvien3@example.com",
      name: "Trần Minh Khoa",
      role: Role.INSTRUCTOR,
      bio: "Full-stack Developer, từng làm việc tại nhiều startup công nghệ, chuyên sâu về React và Node.js.",
    },
  });

  const instructor4 = await prisma.user.upsert({
    where: { email: "giangvien4@example.com" },
    update: {},
    create: {
      authId: "seed-instructor4-auth-id",
      email: "giangvien4@example.com",
      name: "Đỗ Thanh Tùng",
      role: Role.INSTRUCTOR,
      bio: "Giảng viên tiếng Anh và tin học văn phòng với hơn 12 năm kinh nghiệm đào tạo doanh nghiệp.",
    },
  });

  const instructor5 = await prisma.user.upsert({
    where: { email: "giangvien5@example.com" },
    update: {},
    create: {
      authId: "seed-instructor5-auth-id",
      email: "giangvien5@example.com",
      name: "Ngô Thị Lan",
      role: Role.INSTRUCTOR,
      bio: "Chuyên gia tư vấn khởi nghiệp và quản trị nhân sự, đồng sáng lập 2 doanh nghiệp vừa và nhỏ.",
    },
  });

  const instructor6 = await prisma.user.upsert({
    where: { email: "giangvien6@example.com" },
    update: {},
    create: {
      authId: "seed-instructor6-auth-id",
      email: "giangvien6@example.com",
      name: "Vũ Đức Anh",
      role: Role.INSTRUCTOR,
      bio: "Thạc sĩ Ngôn ngữ Nhật Bản, có 10 năm kinh nghiệm giảng dạy và luyện thi JLPT tại Việt Nam.",
    },
  });

  // Tài khoản thật bạn đã đăng ký qua Supabase Auth — gắn thêm dữ liệu để test trực tiếp trên UI.
  const me = await prisma.user.findUnique({ where: { email: "ntcuong2802@gmail.com" } });

  // ── Helper tạo khóa học ───────────────────────────────────
  type LessonSeed = {
    title: string;
    type?: LessonType;
    youtubeVideoId?: string;
    content?: string;
    durationSec?: number;
    isPreview?: boolean;
  };
  type SectionSeed = { title: string; lessons: LessonSeed[] };

  async function upsertCourse(params: {
    slug: string;
    title: string;
    description: string;
    learnOutcomes: string[];
    price: number;
    discountPrice?: number;
    coverImageUrl: string;
    level: CourseLevel;
    status: CourseStatus;
    rejectReason?: string;
    instructorId: string;
    categoryId: string;
    sections: SectionSeed[];
  }) {
    const existing = await prisma.course.findUnique({ where: { slug: params.slug } });
    if (existing) {
      // Đồng bộ lại categoryId nếu chạy seed lại sau khi đổi cấu trúc danh mục.
      return prisma.course.update({ where: { id: existing.id }, data: { categoryId: params.categoryId } });
    }

    return prisma.course.create({
      data: {
        title: params.title,
        slug: params.slug,
        description: params.description,
        learnOutcomes: params.learnOutcomes,
        price: params.price,
        discountPrice: params.discountPrice,
        coverImageUrl: params.coverImageUrl,
        level: params.level,
        status: params.status,
        rejectReason: params.rejectReason,
        instructorId: params.instructorId,
        categoryId: params.categoryId,
        sections: {
          create: params.sections.map((s, si) => ({
            title: s.title,
            order: si + 1,
            lessons: {
              create: s.lessons.map((l, li) => ({
                title: l.title,
                order: li + 1,
                type: l.type ?? LessonType.VIDEO,
                youtubeVideoId: l.youtubeVideoId,
                content: l.content,
                durationSec: l.durationSec,
                isPreview: l.isPreview ?? false,
              })),
            },
          })),
        },
      },
    });
  }

  // ── 1. Marketing Facebook — PUBLISHED ──────────────────────
  const courseA = await upsertCourse({
    slug: "marketing-facebook-tu-a-den-z",
    title: "Marketing Facebook Từ A Đến Z",
    description:
      "Khóa học giúp bạn nắm vững toàn bộ kiến thức chạy quảng cáo Facebook, từ thiết lập chiến dịch đến tối ưu chi phí.",
    learnOutcomes: [
      "Thiết lập Facebook Business Manager chuyên nghiệp",
      "Xây dựng chiến dịch quảng cáo hiệu quả",
      "Tối ưu ngân sách và đo lường ROI",
    ],
    price: 599000,
    discountPrice: 299000,
    coverImageUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor.id,
    categoryId: catBy("marketing-so").id,
    sections: [
      {
        title: "Chương 1: Nhập môn Facebook Ads",
        lessons: [
          { title: "Giới thiệu khóa học", youtubeVideoId: YT, durationSec: 320, isPreview: true },
          { title: "Thiết lập Business Manager", youtubeVideoId: YT, durationSec: 540 },
        ],
      },
      {
        title: "Chương 2: Chạy chiến dịch đầu tiên",
        lessons: [
          { title: "Cấu trúc chiến dịch - nhóm quảng cáo - quảng cáo", youtubeVideoId: YT, durationSec: 610 },
          {
            title: "Tài liệu: Checklist trước khi lên chiến dịch",
            type: LessonType.DOCUMENT,
            content: "Checklist chi tiết đính kèm dưới dạng PDF.",
          },
        ],
      },
    ],
  });

  // ── 2. Canva — PUBLISHED ────────────────────────────────────
  const courseB = await upsertCourse({
    slug: "thiet-ke-do-hoa-voi-canva",
    title: "Thiết Kế Đồ Họa Với Canva Cho Người Mới Bắt Đầu",
    description: "Học cách thiết kế poster, banner, content mạng xã hội chuyên nghiệp chỉ với Canva miễn phí.",
    learnOutcomes: ["Thành thạo giao diện Canva", "Thiết kế bộ nhận diện thương hiệu cơ bản", "Tạo content social chuyên nghiệp"],
    price: 399000,
    discountPrice: 199000,
    coverImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor.id,
    categoryId: catBy("thiet-ke-do-hoa").id,
    sections: [
      {
        title: "Chương 1: Làm quen với Canva",
        lessons: [
          { title: "Tổng quan giao diện Canva", youtubeVideoId: YT, durationSec: 280, isPreview: true },
          { title: "Nguyên lý màu sắc & bố cục", youtubeVideoId: YT, durationSec: 420 },
        ],
      },
      {
        title: "Chương 2: Thực hành thiết kế",
        lessons: [{ title: "Thiết kế bộ ảnh bìa Facebook/Instagram", youtubeVideoId: YT, durationSec: 500 }],
      },
    ],
  });

  // ── 3. Next.js — PENDING_REVIEW ─────────────────────────────
  const courseC = await upsertCourse({
    slug: "lap-trinh-web-voi-nextjs-co-ban",
    title: "Lập Trình Web Với Next.js Cơ Bản",
    description: "Xây dựng ứng dụng web full-stack hiện đại với Next.js, TypeScript và Tailwind CSS từ con số 0.",
    learnOutcomes: ["Nắm vững App Router", "Xây dựng API Route & Server Action", "Triển khai ứng dụng lên Vercel"],
    price: 799000,
    coverImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PENDING_REVIEW,
    instructorId: instructor.id,
    categoryId: catBy("lap-trinh-web").id,
    sections: [
      {
        title: "Chương 1: Khởi động dự án",
        lessons: [
          { title: "Cài đặt môi trường & tạo dự án", youtubeVideoId: YT, durationSec: 360, isPreview: true },
          { title: "Routing & Layout trong App Router", youtubeVideoId: YT, durationSec: 480 },
        ],
      },
    ],
  });

  // ── 4. Tiếng Anh — DRAFT ─────────────────────────────────────
  const courseD = await upsertCourse({
    slug: "tieng-anh-giao-tiep-cap-toc-30-ngay",
    title: "Tiếng Anh Giao Tiếp Cấp Tốc 30 Ngày",
    description: "Lộ trình 30 ngày giúp bạn tự tin giao tiếp tiếng Anh trong công việc và cuộc sống hàng ngày.",
    learnOutcomes: ["Phản xạ giao tiếp cơ bản", "500 mẫu câu thông dụng", "Phát âm chuẩn IPA"],
    price: 499000,
    coverImageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.DRAFT,
    instructorId: instructor.id,
    categoryId: catBy("tieng-anh").id,
    sections: [
      { title: "Chương 1: Phát âm nền tảng", lessons: [{ title: "Bảng phiên âm IPA", youtubeVideoId: YT, durationSec: 300 }] },
    ],
  });

  // ── 5. Khởi nghiệp tinh gọn — REJECTED ────────────────────────
  const courseE = await upsertCourse({
    slug: "khoi-nghiep-tinh-gon-cho-nguoi-moi",
    title: "Khởi Nghiệp Tinh Gọn Cho Người Mới",
    description: "Áp dụng phương pháp Lean Startup để kiểm định ý tưởng kinh doanh trước khi đầu tư nguồn lực lớn.",
    learnOutcomes: ["Xây dựng MVP", "Phỏng vấn khách hàng", "Mô hình Business Model Canvas"],
    price: 699000,
    coverImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.REJECTED,
    rejectReason: "Nội dung chương 2 còn sơ sài, cần bổ sung thêm ví dụ thực tế trước khi duyệt lại.",
    instructorId: instructor.id,
    categoryId: catBy("khoi-nghiep").id,
    sections: [
      { title: "Chương 1: Tư duy Lean Startup", lessons: [{ title: "Vì sao 90% startup thất bại", youtubeVideoId: YT, durationSec: 400 }] },
    ],
  });

  // ── 6. SEO — PUBLISHED (dùng để test wishlist, không enroll) ──
  const courseF = await upsertCourse({
    slug: "seo-website-tu-co-ban-den-nang-cao",
    title: "SEO Website Từ Cơ Bản Đến Nâng Cao",
    description: "Chiến lược SEO tổng thể giúp website lên top Google bền vững, từ audit kỹ thuật đến xây dựng nội dung.",
    learnOutcomes: ["SEO Audit kỹ thuật", "Nghiên cứu từ khóa", "Xây dựng backlink chất lượng"],
    price: 899000,
    discountPrice: 549000,
    coverImageUrl: "https://images.unsplash.com/photo-1571677246347-5040036b95cc",
    level: CourseLevel.ADVANCED,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor.id,
    categoryId: catBy("seo-content").id,
    sections: [
      {
        title: "Chương 1: Nền tảng SEO",
        lessons: [{ title: "SEO là gì? Vì sao doanh nghiệp cần SEO", youtubeVideoId: YT, durationSec: 350, isPreview: true }],
      },
    ],
  });

  // ── 7 & 8: khóa học gắn với tài khoản thật của bạn (nếu đã đăng ký) ──
  let courseG: Awaited<ReturnType<typeof upsertCourse>> | null = null;
  let courseH: Awaited<ReturnType<typeof upsertCourse>> | null = null;

  if (me) {
    courseG = await upsertCourse({
      slug: "excel-van-phong-tu-co-ban-den-chuyen-sau",
      title: "Excel Văn Phòng Từ Cơ Bản Đến Chuyên Sâu",
      description: "Thành thạo Excel với hàm công thức, Pivot Table, Dashboard báo cáo tự động cho công việc văn phòng.",
      learnOutcomes: ["Hàm Excel thông dụng", "Pivot Table & biểu đồ", "Tự động hóa báo cáo"],
      price: 349000,
      discountPrice: 199000,
      coverImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      instructorId: me.id,
      categoryId: catBy("tin-hoc-van-phong").id,
      sections: [
        {
          title: "Chương 1: Hàm cơ bản",
          lessons: [
            { title: "Tổng quan giao diện Excel", youtubeVideoId: YT, durationSec: 300, isPreview: true },
            { title: "Hàm SUM, IF, VLOOKUP", youtubeVideoId: YT, durationSec: 460 },
          ],
        },
      ],
    });

    // Khóa học DRAFT của chính bạn — dùng để bấm nút "Gửi duyệt khóa học" rồi tự duyệt bằng quyền Admin, test full vòng lặp.
    courseH = await upsertCourse({
      slug: "xay-dung-thuong-hieu-ca-nhan-tren-mang-xa-hoi",
      title: "Xây Dựng Thương Hiệu Cá Nhân Trên Mạng Xã Hội",
      description: "Chiến lược xây dựng thương hiệu cá nhân, tăng follow và chuyển đổi khách hàng trên mạng xã hội.",
      learnOutcomes: ["Định vị thương hiệu cá nhân", "Xây dựng nội dung nhất quán", "Chuyển đổi follower thành khách hàng"],
      price: 449000,
      coverImageUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf",
      level: CourseLevel.BEGINNER,
      status: CourseStatus.DRAFT,
      instructorId: me.id,
      categoryId: catBy("quan-tri-kinh-doanh").id,
      sections: [
        {
          title: "Chương 1: Định vị bản thân",
          lessons: [{ title: "Xác định thế mạnh & đối tượng mục tiêu", youtubeVideoId: YT, durationSec: 320, isPreview: true }],
        },
      ],
    });
  } else {
    console.warn(
      "Không tìm thấy user ntcuong2802@gmail.com trong DB — bỏ qua phần gắn dữ liệu vào tài khoản thật. Hãy đăng ký tài khoản trên app rồi chạy lại `npm run db:seed`."
    );
  }

  // ── 9. UI/UX Design cơ bản — PUBLISHED ──────────────────────
  const courseI = await upsertCourse({
    slug: "ui-ux-design-nen-tang-cho-nguoi-moi-bat-dau",
    title: "UI/UX Design Nền Tảng Cho Người Mới Bắt Đầu",
    description:
      "Nắm vững quy trình thiết kế trải nghiệm người dùng từ nghiên cứu, wireframe đến prototype hoàn chỉnh.",
    learnOutcomes: ["Tư duy UX Research cơ bản", "Xây dựng wireframe & prototype", "Nguyên tắc thiết kế UI hiện đại"],
    price: 699000,
    discountPrice: 399000,
    coverImageUrl: "https://images.unsplash.com/photo-1559028006-448665bd7c7f",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor2.id,
    categoryId: catBy("ui-ux").id,
    sections: [
      {
        title: "Chương 1: Tư duy thiết kế trải nghiệm",
        lessons: [
          { title: "UX vs UI khác nhau như thế nào", youtubeVideoId: YT, durationSec: 340, isPreview: true },
          { title: "Quy trình nghiên cứu người dùng cơ bản", youtubeVideoId: YT, durationSec: 500 },
        ],
      },
      {
        title: "Chương 2: Thực hành thiết kế",
        lessons: [{ title: "Xây dựng wireframe cho ứng dụng di động", youtubeVideoId: YT, durationSec: 560 }],
      },
    ],
  });

  // ── 10. Figma — PUBLISHED ────────────────────────────────────
  const courseJ = await upsertCourse({
    slug: "figma-cho-nguoi-moi-bat-dau",
    title: "Figma Cho Người Mới Bắt Đầu",
    description: "Thành thạo công cụ thiết kế Figma từ giao diện, component, auto layout đến bàn giao cho developer.",
    learnOutcomes: ["Thao tác thành thạo Figma", "Xây dựng component & design system", "Bàn giao design cho lập trình viên"],
    price: 499000,
    discountPrice: 249000,
    coverImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor2.id,
    categoryId: catBy("thiet-ke-do-hoa").id,
    sections: [
      {
        title: "Chương 1: Làm quen với Figma",
        lessons: [{ title: "Tổng quan giao diện & công cụ chính", youtubeVideoId: YT, durationSec: 310, isPreview: true }],
      },
      {
        title: "Chương 2: Component & Design System",
        lessons: [{ title: "Xây dựng thư viện component tái sử dụng", youtubeVideoId: YT, durationSec: 480 }],
      },
    ],
  });

  // ── 11. React — PUBLISHED ────────────────────────────────────
  const courseK = await upsertCourse({
    slug: "lap-trinh-react-tu-zero-den-hero",
    title: "Lập Trình React Từ Zero Đến Hero",
    description: "Xây dựng ứng dụng React hiện đại với Hooks, quản lý state và tối ưu hiệu năng cho dự án thực tế.",
    learnOutcomes: ["Thành thạo React Hooks", "Quản lý state với Context/Zustand", "Tối ưu hiệu năng ứng dụng React"],
    price: 899000,
    discountPrice: 549000,
    coverImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor3.id,
    categoryId: catBy("lap-trinh-web").id,
    sections: [
      {
        title: "Chương 1: Nền tảng React",
        lessons: [
          { title: "Component, Props và State", youtubeVideoId: YT, durationSec: 400, isPreview: true },
          { title: "useEffect và vòng đời component", youtubeVideoId: YT, durationSec: 520 },
        ],
      },
      {
        title: "Chương 2: Xây dựng dự án thực tế",
        lessons: [{ title: "Xây dựng ứng dụng Todo List hoàn chỉnh", youtubeVideoId: YT, durationSec: 610 }],
      },
    ],
  });

  // ── 12. Node.js — PUBLISHED ───────────────────────────────────
  const courseL = await upsertCourse({
    slug: "nodejs-backend-development",
    title: "Node.js Backend Development",
    description: "Xây dựng API backend với Node.js, Express và cơ sở dữ liệu quan hệ cho ứng dụng web thực tế.",
    learnOutcomes: ["Xây dựng REST API với Express", "Kết nối và truy vấn cơ sở dữ liệu", "Xác thực người dùng với JWT"],
    price: 899000,
    coverImageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor3.id,
    categoryId: catBy("lap-trinh-web").id,
    sections: [
      {
        title: "Chương 1: Xây dựng API cơ bản",
        lessons: [{ title: "Tạo REST API đầu tiên với Express", youtubeVideoId: YT, durationSec: 450, isPreview: true }],
      },
      {
        title: "Chương 2: Xác thực & bảo mật",
        lessons: [{ title: "Đăng nhập, đăng ký với JWT", youtubeVideoId: YT, durationSec: 540 }],
      },
    ],
  });

  // ── 13. TOEIC — PUBLISHED ──────────────────────────────────────
  const courseM = await upsertCourse({
    slug: "toeic-700-trong-60-ngay",
    title: "TOEIC 700+ Trong 60 Ngày",
    description: "Lộ trình luyện thi TOEIC cấp tốc, tập trung vào chiến lược làm bài và từ vựng trọng tâm theo từng phần thi.",
    learnOutcomes: ["Chiến lược làm bài Listening & Reading", "1000 từ vựng TOEIC thông dụng", "Luyện đề thi thử sát cấu trúc thật"],
    price: 599000,
    discountPrice: 349000,
    coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor4.id,
    categoryId: catBy("tieng-anh").id,
    sections: [
      {
        title: "Chương 1: Chiến lược tổng quan",
        lessons: [{ title: "Cấu trúc đề thi TOEIC và cách phân bổ thời gian", youtubeVideoId: YT, durationSec: 380, isPreview: true }],
      },
      {
        title: "Chương 2: Luyện đề",
        lessons: [{ title: "Luyện đề Reading Part 5-6", youtubeVideoId: YT, durationSec: 500 }],
      },
    ],
  });

  // ── 14. Tiếng Nhật N5 — PUBLISHED ───────────────────────────────
  const courseN = await upsertCourse({
    slug: "tieng-nhat-n5-cho-nguoi-moi-bat-dau",
    title: "Tiếng Nhật N5 Cho Người Mới Bắt Đầu",
    description: "Học tiếng Nhật từ bảng chữ cái Hiragana, Katakana đến ngữ pháp và từ vựng nền tảng trình độ N5.",
    learnOutcomes: ["Đọc thông thạo Hiragana, Katakana", "Ngữ pháp và từ vựng N5", "Giao tiếp cơ bản hàng ngày"],
    price: 549000,
    discountPrice: 299000,
    coverImageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor6.id,
    categoryId: catBy("tieng-nhat").id,
    sections: [
      {
        title: "Chương 1: Bảng chữ cái",
        lessons: [
          { title: "Bảng chữ Hiragana", youtubeVideoId: YT, durationSec: 400, isPreview: true },
          { title: "Bảng chữ Katakana", youtubeVideoId: YT, durationSec: 380 },
        ],
      },
      {
        title: "Chương 2: Ngữ pháp nền tảng",
        lessons: [{ title: "Mẫu câu giới thiệu bản thân", youtubeVideoId: YT, durationSec: 420 }],
      },
    ],
  });

  // ── 15. Khởi nghiệp quán cà phê — PUBLISHED ───────────────────
  const courseO = await upsertCourse({
    slug: "khoi-nghiep-quan-ca-phe-tu-a-den-z",
    title: "Khởi Nghiệp Quán Cà Phê Từ A Đến Z",
    description: "Hướng dẫn toàn diện từ lên ý tưởng, dự toán chi phí, vận hành đến marketing cho quán cà phê nhỏ.",
    learnOutcomes: ["Lập kế hoạch kinh doanh quán cà phê", "Dự toán chi phí đầu tư & vận hành", "Chiến lược marketing địa phương"],
    price: 799000,
    discountPrice: 449000,
    coverImageUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor5.id,
    categoryId: catBy("khoi-nghiep").id,
    sections: [
      {
        title: "Chương 1: Lên kế hoạch",
        lessons: [{ title: "Nghiên cứu thị trường và chọn mặt bằng", youtubeVideoId: YT, durationSec: 460, isPreview: true }],
      },
      {
        title: "Chương 2: Vận hành & marketing",
        lessons: [{ title: "Quản lý vận hành và giữ chân khách hàng", youtubeVideoId: YT, durationSec: 500 }],
      },
    ],
  });

  // ── 16. Quản trị nhân sự — PUBLISHED ───────────────────────────
  const courseP = await upsertCourse({
    slug: "quan-tri-nhan-su-hien-dai",
    title: "Quản Trị Nhân Sự Hiện Đại",
    description: "Xây dựng quy trình tuyển dụng, đào tạo và giữ chân nhân tài phù hợp với doanh nghiệp vừa và nhỏ.",
    learnOutcomes: ["Quy trình tuyển dụng hiệu quả", "Xây dựng lộ trình đào tạo nhân viên", "Chính sách giữ chân nhân tài"],
    price: 749000,
    coverImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor5.id,
    categoryId: catBy("quan-tri-kinh-doanh").id,
    sections: [
      {
        title: "Chương 1: Tuyển dụng",
        lessons: [{ title: "Xây dựng quy trình phỏng vấn hiệu quả", youtubeVideoId: YT, durationSec: 420, isPreview: true }],
      },
      {
        title: "Chương 2: Đào tạo & giữ chân",
        lessons: [{ title: "Xây dựng lộ trình phát triển nhân viên", youtubeVideoId: YT, durationSec: 480 }],
      },
    ],
  });

  // ── 17. Content Marketing đa kênh — PUBLISHED ──────────────────
  const courseQ = await upsertCourse({
    slug: "content-marketing-da-kenh",
    title: "Content Marketing Đa Kênh",
    description: "Xây dựng chiến lược nội dung nhất quán trên Facebook, TikTok, Website giúp tăng nhận diện thương hiệu.",
    learnOutcomes: ["Lập kế hoạch content theo tháng", "Viết content thu hút cho từng nền tảng", "Đo lường hiệu quả content"],
    price: 649000,
    discountPrice: 349000,
    coverImageUrl: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07",
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor.id,
    categoryId: catBy("marketing-so").id,
    sections: [
      {
        title: "Chương 1: Chiến lược nội dung",
        lessons: [{ title: "Xây dựng content pillar cho thương hiệu", youtubeVideoId: YT, durationSec: 400, isPreview: true }],
      },
      {
        title: "Chương 2: Sản xuất & đo lường",
        lessons: [{ title: "Viết content theo từng nền tảng", youtubeVideoId: YT, durationSec: 460 }],
      },
    ],
  });

  // ── 18. PowerPoint — PUBLISHED ─────────────────────────────────
  const courseR = await upsertCourse({
    slug: "powerpoint-chuyen-nghiep-cho-dan-van-phong",
    title: "PowerPoint Chuyên Nghiệp Cho Dân Văn Phòng",
    description: "Thiết kế slide thuyết trình chuyên nghiệp, thu hút và thuyết phục người xem trong công việc hàng ngày.",
    learnOutcomes: ["Nguyên tắc thiết kế slide chuyên nghiệp", "Sử dụng animation hợp lý", "Kỹ năng thuyết trình tự tin"],
    price: 349000,
    discountPrice: 179000,
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    level: CourseLevel.BEGINNER,
    status: CourseStatus.PUBLISHED,
    instructorId: instructor4.id,
    categoryId: catBy("tin-hoc-van-phong").id,
    sections: [
      {
        title: "Chương 1: Nguyên tắc thiết kế slide",
        lessons: [{ title: "Bố cục và màu sắc trong thuyết trình", youtubeVideoId: YT, durationSec: 340, isPreview: true }],
      },
      {
        title: "Chương 2: Hiệu ứng & thuyết trình",
        lessons: [{ title: "Sử dụng animation và transition hợp lý", youtubeVideoId: YT, durationSec: 380 }],
      },
    ],
  });

  // ── Coupon ────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "WELCOME50" },
    update: {},
    create: { code: "WELCOME50", discountPct: 50, maxUses: 100, usedCount: 3 },
  });
  await prisma.coupon.upsert({
    where: { code: "SUMMER20" },
    update: {},
    create: { code: "SUMMER20", discountPct: 20, expiresAt: new Date("2025-08-31"), usedCount: 12 },
  });
  await prisma.coupon.upsert({
    where: { code: "BLACKFRIDAY30" },
    update: {},
    create: { code: "BLACKFRIDAY30", discountPct: 30, isActive: false, usedCount: 40 },
  });

  // ── Enrollment + Order (student1 mua course A & B) ──────────
  async function enrollWithOrder(userId: string, course: { id: string; price: unknown; discountPrice: unknown }) {
    const price = Number(course.discountPrice ?? course.price);

    const existingOrder = await prisma.order.findFirst({
      where: { userId, items: { some: { courseId: course.id } } },
    });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          userId,
          totalAmount: price,
          status: "PAID",
          paymentMethod: "VNPAY",
          paymentRef: `SEED-${course.id.slice(-6)}`,
          items: { create: [{ courseId: course.id, price }] },
        },
      });
    }

    return prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {},
      create: { userId, courseId: course.id },
    });
  }

  await enrollWithOrder(student1.id, courseA);
  const enrollB = await enrollWithOrder(student2.id, courseB);
  await enrollWithOrder(student2.id, courseA);

  // Order thất bại — để test đa dạng trạng thái đơn hàng.
  const hasFailedOrder = await prisma.order.findFirst({ where: { userId: student1.id, status: "FAILED" } });
  if (!hasFailedOrder) {
    await prisma.order.create({
      data: {
        userId: student1.id,
        totalAmount: Number(courseF.discountPrice ?? courseF.price),
        status: "FAILED",
        paymentMethod: "MOMO",
        items: { create: [{ courseId: courseF.id, price: Number(courseF.discountPrice ?? courseF.price) }] },
      },
    });
  }

  // ── Reviews ───────────────────────────────────────────────
  await prisma.review.upsert({
    where: { userId_courseId: { userId: student1.id, courseId: courseA.id } },
    update: {},
    create: {
      userId: student1.id,
      courseId: courseA.id,
      rating: 5,
      comment: "Khóa học rất chi tiết, dễ hiểu. Mình đã tự chạy được chiến dịch đầu tiên sau khi học xong!",
    },
  });
  await prisma.review.upsert({
    where: { userId_courseId: { userId: student2.id, courseId: courseB.id } },
    update: {},
    create: {
      userId: student2.id,
      courseId: courseB.id,
      rating: 4,
      comment: "Giảng viên nhiệt tình, nội dung sát thực tế. Mong có thêm bài tập thực hành.",
    },
  });

  // ── Wishlist ──────────────────────────────────────────────
  await prisma.wishlist.upsert({
    where: { userId_courseId: { userId: student1.id, courseId: courseF.id } },
    update: {},
    create: { userId: student1.id, courseId: courseF.id },
  });
  if (me) {
    await prisma.wishlist.upsert({
      where: { userId_courseId: { userId: me.id, courseId: courseF.id } },
      update: {},
      create: { userId: me.id, courseId: courseF.id },
    });
  }

  // ── Q&A: 1 câu hỏi đã trả lời + 1 câu hỏi chưa trả lời ──────
  const lessonA1 = await prisma.lesson.findFirst({
    where: { section: { courseId: courseA.id } },
    orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
  });
  if (lessonA1) {
    let question = await prisma.question.findFirst({
      where: { lessonId: lessonA1.id, userId: student1.id },
    });
    if (!question) {
      question = await prisma.question.create({
        data: { lessonId: lessonA1.id, userId: student1.id, content: "Business Manager có bắt buộc phải xác minh danh tính không ạ?" },
      });
    }
    const hasAnswer = await prisma.answer.findFirst({ where: { questionId: question.id } });
    if (!hasAnswer) {
      await prisma.answer.create({
        data: {
          questionId: question.id,
          userId: instructor.id,
          content: "Có bạn nhé, nên xác minh sớm để tránh bị giới hạn ngân sách chạy quảng cáo.",
        },
      });
    }

    const unanswered = await prisma.question.findFirst({ where: { lessonId: lessonA1.id, userId: student2.id } });
    if (!unanswered) {
      await prisma.question.create({
        data: { lessonId: lessonA1.id, userId: student2.id, content: "Chi phí tối thiểu để chạy thử 1 chiến dịch là bao nhiêu vậy ạ?" },
      });
    }
  }

  // ── Instructor Application đang chờ duyệt ───────────────────
  await prisma.instructorApplication.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
      headline: "Chuyên gia thiết kế UI/UX 5 năm kinh nghiệm",
      expertise: "Mình đã thiết kế UI/UX cho hơn 20 sản phẩm SaaS, muốn chia sẻ kinh nghiệm thực chiến cho người mới.",
    },
  });

  // ── LessonProgress cho tài khoản thật: 1 khóa hoàn thành 100%, 1 khóa dở dang ──
  if (me) {
    const enrollA = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: me.id, courseId: courseA.id } },
      update: {},
      create: { userId: me.id, courseId: courseA.id },
    });
    const lessonsA = await prisma.lesson.findMany({ where: { section: { courseId: courseA.id } } });
    for (const lesson of lessonsA) {
      await prisma.lessonProgress.upsert({
        where: { enrollmentId_lessonId: { enrollmentId: enrollA.id, lessonId: lesson.id } },
        update: { completed: true, lastPositionSec: lesson.durationSec ?? 0 },
        create: { enrollmentId: enrollA.id, lessonId: lesson.id, completed: true, lastPositionSec: lesson.durationSec ?? 0 },
      });
    }
    await prisma.enrollment.update({
      where: { id: enrollA.id },
      data: { progressPct: 100, completedAt: new Date() },
    });

    const enrollBme = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: me.id, courseId: courseB.id } },
      update: {},
      create: { userId: me.id, courseId: courseB.id },
    });
    const lessonsB = await prisma.lesson.findMany({
      where: { section: { courseId: courseB.id } },
      orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
    });
    if (lessonsB[0]) {
      await prisma.lessonProgress.upsert({
        where: { enrollmentId_lessonId: { enrollmentId: enrollBme.id, lessonId: lessonsB[0].id } },
        update: { completed: true },
        create: { enrollmentId: enrollBme.id, lessonId: lessonsB[0].id, completed: true },
      });
    }
    await prisma.enrollment.update({
      where: { id: enrollBme.id },
      data: { progressPct: Math.round((1 / lessonsB.length) * 100) },
    });
  }

  // ── Menu chính của header (ngoài mega menu danh mục) ────────
  const menuItemDefs = [
    { label: "Tất cả khóa học", url: "/courses", order: 1 },
    { label: "Blog", url: "/blog", order: 2 },
    { label: "Trở thành giảng viên", url: "/become-instructor", order: 3 },
  ];
  for (const item of menuItemDefs) {
    const existing = await prisma.menuItem.findFirst({ where: { label: item.label } });
    if (!existing) await prisma.menuItem.create({ data: item });
  }

  // ── Blog ─────────────────────────────────────────────────────
  const blogPostDefs = [
    {
      slug: "5-meo-hoc-online-hieu-qua",
      title: "5 mẹo giúp bạn học online hiệu quả hơn",
      excerpt: "Học trực tuyến mang lại sự linh hoạt nhưng cũng dễ khiến bạn mất tập trung. Đây là 5 mẹo giúp bạn duy trì động lực và học hiệu quả hơn mỗi ngày.",
      content:
        "Học trực tuyến đang trở thành lựa chọn phổ biến nhờ sự linh hoạt về thời gian và chi phí hợp lý. Tuy nhiên, không phải ai cũng duy trì được động lực khi học một mình.\n\nĐầu tiên, hãy đặt ra một lịch học cố định mỗi ngày, dù chỉ 30 phút. Sự đều đặn quan trọng hơn số giờ học dồn dập.\n\nThứ hai, tắt thông báo mạng xã hội trong lúc học. Một khoảng thời gian không bị gián đoạn dài 25-30 phút (kỹ thuật Pomodoro) hiệu quả hơn nhiều so với việc học ngắt quãng liên tục.\n\nThứ ba, ghi chú lại những gì đã học bằng ngôn ngữ của riêng bạn thay vì chỉ chép lại slide. Việc diễn đạt lại giúp kiến thức được ghi nhớ sâu hơn.\n\nThứ tư, đừng ngại đặt câu hỏi ở phần Hỏi đáp của bài học. Giảng viên và cộng đồng học viên khác có thể giúp bạn hiểu vấn đề nhanh hơn tự mày mò.\n\nCuối cùng, hãy tự thưởng cho bản thân sau khi hoàn thành mỗi chương học. Những cột mốc nhỏ giúp việc học trở nên dễ chịu và bền vững hơn về lâu dài.",
      status: "PUBLISHED" as const,
    },
    {
      slug: "chon-khoa-hoc-phu-hop-nhu-the-nao",
      title: "Làm sao để chọn khóa học phù hợp với mục tiêu nghề nghiệp?",
      excerpt: "Giữa hàng nghìn khóa học trên EduViet, làm sao để chọn đúng khóa học giúp bạn tiến gần hơn tới mục tiêu nghề nghiệp? Cùng tham khảo vài tiêu chí dưới đây.",
      content:
        "Trước khi chọn một khóa học, hãy tự hỏi: kỹ năng này sẽ giúp ích gì cho công việc hiện tại hoặc công việc bạn muốn hướng tới trong 6-12 tháng tới?\n\nMột tiêu chí quan trọng là xem qua chương trình học (curriculum) chi tiết thay vì chỉ đọc tiêu đề khóa học. Chương trình rõ ràng, có cấu trúc theo từng chương sẽ giúp bạn hình dung được lộ trình học tập.\n\nĐừng bỏ qua phần đánh giá từ học viên trước đó — đặc biệt là các đánh giá có bình luận chi tiết, vì chúng phản ánh chất lượng thực tế tốt hơn con số sao trung bình.\n\nCuối cùng, tận dụng các bài học xem trước miễn phí để đánh giá phong cách giảng dạy của giảng viên có phù hợp với cách học của bạn hay không, trước khi quyết định mua khóa học trọn đời.",
      status: "PUBLISHED" as const,
    },
    {
      slug: "xu-huong-hoc-truc-tuyen-2026",
      title: "Xu hướng học trực tuyến tại Việt Nam năm 2026",
      excerpt: "Thị trường học trực tuyến tại Việt Nam đang thay đổi nhanh chóng. Bài viết điểm qua các xu hướng đáng chú ý trong năm nay.",
      content:
        "Học theo kỹ năng ngắn hạn (microlearning) tiếp tục lên ngôi khi người học ưu tiên các khóa học tập trung vào một kỹ năng cụ thể, có thể hoàn thành trong vài giờ đến vài ngày.\n\nHọc viên ngày càng quan tâm tới chứng chỉ có thể chia sẻ trên hồ sơ nghề nghiệp, xem đây như một minh chứng cụ thể cho quá trình học tập của mình.\n\nCác nền tảng cũng đang đầu tư nhiều hơn vào tương tác giữa học viên và giảng viên thông qua hỏi đáp trực tiếp trong bài học, thay vì chỉ dừng lại ở video một chiều.",
      status: "DRAFT" as const,
    },
    {
      slug: "chung-chi-online-co-gia-tri-that-su-khong",
      title: "Chứng chỉ khóa học online có giá trị thật sự không?",
      excerpt:
        "Nhiều người băn khoăn liệu chứng chỉ hoàn thành khóa học online có được nhà tuyển dụng công nhận hay không. Bài viết phân tích giá trị thực sự của chúng.",
      content:
        "Chứng chỉ hoàn thành khóa học online không thay thế bằng cấp chính quy, nhưng lại có giá trị riêng trong việc chứng minh bạn chủ động học hỏi và cập nhật kỹ năng mới.\n\nVới nhà tuyển dụng trong lĩnh vực công nghệ, marketing hay thiết kế, kỹ năng thực tế và sản phẩm demo (portfolio) thường được đánh giá cao hơn tờ chứng chỉ. Vì vậy, hãy xem chứng chỉ như một điểm cộng đi kèm sản phẩm thực tế bạn làm được trong quá trình học.\n\nMột chứng chỉ từ khóa học có nội dung sát thực tế, giảng viên uy tín và có bài tập thực hành rõ ràng sẽ có giá trị hơn nhiều so với một chứng chỉ chỉ cần xem hết video là nhận được.\n\nLời khuyên là hãy tập trung vào việc học được gì, làm ra được sản phẩm gì sau khóa học, thay vì chỉ chăm chăm vào tấm chứng chỉ cuối cùng.",
      status: "PUBLISHED" as const,
    },
    {
      slug: "10-ky-nang-cong-nghe-nen-hoc-nam-2026",
      title: "10 kỹ năng công nghệ nên học trong năm 2026",
      excerpt:
        "Thị trường công nghệ liên tục thay đổi. Đây là những kỹ năng đang được các nhà tuyển dụng săn đón nhiều nhất trong năm nay.",
      content:
        "Lập trình web full-stack với React và Node.js tiếp tục là kỹ năng nền tảng được nhiều doanh nghiệp tuyển dụng, đặc biệt khi nhu cầu xây dựng sản phẩm số ngày càng tăng.\n\nThiết kế UI/UX cũng là kỹ năng quan trọng không kém, khi trải nghiệm người dùng trở thành yếu tố cạnh tranh chính giữa các sản phẩm có tính năng tương tự nhau.\n\nBên cạnh đó, kỹ năng phân tích dữ liệu cơ bản và sử dụng công cụ tự động hóa văn phòng (Excel nâng cao, Power BI) giúp nhân sự ở nhiều vị trí khác nhau làm việc hiệu quả hơn.\n\nCuối cùng, khả năng sử dụng thành thạo các công cụ AI hỗ trợ công việc hàng ngày đang trở thành một yêu cầu gần như bắt buộc ở nhiều vị trí, từ marketing đến lập trình.",
      status: "PUBLISHED" as const,
    },
    {
      slug: "lo-trinh-tu-hoc-lap-trinh-cho-nguoi-moi",
      title: "Cách xây dựng lộ trình tự học lập trình cho người mới",
      excerpt:
        "Tự học lập trình không khó nếu bạn có một lộ trình rõ ràng. Bài viết gợi ý các bước cơ bản giúp người mới không bị choáng ngợp.",
      content:
        "Bước đầu tiên là chọn một ngôn ngữ lập trình và kiên trì với nó ít nhất 2-3 tháng, thay vì nhảy liên tục giữa nhiều công nghệ khác nhau khiến kiến thức bị rời rạc.\n\nSau khi nắm vững cú pháp cơ bản, hãy chuyển sang làm các dự án nhỏ thực tế thay vì chỉ học lý thuyết suông. Một dự án nhỏ hoàn chỉnh có giá trị hơn nhiều so với việc xem hết hàng chục giờ video mà không thực hành.\n\nTham gia cộng đồng lập trình viên, đọc code của người khác và nhờ review code của mình cũng là cách học nhanh và hiệu quả, giúp bạn phát hiện những lỗ hổng kiến thức mà tự học một mình khó nhận ra.\n\nCuối cùng, đừng ngại bắt đầu lại từ đầu nếu thấy lộ trình hiện tại chưa phù hợp — quan trọng là duy trì được động lực học tập lâu dài.",
      status: "PUBLISHED" as const,
    },
  ];

  const blogAuthorId = (me ?? instructor).id;
  for (const post of blogPostDefs) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (!existing) {
      await prisma.blogPost.create({
        data: {
          ...post,
          authorId: blogAuthorId,
          publishedAt: post.status === "PUBLISHED" ? new Date() : null,
        },
      });
    }
  }

  // ── Trang tĩnh (UX Builder kéo-thả): trang chủ (chèn khối), Giới thiệu, Liên hệ ──
  const systemPageDefs = [
    {
      slug: "trang-chu",
      title: "Trang chủ",
      metaTitle: null as string | null,
      metaDescription: null as string | null,
      blocks: [
        {
          id: "home-cta-1",
          type: "cta",
          slot: "bottom",
          props: {
            title: "Bạn là chuyên gia trong lĩnh vực của mình?",
            subtitle: "Chia sẻ kiến thức và tạo thu nhập thụ động bằng cách trở thành giảng viên trên EduViet.",
            buttonLabel: "Đăng ký giảng dạy",
            buttonHref: "/become-instructor",
            style: "dark",
          },
        },
      ],
    },
    {
      slug: "gioi-thieu",
      title: "Giới thiệu",
      metaTitle: "Giới thiệu về EduViet",
      metaDescription: "EduViet là nền tảng học trực tuyến hàng đầu Việt Nam, kết nối học viên với giảng viên chất lượng.",
      blocks: [
        {
          id: "about-hero",
          type: "hero",
          props: {
            title: "Về EduViet",
            subtitle: "Nền tảng học trực tuyến giúp hàng nghìn người Việt nâng cao kỹ năng mỗi ngày.",
            imageUrl: "",
            ctaLabel: "Khám phá khóa học",
            ctaHref: "/courses",
            variant: "dark",
          },
        },
        {
          id: "about-content",
          type: "richtext",
          props: {
            html:
              "<p>EduViet ra đời với sứ mệnh giúp mọi người Việt Nam có thể tiếp cận kiến thức và kỹ năng chất lượng cao với chi phí hợp lý, học theo tốc độ của riêng mình.</p><p>Chúng tôi hợp tác với các giảng viên, chuyên gia hàng đầu trong nhiều lĩnh vực — từ marketing, thiết kế, lập trình đến ngoại ngữ và kỹ năng mềm — để mang đến những khóa học thực chiến, dễ hiểu và áp dụng được ngay.</p><p>Mỗi khóa học trên EduViet đều được đội ngũ admin xét duyệt kỹ lưỡng trước khi xuất bản, đảm bảo chất lượng nội dung cho học viên.</p>",
          },
        },
        {
          id: "about-features",
          type: "features",
          props: {
            title: "Giá trị cốt lõi",
            items: [
              { icon: "ShieldCheck", title: "Chất lượng", description: "Mọi khóa học đều qua admin kiểm duyệt." },
              { icon: "Users", title: "Cộng đồng", description: "Kết nối học viên và giảng viên qua hỏi đáp." },
              { icon: "TrendingUp", title: "Thực chiến", description: "Nội dung áp dụng được ngay vào công việc." },
              { icon: "Heart", title: "Tận tâm", description: "Hỗ trợ học viên xuyên suốt quá trình học." },
            ],
          },
        },
      ],
    },
    {
      slug: "lien-he",
      title: "Liên hệ",
      metaTitle: "Liên hệ với EduViet",
      metaDescription: "Thông tin liên hệ EduViet — hotline, email hỗ trợ và địa chỉ văn phòng.",
      blocks: [
        {
          id: "contact-hero",
          type: "hero",
          props: {
            title: "Liên hệ với chúng tôi",
            subtitle: "Đội ngũ EduViet luôn sẵn sàng hỗ trợ bạn.",
            imageUrl: "",
            ctaLabel: "",
            ctaHref: "",
            variant: "light",
          },
        },
        {
          id: "contact-info",
          type: "richtext",
          props: {
            html:
              "<p><strong>Email hỗ trợ:</strong> support@eduviet.vn</p><p><strong>Hotline:</strong> 1900 1234 (8:00 - 21:00 các ngày trong tuần)</p><p><strong>Địa chỉ văn phòng:</strong> Tầng 5, Tòa nhà ABC, Quận 1, TP. Hồ Chí Minh</p>",
          },
        },
      ],
    },
  ];

  for (const def of systemPageDefs) {
    const existing = await prisma.page.findUnique({ where: { slug: def.slug } });
    if (!existing) {
      await prisma.page.create({
        data: {
          title: def.title,
          slug: def.slug,
          status: "PUBLISHED",
          isSystemPage: true,
          metaTitle: def.metaTitle,
          metaDescription: def.metaDescription,
          blocks: def.blocks,
        },
      });
    }
  }

  console.log({
    categories: categories.length,
    instructors: [instructor, instructor2, instructor3, instructor4, instructor5, instructor6].map((i) => i.email),
    students: [student1.email, student2.email],
    realAccountLinked: !!me,
    pages: systemPageDefs.map((p) => p.slug),
    courses: [
      courseA,
      courseB,
      courseC,
      courseD,
      courseE,
      courseF,
      courseG,
      courseH,
      courseI,
      courseJ,
      courseK,
      courseL,
      courseM,
      courseN,
      courseO,
      courseP,
      courseQ,
      courseR,
    ]
      .filter(Boolean)
      .map((c) => `${c!.slug} [${c!.status}]`),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
