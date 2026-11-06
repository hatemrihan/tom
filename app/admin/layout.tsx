import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminLogin } from "./_components/AdminLogin";
import { AdminShell } from "./_components/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminSession())) {
    return <AdminLogin />;
  }
  return <AdminShell>{children}</AdminShell>;
}
