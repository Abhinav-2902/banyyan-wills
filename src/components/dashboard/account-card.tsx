import { Settings, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AccountCard() {
  // TODO: Update link to actual account page when available, currently pointing to /settings or placeholder
  const accountLink = "/settings"; 

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 h-full">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-[#FF6B6B] rounded-full flex items-center justify-center flex-shrink-0">
          <Settings className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-semibold text-gray-800">Account Settings</h3>
          <p className="text-gray-600">Manage your account</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="text-blue-500" size={20} />
          <span className="text-gray-700 font-medium">Secure Account</span>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Access your account settings, update your password, view will history, and manage security preferences.
        </p>
        <Link 
          href={accountLink}
          className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-300"
        >
          <Settings className="mr-2" size={18} />
          Manage Account
          <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    </div>
  );
}
