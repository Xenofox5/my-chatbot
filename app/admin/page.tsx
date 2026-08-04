import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/app/(auth)/auth";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/lib/db/queries";
import { approveUser, banUser } from "./actions";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const users = await getAllUsers();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        User access
      </h1>
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Username</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr className="border-t border-border/60" key={u.id}>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.status}</td>
                <td className="px-4 py-2">
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
