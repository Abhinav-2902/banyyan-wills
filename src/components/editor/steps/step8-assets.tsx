"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Home, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

const assetTypes = [
  'Property', 'Investment', 'Bank', 'Jewellery', 'Vehicles', 
  'Loans', 'Income', 'Life Insurance Policy', 'Other'
];

const investmentTypes = [
  'Demat', 'Mutual Funds', 'Gold Bond', 'Shares', 'FD', 
  'Public Provident Fund', 'Employee Provident Fund', 'Pension', 'Cash', 'Other'
];

export function Step8Assets() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step8.assets",
  });

  // Use useWatch for reactive updates
  const watchedAssets = useWatch({
    control,
    name: "step8.assets",
  });

  // Watch beneficiaries and charities from previous steps
  const beneficiaries = watch("step6.beneficiaries") || [];
  const charities = watch("step7.charities") || [];

  // Combine recipients with type tags
  const recipients = useMemo(() => {
    const beneficiariesTagged = beneficiaries.map((b, idx) => ({
      id: `beneficiary-${idx}`,
      name: b.name || `Beneficiary ${idx + 1}`,
      __type: 'beneficiary' as const
    }));
    const charitiesTagged = charities.map((c, idx) => ({
      id: `charity-${idx}`,
      name: c.name || `Charity ${idx + 1}`,
      __type: 'charity' as const
    }));
    return [...beneficiariesTagged, ...charitiesTagged];
  }, [beneficiaries, charities]);

  const addAsset = () => {
    append({
      type: "",
      details: {},
      distribution: {},
      selectedRecipients: [],
    });
  };

  const handleAssetTypeChange = (index: number, value: string) => {
    // Only update the type, let details be filled by user
    setValue(`step8.assets.${index}.type`, value, { shouldValidate: false, shouldDirty: true });
  };

  const handleRecipientSelection = (assetIndex: number, recipientId: string) => {
    const asset = watch(`step8.assets.${assetIndex}`);
    const selectedRecipients = asset?.selectedRecipients || [];
    const distribution = asset?.distribution || {};

    if (selectedRecipients.includes(recipientId)) {
      // Deselect
      const newSelected = selectedRecipients.filter((id: string) => id !== recipientId);
      const newDistribution = { ...distribution };
      delete newDistribution[recipientId];
      setValue(`step8.assets.${assetIndex}.selectedRecipients`, newSelected);
      setValue(`step8.assets.${assetIndex}.distribution`, newDistribution);
    } else {
      // Select
      setValue(`step8.assets.${assetIndex}.selectedRecipients`, [...selectedRecipients, recipientId]);
      setValue(`step8.assets.${assetIndex}.distribution`, { ...distribution, [recipientId]: 0 });
    }
  };

  const divideEqually = (assetIndex: number) => {
    const asset = watch(`step8.assets.${assetIndex}`);
    const selected = asset?.selectedRecipients || [];
    const count = selected.length;
    
    if (count === 0) return;

    const equalShare = Math.floor((100 / count) * 100) / 100;
    const shares = Array(count).fill(equalShare);
    const total = shares.reduce((a: number, b: number) => a + b, 0);
    const remainder = Math.round((100 - total) * 100) / 100;
    shares[count - 1] += remainder;

    const newDistribution: Record<string, number> = {};
    selected.forEach((id: string, idx: number) => {
      newDistribution[id] = Number(shares[idx].toFixed(2));
    });

    setValue(`step8.assets.${assetIndex}.distribution`, newDistribution);
  };

  const toggleSelectAllBeneficiaries = (assetIndex: number) => {
    const asset = watch(`step8.assets.${assetIndex}`);
    const beneficiaryIds = recipients
      .filter(r => r.__type === 'beneficiary')
      .map(r => r.id);
    
    const selectedRecipients = asset?.selectedRecipients || [];
    const allSelected = beneficiaryIds.every((id: string) => selectedRecipients.includes(id));

    if (allSelected) {
      // Deselect all beneficiaries
      const newSelected = selectedRecipients.filter((id: string) => 
        !beneficiaryIds.includes(id)
      );
      const newDistribution = { ...asset?.distribution };
      beneficiaryIds.forEach((id: string) => delete newDistribution[id]);
      setValue(`step8.assets.${assetIndex}.selectedRecipients`, newSelected);
      setValue(`step8.assets.${assetIndex}.distribution`, newDistribution);
    } else {
      // Select all beneficiaries
      const newSelected = Array.from(new Set([...selectedRecipients, ...beneficiaryIds]));
      const distribution = { ...asset?.distribution };
      beneficiaryIds.forEach((id: string) => {
        if (distribution[id] === undefined) distribution[id] = 0;
      });
      setValue(`step8.assets.${assetIndex}.selectedRecipients`, newSelected);
      setValue(`step8.assets.${assetIndex}.distribution`, distribution);
    }
  };

  const toggleSelectAllCharities = (assetIndex: number) => {
    const asset = watch(`step8.assets.${assetIndex}`);
    const charityIds = recipients
      .filter(r => r.__type === 'charity')
      .map(r => r.id);
    
    const selectedRecipients = asset?.selectedRecipients || [];
    const allSelected = charityIds.every((id: string) => selectedRecipients.includes(id));

    if (allSelected) {
      // Deselect all charities
      const newSelected = selectedRecipients.filter((id: string) => 
        !charityIds.includes(id)
      );
      const newDistribution = { ...asset?.distribution };
      charityIds.forEach((id: string) => delete newDistribution[id]);
      setValue(`step8.assets.${assetIndex}.selectedRecipients`, newSelected);
      setValue(`step8.assets.${assetIndex}.distribution`, newDistribution);
    } else {
      // Select all charities
      const newSelected = Array.from(new Set([...selectedRecipients, ...charityIds]));
      const distribution = { ...asset?.distribution };
      charityIds.forEach((id: string) => {
        if (distribution[id] === undefined) distribution[id] = 0;
      });
      setValue(`step8.assets.${assetIndex}.selectedRecipients`, newSelected);
      setValue(`step8.assets.${assetIndex}.distribution`, distribution);
    }
  };

  const handleImageUpload = (assetIndex: number, file: File) => {
    if (file) {
      // Check file size (max 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large (max 800px width)
          const maxWidth = 800;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const compressedData = canvas.toDataURL('image/jpeg', 0.7);

          const asset = watch(`step8.assets.${assetIndex}`);
          const images = asset?.details?.images || [];
          const newImages = [
            ...images,
            {
              id: Date.now(),
              data: compressedData,
              name: file.name
            }
          ];
          setValue(`step8.assets.${assetIndex}.details.images`, newImages);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (assetIndex: number, imageId: number) => {
    const asset = watch(`step8.assets.${assetIndex}`);
    const images = asset?.details?.images || [];
    const newImages = images.filter((img: any) => img.id !== imageId);
    setValue(`step8.assets.${assetIndex}.details.images`, newImages);
  };

  const getDistributionError = (assetIndex: number) => {
    const asset = watch(`step8.assets.${assetIndex}`);
    const selected = asset?.selectedRecipients || [];
    if (selected.length > 0) {
      const sum = selected.reduce((acc: number, id: string) => 
        acc + (Number(asset?.distribution?.[id]) || 0), 0
      );
      if (Math.abs(sum - 100) > 0.01) {
        return 'Total does not add up to 100%';
      }
    }
    return '';
  };

  const renderAssetFields = (assetIndex: number, asset: any) => {
    const assetType = asset?.type;

    if (!assetType) return null;

    switch (assetType) {
      case 'Property':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Address *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.address`)}
                placeholder="Enter full property address"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.address && (
                <p className="text-sm text-red-500 mt-1 font-medium">
                  {(errors.step8.assets[assetIndex].details as any).address.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">City *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.city`)}
                  placeholder="City"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.city && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">State *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.state`)}
                  placeholder="State"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.state && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).state.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Country *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.country`)}
                  placeholder="Country"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.country && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).country.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Zip Code *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.zipCode`)}
                  placeholder="Zip Code"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.zipCode && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).zipCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'Investment':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Investment Type *</Label>
              <div className="relative">
                <select
                  {...register(`step8.assets.${assetIndex}.details.investmentType`)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] appearance-none transition-all cursor-pointer font-medium text-gray-700"
                >
                  <option value="">Select investment type</option>
                  {investmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'Demat' ? 'Demat Account' : type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors?.step8?.assets?.[assetIndex]?.details?.investmentType && (
                <p className="text-sm text-red-500 mt-1 font-medium">
                  {(errors.step8.assets[assetIndex].details as any).investmentType.message}
                </p>
              )}
            </div>
            {asset?.details?.investmentType === 'Other' && (
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Specify Other Type *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.otherInvestmentType`)}
                  placeholder="Specify the investment type"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.otherInvestmentType && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).otherInvestmentType.message}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Account Number or Bond Number *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.accountNumber`)}
                placeholder="Enter account/bond number"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.accountNumber && (
                <p className="text-sm text-red-500 mt-1 font-medium">
                  {(errors.step8.assets[assetIndex].details as any).accountNumber.message}
                </p>
              )}
            </div>
          </div>
        );

      case 'Bank':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Bank Name *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.bankName`)}
                placeholder="Enter bank name"
                className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.bankName && (
                <p className="text-sm text-red-500 mt-1 font-medium">
                  {(errors.step8.assets[assetIndex].details as any).bankName.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Account Number (Optional)</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.accountNumber`)}
                  placeholder="Last 4 digits"
                  type="text"
                  inputMode="numeric"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Account Type (Optional)</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.accountType`)}
                  placeholder="e.g., Savings, Current"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
              </div>
            </div>
          </div>
        );

      case 'Jewellery':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Description *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.description`)}
                  placeholder="e.g., Gold Ring, Diamond Necklace"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.description && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Estimated Value *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.value`)}
                  placeholder="Enter estimated value"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.value && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).value.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Weight (Optional)</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.weight`)}
                  placeholder="e.g., 10g"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Hallmark (Optional)</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.hallmark`)}
                  placeholder="e.g., 22K, 18K"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
              </div>
            </div>
            {/* Image Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-bold text-gray-700">Upload Photos (Optional)</Label>
              <div className="border-2 border-dashed border-rose-100 bg-rose-50/10 rounded-2xl p-8 hover:border-rose-200 hover:bg-rose-50/20 transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files || []).forEach(file => {
                      handleImageUpload(assetIndex, file);
                    });
                  }}
                  className="hidden"
                  id={`image-upload-${assetIndex}`}
                />
                <label htmlFor={`image-upload-${assetIndex}`} className="cursor-pointer flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700">Click to upload images</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 2MB each</p>
                  </div>
                </label>
              </div>
              {/* Display uploaded images */}
              {asset?.details?.images && asset.details.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {asset.details.images.map((image: any, imgIdx: number) => (
                    <div key={image.id} className="relative group aspect-square">
                      <Image
                        src={image.data}
                        alt={`Jewellery ${imgIdx + 1}`}
                        fill
                        className="object-cover rounded-xl border border-gray-100"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(assetIndex, image.id)}
                        className="absolute -top-2 -right-2 bg-white text-rose-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'Other':
      case 'Vehicles':
      case 'Loans':
      case 'Income':
      case 'Life Insurance Policy':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Description *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.description`)}
                  placeholder="Describe the asset"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.description && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Value *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.value`)}
                  placeholder="Enter value"
                  className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.value && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {(errors.step8.assets[assetIndex].details as any).value.message}
                  </p>
                )}
              </div>
            </div>
            {/* Image Upload for These types */}
            {(assetType === 'Other' || assetType === 'Vehicles') && (
              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-700">Upload Photos (Optional)</Label>
                <div className="border-2 border-dashed border-rose-100 bg-rose-50/10 rounded-2xl p-8 hover:border-rose-200 hover:bg-rose-50/20 transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      Array.from(e.target.files || []).forEach(file => {
                        handleImageUpload(assetIndex, file);
                      });
                    }}
                    className="hidden"
                    id={`image-upload-generic-${assetIndex}`}
                  />
                  <label htmlFor={`image-upload-generic-${assetIndex}`} className="cursor-pointer flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700">Click to upload images</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 2MB each</p>
                    </div>
                  </label>
                </div>
                {asset?.details?.images && asset.details.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {asset.details.images.map((image: any, imgIdx: number) => (
                      <div key={image.id} className="relative group aspect-square">
                        <Image
                          src={image.data}
                          alt={`Asset image ${imgIdx + 1}`}
                          fill
                          className="object-cover rounded-xl border border-gray-100"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(assetIndex, image.id)}
                          className="absolute -top-2 -right-2 bg-white text-rose-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-xl">
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          List your assets and allocate them to beneficiaries or charities. Ensure details are accurate; allocations should total 100% for each asset.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-6 font-medium">No assets added yet</p>
          <button
            type="button"
            onClick={addAsset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-lg shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Add Your First Asset
          </button>
        </div>
      ) : (
        <>
          {fields.map((field, index) => {
            const asset = watchedAssets?.[index] || {};
            const distributionError = getDistributionError(index);

            return (
              <div key={field.id} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] rounded-xl shadow-lg shadow-rose-100">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Asset {index + 1}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex items-center gap-2 px-4 py-2 text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors font-semibold text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Asset Type Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Asset Type *</Label>
                    <div className="relative">
                      <select
                        value={asset?.type || ""}
                        onChange={(e) => handleAssetTypeChange(index, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] appearance-none transition-all cursor-pointer font-medium text-gray-700"
                      >
                        <option value="">Select asset type</option>
                        {assetTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {errors?.step8?.assets?.[index]?.type && (
                      <p className="text-sm text-red-600 mt-1 font-medium">
                        {(errors.step8.assets[index] as any).type.message}
                      </p>
                    )}
                  </div>

                  {/* Asset-specific fields */}
                  {renderAssetFields(index, asset)}

                  {asset?.type && recipients.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div className="space-y-1">
                          <Label className="text-lg font-bold text-gray-900">Distribute Asset</Label>
                          <p className="text-sm text-gray-500">Select recipients and assign percentage shares</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            onClick={() => divideEqually(index)}
                            variant="outline"
                            size="sm"
                            className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold"
                          >
                            Divide Equally
                          </Button>
                          <Button
                            type="button"
                            onClick={() => toggleSelectAllBeneficiaries(index)}
                            variant="outline"
                            size="sm"
                            className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold"
                          >
                            {recipients.filter(r => r.__type === 'beneficiary').every((r: any) => 
                              asset?.selectedRecipients?.includes(r.id)
                            ) ? 'Deselect' : 'Select'} All Beneficiaries
                          </Button>
                          <Button
                            type="button"
                            onClick={() => toggleSelectAllCharities(index)}
                            variant="outline"
                            size="sm"
                            className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold"
                          >
                            {recipients.filter(r => r.__type === 'charity').every((r: any) => 
                              asset?.selectedRecipients?.includes(r.id)
                            ) ? 'Deselect' : 'Select'} All Charities
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipients.map((recipient) => {
                          const isSelected = asset?.selectedRecipients?.includes(recipient.id);
                          const value = asset?.distribution?.[recipient.id] || 0;

                          return (
                            <div key={recipient.id} className={`flex flex-col p-4 rounded-xl border transition-all ${isSelected ? 'border-rose-200 bg-rose-50/20' : 'border-gray-100 bg-gray-50/30'}`}>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleRecipientSelection(index, recipient.id)}
                                  className="h-5 w-5 text-[#FF6B6B] focus:ring-[#FF6B6B] border-gray-300 rounded-lg cursor-pointer"
                                />
                                <label className="text-sm font-bold text-gray-700 cursor-pointer">
                                  {recipient.name}
                                </label>
                              </div>
                              {isSelected && (
                                <div className="flex items-center space-x-2 mt-3 w-full animate-in fade-in slide-in-from-top-1 duration-200">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={value === 0 ? '' : value}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (inputValue === '' || (parseFloat(inputValue) >= 0 && parseFloat(inputValue) <= 100)) {
                                        const limitedValue = Math.min(Math.max(parseFloat(inputValue) || 0, 0), 100);
                                        const roundedValue = Math.round(limitedValue * 100) / 100;
                                        setValue(`step8.assets.${index}.distribution.${recipient.id}`, roundedValue);
                                      }
                                    }}
                                    className="flex-1 px-3 py-2 bg-white border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] font-bold text-rose-600"
                                  />
                                  <span className="text-sm font-bold text-rose-500 w-6">%</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {(distributionError || errors?.step8?.assets?.[index]?.distribution) && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                          <div className="w-2 h-10 bg-rose-500 rounded-full" />
                          <div>
                            {distributionError && (
                              <p className="text-rose-600 font-bold text-sm">{distributionError}</p>
                            )}
                            {errors?.step8?.assets?.[index]?.distribution && (
                              <p className="text-rose-600 font-bold text-sm">
                                {(errors.step8.assets[index] as any).distribution.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Asset Button */}
          <button
            type="button"
            onClick={addAsset}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-lg shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98] mt-8"
          >
            <Plus className="h-5 w-5" />
            Add Another Asset
          </button>
        </>
      )}
    </div>
  );
}
