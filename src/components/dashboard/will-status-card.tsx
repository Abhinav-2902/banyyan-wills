"use client";

import { FileText, Plus, ArrowRight, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { WillDashboardDTO } from "@/types";

interface WillStatusCardProps {
  wills: WillDashboardDTO[];
}

export function WillStatusCard({ wills }: WillStatusCardProps) {
  const router = useRouter();
  const willCount = wills.length;

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 h-full">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <FileText className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-semibold text-gray-800">My Wills</h3>
          <p className="text-gray-600">Manage your created wills</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <List className="text-[#FF6B6B]" size={20} />
          <span className="bg-[#FFF5F5] text-[#D64545] px-3 py-1 rounded-full text-sm font-medium">
            {willCount} Will{willCount !== 1 ? 's' : ''} Created
          </span>
        </div>
        
        {willCount > 0 ? (
          <>
            <p className="text-gray-600 leading-relaxed">
              You have created {willCount} will{willCount !== 1 ? 's' : ''}. View and manage them all in one place.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/dashboard/wills')}
                className="w-full bg-[#FF6B6B] text-white px-6 py-3 rounded-full hover:bg-[#FF5252] transition-colors flex items-center justify-center"
              >
                <List className="mr-2" size={18} />
                View All Wills
                <ArrowRight className="ml-2" size={18} />
              </button>
              <button 
                onClick={() => router.push('/dashboard/create')}
                className="w-full bg-white text-[#FF6B6B] border border-rose-200 px-6 py-3 rounded-full hover:bg-[#FFF5F5] transition-colors flex items-center justify-center"
              >
                <Plus className="mr-2" size={18} />
                Create New Will
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 leading-relaxed">
              You haven&apos;t created any wills yet. Start your first will to secure your family&apos;s future.
            </p>
            <button 
              onClick={() => router.push('/dashboard/create')}
              className="w-full bg-[#FF6B6B] text-white px-6 py-3 rounded-full hover:bg-[#FF5252] transition-colors flex items-center justify-center"
            >
              <FileText className="mr-2" size={18} />
              Create Your First Will
              <ArrowRight className="ml-2" size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
