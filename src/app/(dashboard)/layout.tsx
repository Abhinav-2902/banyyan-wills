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
  
  // Middleware protects this too, but double check is good practice
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop, hidden on mobile */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header - Sticky */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Mobile menu button placeholder - will add later */}
            <div className="flex flex-1 items-center">
              {/* Empty for now, can add search or breadcrumbs later */}
            </div>
            
            {/* User Navigation */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <UserNav />
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
