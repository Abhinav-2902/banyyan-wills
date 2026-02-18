import { auth } from "@/auth";
import { getUserDashboard } from "@/server/services/will-service";
import { redirect } from "next/navigation";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { WillStatusCard } from "@/components/dashboard/will-status-card";
import { AccountCard } from "@/components/dashboard/account-card";
import { AssetDistributionMap } from "@/components/dashboard/asset-distribution-map";
import { BeneficiaryMap } from "@/components/dashboard/beneficiary-map";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const wills = await getUserDashboard(session.user.id);
  const latestWill = wills[0];
  const willData = latestWill?.data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-white to-rose-50 -m-6 p-6"> 
      {/* 
        Note: The -m-6 p-6 is a small hack to break out of potential padding in parent layout if needed, 
        or just to ensure full background coverage. Adjust as needed based on layout.tsx 
      */}
      
      <DashboardHero userName={session.user.name?.split(" ")[0] || "User"} />

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top Grid: Status & Account */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <WillStatusCard wills={wills} />
            <AccountCard />
          </div>

          {/* Bottom Grid: Maps (Only if will exists) */}
          {latestWill && (
            <div className="grid md:grid-cols-2 gap-8">
              <AssetDistributionMap willData={willData} />
              <BeneficiaryMap willData={willData} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
