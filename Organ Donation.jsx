import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveSectionData, loadSectionData } from '../lib/supabaseForms';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, Heart, CheckCircle } from 'lucide-react';

const ORGANS = [
  { name: 'Heart', use: 'For patients with end-stage heart failure' },
  { name: 'Lungs', use: 'Single or double — for those with lung diseases (e.g., cystic fibrosis)' },
  { name: 'Liver', use: 'Can be split to help two recipients' },
  { name: 'Kidneys', use: 'One person can give both kidneys to two people' },
  { name: 'Pancreas', use: 'Helps patients with severe diabetes' },
  { name: 'Intestines', use: 'Rare, but useful in complex digestive failures' },
];

const TISSUES = [
  { name: 'Corneas', use: 'Restore sight to the blind or visually impaired' },
  { name: 'Skin', use: 'Used for burn victims and reconstructive surgery' },
  { name: 'Heart Valves', use: 'For people with damaged or diseased valves' },
  { name: 'Bones', use: 'Help reconstruct limbs or jawbones after injury' },
  { name: 'Tendons', use: 'Used in orthopedic surgeries' },
  { name: 'Veins', use: 'For vascular surgeries (e.g., bypass)' },
  { name: 'Cartilage', use: 'Helps rebuild joints or repair trauma' },
];

const OrganDonation = () => {
  const [donationChoice, setDonationChoice] = useState('all');
  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [selectedTissues, setSelectedTissues] = useState([]);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // On mount, load from localStorage if exists
  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('organDonation');
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('organDonation') || '{}');
        }
        if (loaded && typeof loaded === 'object') {
          if (loaded.donationChoice) setDonationChoice(loaded.donationChoice);
          if (Array.isArray(loaded.selectedOrgans)) setSelectedOrgans(loaded.selectedOrgans);
          if (Array.isArray(loaded.selectedTissues)) setSelectedTissues(loaded.selectedTissues);
        }
      } catch (error) {
        console.error('Error loading organ donation data:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('organDonation') || '{}');
          if (localData && typeof localData === 'object') {
            if (localData.donationChoice) setDonationChoice(localData.donationChoice);
            if (Array.isArray(localData.selectedOrgans)) setSelectedOrgans(localData.selectedOrgans);
            if (Array.isArray(localData.selectedTissues)) setSelectedTissues(localData.selectedTissues);
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      }
    }
    
    fetchData();
  }, []);

  // Save to localStorage whenever any relevant value changes
  useEffect(() => {
    localStorage.setItem('organDonation', JSON.stringify({
      donationChoice,
      selectedOrgans,
      selectedTissues,
    }));
  }, [donationChoice, selectedOrgans, selectedTissues]);



  const handleToggleOrgan = (organ) => {
    setSelectedOrgans((prev) =>
      prev.includes(organ)
        ? prev.filter((o) => o !== organ)
        : [...prev, organ]
    );
  };

  const handleToggleTissue = (tissue) => {
    setSelectedTissues((prev) =>
      prev.includes(tissue)
        ? prev.filter((t) => t !== tissue)
        : [...prev, tissue]
    );
  };

  const handleSubmit = async () => {
    try {
      await saveSectionData('organDonation', {
        donationChoice,
        selectedOrgans,
        selectedTissues,
      });
      navigate('/review');
    } catch (e) {
      console.error('Error submitting your form:', e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSectionData('organDonation', {
        donationChoice,
        selectedOrgans,
        selectedTissues,
      });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving your organ donation preferences:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WillFormLayout 
      title="Organ Donation" 
      description="Medical preferences"
    >
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Progress saved successfully!
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        {/* Moved Info panel to the top */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Importance of Organ and Tissue Donation</h3>
          <p className="text-blue-800 leading-relaxed">
            One cadaver donation can save the lives of up to 8 individuals suffering from end-stage organ damage, and tissue donation can improve the quality of life for many more by restoring function and appearance. Your generous decision can create a lasting legacy of hope and healing.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Preference</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <input
                type="radio"
                name="donationChoice"
                value="all"
                checked={donationChoice === 'all'}
                onChange={(e) => setDonationChoice(e.target.value)}
                className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
              />
              <span className="text-gray-700 font-medium">I wish to donate all my organs and tissues as possible</span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <input
                type="radio"
                name="donationChoice"
                value="specific"
                checked={donationChoice === 'specific'}
                onChange={(e) => setDonationChoice(e.target.value)}
                className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
              />
              <span className="text-gray-700 font-medium">I wish to donate specific organs/tissues</span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <input
                type="radio"
                name="donationChoice"
                value="none"
                checked={donationChoice === 'none'}
                onChange={(e) => setDonationChoice(e.target.value)}
                className="w-4 h-4 text-red-600 focus:ring-red-500 focus:ring-2"
              />
              <span className="text-gray-700 font-medium">I do not wish to donate my organs or tissues</span>
            </label>
          </div>
        </div>

        {donationChoice === 'specific' && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Organs to Donate</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {ORGANS.map((organ) => (
                  <button
                    type="button"
                    key={organ.name}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                      selectedOrgans.includes(organ.name)
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-red-50'
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
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Organ</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Medical Use</th>
                    </tr>
                    <tr>
                      <th colSpan="2" className="px-6 pt-2 pb-3 text-left text-xs text-gray-500 font-normal">
                        This table lists available organs and common medical uses. Select specific organs above.
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
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Tissues to Donate</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {TISSUES.map((tissue) => (
                  <button
                    type="button"
                    key={tissue.name}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                      selectedTissues.includes(tissue.name)
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-red-50'
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
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tissue</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Medical Use</th>
                    </tr>
                    <tr>
                      <th colSpan="2" className="px-6 pt-2 pb-3 text-left text-xs text-gray-500 font-normal">
                        This table lists available tissues and common medical uses. Select specific tissues above.
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
          </>
        )}

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
            <span>Continue to Review</span>
          </button>
        </div>
      </form>
    </WillFormLayout>
  );
}

export default OrganDonation;
