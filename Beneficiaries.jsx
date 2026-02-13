import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import { usePersonalDetails } from '../hooks/usePersonalDetails';
import { supabase } from '../lib/supabaseClient';
import { loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveBeneficiaries } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, Users, Plus, Trash2, CheckCircle } from 'lucide-react';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([
    { name: '', relation: '', dob: '', age: '', pan: '', aadhaar: '', guardianName: '', guardianRelation: '' }
  ]);
  const navigate = useNavigate();
  const { saveBeneficiaries, getSavedBeneficiaries } = useBeneficiaries();
  const { getPersonalDetails } = usePersonalDetails();
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Auto-save when navigating between pages
  useAutoSaveBeneficiaries(beneficiaries, unsaved, setUnsaved);

  // Remove the beforeunload save logic
  // useEffect(() => {
  //   const handleBeforeUnload = async () => {
  //     try {
  //       const withIds = beneficiaries.map(b => ({ ...b, id: b.id || getBeneficiaryId(b) }));
  //       await saveSectionData('savedBeneficiaries', withIds);
  //     } catch (error) {
  //       console.error('Error saving on page unload:', error);
  //     }
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  // }, [beneficiaries]);

  function getBeneficiaryId(beneficiary) {
    // Use a simple hash of name+dob+relation for stability
    return btoa(unescape(encodeURIComponent(`${beneficiary.name}|${beneficiary.dob}|${beneficiary.relation}`)));
  }

  // Function to check if spouse is already in beneficiaries
  const isSpouseAlreadyBeneficiary = (beneficiariesList, spouseName) => {
    return beneficiariesList.some(b => 
      b.name.toLowerCase().trim() === spouseName.toLowerCase().trim() && 
      (b.relation.toLowerCase().includes('spouse') || b.relation.toLowerCase().includes('husband') || b.relation.toLowerCase().includes('wife'))
    );
  };

  // Function to add spouse as beneficiary
  const addSpouseAsBeneficiary = (currentBeneficiaries, personalDetails) => {
    if (personalDetails.maritalStatus === 'married' && personalDetails.spouseName) {
      if (!isSpouseAlreadyBeneficiary(currentBeneficiaries, personalDetails.spouseName)) {
        const spouseBeneficiary = {
          name: personalDetails.spouseName,
          relation: 'Spouse',
          dob: personalDetails.spouseDob || '',
          age: personalDetails.spouseDob ? calculateAge(personalDetails.spouseDob) : '',
          pan: '',
          aadhaar: '',
          guardianName: '',
          guardianRelation: '',
          id: crypto.randomUUID()
        };
        return [spouseBeneficiary, ...currentBeneficiaries];
      }
    }
    return currentBeneficiaries;
  };

  // Function to calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? String(age) : '0';
  };

  // When loading beneficiaries, assign id if missing and add spouse if married
  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('savedBeneficiaries');
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
          console.log('Falling back to localStorage for beneficiaries:', loaded);
        }
        
        let beneficiariesToSet = [];
        if (loaded && Array.isArray(loaded) && loaded.length > 0) {
          beneficiariesToSet = loaded.map(b => ({ ...b, pan: b.pan || '', aadhaar: b.aadhaar || '' }));
        } else {
          beneficiariesToSet = [{ name: '', relation: '', dob: '', age: '', pan: '', aadhaar: '', guardianName: '', guardianRelation: '' }];
        }
        
        // Get personal details and add spouse if married
        const personalDetails = getPersonalDetails();
        if (personalDetails) {
          beneficiariesToSet = addSpouseAsBeneficiary(beneficiariesToSet, personalDetails);
        }
        
        setBeneficiaries(beneficiariesToSet);
      } catch (error) {
        console.error('Error loading beneficiaries:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
          let beneficiariesToSet = [];
          if (localData && Array.isArray(localData) && localData.length > 0) {
            beneficiariesToSet = localData.map(b => ({ ...b, pan: b.pan || '', aadhaar: b.aadhaar || '' }));
          } else {
            beneficiariesToSet = [{ name: '', relation: '', dob: '', age: '', pan: '', aadhaar: '', guardianName: '', guardianRelation: '' }];
          }
          
          // Get personal details and add spouse if married
          const personalDetails = getPersonalDetails();
          if (personalDetails) {
            beneficiariesToSet = addSpouseAsBeneficiary(beneficiariesToSet, personalDetails);
          }
          
          setBeneficiaries(beneficiariesToSet);
          console.log('Loaded beneficiaries from localStorage after error:', beneficiariesToSet);
        } catch (localError) {
          console.error('Error loading beneficiaries from localStorage:', localError);
        }
      }
    }
    fetchData();
  }, []);

  // When adding a new beneficiary, use a UUID for id
  const addBeneficiary = () => {
    setBeneficiaries(prev => [
      ...prev,
      { name: '', relation: '', dob: '', age: '', pan: '', aadhaar: '', guardianName: '', guardianRelation: '', id: crypto.randomUUID() }
    ]);
  };

  const removeBeneficiary = (index) => {
    setBeneficiaries(prevBeneficiaries => prevBeneficiaries.filter((_, i) => i !== index));
  };

  // Mark as unsaved on any field change
  const handleChange = (index, field, value) => {
    setUnsaved(true);
    setBeneficiaries(prev => prev.map((b, i) => {
      if (i !== index) return b;
      let updated = { ...b, [field]: value };
      if (field === 'dob') {
        // Calculate age from dob
        if (value) {
          const today = new Date();
          const dob = new Date(value);
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          updated.age = age > 0 ? String(age) : '0';
        } else {
          updated.age = '';
        }
      }
      return updated;
    }));
  };

  // When saving, use getBeneficiaryId only if all key fields are filled; otherwise, keep the UUID
  const handleSubmit = async () => {
    try {
      const withIds = beneficiaries.map(b => {
        if (b.name && b.dob && b.relation) {
          return { ...b, id: getBeneficiaryId(b) };
        }
        return { ...b, id: b.id || crypto.randomUUID() };
      });
      await saveSectionData('savedBeneficiaries', withIds);
      setUnsaved(false); // Mark as saved
      navigate('/charity');
    } catch (e) {
      console.error('Error saving beneficiaries:', e);
    }
  };

  const handleSave = async (data) => {
    setBeneficiaries(data);
    setLoading(true);
    try {
      const withIds = data.map(b => {
        if (b.name && b.dob && b.relation) {
          return { ...b, id: getBeneficiaryId(b) };
        }
        return { ...b, id: b.id || crypto.randomUUID() };
      });
      await saveSectionData('savedBeneficiaries', withIds);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving beneficiaries:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WillFormLayout
      title="Beneficiary Details"
      description="Specify all persons or entities who will receive your assets. You can add multiple beneficiaries and set their respective shares."
    >
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">Progress saved successfully!</span>
        </div>
      )}
      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm text-gray-800 rounded-lg">
        <p className="text-sm">
          Beneficiaries are the people or organizations who will receive your assets. Add each beneficiary with their full legal name, relationship, and date of birth. If a beneficiary is under 18, guardian details will be required automatically.
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {beneficiaries.map((beneficiary, index) => (
          <section key={index} className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-[#5E4B8C]">Beneficiary {index + 1}</h2>
              </div>
              {beneficiaries.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeBeneficiary(index)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 -mt-2 mb-4">Provide the beneficiary’s full legal name, relation, and date of birth. If the person is under 18, guardian details will be required automatically.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`name-${index}`}>Name</label>
                  <input
                    id={`name-${index}`}
                    value={beneficiary.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`relation-${index}`}>Relation</label>
                  <input
                    id={`relation-${index}`}
                    value={beneficiary.relation}
                    onChange={(e) => handleChange(index, 'relation', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                </div>
                
                {/* PAN (above DOB/Age) */}
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`pan-${index}`}>PAN (optional)</label>
                  <input
                    id={`pan-${index}`}
                    value={beneficiary.pan || ''}
                    onChange={(e) => {
                      const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                      handleChange(index, 'pan', cleaned);
                    }}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                    title="PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                </div>
                
                {/* Aadhaar (above DOB/Age) */}
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`aadhaar-${index}`}>Aadhaar (optional)</label>
                  <input
                    id={`aadhaar-${index}`}
                    value={beneficiary.aadhaar || ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                      handleChange(index, 'aadhaar', digits);
                    }}
                    placeholder="12-digit Aadhaar"
                    inputMode="numeric"
                    maxLength={12}
                    pattern="[0-9]{12}"
                    title="Aadhaar must be 12 digits"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                </div>
                
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`dob-${index}`}>Date of Birth</label>
                  <input
                    type="date"
                    id={`dob-${index}`}
                    value={beneficiary.dob}
                    onChange={(e) => handleChange(index, 'dob', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                </div>
                
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`age-${index}`}>Age</label>
                  <input
                    id={`age-${index}`}
                    value={beneficiary.age || ''}
                    onChange={(e) => handleChange(index, 'age', e.target.value)}
                    readOnly
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg bg-gray-50 focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                  />
                </div>
              </div>
              {parseInt(beneficiary.age) < 18 && beneficiary.age !== '' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800 mb-4">Guardian Information (Required for Minor)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`guardianName-${index}`}>Guardian Name</label>
                      <input
                        id={`guardianName-${index}`}
                        value={beneficiary.guardianName || ''}
                        onChange={(e) => handleChange(index, 'guardianName', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor={`guardianRelation-${index}`}>Relation to Beneficiary</label>
                      <input
                        id={`guardianRelation-${index}`}
                        value={beneficiary.guardianRelation || ''}
                        onChange={(e) => handleChange(index, 'guardianRelation', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}        
        <button 
          type="button" 
          onClick={addBeneficiary} 
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BA7] hover:to-[#3A1F61] transition-all"
        >
          <Plus className="h-5 w-5" /> 
          Add Another Beneficiary
        </button>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={() => handleSave(beneficiaries)}
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
            <span>Continue to Charity</span>
          </button>
        </div>
      </form>
    </WillFormLayout>
  );
};

export default Beneficiaries;