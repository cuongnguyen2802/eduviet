import crypto from "crypto";

const PARTNER_CODE = process.env.MOMO_PARTNER_CODE!;
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY!;
const SECRET_KEY = process.env.MOMO_SECRET_KEY!;
const ENDPOINT = process.env.MOMO_ENDPOINT!;
const REDIRECT_URL = process.env.MOMO_REDIRECT_URL!;
const IPN_URL = process.env.MOMO_IPN_URL!;

function sign(rawSignature: string) {
  return crypto.createHmac("sha256", SECRET_KEY).update(rawSignature).digest("hex");
}

/** Gọi API MoMo để tạo giao dịch, trả về payUrl để redirect người dùng. */
export async function createMomoPayment(params: {
  orderId: string;
  amount: number;
  orderInfo: string;
}) {
  const requestId = `${params.orderId}-${Date.now()}`;
  const requestType = "captureWallet";
  const extraData = "";

  const rawSignature =
    `accessKey=${ACCESS_KEY}&amount=${params.amount}&extraData=${extraData}` +
    `&ipnUrl=${IPN_URL}&orderId=${params.orderId}&orderInfo=${params.orderInfo}` +
    `&partnerCode=${PARTNER_CODE}&redirectUrl=${REDIRECT_URL}&requestId=${requestId}&requestType=${requestType}`;

  const signature = sign(rawSignature);

  const body = {
    partnerCode: PARTNER_CODE,
    accessKey: ACCESS_KEY,
    requestId,
    amount: String(params.amount),
    orderId: params.orderId,
    orderInfo: params.orderInfo,
    redirectUrl: REDIRECT_URL,
    ipnUrl: IPN_URL,
    extraData,
    requestType,
    signature,
    lang: "vi",
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Không tạo được giao dịch MoMo");
  return res.json() as Promise<{ payUrl: string; resultCode: number; message: string }>;
}

/** Verify chữ ký IPN callback từ MoMo trước khi cập nhật Order.status. */
export function verifyMomoSignature(body: Record<string, unknown>): boolean {
  const {
    signature,
    accessKey: _accessKey,
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
  } = body as Record<string, string | number>;

  if (!signature) return false;

  const rawSignature =
    `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData ?? ""}` +
    `&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}` +
    `&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}` +
    `&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const expected = sign(rawSignature);
  return expected === signature;
}
