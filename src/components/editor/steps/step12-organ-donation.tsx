"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Heart } from "lucide-react";

const ORGANS = [
  { name: "Heart", use: "For patients with end-stage heart failure" },
  { name: "Lungs", use: "Single or double — for those with lung diseases (e.g., cystic fibrosis)" },
  { name: "Liver", use: "Can be split to help two recipients" },
  { name: "Kidneys", use: "One person can give both kidneys to two people" },
  { name: "Pancreas", use: "Helps patients with severe diabetes" },
  { name: "Intestines", use: "Rare, but useful in complex digestive failures" },
];

const TISSUES = [
  { name: "Corneas", use: "Restore sight to the blind or visually impaired" },
  { name: "Skin", use: "Used for burn victims and reconstructive surgery" },
  { name: "Heart Valves", use: "For people with damaged or diseased valves" },
  { name: "Bones", use: "Help reconstruct limbs or jawbones after injury" },
  { name: "Tendons", use: "Used in orthopedic surgeries" },
  { name: "Veins", use: "For vascular surgeries (e.g., bypass)" },
  { name: "Cartilage", use: "Helps rebuild joints or repair trauma" },
];

export function Step12OrganDonation() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const donationChoice = useWatch({
    control,
    name: "step12.donationChoice",
    defaultValue: "all",
  });

  const selectedOrgans = useWatch({
    control,
    name: "step12.selectedOrgans",
    defaultValue: [],
  });

  const selectedTissues = useWatch({
    control,
    name: "step12.selectedTissues",
    defaultValue: [],
  });

  const handleToggleOrgan = (organ: string) => {
    const current = selectedOrgans || [];
    const updated = current.includes(organ)
      ? current.filter((o) => o !== organ)
      : [...current, organ];
    setValue("step12.selectedOrgans", updated, { shouldValidate: true });
  };

  const handleToggleTissue = (tissue: string) => {
    const current = selectedTissues || [];
    const updated = current.includes(tissue)
      ? current.filter((t) => t !== tissue)
      : [...current, tissue];
    setValue("step12.selectedTissues", updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Organ Donation</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">Medical preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-6 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Importance of Organ and Tissue Donation
        </h3>
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          One cadaver donation can save the lives of up to 8 individuals suffering from end-stage
          organ damage, and tissue donation can improve the quality of life for many more by
          restoring function and appearance. Your generous decision can create a lasting legacy of
          hope and healing.
        </p>
      </div>

      {/* Donation Preference */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Donation Preference</h3>
        <div className="space-y-4">
          {[
            { value: 'all', label: 'I wish to donate all my organs and tissues as possible' },
            { value: 'specific', label: 'I wish to donate specific organs/tissues' },
            { value: 'none', label: 'I do not wish to donate my organs or tissues' }
          ].map((opt) => (
            <label 
              key={opt.value}
              className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                donationChoice === opt.value 
                  ? 'bg-rose-50/30 border-rose-200 shadow-md shadow-rose-100' 
                  : 'bg-white border-gray-100 hover:border-rose-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                donationChoice === opt.value ? 'border-[#FF6B6B] bg-[#FF6B6B]' : 'border-gray-300'
              }`}>
                {donationChoice === opt.value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
              <input
                type="radio"
                value={opt.value}
                {...register("step12.donationChoice")}
                className="hidden"
              />
              <span className={`font-bold ${donationChoice === opt.value ? 'text-gray-900' : 'text-gray-600'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Specific Organs/Tissues Selection */}
      {donationChoice === "specific" && (
        <>
          {/* Organs Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Organs to Donate</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {ORGANS.map((organ) => {
                const isSelected = selectedOrgans?.includes(organ.name);
                return (
                  <button
                    type="button"
                    key={organ.name}
                    className={`px-5 py-2.5 rounded-xl border font-bold transition-all duration-200 text-sm ${
                      isSelected
                        ? "bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-md shadow-rose-100 scale-[1.02]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-500 active:scale-95"
                    }`}
                    onClick={() => handleToggleOrgan(organ.name)}
                  >
                    {organ.name}
                  </button>
                );
              })}
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Organ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Medical Use
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {ORGANS.map((organ) => (
                    <tr key={organ.name} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{organ.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{organ.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tissues Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Tissues to Donate</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {TISSUES.map((tissue) => {
                const isSelected = selectedTissues?.includes(tissue.name);
                return (
                  <button
                    type="button"
                    key={tissue.name}
                    className={`px-5 py-2.5 rounded-xl border font-bold transition-all duration-200 text-sm ${
                      isSelected
                        ? "bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-md shadow-rose-100 scale-[1.02]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-500 active:scale-95"
                    }`}
                    onClick={() => handleToggleTissue(tissue.name)}
                  >
                    {tissue.name}
                  </button>
                );
              })}
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tissue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Medical Use
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {TISSUES.map((tissue) => (
                    <tr key={tissue.name} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{tissue.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{tissue.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation Error */}
          {errors.step12?.selectedOrgans && (
            <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4">
              <div className="w-1.5 h-12 bg-rose-500 rounded-full" />
              <p className="text-rose-600 font-bold">
                {errors.step12.selectedOrgans.message}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
