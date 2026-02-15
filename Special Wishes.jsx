import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveSpecialWishes } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, MessageSquare, Plus, Trash2, CheckCircle, Heart } from 'lucide-react';

const funeralOptions = [
  { value: '', label: 'No preference' },
  { value: 'cremation', label: 'Cremation' },
  { value: 'burial', label: 'Burial' },
  { value: 'science', label: 'Donate body to science' },
];

const SpecialWishes = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [funeralWish, setFuneralWish] = useState('');
  const [messages, setMessages] = useState([{ id: crypto.randomUUID(), name: '', relation: '', message: '' }]);
  const [otherArrangements, setOtherArrangements] = useState('');
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Auto-save when navigating between pages
  const specialWishesData = { funeralWish, messages, otherArrangements };
  console.log('Current special wishes data:', specialWishesData); // Debug log
  console.log('Current unsaved state:', unsaved); // Debug log
  useAutoSaveSpecialWishes(specialWishesData, unsaved, setUnsaved);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('specialWishes');
        console.log('Loaded special wishes data from Supabase:', loaded); // Debug log
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('specialWishes') || '{}');
          console.log('Loaded special wishes data from localStorage:', loaded); // Debug log
        }
        if (loaded && typeof loaded === 'object') {
          setFuneralWish(loaded.funeralWish || '');
          // Ensure messages have IDs
          const loadedMessages = loaded.messages || [{ name: '', relation: '', message: '' }];
          const messagesWithIds = loadedMessages.map(msg => ({
            ...msg,
            id: msg.id || crypto.randomUUID()
          }));
          setMessages(messagesWithIds);
          setOtherArrangements(loaded.otherArrangements || '');
        }
      } catch (error) {
        console.error('Error loading special wishes:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('specialWishes') || '{}');
          if (localData && typeof localData === 'object') {
            setFuneralWish(localData.funeralWish || '');
            // Ensure messages have IDs
            const localMessages = localData.messages || [{ name: '', relation: '', message: '' }];
            const messagesWithIds = localMessages.map(msg => ({
              ...msg,
              id: msg.id || crypto.randomUUID()
            }));
            setMessages(messagesWithIds);
            setOtherArrangements(localData.otherArrangements || '');
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      }
    }
    
    fetchData();
  }, []);





  const handleAddMessage = () => {
    setMessages([...messages, { id: crypto.randomUUID(), name: '', relation: '', message: '' }]);
  };

  const handleRemoveMessage = (idx) => {
    setMessages(msgs => msgs.filter((_, i) => i !== idx));
  };

  const handleMessageChange = (idx, field, value) => {
    setMessages(msgs => msgs.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleNext = async () => {
    console.log('handleNext called'); // Debug log
    setLoading(true);
    try {
      // Add IDs to messages if they don't have them
      const messagesWithIds = messages.map(msg => ({
        ...msg,
        id: msg.id || crypto.randomUUID()
      }));
      
      const dataToSave = { funeralWish, messages: messagesWithIds, otherArrangements };
      console.log('Saving special wishes data before navigation:', dataToSave); // Debug log
      await saveSectionData('specialWishes', dataToSave);
      console.log('Special wishes saved before navigation'); // Debug log
      setUnsaved(false);
      navigate('/loan-repayments');
    } catch (error) {
      console.error('Error saving before navigation:', error);
      // Still navigate even if save fails
      navigate('/loan-repayments');
    } finally {
      setLoading(false);
    }
  };

  // Mark as unsaved on any field change
  const handleChange = () => {
    console.log('handleChange called, setting unsaved to true'); // Debug log
    setUnsaved(true);
  };

  const handleSave = async () => {
    console.log('handleSave called'); // Debug log
    setLoading(true);
    try {
      // Add IDs to messages if they don't have them
      const messagesWithIds = messages.map(msg => ({
        ...msg,
        id: msg.id || crypto.randomUUID()
      }));
      
      const dataToSave = { funeralWish, messages: messagesWithIds, otherArrangements };
      console.log('Saving special wishes data:', dataToSave); // Debug log
      await saveSectionData('specialWishes', dataToSave);
      console.log('Special wishes saved successfully'); // Debug log
      setUnsaved(false); // Mark as saved
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving your special wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WillFormLayout 
      title="Special Wishes" 
      description="Personal messages"
    >
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Progress saved successfully!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Funeral Options
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Choose what happens to your body (disposition): cremation, burial, or donation to science.
          </p>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            value={funeralWish}
            onChange={e => {
              setFuneralWish(e.target.value);
              handleChange();
            }}
          >
            {funeralOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Messages to Family
          </label>
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={msg.name}
                  onChange={e => {
                    handleMessageChange(idx, 'name', e.target.value);
                    handleChange();
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="Relation"
                  value={msg.relation}
                  onChange={e => {
                    handleMessageChange(idx, 'relation', e.target.value);
                    handleChange();
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <textarea
                placeholder="Message"
                value={msg.message}
                onChange={e => {
                  handleMessageChange(idx, 'message', e.target.value);
                  handleChange();
                }}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => handleRemoveMessage(idx)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMessage}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Another Message
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Any Other Arrangements
          </label>
          <textarea
            placeholder="Enter any other special arrangements or wishes here..."
            value={otherArrangements}
            onChange={e => {
              setOtherArrangements(e.target.value);
              handleChange();
            }}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

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
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BAD] hover:to-[#381F64] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            <span>Continue to Loan Repayments</span>
          </button>
        </div>
      </div>
    </WillFormLayout>
  );
};

export default SpecialWishes;