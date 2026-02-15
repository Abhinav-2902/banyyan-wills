import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { v4 as uuidv4 } from 'uuid';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveCharities } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, Heart, Plus, Trash2, CheckCircle, Phone } from 'lucide-react';

const Charity = () => {
  const [charities, setCharities] = useState([{ name: '', identificationNumber: '', phoneNumber: '', address: '', city: '', state: '', country: '', zipCode: '' }]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Auto-save when navigating between pages
  useAutoSaveCharities(charities, unsaved, setUnsaved);

  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('charities');
        console.log('Loaded charities data:', loaded); // Debug log
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('charities') || '[]');
        }
        if (loaded && Array.isArray(loaded)) {
          setCharities(loaded);
        }
      } catch (error) {
        console.error('Error loading charities:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('charities') || '[]');
          if (localData && Array.isArray(localData)) {
            setCharities(localData);
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      }
    }
    
    fetchData();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Remove the beforeunload save logic
  // useEffect(() => {
  //   const handleBeforeUnload = async () => {
  //     try {
  //       if (charities && charities.length > 0) {
  //         const charitiesWithId = charities.map(c => ({ ...c, id: c.id || uuidv4() }));
  //         await saveSectionData('charities', charitiesWithId);
  //       }
  //     } catch (error) {
  //       console.error('Error saving on page unload:', error);
  //     }
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  // }, [charities]);

  const addCharity = () => {
    setCharities([...charities, { id: uuidv4(), name: '', identificationNumber: '', phoneNumber: '', address: '', city: '', state: '', country: '', zipCode: '' }]);
  };

  const removeCharity = async (index) => {
    const newCharities = charities.filter((_, i) => i !== index);
    setCharities(newCharities);
    setUnsaved(true);
    
    // If all charities are removed, save empty array to mark section as complete
    if (newCharities.length === 0) {
      try {
        await saveSectionData('charities', []);
        setUnsaved(false);
      } catch (error) {
        console.error('Error saving empty charities array:', error);
      }
    }
  };

  // Mark as unsaved on any field change
  const handleChange = (index, field, value) => {
    setUnsaved(true);
    const newCharities = [...charities];
    newCharities[index][field] = value;
    setCharities(newCharities);
  };

  const handleSubmit = async () => {
    try {
      const charitiesWithId = charities.map(c => ({ ...c, id: c.id || uuidv4() }));
      await saveSectionData('charities', charitiesWithId);
      setUnsaved(false); // Mark as saved
      navigate('/assets');
    } catch (e) {
      console.error('Error submitting form:', e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const charitiesWithId = charities.map(c => ({ ...c, id: c.id || uuidv4() }));
      await saveSectionData('charities', charitiesWithId);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving charities:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WillFormLayout 
      title="Charity Donations" 
      description="Specify charitable organizations you'd like to support"
    >
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-800 font-medium">Progress saved successfully!</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        {charities.map((charity, index) => (
          <section key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-white p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#5E4B8C]">Charity {index + 1}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeCharity(index)}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Remove</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`name-${index}`}>
                    Charity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`name-${index}`}
                    value={charity.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter charity name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`identificationNumber-${index}`}>
                    Identification Number
                  </label>
                  <input
                    id={`identificationNumber-${index}`}
                    value={charity.identificationNumber}
                    onChange={(e) => handleChange(index, 'identificationNumber', e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:italic placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`phoneNumber-${index}`}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id={`phoneNumber-${index}`}
                    type="tel"
                    value={charity.phoneNumber}
                    onChange={(e) => handleChange(index, 'phoneNumber', e.target.value)}
                    placeholder="Optional"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:italic placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`address-${index}`}>
                  Address
                </label>
                <input
                  id={`address-${index}`}
                  value={charity.address}
                  onChange={(e) => handleChange(index, 'address', e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:italic placeholder:text-gray-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`city-${index}`}>
                    City
                  </label>
                  <input
                    id={`city-${index}`}
                    value={charity.city}
                    onChange={(e) => handleChange(index, 'city', e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:italic placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`state-${index}`}>
                    State
                  </label>
                  <input
                    id={`state-${index}`}
                    value={charity.state}
                    onChange={(e) => handleChange(index, 'state', e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:italic placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`country-${index}`}>
                    Country
                  </label>
                  <input
                    id={`country-${index}`}
                    value={charity.country}
                    onChange={(e) => handleChange(index, 'country', e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:italic placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`zipCode-${index}`}>
                    Zip Code
                  </label>
                  <input
                    id={`zipCode-${index}`}
                    value={charity.zipCode}
                    onChange={(e) => handleChange(index, 'zipCode', e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:italic placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
        <button 
          type="button" 
          onClick={addCharity} 
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Charity</span>
        </button>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>Save Progress</span>
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BAD] hover:to-[#381F64] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            <span>Continue to Assets</span>
          </button>
        </div>
      </form>
    </WillFormLayout>
  );
};
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';
import { loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveAssets } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, Home, Plus, Trash2, CheckCircle, ChevronDown } from 'lucide-react';

const assetTypes = ['Property', 'Investment', 'Bank', 'Jewellery', 'Vehicles', 'Loans', 'Income', 'Life Insurance Policy', 'Other'];
const investmentTypes = ['Demat', 'Mutual Funds', 'Gold Bond', 'Shares', 'FD', 'Public Provident Fund', 'Employee Provident Fund', 'Pension', 'Cash', 'Other'];

// Add this helper function after the assetTypes array and before the Assets component
const computeImageLabels = (assets) => {
  const imageLabels = new Map();
  let globalJewelleryCounter = 0;
  let globalOthersCounter = 0;
  
  assets.forEach((asset, assetIdx) => {
    if (asset.details.images && Array.isArray(asset.details.images)) {
      asset.details.images.forEach((image, imgIdx) => {
        let label;
        if (asset.type === 'Jewellery') {
          globalJewelleryCounter += 1;
          label = `Jewellery ${globalJewelleryCounter}`;
        } else {
          globalOthersCounter += 1;
          label = `Others ${globalOthersCounter}`;
        }
        imageLabels.set(`${assetIdx}:${imgIdx}`, label);
      });
    }
  });
  
  return imageLabels;
};

const Assets = () => {
  const [assets, setAssets] = useState([{ type: '', details: {}, distribution: {}, selectedRecipients: [] }]);
  const navigate = useNavigate();
  const { saveAssets, getSavedAssets } = useAssets();
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [genericAssetDistribution, setGenericAssetDistribution] = useState(() => {
    return JSON.parse(localStorage.getItem('genericAssetDistribution') || '{}');
  });
  const [recipients, setRecipients] = useState([]);
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Add: compute category-based labels per current user's assets (not shared globally)
  const imageLabels = React.useMemo(() => {
    let jewelleryCounter = 0;
    let othersCounter = 0;
    const labels = {};
    assets.forEach((asset, assetIdx) => {
      const imgs = asset?.details?.images || [];
      imgs.forEach((_, imgIdx) => {
        const key = `${assetIdx}:${imgIdx}`;
        if (asset.type === 'Jewellery') {
          jewelleryCounter += 1;
          labels[key] = `Jewellery ${jewelleryCounter}`;
        } else {
          othersCounter += 1;
          labels[key] = `Others ${othersCounter}`;
        }
      });
    });
    return labels;
  }, [assets]);
  
  // Auto-save when navigating between pages
  useAutoSaveAssets(assets, unsaved, setUnsaved);

  useEffect(() => {
    async function fetchRecipients() {
      const beneficiaries = await loadSectionData('savedBeneficiaries') || [];
      const charities = await loadSectionData('charities') || [];
      // Tag recipients by type for easy per-asset Select/Deselect All
      const beneficiariesTagged = (beneficiaries || []).map(b => ({ ...b, __type: 'beneficiary' }));
      const charitiesTagged = (charities || []).map(c => ({ ...c, __type: 'charity' }));
      setRecipients([...beneficiariesTagged, ...charitiesTagged]);
    }
    fetchRecipients();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('assets');
        console.log('Loaded assets data:', loaded); // Debug log
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('assets') || '[]');
          console.log('Falling back to localStorage for assets:', loaded);
        }
        if (loaded && Array.isArray(loaded)) {
          const normalized = loaded.map(asset => ({
            type: asset.type || '',
            details: asset.details || {},
            distribution: asset.distribution || {},
            selectedRecipients: asset.selectedRecipients || []
          }));
          setAssets(normalized);
        }
      } catch (error) {
        console.error('Error loading assets:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('assets') || '[]');
          if (localData && Array.isArray(localData)) {
            const normalized = localData.map(asset => ({
              type: asset.type || '',
              details: asset.details || {},
              distribution: asset.distribution || {},
              selectedRecipients: asset.selectedRecipients || []
            }));
            setAssets(normalized);
            console.log('Loaded assets from localStorage after error:', normalized);
          }
        } catch (localError) {
          console.error('Error loading assets from localStorage:', localError);
        }
      }
    }
    
    fetchData();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Mark as unsaved on any field change
  const handleChange = useCallback((index, field, value) => {
    setUnsaved(true);
    setAssets(prevAssets => {
      const newAssets = [...prevAssets];
      if (field === 'type') {
        newAssets[index] = { type: value, details: {}, distribution: {}, selectedRecipients: [] };
      } else {
        newAssets[index].details[field] = value;
      }
      return newAssets;
    });
  }, [setUnsaved]);

  const handleDistributionChange = useCallback((assetIndex, recipientId, value) => {
    // Limit to 2 decimal places (0-100)
    let limitedValue = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    limitedValue = Math.round(limitedValue * 100) / 100;
    setUnsaved(true);
    setAssets(prevAssets => {
      const newAssets = [...prevAssets];
      newAssets[assetIndex].distribution[recipientId] = limitedValue;
      return newAssets;
    });
  }, [setUnsaved]);

  const handleImageUpload = useCallback((assetIndex, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUnsaved(true);
        setAssets(prevAssets => {
          const newAssets = [...prevAssets];
          if (!newAssets[assetIndex].details.images) {
            newAssets[assetIndex].details.images = [];
          }
          newAssets[assetIndex].details.images.push({
            id: Date.now(),
            data: e.target.result,
            name: file.name
          });
          return newAssets;
        });
      };
      reader.readAsDataURL(file);
    }
  }, [setUnsaved]);

  const removeImage = useCallback((assetIndex, imageId) => {
    setUnsaved(true);
    setAssets(prevAssets => {
      const newAssets = [...prevAssets];
      newAssets[assetIndex].details.images = newAssets[assetIndex].details.images.filter(img => img.id !== imageId);
      return newAssets;
    });
  }, [setUnsaved]);

  const handleSubmit = async () => {
    // Validate distribution sums
    for (const asset of assets) {
      const selected = asset.selectedRecipients || [];
      if (selected.length > 0) {
        const sum = selected.reduce((acc, id) => acc + (parseFloat(asset.distribution[id]) || 0), 0);
        if (Math.abs(sum - 100) > 0.01) { // allow for floating point error
          console.error('The total distribution for each asset must add up to 100%.');
          return;
        }
      }
    }
    setLoading(true);
    console.log('Saving assets:', assets);
    try {
      await saveSectionData('assets', assets);
      setUnsaved(false); // Mark as saved
      console.log('Assets saved!');
      setTimeout(() => {
        navigate('/residuary-clause');
      }, 100);
    } catch (e) {
      console.error('Error saving your assets. Please try again.', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    setAssets(data);
    setLoading(true);
    try {
      await saveSectionData('assets', data);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving your assets. Please try again.', e);
    } finally {
      setLoading(false);
    }
  };

  // Debug log to verify recipient IDs are unique
  console.log('Recipients:', recipients.map(r => r.id));

  // Update handleRecipientSelection to toggle selection for a single recipient
  const handleRecipientSelection = (assetIndex, recipientId) => {
    setUnsaved(true);
    setAssets(prevAssets => {
      return prevAssets.map((asset, i) => {
        if (i !== assetIndex) return asset;
        const selectedRecipients = asset.selectedRecipients.includes(recipientId)
          ? asset.selectedRecipients.filter(id => id !== recipientId)
          : [...asset.selectedRecipients, recipientId];
        // Clean up distribution if unselected; init to 0 if newly selected
        const distribution = { ...asset.distribution };
        if (!selectedRecipients.includes(recipientId)) {
          delete distribution[recipientId];
        } else if (!distribution[recipientId]) {
          distribution[recipientId] = 0;
        }
        return { ...asset, selectedRecipients, distribution };
      });
    });
  };

  // Toggle select all / deselect all beneficiaries for a given asset
  const toggleSelectAllBeneficiaries = (assetIndex) => {
    setUnsaved(true);
    setAssets(prevAssets => {
      return prevAssets.map((asset, i) => {
        if (i !== assetIndex) return asset;

        const beneficiaryIds = (recipients || [])
          .filter(r => r && r.__type === 'beneficiary' && r.id)
          .map(r => r.id);

        const allSelected =
          beneficiaryIds.length > 0 &&
          beneficiaryIds.every(id => (asset.selectedRecipients || []).includes(id));

        let selectedRecipients;
        const distribution = { ...(asset.distribution || {}) };

        if (allSelected) {
          // Deselect all beneficiaries (keep charities as-is)
          selectedRecipients = (asset.selectedRecipients || []).filter(id => !beneficiaryIds.includes(id));
          // Clean distribution for beneficiaries
          beneficiaryIds.forEach(id => { delete distribution[id]; });
        } else {
          // Select all beneficiaries (union with any existing selections, like charities)
          const union = new Set([...(asset.selectedRecipients || []), ...beneficiaryIds]);
          selectedRecipients = Array.from(union);
          // Ensure distribution entry exists for each beneficiary
          beneficiaryIds.forEach(id => {
            if (distribution[id] === undefined) distribution[id] = 0;
          });
        }

        return { ...asset, selectedRecipients, distribution };
      });
    });
  };

  // Toggle select all / deselect all charities for a given asset
  const toggleSelectAllCharities = (assetIndex) => {
    setUnsaved(true);
    setAssets(prevAssets => {
      return prevAssets.map((asset, i) => {
        if (i !== assetIndex) return asset;

        const charityIds = (recipients || [])
          .filter(r => r && r.__type === 'charity' && r.id)
          .map(r => r.id);

        const allSelected =
          charityIds.length > 0 &&
          charityIds.every(id => (asset.selectedRecipients || []).includes(id));

        let selectedRecipients;
        const distribution = { ...(asset.distribution || {}) };

        if (allSelected) {
          // Deselect all charities (keep beneficiaries as-is)
          selectedRecipients = (asset.selectedRecipients || []).filter(id => !charityIds.includes(id));
          charityIds.forEach(id => { delete distribution[id]; });
        } else {
          // Select all charities (union with existing selections like beneficiaries)
          const union = new Set([...(asset.selectedRecipients || []), ...charityIds]);
          selectedRecipients = Array.from(union);
          charityIds.forEach(id => {
            if (distribution[id] === undefined) distribution[id] = 0;
          });
        }

        return { ...asset, selectedRecipients, distribution };
      });
    });
  };

  // Optional: Toggle select all / deselect all recipients (beneficiaries + charities)
  const toggleSelectAllRecipients = (assetIndex) => {
    setUnsaved(true);
    setAssets(prevAssets => {
      return prevAssets.map((asset, i) => {
        if (i !== assetIndex) return asset;

        const allRecipientIds = (recipients || [])
          .filter(r => r && r.id)
          .map(r => r.id);

        const allSelected =
          allRecipientIds.length > 0 &&
          allRecipientIds.every(id => (asset.selectedRecipients || []).includes(id));

        let selectedRecipients;
        const distribution = { ...(asset.distribution || {}) };

        if (allSelected) {
          // Deselect all recipients
          selectedRecipients = (asset.selectedRecipients || []).filter(id => !allRecipientIds.includes(id));
          allRecipientIds.forEach(id => { delete distribution[id]; });
        } else {
          // Select all recipients
          const union = new Set([...(asset.selectedRecipients || []), ...allRecipientIds]);
          selectedRecipients = Array.from(union);
          allRecipientIds.forEach(id => {
            if (distribution[id] === undefined) distribution[id] = 0;
          });
        }

        return { ...asset, selectedRecipients, distribution };
      });
    });
  };

  // Button label helpers
  const areAllBeneficiariesSelected = (asset) => {
    const beneficiaryIds = (recipients || [])
      .filter(r => r && r.__type === 'beneficiary' && r.id)
      .map(r => r.id);

    if (beneficiaryIds.length === 0) return false;
    const selected = asset.selectedRecipients || [];
    return beneficiaryIds.every(id => selected.includes(id));
  };

  const areAllCharitiesSelected = (asset) => {
    const charityIds = (recipients || [])
      .filter(r => r && r.__type === 'charity' && r.id)
      .map(r => r.id);

    if (charityIds.length === 0) return false;
    const selected = asset.selectedRecipients || [];
    return charityIds.every(id => selected.includes(id));
  };

  const areAllRecipientsSelected = (asset) => {
    const allRecipientIds = (recipients || [])
      .filter(r => r && r.id)
      .map(r => r.id);

    if (allRecipientIds.length === 0) return false;
    const selected = asset.selectedRecipients || [];
    return allRecipientIds.every(id => selected.includes(id));
  };

  const divideEqually = (assetIndex) => {
    setUnsaved(true);
    setAssets(prevAssets => {
      const newAssets = [...prevAssets];
      const asset = newAssets[assetIndex];
      // Only count selected recipients with valid IDs
      const selected = asset.selectedRecipients.filter(id => !!id);
      const count = selected.length;
      if (count === 0) {
        console.error('Please select at least one recipient to divide equally.');
        return prevAssets;
      }
      let equalShare = Math.floor((100 / count) * 100) / 100;
      let shares = Array(count).fill(equalShare);
      let total = shares.reduce((a, b) => a + b, 0);
      let remainder = Math.round((100 - total) * 100) / 100;
      shares[count - 1] += remainder;
      const newDist = { ...asset.distribution };
      selected.forEach((id, idx) => {
        newDist[id] = Number(shares[idx].toFixed(2));
      });
      // Optionally set unselected to 0
      Object.keys(newDist).forEach(id => {
        if (!selected.includes(id)) newDist[id] = 0;
      });
      asset.distribution = newDist;
      return newAssets;
    });
  };

  // Helper to check if an asset's distribution is valid
  const getDistributionError = (asset) => {
    const selected = asset.selectedRecipients || [];
    if (selected.length > 0) {
      const sum = selected.reduce((acc, id) => acc + (parseFloat(asset.distribution[id]) || 0), 0);
      if (Math.abs(sum - 100) > 0.01) {
        return 'Total does not add up to 100%';
      }
    }
    return '';
  };

  const renderAssetFields = (asset, index) => {
    const fields = {
      Property: (
        <>
          <input 
            type="text" 
            placeholder="Address" 
            value={asset.details.address || ''} 
            onChange={(e) => handleChange(index, 'address', e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="City" 
              value={asset.details.city || ''} 
              onChange={(e) => handleChange(index, 'city', e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input 
              type="text" 
              placeholder="State" 
              value={asset.details.state || ''} 
              onChange={(e) => handleChange(index, 'state', e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Country" 
              value={asset.details.country || ''} 
              onChange={(e) => handleChange(index, 'country', e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input 
              type="text" 
              placeholder="Zip Code"
              value={asset.details.zipCode || ''}
              onChange={(e) => handleChange(index, 'zipCode', e.target.value)}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </>
      ),
      Investment: (
        <>
          <select 
            value={asset.details.investmentType || ''} 
            onChange={(e) => handleChange(index, 'investmentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select investment type</option>
            {investmentTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'Demat' ? 'Demat Account' : type}
              </option>
            ))}
          </select>
          {asset.details.investmentType === 'Other' && (
            <input 
              type="text" 
              placeholder="Optional" 
              value={asset.details.otherInvestmentType || ''} 
              onChange={(e) => handleChange(index, 'otherInvestmentType', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:italic placeholder:text-gray-400" 
              required 
            />
          )}
          <input 
            type="text" 
            placeholder="Account Number or Bond Number" 
            value={asset.details.accountNumber || ''} 
            onChange={(e) => handleChange(index, 'accountNumber', e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </>
      ),
      Bank: (
        <>
          <input 
            type="text" 
            placeholder="Bank Name" 
            value={asset.details.bankName || ''} 
            onChange={(e) => handleChange(index, 'bankName', e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {/* Branch / IFSC removed */}
          <input 
            type="text"
            inputMode="numeric"
            placeholder="Account Number (Optional)"
            value={asset.details.accountNumber || ''} 
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, ''); // removed 4-digit limit
              handleChange(index, 'accountNumber', val);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input 
            type="text" 
            placeholder="Account Type (Optional)" 
            value={asset.details.accountType || ''} 
            onChange={(e) => handleChange(index, 'accountType', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </>
      ),
      Jewellery: (
        <>
          <input 
            type="text" 
            placeholder="Description (e.g., Gold Ring, Diamond Necklace)" 
            value={asset.details.description || ''} 
            onChange={(e) => handleChange(index, 'description', e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input 
            type="text" 
            placeholder="Estimated Value" 
            value={asset.details.value || ''} 
            onChange={(e) => handleChange(index, 'value', e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input 
            type="text" 
            placeholder="Weight (Optional)" 
            value={asset.details.weight || ''} 
            onChange={(e) => handleChange(index, 'weight', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input 
            type="text" 
            placeholder="Hallmark/Quality (Optional)" 
            value={asset.details.hallmark || ''} 
            onChange={(e) => handleChange(index, 'hallmark', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Upload Photos (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  Array.from(e.target.files).forEach(file => {
                    handleImageUpload(index, file);
                  });
                }}
                className="hidden"
                id={`image-upload-${index}`}
              />
              <label htmlFor={`image-upload-${index}`} className="cursor-pointer">
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
            {/* Inside the Jewellery fields block where images are rendered */}
            {asset.details.images && asset.details.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {asset.details.images.map((image, imgIdx) => {
            const imageLabel = imageLabels[`${index}:${imgIdx}`] || `Jewellery ${imgIdx + 1}`;
            return (
            <div key={image.id} className="relative group">
            <img
            src={image.data}
            alt={imageLabel}
            className="w-full h-24 object-cover rounded-lg border"
            />
            <div className="mt-1 text-xs text-gray-700 text-center">{imageLabel}</div>
            <button
            type="button"
            onClick={() => removeImage(index, image.id)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
            ×
            </button>
            </div>
            );
            })}
            </div>
            )}
          </div>
        </>
      ),
      Default: (
        <>
          <input 
            type="text" 
            placeholder="Description" 
            value={asset.details.description || ''} 
            onChange={(e) => handleChange(index, 'description', e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input 
            type="text" 
            placeholder="Value" 
            value={asset.details.value || ''} 
            onChange={(e) => handleChange(index, 'value', e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {/* Only show image upload for 'Other', not for Loans or Income */}
          {asset.type === 'Other' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Upload Photos (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(file => {
                      handleImageUpload(index, file);
                    });
                  }}
                  className="hidden"
                  id={`image-upload-other-${index}`}
                />
                <label htmlFor={`image-upload-other-${index}`} className="cursor-pointer">
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
              {/* In the Other asset section */}
              {asset.details.images && asset.details.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {asset.details.images.map((image, imgIdx) => {
                  const imageLabel = imageLabels[`${index}:${imgIdx}`] || `Others ${imgIdx + 1}`;
                  return (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.data}
                        alt={imageLabel}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 text-center rounded-b-lg">
                        {imageLabel}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}
        </>
      )
    };

    return fields[asset.type] || fields.Default;
  };

  const renderDistributionInput = (asset, assetIndex, recipient) => {
    const value = asset.distribution[recipient.id] || 0;
    return (
      <div key={recipient.id} className="flex flex-col items-start">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={asset.selectedRecipients.includes(recipient.id)}
            onChange={() => handleRecipientSelection(assetIndex, recipient.id)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">{recipient.name}</label>
        </div>
        {asset.selectedRecipients.includes(recipient.id) && (
          <div className="flex items-center space-x-2 mt-1">
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
                  handleDistributionChange(assetIndex, recipient.id, inputValue);
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-500 w-8">%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <WillFormLayout 
      title="Assets" 
      description="Property & belongings"
    >
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="h-5 w-5" />
          <span>Progress saved successfully!</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm text-gray-800 rounded-lg">
          <p className="text-sm">
            List your assets and allocate them to beneficiaries or charities. Ensure details are accurate; allocations should total 100% for each asset.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600">List each asset you wish to include and choose its type. For each asset, provide the key details and then allocate percentages to your beneficiaries or charities so the total adds up to 100%.</p>
            </div>
            <div className="space-y-6">
              {assets.map((asset, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Asset {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => setAssets(assets.filter((_, i) => i !== index))}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                      <select
                        value={asset.type}
                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select asset type</option>
                        {assetTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Asset-specific fields */}
                    {asset.type && (
                      <div className="space-y-4">
                        {renderAssetFields(asset, index)}
                      </div>
                    )}
                    
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                        <label className="text-sm font-medium text-gray-700">Distribution</label>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => divideEqually(index)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Divide Equally
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSelectAllBeneficiaries(index)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                          >
                            {areAllBeneficiariesSelected(asset) ? 'Deselect All Beneficiaries' : 'Select All Beneficiaries'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSelectAllCharities(index)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                          >
                            {areAllCharitiesSelected(asset) ? 'Deselect All Charities' : 'Select All Charities'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSelectAllRecipients(index)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                          >
                            {areAllRecipientsSelected(asset) ? 'Deselect All Recipients' : 'Select All Recipients'}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipients.map((recipient) => renderDistributionInput(asset, index, recipient))}
                      </div>
                      {getDistributionError(asset) && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 font-medium">{getDistributionError(asset)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setAssets([...assets, { type: '', details: {}, distribution: {}, selectedRecipients: [] }])}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Plus className="h-5 w-5" />
                Add Asset
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => handleSave(assets)}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>Save Progress</span>
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BAD] hover:to-[#381F64] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                <span>Continue to Residuary Clause</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </WillFormLayout>
  );
};

