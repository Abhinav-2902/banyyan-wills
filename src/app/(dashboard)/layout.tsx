import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Middleware protects this too, but double check is good practice
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar Placeholder */}
      <aside className="w-full bg-slate-900 text-white md:w-64 p-6">
        <h1 className="text-xl font-bold">Banyyan Wills</h1>
        <nav className="mt-6 flex flex-col gap-2">
          {/* Nav Links */}
          <div className="bg-slate-800 p-2 rounded">Dashboard</div>
          <div className="p-2">My Applications</div>
          <div className="p-2">Settings</div>
           <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="p-2 w-full text-left hover:bg-slate-800 rounded text-red-300 hover:text-red-200">
              Sign Out
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
