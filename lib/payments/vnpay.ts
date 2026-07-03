import crypto from "crypto";

const TMN_CODE = process.env.VNPAY_TMN_CODE!;
const HASH_SECRET = process.env.VNPAY_HASH_SECRET!;
const PAYMENT_URL = process.env.VNPAY_PAYMENT_URL!;
const RETURN_URL = process.env.VNPAY_RETURN_URL!;

function sortObject(obj: Record<string, string>) {
  return Object.keys(obj)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

/**
 * Tạo URL redirect sang cổng thanh toán VNPay.
 * amount tính bằng VNĐ (sẽ tự nhân 100 theo yêu cầu VNPay).
 */
export function createVnpayPaymentUrl(params: {
  orderId: string;
  amount: number;
  orderInfo: string;
  ipAddr: string;
}) {
  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);

  const vnpParams: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: TMN_CODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: params.orderId,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: String(Math.round(params.amount) * 100),
    vnp_ReturnUrl: RETURN_URL,
    vnp_IpAddr: params.ipAddr,
    vnp_CreateDate: createDate,
  };

  const sorted = sortObject(vnpParams);
  const signData = new URLSearchParams(sorted).toString();
  const hmac = crypto.createHmac("sha512", HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  const query = new URLSearchParams({ ...sorted, vnp_SecureHash: signed });
  return `${PAYMENT_URL}?${query.toString()}`;
}

/** Verify chữ ký trả về từ VNPay (return URL hoặc IPN) trước khi cập nhật Order.status. */
export function verifyVnpaySignature(query: Record<string, string>): boolean {
  const { vnp_SecureHash, vnp_SecureHashType, ...rest } = query;
  if (!vnp_SecureHash) return false;

  const sorted = sortObject(rest as Record<string, string>);
  const signData = new URLSearchParams(sorted).toString();
  const hmac = crypto.createHmac("sha512", HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return signed === vnp_SecureHash;
}
