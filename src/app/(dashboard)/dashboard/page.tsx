import { auth } from "@/auth";
import { getUserDashboard } from "@/server/services/will-service";
import { CreateWillButton } from "@/components/dashboard/create-will-button";
import { WillCard } from "@/components/dashboard/will-card";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const wills = await getUserDashboard(session.user.id);
  
  // Calculate statistics
  const totalWills = wills.length;
  const drafts = wills.filter(w => w.status === "DRAFT").length;
  const completed = wills.filter(w => w.status === "COMPLETED" || w.status === "PAID").length;
  const recentWills = wills.slice(0, 3);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-gray-600 text-lg">
          Here&apos;s an overview of your estate planning progress
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Total Wills */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B6B]/10">
              <FileText className="h-6 w-6 text-[#FF6B6B]" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalWills}</h3>
          <p className="text-gray-600">Total Wills</p>
        </div>

        {/* Drafts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{drafts}</h3>
          <p className="text-gray-600">In Progress</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{completed}</h3>
          <p className="text-gray-600">Completed</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8787] rounded-2xl shadow-lg p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
        <p className="text-white/90 mb-6">
          Create a new will or continue working on your existing drafts
        </p>
        <div className="flex flex-wrap gap-4">
          <CreateWillButton />
          {drafts > 0 && (
            <Link
              href="/dashboard/wills"
              className="inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-200 bg-white text-[#FF6B6B] hover:bg-gray-50 shadow-md hover:shadow-lg px-6 py-3 whitespace-nowrap"
            >
              View My Wills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recentWills.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <Link
              href="/dashboard/wills"
              className="text-[#FF6B6B] hover:text-[#FF5555] font-semibold text-sm flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentWills.map((will) => (
              <WillCard key={will.id} will={will} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalWills === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm p-12 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/5 mb-6">
            <FileText className="h-12 w-12 text-[#FF6B6B]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Start Your Estate Planning Journey
          </h2>
          <p className="text-gray-600 text-lg max-w-md mb-8">
            Take the first step in protecting your legacy. Create your first will today.
          </p>
          <CreateWillButton />
        </div>
      )}
    </>
  );
}
