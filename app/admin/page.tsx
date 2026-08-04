import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/app/(auth)/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/lib/db/queries";
import type { User } from "@/lib/db/schema";
import { approveUser, banUser } from "./actions";

export default function AdminPage() {
  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild size="icon-sm" variant="ghost">
          <Link href="/">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">User access</h1>
      </div>
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Loading...</div>
        }
      >
        <AdminContent />
      </Suspense>
    </div>
  );
}

function roleBadgeVariant(role: User["role"]) {
  return role === "admin" ? "default" : "outline";
}

function statusBadgeVariant(status: User["status"]) {
  if (status === "approved") {
    return "secondary" as const;
  }
  if (status === "banned") {
    return "destructive" as const;
  }
  return "outline" as const;
}

async function AdminContent() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const users = await getAllUsers();
  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <div className="flex flex-col gap-4">
      {pendingCount > 0 && (
        <p className="text-sm text-muted-foreground">
          {pendingCount} account{pendingCount === 1 ? "" : "s"} waiting for
          approval.
        </p>
      )}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Username</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                className="border-t border-border/60 hover:bg-muted/30"
                key={u.id}
              >
                <td className="px-4 py-2.5">
                  {u.email}
                  {u.id === session.user.id && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (you)
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant={roleBadgeVariant(u.role)}>{u.role}</Badge>
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant={statusBadgeVariant(u.status)}>
                    {u.status}
                  </Badge>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-2">
                    {u.status !== "approved" && (
                      // biome-ignore lint/performance/noJsxPropsBind: server action bound per row, rendered once per request
                      <form action={approveUser.bind(null, u.id)}>
                        <Button size="sm" type="submit" variant="outline">
                          Approve
                        </Button>
                      </form>
                    )}
                    {u.status !== "banned" && u.id !== session.user.id && (
                      // biome-ignore lint/performance/noJsxPropsBind: server action bound per row, rendered once per request
                      <form action={banUser.bind(null, u.id)}>
                        <Button size="sm" type="submit" variant="destructive">
                          Ban
                        </Button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
