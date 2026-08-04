"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/app/(auth)/auth";
import { updateUserStatus } from "@/lib/db/queries";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function approveUser(userId: string) {
  await requireAdmin();
  await updateUserStatus({ id: userId, status: "approved" });
  revalidatePath("/admin");
}

export async function banUser(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    return;
  }
  await updateUserStatus({ id: userId, status: "banned" });
  revalidatePath("/admin");
}
