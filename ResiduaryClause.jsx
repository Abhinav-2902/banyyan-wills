import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveResiduaryClause } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, Gavel, CheckCircle } from 'lucide-react';

// ResiduaryClause component
const ResiduaryClause = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genericAssetDistribution, setGenericAssetDistribution] = useState(() => {
    return JSON.parse(localStorage.getItem('genericAssetDistribution') || '{}');
  });
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState(() => {
    return JSON.parse(localStorage.getItem('selectedResiduaryRecipients') || '[]');
  });
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Auto-save when navigating between pages
  const residuaryData = { genericAssetDistribution, selectedRecipientIds };
  useAutoSaveResiduaryClause(residuaryData, unsaved, setUnsaved);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchRecipients() {
      const beneficiaries = await loadSectionData('savedBeneficiaries') || [];
      const charities = await loadSectionData('charities') || [];
      // Tag recipients by type for toggling
      const beneficiariesTagged = (beneficiaries || []).map(b => ({ ...b, __type: 'beneficiary' }));
      const charitiesTagged = (charities || []).map(c => ({ ...c, __type: 'charity' }));
      setRecipients([...beneficiariesTagged, ...charitiesTagged]);
    }
    fetchRecipients();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('residuaryClause');
        console.log('Loaded residuary clause data:', loaded); // Debug log
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('genericAssetDistribution') || '{}');
          console.log('Falling back to localStorage for residuary clause:', loaded);
        }
        if (loaded && typeof loaded === 'object') {
          setGenericAssetDistribution(loaded.genericAssetDistribution || {});
          setSelectedRecipientIds(loaded.selectedRecipientIds || []);
        }
      } catch (error) {
        console.error('Error loading residuary clause:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('genericAssetDistribution') || '{}');
          if (localData && typeof localData === 'object') {
            setGenericAssetDistribution(localData.genericAssetDistribution || {});
            setSelectedRecipientIds(localData.selectedRecipientIds || []);
            console.log('Loaded residuary clause from localStorage after error:', localData);
          }
        } catch (localError) {
          console.error('Error loading residuary clause from localStorage:', localError);
        }
      }
    }
    fetchData();
  }, []);

  // Update: sync distribution when toggling a single recipient
  const handleToggleRecipient = (id, checked) => {
    setUnsaved(true);
    setSelectedRecipientIds(prev => {
      const next = checked ? [...prev, id] : prev.filter(rid => rid !== id);
      setGenericAssetDistribution(prevDist => {
        const dist = { ...prevDist };
        if (checked) {
          if (dist[id] === undefined) dist[id] = 0;
        } else {
          delete dist[id];
        }
        return dist;
      });
      return next;
    });
  };

  const handleDistributeEvenly = () => {
    const selected = recipients.filter(r => selectedRecipientIds.includes(r.id));
    const count = selected.length;
    if (count === 0) return;
    // Calculate equal share, rounded to 2 decimals
    let equalShare = Math.floor((100 / count) * 100) / 100;
    let shares = Array(count).fill(equalShare);
    let total = shares.reduce((a, b) => a + b, 0);
    let remainder = Math.round((100 - total) * 100) / 100;
    shares[count - 1] += remainder;
    const newDist = { ...genericAssetDistribution };
    selected.forEach((r, idx) => {
      newDist[r.id] = Number(shares[idx].toFixed(2));
    });
    // Optionally set unselected to 0
    recipients.forEach(r => {
      if (!selectedRecipientIds.includes(r.id)) newDist[r.id] = 0;
    });
    setGenericAssetDistribution(newDist);
  };

  const total = recipients.reduce((acc, r) => acc + (parseFloat(genericAssetDistribution[r.id]) || 0), 0);
  const hasError = Math.abs(total - 100) > 0.01;

  // Mark as unsaved on any field change
  const handleChange = () => setUnsaved(true);

  const handleNext = async () => {
    if (!hasError) {
      setLoading(true);
      try {
        await saveSectionData('residuaryClause', {
          genericAssetDistribution,
          selectedRecipientIds
        });
        setUnsaved(false); // Mark as saved
        navigate('/special-wishes');
      } catch (e) {
        console.error('Error saving your progress. Please try again.', e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSectionData('residuaryClause', {
        genericAssetDistribution,
        selectedRecipientIds
      });
      setUnsaved(false); // Mark as saved
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving your progress. Please try again.', e);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Helpers for Select/Deselect All by type
  const getRecipientIdsByType = (type) =>
    (recipients || [])
      .filter(r => r && r.__type === type && r.id)
      .map(r => r.id);

  const areAllOfTypeSelected = (type) => {
    const typeIds = getRecipientIdsByType(type);
    if (typeIds.length === 0) return false;
    return typeIds.every(id => selectedRecipientIds.includes(id));
  };

  const toggleSelectAllOfType = (type) => {
    setUnsaved(true);
    setSelectedRecipientIds(prevSelected => {
      const typeIds = getRecipientIdsByType(type);
      const allSelected = typeIds.length > 0 && typeIds.every(id => prevSelected.includes(id));
      let nextSelected;

      if (allSelected) {
        // Deselect all of this type and remove their distribution entries
        nextSelected = prevSelected.filter(id => !typeIds.includes(id));
        setGenericAssetDistribution(prevDist => {
          const dist = { ...prevDist };
          typeIds.forEach(id => { delete dist[id]; });
          return dist;
        });
      } else {
        // Select all of this type and ensure distribution entries exist
        const union = new Set([...prevSelected, ...typeIds]);
        nextSelected = Array.from(union);
        setGenericAssetDistribution(prevDist => {
          const dist = { ...prevDist };
          typeIds.forEach(id => {
            if (dist[id] === undefined) dist[id] = 0;
          });
          return dist;
        });
      }

      return nextSelected;
    });
  };

  return (
    <WillFormLayout 
      title="Residuary Clause" 
      description="Remaining assets"
    >
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="h-5 w-5" />
          <span>Progress saved successfully!</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] px-6 py-4">
            <div className="flex items-center space-x-3">
              <Gavel className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Residuary Clause</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              The residuary clause covers all remaining assets not specifically mentioned elsewhere in your will. 
              This includes any assets acquired after creating your will or assets not covered by specific bequests. 
              Please distribute these remaining assets among your selected beneficiaries and charities.
            </p>
          </div>

          <div className="p-8">
            {recipients.length === 0 ? (
              <div className="text-center py-12">
                <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Add beneficiaries or charities to specify distribution.</p>
              </div>
            ) : (
              <>
                {/* REPLACED: toolbar now includes Select/Deselect All for Beneficiaries and Charities */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSelectAllOfType('beneficiary')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                      {areAllOfTypeSelected('beneficiary') ? 'Deselect All Beneficiaries' : 'Select All Beneficiaries'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSelectAllOfType('charity')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                      {areAllOfTypeSelected('charity') ? 'Deselect All Charities' : 'Select All Charities'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDistributeEvenly}
                    className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white px-6 py-2 rounded-lg hover:from-[#7A6BAD] hover:to-[#381F64] transition-all duration-200 font-medium"
                  >
                    Distribute Evenly
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedRecipientIds.includes(recipient.id)}
                          onChange={e => handleToggleRecipient(recipient.id, e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="flex-1 font-medium text-gray-900">
                          {recipient.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{recipient.relation || 'Charity'}</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={genericAssetDistribution[recipient.id] ?? ''}
                          onChange={e => {
                            const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                            setGenericAssetDistribution(prev => ({ ...prev, [recipient.id]: value }));
                            handleChange();
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="% share"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {hasError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 font-medium">Total must add up to 100%. Current total: {total.toFixed(2)}%</p>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
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
                type="button"
                onClick={handleNext}
                disabled={hasError || loading}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BAD] hover:to-[#381F64] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                <span>Continue to Special Wishes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </WillFormLayout>
  );
};

export default ResiduaryClause;