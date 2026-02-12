"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CompleteWillFormData, AssetDetails } from "@/lib/validations/will";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Home, Landmark, LineChart, Car, Gem, Briefcase } from "lucide-react";

export function AssetAllocationList() {
  const { control, setValue } = useFormContext<CompleteWillFormData>();

  const assetDetails = useWatch({
    control,
    name: "step3",
  });

  const beneficiaries = useWatch({
    control,
    name: "step4.beneficiaries",
  });

  // Helper to get all assets in a flat list
  const getAllAssets = (assets: AssetDetails) => {
    const allAssets: {
        id: string;
        type: string;
        description: string;
        icon: React.ReactNode;
        value?: string;
    }[] = [];

    if (assets.hasImmovableProperty && assets.immovableProperties) {
      assets.immovableProperties.forEach((p, i) => {
        allAssets.push({
          id: `property-${i}`,
          type: "Immovable Property",
          description: `${p.propertyType} - ${p.address.city}`, // Better description
          icon: <Home className="h-4 w-4" />,
          value: p.description
        });
      });
    }

    if (assets.hasBankAccounts && assets.bankAccounts) {
      assets.bankAccounts.forEach((b, i) => {
        allAssets.push({
          id: `bank-${i}`,
          type: "Bank Account",
          description: `${b.bankName} - ${b.accountNumber}`,
          icon: <Landmark className="h-4 w-4" />,
          value: `${b.bankName} (${b.accountNumber})`
        });
      });
    }

    if (assets.hasInvestments && assets.investments) {
      assets.investments.forEach((inv, i) => {
        allAssets.push({
          id: `investment-${i}`,
          type: "Investment",
          description: `${inv.investmentType} - ${inv.institutionCompanyName}`,
          icon: <LineChart className="h-4 w-4" />,
          value: `${inv.investmentType} (${inv.institutionCompanyName})`
        });
      });
    }

    if (assets.hasVehicles && assets.vehicles) {
      assets.vehicles.forEach((v, i) => {
        allAssets.push({
            id: `vehicle-${i}`,
            type: "Vehicle",
            description: `${v.makeModel} (${v.registrationNumber})`,
            icon: <Car className="h-4 w-4" />,
            value: `${v.makeModel} (${v.registrationNumber})`
        });
      });
    }

    if (assets.hasJewelryValuables && assets.jewelryValuables) {
         allAssets.push({
            id: `jewelry-0`,
            type: "Jewelry",
            description: assets.jewelryValuables.description,
            icon: <Gem className="h-4 w-4" />,
            value: assets.jewelryValuables.description
        });
    }

    if (assets.hasBusinessInterests && assets.businessInterests) {
        assets.businessInterests.forEach((b, i) => {
            allAssets.push({
                id: `business-${i}`,
                type: "Business",
                description: b.businessName,
                icon: <Briefcase className="h-4 w-4" />,
                value: b.businessName
            });
        });
    }
    
    // Digital assets and Debts are usually not "allocated" in the same way, or handled differently.
    // Debts are liabilities. Digital assets might just be instructions. 
    // For now, let's stick to positive assets.

    return allAssets;
  };

  const assetsList = getAllAssets(assetDetails);

  // Helper to check if an asset is assigned to a beneficiary
  const isAssetAssignedToBeneficiary = (beneficiaryIndex: number, assetValue: string) => {
    const currentAssets = beneficiaries?.[beneficiaryIndex]?.specificAssets || "";
    const assetArray = currentAssets.split(",").map(s => s.trim()).filter(Boolean);
    return assetArray.includes(assetValue);
  };

  const toggleAssetAssignment = (beneficiaryIndex: number, assetValue: string, isChecked: boolean) => {
    const currentAssetsStr = beneficiaries?.[beneficiaryIndex]?.specificAssets || "";
    let currentAssets = currentAssetsStr.split(",").map((s: string) => s.trim()).filter(Boolean);

    if (isChecked) {
        // Add asset if not present
        if (!currentAssets.includes(assetValue)) {
            currentAssets.push(assetValue);
        }
    } else {
        // Remove asset
        currentAssets = currentAssets.filter((a: string) => a !== assetValue);
    }

    setValue(`step4.beneficiaries.${beneficiaryIndex}.specificAssets`, currentAssets.join(", "), {
        shouldDirty: true,
        shouldValidate: true
    });
  };

  if (!assetDetails || assetsList.length === 0) {
      return (
          <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
              No assets found to allocate. Please add assets in Step 3.
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md text-sm mb-4">
        <strong>Tip:</strong> Select which beneficiary gets which asset. You can assign one asset to multiple people (Joint Ownership) or split it later.
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assetsList.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 py-3 border-b">
                <div className="flex items-center gap-2">
                    {asset.icon}
                    <span className="font-medium text-sm">{asset.type}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4">
               <div className="mb-4">
                   <h4 className="font-semibold text-lg">{asset.description}</h4>
               </div>

               <div className="space-y-3">
                   <Label className="text-xs text-muted-foreground uppercase tracking-wide">Assign to:</Label>
                   <ScrollArea className="h-[120px] w-full border rounded-md p-2">
                        <div className="space-y-2">
                            {beneficiaries?.map((beneficiary, bIndex) => (
                                <div key={bIndex} className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded">
                                    <Checkbox 
                                        id={`assign-${asset.id}-${bIndex}`} 
                                        checked={isAssetAssignedToBeneficiary(bIndex, asset.value || asset.description)}
                                        onCheckedChange={(checked) => toggleAssetAssignment(bIndex, asset.value || asset.description, checked as boolean)}
                                    />
                                    <Label 
                                        htmlFor={`assign-${asset.id}-${bIndex}`}
                                        className="flex-1 cursor-pointer flex items-center justify-between"
                                    >
                                        <span>{beneficiary.fullName}</span>
                                        <Badge variant="outline" className="text-[10px]">{beneficiary.relationship}</Badge>
                                    </Label>
                                </div>
                            ))}
                            {(!beneficiaries || beneficiaries.length === 0) && (
                                <p className="text-sm text-destructive">No beneficiaries added yet.</p>
                            )}
                        </div>
                   </ScrollArea>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
