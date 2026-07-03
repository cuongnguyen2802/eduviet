import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string().min(20, "Mô tả phải có ít nhất 20 ký tự"),
  price: z.coerce.number().min(0, "Giá không được âm"),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  learnOutcomes: z.array(z.string().min(1)).default([]),
});
export type CourseInput = z.infer<typeof courseSchema>;

export const sectionSchema = z.object({
  title: z.string().min(2, "Tên chương phải có ít nhất 2 ký tự"),
  order: z.coerce.number().int().min(1),
});
export type SectionInput = z.infer<typeof sectionSchema>;

export const lessonSchema = z.object({
  title: z.string().min(2, "Tên bài học phải có ít nhất 2 ký tự"),
  order: z.coerce.number().int().min(1),
  type: z.enum(["VIDEO", "DOCUMENT", "QUIZ"]),
  youtubeVideoId: z.string().optional(),
  content: z.string().optional(),
  durationSec: z.coerce.number().int().min(0).optional(),
  isPreview: z.boolean().default(false),
});
export type LessonInput = z.infer<typeof lessonSchema>;
