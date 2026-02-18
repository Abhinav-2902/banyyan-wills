'use client';

import { Users, Heart, Home, Gavel } from "lucide-react";
import { DashboardWillData, DashboardAsset, RecipientData } from "@/types/dashboard";

interface BeneficiaryMapProps {
  willData: DashboardWillData;
}

export function BeneficiaryMap({ willData }: BeneficiaryMapProps) {
  const assets = willData?.assets || [];
  const beneficiaries = willData?.beneficiaries || [];
  const charities = willData?.charities || [];
  // Assuming generic distribution exists in root or similar
  const genericAssetDistribution = willData?.genericAssetDistribution || {};

  // Create recipient map logic
  const recipientMap = new Map<string, RecipientData>();

  assets.forEach((asset: DashboardAsset) => {
    if (asset.distribution) {
      Object.entries(asset.distribution).forEach(([recipientId, percentage]) => {
        if (!recipientMap.has(recipientId)) {
          recipientMap.set(recipientId, { assets: [], genericPercentage: 0 });
        }
        recipientMap.get(recipientId)?.assets.push({
          type: asset.type,
          percentage: parseFloat(String(percentage)),
          details: asset.details || {}
        });
      });
    }
  });

  Object.entries(genericAssetDistribution).forEach(([recipientId, percentage]) => {
     if (parseFloat(String(percentage)) > 0) {
       if (!recipientMap.has(recipientId)) {
         recipientMap.set(recipientId, { assets: [], genericPercentage: 0 });
       }
       const recipient = recipientMap.get(recipientId);
       if (recipient) {
         recipient.genericPercentage = parseFloat(String(percentage));
       }
     }
  });

  if (recipientMap.size === 0) {
     return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full">
            <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-gray-800">Beneficiary Map</h3>
                  <p className="text-gray-600">What each recipient receives</p>
                </div>
                <div className="ml-auto text-gray-400 text-sm">No distributions to display</div>
             </div>
        </div>
     )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 h-full">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] rounded-full flex items-center justify-center flex-shrink-0">
          <Users className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-semibold text-gray-800">Beneficiary & Charity Map</h3>
          <p className="text-gray-600">What each recipient receives</p>
        </div>
      </div>
      
      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
        <p className="text-sm text-gray-600 mb-4">Visual representation of what each beneficiary and charity will receive.</p>
        {Array.from(recipientMap.entries()).map(([recipientId, data]) => {
          const recipient = beneficiaries.find(b => b.id === recipientId) || charities.find(c => c.id === recipientId);
          const recipientName = recipient?.fullName || recipient?.name || recipient?.charityName || 'Unknown Recipient';
          const isCharity = charities.some(c => c.id === recipientId);
          const totalAssets = data.assets.length + (data.genericPercentage > 0 ? 1 : 0);
          
          return (
            <div key={recipientId} className={`rounded-xl p-6 border-2 ${
              isCharity 
                ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200' 
                : 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${
                  isCharity ? 'bg-teal-100' : 'bg-rose-100'
                }`}>
                  {isCharity ? (
                    <Heart className="h-6 w-6 text-teal-600" />
                  ) : (
                    <Users className="h-6 w-6 text-[#FF6B6B]" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{recipientName}</h3>
                  <p className="text-sm text-gray-600">
                    {isCharity ? 'Charity' : recipient?.relationship || 'Beneficiary'} • Receiving {totalAssets} allocation{totalAssets !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Specific Assets */}
                {data.assets.map((assetAllocation, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-[#FF6B6B]" />
                        <span className="font-medium text-gray-900">{assetAllocation.type}</span>
                      </div>
                      <span className="text-lg font-bold text-[#FF6B6B]">{assetAllocation.percentage}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCharity 
                            ? 'bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC]'
                            : 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8787]'
                        }`}
                        style={{ width: `${assetAllocation.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                {/* Generic Assets */}
                {data.genericPercentage > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Gavel className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-gray-900">Generic Assets (Residuary)</span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">{data.genericPercentage}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.genericPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
