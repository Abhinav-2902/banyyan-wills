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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#5E4B8C]">Organ Donation</h2>
          <p className="text-sm text-gray-600">Medical preferences</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Importance of Organ and Tissue Donation
        </h3>
        <p className="text-blue-800 leading-relaxed">
          One cadaver donation can save the lives of up to 8 individuals suffering from end-stage
          organ damage, and tissue donation can improve the quality of life for many more by
          restoring function and appearance. Your generous decision can create a lasting legacy of
          hope and healing.
        </p>
      </div>

      {/* Donation Preference */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Preference</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              value="all"
              {...register("step12.donationChoice")}
              className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
            />
            <span className="text-gray-700 font-medium">
              I wish to donate all my organs and tissues as possible
            </span>
          </label>
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              value="specific"
              {...register("step12.donationChoice")}
              className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
            />
            <span className="text-gray-700 font-medium">
              I wish to donate specific organs/tissues
            </span>
          </label>
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              value="none"
              {...register("step12.donationChoice")}
              className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
            />
            <span className="text-gray-700 font-medium">
              I do not wish to donate my organs or tissues
            </span>
          </label>
        </div>
      </div>

      {/* Specific Organs/Tissues Selection */}
      {donationChoice === "specific" && (
        <>
          {/* Organs Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Organs to Donate</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {ORGANS.map((organ) => (
                <button
                  type="button"
                  key={organ.name}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                    selectedOrgans?.includes(organ.name)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-red-50"
                  }`}
                  onClick={() => handleToggleOrgan(organ.name)}
                >
                  {organ.name}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Organ
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Medical Use
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={2}
                      className="px-6 pt-2 pb-3 text-left text-xs text-gray-500 font-normal"
                    >
                      This table lists available organs and common medical uses. Select specific
                      organs above.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ORGANS.map((organ) => (
                    <tr key={organ.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{organ.name}</td>
                      <td className="px-6 py-4 text-gray-600">{organ.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tissues Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Tissues to Donate</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {TISSUES.map((tissue) => (
                <button
                  type="button"
                  key={tissue.name}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                    selectedTissues?.includes(tissue.name)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-red-50"
                  }`}
                  onClick={() => handleToggleTissue(tissue.name)}
                >
                  {tissue.name}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Tissue
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Medical Use
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={2}
                      className="px-6 pt-2 pb-3 text-left text-xs text-gray-500 font-normal"
                    >
                      This table lists available tissues and common medical uses. Select specific
                      tissues above.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {TISSUES.map((tissue) => (
                    <tr key={tissue.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{tissue.name}</td>
                      <td className="px-6 py-4 text-gray-600">{tissue.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation Error */}
          {errors.step12?.selectedOrgans && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.step12.selectedOrgans.message}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
