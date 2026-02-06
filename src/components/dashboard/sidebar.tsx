"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScrollText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Wills",
    href: "/dashboard/wills",
    icon: ScrollText,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-white">
      <div className="flex flex-col gap-y-5 overflow-y-auto px-6 py-8">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-[#FF6B6B]">Banyyan Wills</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-colors",
                      isActive
                        ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#FF6B6B]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-[#FF6B6B]" : "text-gray-400 group-hover:text-[#FF6B6B]"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
