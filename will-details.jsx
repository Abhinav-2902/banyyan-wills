import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useWillDetails } from '../hooks/useWillDetails';
import { supabase } from '../lib/supabaseClient';
import { saveFormData, loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveWillDetails } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, FileText, Phone, Calendar, CheckCircle } from 'lucide-react';
import { countryCodes, priorityCountries, getSortedCountryCodes } from '../lib/constants';

// Use shared helper instead of local filtering
const sortedCountryCodes = getSortedCountryCodes();

const WillDetails = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors }, control, watch } = useForm();
  const navigate = useNavigate();
  const { setWillDetails, getWillDetails } = useWillDetails();
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [witnessesKnown, setWitnessesKnown] = useState(false);
  const [useProfessionalExecutor, setUseProfessionalExecutor] = useState(false); // Add this line
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Auto-save when navigating between pages
  const formData = watch();
  useAutoSaveWillDetails(formData, unsaved, setUnsaved);

  // Derive specific witness fields for stable dependencies
  const w1 = watch('witness1');
  const w2 = watch('witness2');
  const w1Email = watch('witness1Email');
  const w2Email = watch('witness2Email');
  const w1Phone = watch('witness1PhoneNumber');
  const w2Phone = watch('witness2PhoneNumber');

  // Note: Removed auto-checking logic - witnessesKnown is now fully manual



  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Remove the beforeunload save logic
  // useEffect(() => {
  //   const handleBeforeUnload = async () => {
  //     try {
  //       const formData = watch();
  //       if (formData && Object.keys(formData).length > 0) {
  //         await saveSectionData('willDetails', formData);
  //       }
  //     } catch (error) {
  //       console.error('Error saving on page unload:', error);
  //     }
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  // }, [watch]);

  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('willDetails');
        console.log('Loaded will details data:', loaded); // Debug log
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('willDetails') || '{}');
          console.log('Falling back to localStorage for will details:', loaded);
        }
        if (loaded && typeof loaded === 'object') {
          setWillDetails(loaded);
          reset(loaded); // Populate form fields
          // Set witnessesKnown state from loaded data
          if (loaded.witnessesKnown !== undefined) {
            setWitnessesKnown(loaded.witnessesKnown);
          }
          // Restore professional executor slider state
          if (loaded.useProfessionalExecutor !== undefined) {
            setUseProfessionalExecutor(loaded.useProfessionalExecutor);
          }
        }
      } catch (error) {
        console.error('Error loading will details:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('willDetails') || '{}');
          if (localData && typeof localData === 'object') {
            setWillDetails(localData);
            reset(localData); // Populate form fields
            // Set witnessesKnown state from localStorage data
            if (localData.witnessesKnown !== undefined) {
              setWitnessesKnown(localData.witnessesKnown);
            }
            // Restore professional executor slider state from localStorage
            if (localData.useProfessionalExecutor !== undefined) {
              setUseProfessionalExecutor(localData.useProfessionalExecutor);
            }
            console.log('Loaded will details from localStorage after error:', localData);
          }
        } catch (localError) {
          console.error('Error loading will details from localStorage:', localError);
        }
      }
    }
    fetchData();
  }, []);

  // Mark as unsaved on any field change
  const handleChange = () => setUnsaved(true);

  const onSubmit = async (data) => {
    try {
      const dataWithFlags = { ...data, witnessesKnown };
      await saveSectionData('willDetails', dataWithFlags);
      setWillDetails(dataWithFlags); // (optional, if you use this elsewhere)
      setUnsaved(false); // Mark as saved
      navigate('/will-executors'); // Updated navigation to new page
    } catch (e) {
      console.error('Error saving will details:', e);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const dataWithFlags = { ...data, witnessesKnown, useProfessionalExecutor };
      await saveSectionData('willDetails', dataWithFlags);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving will details:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WillFormLayout 
      title="Will Details" 
      description="Provide the essential details for your will document."
    >
      <div className="max-w-4xl mx-auto">

        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Progress saved successfully!</span>
          </div>
        )}

        <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
          <p className="text-sm text-gray-800">
            Provide the essential details for your will document. These entries will be used directly in your legal will, so ensure the information is accurate and up to date.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-[#5E4B8C]">Declaration</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Make sure you are creating this will voluntarily and understand that confirming both statements below will revoke any previous wills.</p>
          <div className="space-y-4">
            <Controller
              name="soundMind"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="soundMind"
                    checked={!!field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      handleChange();
                    }}
                    className="w-4 h-4 text-[#8B7BB8] bg-gray-100 border-gray-300 rounded focus:ring-[#8B7BB8] focus:ring-2"
                  />
                  <label htmlFor="soundMind" className="text-[#5E4B8C]">I declare I am of sound mind and making this document of my own free will.</label>
                </div>
              )}
            />
            {errors.soundMind && <span className="text-red-500 text-xs">This declaration is required.</span>}
            <Controller
              name="revokePriorWills"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="revokePriorWills"
                    checked={!!field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      handleChange();
                    }}
                    className="w-4 h-4 text-[#8B7BB8] bg-gray-100 border-gray-300 rounded focus:ring-[#8B7BB8] focus:ring-2"
                  />
                  <label htmlFor="revokePriorWills" className="text-[#5E4B8C]">I revoke all prior Wills.</label>
                </div>
              )}
            />
            {errors.revokePriorWills && <span className="text-red-500 text-xs">This declaration is required.</span>}
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-[#5E4B8C]">Signing Details</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Provide when and where you will sign the will. These details help validate the document.</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="signingDate">Date of Signing</label>
                <input id="signingDate" type="date" {...register('signingDate')} required onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="signingPlace">Place of Signing</label>
                <input id="signingPlace" {...register('signingPlace')} required onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]" />
              </div>
            </div>
          </div>
        </section>

                {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={() => handleSave(watch())}
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
            <span>Continue to Will Executors</span>
          </button>
        </div>
      </form>
      </div>
    </WillFormLayout>
  );
};

export default WillDetails;