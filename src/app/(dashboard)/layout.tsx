import { redirect } from "next/navigation";
// import { auth } from "@/auth"; // TODO: Wire Auth

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  // if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar Placeholder */}
      <aside className="w-full bg-slate-900 text-white md:w-64 p-6 hidden md:block">
        <h1 className="text-xl font-bold">Banyyan Wills</h1>
        <nav className="mt-6 flex flex-col gap-2">
          {/* Nav Links */}
          <div className="bg-slate-800 p-2 rounded">Dashboard</div>
          <div className="p-2">My Applications</div>
          <div className="p-2">Settings</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
