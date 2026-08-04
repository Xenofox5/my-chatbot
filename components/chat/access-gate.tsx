"use client";

import { signOut } from "next-auth/react";
import { useCallback } from "react";
import type { UserStatus } from "@/app/(auth)/auth";
import { Button } from "@/components/ui/button";

const COPY: Record<
  Exclude<UserStatus, "approved">,
  { title: string; body: string }
> = {
  banned: {
    body: "Your account has been blocked from accessing this chatbot.",
    title: "Access revoked",
  },
  pending: {
    body: "Your account is waiting for an admin to approve access. Check back later.",
    title: "Pending approval",
  },
};

export function AccessGate({ status }: { status: UserStatus }) {
  const handleSignOut = useCallback(() => {
    signOut({ redirectTo: "/login" });
  }, []);

  if (status === "approved") {
    return null;
  }

  const { title, body } = COPY[status];

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
}
