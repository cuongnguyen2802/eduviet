import { z } from "zod";

export const reviewSchema = z.object({
  courseId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const questionSchema = z.object({
  lessonId: z.string().min(1),
  content: z.string().min(5, "Câu hỏi phải có ít nhất 5 ký tự"),
});
export type QuestionInput = z.infer<typeof questionSchema>;

export const answerSchema = z.object({
  questionId: z.string().min(1),
  content: z.string().min(1, "Câu trả lời không được để trống"),
});
export type AnswerInput = z.infer<typeof answerSchema>;
