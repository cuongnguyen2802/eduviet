"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getInstructorAvailableBalance } from "@/lib/revenue";

const withdrawalSchema = z.object({
  amount: z.coerce.number().int().min(50000, "Số tiền rút tối thiểu là 50.000đ"),
});

export async function requestWithdrawal(formData: FormData) {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const parsed = withdrawalSchema.safeParse({ amount: formData.get("amount") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { availableBalance } = await getInstructorAvailableBalance(instructor.id);
  if (parsed.data.amount > availableBalance) {
    return { error: "Số tiền vượt quá số dư khả dụng" };
  }

  await prisma.withdrawal.create({
    data: { instructorId: instructor.id, amount: parsed.data.amount },
  });

  revalidatePath("/instructor/revenue");
  return { success: true };
}

export async function reviewWithdrawal(withdrawalId: string, approve: boolean) {
  await requireRole(["ADMIN"]);

  await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: { status: approve ? "PAID" : "REJECTED", processedAt: new Date() },
  });

  revalidatePath("/admin/withdrawals");
  revalidatePath("/instructor/revenue");
}
