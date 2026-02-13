import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useWillExecutors } from '../hooks/useWillExecutors';
import { supabase } from '../lib/supabaseClient';
import { saveFormData, loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveWillExecutors } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, FileText, Phone, Calendar, CheckCircle } from 'lucide-react';
import { countryCodes, priorityCountries, getSortedCountryCodes, getOtherNationalities, priorityNationalities } from '../lib/constants';
import { useWillDetails } from '../hooks/useWillDetails';
import { useAutoSaveWillDetails } from '../hooks/useAutoSave';

// Use shared helper instead of local filtering
const sortedCountryCodes = getSortedCountryCodes();
const otherNationalities = getOtherNationalities();

function WillExecutors() {
  const { register, handleSubmit, setValue, reset, formState: { errors }, control, watch } = useForm({ defaultValues: { banyyanFallbackExecutorOptIn: true } });
  const navigate = useNavigate();
  const { setWillExecutors, getWillExecutors } = useWillExecutors();
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [useProfessionalExecutor, setUseProfessionalExecutor] = useState(false);
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Auto-save when navigating between pages
  const formData = watch();
  useAutoSaveWillExecutors(formData, unsaved, setUnsaved);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('willExecutors');
        console.log('Loaded will executors data:', loaded); // Debug log
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('willExecutors') || '{}');
          console.log('Falling back to localStorage for will executors:', loaded);
        }
        if (loaded && typeof loaded === 'object') {
          setWillExecutors(loaded);
          reset(loaded); // Populate form fields
          // Restore professional executor slider state
          if (loaded.useProfessionalExecutor !== undefined) {
            setUseProfessionalExecutor(loaded.useProfessionalExecutor);
          }
        }
      } catch (error) {
        console.error('Error loading will executors:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('willExecutors') || '{}');
          if (localData && typeof localData === 'object') {
            setWillExecutors(localData);
            reset(localData); // Populate form fields
            // Restore professional executor slider state from localStorage
            if (localData.useProfessionalExecutor !== undefined) {
              setUseProfessionalExecutor(localData.useProfessionalExecutor);
            }
            console.log('Loaded will executors from localStorage after error:', localData);
          }
        } catch (localError) {
          console.error('Error loading will executors from localStorage:', localError);
        }
      }
    }
    fetchData();
  }, []);

  // Mark as unsaved on any field change
  const handleChange = () => setUnsaved(true);

  const onSubmit = async (data) => {
    try {
      const dataWithFlags = { ...data, useProfessionalExecutor };
      await saveSectionData('willExecutors', dataWithFlags);
      setWillExecutors(dataWithFlags);
      setUnsaved(false); // Mark as saved
      // Notify sidebar to refresh completion state
      window.dispatchEvent(new Event('willFormSectionSaved'));
      navigate('/dispute-resolver'); // Navigate to the next page
    } catch (e) {
      console.error('Error saving will executors:', e);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const dataWithFlags = { ...data, useProfessionalExecutor };
      await saveSectionData('willExecutors', dataWithFlags);
      setShowSuccessMessage(true);
      // Notify sidebar to refresh completion state (works even if you stay on the page)
      window.dispatchEvent(new Event('willFormSectionSaved'));
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving will executors:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WillFormLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {showSuccessMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Progress saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Outer card like the screenshot */}
          <section className="mb-8 bg-white p-8 rounded-lg shadow-md border border-[#E6E1F4]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#5E4B8C]">Will Executors</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Choose trusted people to manage your estate and carry out your instructions after your death.
              Having a backup executor ensures your will can still be executed if the primary executor is unable to serve.
            </p>

            {/* Professional Executor Service (light purple card with toggle) */}
            <div className="mb-8 bg-[#F8F7FC] p-6 rounded-lg border border-[#E6E1F4]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#5E4B8C]">Professional Executor Service</h3>
                  <p className="text-sm text-gray-600">Let Banyyan Legacies handle your will execution professionally</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useProfessionalExecutor}
                    onChange={(e) => {
                      setUseProfessionalExecutor(e.target.checked);
                      handleChange();
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* Manual Executor Selection - formatted like screenshot */}
            {!useProfessionalExecutor && (
              <>
                {/* Primary Will Executor (rearranged to match screenshot) */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#5E4B8C] mb-4">Primary Will Executor</h3>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    {/* Row 1: Full Name | Relation to You */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executor">Full Name *</label>
                        <input
                          id="executor"
                          {...register('executor')}
                          required
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorRelationship">Relation to You</label>
                        <input
                          id="executorRelationship"
                          {...register('executorRelationship')}
                          placeholder="e.g., Mother, Friend, Lawyer"
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Row 2: Father's Name | Nationality (dropdown) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorFatherName">Father's Name</label>
                        <input
                          id="executorFatherName"
                          {...register('executorFatherName')}
                          placeholder="Enter father's name (optional)"
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorNationality">Nationality</label>
                        <select
                          id="executorNationality"
                          {...register('executorNationality')}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                        >
                          <option value="">Select nationality (optional)</option>
                          {priorityNationalities.map((n) => (
                            <option key={`pri-nat-${n}`} value={n}>{n}</option>
                          ))}
                          <optgroup label="All nationalities">
                            {otherNationalities.map((n) => (
                              <option key={`pri-nat-all-${n}`} value={n}>{n}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Aadhaar Number | PAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorAadhaar">Aadhaar Number</label>
                        <input
                          id="executorAadhaar"
                          {...register('executorAadhaar')}
                          placeholder="12-digit Aadhaar number (optional)"
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorPan">PAN</label>
                        <input
                          id="executorPan"
                          {...register('executorPan')}
                          placeholder="PAN (optional)"
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Row 4: Phone Number | Email Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorPhoneCountryCode">Phone Number *</label>
                        <div className="flex gap-2">
                          <div className="w-2/5">
                            <select
                              id="executorPhoneCountryCode"
                              {...register('executorPhoneCountryCode')}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                            >
                              <option value="">India (+91)</option>
                              {sortedCountryCodes.map((c) => (
                                <option key={c.code + c.name} value={c.code}>
                                  {c.name} ({c.code})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-3/5">
                            <input
                              id="executorPhoneNumber"
                              {...register('executorPhoneNumber')}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorEmail">Email Address</label>
                        <input
                          id="executorEmail"
                          type="email"
                          {...register('executorEmail')}
                          placeholder="name@example.com"
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Row 5: Address (multiline) */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorAddress">Address</label>
                      <textarea
                        id="executorAddress"
                        rows={3}
                        {...register('executorAddress')}
                        placeholder="C4/94 Ground Floor, Safdarjung Development Area"
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                      />
                    </div>

                    {/* Row 6: City | State | Country | Pin Code */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorCity">City</label>
                        <input id="executorCity" {...register('executorCity')} placeholder="Delhi" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorState">State</label>
                        <input id="executorState" {...register('executorState')} placeholder="Delhi" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorCountry">Country</label>
                        <input id="executorCountry" {...register('executorCountry')} placeholder="India" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="executorPinCode">Pin Code</label>
                        <input id="executorPinCode" {...register('executorPinCode')} placeholder="110016" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Backup Will Executor (rearranged to match screenshot) */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#5E4B8C] mb-4">Backup Will Executor</h3>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    {/* Row 1: Full Name | Relation to You */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutor">Full Name *</label>
                        <input id="backupExecutor" {...register('backupExecutor')} required onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorRelationship">Relation to You</label>
                        <input id="backupExecutorRelationship" {...register('backupExecutorRelationship')} placeholder="e.g., Father, Friend" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                    </div>

                    {/* Row 2: Father's Name | Nationality (dropdown) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorFatherName">Father's Name</label>
                        <input
                          id="backupExecutorFatherName"
                          {...register('backupExecutorFatherName')}
                          placeholder="Enter father's name (optional)"
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorNationality">Nationality</label>
                        <select
                          id="backupExecutorNationality"
                          {...register('backupExecutorNationality')}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                        >
                          <option value="">Select nationality (optional)</option>
                          {priorityNationalities.map((n) => (
                            <option key={`bak-nat-${n}`} value={n}>{n}</option>
                          ))}
                          <optgroup label="All nationalities">
                            {otherNationalities.map((n) => (
                              <option key={`bak-nat-all-${n}`} value={n}>{n}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Aadhaar Number | PAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorAadhaar">Aadhaar Number</label>
                        <input id="backupExecutorAadhaar" {...register('backupExecutorAadhaar')} placeholder="12-digit Aadhaar number (optional)" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorPan">PAN</label>
                        <input id="backupExecutorPan" {...register('backupExecutorPan')} placeholder="PAN (optional)" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                    </div>

                    {/* Row 4: Phone Number | Email Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorPhoneCountryCode">Phone Number *</label>
                        <div className="flex gap-2">
                          <div className="w-2/5">
                            <select id="backupExecutorPhoneCountryCode" {...register('backupExecutorPhoneCountryCode')} onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]">
                              <option value="">India (+91)</option>
                              {sortedCountryCodes.map((c) => (
                                <option key={c.code + c.name} value={c.code}>
                                  {c.name} ({c.code})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-3/5">
                            <input id="backupExecutorPhoneNumber" {...register('backupExecutorPhoneNumber')} onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorEmail">Email Address</label>
                        <input id="backupExecutorEmail" type="email" {...register('backupExecutorEmail')} placeholder="name@example.com" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                    </div>

                    {/* Row 5: Address (multiline) */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorAddress">Address</label>
                      <textarea id="backupExecutorAddress" rows={3} {...register('backupExecutorAddress')} placeholder="House/Flat No., Street Name" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                    </div>

                    {/* Row 6: City | State | Country | Pin Code */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorCity">City</label>
                        <input id="backupExecutorCity" {...register('backupExecutorCity')} placeholder="City" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorState">State</label>
                        <input id="backupExecutorState" {...register('backupExecutorState')} placeholder="State" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorCountry">Country</label>
                        <input id="backupExecutorCountry" {...register('backupExecutorCountry')} placeholder="Country" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5E4B8C] mb-1" htmlFor="backupExecutorPinCode">Pin Code</label>
                        <input id="backupExecutorPinCode" {...register('backupExecutorPinCode')} placeholder="Pin Code" onChange={handleChange} className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] placeholder:italic placeholder:text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banyyan fallback executor opt-in */}
                <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <label htmlFor="banyyanFallbackExecutorOptIn" className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="banyyanFallbackExecutorOptIn"
                      {...register('banyyanFallbackExecutorOptIn')}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-[#5E4B8C] border-[#8B7BB8] rounded focus:ring-[#8B7BB8]"
                    />
                    <span className="text-sm text-[#5E4B8C]">
                      If both the primary and backup executors are unable or unwilling to execute this Will for any reason, I authorize Banyyan Legacies to step in and execute the Will.
                    </span>
                  </label>
                </div>

                {/* Important Notes – formatted per screenshot */}
                <div className="mb-6">
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                    <h3 className="text-sm sm:text-base font-semibold text-[#5E4B8C] mb-1 tracking-[0.005em]">
                      Important Notes:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700 leading-6 marker:text-[#8B7BB8]">
                      <li>Your executor should be someone you trust completely and who is capable of handling financial and legal matters</li>
                      <li>Consider choosing someone younger than you who is likely to outlive you</li>
                      <li>It's recommended to discuss this responsibility with your chosen executors beforehand</li>
                      <li>Your backup executor will only serve if your primary executor cannot or will not serve</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button type="button" onClick={() => handleSave(watch())} disabled={loading} className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Save Progress</span>
            </button>
            <button type="submit" disabled={loading} className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BAD] hover:to-[#381F64] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              <span>Continue to Dispute Resolver</span>
            </button>
          </div>
        </form>
      </div>
    </WillFormLayout>
  );
};

export default WillExecutors;