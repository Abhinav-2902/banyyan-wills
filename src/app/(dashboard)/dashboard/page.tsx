import { auth } from "@/auth";
import { getUserDashboard } from "@/server/services/will-service";
import { WillCardStub } from "@/components/dashboard/will-card-stub";
import { CreateWillButton } from "@/components/dashboard/create-will-button";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const wills = await getUserDashboard(session.user.id);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              My Wills
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track your estate planning documents
            </p>
          </div>
          <CreateWillButton />
        </div>

        {/* Content */}
        {wills.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wills.map((will) => (
              <WillCardStub key={will.id} will={will} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm p-12 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/5 mb-6">
              <svg
                className="h-12 w-12 text-[#FF6B6B]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Plan for Tomorrow, With Peace Today
            </h2>
            <p className="text-gray-600 text-lg max-w-md mb-8">
              Creating a will doesn&apos;t have to feel overwhelming. We&apos;ll guide you through each step with care, helping you protect what matters most.
            </p>
            <CreateWillButton />
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">Legally Sound</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
