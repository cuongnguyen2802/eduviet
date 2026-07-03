import { NextResponse } from "next/server";
import { verifyMomoSignature } from "@/lib/payments/momo";
import { fulfillOrder, markOrderFailed } from "@/lib/orders";

// MoMo gọi IPN này (POST) để báo kết quả giao dịch — phải verify chữ ký trước khi xử lý.
export async function POST(request: Request) {
  const body = await request.json();

  if (!verifyMomoSignature(body)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const orderId = body.orderId as string;
  const resultCode = body.resultCode;

  if (resultCode === 0) {
    await fulfillOrder(orderId, body.transId?.toString() ?? "");
  } else {
    await markOrderFailed(orderId);
  }

  return NextResponse.json({ message: "OK" });
}
