import { User } from "lucide-react";
import { UserNav } from "@/components/dashboard/user-nav";

interface DashboardHeroProps {
  userName: string;
}

export function DashboardHero({ userName }: DashboardHeroProps) {
  return (
    <section className="pt-8 pb-12 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="absolute top-0 right-0 p-4">
          <UserNav />
        </div>
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center">
              <User className="text-[#FF6B6B]" size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8787] bg-clip-text text-transparent">
                My Will Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Welcome back, {userName}. Manage your will, track progress, and access your account settings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
