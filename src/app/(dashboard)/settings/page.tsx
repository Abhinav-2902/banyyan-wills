"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { User, Mail, Shield, Bell, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");

  if (!session?.user?.id) {
    redirect("/");
  }

  const handleSaveName = () => {
    // TODO: Implement server action to update name
    console.log("Saving name:", name);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setName(session?.user?.name || "");
    setIsEditingName(false);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B6B]/10">
              <User className="h-5 w-5 text-[#FF6B6B]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditingName}
                  className={`flex-1 h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 ${
                    isEditingName 
                      ? "bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent" 
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
                {!isEditingName ? (
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="px-4 py-2 text-sm font-medium text-[#FF6B6B] hover:text-[#FF5555] transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveName}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B6B] hover:bg-[#FF5555] rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={session.user.email || ""}
                disabled
                className="w-full h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email address cannot be changed
              </p>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Security</h2>
          </div>

          <div className="space-y-4">
            {/* Password */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Password</h3>
                <p className="text-sm text-gray-600">
                  Change your password to keep your account secure
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B6B] hover:bg-[#FF5555] rounded-lg transition-colors">
                Change Password
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Receive updates about your wills via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B6B]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B6B]"></div>
              </label>
            </div>

            {/* Reminders */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Will Update Reminders
                </h3>
                <p className="text-sm text-gray-600">
                  Get reminded to review and update your wills annually
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B6B]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B6B]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
