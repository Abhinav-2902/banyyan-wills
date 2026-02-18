'use client';

import { Home, Heart, Users } from "lucide-react";
import { DashboardWillData, DashboardAsset } from "@/types/dashboard";

interface AssetDistributionMapProps {
  willData: DashboardWillData;
}

export function AssetDistributionMap({ willData }: AssetDistributionMapProps) {
  // Parsing logic adapted from inspiration but for our potentially different structure
  // The inspiration uses flat arrays. Our data is likely in willData.assets, willData.beneficiaries etc.
  
  const assets = willData?.assets || [];
  const beneficiaries = willData?.beneficiaries || [];
  const charities = willData?.charities || [];

  if (!assets || assets.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] rounded-full flex items-center justify-center flex-shrink-0">
            <Home className="text-white" size={24} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-semibold text-gray-800">Asset Distribution Map</h3>
            <p className="text-gray-600">How your assets are distributed</p>
          </div>
          <div className="ml-auto text-gray-400 text-sm">No assets to display</div>
        </div>
      </div>
    );
  }

  // Helper to get formatted labels (adapted from inspiration)
  const getAssetDisplayLabel = (asset: DashboardAsset) => {
    const { type, details = {} } = asset;
    // Simplified logic for now
    if (type === 'Property') return details.address || 'Property';
    if (type === 'Bank Account') return details.bankName || 'Bank Account';
    return type;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] rounded-full flex items-center justify-center flex-shrink-0">
          <Home className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-semibold text-gray-800">Asset Distribution Map</h3>
          <p className="text-gray-600">How your assets are distributed</p>
        </div>
      </div>
      
      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
        <p className="text-sm text-gray-600 mb-4">Visual representation of how each asset is distributed among beneficiaries and charities.</p>
        {assets.map((asset: DashboardAsset, idx: number) => {
          const hasDistribution = asset.distribution && Object.keys(asset.distribution).length > 0;
          if (!hasDistribution) return null;
          
          return (
            <div key={idx} className="bg-gradient-to-r from-teal-50 to-rose-50 rounded-xl p-6 border border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Home className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{asset.type}</h3>
                  <p className="text-sm text-gray-600">
                    {getAssetDisplayLabel(asset)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {Object.entries(asset.distribution || {}).map(([recipientId, percentage]) => {
                  const recipient = beneficiaries.find(b => b.id === recipientId) || charities.find(c => c.id === recipientId);
                  const recipientName = recipient?.fullName || recipient?.name || recipient?.charityName || 'Unknown Recipient'; // Adjusted for likely schema
                  const isCharity = charities.some(c => c.id === recipientId);
                  
                  return (
                    <div key={recipientId} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-full ${
                          isCharity ? 'bg-green-100' : 'bg-rose-100'
                        }`}>
                          {isCharity ? (
                            <Heart className="h-4 w-4 text-green-600" />
                          ) : (
                            <Users className="h-4 w-4 text-[#FF6B6B]" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate" title={recipientName}>{recipientName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {isCharity ? 'Charity' : recipient?.relationship || 'Beneficiary'}
                        </span>
                        <span className="text-lg font-bold text-teal-600">{String(percentage)}%</span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#4FD1C5] to-[#FF6B6B] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
