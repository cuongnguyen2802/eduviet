import { NextResponse } from "next/server";
import { verifyVnpaySignature } from "@/lib/payments/vnpay";
import { fulfillOrder, markOrderFailed } from "@/lib/orders";

// VNPay redirect người dùng về URL này (GET) kèm query params đã ký.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  const isValid = verifyVnpaySignature(query);
  const orderId = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;

  if (!isValid || !orderId) {
    return NextResponse.redirect(`${origin}/checkout/result?status=invalid`);
  }

  if (responseCode === "00") {
    await fulfillOrder(orderId, query.vnp_TransactionNo ?? "");
    return NextResponse.redirect(`${origin}/checkout/result?status=success&orderId=${orderId}`);
  }

  await markOrderFailed(orderId);
  return NextResponse.redirect(`${origin}/checkout/result?status=failed&orderId=${orderId}`);
}
