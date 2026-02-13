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

export default Charity;