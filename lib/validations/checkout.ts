import { z } from "zod";

export const checkoutSchema = z.object({
  courseIds: z.array(z.string()).min(1, "Giỏ hàng đang trống"),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["VNPAY", "MOMO"]),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
