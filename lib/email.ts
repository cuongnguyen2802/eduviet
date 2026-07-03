import { Resend } from "resend";
import { formatVND } from "@/lib/format";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type OrderConfirmationParams = {
  to: string;
  customerName: string;
  orderId: string;
  items: { title: string; price: number }[];
  totalAmount: number;
};

/** Gửi email xác nhận đơn hàng sau khi thanh toán thành công. Bỏ qua (log cảnh báo) nếu chưa cấu hình RESEND_API_KEY. */
export async function sendOrderConfirmationEmail(params: OrderConfirmationParams) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY chưa được cấu hình — bỏ qua gửi email xác nhận đơn hàng.");
    return;
  }

  const itemsHtml = params.items
    .map((item) => `<tr><td style="padding:8px 0">${item.title}</td><td style="padding:8px 0;text-align:right">${formatVND(item.price)}</td></tr>`)
    .join("");

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "no-reply@example.com",
      to: params.to,
      subject: `Xác nhận đơn hàng #${params.orderId.slice(-8)} — EduViet`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Cảm ơn bạn đã mua khóa học!</h2>
          <p>Chào ${params.customerName}, đơn hàng của bạn đã được thanh toán thành công.</p>
          <table style="width:100%; border-collapse:collapse; margin:16px 0;">
            ${itemsHtml}
            <tr style="border-top:1px solid #e2e8f0; font-weight:bold;">
              <td style="padding:8px 0">Tổng cộng</td>
              <td style="padding:8px 0;text-align:right">${formatVND(params.totalAmount)}</td>
            </tr>
          </table>
          <p>Bạn có thể vào học ngay tại mục "Khóa học của tôi" trên EduViet.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] Gửi email xác nhận đơn hàng thất bại:", error);
  }
}

type RefundParams = {
  to: string;
  customerName: string;
  orderId: string;
  amount: number;
};

/** Gửi email thông báo đơn hàng đã được hoàn tiền. */
export async function sendRefundEmail(params: RefundParams) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY chưa được cấu hình — bỏ qua gửi email hoàn tiền.");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "no-reply@example.com",
      to: params.to,
      subject: `Đơn hàng #${params.orderId.slice(-8)} đã được hoàn tiền — EduViet`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p>Chào ${params.customerName},</p>
          <p>Đơn hàng #${params.orderId.slice(-8)} của bạn với số tiền ${formatVND(params.amount)} đã được hoàn tiền.
          Quyền truy cập vào các khóa học trong đơn hàng này đã bị thu hồi.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] Gửi email hoàn tiền thất bại:", error);
  }
}

type InstructorApplicationResultParams = {
  to: string;
  name: string;
  approved: boolean;
};

/** Gửi email thông báo kết quả duyệt đăng ký làm giảng viên. */
export async function sendInstructorApplicationResultEmail(params: InstructorApplicationResultParams) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY chưa được cấu hình — bỏ qua gửi email kết quả đăng ký giảng viên.");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "no-reply@example.com",
      to: params.to,
      subject: params.approved ? "Đăng ký giảng viên đã được duyệt — EduViet" : "Kết quả đăng ký giảng viên — EduViet",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p>Chào ${params.name},</p>
          <p>${
            params.approved
              ? "Chúc mừng! Đăng ký làm giảng viên của bạn đã được duyệt. Bạn có thể bắt đầu tạo khóa học ngay bây giờ."
              : "Rất tiếc, đăng ký làm giảng viên của bạn chưa được duyệt lần này. Bạn có thể đăng ký lại sau."
          }</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] Gửi email kết quả đăng ký giảng viên thất bại:", error);
  }
}
