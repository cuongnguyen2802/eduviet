import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations/checkout";
import { createVnpayPaymentUrl } from "@/lib/payments/vnpay";
import { createMomoPayment } from "@/lib/payments/momo";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }
  if (user.isBanned) {
    return NextResponse.json({ error: "Tài khoản của bạn đã bị khóa" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { courseIds, couponCode, paymentMethod } = parsed.data;

  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds }, status: "PUBLISHED" },
  });
  if (courses.length !== courseIds.length) {
    return NextResponse.json({ error: "Một số khóa học không còn tồn tại" }, { status: 400 });
  }

  const alreadyOwned = await prisma.enrollment.findFirst({
    where: { userId: user.id, courseId: { in: courseIds } },
  });
  if (alreadyOwned) {
    return NextResponse.json({ error: "Bạn đã sở hữu một trong các khóa học này" }, { status: 400 });
  }

  let subtotal = courses.reduce((sum, c) => sum + Number(c.discountPrice ?? c.price), 0);

  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    const valid =
      coupon &&
      coupon.isActive &&
      (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
      (!coupon.maxUses || coupon.usedCount < coupon.maxUses);

    if (!valid) {
      return NextResponse.json({ error: "Mã giảm giá không hợp lệ hoặc đã hết hạn" }, { status: 400 });
    }
    subtotal = Math.round(subtotal * (1 - coupon!.discountPct / 100));
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: subtotal,
      paymentMethod,
      couponId: coupon?.id,
      items: {
        create: courses.map((c) => ({
          courseId: c.id,
          price: c.discountPrice ?? c.price,
        })),
      },
    },
  });

  const ipAddr = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

  if (paymentMethod === "VNPAY") {
    const paymentUrl = createVnpayPaymentUrl({
      orderId: order.id,
      amount: subtotal,
      orderInfo: `Thanh toan don hang ${order.id}`,
      ipAddr,
    });
    return NextResponse.json({ paymentUrl, orderId: order.id });
  }

  const momoResult = await createMomoPayment({
    orderId: order.id,
    amount: subtotal,
    orderInfo: `Thanh toan don hang ${order.id}`,
  });
  return NextResponse.json({ paymentUrl: momoResult.payUrl, orderId: order.id });
}
