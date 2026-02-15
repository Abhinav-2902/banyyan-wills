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
          <div className="space-y-4">
            <div>
              <Label>Address *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.address`)}
                placeholder="Enter address"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.address && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).address.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.city`)}
                  placeholder="City"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.city && (
                  <p className="text-sm text-red-600 mt-1">
                    {(errors.step8.assets[assetIndex].details as any).city.message}
                  </p>
                )}
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.state`)}
                  placeholder="State"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.state && (
                  <p className="text-sm text-red-600 mt-1">
                    {(errors.step8.assets[assetIndex].details as any).state.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Country *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.country`)}
                  placeholder="Country"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.country && (
                  <p className="text-sm text-red-600 mt-1">
                    {(errors.step8.assets[assetIndex].details as any).country.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Zip Code *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.zipCode`)}
                  placeholder="Zip Code"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.zipCode && (
                  <p className="text-sm text-red-600 mt-1">
                    {(errors.step8.assets[assetIndex].details as any).zipCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'Investment':
        return (
          <div className="space-y-4">
            <div>
              <Label>Investment Type *</Label>
              <select
                {...register(`step8.assets.${assetIndex}.details.investmentType`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select investment type</option>
                {investmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'Demat' ? 'Demat Account' : type}
                  </option>
                ))}
              </select>
              {errors?.step8?.assets?.[assetIndex]?.details?.investmentType && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).investmentType.message}
                </p>
              )}
            </div>
            {asset?.details?.investmentType === 'Other' && (
              <div>
                <Label>Specify Other Type *</Label>
                <Input
                  {...register(`step8.assets.${assetIndex}.details.otherInvestmentType`)}
                  placeholder="Specify the investment type"
                />
                {errors?.step8?.assets?.[assetIndex]?.details?.otherInvestmentType && (
                  <p className="text-sm text-red-600 mt-1">
                    {(errors.step8.assets[assetIndex].details as any).otherInvestmentType.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <Label>Account Number or Bond Number *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.accountNumber`)}
                placeholder="Enter account/bond number"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.accountNumber && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).accountNumber.message}
                </p>
              )}
            </div>
          </div>
        );

      case 'Bank':
        return (
          <div className="space-y-4">
            <div>
              <Label>Bank Name *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.bankName`)}
                placeholder="Enter bank name"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.bankName && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).bankName.message}
                </p>
              )}
            </div>
            <div>
              <Label>Account Number (Optional)</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.accountNumber`)}
                placeholder="Last 4 digits (optional)"
                type="text"
                inputMode="numeric"
              />
            </div>
            <div>
              <Label>Account Type (Optional)</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.accountType`)}
                placeholder="e.g., Savings, Current"
              />
            </div>
          </div>
        );

      case 'Jewellery':
        return (
          <div className="space-y-4">
            <div>
              <Label>Description *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.description`)}
                placeholder="e.g., Gold Ring, Diamond Necklace"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.description && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).description.message}
                </p>
              )}
            </div>
            <div>
              <Label>Estimated Value *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.value`)}
                placeholder="Enter estimated value"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.value && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).value.message}
                </p>
              )}
            </div>
            <div>
              <Label>Weight (Optional)</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.weight`)}
                placeholder="e.g., 10g"
              />
            </div>
            <div>
              <Label>Hallmark/Quality (Optional)</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.hallmark`)}
                placeholder="e.g., 22K, 18K"
              />
            </div>
            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Upload Photos (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                <label htmlFor={`image-upload-${assetIndex}`} className="cursor-pointer">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </label>
              </div>
              {/* Display uploaded images */}
              {asset?.details?.images && asset.details.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {asset.details.images.map((image: any, imgIdx: number) => (
                    <div key={image.id} className="relative group">
                      <Image
                        src={image.data}
                        alt={`Jewellery ${imgIdx + 1}`}
                        width={200}
                        height={96}
                        className="w-full h-24 object-cover rounded-lg border"
                        loading="lazy"
                        unoptimized
                      />
                      <div className="mt-1 text-xs text-gray-700 text-center">
                        Jewellery {imgIdx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(assetIndex, image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
        return (
          <div className="space-y-4">
            <div>
              <Label>Description *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.description`)}
                placeholder="Describe the asset"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.description && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).description.message}
                </p>
              )}
            </div>
            <div>
              <Label>Value *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.value`)}
                placeholder="Enter value"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.value && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).value.message}
                </p>
              )}
            </div>
            {/* Image Upload for Other */}
            <div className="space-y-3">
              <Label>Upload Photos (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                  id={`image-upload-other-${assetIndex}`}
                />
                <label htmlFor={`image-upload-other-${assetIndex}`} className="cursor-pointer">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </label>
              </div>
              {asset?.details?.images && asset.details.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {asset.details.images.map((image: any, imgIdx: number) => (
                    <div key={image.id} className="relative group">
                      <Image
                        src={image.data}
                        alt={`Others ${imgIdx + 1}`}
                        width={200}
                        height={96}
                        className="w-full h-24 object-cover rounded-lg border"
                        loading="lazy"
                        unoptimized
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 text-center rounded-b-lg">
                        Others {imgIdx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(assetIndex, image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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

      default:
        // Default fields for Vehicles, Loans, Income, Life Insurance Policy
        return (
          <div className="space-y-4">
            <div>
              <Label>Description *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.description`)}
                placeholder="Describe the asset"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.description && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).description.message}
                </p>
              )}
            </div>
            <div>
              <Label>Value *</Label>
              <Input
                {...register(`step8.assets.${assetIndex}.details.value`)}
                placeholder="Enter value"
              />
              {errors?.step8?.assets?.[assetIndex]?.details?.value && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors.step8.assets[assetIndex].details as any).value.message}
                </p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
        <p className="text-sm text-gray-800">
          List your assets and allocate them to beneficiaries or charities. Ensure details are accurate; allocations should total 100% for each asset.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No assets added yet</p>
          <button
            type="button"
            onClick={addAsset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BA7] hover:to-[#3A1F61] transition-all"
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
              <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Asset {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Asset Type Selector */}
                  <div>
                    <Label>Asset Type *</Label>
                    <select
                      value={asset?.type || ""}
                      onChange={(e) => handleAssetTypeChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select asset type</option>
                      {assetTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors?.step8?.assets?.[index]?.type && (
                      <p className="text-sm text-red-600 mt-1">
                        {(errors.step8.assets[index] as any).type.message}
                      </p>
                    )}
                  </div>

                  {/* Asset-specific fields */}
                  {renderAssetFields(index, asset)}

                  {/* Distribution Section */}
                  {asset?.type && recipients.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-300">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                        <Label className="text-sm font-medium text-gray-700">Distribution</Label>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            onClick={() => divideEqually(index)}
                            variant="outline"
                            size="sm"
                          >
                            Divide Equally
                          </Button>
                          <Button
                            type="button"
                            onClick={() => toggleSelectAllBeneficiaries(index)}
                            variant="outline"
                            size="sm"
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
                            <div key={recipient.id} className="flex flex-col items-start">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleRecipientSelection(index, recipient.id)}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                  {recipient.name}
                                </label>
                              </div>
                              {isSelected && (
                                <div className="flex items-center space-x-2 mt-1 w-full">
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
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                  <span className="text-sm text-gray-500 w-8">%</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {(distributionError || errors?.step8?.assets?.[index]?.distribution) && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          {distributionError && (
                            <p className="text-red-600 font-medium">{distributionError}</p>
                          )}
                          {errors?.step8?.assets?.[index]?.distribution && (
                            <p className="text-red-600 font-medium">
                              {(errors.step8.assets[index] as any).distribution.message}
                            </p>
                          )}
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
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            <Plus className="h-5 w-5" />
            Add Another Asset
          </button>
        </>
      )}
    </div>
  );
}
