"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, User as UserIcon } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session.user.email?.[0]?.toUpperCase() || "U";

  const firstName = session.user.name?.split(" ")[0] || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="relative h-12 pl-2 pr-4 rounded-full border-2 border-purple-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 shadow-sm flex items-center gap-3"
        >
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-orange-500 text-white font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-bold text-gray-700 leading-none">{firstName}</span>
            <span className="text-[10px] text-gray-500 font-medium mt-0.5">Account</span>
          </div>

          <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3 bg-gray-50 rounded-lg mb-2">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900 leading-none">{session.user.name || "User"}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                session.user.subscriptionTier === "PREMIUM" 
                  ? "bg-amber-100 text-amber-700 border border-amber-200" 
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}>
                {session.user.subscriptionTier === "PREMIUM" ? "PREMIUM" : "FREE"}
              </span>
            </div>
            <p className="text-xs leading-none text-gray-500 truncate">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <div className="px-2 py-1.5">
          <Button 
             variant="ghost" 
             className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
             onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
