import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadSectionData, saveSectionData } from '../lib/supabaseForms';
import { UnsavedChangesContext } from '../App';
import { useAutoSaveLoanRepayments } from '../hooks/useAutoSave';
import WillFormLayout from '../components/WillFormLayout';
import { Save, ArrowRight, CreditCard, Plus, Trash2, CheckCircle } from 'lucide-react';

function LoanRepayments() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assetBankAccounts, setAssetBankAccounts] = useState([]);
  const { unsaved, setUnsaved } = useContext(UnsavedChangesContext);

  // Auto-save when navigating between pages
  useAutoSaveLoanRepayments(bankAccounts, unsaved, setUnsaved);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let loaded = await loadSectionData('loanRepaymentAccounts');
        console.log('Loaded loan repayment accounts data:', loaded); // Debug log
        if (!loaded) {
          // fallback to localStorage
          loaded = JSON.parse(localStorage.getItem('loanRepaymentAccounts') || '[]');
          console.log('Falling back to localStorage for loan repayment accounts:', loaded);
        }
        if (loaded && Array.isArray(loaded)) {
          setBankAccounts(loaded);
        }
      } catch (error) {
        console.error('Error loading loan repayment accounts:', error);
        // fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('loanRepaymentAccounts') || '[]');
          if (localData && Array.isArray(localData)) {
            setBankAccounts(localData);
            console.log('Loaded loan repayment accounts from localStorage after error:', localData);
          }
        } catch (localError) {
          console.error('Error loading loan repayment accounts from localStorage:', localError);
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchAssets() {
      const assets = await loadSectionData('assets') || [];
      const banks = assets.filter(a => a.type === 'Bank').map(a => a.details);
      setAssetBankAccounts(banks);
    }
    fetchAssets();
  }, []);



  const addAccount = () => {
    setBankAccounts([...bankAccounts, { bankName: '', accountNumber: '', accountType: '' }]);
  };

  const removeAccount = (index) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== index));
  };

  // Mark as unsaved on any field change
  const handleChange = (index, field, value) => {
    setUnsaved(true);
    const newAccounts = [...bankAccounts];
    newAccounts[index][field] = value;
    setBankAccounts(newAccounts);
  };

  const handleAccountSelect = (index, value) => {
    setUnsaved(true);
    if (value === 'new') {
      handleChange(index, 'bankName', '');
      handleChange(index, 'accountNumber', '');
      handleChange(index, 'accountType', '');
      setBankAccounts(prev => prev.map((acc, i) => i === index ? { ...acc, fromAssets: false } : acc));
    } else {
      const selected = assetBankAccounts[value];
      setBankAccounts(prev => prev.map((acc, i) => i === index ? { ...selected, fromAssets: true } : acc));
    }
  };

  const handleSubmit = async () => {
    try {
      await saveSectionData('loanRepaymentAccounts', bankAccounts);
      setUnsaved(false); // Mark as saved
      navigate('/organ-donation');
    } catch (e) {
      console.error('Error submitting your form:', e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSectionData('loanRepaymentAccounts', bankAccounts);
      setUnsaved(false); // Mark as saved
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e) {
      console.error('Error saving your loan repayment accounts:', e);
    } finally {
      setLoading(false);
    }
  };

  // Safely display only the last 4 digits of an account number
  const maskLast4 = React.useCallback((val) => {
    if (!val) return '';
    const digits = String(val).replace(/\D/g, '');
    const last4 = digits.slice(-4);
    return last4 ? `•••• ${last4}` : '';
  }, []);

  return (
    <WillFormLayout 
      title="Loan Repayments" 
      description="Outstanding debts"
    >
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Progress saved successfully!
        </div>
      )}

      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm text-gray-800 rounded-lg">
        <p className="text-sm">
          Add details of loans and outstanding debts you wish to account for. This helps ensure liabilities are addressed properly in your will.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {bankAccounts.map((account, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Account {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeAccount(index)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Account Source
                </label>
                <select
                  value={account.fromAssets ? assetBankAccounts.findIndex(b => b.accountNumber === account.accountNumber && b.bankName === account.bankName) : 'new'}
                  onChange={(e) => handleAccountSelect(index, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {assetBankAccounts.map((b, i) => (
                    <option key={`${b.bankName}-${i}`} value={i.toString()}>
                      {b.bankName} ({maskLast4(b.accountNumber)})
                    </option>
                  ))}
                  <option value="new">Add New Bank Account</option>
                </select>
              </div>

              {account.fromAssets ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Bank Name:</span>
                      <span className="ml-2 text-gray-600">{account.bankName}</span>
                    </div>
                    {/* Branch / IFSC display removed */}
                    <div>
                      <span className="font-medium text-gray-700">Account Number:</span>
                      <span className="ml-2 text-gray-600">{maskLast4(account.accountNumber) || '—'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Account Type:</span>
                      <span className="ml-2 text-gray-600">{account.accountType}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`bankName-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      id={`bankName-${index}`}
                      value={account.bankName}
                      onChange={(e) => handleChange(index, 'bankName', e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {/* Branch / IFSC input removed */}
                  <div>
                    <label htmlFor={`accountNumber-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number (Optional)
                    </label>
                    <input
                      type="text"
                      id={`accountNumber-${index}`}
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Optional - Please insert last 4 digits only as an identifier of the account"
                      value={account.accountNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleChange(index, 'accountNumber', val);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor={`accountType-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type (Optional)
                    </label>
                    <input
                      type="text"
                      id={`accountType-${index}`}
                      value={account.accountType}
                      onChange={(e) => handleChange(index, 'accountType', e.target.value)}
                      placeholder="e.g., Savings, Current"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:italic placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-6">
          <button
            type="button"
            onClick={addAccount}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Account
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Save className="h-5 w-5" />
            Save Progress
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BAD] hover:to-[#381F64] transition-all duration-200 font-medium disabled:opacity-50 shadow-lg"
          >
            Continue to Organ Donation
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </WillFormLayout>
  );
};

export default LoanRepayments;
