import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Full Width */}
      <main>
        {children}
      </main>
    </div>
  );
}
