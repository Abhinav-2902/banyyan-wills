import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { saveFormData, loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSave } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, FileText, Phone, CheckCircle, Gavel } from 'lucide-react';

// top of file imports
import { getSortedCountryCodes, getOtherNationalities, priorityNationalities } from '../lib/constants';

const DisputeResolver = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset, getValues } = useForm();
  const [disputeResolverDetails, setDisputeResolverDetails] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUnsaved } = useContext(UnsavedChangesContext);

  // Watch form data for auto-save
  const watchedData = watch();
  
  // Auto-save functionality
  useAutoSave('disputeResolver', watchedData, true, setUnsaved);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loaded = await loadSectionData('disputeResolver');
        if (loaded && typeof loaded === 'object') {
          setDisputeResolverDetails(loaded);
          reset(loaded); // Populate form fields
          console.log('Loaded dispute resolver details:', loaded);
        }
      } catch (error) {
        console.error('Error loading dispute resolver details:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('disputeResolver') || '{}');
          if (localData && typeof localData === 'object') {
            setDisputeResolverDetails(localData);
            reset(localData); // Populate form fields
            console.log('Loaded dispute resolver details from localStorage after error:', localData);
          }
        } catch (localError) {
          console.error('Error loading dispute resolver details from localStorage:', localError);
        }
      }
    }
    fetchData();
  }, []);

  // Mark as unsaved on any field change
  const handleChange = () => setUnsaved(true);

  const onSubmit = async (data) => {
    try {
      await saveSectionData('disputeResolver', data);
      setDisputeResolverDetails(data);
      setUnsaved(false); // Mark as saved
      navigate('/witness-details');
    } catch (e) {
      console.error('Error saving dispute resolver details:', e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = getValues();
      await saveSectionData('disputeResolver', formData);
      localStorage.setItem('disputeResolver', JSON.stringify(formData));
      window.dispatchEvent(new CustomEvent('willFormSectionSaved', { detail: { sectionKey: 'disputeResolver' } }));
      setDisputeResolverDetails(formData);
      setUnsaved(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving dispute resolver details:', e);
      // Fallback to localStorage so user doesn’t lose progress
      try {
        const formData = getValues();
        localStorage.setItem('disputeResolver', JSON.stringify(formData));
        window.dispatchEvent(new CustomEvent('willFormSectionSaved', { detail: { sectionKey: 'disputeResolver' } }));
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (localErr) {
        console.error('Also failed saving to localStorage:', localErr);
        alert('Could not save progress. Please check your connection or login and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <WillFormLayout 
      title="Dispute Resolver" 
      description="Designate a trusted person to resolve any disputes regarding your will."
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
            <strong>Optional but Recommended:</strong> Designate a trusted person to make final decisions in case of any disputes regarding your assets or will. This person should be impartial and respected by your beneficiaries.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dispute Resolver Section */}
          <section className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#5E4B8C]">Dispute Resolver Details</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">Provide details of the person who will resolve disputes. All fields are optional.</p>
            
            <div className="space-y-6">
              {/* Name and Relation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolver">Name of Dispute Resolver</label>
                  <input 
                    id="disputeResolver" 
                    {...register('disputeResolver')} 
                    placeholder="Enter full name (optional)" 
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverRelation">Relation to You</label>
                  <input 
                    id="disputeResolverRelation" 
                    {...register('disputeResolverRelation')} 
                    placeholder="e.g., father, brother, friend (optional)" 
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              {/* Row 1: Father's Name (left) | Nationality (right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverFather">Father's Name</label>
                  <input 
                    id="disputeResolverFather"
                    {...register('disputeResolverFather')}
                    placeholder="Father's full name (optional)"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverNationality">Nationality</label>
                  <select 
                    id="disputeResolverNationality"
                    {...register('disputeResolverNationality')}
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                    onChange={handleChange}
                  >
                    <option value="">Select nationality (optional)</option>
                    <optgroup label="Top">
                      {priorityNationalities.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </optgroup>
                    <optgroup label="All nationalities">
                      {otherNationalities.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Row 2: Aadhaar (left) | PAN (right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverAadhaar">Aadhaar Number</label>
                  <input 
                    id="disputeResolverAadhaar"
                    {...register('disputeResolverAadhaar')}
                    placeholder="12-digit Aadhaar number (optional)"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverPan">PAN</label>
                  <input
                    id="disputeResolverPan"
                    {...register('disputeResolverPan')}
                    placeholder="PAN (optional)"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Phone (country code + number) */}
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-3">
                    <div className="w-2/5">
                      <select
                        id="disputeResolverPhoneCountryCode"
                        {...register('disputeResolverPhoneCountryCode')}
                        className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                        onChange={handleChange}
                      >
                        <option value="">Code</option>
                        {sortedCountryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name} ({country.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-3/5">
                      <input
                        id="disputeResolverPhoneNumber"
                        type="tel"
                        {...register('disputeResolverPhoneNumber')}
                        placeholder="Enter phone number (optional)"
                        className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Email */}
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverEmail">
                    Email Address
                  </label>
                  <input
                    id="disputeResolverEmail"
                    type="email"
                    {...register('disputeResolverEmail')}
                    placeholder="Email address (optional)"
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverAddress">Address</label>
                <textarea 
                  id="disputeResolverAddress" 
                  {...register('disputeResolverAddress')} 
                  placeholder="Full address (optional)" 
                  rows={3}
                  className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" 
                  onChange={handleChange} 
                />
              </div>

              {/* City, State, Country, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverCity">City</label>
                  <input 
                    id="disputeResolverCity" 
                    {...register('disputeResolverCity')} 
                    placeholder="City (optional)" 
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverState">State</label>
                  <input 
                    id="disputeResolverState" 
                    {...register('disputeResolverState')} 
                    placeholder="State (optional)" 
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverCountry">Country</label>
                  <input 
                    id="disputeResolverCountry" 
                    {...register('disputeResolverCountry')} 
                    placeholder="Country (optional)" 
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="disputeResolverZipCode">Zip Code</label>
                  <input 
                    id="disputeResolverZipCode" 
                    {...register('disputeResolverZipCode')} 
                    placeholder="Zip code (optional)" 
                    className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions */}
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
              <span>Continue to Witness Details</span>
            </button>
          </div>
        </form>
      </div>
    </WillFormLayout>
  );
};

export default DisputeResolver;

// Replace local sorted lists with shared helpers
const sortedCountryCodes = getSortedCountryCodes();
const otherNationalities = getOtherNationalities();