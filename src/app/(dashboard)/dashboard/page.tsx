import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground mt-2">
        Welcome back, {session?.user?.name || "User"}!
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Applications</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        {/* Add more cards as needed */}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="rounded-md border p-4 bg-white">
          <p className="text-sm text-gray-500">No recent activity.</p>
        </div>
      </div>
    </div>
  );
}
