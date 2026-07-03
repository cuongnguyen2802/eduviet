import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendRefundEmail } from "@/lib/email";

/** Đánh dấu đơn hàng đã thanh toán, tạo Enrollment cho từng khóa học, cộng lượt dùng coupon, gửi email xác nhận. */
export async function fulfillOrder(orderId: string, paymentRef: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { course: true } }, user: true },
  });

  if (!order || order.status === "PAID") return;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID", paymentRef },
    }),
    ...order.items.map((item) =>
      prisma.enrollment.upsert({
        where: { userId_courseId: { userId: order.userId, courseId: item.courseId } },
        update: {},
        create: { userId: order.userId, courseId: item.courseId },
      })
    ),
    ...(order.couponId
      ? [prisma.coupon.update({ where: { id: order.couponId }, data: { usedCount: { increment: 1 } } })]
      : []),
  ]);

  await sendOrderConfirmationEmail({
    to: order.user.email,
    customerName: order.user.name,
    orderId: order.id,
    items: order.items.map((item) => ({ title: item.course.title, price: Number(item.price) })),
    totalAmount: Number(order.totalAmount),
  });
}

export async function markOrderFailed(orderId: string) {
  await prisma.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}

/** Hoàn tiền đơn hàng đã thanh toán: thu hồi Enrollment của các khóa học trong đơn, gửi email thông báo. */
export async function refundOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { course: true } }, user: true },
  });

  if (!order || order.status !== "PAID") return { error: "Chỉ có thể hoàn tiền đơn hàng đã thanh toán" };

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: "REFUNDED" } }),
    prisma.enrollment.deleteMany({
      where: { userId: order.userId, courseId: { in: order.items.map((i) => i.courseId) } },
    }),
  ]);

  await sendRefundEmail({
    to: order.user.email,
    customerName: order.user.name,
    orderId: order.id,
    amount: Number(order.totalAmount),
  });

  return { success: true };
}
