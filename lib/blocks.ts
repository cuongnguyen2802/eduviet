export type BlockSlot = "top" | "bottom";

export type HeroBlockProps = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant: "light" | "dark";
};

export type RichTextBlockProps = {
  html: string;
};

export type ImageTextBlockProps = {
  imageUrl?: string;
  imagePosition: "left" | "right";
  title?: string;
  html: string;
};

export type CtaBlockProps = {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
  style: "primary" | "dark";
};

export type FeatureItem = {
  icon: string;
  title: string;
  description: string;
};

export type FeaturesBlockProps = {
  title?: string;
  items: FeatureItem[];
};

export type SpacerBlockProps = {
  height: "sm" | "md" | "lg";
};

export type PageBlock =
  | { id: string; type: "hero"; slot?: BlockSlot; props: HeroBlockProps }
  | { id: string; type: "richtext"; slot?: BlockSlot; props: RichTextBlockProps }
  | { id: string; type: "imageText"; slot?: BlockSlot; props: ImageTextBlockProps }
  | { id: string; type: "cta"; slot?: BlockSlot; props: CtaBlockProps }
  | { id: string; type: "features"; slot?: BlockSlot; props: FeaturesBlockProps }
  | { id: string; type: "spacer"; slot?: BlockSlot; props: SpacerBlockProps };

export type BlockType = PageBlock["type"];

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Banner tiêu đề (Hero)",
  richtext: "Văn bản",
  imageText: "Ảnh + văn bản",
  cta: "Kêu gọi hành động (CTA)",
  features: "Lưới tính năng",
  spacer: "Khoảng trống",
};

/** Icon cho phép chọn trong khối "Lưới tính năng" — danh sách cố định, resolve qua lib/feature-icons.tsx */
export const FEATURE_ICON_NAMES = [
  "CheckCircle",
  "Star",
  "ShieldCheck",
  "Zap",
  "Award",
  "Users",
  "Clock",
  "Heart",
  "ThumbsUp",
  "TrendingUp",
  "BookOpen",
  "Rocket",
  "Sparkles",
  "Target",
] as const;

function newBlockId() {
  return Math.random().toString(36).slice(2, 10);
}

/** Tóm tắt ngắn gọn hiển thị trên thẻ khối trong UX Builder, giúp phân biệt các khối cùng loại. */
export function blockSummary(block: PageBlock): string {
  switch (block.type) {
    case "hero":
      return block.props.title || "(chưa có tiêu đề)";
    case "richtext":
      return block.props.html.replace(/<[^>]*>/g, "").slice(0, 60) || "(trống)";
    case "imageText":
      return block.props.title || "(chưa có tiêu đề)";
    case "cta":
      return block.props.title || "(chưa có tiêu đề)";
    case "features":
      return `${block.props.items.length} mục`;
    case "spacer":
      return block.props.height === "sm" ? "Nhỏ" : block.props.height === "lg" ? "Lớn" : "Vừa";
  }
}

export function createDefaultBlock(type: BlockType): PageBlock {
  const id = newBlockId();
  switch (type) {
    case "hero":
      return {
        id,
        type,
        props: { title: "Tiêu đề banner", subtitle: "", imageUrl: "", ctaLabel: "", ctaHref: "", variant: "dark" },
      };
    case "richtext":
      return { id, type, props: { html: "<p>Nội dung...</p>" } };
    case "imageText":
      return { id, type, props: { imageUrl: "", imagePosition: "left", title: "", html: "<p>Nội dung...</p>" } };
    case "cta":
      return {
        id,
        type,
        props: { title: "Sẵn sàng bắt đầu?", subtitle: "", buttonLabel: "Xem khóa học", buttonHref: "/courses", style: "primary" },
      };
    case "features":
      return {
        id,
        type,
        props: {
          title: "",
          items: [{ icon: "CheckCircle", title: "Tiêu đề", description: "Mô tả ngắn gọn" }],
        },
      };
    case "spacer":
      return { id, type, props: { height: "md" } };
  }
}
