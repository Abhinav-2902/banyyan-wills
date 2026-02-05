import { WillDashboardDTO } from "@/types";

interface WillCardStubProps {
  will: WillDashboardDTO;
}

export function WillCardStub({ will }: WillCardStubProps) {
  const getStatusColor = (status: WillDashboardDTO["status"]) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "PAID":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-xl text-gray-900 line-clamp-2 flex-1 pr-4">
          {will.title}
        </h3>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${getStatusColor(
            will.status
          )}`}
        >
          {will.status}
        </span>
      </div>
      
      {/* Progress Section */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Progress</span>
          <span className="text-gray-900 font-semibold">{will.progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] rounded-full transition-all duration-300" 
            style={{ width: `${will.progress}%` }} 
          />
        </div>
      </div>

      {/* Last Edited */}
      <div className="flex items-center text-sm text-gray-500 mb-5 pb-5 border-b border-gray-100">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Last edited {will.lastEdited.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Action Button */}
      <button 
        className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all duration-200 uppercase tracking-wide cursor-not-allowed opacity-60"
        disabled
      >
        Edit (Coming Soon)
      </button>
    </div>
  );
}
